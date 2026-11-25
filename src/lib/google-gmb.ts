import { PinType } from "./db";
import { getClientSettings, patchClientSettings } from "./firestore-admin";

interface GoogleTokens {
  accessToken: string;
  refreshToken: string;
  expiryTime: number;
  locationName: string;
  locationTitle: string;
}

export interface GmbLocation {
  name: string; // full resource name, e.g. "accounts/123/locations/456"
  title: string;
}

export interface GmbConnectionHealth {
  hasStoredRefreshToken: boolean;
  connected: boolean;
  tokenExpired: boolean;
  pinnedLocationName: string;
  pinnedLocationTitle: string;
}

const CENTRAL_MS_CITY_SLUGS = new Set<string>([
  "florence-ms",
  "jackson-ms",
  "brandon-ms",
  "madison-ms",
  "pearl-ms",
  "flowood-ms",
  "ridgeland-ms",
  "clinton-ms",
  "byram-ms",
  "richland-ms",
  "canton-ms",
  "gluckstadt-ms",
  "terry-ms",
  "raymond-ms",
  "crystal-springs-ms",
  "hazlehurst-ms",
  "utica-ms",
  "vicksburg-ms",
  "yazoo-city-ms",
]);

function resolveServiceFallbackPath(service: string): string {
  const s = (service || "").toLowerCase();
  if (s.includes("metal")) return "/metal-roofing-repair-and-installation/";
  if (s.includes("commercial") || s.includes("tpo") || s.includes("flat roof")) return "/commercial-roofing/";
  if (s.includes("storm") || s.includes("hail") || s.includes("wind")) return "/storm-damage-roof-repair/";
  if (s.includes("roof")) return "/residential-roofing/";
  if (s.includes("bath")) return "/bathroom-remodeling/";
  if (s.includes("kitchen")) return "/kitchen-remodeling/";
  if (s.includes("siding") || s.includes("fascia") || s.includes("soffit")) return "/siding/";
  if (s.includes("gutter")) return "/gutters/";
  if (s.includes("paint")) return "/painting/";
  if (s.includes("floor") || s.includes("tile")) return "/flooring/";
  if (s.includes("window") || s.includes("door")) return "/windows-and-doors/";
  return "/pins/";
}

/**
 * Maps a PinDrop project to an indexable, trailing-slash canonical page on bornagainroofing.com
 * (preferring the matching Central MS city hub so GBP Local Posts pass local SEO relevance
 * directly to indexable pages rather than noindex /pin-page/?id=* URLs).
 */
export function resolveCanonicalSeoUrlForPin(pin: PinType, host: string): string {
  const cleanHost = (host || "https://www.bornagainroofing.com").replace(/\/+$/, "");
  const locRaw = (pin.location || "").trim().toLowerCase();
  const cityMatch = locRaw.match(/^([a-z .'-]+),\s*ms$/i);
  if (cityMatch) {
    const citySlug = `${cityMatch[1].trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-ms`;
    if (CENTRAL_MS_CITY_SLUGS.has(citySlug)) {
      return `${cleanHost}/areas-we-service/${citySlug}/`;
    }
  }
  return `${cleanHost}${resolveServiceFallbackPath(pin.service)}`;
}

const STREET_PII_RE =
  /\b\d{2,5}\s+[A-Za-z0-9.'-]+\s+(?:Dr|Drive|St|Street|Ave|Avenue|Rd|Road|Ln|Lane|Ct|Court|Cir|Circle|Blvd|Boulevard|Way|Pkwy|Hwy|Highway)\b/gi;

export function buildSeoLocalPostSummary(pin: PinType, clientId: string): string {
  const city = (pin.location || "Central Mississippi").trim();
  const service = (pin.service || "Roofing & Home Remodeling").trim();
  const cleanDesc = (pin.description || "")
    .replace(STREET_PII_RE, city)
    .replace(/\bundefined\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  const tech = pin.author && pin.author !== "Unknown" ? pin.author.trim() : "";

  if (clientId === "born-again-roofing") {
    const intro = `Recent ${service} project completed in ${city} by Born Again Home Remodeling & Roofing.`;
    const details = cleanDesc ? `\n\nProject Scope: ${cleanDesc}${/[.!?]$/.test(cleanDesc) ? "" : "."}` : "";
    const crewLine = tech ? `\nLead Craftsman: ${tech}` : "";
    const ctaLine = `\n\nNeed trusted roofing, storm damage repair, or home remodeling in ${city}? Call (601) 665-8077 or tap Learn More for a free local inspection.`;
    return `${intro}${details}${crewLine}${ctaLine}`.slice(0, 1480);
  }

  return (
    `New ${service} project completed in ${city}!\n\n` +
    (cleanDesc ? `Project Details: ${cleanDesc}\n` : "") +
    (tech ? `Technician: ${tech}` : "")
  ).slice(0, 1480);
}

// 1. Helper to fetch GMB auth settings from Firestore.
async function getGoogleAuthSettings(clientId: string, firebaseProjectId: string): Promise<GoogleTokens | null> {
  try {
    const res = await getClientSettings(clientId, firebaseProjectId);
    if (!res.ok) {
      console.log(`[GMB] No Google OAuth credentials found in settings/${clientId} or failed to fetch (HTTP ${res.status}).`);
      return null;
    }
    const fields = res.fields || {};

    const parseValue = (val: unknown): string => {
      if (!val || typeof val !== "object") return "";
      const v = val as { stringValue?: string; integerValue?: string | number; doubleValue?: number };
      if (v.stringValue) return v.stringValue;
      if (v.integerValue !== undefined) return String(v.integerValue);
      if (v.doubleValue !== undefined) return String(v.doubleValue);
      return "";
    };

    const accessToken = parseValue(fields.googleAccessToken) || parseValue(fields.accessToken);
    const refreshToken = parseValue(fields.googleRefreshToken) || parseValue(fields.refreshToken);
    const expiryTime = Number(parseValue(fields.googleTokenExpiry) || parseValue(fields.expiryTime)) || 0;
    const locationName =
      parseValue(fields.googleLocationName) ||
      parseValue(fields.gmbLocationName) ||
      process.env.GMB_LOCATION_NAME ||
      "";
    const locationTitle = parseValue(fields.googleLocationTitle) || "";

    if (!refreshToken) {
      return null;
    }

    return { accessToken, refreshToken, expiryTime, locationName, locationTitle };
  } catch (error) {
    console.error("[GMB] Error fetching settings from Firestore:", error);
    return null;
  }
}

// 2. Helper to save updated token back to Firestore
async function saveAccessToken(clientId: string, firebaseProjectId: string, accessToken: string, expiryTime: number) {
  try {
    const fieldsToUpdate = {
      clientId: { stringValue: clientId },
      googleAccessToken: { stringValue: accessToken },
      googleTokenExpiry: { stringValue: String(expiryTime) },
    };

    const res = await patchClientSettings(clientId, fieldsToUpdate, firebaseProjectId);
    if (!res.ok) {
      console.error("[GMB] Failed to save refreshed token:", res.error || res.status);
    }
  } catch (error) {
    console.error("[GMB] Failed to save refreshed token:", error);
  }
}

// 3. Helper to refresh the Google access token using the refresh_token
async function refreshAccessToken(
  refreshToken: string
): Promise<
  | { ok: true; accessToken: string; expires_in: number; scope: string }
  | { ok: false; invalidGrant: boolean; missingScope?: boolean; error: string }
> {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!googleClientId || !googleClientSecret) {
      console.error("[GMB] Missing Google Client ID or Secret in environment.");
      return { ok: false, invalidGrant: false, error: "missing_oauth_client" };
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[GMB] Token refresh endpoint returned error:", errText);
      const invalidGrant = errText.includes("invalid_grant");
      return { ok: false, invalidGrant, error: errText };
    }

    const data = await response.json();
    const scope = String(data.scope || "");
    if (scope && !scope.includes("business.manage")) {
      console.error("[GMB] Refresh token lacks business.manage scope:", scope);
      return { ok: false, invalidGrant: true, missingScope: true, error: "missing_business_manage_scope" };
    }

    return {
      ok: true,
      accessToken: data.access_token,
      expires_in: data.expires_in || 3600,
      scope,
    };
  } catch (error) {
    console.error("[GMB] Exception refreshing Google access token:", error);
    return { ok: false, invalidGrant: false, error: String(error) };
  }
}

// Returns a valid access token (refreshing and persisting if needed) plus the pinned location, if any.
export async function getFreshGoogleAccess(
  clientId: string,
  firebaseProjectId: string
): Promise<{ accessToken: string; locationName: string; locationTitle: string } | null> {
  const credentials = await getGoogleAuthSettings(clientId, firebaseProjectId);
  if (!credentials) return null;

  const { refreshToken } = credentials;
  let { accessToken, expiryTime } = credentials;

  // Check if token is missing, expired or expiring in the next 5 minutes
  if (!accessToken || Date.now() + 300 * 1000 >= expiryTime) {
    console.log("[GMB] Access token expired or expiring. Refreshing...");
    const refreshResult = await refreshAccessToken(refreshToken);
    if (!refreshResult.ok) {
      console.error("[GMB] Failed to obtain new access token.");
      return null;
    }
    accessToken = refreshResult.accessToken;
    expiryTime = Date.now() + refreshResult.expires_in * 1000;
    await saveAccessToken(clientId, firebaseProjectId, accessToken, expiryTime);
  }

  return {
    accessToken,
    locationName: credentials.locationName,
    locationTitle: credentials.locationTitle,
  };
}

/**
 * Verifies live Google OAuth token health so the admin UI never shows a false "Connected" badge
 * when a refresh_token has expired or been revoked.
 */
export async function checkGmbConnectionHealth(
  clientId: string,
  firebaseProjectId: string
): Promise<GmbConnectionHealth> {
  const credentials = await getGoogleAuthSettings(clientId, firebaseProjectId);
  if (!credentials) {
    return {
      hasStoredRefreshToken: false,
      connected: false,
      tokenExpired: false,
      pinnedLocationName: "",
      pinnedLocationTitle: "",
    };
  }

  if (credentials.accessToken && credentials.locationName && Date.now() + 300 * 1000 < credentials.expiryTime) {
    return {
      hasStoredRefreshToken: true,
      connected: true,
      tokenExpired: false,
      pinnedLocationName: credentials.locationName,
      pinnedLocationTitle: credentials.locationTitle,
    };
  }

  const refreshResult = await refreshAccessToken(credentials.refreshToken);
  if (!refreshResult.ok) {
    return {
      hasStoredRefreshToken: true,
      connected: false,
      tokenExpired: refreshResult.invalidGrant,
      pinnedLocationName: credentials.locationName,
      pinnedLocationTitle: credentials.locationTitle,
    };
  }

  const newExpiry = Date.now() + refreshResult.expires_in * 1000;
  await saveAccessToken(clientId, firebaseProjectId, refreshResult.accessToken, newExpiry);

  let pinnedName = credentials.locationName;
  let pinnedTitle = credentials.locationTitle;
  if (!pinnedName) {
    const resolved = await resolveAndPersistTenantLocation(
      refreshResult.accessToken,
      clientId,
      firebaseProjectId
    );
    if (resolved) {
      pinnedName = resolved.name;
      pinnedTitle = resolved.title;
    }
  }

  return {
    hasStoredRefreshToken: true,
    connected: true,
    tokenExpired: false,
    pinnedLocationName: pinnedName,
    pinnedLocationTitle: pinnedTitle,
  };
}

// 4. Helper to list every GMB location the connected Google account can manage
export async function listGmbLocations(accessToken: string): Promise<GmbLocation[]> {
  const found: GmbLocation[] = [];
  try {
    const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!accountsRes.ok) {
      console.error("[GMB] Failed to fetch accounts list:", accountsRes.status, await accountsRes.text());
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
        found.push({ name: `${accountName}/${loc.name}`, title: loc.title || loc.name });
      }
    }
  } catch (error) {
    console.error("[GMB] Exception listing locations:", error);
  }
  return found;
}

/**
 * Unambiguously matches a tenant's Google Business Profile when an agency account manages >1 location,
 * and persists the pinned location to Firestore so future posts never fail or guess.
 */
export async function resolveAndPersistTenantLocation(
  accessToken: string,
  clientId: string,
  firebaseProjectId: string
): Promise<GmbLocation | null> {
  const locations = await listGmbLocations(accessToken);
  if (locations.length === 0) {
    console.error("[GMB] No business locations returned by Google Business Profile API (check quota or permissions).");
    return null;
  }

  let matched: GmbLocation | null = null;
  if (locations.length === 1) {
    matched = locations[0];
  } else {
    const expectedBrandToken =
      clientId === "born-again-roofing"
        ? "born again"
        : clientId.replace(/-/g, " ").toLowerCase();
    const candidates = locations.filter((l) =>
      l.title.toLowerCase().includes(expectedBrandToken)
    );
    if (candidates.length === 1) {
      matched = candidates[0];
    } else {
      console.error(
        `[GMB] ${locations.length} locations available (${locations.map((l) => l.title).join(", ")}) and none matched "${expectedBrandToken}" uniquely. Pin one via /api/auth/google/locations.`
      );
      return null;
    }
  }

  await patchClientSettings(
    clientId,
    {
      googleLocationName: { stringValue: matched.name },
      googleLocationTitle: { stringValue: matched.title },
    },
    firebaseProjectId
  ).catch((err) => console.error("[GMB] Failed to persist auto-pinned location:", err));

  return matched;
}

async function resolveLocation(
  accessToken: string,
  pinned: string,
  clientId: string,
  firebaseProjectId: string
): Promise<string | null> {
  if (pinned) return pinned;
  const resolved = await resolveAndPersistTenantLocation(accessToken, clientId, firebaseProjectId);
  return resolved ? resolved.name : null;
}

// 5. Main entry point: Publish a Pin to GMB as a Local Post
export async function publishPinToGmb(pin: PinType): Promise<boolean> {
  try {
    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
    const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";

    const access = await getFreshGoogleAccess(clientId, firebaseProjectId);
    if (!access) {
      return false;
    }
    const { accessToken } = access;

    const locationName = await resolveLocation(
      accessToken,
      access.locationName,
      clientId,
      firebaseProjectId
    );
    if (!locationName) {
      return false;
    }

    const host = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bornagainroofing.com";
    const canonicalLandingUrl = resolveCanonicalSeoUrlForPin(pin, host);
    const summary = buildSeoLocalPostSummary(pin, clientId);

    const postBody: Record<string, unknown> = {
      languageCode: "en-US",
      topicType: "STANDARD",
      summary,
      callToAction: {
        actionType: "LEARN_MORE",
        url: canonicalLandingUrl,
      },
    };

    if (pin.images && pin.images.length > 0 && pin.images[0].startsWith("https://")) {
      postBody.media = [
        {
          mediaFormat: "PHOTO",
          sourceUrl: pin.images[0],
        },
      ];
    }

    const gmbPostUrl = `https://mybusiness.googleapis.com/v4/${locationName}/localPosts`;
    const postRes = await fetch(gmbPostUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postBody),
    });

    if (!postRes.ok) {
      const errText = await postRes.text();
      console.error("[GMB] Google localPosts API returned error status:", postRes.status, errText);
      return false;
    }

    console.log(
      `[GMB] Successfully published Pin ID ${pin.id} (${pin.location}) -> ${canonicalLandingUrl} on Google Business Profile (${locationName})!`
    );
    return true;
  } catch (error) {
    console.error("[GMB] Unexpected error publishing to GMB:", error);
    return false;
  }
}
