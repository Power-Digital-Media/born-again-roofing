import { NextRequest, NextResponse } from "next/server";
import { getPins, addPin, updatePin, getPinByReportToken } from "@/lib/db";
import { requireSession, rateLimited, clientIp } from "@/lib/pindrop-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInternalParam = searchParams.get("includeInternal") === "true";
    const reportTokenParam = searchParams.get("reportToken");

    if (reportTokenParam) {
      const pin = await getPinByReportToken(reportTokenParam);
      if (!pin) {
        return NextResponse.json({ error: "Project report not found" }, { status: 404 });
      }
      return NextResponse.json(pin, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "CDN-Cache-Control": "no-store",
        },
      });
    }

    let allowInternal = false;
    if (includeInternalParam) {
      const denied = requireSession(request);
      if (!denied) {
        allowInternal = true;
      }
    }

    const pins = await getPins({ includeInternal: allowInternal });
    return NextResponse.json(pins, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "CDN-Cache-Control": "no-store",
      },
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
    if (rateLimited(`pins:${clientIp(request)}`, 40, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many submissions. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      author,
      date,
      location,
      service,
      description,
      images,
      photoMeta,
      beforeAfterCollageUrl,
      walkthroughVideoUrl,
      projectStatus,
      publishToPublicMap,
      customerName,
      customerPhone,
      customerEmail,
      streetAddress,
      internalNotes,
      checklist,
      documents,
      signatures,
      latitude,
      longitude,
    } = body;

    if (!author || !date || !location || !service || !description || !images || !Array.isArray(images)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const textOk = (v: unknown, max: number) => typeof v === "string" && v.length <= max;
    if (
      !textOk(author, 100) ||
      !textOk(date, 50) ||
      !textOk(location, 100) ||
      !textOk(service, 100) ||
      !textOk(description, 8000)
    ) {
      return NextResponse.json(
        { error: "One or more fields are invalid or too long" },
        { status: 400 }
      );
    }

    if (
      images.length === 0 ||
      images.length > 60 ||
      !images.every(
        (u: unknown) =>
          typeof u === "string" &&
          u.length < 1500 &&
          (u.startsWith("https://firebasestorage.googleapis.com/") || u.startsWith("/images/"))
      )
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
      photoMeta: Array.isArray(photoMeta) ? photoMeta : undefined,
      beforeAfterCollageUrl: typeof beforeAfterCollageUrl === "string" ? beforeAfterCollageUrl : undefined,
      walkthroughVideoUrl: typeof walkthroughVideoUrl === "string" ? walkthroughVideoUrl : undefined,
      projectStatus: projectStatus || "completed",
      publishToPublicMap: publishToPublicMap !== undefined ? Boolean(publishToPublicMap) : true,
      customerName: typeof customerName === "string" ? customerName.slice(0, 120) : undefined,
      customerPhone: typeof customerPhone === "string" ? customerPhone.slice(0, 40) : undefined,
      customerEmail: typeof customerEmail === "string" ? customerEmail.slice(0, 120) : undefined,
      streetAddress: typeof streetAddress === "string" ? streetAddress.slice(0, 200) : undefined,
      internalNotes: typeof internalNotes === "string" ? internalNotes.slice(0, 8000) : undefined,
      checklist: Array.isArray(checklist) ? checklist : undefined,
      documents: Array.isArray(documents) ? documents : undefined,
      signatures: Array.isArray(signatures) ? signatures : undefined,
      latitude: latitude !== undefined && latitude !== "" ? parseFloat(String(latitude)) : undefined,
      longitude: longitude !== undefined && longitude !== "" ? parseFloat(String(longitude)) : undefined,
      detailedExplanation: "",
      aeoAnswers: [],
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, reportToken, signatureOnly, ...updates } = body;

    // Allow homeowners to submit an E-Signature via their valid reportToken without a tech session
    if (signatureOnly && reportToken && updates.signatures) {
      const targetPin = await getPinByReportToken(reportToken);
      if (!targetPin) {
        return NextResponse.json({ error: "Invalid project report token" }, { status: 404 });
      }
      const updated = await updatePin(targetPin.id, {
        signatures: updates.signatures,
      });
      return NextResponse.json(updated);
    }

    const denied = requireSession(request);
    if (denied) return denied;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Pin id is required for updates" }, { status: 400 });
    }

    const updatedPin = await updatePin(id, updates);
    if (!updatedPin) {
      return NextResponse.json({ error: "Pin not found or update failed" }, { status: 404 });
    }

    return NextResponse.json(updatedPin);
  } catch (error) {
    console.error("API PATCH pins error:", error);
    return NextResponse.json({ error: "Failed to update project pin" }, { status: 500 });
  }
}
