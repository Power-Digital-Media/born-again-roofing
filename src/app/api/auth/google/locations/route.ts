import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/lib/pindrop-auth";
import { getFreshGoogleAccess, listGmbLocations } from "@/lib/google-gmb";

export const dynamic = "force-dynamic";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";
const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;

// GET: list the Google Business Profile locations the connected account can manage,
// and which one (if any) is currently pinned for automatic posting.
export async function GET(request: NextRequest) {
  const denied = requireSession(request);
  if (denied) return denied;

  const access = await getFreshGoogleAccess(clientId, firebaseProjectId);
  if (!access) {
    return NextResponse.json({ error: "Google Business Profile is not connected." }, { status: 400 });
  }
  const locations = await listGmbLocations(access.accessToken);
  return NextResponse.json({ pinned: access.locationName || null, locations });
}

// POST { locationName }: pin the single location that jobs should be posted to.
// The value must be one of the locations the connected account can actually manage.
export async function POST(request: NextRequest) {
  const denied = requireSession(request);
  if (denied) return denied;

  const { locationName } = await request.json().catch(() => ({}));
  if (!locationName || typeof locationName !== "string") {
    return NextResponse.json({ error: "locationName is required" }, { status: 400 });
  }

  const access = await getFreshGoogleAccess(clientId, firebaseProjectId);
  if (!access) {
    return NextResponse.json({ error: "Google Business Profile is not connected." }, { status: 400 });
  }
  const locations = await listGmbLocations(access.accessToken);
  const match = locations.find((l) => l.name === locationName);
  if (!match) {
    return NextResponse.json({ error: "That location is not available to the connected Google account." }, { status: 400 });
  }

  const params = new URLSearchParams();
  params.append("updateMask.fieldPaths", "googleLocationName");
  params.append("updateMask.fieldPaths", "googleLocationTitle");
  const res = await fetch(`${firestoreUrl}?${params.toString()}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        googleLocationName: { stringValue: match.name },
        googleLocationTitle: { stringValue: match.title }
      }
    })
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Failed to save the selected location." }, { status: 500 });
  }
  return NextResponse.json({ success: true, pinned: match });
}
