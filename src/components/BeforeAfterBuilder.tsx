"use client";

import React, { useState, useRef } from "react";

interface BeforeAfterSliderProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: number;
}

/**
 * Interactive CompanyCam-style draggable Before & After Split-Screen Comparison Slider.
 */
export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  height = 380,
}: BeforeAfterSliderProps) {
  const [sliderPct, setSliderPct] = useState(50);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateSliderFromEvent = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSliderPct(Math.max(4, Math.min(96, pct)));
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={(e) => {
        if (e.buttons === 1 || e.pointerType === "touch") {
          updateSliderFromEvent(e.clientX);
        }
      }}
      onClick={(e) => updateSliderFromEvent(e.clientX)}
      style={{
        position: "relative",
        width: "100%",
        height: `${height}px`,
        borderRadius: "14px",
        overflow: "hidden",
        userSelect: "none",
        touchAction: "pan-y",
        cursor: "ew-resize",
        border: "1px solid rgba(226, 176, 71, 0.35)",
        background: "#080a0f",
      }}
    >
      {/* Full-width AFTER image on bottom layer */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterUrl}
        alt="After transformation"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />

      {/* Clipped BEFORE image on top layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 ${100 - sliderPct}% 0 0)`,
          pointerEvents: "none",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeUrl}
          alt="Before work"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* BEFORE & AFTER Corner Badges */}
      <span
        style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          background: "rgba(10, 12, 18, 0.85)",
          border: "1px solid rgba(255,255,255,0.22)",
          color: "#f8fafc",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "0.72rem",
          fontWeight: 800,
          letterSpacing: "0.06em",
          pointerEvents: "none",
        }}
      >
        {beforeLabel}
      </span>

      <span
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "rgba(226, 176, 71, 0.92)",
          color: "#090b10",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "0.72rem",
          fontWeight: 900,
          letterSpacing: "0.06em",
          pointerEvents: "none",
        }}
      >
        {afterLabel}
      </span>

      {/* Vertical Divider Line & Handle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${sliderPct}%`,
          width: "3px",
          background: "#e2b047",
          transform: "translateX(-50%)",
          boxShadow: "0 0 12px rgba(0,0,0,0.8)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: "#e2b047",
            color: "#090b10",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: "0.85rem",
            boxShadow: "0 4px 14px rgba(0,0,0,0.65)",
            border: "2px solid #ffffff",
          }}
        >
          ↔
        </div>
      </div>
    </div>
  );
}

/**
 * Generates a branded 1080x1350 (4:5) Before & After Split Composite JPEG for social media & GBP.
 */
export async function generateBeforeAfterCompositeDataUrl(params: {
  beforeUrl: string;
  afterUrl: string;
  companyName: string;
  location: string;
  service: string;
  layout?: "top_bottom" | "side_by_side";
}): Promise<string> {
  const loadImg = (url: string) =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });

  const [beforeImg, afterImg] = await Promise.all([
    loadImg(params.beforeUrl),
    loadImg(params.afterUrl),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context unavailable");

  // Dark Navy Background
  ctx.fillStyle = "#0a0c12";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const drawCover = (
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    const imgRatio = img.width / img.height;
    const boxRatio = w / h;
    let sx = 0,
      sy = 0,
      sw = img.width,
      sh = img.height;
    if (imgRatio > boxRatio) {
      sw = img.height * boxRatio;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / boxRatio;
      sy = (img.height - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  };

  const headerH = 120;
  const footerH = 110;
  const bodyH = canvas.height - headerH - footerH;

  if (params.layout === "side_by_side") {
    const halfW = (canvas.width - 36) / 2;
    drawCover(beforeImg, 14, headerH, halfW, bodyH);
    drawCover(afterImg, 22 + halfW, headerH, halfW, bodyH);
  } else {
    const halfH = (bodyH - 12) / 2;
    drawCover(beforeImg, 16, headerH, canvas.width - 32, halfH);
    drawCover(afterImg, 16, headerH + halfH + 12, canvas.width - 32, halfH);
  }

  // Header Text
  ctx.fillStyle = "#e2b047";
  ctx.font = "800 24px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText((params.companyName || "PROJECT SHOWCASE").toUpperCase(), 28, 52);

  ctx.fillStyle = "#ffffff";
  ctx.font = "800 34px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText(`${params.service} • ${params.location}`, 28, 96);

  // BEFORE Badge
  ctx.fillStyle = "rgba(10, 12, 18, 0.88)";
  ctx.beginPath();
  ctx.roundRect(36, headerH + 22, 160, 48, 10);
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 24px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("BEFORE", 68, headerH + 54);

  // AFTER Badge
  const afterBadgeY =
    params.layout === "side_by_side" ? headerH + 22 : headerH + (bodyH - 12) / 2 + 34;
  const afterBadgeX = params.layout === "side_by_side" ? canvas.width / 2 + 28 : 36;
  ctx.fillStyle = "#e2b047";
  ctx.beginPath();
  ctx.roundRect(afterBadgeX, afterBadgeY, 150, 48, 10);
  ctx.fill();
  ctx.fillStyle = "#0a0c12";
  ctx.font = "900 24px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("AFTER", afterBadgeX + 35, afterBadgeY + 32);

  // Footer
  ctx.fillStyle = "#e2b047";
  ctx.font = "700 24px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  ctx.fillText("✓ Verified Field Transformation • Before & After Documentation", 28, canvas.height - 44);

  return canvas.toDataURL("image/jpeg", 0.88);
}
