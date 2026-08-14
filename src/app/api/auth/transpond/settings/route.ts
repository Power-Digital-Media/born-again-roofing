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
    let technicians: string[] = [];
    let rooferPasscodeConfigured = false;
    let companyName = "";
    let googleReviewUrl = "";
    let googleConnected = false;

    // A. Read from Firestore
    const res = await fetch(firestoreUrl);
    if (res.ok) {
      const data = await res.json();
      const fields = data.fields || {};
      
      const parseVal = (val: any) => val?.stringValue || "";
      const parseArrayVal = (val: any): string[] => {
        if (!val?.arrayValue?.values) return [];
        return val.arrayValue.values.map((v: any) => v.stringValue || "");
      };

      transpondApiKey = parseVal(fields.transpondApiKey);
      transpondGroupId = parseVal(fields.transpondGroupId);
      technicians = parseArrayVal(fields.technicians);
      companyName = parseVal(fields.companyName) || (clientId === "born-again-roofing" ? "Born Again Roofing" : clientId);
      rooferPasscodeConfigured = !!parseVal(fields.rooferPasscode);
      googleReviewUrl = parseVal(fields.googleReviewUrl);
      googleConnected = !!parseVal(fields.googleRefreshToken);
    }

    // B. Fallback to process.env for Transpond keys if blank
    if (!transpondApiKey) {
      transpondApiKey = process.env.TRANSPOND_API_KEY || "";
      transpondGroupId = process.env.TRANSPOND_GROUP_ID || "";
      if (transpondApiKey) {
        isFromEnv = true;
      }
    }

    // C. Fallback to default review URL for Born Again Roofing
    if (!googleReviewUrl && clientId === "born-again-roofing") {
      googleReviewUrl = "https://www.google.com/search?q=Born+Again+Roofing+and+Remodeling#lrd=0x86282f761bf6d3d3:0x649d334d1a5ca7d3,3,,";
    }

    // D. Fallback to default technicians if Firestore list is empty
    if (technicians.length === 0) {
      if (clientId === "born-again-roofing") {
        technicians = [
          "Chris Smith",
          "Damien Johnston",
          "Christopher Heard",
          "Eddie Buchanan",
          "Robert Christoforo",
          "Daniel Lickness",
          "David Dilmore"
        ];
      } else {
        technicians = [];
      }
    }

    // E. Check social connection status via Transpond API
    let socialConnected = false;
    let connectedChannels: any[] = [];
    if (transpondApiKey) {
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
    }

    return NextResponse.json({
      configured: !!transpondApiKey,
      transpondGroupId,
      transpondApiKey: transpondApiKey ? (isFromEnv ? "env_configured" : maskApiKey(transpondApiKey)) : "",
      socialConnected,
      connectedChannels,
      technicians,
      rooferPasscodeConfigured,
      companyName,
      googleReviewUrl,
      googleConnected
    });

  } catch (error: any) {
    console.error("[Transpond settings API] GET failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST Save Settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, groupId, technicians, rooferPasscode, companyName, googleReviewUrl } = body;

    // Read current settings document (so we don't wipe out other fields like Google tokens)
    const getRes = await fetch(firestoreUrl);
    const existingDoc = getRes.ok ? await getRes.json() : { fields: {} };
    const fields = existingDoc.fields || {};

    const updatedFields: any = { ...fields };
    const updateParams = new URLSearchParams();

    // Always keep clientId updated
    updatedFields.clientId = { stringValue: clientId };
    updateParams.append("updateMask.fieldPaths", "clientId");

    if (apiKey !== undefined && groupId !== undefined) {
      if (!apiKey || !groupId) {
        return NextResponse.json({ error: "Both API Key and Group ID are required." }, { status: 400 });
      }
      updatedFields.transpondApiKey = { stringValue: apiKey };
      updatedFields.transpondGroupId = { stringValue: groupId };
      updateParams.append("updateMask.fieldPaths", "transpondApiKey");
      updateParams.append("updateMask.fieldPaths", "transpondGroupId");
    }

    if (technicians !== undefined) {
      if (!Array.isArray(technicians)) {
        return NextResponse.json({ error: "Technicians must be an array of strings." }, { status: 400 });
      }
      updatedFields.technicians = {
        arrayValue: {
          values: technicians.map((tech: string) => ({ stringValue: tech }))
        }
      };
      updateParams.append("updateMask.fieldPaths", "technicians");
    }

    if (rooferPasscode !== undefined) {
      updatedFields.rooferPasscode = { stringValue: rooferPasscode };
      updateParams.append("updateMask.fieldPaths", "rooferPasscode");
    }

    if (companyName !== undefined) {
      updatedFields.companyName = { stringValue: companyName };
      updateParams.append("updateMask.fieldPaths", "companyName");
    }

    if (googleReviewUrl !== undefined) {
      updatedFields.googleReviewUrl = { stringValue: googleReviewUrl };
      updateParams.append("updateMask.fieldPaths", "googleReviewUrl");
    }

    const firestoreFields = { fields: updatedFields };

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

    return NextResponse.json({ success: true, message: "Settings saved successfully!" });

  } catch (error: any) {
    console.error("[Transpond settings API] POST failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
