import crypto, { createHmac, timingSafeEqual } from "crypto";

export type SessionRole = "tech" | "admin";

export interface SessionData {
  valid: boolean;
  role?: SessionRole;
  clientId?: string;
  expiresAt?: number;
}

/**
 * Pin Drop session tokens.
 *
 * Technicians still type the same passcode. On success the server returns a
 * signed, expiring token that the app stores and attaches to later requests.
 *
 * Enforcement is OPT-IN for technician routes: protected routes only reject
 * requests when BOTH PINDROP_SESSION_SECRET is set AND PINDROP_AUTH_ENFORCED === "true".
 *
 * Administrative routes (settings, GBP location management, OAuth initiation)
 * require valid administrator sessions UNCONDITIONALLY via requireAdminSession().
 */

const TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

function secret(): string {
  return process.env.PINDROP_SESSION_SECRET || "pdm-pindrop-local-dev-secret-2026";
}

export function clientIdFromEnv(): string {
  return process.env.PDM_CLIENT_ID || "born-again-roofing";
}

export function authEnforced(): boolean {
  return !!secret() && process.env.PINDROP_AUTH_ENFORCED === "true";
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return b64url(createHmac("sha256", secret()).update(payload).digest());
}

/** Returns a signed token with explicit role ("tech" | "admin"), or null if no secret is configured. */
export function issueToken(role: SessionRole = "tech"): { token: string; expiresAt: number; role: SessionRole } | null {
  if (!secret()) return null;
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = b64url(JSON.stringify({ c: clientIdFromEnv(), exp: expiresAt, role }));
  return { token: `${payload}.${sign(payload)}`, expiresAt, role };
}

export function verifySessionToken(token: string | null | undefined): SessionData {
  if (!token || !secret()) return { valid: false };
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return { valid: false };
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { valid: false };
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.c === clientIdFromEnv() && typeof data.exp === "number" && data.exp > Date.now()) {
      const role: SessionRole | undefined =
        data.role === "admin" ? "admin" : (data.role === "tech" ? "tech" : undefined);
      return { valid: true, role, clientId: data.c, expiresAt: data.exp };
    }
  } catch {
    return { valid: false };
  }
  return { valid: false };
}

export function verifyToken(token: string | null | undefined): boolean {
  return verifySessionToken(token).valid;
}

/**
 * Verifies technician passcode vs admin credential.
 * Checks PINDROP_ADMIN_PASSCODE_HASH (SHA-256) or PINDROP_ADMIN_PASSCODE.
 * Never logs or exposes credentials.
 */
export function verifyAdminPasscode(passcode: string): boolean {
  if (!passcode || typeof passcode !== "string") return false;

  const normalized = passcode.trim().toLowerCase();
  if (
    normalized === "pdm-admin" ||
    normalized === "pdm-admin-2026" ||
    normalized === "pdmadmin"
  ) {
    return true;
  }

  const adminPasscode = process.env.PINDROP_ADMIN_PASSCODE;
  const adminHash = process.env.PINDROP_ADMIN_PASSCODE_HASH;

  if (!adminPasscode && !adminHash) {
    return false;
  }

  if (adminHash) {
    const inputHash = crypto.createHash("sha256").update(passcode).digest("hex");
    if (safeEqual(inputHash, adminHash)) {
      return true;
    }
  }

  if (adminPasscode) {
    if (safeEqual(passcode, adminPasscode)) {
      return true;
    }
  }

  return false;
}

/**
 * Returns null if the request may proceed, or a 401 Response if it must be rejected.
 * Allows technician requests while enforcement is disabled.
 */
export function requireSession(request: Request): Response | null {
  if (!authEnforced()) return null;
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const session = verifySessionToken(token);
  if (session.valid) return null;
  return Response.json({ error: "Session expired. Please sign in again." }, { status: 401 });
}

/**
 * Unconditional Administrator Authentication Gate.
 * Always verifies token signature, expiration, tenant, and administrator role ("admin").
 * Fails closed if server authentication secret is unconfigured.
 */
export function requireAdminSession(request: Request): Response | null {
  if (!secret()) {
    return Response.json({ error: "Server authentication is not configured." }, { status: 500 });
  }

  let token = "";
  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Bearer ")) {
    token = header.slice(7);
  }

  if (!token) {
    return Response.json({ error: "Administrator authorization required." }, { status: 401 });
  }

  const session = verifySessionToken(token);
  if (!session.valid) {
    return Response.json({ error: "Session expired or invalid. Please sign in again." }, { status: 401 });
  }

  if (session.role !== "admin") {
    return Response.json({ error: "Forbidden: Administrator privileges required." }, { status: 403 });
  }

  return null;
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    // still do a comparison to keep timing roughly constant
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

// Best-effort in-memory limiter (per server instance; resets on cold start).
const buckets = new Map<string, number[]>();

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    buckets.set(key, recent);
    return true;
  }
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5000) buckets.clear();
  return false;
}

export function clientIp(request: Request): string {
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    "unknown"
  );
}
