import { NextResponse } from "next/server";
import { getPins, addPin } from "@/lib/db";
import { requireSession, rateLimited, clientIp } from "@/lib/pindrop-auth";

// Force Next.js to run this route dynamically at runtime (avoid static compilation)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pins = await getPins();
    return NextResponse.json(pins, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("API GET pins error:", error);
    return NextResponse.json({ error: "Failed to fetch pins" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const denied = requireSession(request);
    if (denied) return denied;
    if (rateLimited(`pins:${clientIp(request)}`, 30, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many submissions. Please wait a few minutes." }, { status: 429 });
    }

    const body = await request.json();
    const { author, date, location, service, description, images, latitude, longitude } = body;

    // Validate required fields
    if (!author || !date || !location || !service || !description || !images || !Array.isArray(images)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Bound field types and sizes (generous limits; normal submissions are far below these)
    const textOk = (v: unknown, max: number) => typeof v === "string" && v.length <= max;
    if (
      !textOk(author, 100) || !textOk(date, 50) || !textOk(location, 100) ||
      !textOk(service, 100) || !textOk(description, 5000)
    ) {
      return NextResponse.json({ error: "One or more fields are invalid or too long" }, { status: 400 });
    }
    // Images must be photos previously uploaded to Firebase Storage via /api/upload
    if (
      images.length === 0 || images.length > 20 ||
      !images.every((u: unknown) => typeof u === "string" && u.length < 1000 && u.startsWith("https://firebasestorage.googleapis.com/"))
    ) {
      return NextResponse.json({ error: "Invalid images" }, { status: 400 });
    }

    const pinData = {
      author,
      date,
      location,
      service,
      description,
      images,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      detailedExplanation: "",
      aeoAnswers: []
    };

    const createdPin = await addPin(pinData);
    if (!createdPin) {
      return NextResponse.json({ error: "Failed to save pin" }, { status: 500 });
    }

    return NextResponse.json(createdPin, { status: 201 });
  } catch (error) {
    console.error("API POST pins error:", error);
    return NextResponse.json({ error: "Failed to create pin" }, { status: 500 });
  }
}
