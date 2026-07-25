import { NextRequest, NextResponse } from "next/server";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";
const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;

// Helper to mask API key for security (only show first 4 and last 4 characters)
function maskApiKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "****";
  return `${key.slice(0, 4)}****${key.slice(-4)}`;
}

// 1. GET Settings & Social Connection Status
export async function GET() {
  try {
    let transpondApiKey = "";
    let transpondGroupId = "";
    let isFromEnv = false;

    // A. Read from Firestore
    const res = await fetch(firestoreUrl);
    if (res.ok) {
      const data = await res.json();
      const fields = data.fields || {};
      
      const parseVal = (val: any) => val?.stringValue || "";
      transpondApiKey = parseVal(fields.transpondApiKey);
      transpondGroupId = parseVal(fields.transpondGroupId);
    }

    // B. Fallback to process.env if blank
    if (!transpondApiKey) {
      transpondApiKey = process.env.TRANSPOND_API_KEY || "";
      transpondGroupId = process.env.TRANSPOND_GROUP_ID || "";
      if (transpondApiKey) {
        isFromEnv = true;
      }
    }

    if (!transpondApiKey) {
      return NextResponse.json({
        configured: false,
        transpondGroupId: "",
        socialConnected: false,
        connectedChannels: []
      });
    }

    // C. Check social connection status via Transpond API
    let socialConnected = false;
    let connectedChannels: any[] = [];
    try {
      const socialRes = await fetch("https://api.transpond.io/social", {
        headers: {
          Authorization: `Bearer ${transpondApiKey}`
        }
      });
      if (socialRes.ok) {
        const channels = await socialRes.json();
        if (Array.isArray(channels) && channels.length > 0) {
          socialConnected = true;
          connectedChannels = channels;
        }
      }
    } catch (socialErr) {
      console.error("[Transpond settings API] Failed to check social channels:", socialErr);
    }

    return NextResponse.json({
      configured: true,
      transpondGroupId,
      transpondApiKey: isFromEnv ? "env_configured" : maskApiKey(transpondApiKey),
      socialConnected,
      connectedChannels
    });

  } catch (error: any) {
    console.error("[Transpond settings API] GET failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST Save Settings
export async function POST(request: NextRequest) {
  try {
    const { apiKey, groupId } = await request.json();

    if (!apiKey || !groupId) {
      return NextResponse.json({ error: "Both API Key and Group ID are required." }, { status: 400 });
    }

    // Read current settings document (so we don't wipe out other fields like Google tokens)
    const getRes = await fetch(firestoreUrl);
    const existingDoc = getRes.ok ? await getRes.json() : { fields: {} };
    const fields = existingDoc.fields || {};

    // Build patch payload
    const firestoreFields: any = {
      fields: {
        ...fields,
        clientId: { stringValue: clientId },
        transpondApiKey: { stringValue: apiKey },
        transpondGroupId: { stringValue: groupId }
      }
    };

    const updateParams = new URLSearchParams();
    updateParams.append("updateMask.fieldPaths", "clientId");
    updateParams.append("updateMask.fieldPaths", "transpondApiKey");
    updateParams.append("updateMask.fieldPaths", "transpondGroupId");

    const patchRes = await fetch(`${firestoreUrl}?${updateParams.toString()}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(firestoreFields)
    });

    if (!patchRes.ok) {
      const errText = await patchRes.text();
      console.error("[Transpond settings API] Failed to patch Firestore settings:", errText);
      return NextResponse.json({ error: "Failed to write to settings database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Transpond settings saved successfully!" });

  } catch (error: any) {
    console.error("[Transpond settings API] POST failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
