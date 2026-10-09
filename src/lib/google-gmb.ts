import { PinType } from "./db";

interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiryTime: number;
  locationName: string;
}

export interface GmbLocation {
  name: string; // full resource name, e.g. "accounts/123/locations/456"
  title: string;
}

function settingsUrl(clientId: string, firebaseProjectId: string): string {
  return `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/settings/${clientId}`;
}

// 1. Helper to fetch GMB auth settings from Firestore.
// The Google connect flow (/api/auth/google/callback) stores googleAccessToken / googleRefreshToken /
// googleTokenExpiry. The older callback stored accessToken / refreshToken / expiryTime. Read both so
// whichever flow connected the account is honored.
async function getGoogleAuthSettings(clientId: string, firebaseProjectId: string): Promise<GoogleTokens | null> {
  try {
    const res = await fetch(settingsUrl(clientId, firebaseProjectId));
    if (!res.ok) {
      console.log(`[GMB] No Google OAuth credentials found in settings/${clientId} or failed to fetch.`);
      return null;
    }
    const data = await res.json();
    const fields = data.fields || {};

    const parseValue = (val: any) => {
      if (!val) return "";
      return val.stringValue || (val.doubleValue ? Number(val.doubleValue) : "");
    };

    const accessToken = parseValue(fields.googleAccessToken) || parseValue(fields.accessToken);
    const refreshToken = parseValue(fields.googleRefreshToken) || parseValue(fields.refreshToken);
    const expiryTime = Number(parseValue(fields.googleTokenExpiry) || parseValue(fields.expiryTime)) || 0;
    const locationName = parseValue(fields.googleLocationName) || process.env.GMB_LOCATION_NAME || "";

    if (!refreshToken) {
      return null;
    }

    return { accessToken, refreshToken, expiryTime, locationName };
  } catch (error) {
    console.error("[GMB] Error fetching settings from Firestore:", error);
    return null;
  }
}

// 2. Helper to save updated token back to Firestore
async function saveAccessToken(clientId: string, firebaseProjectId: string, accessToken: string, expiryTime: number) {
  try {
    const firestoreFields = {
      fields: {
        clientId: { stringValue: clientId },
        googleAccessToken: { stringValue: accessToken },
        googleTokenExpiry: { stringValue: String(expiryTime) }
      }
    };

    const updateParams = new URLSearchParams();
    updateParams.append("updateMask.fieldPaths", "googleAccessToken");
    updateParams.append("updateMask.fieldPaths", "googleTokenExpiry");

    await fetch(`${settingsUrl(clientId, firebaseProjectId)}?${updateParams.toString()}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(firestoreFields)
    });
  } catch (error) {
    console.error("[GMB] Failed to save refreshed token:", error);
  }
}

// 3. Helper to refresh the Google access token using the refresh_token
async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; expires_in: number } | null> {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!googleClientId || !googleClientSecret) {
      console.error("[GMB] Missing Google Client ID or Secret in environment.");
      return null;
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[GMB] Token refresh endpoint returned error:", errText);
      return null;
    }

    const data = await response.json();
    return {
      accessToken: data.access_token,
      expires_in: data.expires_in || 3600
    };
  } catch (error) {
    console.error("[GMB] Exception refreshing Google access token:", error);
    return null;
  }
}

// Returns a valid access token (refreshing and persisting if needed) plus the pinned location, if any.
export async function getFreshGoogleAccess(
  clientId: string,
  firebaseProjectId: string
): Promise<{ accessToken: string; locationName: string } | null> {
  const credentials = await getGoogleAuthSettings(clientId, firebaseProjectId);
  if (!credentials) return null;

  let { accessToken, refreshToken, expiryTime } = credentials;

  // Check if token is missing, expired or expiring in the next 5 minutes
  if (!accessToken || Date.now() + 300 * 1000 >= expiryTime) {
    console.log("[GMB] Access token expired or expiring. Refreshing...");
    const refreshResult = await refreshAccessToken(refreshToken);
    if (!refreshResult) {
      console.error("[GMB] Failed to obtain new access token.");
      return null;
    }
    accessToken = refreshResult.accessToken;
    expiryTime = Date.now() + refreshResult.expires_in * 1000;
    await saveAccessToken(clientId, firebaseProjectId, accessToken, expiryTime);
  }

  return { accessToken, locationName: credentials.locationName };
}

// 4. Helper to list every GMB location the connected Google account can manage
export async function listGmbLocations(accessToken: string): Promise<GmbLocation[]> {
  const found: GmbLocation[] = [];
  try {
    const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!accountsRes.ok) {
      console.error("[GMB] Failed to fetch accounts list:", await accountsRes.text());
      return found;
    }
    const accounts = (await accountsRes.json()).accounts || [];

    for (const account of accounts) {
      const accountName: string = account.name; // "accounts/12345"
      const locationsRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title&pageSize=100`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (!locationsRes.ok) {
        console.error(`[GMB] Failed to list locations for ${accountName}:`, await locationsRes.text());
        continue;
      }
      const locations = (await locationsRes.json()).locations || [];
      for (const loc of locations) {
        // Business Information returns "locations/987"; the posts API needs "accounts/123/locations/987"
        found.push({ name: `${accountName}/${loc.name}`, title: loc.title || loc.name });
      }
    }
  } catch (error) {
    console.error("[GMB] Exception listing locations:", error);
  }
  return found;
}

// Resolve the location to post to. A pinned location always wins. Without one we only auto-select
// when the connected account has exactly one location; otherwise we refuse to guess, so a job can
// never be posted to the wrong business profile.
async function resolveLocation(accessToken: string, pinned: string): Promise<string | null> {
  if (pinned) return pinned;
  const locations = await listGmbLocations(accessToken);
  if (locations.length === 1) return locations[0].name;
  if (locations.length === 0) {
    console.error("[GMB] No business locations found for this Google account.");
  } else {
    console.error(
      `[GMB] ${locations.length} locations are available and none is pinned. Not posting. ` +
        "Pin one via /api/auth/google/locations or GMB_LOCATION_NAME."
    );
  }
  return null;
}

// 5. Main entry point: Publish a Pin to GMB as a Local Post
export async function publishPinToGmb(pin: PinType): Promise<boolean> {
  try {
    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
    const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";

    const access = await getFreshGoogleAccess(clientId, firebaseProjectId);
    if (!access) {
      return false; // Silently abort if not connected
    }
    const { accessToken } = access;

    const locationName = await resolveLocation(accessToken, access.locationName);
    if (!locationName) {
      return false;
    }

    // Determine host for redirect callback button link
    const host = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bornagainroofing.com";
    const projectUrl = `${host}/pin-page?id=${pin.id}`;

    // Format post text body
    const summary = `🛠️ New Job Completed by ${clientId === "born-again-roofing" ? "Born Again Roofing" : "our crew"}!\n\n` +
      `👷 Technician: ${pin.author}\n` +
      `📍 Location: ${pin.location}\n` +
      `📂 Category: ${pin.service}\n\n` +
      `Project Details:\n${pin.description}`;

    // Setup GMB local post structure
    const postBody: any = {
      languageCode: "en-US",
      topicType: "STANDARD",
      summary: summary.slice(0, 1500), // Google's local post summary limit
      callToAction: {
        actionType: "LEARN_MORE",
        url: projectUrl
      }
    };

    // Attach primary photo if available (GMB supports 1 image for updates)
    if (pin.images && pin.images.length > 0) {
      postBody.media = [
        {
          mediaFormat: "PHOTO",
          sourceUrl: pin.images[0]
        }
      ];
    }

    // Local posts are served by the v4 My Business API: accounts/{a}/locations/{l}/localPosts
    const gmbPostUrl = `https://mybusiness.googleapis.com/v4/${locationName}/localPosts`;
    const postRes = await fetch(gmbPostUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postBody)
    });

    if (!postRes.ok) {
      const errText = await postRes.text();
      console.error("[GMB] Google localPosts API returned error status:", postRes.status, errText);
      return false;
    }

    console.log(`[GMB] Successfully published job check-in for Pin ID ${pin.id} to Google Business Profile!`);
    return true;
  } catch (error) {
    console.error("[GMB] Unexpected error publishing to GMB:", error);
    return false;
  }
}
