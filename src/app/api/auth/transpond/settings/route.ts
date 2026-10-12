import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/pindrop-auth";

import { getClientSettings, patchClientSettings, type FirestoreFields } from "@/lib/firestore-admin";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";

// Helper to mask API key for security (only show first 4 and last 4 characters)
function maskApiKey(key: string): string {
  if (!key) return "";
  if (key.length <= 8) return "****";
  return `${key.slice(0, 4)}****${key.slice(-4)}`;
}

// 1. GET Settings & Social Connection Status
export async function GET(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;
  try {
    let transpondApiKey = "";
    let transpondGroupId = "";
    let isFromEnv = false;
    let technicians: string[] = [];
    let rooferPasscodeConfigured = false;
    let companyName = "";
    let googleReviewUrl = "";
    let googleConnected = false;

    // A. Read from Firestore using authenticated service account
    const res = await getClientSettings(clientId, firebaseProjectId);
    if (res.ok) {
      const fields = res.fields || {};
      
      const parseVal = (val: unknown) =>
        val && typeof val === "object" && "stringValue" in val
          ? String((val as { stringValue: unknown }).stringValue)
          : "";
      const parseArrayVal = (val: unknown): string[] => {
        if (!val || typeof val !== "object" || !("arrayValue" in val)) return [];
        const arr = (val as { arrayValue?: { values?: Array<{ stringValue?: string }> } }).arrayValue;
        if (!arr?.values) return [];
        return arr.values.map((v) => v.stringValue || "");
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

    // C. Fallback/Override to default review URL for Born Again Roofing if empty or using old search link
    if (clientId === "born-again-roofing") {
      if (!googleReviewUrl || googleReviewUrl.includes("google.com/search")) {
        googleReviewUrl = "https://search.google.com/local/writereview?placeid=ChIJ09P2G3YvKIYR06dcGk0znWQ";
      }
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
    let connectedChannels: unknown[] = [];
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

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Transpond settings API] GET failed:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// 2. POST Save Settings
export async function POST(request: NextRequest) {
  const denied = requireAdminSession(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    const { apiKey, groupId, technicians, rooferPasscode, companyName, googleReviewUrl } = body;

    const fieldsToUpdate: FirestoreFields = {
      clientId: { stringValue: clientId },
    };

    if (apiKey !== undefined && groupId !== undefined) {
      if (!apiKey || !groupId) {
        return NextResponse.json({ error: "Both API Key and Group ID are required." }, { status: 400 });
      }
      fieldsToUpdate.transpondApiKey = { stringValue: apiKey };
      fieldsToUpdate.transpondGroupId = { stringValue: groupId };
    }

    if (technicians !== undefined) {
      if (!Array.isArray(technicians)) {
        return NextResponse.json({ error: "Technicians must be an array of strings." }, { status: 400 });
      }
      fieldsToUpdate.technicians = {
        arrayValue: {
          values: technicians.map((tech: string) => ({ stringValue: tech }))
        }
      };
    }

    if (rooferPasscode !== undefined) {
      fieldsToUpdate.rooferPasscode = { stringValue: rooferPasscode };
    }

    if (companyName !== undefined) {
      fieldsToUpdate.companyName = { stringValue: companyName };
    }

    if (googleReviewUrl !== undefined) {
      fieldsToUpdate.googleReviewUrl = { stringValue: googleReviewUrl };
    }

    const patchRes = await patchClientSettings(clientId, fieldsToUpdate, firebaseProjectId);

    if (!patchRes.ok) {
      console.error("[Transpond settings API] Failed to patch Firestore settings:", patchRes.error || patchRes.status);
      return NextResponse.json({ error: "Failed to write to settings database" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully!" });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Transpond settings API] POST failed:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
