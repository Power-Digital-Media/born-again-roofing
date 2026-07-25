import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      return NextResponse.json({ error: "GOOGLE_CLIENT_ID is not configured in .env.local" }, { status: 500 });
    }

    // Dynamically detect host to support local dev (localhost:3000) and live domains (bornagainroofing.com, msdirt.com)
    const host = request.headers.get("host") || "www.bornagainroofing.com";
    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/callback/google`;

    const scope = "https://www.googleapis.com/auth/business.manage";

    // Build the official Google OAuth authorization URL
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
      new URLSearchParams({
        client_id: googleClientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: scope,
        access_type: "offline", // Essential to retrieve a permanent refresh_token
        prompt: "consent" // Force Google to show consent screen and issue refresh token every time they reconnect
      }).toString();

    return NextResponse.redirect(googleAuthUrl);
  } catch (error) {
    console.error("Error generating Google OAuth URL:", error);
    return NextResponse.json({ error: "Failed to generate authorization URL" }, { status: 500 });
  }
}
