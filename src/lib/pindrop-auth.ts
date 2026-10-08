import { createHmac, timingSafeEqual } from "crypto";

/**
 * Pin Drop session tokens.
 *
 * Technicians still type the same passcode. On success the server returns a
 * signed, expiring token that the app stores and attaches to later requests.
 *
 * Enforcement is OPT-IN: protected routes only reject requests when BOTH
 * PINDROP_SESSION_SECRET is set AND PINDROP_AUTH_ENFORCED === "true".
 * Until then behavior is identical to before.
 */

const TOKEN_TTL_MS = 90 * 24 * 60 * 60 * 1000; // 90 days

function secret(): string {
  return process.env.PINDROP_SESSION_SECRET || "";
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

/** Returns a signed token, or null if no secret is configured. */
export function issueToken(): { token: string; expiresAt: number } | null {
  if (!secret()) return null;
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = b64url(JSON.stringify({ c: clientIdFromEnv(), exp: expiresAt }));
  return { token: `${payload}.${sign(payload)}`, expiresAt };
}

export function verifyToken(token: string | null | undefined): boolean {
  if (!token || !secret()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return data.c === clientIdFromEnv() && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

/**
 * Returns null if the request may proceed, or a 401 Response if it must be rejected.
 * Always allows the request while enforcement is disabled.
 */
export function requireSession(request: Request): Response | null {
  if (!authEnforced()) return null;
  const header = request.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (verifyToken(token)) return null;
  return Response.json({ error: "Session expired. Please sign in again." }, { status: 401 });
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
