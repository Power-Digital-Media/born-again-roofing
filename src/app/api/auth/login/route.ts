import { NextRequest, NextResponse } from "next/server";
import { issueToken, safeEqual, rateLimited, clientIp } from "@/lib/pindrop-auth";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";

export async function POST(req: NextRequest) {
  try {
    // Brute-force protection (best-effort, per server instance).
    if (rateLimited(`login:${clientIp(req)}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many attempts. Please wait a few minutes and try again." },
        { status: 429 }
      );
    }

    const { passcode } = await req.json();
    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json({ error: "Passcode is required" }, { status: 400 });
    }

    let correctPasscode = "";

    // 1. Attempt to fetch from Firestore settings using authenticated helper
    const { getClientSettings, getStringValue } = await import("@/lib/firestore-admin");
    const res = await getClientSettings(clientId, firebaseProjectId);
    if (res.ok) {
      correctPasscode = getStringValue(res.fields.rooferPasscode);
    }

    // 2. Fallback to env variable if not set in database.
    //    PORTAL_PASSCODE is the server-only replacement for NEXT_PUBLIC_PORTAL_PASSCODE.
    //    Set PINDROP_DISABLE_DEFAULT_PASSCODE=true to remove the legacy hardcoded fallback
    //    (only after the passcode is confirmed in Firestore or PORTAL_PASSCODE).
    if (!correctPasscode) {
      const legacyDefault = process.env.PINDROP_DISABLE_DEFAULT_PASSCODE === "true" ? "" : "BornAgain2026";
      correctPasscode =
        process.env.PORTAL_PASSCODE || process.env.NEXT_PUBLIC_PORTAL_PASSCODE || legacyDefault;
    }

    // 1. Check if the submitted passcode is the administrator credential
    const { verifyAdminPasscode } = await import("@/lib/pindrop-auth");
    if (verifyAdminPasscode(passcode)) {
      const issued = issueToken("admin");
      return NextResponse.json({
        success: true,
        role: "admin",
        ...(issued ? { token: issued.token, expiresAt: issued.expiresAt } : {}),
      });
    }

    // 2. Check if the submitted passcode is the technician credential
    if (!correctPasscode) {
      return NextResponse.json({ error: "Portal passcode is not configured" }, { status: 500 });
    }

    if (safeEqual(passcode, correctPasscode)) {
      const issued = issueToken("tech");
      return NextResponse.json({
        success: true,
        role: "tech",
        ...(issued ? { token: issued.token, expiresAt: issued.expiresAt } : {}),
      });
    }

    return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
  } catch (err) {
    console.error("Login verification error:", err);
    return NextResponse.json({ error: "Server authentication error" }, { status: 500 });
  }
}
