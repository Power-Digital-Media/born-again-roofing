"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import type {
    PinType,
    PinPhotoMeta,
    PhotoStage,
    ChecklistItem,
    ProjectDocument,
    ProjectSignature,
    ProjectMessage,
    PhotoComment,
} from "@/lib/db";
import { compressAndPreparePhoto, getDefaultChecklistForService } from "@/lib/exif-gps";
import PhotoMarkupModal from "@/components/PhotoMarkupModal";
import { BeforeAfterSlider, generateBeforeAfterCompositeDataUrl } from "@/components/BeforeAfterBuilder";
import GhostCameraModal from "@/components/GhostCameraModal";

interface ProjectWorkspaceModalProps {
    pin: PinType;
    companyName: string;
    currentTechName: string;
    crewMembers: { name: string; role?: string }[];
    authHeaders?: () => Record<string, string>;
    clientId?: string;
    onClose: () => void;
    onUpdated: (updatedPin: PinType) => void;
}

export default function ProjectWorkspaceModal({
    pin,
    companyName,
    currentTechName,
    crewMembers,
    authHeaders,
    clientId,
    onClose,
    onUpdated,
}: ProjectWorkspaceModalProps) {
    const [activeTab, setActiveTab] = useState<"photos" | "chat" | "checklist" | "docs" | "portal">("photos");
    const [saving, setSaving] = useState(false);
    const [statusMsg, setStatusMsg] = useState("");

    // Editable project state
    const [projectStatus, setProjectStatus] = useState<"in_progress" | "inspection" | "completed">(
        pin.projectStatus || "completed"
    );
    const [publishToPublicMap, setPublishToPublicMap] = useState<boolean>(pin.publishToPublicMap !== false);
    const [customerName, setCustomerName] = useState(pin.customerName || "");
    const [customerPhone, setCustomerPhone] = useState(pin.customerPhone || "");
    const [streetAddress, setStreetAddress] = useState(pin.streetAddress || "");
    const [internalNotes, setInternalNotes] = useState(pin.internalNotes || "");
    const [beforeAfterCollageUrl, setBeforeAfterCollageUrl] = useState(pin.beforeAfterCollageUrl || "");
    const [walkthroughVideoUrl, setWalkthroughVideoUrl] = useState(pin.walkthroughVideoUrl || "");

    // Hydrate photoMeta from pin.photoMeta or fallback to pin.images
    const [photoMeta, setPhotoMeta] = useState<PinPhotoMeta[]>(() => {
        if (pin.photoMeta && pin.photoMeta.length > 0) return pin.photoMeta;
        return (pin.images || []).map((url, idx) => ({
            url,
            stage: idx === 0 ? "after" : "during",
            caption: "",
            author: pin.author || currentTechName,
            capturedAt: pin.date || new Date().toISOString(),
            isPublic: true,
            comments: [],
        }));
    });

    const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
        if (pin.checklist && pin.checklist.length > 0) return pin.checklist;
        return getDefaultChecklistForService(pin.service).map((item) => ({
            ...item,
            completed: false,
        }));
    });
    const [newChecklistLabel, setNewChecklistLabel] = useState("");

    const [documents, setDocuments] = useState<ProjectDocument[]>(pin.documents || []);
    const [signatures, setSignatures] = useState<ProjectSignature[]>(pin.signatures || []);

    // Modals & tools inside workspace
    const [markupIndex, setMarkupIndex] = useState<number | null>(null);
    const [ghostCamMode, setGhostCamMode] = useState<"ghost_photo" | "video_walkthrough" | null>(null);
    const [stampWatermark, setStampWatermark] = useState(true);
    const [uploadingPhotos, setUploadingPhotos] = useState(false);
    const [generatingCollage, setGeneratingCollage] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState(false);

    // Project chat state
    const [messages, setMessages] = useState<ProjectMessage[]>([]);
    const [chatText, setChatText] = useState("");
    const [sendingChat, setSendingChat] = useState(false);

    // E-Signature Canvas state
    const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isDrawingSig, setIsDrawingSig] = useState(false);
    const [signerName, setSignerName] = useState(pin.customerName || "");
    const [agreementType, setAgreementType] = useState<"material_approval" | "completion_signoff">("completion_signoff");

    const fetchProjectMessages = useCallback(async () => {
        try {
            const params = new URLSearchParams({ pinId: pin.id });
            if (clientId) params.set("clientId", clientId);
            const res = await fetch(`/api/messages?${params.toString()}`, {
                headers: authHeaders ? authHeaders() : {},
            });
            const data = await res.json();
            if (data.messages && Array.isArray(data.messages)) {
                setMessages(data.messages);
            }
        } catch (err) {
            console.error("Failed to load project chat:", err);
        }
    }, [pin.id, clientId, authHeaders]);

    useEffect(() => {
        fetchProjectMessages();
    }, [fetchProjectMessages]);

    const uploadDataUrlToStorage = async (dataUrl: string): Promise<string> => {
        const upRes = await fetch("/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(authHeaders ? authHeaders() : {}),
            },
            body: JSON.stringify({ base64Data: dataUrl }),
        });
        const upData = await upRes.json();
        return upData.url || dataUrl;
    };

    const persistPinChanges = async (overrides?: Partial<PinType>) => {
        setSaving(true);
        setStatusMsg("Saving folder...");
        try {
            const nextPhotoMeta = overrides?.photoMeta || photoMeta;
            const publicImages = nextPhotoMeta.filter((m) => m.isPublic !== false).map((m) => m.url);
            const payload = {
                id: pin.id,
                clientId,
                projectStatus,
                publishToPublicMap,
                customerName,
                customerPhone,
                streetAddress,
                internalNotes,
                photoMeta: nextPhotoMeta,
                images: publicImages.length > 0 ? publicImages : nextPhotoMeta.map((m) => m.url),
                beforeAfterCollageUrl: overrides?.beforeAfterCollageUrl ?? beforeAfterCollageUrl,
                walkthroughVideoUrl: overrides?.walkthroughVideoUrl ?? walkthroughVideoUrl,
                checklist: overrides?.checklist || checklist,
                documents: overrides?.documents || documents,
                signatures: overrides?.signatures || signatures,
                ...overrides,
            };

            const res = await fetch("/api/pins", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    ...(authHeaders ? authHeaders() : {}),
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success && data.pin) {
                onUpdated(data.pin);
                setStatusMsg("✅ Saved to Cloud Folder");
                setTimeout(() => setStatusMsg(""), 2500);
            } else {
                setStatusMsg("⚠️ Save failed");
            }
        } catch (err) {
            console.error("Failed to save project workspace:", err);
            setStatusMsg("⚠️ Error saving");
        } finally {
            setSaving(false);
        }
    };

    const handleAddPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploadingPhotos(true);
        const files = Array.from(e.target.files);
        const added: PinPhotoMeta[] = [];

        for (const file of files) {
            try {
                const compressedDataUrl = await compressAndPreparePhoto(file, {
                    maxDimension: 1600,
                    quality: 0.82,
                    stampWatermark,
                    watermarkText: stampWatermark
                        ? {
                              dateStr: new Date().toLocaleString(),
                              locationStr: pin.location,
                              stageStr: "during",
                              authorStr: currentTechName,
                          }
                        : undefined,
                });
                const uploadedUrl = await uploadDataUrlToStorage(compressedDataUrl);
                added.push({
                    url: uploadedUrl,
                    stage: "during",
                    caption: "",
                    author: currentTechName,
                    capturedAt: new Date().toISOString(),
                    isPublic: true,
                    comments: [],
                });
            } catch (err) {
                console.error("Error adding photo to project:", err);
            }
        }

        const updatedMeta = [...photoMeta, ...added];
        setPhotoMeta(updatedMeta);
        setUploadingPhotos(false);
        await persistPinChanges({ photoMeta: updatedMeta });
    };

    const handleGenerateCollage = async () => {
        const beforeItem = photoMeta.find((p) => p.stage === "before") || photoMeta[0];
        const afterItem = photoMeta.find((p) => p.stage === "after") || photoMeta[photoMeta.length - 1];
        if (!beforeItem || !afterItem) return;
        setGeneratingCollage(true);
        try {
            const compositeDataUrl = await generateBeforeAfterCompositeDataUrl({
                beforeUrl: beforeItem.url,
                afterUrl: afterItem.url,
                companyName,
                service: pin.service,
                location: pin.location,
            });
            const uploadedUrl = await uploadDataUrlToStorage(compositeDataUrl);
            setBeforeAfterCollageUrl(uploadedUrl);
            const nextMeta: PinPhotoMeta[] = [
                {
                    url: uploadedUrl,
                    stage: "after",
                    caption: "Before & After Transformation",
                    author: currentTechName,
                    capturedAt: new Date().toISOString(),
                    isPublic: true,
                    comments: [],
                },
                ...photoMeta,
            ];
            setPhotoMeta(nextMeta);
            await persistPinChanges({ beforeAfterCollageUrl: uploadedUrl, photoMeta: nextMeta });
        } catch (err) {
            console.error("Failed generating collage:", err);
        } finally {
            setGeneratingCollage(false);
        }
    };

    const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploadingDoc(true);
        try {
            const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve(ev.target?.result as string);
                reader.onerror = (err) => reject(err);
                reader.readAsDataURL(file);
            });
            const uploadedUrl = await uploadDataUrlToStorage(dataUrl);
            const newDoc: ProjectDocument = {
                id: `doc_${Date.now()}`,
                name: file.name,
                url: uploadedUrl,
                uploadedAt: new Date().toISOString(),
                uploadedBy: currentTechName,
            };
            const nextDocs = [...documents, newDoc];
            setDocuments(nextDocs);
            await persistPinChanges({ documents: nextDocs });
        } catch (err) {
            console.error("Doc upload error:", err);
        } finally {
            setUploadingDoc(false);
        }
    };

    // Signature Canvas handlers
    const startSigDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsDrawingSig(true);
    };

    const moveSigDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawingSig) return;
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
        const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
    };

    const endSigDraw = () => {
        setIsDrawingSig(false);
    };

    const clearSigCanvas = () => {
        const canvas = sigCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleSaveSignature = async () => {
        const canvas = sigCanvasRef.current;
        if (!canvas || !signerName.trim()) return;
        const dataUrl = canvas.toDataURL("image/png");
        const uploadedSigUrl = await uploadDataUrlToStorage(dataUrl);
        const newSig: ProjectSignature = {
            id: `sig_${Date.now()}`,
            signerName: signerName.trim(),
            signerRole: "Homeowner",
            agreementText:
                agreementType === "completion_signoff"
                    ? "Final Walkthrough & Completion Satisfaction Sign-Off"
                    : "Material, Color & Scope Pre-Work Approval",
            signatureDataUrl: uploadedSigUrl,
            signedAt: new Date().toISOString(),
        };
        const nextSigs = [...signatures, newSig];
        setSignatures(nextSigs);
        clearSigCanvas();
        await persistPinChanges({ signatures: nextSigs });
    };

    const handleSendProjectMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatText.trim()) return;
        setSendingChat(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(authHeaders ? authHeaders() : {}),
                },
                body: JSON.stringify({
                    pinId: pin.id,
                    clientId,
                    author: currentTechName || "Field Tech",
                    authorRole: "tech",
                    text: chatText.trim(),
                }),
            });
            const data = await res.json();
            if (data.success && data.message) {
                setMessages((prev) => [data.message, ...prev]);
                setChatText("");
            }
        } catch (err) {
            console.error("Error posting project chat:", err);
        } finally {
            setSendingChat(false);
        }
    };

    const beforePhoto = photoMeta.find((p) => p.stage === "before");
    const afterPhoto = photoMeta.find((p) => p.stage === "after");
    const reportUrl =
        typeof window !== "undefined" && pin.reportToken
            ? `${window.location.origin}/project-report/${pin.reportToken}${clientId ? `?clientId=${clientId}` : ""}`
            : `/project-report/${pin.reportToken || ""}`;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9990,
                background: "rgba(0,0,0,0.88)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
                overflowY: "auto",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 960,
                    maxHeight: "92vh",
                    background: "#12121a",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 20,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.7)",
                }}
            >
                {/* Top Header Bar */}
                <div
                    style={{
                        padding: "16px 20px",
                        background: "#181824",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 12,
                    }}
                >
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                            <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: "#fff" }}>
                                🗂️ {customerName || pin.service} — {pin.location}
                            </h2>
                            <select
                                value={projectStatus}
                                onChange={(e) => {
                                    const next = e.target.value as "in_progress" | "inspection" | "completed";
                                    setProjectStatus(next);
                                    persistPinChanges({ projectStatus: next });
                                }}
                                style={{
                                    padding: "4px 10px",
                                    borderRadius: 99,
                                    background:
                                        projectStatus === "completed"
                                            ? "rgba(34,197,94,0.18)"
                                            : projectStatus === "in_progress"
                                            ? "rgba(59,130,246,0.2)"
                                            : "rgba(245,158,11,0.2)",
                                    color:
                                        projectStatus === "completed"
                                            ? "#4ade80"
                                            : projectStatus === "in_progress"
                                            ? "#60a5fa"
                                            : "#fbbf24",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    fontSize: 12,
                                    fontWeight: 800,
                                    cursor: "pointer",
                                }}
                            >
                                <option value="inspection" style={{ background: "#181824", color: "#fff" }}>
                                    🔍 Inspection Only
                                </option>
                                <option value="in_progress" style={{ background: "#181824", color: "#fff" }}>
                                    🚧 Active Job (In Progress)
                                </option>
                                <option value="completed" style={{ background: "#181824", color: "#fff" }}>
                                    ✅ Completed Project
                                </option>
                            </select>
                        </div>
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
                            {streetAddress ? `${streetAddress} • ` : ""}Tech: {pin.author} • Created {pin.date}
                            {statusMsg && (
                                <span style={{ marginLeft: 12, color: "#4ade80", fontWeight: 700 }}>{statusMsg}</span>
                            )}
                        </p>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button
                            type="button"
                            onClick={() => persistPinChanges()}
                            disabled={saving}
                            style={{
                                padding: "8px 16px",
                                borderRadius: 10,
                                background: "linear-gradient(135deg, #d4af37, #b5952f)",
                                border: "none",
                                color: "#000",
                                fontWeight: 800,
                                fontSize: 13,
                                cursor: "pointer",
                            }}
                        >
                            {saving ? "Saving..." : "💾 Save Folder"}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: "8px 14px",
                                borderRadius: 10,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                color: "#fff",
                                fontWeight: 700,
                                fontSize: 13,
                                cursor: "pointer",
                            }}
                        >
                            ✕ Close
                        </button>
                    </div>
                </div>

                {/* Sub-Tab Bar */}
                <div
                    style={{
                        display: "flex",
                        gap: 6,
                        padding: "10px 20px",
                        background: "#151520",
                        borderBottom: "1px solid rgba(255,255,255,0.08)",
                        overflowX: "auto",
                    }}
                >
                    {(
                        [
                            { id: "photos", label: `📸 Photos & Stages (${photoMeta.length})` },
                            { id: "chat", label: `💬 Job Chat (${messages.length})` },
                            {
                                id: "checklist",
                                label: `✅ SOP Checklist (${checklist.filter((c) => c.completed).length}/${checklist.length})`,
                            },
                            { id: "docs", label: `📄 Docs & PDFs (${documents.length})` },
                            { id: "portal", label: `✍️ E-Sign & Customer Portal` },
                        ] as const
                    ).map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            onClick={() => setActiveTab(t.id)}
                            style={{
                                padding: "9px 14px",
                                borderRadius: 10,
                                border: activeTab === t.id ? "1px solid #d4af37" : "1px solid transparent",
                                background: activeTab === t.id ? "rgba(212,175,55,0.16)" : "rgba(255,255,255,0.04)",
                                color: activeTab === t.id ? "#fff" : "#94a3b8",
                                fontWeight: 700,
                                fontSize: 13,
                                whiteSpace: "nowrap",
                                cursor: "pointer",
                            }}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Body Content */}
                <div style={{ padding: 20, overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
                    {activeTab === "photos" && (
                        <>
                            {/* Action Toolbar */}
                            <div
                                style={{
                                    display: "flex",
                                    gap: 10,
                                    flexWrap: "wrap",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    background: "#181824",
                                    padding: 14,
                                    borderRadius: 12,
                                    border: "1px solid rgba(255,255,255,0.07)",
                                }}
                            >
                                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                                    <label
                                        style={{
                                            padding: "9px 14px",
                                            borderRadius: 10,
                                            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                                            color: "#fff",
                                            fontWeight: 800,
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                    >
                                        {uploadingPhotos ? "Uploading HD..." : "➕ Add HD Photos"}
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleAddPhotos}
                                            style={{ display: "none" }}
                                        />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setGhostCamMode("ghost_photo")}
                                        style={{
                                            padding: "9px 14px",
                                            borderRadius: 10,
                                            background: "rgba(168,85,247,0.18)",
                                            border: "1px solid rgba(168,85,247,0.4)",
                                            color: "#e9d5ff",
                                            fontWeight: 700,
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                    >
                                        👻 Ghost Cam
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setGhostCamMode("video_walkthrough")}
                                        style={{
                                            padding: "9px 14px",
                                            borderRadius: 10,
                                            background: "rgba(239,68,68,0.16)",
                                            border: "1px solid rgba(239,68,68,0.4)",
                                            color: "#fca5a5",
                                            fontWeight: 700,
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                    >
                                        🎥 Video Walkthrough
                                    </button>

                                    {photoMeta.length >= 2 && (
                                        <button
                                            type="button"
                                            onClick={handleGenerateCollage}
                                            disabled={generatingCollage}
                                            style={{
                                                padding: "9px 14px",
                                                borderRadius: 10,
                                                background: "rgba(212,175,55,0.16)",
                                                border: "1px solid rgba(212,175,55,0.4)",
                                                color: "#fde047",
                                                fontWeight: 700,
                                                fontSize: 13,
                                                cursor: "pointer",
                                            }}
                                        >
                                            {generatingCollage ? "Building Collage..." : "✨ Build Before/After Graphic"}
                                        </button>
                                    )}
                                </div>

                                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#cbd5e1", cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={stampWatermark}
                                        onChange={(e) => setStampWatermark(e.target.checked)}
                                    />
                                    🏷️ Stamp Date/GPS on New Photos
                                </label>
                            </div>

                            {/* Interactive Before/After Slider if both stages exist */}
                            {beforePhoto && afterPhoto && (
                                <div
                                    style={{
                                        background: "#181824",
                                        padding: 14,
                                        borderRadius: 14,
                                        border: "1px solid rgba(212,175,55,0.25)",
                                    }}
                                >
                                    <div style={{ fontSize: 13, fontWeight: 800, color: "#fde047", marginBottom: 8 }}>
                                        ⚡ Interactive Before &amp; After Comparison
                                    </div>
                                    <BeforeAfterSlider beforeUrl={beforePhoto.url} afterUrl={afterPhoto.url} height={280} />
                                </div>
                            )}

                            {/* Photo Cards Grid */}
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                                    gap: 14,
                                }}
                            >
                                {photoMeta.map((item, idx) => (
                                    <div
                                        key={`${item.url}-${idx}`}
                                        style={{
                                            background: "#181824",
                                            borderRadius: 12,
                                            border: "1px solid rgba(255,255,255,0.09)",
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <div style={{ position: "relative", height: 165, background: "#000" }}>
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.url}
                                                alt={item.caption || `Job photo ${idx + 1}`}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setMarkupIndex(idx)}
                                                style={{
                                                    position: "absolute",
                                                    bottom: 8,
                                                    right: 8,
                                                    padding: "5px 10px",
                                                    borderRadius: 8,
                                                    background: "rgba(0,0,0,0.8)",
                                                    border: "1px solid rgba(255,255,255,0.25)",
                                                    color: "#fff",
                                                    fontSize: 11,
                                                    fontWeight: 700,
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ✏️ Markup / 💬 ({item.comments?.length || 0})
                                            </button>
                                        </div>

                                        <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                                            <div style={{ display: "flex", gap: 6 }}>
                                                <select
                                                    value={item.stage}
                                                    onChange={(e) => {
                                                        const next = [...photoMeta];
                                                        next[idx] = { ...next[idx], stage: e.target.value as PhotoStage };
                                                        setPhotoMeta(next);
                                                    }}
                                                    style={{
                                                        flex: 1,
                                                        padding: "5px 8px",
                                                        borderRadius: 6,
                                                        background: "#0d0d14",
                                                        border: "1px solid rgba(255,255,255,0.14)",
                                                        color: "#fff",
                                                        fontSize: 12,
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    <option value="before">⏪ Before</option>
                                                    <option value="during">🔨 During</option>
                                                    <option value="after">✅ After</option>
                                                    <option value="damage">⚠️ Damage</option>
                                                    <option value="material">📦 Material</option>
                                                </select>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const next = [...photoMeta];
                                                        next[idx] = { ...next[idx], isPublic: item.isPublic === false };
                                                        setPhotoMeta(next);
                                                    }}
                                                    style={{
                                                        padding: "5px 8px",
                                                        borderRadius: 6,
                                                        border: "1px solid rgba(255,255,255,0.14)",
                                                        background:
                                                            item.isPublic !== false
                                                                ? "rgba(34,197,94,0.15)"
                                                                : "rgba(239,68,68,0.18)",
                                                        color: item.isPublic !== false ? "#4ade80" : "#f87171",
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        cursor: "pointer",
                                                    }}
                                                    title="Toggle whether this photo appears on the public SEO Pin page"
                                                >
                                                    {item.isPublic !== false ? "🌐 Public" : "🔒 Internal"}
                                                </button>
                                            </div>

                                            <input
                                                type="text"
                                                value={item.caption || ""}
                                                onChange={(e) => {
                                                    const next = [...photoMeta];
                                                    next[idx] = { ...next[idx], caption: e.target.value };
                                                    setPhotoMeta(next);
                                                }}
                                                placeholder="Add photo note / caption..."
                                                style={{
                                                    padding: "6px 8px",
                                                    borderRadius: 6,
                                                    background: "#0d0d14",
                                                    border: "1px solid rgba(255,255,255,0.1)",
                                                    color: "#e2e8f0",
                                                    fontSize: 12,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {activeTab === "chat" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <form onSubmit={handleSendProjectMessage} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {crewMembers.length > 0 && (
                                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                                        <span style={{ fontSize: 11, color: "#94a3b8" }}>Tag Crew:</span>
                                        {crewMembers.map((m) => (
                                            <button
                                                key={m.name}
                                                type="button"
                                                onClick={() => setChatText((prev) => `${prev} @${m.name} `)}
                                                style={{
                                                    padding: "3px 9px",
                                                    borderRadius: 99,
                                                    background: "rgba(59,130,246,0.15)",
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
                                        value={chatText}
                                        onChange={(e) => setChatText(e.target.value)}
                                        placeholder="Post a job update or question for the crew / office..."
                                        style={{
                                            flex: 1,
                                            padding: "11px 14px",
                                            borderRadius: 10,
                                            background: "#181824",
                                            border: "1px solid rgba(255,255,255,0.14)",
                                            color: "#fff",
                                            fontSize: 14,
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sendingChat}
                                        style={{
                                            padding: "0 18px",
                                            borderRadius: 10,
                                            background: "linear-gradient(135deg, #d4af37, #b5952f)",
                                            border: "none",
                                            color: "#000",
                                            fontWeight: 800,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {messages.length === 0 ? (
                                    <div style={{ padding: 24, textAlign: "center", color: "#64748b", fontSize: 13 }}>
                                        No messages on this project yet.
                                    </div>
                                ) : (
                                    messages.map((m) => (
                                        <div
                                            key={m.id}
                                            style={{
                                                padding: 12,
                                                borderRadius: 10,
                                                background: "#181824",
                                                border: "1px solid rgba(255,255,255,0.07)",
                                            }}
                                        >
                                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                                <strong style={{ fontSize: 13, color: "#fff" }}>
                                                    {m.author}{" "}
                                                    <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>
                                                        ({m.authorRole})
                                                    </span>
                                                </strong>
                                                <span style={{ fontSize: 11, color: "#64748b" }}>
                                                    {new Date(m.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: 14, color: "#e2e8f0" }}>{m.text}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "checklist" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                                Standard Operating Procedure (SOP) verification for <strong>{pin.service}</strong>:
                            </p>
                            {checklist.map((item, idx) => (
                                <label
                                    key={item.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "12px 14px",
                                        borderRadius: 10,
                                        background: item.completed ? "rgba(34,197,94,0.1)" : "#181824",
                                        border: item.completed
                                            ? "1px solid rgba(34,197,94,0.35)"
                                            : "1px solid rgba(255,255,255,0.08)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <input
                                            type="checkbox"
                                            checked={item.completed}
                                            onChange={(e) => {
                                                const next = [...checklist];
                                                next[idx] = {
                                                    ...item,
                                                    completed: e.target.checked,
                                                    completedBy: e.target.checked ? currentTechName : undefined,
                                                    completedAt: e.target.checked ? new Date().toISOString() : undefined,
                                                };
                                                setChecklist(next);
                                                persistPinChanges({ checklist: next });
                                            }}
                                            style={{ width: 18, height: 18 }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 600,
                                                color: item.completed ? "#86efac" : "#f8fafc",
                                                textDecoration: item.completed ? "line-through" : "none",
                                            }}
                                        >
                                            {item.label}
                                        </span>
                                    </div>
                                    {item.completed && item.completedBy && (
                                        <span style={{ fontSize: 11, color: "#4ade80" }}>✓ {item.completedBy}</span>
                                    )}
                                </label>
                            ))}

                            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                                <input
                                    type="text"
                                    value={newChecklistLabel}
                                    onChange={(e) => setNewChecklistLabel(e.target.value)}
                                    placeholder="Add custom checklist step..."
                                    style={{
                                        flex: 1,
                                        padding: "10px 12px",
                                        borderRadius: 8,
                                        background: "#181824",
                                        border: "1px solid rgba(255,255,255,0.14)",
                                        color: "#fff",
                                        fontSize: 13,
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!newChecklistLabel.trim()) return;
                                        const next: ChecklistItem[] = [
                                            ...checklist,
                                            { id: `chk_${Date.now()}`, label: newChecklistLabel.trim(), completed: false },
                                        ];
                                        setChecklist(next);
                                        setNewChecklistLabel("");
                                        persistPinChanges({ checklist: next });
                                    }}
                                    style={{
                                        padding: "0 16px",
                                        borderRadius: 8,
                                        background: "rgba(255,255,255,0.1)",
                                        border: "1px solid rgba(255,255,255,0.18)",
                                        color: "#fff",
                                        fontWeight: 700,
                                        fontSize: 13,
                                        cursor: "pointer",
                                    }}
                                >
                                    + Add Step
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === "docs" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: 15, color: "#fff" }}>
                                        📄 Project Document Vault (Estimates, Permits, EagleView, Insurance Scopes)
                                    </h4>
                                    <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
                                        Attach PDFs or spec sheets so field crews and the office have everything in one folder.
                                    </p>
                                </div>
                                <label
                                    style={{
                                        padding: "9px 16px",
                                        borderRadius: 10,
                                        background: "linear-gradient(135deg, #d4af37, #b5952f)",
                                        color: "#000",
                                        fontWeight: 800,
                                        fontSize: 13,
                                        cursor: "pointer",
                                    }}
                                >
                                    {uploadingDoc ? "Uploading..." : "📎 Upload PDF / Document"}
                                    <input
                                        type="file"
                                        accept="application/pdf,image/*"
                                        onChange={handleUploadDocument}
                                        style={{ display: "none" }}
                                    />
                                </label>
                            </div>

                            {documents.length === 0 ? (
                                <div
                                    style={{
                                        padding: 28,
                                        textAlign: "center",
                                        color: "#64748b",
                                        border: "1px dashed rgba(255,255,255,0.1)",
                                        borderRadius: 12,
                                    }}
                                >
                                    No documents uploaded to this job folder yet.
                                </div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {documents.map((doc) => (
                                        <div
                                            key={doc.id}
                                            style={{
                                                padding: "12px 14px",
                                                borderRadius: 10,
                                                background: "#181824",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>📄 {doc.name}</div>
                                                <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                                    Uploaded by {doc.uploadedBy} • {new Date(doc.uploadedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    padding: "6px 12px",
                                                    borderRadius: 8,
                                                    background: "rgba(59,130,246,0.18)",
                                                    color: "#60a5fa",
                                                    textDecoration: "none",
                                                    fontSize: 12,
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Open / Download ↗
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Internal Notes & Customer Info Editor */}
                            <div
                                style={{
                                    marginTop: 10,
                                    padding: 14,
                                    borderRadius: 12,
                                    background: "#181824",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
                                <div style={{ fontSize: 13, fontWeight: 800, color: "#f8fafc" }}>
                                    🔒 Private Customer &amp; Crew Folder Details (Never Shown on Public Map)
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Customer Name"
                                        style={{
                                            padding: "9px 12px",
                                            borderRadius: 8,
                                            background: "#0d0d14",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                            color: "#fff",
                                            fontSize: 13,
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="Customer Phone"
                                        style={{
                                            padding: "9px 12px",
                                            borderRadius: 8,
                                            background: "#0d0d14",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                            color: "#fff",
                                            fontSize: 13,
                                        }}
                                    />
                                    <input
                                        type="text"
                                        value={streetAddress}
                                        onChange={(e) => setStreetAddress(e.target.value)}
                                        placeholder="Exact Street Address"
                                        style={{
                                            padding: "9px 12px",
                                            borderRadius: 8,
                                            background: "#0d0d14",
                                            border: "1px solid rgba(255,255,255,0.12)",
                                            color: "#fff",
                                            fontSize: 13,
                                        }}
                                    />
                                </div>
                                <textarea
                                    rows={3}
                                    value={internalNotes}
                                    onChange={(e) => setInternalNotes(e.target.value)}
                                    placeholder="Private crew notes (gate codes, dog in yard, decking replacement counts, adjuster notes)..."
                                    style={{
                                        padding: "9px 12px",
                                        borderRadius: 8,
                                        background: "#0d0d14",
                                        border: "1px solid rgba(255,255,255,0.12)",
                                        color: "#fff",
                                        fontSize: 13,
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === "portal" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            {/* Shareable Customer / Insurance Portal Link */}
                            <div
                                style={{
                                    padding: 16,
                                    borderRadius: 14,
                                    background: "rgba(212,175,55,0.1)",
                                    border: "1px solid rgba(212,175,55,0.35)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 10,
                                }}
                            >
                                <div style={{ fontWeight: 800, fontSize: 15, color: "#fde047" }}>
                                    📄 Live Customer &amp; Insurance Adjuster Photo Report Link
                                </div>
                                <p style={{ margin: 0, fontSize: 12, color: "#cbd5e1" }}>
                                    Send this link to the homeowner or insurance adjuster. They can view HD photos, slide Before &amp; After comparisons, ask questions, sign off, or click <strong>Print / Save PDF</strong>.
                                </p>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <input
                                        type="text"
                                        readOnly
                                        value={reportUrl}
                                        style={{
                                            flex: 1,
                                            minWidth: 220,
                                            padding: "9px 12px",
                                            borderRadius: 8,
                                            background: "#0d0d14",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            color: "#e2e8f0",
                                            fontSize: 12,
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            navigator.clipboard.writeText(reportUrl);
                                            setStatusMsg("📋 Portal Link Copied!");
                                            setTimeout(() => setStatusMsg(""), 2000);
                                        }}
                                        style={{
                                            padding: "9px 14px",
                                            borderRadius: 8,
                                            background: "#d4af37",
                                            border: "none",
                                            color: "#000",
                                            fontWeight: 800,
                                            fontSize: 12,
                                            cursor: "pointer",
                                        }}
                                    >
                                        📋 Copy Link
                                    </button>
                                    <a
                                        href={reportUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            padding: "9px 14px",
                                            borderRadius: 8,
                                            background: "rgba(255,255,255,0.1)",
                                            color: "#fff",
                                            textDecoration: "none",
                                            fontWeight: 700,
                                            fontSize: 12,
                                        }}
                                    >
                                        ↗ Open Report
                                    </a>
                                    <a
                                        href={`sms:${customerPhone || ""}?&body=${encodeURIComponent(
                                            `Hi ${customerName || "there"}, here is your live ${companyName} Photo Report & Project Timeline: ${reportUrl}`
                                        )}`}
                                        style={{
                                            padding: "9px 14px",
                                            borderRadius: 8,
                                            background: "rgba(34,197,94,0.2)",
                                            border: "1px solid rgba(34,197,94,0.4)",
                                            color: "#4ade80",
                                            textDecoration: "none",
                                            fontWeight: 700,
                                            fontSize: 12,
                                        }}
                                    >
                                        📲 Text Report to Customer
                                    </a>
                                </div>
                            </div>

                            {/* On-Site Customer E-Signature Pad */}
                            <div
                                style={{
                                    padding: 16,
                                    borderRadius: 14,
                                    background: "#181824",
                                    border: "1px solid rgba(255,255,255,0.09)",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 12,
                                }}
                            >
                                <div style={{ fontWeight: 800, fontSize: 15, color: "#fff" }}>
                                    ✍️ On-Site Customer Digital E-Signature Pad
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                                    <input
                                        type="text"
                                        value={signerName}
                                        onChange={(e) => setSignerName(e.target.value)}
                                        placeholder="Homeowner Full Name"
                                        style={{
                                            padding: "9px 12px",
                                            borderRadius: 8,
                                            background: "#0d0d14",
                                            border: "1px solid rgba(255,255,255,0.14)",
                                            color: "#fff",
                                            fontSize: 13,
                                        }}
                                    />
                                    <select
                                        value={agreementType}
                                        onChange={(e) =>
                                            setAgreementType(e.target.value as "material_approval" | "completion_signoff")
                                        }
                                        style={{
                                            padding: "9px 12px",
                                            borderRadius: 8,
                                            background: "#0d0d14",
                                            border: "1px solid rgba(255,255,255,0.14)",
                                            color: "#fff",
                                            fontSize: 13,
                                        }}
                                    >
                                        <option value="completion_signoff">
                                            ✅ Final Walkthrough &amp; Completion Satisfaction Sign-Off
                                        </option>
                                        <option value="material_approval">
                                            🎨 Material, Shingle Color &amp; Scope Pre-Work Approval
                                        </option>
                                    </select>
                                </div>

                                <div
                                    style={{
                                        background: "#ffffff",
                                        borderRadius: 10,
                                        overflow: "hidden",
                                        border: "2px dashed #94a3b8",
                                    }}
                                >
                                    <canvas
                                        ref={sigCanvasRef}
                                        width={560}
                                        height={160}
                                        onMouseDown={startSigDraw}
                                        onMouseMove={moveSigDraw}
                                        onMouseUp={endSigDraw}
                                        onMouseLeave={endSigDraw}
                                        onTouchStart={startSigDraw}
                                        onTouchMove={moveSigDraw}
                                        onTouchEnd={endSigDraw}
                                        style={{ width: "100%", height: 160, touchAction: "none", cursor: "crosshair" }}
                                    />
                                </div>

                                <div style={{ display: "flex", gap: 10 }}>
                                    <button
                                        type="button"
                                        onClick={handleSaveSignature}
                                        style={{
                                            padding: "9px 16px",
                                            borderRadius: 8,
                                            background: "linear-gradient(135deg, #22c55e, #16a34a)",
                                            border: "none",
                                            color: "#fff",
                                            fontWeight: 800,
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                    >
                                        ✍️ Save Signed Certificate
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearSigCanvas}
                                        style={{
                                            padding: "9px 14px",
                                            borderRadius: 8,
                                            background: "rgba(255,255,255,0.08)",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            color: "#cbd5e1",
                                            fontWeight: 700,
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                    >
                                        Clear Pad
                                    </button>
                                </div>

                                {/* Saved Signatures */}
                                {signatures.length > 0 && (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8" }}>
                                            Captured Customer Signatures ({signatures.length}):
                                        </div>
                                        {signatures.map((sig) => (
                                            <div
                                                key={sig.id}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: 10,
                                                    borderRadius: 8,
                                                    background: "#0d0d14",
                                                    border: "1px solid rgba(34,197,94,0.3)",
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80" }}>
                                                        ✓ Signed by {sig.signerName}
                                                    </div>
                                                    <div style={{ fontSize: 11, color: "#94a3b8" }}>
                                                        {sig.agreementText} • {new Date(sig.signedAt).toLocaleString()}
                                                    </div>
                                                </div>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={sig.signatureDataUrl}
                                                    alt="Signature"
                                                    style={{ height: 42, background: "#fff", borderRadius: 4, padding: 2 }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Nested Photo Markup & Comment Modal */}
            {markupIndex !== null && photoMeta[markupIndex] && (
                <PhotoMarkupModal
                    imageUrl={photoMeta[markupIndex].url}
                    initialComments={photoMeta[markupIndex].comments || []}
                    authorName={currentTechName}
                    technicians={crewMembers.map((m) => m.name)}
                    onClose={() => setMarkupIndex(null)}
                    onSaveAnnotatedImage={async (base64Jpeg: string) => {
                        const finalUrl = await uploadDataUrlToStorage(base64Jpeg);
                        const next = [...photoMeta];
                        next[markupIndex] = {
                            ...next[markupIndex],
                            url: finalUrl,
                            annotated: true,
                        };
                        setPhotoMeta(next);
                        setMarkupIndex(null);
                        await persistPinChanges({ photoMeta: next });
                    }}
                    onAddPhotoComment={async (commentInput) => {
                        const newComment: PhotoComment = {
                            ...commentInput,
                            id: `c_${Date.now()}`,
                            createdAt: new Date().toISOString(),
                        };
                        const next = [...photoMeta];
                        next[markupIndex] = {
                            ...next[markupIndex],
                            comments: [...(next[markupIndex].comments || []), newComment],
                        };
                        setPhotoMeta(next);
                        await persistPinChanges({ photoMeta: next });
                    }}
                />
            )}

            {/* Nested Ghost Cam & Video Walkthrough Modal */}
            {ghostCamMode && (
                <GhostCameraModal
                    ghostBeforeUrl={beforePhoto?.url || photoMeta[0]?.url}
                    mode={ghostCamMode}
                    onClose={() => setGhostCamMode(null)}
                    onCapturePhoto={async (dataUrl: string) => {
                        const uploadedUrl = await uploadDataUrlToStorage(dataUrl);
                        const next: PinPhotoMeta[] = [
                            ...photoMeta,
                            {
                                url: uploadedUrl,
                                stage: "after",
                                caption: "Ghost-Cam Aligned After Photo",
                                author: currentTechName,
                                capturedAt: new Date().toISOString(),
                                isPublic: true,
                                comments: [],
                            },
                        ];
                        setPhotoMeta(next);
                        setGhostCamMode(null);
                        await persistPinChanges({ photoMeta: next });
                    }}
                    onCaptureVideo={async (videoDataUrl: string, transcript: string) => {
                        const uploadedVideoUrl = await uploadDataUrlToStorage(videoDataUrl);
                        const nextNotes = transcript
                            ? `${internalNotes ? internalNotes + "\n" : ""}[Walkthrough Dictation]: ${transcript}`
                            : internalNotes;
                        setInternalNotes(nextNotes);
                        if (uploadedVideoUrl) setWalkthroughVideoUrl(uploadedVideoUrl);
                        setGhostCamMode(null);
                        await persistPinChanges({
                            walkthroughVideoUrl: uploadedVideoUrl || walkthroughVideoUrl,
                            internalNotes: nextNotes,
                        });
                    }}
                />
            )}
        </div>
    );
}
