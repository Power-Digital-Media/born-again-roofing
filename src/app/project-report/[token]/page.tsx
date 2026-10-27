"use client";

import React, { useEffect, useState, useRef, use } from "react";
import type { PinType, ProjectMessage, PinPhotoMeta } from "@/lib/db";
import { BeforeAfterSlider } from "@/components/BeforeAfterBuilder";

export default function ProjectReportPage({ params }: { params: Promise<{ token: string }> }) {
    const resolvedParams = use(params);
    const token = resolvedParams.token;

    const [pin, setPin] = useState<PinType | null>(null);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<ProjectMessage[]>([]);
    const [homeownerName, setHomeownerName] = useState("");
    const [replyText, setReplyText] = useState("");
    const [sendingReply, setSendingReply] = useState(false);

    // Signature state
    const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [signerName, setSignerName] = useState("");
    const [agreementType, setAgreementType] = useState<"material_approval" | "completion_signoff">("completion_signoff");
    const [sigSaved, setSigSaved] = useState(false);

    useEffect(() => {
        async function loadReport() {
            setLoading(true);
            try {
                const res = await fetch(`/api/pins?reportToken=${encodeURIComponent(token)}`);
                if (res.ok) {
                    const data = await res.json();
                    setPin(data);
                    if (data.customerName) {
                        setHomeownerName(data.customerName);
                        setSignerName(data.customerName);
                    }
                }
                const msgRes = await fetch(`/api/messages?reportToken=${encodeURIComponent(token)}`);
                if (msgRes.ok) {
                    const msgData = await msgRes.json();
                    if (msgData.messages) setMessages(msgData.messages);
                }
            } catch (err) {
                console.error("Failed to load project report:", err);
            } finally {
                setLoading(false);
            }
        }
        loadReport();
    }, [token]);

    const handleSendHomeownerMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !pin) return;
        setSendingReply(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pinId: pin.id,
                    reportToken: token,
                    author: homeownerName.trim() || "Homeowner",
                    authorRole: "homeowner",
                    text: replyText.trim(),
                }),
            });
            const data = await res.json();
            if (data.success && data.message) {
                setMessages((prev) => [data.message, ...prev]);
                setReplyText("");
            }
        } catch (err) {
            console.error("Failed to send homeowner message:", err);
        } finally {
            setSendingReply(false);
        }
    };

    const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        const y = "touches" in e ? e.touches[0].clientY : e.clientY;
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x - rect.left, y - rect.top);
        setIsDrawing(true);
    };

    const moveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = "touches" in e ? e.touches[0].clientX : e.clientX;
        const y = "touches" in e ? e.touches[0].clientY : e.clientY;
        ctx.lineTo(x - rect.left, y - rect.top);
        ctx.stroke();
    };

    const handleSaveRemoteSignature = async () => {
        const canvas = sigCanvasRef.current;
        if (!canvas || !signerName.trim() || !pin) return;
        const signatureDataUrl = canvas.toDataURL("image/png");
        try {
            const res = await fetch("/api/pins", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: pin.id,
                    reportToken: token,
                    signatureOnly: true,
                    signatureItem: {
                        id: `sig_${Date.now()}`,
                        signerName: signerName.trim(),
                        signerRole: "Homeowner",
                        agreementText:
                            agreementType === "completion_signoff"
                                ? "Final Walkthrough & Completion Sign-Off"
                                : "Material & Scope Pre-Work Approval",
                        signatureDataUrl,
                        signedAt: new Date().toISOString(),
                    },
                }),
            });
            const data = await res.json();
            if (data.success && data.pin) {
                setPin(data.pin);
                setSigSaved(true);
            }
        } catch (err) {
            console.error("Failed saving signature:", err);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                Loading Official Project Photo Report...
            </div>
        );
    }

    if (!pin) {
        return (
            <div style={{ minHeight: "100vh", background: "#0d0d14", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
                <div>
                    <h1 style={{ fontSize: 24, marginBottom: 8 }}>Report Link Not Found</h1>
                    <p style={{ color: "#94a3b8" }}>Please verify the link with your project specialist.</p>
                </div>
            </div>
        );
    }

    const photos: PinPhotoMeta[] =
        pin.photoMeta && pin.photoMeta.length > 0
            ? pin.photoMeta
            : (pin.images || []).map((url, idx) => ({
                  url,
                  stage: idx === 0 ? "after" : "during",
                  caption: "",
                  author: pin.author,
                  capturedAt: pin.date,
                  isPublic: true,
              }));

    const beforePhoto = photos.find((p) => p.stage === "before");
    const afterPhoto = photos.find((p) => p.stage === "after");

    return (
        <div style={{ minHeight: "100vh", background: "#0f111a", color: "#f8fafc", padding: "32px 16px" }}>
            <style>{`
                @media print {
                    body { background: #ffffff !important; color: #000000 !important; }
                    .no-print { display: none !important; }
                    .print-card { background: #ffffff !important; color: #000000 !important; border: 1px solid #cbd5e1 !important; break-inside: avoid; }
                }
            `}</style>

            <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Official Report Header */}
                <div
                    className="print-card"
                    style={{
                        background: "#161926",
                        border: "1px solid rgba(212,175,55,0.35)",
                        borderRadius: 18,
                        padding: 24,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 16,
                    }}
                >
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#d4af37", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                            BORN AGAIN ROOFING &amp; EXTERIORS • OFFICIAL DOCUMENTATION REPORT
                        </div>
                        <h1 style={{ margin: "6px 0 8px", fontSize: 28, fontWeight: 900 }}>
                            {pin.service} — {pin.location}
                        </h1>
                        <div style={{ fontSize: 14, color: "#cbd5e1", display: "flex", gap: 16, flexWrap: "wrap" }}>
                            <span>📅 <strong>Date:</strong> {pin.date}</span>
                            <span>👷 <strong>Specialist:</strong> {pin.author}</span>
                            <span>📸 <strong>Verified Photos:</strong> {photos.length}</span>
                        </div>
                        {pin.description && (
                            <p style={{ marginTop: 14, marginBottom: 0, fontSize: 15, lineHeight: 1.6, color: "#e2e8f0" }}>
                                {pin.description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        className="no-print"
                        onClick={() => window.print()}
                        style={{
                            padding: "12px 20px",
                            borderRadius: 12,
                            background: "linear-gradient(135deg, #d4af37, #b5952f)",
                            border: "none",
                            color: "#000",
                            fontWeight: 800,
                            fontSize: 14,
                            cursor: "pointer",
                            boxShadow: "0 8px 20px rgba(212,175,55,0.25)",
                        }}
                    >
                        🖨️ Print / Save Official PDF
                    </button>
                </div>

                {/* Interactive Before & After Slider */}
                {beforePhoto && afterPhoto && (
                    <div
                        className="print-card no-print"
                        style={{
                            background: "#161926",
                            borderRadius: 18,
                            padding: 20,
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        <h2 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800, color: "#fde047" }}>
                            ⚡ Interactive Before &amp; After Comparison
                        </h2>
                        <BeforeAfterSlider beforeUrl={beforePhoto.url} afterUrl={afterPhoto.url} height={380} />
                    </div>
                )}

                {/* Walkthrough Video if recorded */}
                {pin.walkthroughVideoUrl && (
                    <div
                        className="no-print"
                        style={{
                            background: "#161926",
                            borderRadius: 18,
                            padding: 20,
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        <h2 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800 }}>🎥 Specialist Video Walkthrough</h2>
                        <video
                            src={pin.walkthroughVideoUrl}
                            controls
                            style={{ width: "100%", maxHeight: 440, borderRadius: 12, background: "#000" }}
                        />
                    </div>
                )}

                {/* Stage-Grouped HD Photo Timeline */}
                <div
                    className="print-card"
                    style={{
                        background: "#161926",
                        borderRadius: 18,
                        padding: 24,
                        border: "1px solid rgba(255,255,255,0.1)",
                    }}
                >
                    <h2 style={{ margin: "0 0 16px", fontSize: 20, fontWeight: 800 }}>
                        📸 High-Resolution Inspection &amp; Progress Photos ({photos.length})
                    </h2>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: 16,
                        }}
                    >
                        {photos.map((item, idx) => (
                            <div
                                key={`${item.url}-${idx}`}
                                className="print-card"
                                style={{
                                    background: "#0f111a",
                                    borderRadius: 12,
                                    overflow: "hidden",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <div style={{ position: "relative" }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={item.url}
                                        alt={item.caption || `Project photo ${idx + 1}`}
                                        style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
                                    />
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 10,
                                            left: 10,
                                            padding: "4px 10px",
                                            borderRadius: 99,
                                            background: "rgba(0,0,0,0.75)",
                                            color: "#fde047",
                                            fontSize: 11,
                                            fontWeight: 800,
                                            textTransform: "uppercase",
                                        }}
                                    >
                                        {item.stage}
                                    </span>
                                </div>
                                <div style={{ padding: 12 }}>
                                    {item.caption && (
                                        <div style={{ fontSize: 13, fontWeight: 600, color: "#f8fafc", marginBottom: 4 }}>
                                            {item.caption}
                                        </div>
                                    )}
                                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                        Verified by {item.author || pin.author}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Two-Way Homeowner Messenger */}
                <div
                    className="no-print"
                    style={{
                        background: "#161926",
                        borderRadius: 18,
                        padding: 24,
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>
                        💬 Direct Project Messenger — Ask Your Specialist a Question
                    </h2>
                    <form onSubmit={handleSendHomeownerMessage} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            <input
                                type="text"
                                value={homeownerName}
                                onChange={(e) => setHomeownerName(e.target.value)}
                                placeholder="Your Name"
                                style={{
                                    width: 220,
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    background: "#0f111a",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    color: "#fff",
                                    fontSize: 14,
                                }}
                            />
                            <input
                                type="text"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type a question or comment for the crew..."
                                style={{
                                    flex: 1,
                                    minWidth: 220,
                                    padding: "10px 14px",
                                    borderRadius: 10,
                                    background: "#0f111a",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    color: "#fff",
                                    fontSize: 14,
                                }}
                            />
                            <button
                                type="submit"
                                disabled={sendingReply || !replyText.trim()}
                                style={{
                                    padding: "10px 20px",
                                    borderRadius: 10,
                                    background: "linear-gradient(135deg, #d4af37, #b5952f)",
                                    border: "none",
                                    color: "#000",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                }}
                            >
                                {sendingReply ? "Sending..." : "Send Message"}
                            </button>
                        </div>
                    </form>

                    {messages.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    style={{
                                        padding: 12,
                                        borderRadius: 10,
                                        background: "#0f111a",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                    }}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}>
                                        <strong style={{ color: "#fff" }}>{m.author}</strong>
                                        <span>{new Date(m.createdAt).toLocaleString()}</span>
                                    </div>
                                    <div style={{ fontSize: 14, color: "#e2e8f0", marginTop: 4 }}>{m.text}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Customer Digital Sign-Off */}
                <div
                    className="print-card"
                    style={{
                        background: "#161926",
                        borderRadius: 18,
                        padding: 24,
                        border: "1px solid rgba(255,255,255,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 14,
                    }}
                >
                    <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800 }}>✍️ Customer Digital Sign-Off &amp; Approval</h2>
                    {pin.signatures && pin.signatures.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {pin.signatures.map((s) => (
                                <div
                                    key={s.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: 12,
                                        borderRadius: 10,
                                        background: "rgba(34,197,94,0.12)",
                                        border: "1px solid rgba(34,197,94,0.35)",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 800, color: "#4ade80" }}>✓ Signed by {s.signerName}</div>
                                        <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                                            {s.agreementText} • {new Date(s.signedAt).toLocaleString()}
                                        </div>
                                    </div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={s.signatureDataUrl}
                                        alt="Signature"
                                        style={{ height: 48, background: "#fff", padding: 4, borderRadius: 6 }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {!sigSaved && (
                        <div className="no-print" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                <input
                                    type="text"
                                    value={signerName}
                                    onChange={(e) => setSignerName(e.target.value)}
                                    placeholder="Your Full Legal Name"
                                    style={{
                                        flex: 1,
                                        minWidth: 200,
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        background: "#0f111a",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        color: "#fff",
                                    }}
                                />
                                <select
                                    value={agreementType}
                                    onChange={(e) =>
                                        setAgreementType(e.target.value as "material_approval" | "completion_signoff")
                                    }
                                    style={{
                                        flex: 1,
                                        minWidth: 220,
                                        padding: "10px 14px",
                                        borderRadius: 10,
                                        background: "#0f111a",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                        color: "#fff",
                                    }}
                                >
                                    <option value="completion_signoff">Final Walkthrough &amp; Completion Sign-Off</option>
                                    <option value="material_approval">Material &amp; Scope Pre-Work Approval</option>
                                </select>
                            </div>
                            <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden" }}>
                                <canvas
                                    ref={sigCanvasRef}
                                    width={600}
                                    height={150}
                                    onMouseDown={startDraw}
                                    onMouseMove={moveDraw}
                                    onMouseUp={() => setIsDrawing(false)}
                                    onTouchStart={startDraw}
                                    onTouchMove={moveDraw}
                                    onTouchEnd={() => setIsDrawing(false)}
                                    style={{ width: "100%", height: 150, touchAction: "none", cursor: "crosshair" }}
                                />
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={handleSaveRemoteSignature}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: 10,
                                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                        border: "none",
                                        color: "#fff",
                                        fontWeight: 800,
                                        cursor: "pointer",
                                    }}
                                >
                                    ✍️ Submit Digital Signature
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
