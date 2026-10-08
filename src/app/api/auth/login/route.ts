import { NextRequest, NextResponse } from "next/server";
import { issueToken, safeEqual, rateLimited, clientIp } from "@/lib/pindrop-auth";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";
const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;

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

    // 1. Attempt to fetch from Firestore settings
    const res = await fetch(firestoreUrl);
    if (res.ok) {
      const data = await res.json();
      const fields = data.fields || {};
      correctPasscode = fields.rooferPasscode?.stringValue || "";
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

    if (!correctPasscode) {
      return NextResponse.json({ error: "Portal passcode is not configured" }, { status: 500 });
    }

    if (safeEqual(passcode, correctPasscode)) {
      const issued = issueToken();
      return NextResponse.json({
        success: true,
        ...(issued ? { token: issued.token, expiresAt: issued.expiresAt } : {}),
      });
    }

    return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
  } catch (err) {
    console.error("Login verification error:", err);
    return NextResponse.json({ error: "Server authentication error" }, { status: 500 });
  }
}
