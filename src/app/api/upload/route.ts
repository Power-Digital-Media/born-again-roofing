import { NextResponse } from "next/server";
import { requireSession, rateLimited, clientIp } from "@/lib/pindrop-auth";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // Up to 25MB for short field walkthrough videos & PDFs

function sniffMediaType(buf: Buffer, declaredMime?: string): { mime: string; ext: string; folder: string } | null {
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { mime: "image/jpeg", ext: "jpg", folder: "checkin_photos" };
  }
  if (
    buf.length > 8 &&
    buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { mime: "image/png", ext: "png", folder: "checkin_photos" };
  }
  if (
    buf.length > 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { mime: "image/webp", ext: "webp", folder: "checkin_photos" };
  }
  // PDF ("%PDF")
  if (buf.length > 4 && buf.subarray(0, 4).toString("ascii") === "%PDF") {
    return { mime: "application/pdf", ext: "pdf", folder: "project_docs" };
  }
  // WebM (0x1A 0x45 0xDF 0xA3)
  if (buf.length > 4 && buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) {
    return { mime: "video/webm", ext: "webm", folder: "checkin_videos" };
  }
  // MP4 ("ftyp" at offset 4..8)
  if (buf.length > 12 && buf.subarray(4, 8).toString("ascii") === "ftyp") {
    return { mime: "video/mp4", ext: "mp4", folder: "checkin_videos" };
  }
  if (declaredMime === "video/webm") {
    return { mime: "video/webm", ext: "webm", folder: "checkin_videos" };
  }
  if (declaredMime === "video/mp4") {
    return { mime: "video/mp4", ext: "mp4", folder: "checkin_videos" };
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const denied = requireSession(request);
    if (denied) return denied;
    if (rateLimited(`upload:${clientIp(request)}`, 150, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many uploads. Please wait a few minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { base64Data } = body;

    if (!base64Data || typeof base64Data !== "string") {
      return NextResponse.json({ error: "Missing base64Data" }, { status: 400 });
    }

    if (base64Data.length > Math.ceil((MAX_UPLOAD_BYTES * 4) / 3) + 200) {
      return NextResponse.json({ error: "File is too large (Max 25MB)" }, { status: 413 });
    }

    const matches = base64Data.match(/^data:([A-Za-z0-9-+\/.]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: "Invalid base64 data format" }, { status: 400 });
    }

    const declaredMime = matches[1];
    const base64Content = matches[2];
    const buffer = Buffer.from(base64Content, "base64");

    const mediaInfo = sniffMediaType(buffer, declaredMime);
    if (!mediaInfo || buffer.length > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, MP4/WebM video, or PDF files up to 25MB are allowed" },
        { status: 400 }
      );
    }

    const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
    const bucket = `${firebaseProjectId}.firebasestorage.app`;

    const randomStr = Math.random().toString(36).substring(2, 8);
    const filename = `${mediaInfo.folder}/${Date.now()}-${randomStr}.${mediaInfo.ext}`;

    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o?uploadType=media&name=${encodeURIComponent(filename)}`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": mediaInfo.mime,
      },
      body: buffer,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Firebase Storage upload raw error:", errText);
      return NextResponse.json({ error: "Failed to upload file to storage" }, { status: 500 });
    }

    const resData = await res.json();
    const { name, downloadTokens } = resData;

    if (!name || !downloadTokens) {
      console.error("Firebase Storage missing name or downloadTokens in response:", resData);
      return NextResponse.json({ error: "Invalid upload response from storage" }, { status: 500 });
    }

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(name)}?alt=media&token=${downloadTokens}`;

    return NextResponse.json({ url: publicUrl, mimeType: mediaInfo.mime });
  } catch (error) {
    console.error("API POST upload error:", error);
    return NextResponse.json({ error: "Failed to process file upload" }, { status: 500 });
  }
}
