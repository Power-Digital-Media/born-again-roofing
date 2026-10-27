"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { ProjectMessage, PinType } from "@/lib/db";

interface CrewMessengerPanelProps {
    currentAuthorName: string;
    currentAuthorRole: "tech" | "admin";
    crewMembers: { name: string; role?: string }[];
    pins: PinType[];
    authHeaders?: () => Record<string, string>;
    clientId?: string;
    onOpenProject?: (pin: PinType) => void;
}

export default function CrewMessengerPanel({
    currentAuthorName,
    currentAuthorRole,
    crewMembers,
    pins,
    authHeaders,
    clientId,
    onOpenProject,
}: CrewMessengerPanelProps) {
    const [activeFilter, setActiveFilter] = useState<"all" | "general" | "mentions" | "homeowner" | "project">("all");
    const [selectedPinId, setSelectedPinId] = useState<string>("general-crew");
    const [messages, setMessages] = useState<ProjectMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (clientId) params.set("clientId", clientId);
            if (activeFilter === "general") {
                params.set("pinId", "general-crew");
            } else if (activeFilter === "mentions" && currentAuthorName) {
                params.set("mention", currentAuthorName);
            } else if (activeFilter === "project" && selectedPinId !== "general-crew") {
                params.set("pinId", selectedPinId);
            }
            const res = await fetch(`/api/messages?${params.toString()}`, {
                headers: authHeaders ? authHeaders() : {},
            });
            const data = await res.json();
            if (data.messages && Array.isArray(data.messages)) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error("Failed to fetch crew messages:", err);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, selectedPinId, currentAuthorName, clientId, authHeaders]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleInsertMention = (name: string) => {
        setText((prev) => `${prev}${prev.endsWith(" ") || prev.length === 0 ? "" : " "}@${name} `);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;
        setSending(true);
        try {
            const targetPinId = activeFilter === "project" ? selectedPinId : selectedPinId || "general-crew";
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(authHeaders ? authHeaders() : {}),
                },
                body: JSON.stringify({
                    pinId: targetPinId,
                    clientId,
                    author: currentAuthorName || "Field Tech",
                    authorRole: currentAuthorRole,
                    text: text.trim(),
                }),
            });
            const data = await res.json();
            if (data.success && data.message) {
                setMessages((prev) => [data.message, ...prev]);
                setText("");
            }
        } catch (err) {
            console.error("Error sending message:", err);
        } finally {
            setSending(false);
        }
    };

    const filteredMessages = messages.filter((m) => {
        if (activeFilter === "homeowner") return m.authorRole === "homeowner";
        return true;
    });

    const getPinLabel = (pinId: string) => {
        if (pinId === "general" || pinId === "general-crew") return "👷 #General Crew Chat";
        const found = pins.find((p) => p.id === pinId);
        if (!found) return `📍 Job #${pinId.slice(-5)}`;
        return `📍 ${found.customerName || found.service} (${found.location})`;
    };

    return (
        <div
            style={{
                background: "#16161f",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: 20,
                display: "flex",
                flexDirection: "column",
                gap: 16,
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                        💬 Crew &amp; Project Messenger
                        <span
                            style={{
                                fontSize: 11,
                                padding: "3px 8px",
                                borderRadius: 99,
                                background: "rgba(34,197,94,0.15)",
                                color: "#4ade80",
                                fontWeight: 700,
                            }}
                        >
                            Live Sync
                        </span>
                    </h3>
                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
                        Tag <strong style={{ color: "#e2e8f0" }}>@CrewMember</strong> to alert teammates, chat inside any job folder, or view homeowner portal replies.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={fetchMessages}
                    style={{
                        padding: "7px 12px",
                        borderRadius: 8,
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        color: "#cbd5e1",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    🔄 Refresh Feed
                </button>
            </div>

            {/* Filter Pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(
                    [
                        { id: "all", label: "🔥 All Activity" },
                        { id: "general", label: "👷 #General Crew" },
                        { id: "project", label: "📌 By Job Folder" },
                        { id: "mentions", label: `🔔 @${currentAuthorName || "Me"}` },
                        { id: "homeowner", label: "🏠 Homeowner Replies" },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilter(tab.id)}
                        style={{
                            padding: "8px 14px",
                            borderRadius: 99,
                            border: activeFilter === tab.id ? "1px solid #d4af37" : "1px solid rgba(255,255,255,0.1)",
                            background: activeFilter === tab.id ? "rgba(212,175,55,0.18)" : "rgba(255,255,255,0.04)",
                            color: activeFilter === tab.id ? "#f8fafc" : "#94a3b8",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Composer Box */}
            <form
                onSubmit={handleSendMessage}
                style={{
                    background: "#0d0d14",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Post To:</span>
                    <select
                        value={selectedPinId}
                        onChange={(e) => setSelectedPinId(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: 200,
                            padding: "8px 12px",
                            borderRadius: 8,
                            background: "#16161f",
                            border: "1px solid rgba(255,255,255,0.14)",
                            color: "#fff",
                            fontSize: 13,
                        }}
                    >
                        <option value="general-crew">👷 #General Crew Chat (Company-Wide)</option>
                        {pins.map((p) => (
                            <option key={p.id} value={p.id}>
                                📍 {p.customerName ? `${p.customerName} — ` : ""}
                                {p.service} in {p.location} ({p.date})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quick @Mention Chips */}
                {crewMembers.length > 0 && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Quick @Mention:</span>
                        {crewMembers.map((m) => (
                            <button
                                key={m.name}
                                type="button"
                                onClick={() => handleInsertMention(m.name)}
                                style={{
                                    padding: "3px 9px",
                                    borderRadius: 99,
                                    background: "rgba(59,130,246,0.12)",
                                    border: "1px solid rgba(59,130,246,0.3)",
                                    color: "#93c5fd",
                                    fontSize: 11,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                }}
                            >
                                @{m.name}
                            </button>
                        ))}
                    </div>
                )}

                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={`Write a message as ${currentAuthorName || "Field Tech"}... (Use @Name to tag crew)`}
                        style={{
                            flex: 1,
                            padding: "11px 14px",
                            borderRadius: 10,
                            background: "#16161f",
                            border: "1px solid rgba(255,255,255,0.14)",
                            color: "#fff",
                            fontSize: 14,
                        }}
                    />
                    <button
                        type="submit"
                        disabled={sending || !text.trim()}
                        style={{
                            padding: "0 20px",
                            borderRadius: 10,
                            background: sending || !text.trim() ? "#334155" : "linear-gradient(135deg, #d4af37, #b5952f)",
                            border: "none",
                            color: sending || !text.trim() ? "#94a3b8" : "#000",
                            fontWeight: 800,
                            fontSize: 13,
                            cursor: sending || !text.trim() ? "not-allowed" : "pointer",
                        }}
                    >
                        {sending ? "Sending..." : "Send 💬"}
                    </button>
                </div>
            </form>

            {/* Message Feed */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 460, overflowY: "auto" }}>
                {loading ? (
                    <div style={{ padding: 28, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>Loading crew messages...</div>
                ) : filteredMessages.length === 0 ? (
                    <div
                        style={{
                            padding: 28,
                            textAlign: "center",
                            color: "#64748b",
                            fontSize: 13,
                            background: "rgba(255,255,255,0.02)",
                            borderRadius: 12,
                            border: "1px dashed rgba(255,255,255,0.08)",
                        }}
                    >
                        No messages in this channel yet. Start a conversation or tag a teammate above!
                    </div>
                ) : (
                    filteredMessages.map((msg) => {
                        const associatedPin = pins.find((p) => p.id === msg.pinId);
                        const roleBadgeColor =
                            msg.authorRole === "homeowner"
                                ? { bg: "rgba(16,185,129,0.18)", text: "#34d399", label: "🏠 HOMEOWNER" }
                                : msg.authorRole === "admin"
                                ? { bg: "rgba(212,175,55,0.2)", text: "#facc15", label: "⭐ OFFICE / ADMIN" }
                                : { bg: "rgba(59,130,246,0.18)", text: "#60a5fa", label: "👷 FIELD TECH" };

                        return (
                            <div
                                key={msg.id}
                                style={{
                                    padding: 14,
                                    borderRadius: 12,
                                    background: "#0d0d14",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 6,
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                        <span style={{ fontWeight: 800, color: "#f8fafc", fontSize: 13 }}>{msg.author}</span>
                                        <span
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 800,
                                                padding: "2px 7px",
                                                borderRadius: 99,
                                                background: roleBadgeColor.bg,
                                                color: roleBadgeColor.text,
                                            }}
                                        >
                                            {roleBadgeColor.label}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (associatedPin && onOpenProject) {
                                                    onOpenProject(associatedPin);
                                                } else if (msg.pinId !== "general-crew") {
                                                    setSelectedPinId(msg.pinId);
                                                    setActiveFilter("project");
                                                }
                                            }}
                                            style={{
                                                fontSize: 11,
                                                padding: "2px 8px",
                                                borderRadius: 6,
                                                background: "rgba(255,255,255,0.06)",
                                                border: "1px solid rgba(255,255,255,0.1)",
                                                color: "#cbd5e1",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {getPinLabel(msg.pinId)}
                                        </button>
                                    </div>
                                    <span style={{ fontSize: 11, color: "#64748b" }}>
                                        {new Date(msg.createdAt).toLocaleString([], {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>

                                <div style={{ fontSize: 14, color: "#e2e8f0", lineHeight: 1.5 }}>{msg.text}</div>

                                {/* Mention SMS Quick-Nudge */}
                                {msg.mentions && msg.mentions.length > 0 && (
                                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4, flexWrap: "wrap" }}>
                                        {msg.mentions.map((mentioned: string) => (
                                            <a
                                                key={mentioned}
                                                href={`sms:?&body=${encodeURIComponent(
                                                    `Hey ${mentioned}, ${msg.author} tagged you on PinDrop (${getPinLabel(msg.pinId)}): "${msg.text}"`
                                                )}`}
                                                style={{
                                                    fontSize: 11,
                                                    color: "#38bdf8",
                                                    textDecoration: "none",
                                                    background: "rgba(56,189,248,0.1)",
                                                    padding: "3px 8px",
                                                    borderRadius: 6,
                                                    border: "1px solid rgba(56,189,248,0.25)",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                📲 Send SMS Alert to @{mentioned}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
