import { NextRequest, NextResponse } from "next/server";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";
const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;

export async function POST(req: NextRequest) {
  try {
    const { passcode } = await req.json();
    if (!passcode) {
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

    // 2. Fallback to env variable if not set in database
    if (!correctPasscode) {
      correctPasscode = process.env.NEXT_PUBLIC_PORTAL_PASSCODE || "BornAgain2026";
    }

    if (passcode === correctPasscode) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
  } catch (err) {
    console.error("Login verification error:", err);
    return NextResponse.json({ error: "Server authentication error" }, { status: 500 });
  }
}
