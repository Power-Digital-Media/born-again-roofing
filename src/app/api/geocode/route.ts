import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        "User-Agent": "BornAgainRoofingApp/1.0 (info@bornagainroofing.com)",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Nominatim API returned status ${response.status}` }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Geocoding proxy error:", error);
    return NextResponse.json({ error: "Failed to connect to geocoding service" }, { status: 500 });
  }
}
