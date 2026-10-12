import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  // Tenant comes from this deployment's environment; "state" is only a CSRF nonce.
  const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";
  const state = searchParams.get("state");
  const nonceCookie = request.cookies.get("gmb_oauth_state")?.value;
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const errorRedirect = (msg: string) => 
    NextResponse.redirect(`${baseUrl}/admin/drop-pin?clientId=${clientId}&google_sync=error&message=${encodeURIComponent(msg)}`);

  if (error) {
    return errorRedirect(errorDescription || error);
  }

  if (!state || !nonceCookie || state !== nonceCookie) {
    return errorRedirect("Security check failed. Please start the Google connection again.");
  }

  if (!code) {
    return errorRedirect("Authorization code not found in Google response.");
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    return errorRedirect("Server side Google credentials are not configured.");
  }

  try {
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

    // 1. Exchange auth code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      })
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      return errorRedirect(`Failed to exchange authorization code: ${errText}`);
    }

    const tokenData = await tokenRes.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    if (!access_token) {
      return errorRedirect("Failed to retrieve access token from Google.");
    }

    const expiryTime = (Date.now() + expires_in * 1000).toString();

    // 2. Update Google OAuth tokens in Firestore settings collection using authenticated partial patch
    const { patchClientSettings } = await import("@/lib/firestore-admin");
    type ImportType = import("@/lib/firestore-admin").FirestoreFields;
    const fieldsToUpdate: ImportType = {
      clientId: { stringValue: clientId },
      googleAccessToken: { stringValue: access_token },
      googleTokenExpiry: { stringValue: expiryTime },
    };
    if (refresh_token) {
      fieldsToUpdate.googleRefreshToken = { stringValue: refresh_token };
    }

    const patchRes = await patchClientSettings(clientId, fieldsToUpdate, firebaseProjectId);

    if (!patchRes.ok) {
      console.error("[Google OAuth Callback] Failed to write settings to Firestore:", patchRes.error || patchRes.status);
      return errorRedirect(`Failed to write settings to Firestore: ${patchRes.error || `HTTP ${patchRes.status}`}`);
    }

    // 3. Success redirect
    return NextResponse.redirect(`${baseUrl}/admin/drop-pin?clientId=${clientId}&google_sync=success`);

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Google OAuth Callback] Token exchange failed:", err);
    return errorRedirect(`System error: ${msg}`);
  }
}
