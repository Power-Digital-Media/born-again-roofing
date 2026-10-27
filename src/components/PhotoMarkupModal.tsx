"use client";

import React, { useState, useRef, useEffect } from "react";
import { PhotoComment } from "@/lib/db";

interface PhotoMarkupModalProps {
  imageUrl: string;
  initialComments?: PhotoComment[];
  authorName: string;
  technicians: string[];
  onClose: () => void;
  onSaveAnnotatedImage: (base64Jpeg: string) => Promise<void>;
  onAddPhotoComment?: (comment: Omit<PhotoComment, "id" | "createdAt">) => Promise<void>;
}

type ToolType = "arrow" | "circle" | "pen" | "text" | "comment_pin";

interface DrawAction {
  tool: "arrow" | "circle" | "pen" | "text";
  color: string;
  points: { x: number; y: number }[];
  text?: string;
}

const COLORS = [
  { label: "Red", hex: "#ef4444" },
  { label: "Gold", hex: "#e2b047" },
  { label: "Cyan", hex: "#38bdf8" },
  { label: "Lime", hex: "#22c55e" },
  { label: "White", hex: "#ffffff" },
];

export default function PhotoMarkupModal({
  imageUrl,
  initialComments = [],
  authorName,
  technicians,
  onClose,
  onSaveAnnotatedImage,
  onAddPhotoComment,
}: PhotoMarkupModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [activeTool, setActiveTool] = useState<ToolType>("arrow");
  const [activeColor, setActiveColor] = useState<string>("#ef4444");
  const [actions, setActions] = useState<DrawAction[]>([]);
  const [currentAction, setCurrentAction] = useState<DrawAction | null>(null);
  const [calloutText, setCalloutText] = useState<string>("Hail / Leak Damage");
  const [isSaving, setIsSaving] = useState(false);

  // Visual Photo-Pinned Comment State
  const [comments, setComments] = useState<PhotoComment[]>(initialComments);
  const [pendingPinCoords, setPendingPinCoords] = useState<{ xPct: number; yPct: number } | null>(
    null
  );
  const [commentText, setCommentText] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  // Load base image into canvas
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.width || 1200;
        canvas.height = img.height || 900;
        redrawCanvas(canvas, img, actions, null);
      }
    };
    img.src = imageUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (canvas && img) {
      redrawCanvas(canvas, img, actions, currentAction);
    }
  }, [actions, currentAction]);

  const redrawCanvas = (
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    history: DrawAction[],
    live: DrawAction | null
  ) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const all = live ? [...history, live] : history;
    const strokeScale = Math.max(4, Math.round(canvas.width * 0.005));

    for (const act of all) {
      if (act.points.length === 0) continue;
      ctx.strokeStyle = act.color;
      ctx.fillStyle = act.color;
      ctx.lineWidth = strokeScale;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (act.tool === "pen") {
        ctx.beginPath();
        ctx.moveTo(act.points[0].x, act.points[0].y);
        for (let i = 1; i < act.points.length; i++) {
          ctx.lineTo(act.points[i].x, act.points[i].y);
        }
        ctx.stroke();
      } else if (act.tool === "arrow" && act.points.length >= 2) {
        const start = act.points[0];
        const end = act.points[act.points.length - 1];
        const headLen = strokeScale * 4.5;
        const angle = Math.atan2(end.y - start.y, end.x - start.x);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(
          end.x - headLen * Math.cos(angle - Math.PI / 6),
          end.y - headLen * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          end.x - headLen * Math.cos(angle + Math.PI / 6),
          end.y - headLen * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
      } else if (act.tool === "circle" && act.points.length >= 2) {
        const start = act.points[0];
        const end = act.points[act.points.length - 1];
        const radius = Math.hypot(end.x - start.x, end.y - start.y);
        ctx.beginPath();
        ctx.arc(start.x, start.y, Math.max(10, radius), 0, Math.PI * 2);
        ctx.stroke();
      } else if (act.tool === "text" && act.text) {
        const pt = act.points[0];
        const fontSize = Math.max(20, Math.round(canvas.width * 0.026));
        ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        const metrics = ctx.measureText(act.text);
        const padX = Math.round(fontSize * 0.6);
        const padY = Math.round(fontSize * 0.45);
        const boxW = metrics.width + padX * 2;
        const boxH = fontSize + padY * 2;

        ctx.fillStyle = "rgba(10, 12, 18, 0.88)";
        ctx.beginPath();
        ctx.roundRect(pt.x, pt.y - boxH / 2, boxW, boxH, 8);
        ctx.fill();

        ctx.strokeStyle = act.color;
        ctx.lineWidth = Math.max(2, Math.round(strokeScale * 0.6));
        ctx.stroke();

        ctx.fillStyle = act.color;
        ctx.fillText(act.text, pt.x + padX, pt.y + fontSize * 0.35);
      }
    }
  };

  const getCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, xPct: 0, yPct: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const xPct = Math.max(0, Math.min(100, Number((((e.clientX - rect.left) / rect.width) * 100).toFixed(1))));
    const yPct = Math.max(0, Math.min(100, Number((((e.clientY - rect.top) / rect.height) * 100).toFixed(1))));
    return { x, y, xPct, yPct };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const pt = getCanvasPoint(e);

    if (activeTool === "comment_pin") {
      setPendingPinCoords({ xPct: pt.xPct, yPct: pt.yPct });
      return;
    }

    if (activeTool === "text") {
      if (!calloutText.trim()) return;
      setActions((prev) => [
        ...prev,
        {
          tool: "text",
          color: activeColor,
          points: [{ x: pt.x, y: pt.y }],
          text: calloutText.trim(),
        },
      ]);
      return;
    }

    setCurrentAction({
      tool: activeTool,
      color: activeColor,
      points: [{ x: pt.x, y: pt.y }],
    });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentAction) return;
    const pt = getCanvasPoint(e);
    if (currentAction.tool === "pen") {
      setCurrentAction({
        ...currentAction,
        points: [...currentAction.points, { x: pt.x, y: pt.y }],
      });
    } else {
      setCurrentAction({
        ...currentAction,
        points: [currentAction.points[0], { x: pt.x, y: pt.y }],
      });
    }
  };

  const handlePointerUp = () => {
    if (!currentAction) return;
    setActions((prev) => [...prev, currentAction]);
    setCurrentAction(null);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsSaving(true);
    try {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      await onSaveAnnotatedImage(dataUrl);
      onClose();
    } catch (err) {
      console.error("Failed to save annotated image:", err);
      alert("Failed to save annotated image.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !onAddPhotoComment) return;
    setPostingComment(true);
    try {
      const mentions = (
        commentText.match(/@([a-zA-Z0-9_.-]+(?:\s+[a-zA-Z0-9_.-]+)?)/g) || []
      ).map((m) => m.slice(1).trim());

      const newComment: Omit<PhotoComment, "id" | "createdAt"> = {
        author: authorName || "Crew Member",
        authorRole: "tech",
        text: commentText.trim(),
        mentions,
        pinX: pendingPinCoords?.xPct,
        pinY: pendingPinCoords?.yPct,
      };
      await onAddPhotoComment(newComment);
      setComments((prev) => [
        ...prev,
        {
          ...newComment,
          id: `c_${Date.now()}`,
          createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setCommentText("");
      setPendingPinCoords(null);
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(5, 7, 12, 0.94)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          maxWidth: "1050px",
          width: "100%",
          margin: "0 auto",
          background: "#11141d",
          border: "1px solid rgba(226, 176, 71, 0.35)",
          borderRadius: "16px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Toolbar */}
        <div
          style={{
            padding: "0.85rem 1.25rem",
            background: "#0b0d13",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
            <strong style={{ color: "#e2b047", fontSize: "0.95rem", marginRight: "0.5rem" }}>
              ✏️ Photo Markup & Visual @Comments
            </strong>

            {(
              [
                { id: "arrow", label: "↗️ Arrow" },
                { id: "circle", label: "⭕ Circle Damage" },
                { id: "pen", label: "🖊️ Draw" },
                { id: "text", label: "🏷️ Stamp Label" },
                { id: "comment_pin", label: "📍 Drop @Comment Pin" },
              ] as { id: ToolType; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTool(t.id)}
                style={{
                  padding: "6px 11px",
                  borderRadius: "8px",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  border:
                    activeTool === t.id
                      ? "1px solid #e2b047"
                      : "1px solid rgba(255,255,255,0.12)",
                  background:
                    activeTool === t.id ? "rgba(226, 176, 71, 0.2)" : "rgba(255,255,255,0.04)",
                  color: activeTool === t.id ? "#e2b047" : "#e2e8f0",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            {COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                title={c.label}
                onClick={() => setActiveColor(c.hex)}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: c.hex,
                  border:
                    activeColor === c.hex ? "3px solid #ffffff" : "1px solid rgba(255,255,255,0.3)",
                  cursor: "pointer",
                }}
              />
            ))}

            <button
              type="button"
              onClick={() => setActions((prev) => prev.slice(0, -1))}
              disabled={actions.length === 0}
              style={{
                padding: "5px 10px",
                borderRadius: "6px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#cbd5e1",
                fontSize: "0.75rem",
                cursor: actions.length === 0 ? "not-allowed" : "pointer",
                opacity: actions.length === 0 ? 0.4 : 1,
              }}
            >
              ↩️ Undo
            </button>
          </div>
        </div>

        {/* Text Callout Bar when 'text' tool is active */}
        {activeTool === "text" && (
          <div
            style={{
              padding: "0.6rem 1.25rem",
              background: "rgba(226, 176, 71, 0.08)",
              borderBottom: "1px solid rgba(226, 176, 71, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: "0.78rem", color: "#e2b047", fontWeight: 700 }}>
              Tap anywhere on the photo to stamp this callout:
            </span>
            <input
              type="text"
              value={calloutText}
              onChange={(e) => setCalloutText(e.target.value)}
              placeholder="e.g. Hail Impact / Rotten Decking / Flashing Leak"
              style={{
                flex: "1 1 240px",
                padding: "6px 10px",
                borderRadius: "6px",
                background: "#090b10",
                border: "1px solid rgba(226, 176, 71, 0.4)",
                color: "#fff",
                fontSize: "0.82rem",
              }}
            />
          </div>
        )}

        {/* Main Workspace: Canvas + Photo Comments Sidebar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 0.9fr)",
            gap: "1rem",
            padding: "1rem",
          }}
        >
          {/* Canvas Container */}
          <div
            style={{
              position: "relative",
              background: "#07090e",
              borderRadius: "12px",
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxHeight: "65vh",
            }}
          >
            <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
              <canvas
                ref={canvasRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  maxWidth: "100%",
                  maxHeight: "62vh",
                  width: "auto",
                  height: "auto",
                  display: "block",
                  touchAction: "none",
                  cursor: activeTool === "comment_pin" ? "crosshair" : "pointer",
                }}
              />

              {/* Render numbered comment pins on top of photo */}
              {comments.map((c, idx) =>
                typeof c.pinX === "number" && typeof c.pinY === "number" ? (
                  <div
                    key={c.id || idx}
                    title={`${c.author}: ${c.text}`}
                    style={{
                      position: "absolute",
                      left: `${c.pinX}%`,
                      top: `${c.pinY}%`,
                      transform: "translate(-50%, -50%)",
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: "#e2b047",
                      color: "#090b10",
                      fontWeight: 900,
                      fontSize: "0.75rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 10px rgba(0,0,0,0.8)",
                      border: "2px solid #ffffff",
                      pointerEvents: "none",
                    }}
                  >
                    {idx + 1}
                  </div>
                ) : null
              )}

              {pendingPinCoords && (
                <div
                  style={{
                    position: "absolute",
                    left: `${pendingPinCoords.xPct}%`,
                    top: `${pendingPinCoords.yPct}%`,
                    transform: "translate(-50%, -50%)",
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "#ef4444",
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 14px rgba(239,68,68,0.9)",
                    border: "2px solid #ffffff",
                    pointerEvents: "none",
                  }}
                >
                  +
                </div>
              )}
            </div>
          </div>

          {/* Photo-Pinned Comments & @Mentions Column */}
          <div
            style={{
              background: "#0b0d13",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              maxHeight: "65vh",
            }}
          >
            <div
              style={{
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#f8fafc",
                marginBottom: "0.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>💬 Photo Comments ({comments.length})</span>
              <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
                Tap &ldquo;📍 Drop @Comment Pin&rdquo; to mark a spot
              </span>
            </div>

            <div
              style={{
                flex: "1 1 auto",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
                marginBottom: "0.75rem",
              }}
            >
              {comments.length === 0 ? (
                <p style={{ fontSize: "0.78rem", color: "#64748b", margin: "1rem 0" }}>
                  No comments on this photo yet. Tag a crew member with @Name to notify them about a specific detail on this photo.
                </p>
              ) : (
                comments.map((c, idx) => (
                  <div
                    key={c.id || idx}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "8px",
                      padding: "0.6rem 0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.72rem",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <strong style={{ color: "#e2b047" }}>
                        {typeof c.pinX === "number" ? `#${idx + 1} ` : ""}
                        {c.author}
                      </strong>
                      <span style={{ color: "#64748b" }}>{c.createdAt}</span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "#e2e8f0", margin: 0, lineHeight: 1.4 }}>
                      {c.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Quick @Mention Chips */}
            {technicians.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  flexWrap: "wrap",
                  marginBottom: "0.5rem",
                }}
              >
                {technicians.slice(0, 5).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCommentText((prev) => `${prev} @${t} `.trimStart())}
                    style={{
                      background: "rgba(56, 189, 248, 0.1)",
                      border: "1px solid rgba(56, 189, 248, 0.3)",
                      color: "#38bdf8",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontSize: "0.68rem",
                      cursor: "pointer",
                    }}
                  >
                    @{t.split(" ")[0]}
                  </button>
                ))}
              </div>
            )}

            {onAddPhotoComment && (
              <form onSubmit={handlePostComment} style={{ display: "flex", gap: "0.4rem" }}>
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    pendingPinCoords
                      ? `Comment at pin (${pendingPinCoords.xPct}%, ${pendingPinCoords.yPct}%)...`
                      : "Comment or @mention crew on this photo..."
                  }
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    borderRadius: "8px",
                    background: "#11141d",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "#fff",
                    fontSize: "0.78rem",
                  }}
                />
                <button
                  type="submit"
                  disabled={postingComment || !commentText.trim()}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "8px",
                    background: "#e2b047",
                    color: "#090b10",
                    fontWeight: 800,
                    fontSize: "0.76rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div
          style={{
            padding: "0.85rem 1.25rem",
            background: "#0b0d13",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#94a3b8",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel / Close
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || actions.length === 0}
            style={{
              padding: "9px 20px",
              borderRadius: "8px",
              background: actions.length > 0 ? "#e2b047" : "rgba(255,255,255,0.08)",
              color: actions.length > 0 ? "#090b10" : "#64748b",
              border: "none",
              fontSize: "0.85rem",
              fontWeight: 800,
              cursor: actions.length > 0 ? "pointer" : "not-allowed",
            }}
          >
            {isSaving ? "Saving Annotated HD Photo..." : "💾 Save Markup to Photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
