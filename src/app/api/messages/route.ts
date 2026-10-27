import { NextRequest, NextResponse } from "next/server";
import { getMessages, addMessage, getPinByReportToken } from "@/lib/db";
import { requireSession } from "@/lib/pindrop-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pinId = searchParams.get("pinId") || undefined;
    const reportToken = searchParams.get("reportToken") || undefined;

    // Allow homeowners viewing their private reportToken page to fetch messages for their project
    if (reportToken) {
      const pin = await getPinByReportToken(reportToken);
      if (!pin) {
        return NextResponse.json({ error: "Invalid project token" }, { status: 404 });
      }
      const msgs = await getMessages(pin.id);
      return NextResponse.json({ messages: msgs });
    }

    const denied = requireSession(request);
    if (denied) return denied;

    const messages = await getMessages(pinId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("API GET messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pinId,
      projectLabel,
      author,
      authorRole,
      text,
      mentions,
      attachmentUrl,
      photoIndex,
      pinX,
      pinY,
      reportToken,
    } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    let resolvedPinId = pinId || "general-crew";
    let resolvedLabel = projectLabel;
    let resolvedRole: "tech" | "admin" | "homeowner" | "system" = authorRole || "tech";

    if (reportToken) {
      const pin = await getPinByReportToken(reportToken);
      if (!pin) {
        return NextResponse.json({ error: "Invalid project report token" }, { status: 404 });
      }
      resolvedPinId = pin.id;
      resolvedLabel = `${pin.location} — ${pin.service}`;
      resolvedRole = "homeowner";
    } else {
      const denied = requireSession(request);
      if (denied) return denied;
    }

    const created = await addMessage({
      pinId: resolvedPinId,
      projectLabel: resolvedLabel,
      author: (author || (resolvedRole === "homeowner" ? "Homeowner" : "Crew Member")).slice(0, 80),
      authorRole: resolvedRole,
      text: text.trim().slice(0, 4000),
      mentions: Array.isArray(mentions) ? mentions : undefined,
      attachmentUrl: typeof attachmentUrl === "string" ? attachmentUrl : undefined,
      photoIndex: typeof photoIndex === "number" ? photoIndex : undefined,
      pinX: typeof pinX === "number" ? pinX : undefined,
      pinY: typeof pinY === "number" ? pinY : undefined,
    });

    return NextResponse.json({ message: created }, { status: 201 });
  } catch (error) {
    console.error("API POST messages error:", error);
    return NextResponse.json({ error: "Failed to post message" }, { status: 500 });
  }
}
