import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("Google OAuth error from query:", error);
      return NextResponse.redirect(new URL(`/admin/drop-pin?google_sync=error&message=${encodeURIComponent(error)}`, request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/admin/drop-pin?google_sync=error&message=No+auth+code+returned", request.url));
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
    const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";

    if (!googleClientId || !googleClientSecret) {
      return NextResponse.json({ error: "Google OAuth is not configured in environment variables" }, { status: 500 });
    }

    // Dynamically detect host to build matching redirect URI
    const host = request.headers.get("host") || "www.bornagainroofing.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/callback/google`;

    // Exchange auth code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      })
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Failed to exchange OAuth code for tokens:", errorText);
      return NextResponse.redirect(new URL(`/admin/drop-pin?google_sync=error&message=Token+exchange+failed`, request.url));
    }

    const tokens = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokens;

    if (!access_token) {
      return NextResponse.redirect(new URL("/admin/drop-pin?google_sync=error&message=No+access+token+returned", request.url));
    }

    // Save tokens in Firebase Firestore settings collection via authenticated partial patch
    const expiryTime = Date.now() + (expires_in || 3600) * 1000;
    
    const { patchClientSettings } = await import("@/lib/firestore-admin");
    type ImportType = import("@/lib/firestore-admin").FirestoreFields;
    const fieldsToUpdate: ImportType = {
      clientId: { stringValue: clientId },
      accessToken: { stringValue: access_token },
      googleAccessToken: { stringValue: access_token },
      expiryTime: { doubleValue: expiryTime },
      googleTokenExpiry: { stringValue: expiryTime.toString() },
    };

    if (refresh_token) {
      fieldsToUpdate.refreshToken = { stringValue: refresh_token };
      fieldsToUpdate.googleRefreshToken = { stringValue: refresh_token };
    }

    const saveResponse = await patchClientSettings(clientId, fieldsToUpdate, firebaseProjectId);

    if (!saveResponse.ok) {
      console.error("Failed to save tokens in Firestore settings:", saveResponse.error || saveResponse.status);
      return NextResponse.redirect(new URL("/admin/drop-pin?google_sync=error&message=Failed+to+save+auth+settings", request.url));
    }

    console.log(`Successfully synced and saved Google GMB OAuth credentials for ${clientId} in Firestore.`);
    
    // Redirect back to admin panel with success flag
    return NextResponse.redirect(new URL("/admin/drop-pin?google_sync=success", request.url));
  } catch (error) {
    console.error("Error in Google OAuth callback endpoint:", error);
    return NextResponse.redirect(new URL("/admin/drop-pin?google_sync=error&message=Internal+server+error", request.url));
  }
}
