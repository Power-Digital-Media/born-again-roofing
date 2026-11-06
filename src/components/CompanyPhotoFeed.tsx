"use client";

import React, { useState, useMemo } from "react";
import type { PinType, PinPhotoMeta, PhotoStage } from "@/lib/db";
import { extractExifGpsFromFile, compressAndPreparePhoto } from "@/lib/exif-gps";

interface CompanyPhotoFeedProps {
  pins: PinType[];
  crewList: string[];
  currentAuthor?: string;
  authHeaders?: () => Record<string, string>;
  onOpenWorkspace: (pin: PinType) => void;
  onStartNewPin: () => void;
  onPinUpdated: (updatedPin: PinType) => void;
  onTurnIntoSocialPost?: (pin: PinType) => void;
}

const STAGE_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  before: { label: "⏪ BEFORE", bg: "rgba(245, 158, 11, 0.9)", color: "#090b10" },
  during: { label: "🔨 DURING", bg: "rgba(56, 189, 248, 0.9)", color: "#090b10" },
  after: { label: "✅ AFTER", bg: "rgba(34, 197, 94, 0.9)", color: "#090b10" },
  damage: { label: "🚨 DAMAGE", bg: "rgba(239, 68, 68, 0.92)", color: "#ffffff" },
  material: { label: "🧱 MATERIAL", bg: "rgba(168, 85, 247, 0.9)", color: "#ffffff" },
  general: { label: "📸 PHOTO", bg: "rgba(15, 23, 42, 0.85)", color: "#e2e8f0" },
};

function formatPinTime(pin: PinType): string {
  const numId = Number(pin.id);
  if (!isNaN(numId) && numId > 1600000000000) {
    try {
      return new Date(numId).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    } catch {}
  }
  return "";
}

export default function CompanyPhotoFeed({
  pins,
  crewList,
  currentAuthor,
  authHeaders,
  onOpenWorkspace,
  onStartNewPin,
  onPinUpdated,
}: CompanyPhotoFeedProps) {
  const [viewMode, setViewMode] = useState<"timeline" | "folders">("timeline");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState<number>(25);
  const [uploadingPinId, setUploadingPinId] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{
    pin: PinType;
    photoIndex: number;
  } | null>(null);

  // Build crew filter pills with job counts
  const techCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const name of crewList) {
      if (name) counts.set(name, 0);
    }
    for (const p of pins) {
      if (p.author) {
        counts.set(p.author, (counts.get(p.author) || 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [pins, crewList]);

  const filteredPins = useMemo(() => {
    return pins.filter((p) => {
      if (selectedTech !== "all" && p.author !== selectedTech) return false;

      if (stageFilter === "in_progress" && p.projectStatus !== "in_progress") return false;
      if (stageFilter === "inspection" && p.projectStatus !== "inspection") return false;
      if (stageFilter === "completed" && (p.projectStatus || "completed") !== "completed") return false;
      if (stageFilter === "during") {
        const hasDuring = (p.photoMeta || []).some((m) => m.stage === "during");
        if (!hasDuring) return false;
      }
      if (stageFilter === "before_after") {
        const stages = (p.photoMeta || []).map((m) => m.stage);
        if (!(stages.includes("before") && stages.includes("after")) && !p.beforeAfterCollageUrl) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = `${p.customerName || ""} ${p.streetAddress || ""} ${p.location || ""} ${p.service || ""} ${p.author || ""} ${p.description || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [pins, selectedTech, stageFilter, searchQuery]);

  const visiblePins = useMemo(
    () => filteredPins.slice(0, visibleCount),
    [filteredPins, visibleCount]
  );

  // Group visible pins by Date heading (e.g. "Oct 28, 2026")
  const groupedByDate = useMemo(() => {
    const groups: { dateLabel: string; jobs: PinType[] }[] = [];
    const map = new Map<string, PinType[]>();
    for (const pin of visiblePins) {
      const label = pin.date || "Recent Jobs";
      if (!map.has(label)) {
        const arr: PinType[] = [];
        map.set(label, arr);
        groups.push({ dateLabel: label, jobs: arr });
      }
      map.get(label)!.push(pin);
    }
    return groups;
  }, [visiblePins]);

  const handleQuickAddPhotos = async (pin: PinType, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingPinId(pin.id);
    try {
      const existingMeta: PinPhotoMeta[] =
        pin.photoMeta && pin.photoMeta.length > 0
          ? [...pin.photoMeta]
          : (pin.images || []).map((url) => ({
              url,
              stage: "after" as PhotoStage,
              capturedAt: pin.date || new Date().toLocaleString(),
              author: pin.author,
              isPublic: true,
            }));

      const newUrls: string[] = [];
      const newMetas: PinPhotoMeta[] = [];

      for (const file of Array.from(files)) {
        const exif = await extractExifGpsFromFile(file);
        const compressedDataUrl = await compressAndPreparePhoto(file);
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(authHeaders ? authHeaders() : {}),
        };
        const upRes = await fetch("/api/upload/", {
          method: "POST",
          headers,
          body: JSON.stringify({ image: compressedDataUrl }),
        });
        if (upRes.ok) {
          const upData = await upRes.json();
          if (upData.url) {
            newUrls.push(upData.url);
            newMetas.push({
              url: upData.url,
              stage: "after",
              caption: "",
              author: currentAuthor || pin.author,
              capturedAt: exif.capturedAt || new Date().toLocaleString(),
              isPublic: true,
              comments: [],
            });
          }
        }
      }

      if (newUrls.length > 0) {
        const updatedImages = [...(pin.images || []), ...newUrls];
        const updatedMeta = [...existingMeta, ...newMetas];
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          ...(authHeaders ? authHeaders() : {}),
        };
        const patchRes = await fetch("/api/pins/", {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            id: pin.id,
            images: updatedImages,
            photoMeta: updatedMeta,
          }),
        });
        if (patchRes.ok) {
          const data = await patchRes.json();
          const updatedPin = data.pin || data;
          onPinUpdated(updatedPin);
        }
      }
    } catch (err) {
      console.error("Failed adding photos to job:", err);
    } finally {
      setUploadingPinId(null);
    }
  };

  const handleChangePhotoStageInLightbox = async (
    pin: PinType,
    photoIndex: number,
    newStage: PhotoStage
  ) => {
    const baseMeta: PinPhotoMeta[] =
      pin.photoMeta && pin.photoMeta.length > 0
        ? [...pin.photoMeta]
        : (pin.images || []).map((url) => ({
            url,
            stage: "after" as PhotoStage,
            capturedAt: pin.date || "",
            author: pin.author,
            isPublic: true,
          }));

    if (!baseMeta[photoIndex]) return;
    baseMeta[photoIndex] = { ...baseMeta[photoIndex], stage: newStage };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(authHeaders ? authHeaders() : {}),
    };
    const res = await fetch("/api/pins/", {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        id: pin.id,
        photoMeta: baseMeta,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      const updated = data.pin || data;
      onPinUpdated(updated);
      setLightbox({ pin: updated, photoIndex });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Top Control Card */}
      <div
        style={{
          background: "#16161f",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 16,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {/* Title & View Switcher */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: "#fff" }}>
              📸 Company Photo Feed &amp; Job Timeline ({filteredPins.length})
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
              See every crew check-in and jobsite photo in chronological order — filter by technician, stage, or city.
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div
              style={{
                display: "inline-flex",
                background: "#0d0d14",
                padding: 4,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <button
                type="button"
                onClick={() => setViewMode("timeline")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "none",
                  background: viewMode === "timeline" ? "#e2b047" : "transparent",
                  color: viewMode === "timeline" ? "#090b10" : "#cbd5e1",
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                📰 Live Photo Feed
              </button>
              <button
                type="button"
                onClick={() => setViewMode("folders")}
                style={{
                  padding: "6px 12px",
                  borderRadius: 7,
                  border: "none",
                  background: viewMode === "folders" ? "#e2b047" : "transparent",
                  color: viewMode === "folders" ? "#090b10" : "#cbd5e1",
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                🗂️ Folder Grid
              </button>
            </div>

            <button
              type="button"
              onClick={onStartNewPin}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                background: "linear-gradient(135deg, #e2b047, #c9972c)",
                border: "none",
                color: "#090b10",
                fontWeight: 900,
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ➕ Drop New Job Pin
            </button>
          </div>
        </div>

        {/* Search + Stage Filter Row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search by customer, street address, city, technician, or job notes..."
            style={{
              flex: "1 1 260px",
              padding: "10px 14px",
              borderRadius: 10,
              background: "#0d0d14",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff",
              fontSize: 13,
            }}
          />

          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "#0d0d14",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <option value="all">All Stages &amp; Statuses</option>
            <option value="during">🔨 Has &ldquo;During&rdquo; Progress Photos</option>
            <option value="before_after">⚖️ Has Before &amp; After</option>
            <option value="in_progress">🚧 Active / In Progress Jobs</option>
            <option value="inspection">🔍 Inspections</option>
            <option value="completed">✅ Completed Jobs</option>
          </select>
        </div>

        {/* Crew Member Filter Bar */}
        {techCounts.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 6,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedTech("all")}
              style={{
                padding: "6px 12px",
                borderRadius: 99,
                whiteSpace: "nowrap",
                fontSize: 12,
                fontWeight: 800,
                border:
                  selectedTech === "all"
                    ? "1px solid #e2b047"
                    : "1px solid rgba(255,255,255,0.1)",
                background:
                  selectedTech === "all"
                    ? "rgba(226,176,71,0.2)"
                    : "rgba(255,255,255,0.03)",
                color: selectedTech === "all" ? "#fde047" : "#cbd5e1",
                cursor: "pointer",
              }}
            >
              👷 All Crew ({pins.length})
            </button>
            {techCounts.map(([techName, count]) => (
              <button
                key={techName}
                type="button"
                onClick={() => setSelectedTech(techName)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 99,
                  whiteSpace: "nowrap",
                  fontSize: 12,
                  fontWeight: 700,
                  border:
                    selectedTech === techName
                      ? "1px solid #e2b047"
                      : "1px solid rgba(255,255,255,0.1)",
                  background:
                    selectedTech === techName
                      ? "rgba(226,176,71,0.2)"
                      : "rgba(255,255,255,0.03)",
                  color: selectedTech === techName ? "#fde047" : "#cbd5e1",
                  cursor: "pointer",
                }}
              >
                {techName} ({count})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredPins.length === 0 ? (
        <div
          style={{
            background: "#16161f",
            border: "1px dashed rgba(255,255,255,0.15)",
            borderRadius: 16,
            padding: "40px 20px",
            textAlign: "center",
            color: "#94a3b8",
          }}
        >
          No jobs match that filter yet. Try clearing the search or click{" "}
          <strong style={{ color: "#fde047" }}>➕ Drop New Job Pin</strong>.
        </div>
      ) : viewMode === "folders" ? (
        /* FOLDER GRID VIEW */
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 14,
          }}
        >
          {visiblePins.map((job) => {
            const thumb = job.images?.[0] || job.photoMeta?.[0]?.url;
            return (
              <div
                key={job.id}
                onClick={() => onOpenWorkspace(job)}
                style={{
                  background: "#13151f",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.1)",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
              >
                <div style={{ height: 165, background: "#090b10", position: "relative" }}>
                  {thumb && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={job.service}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: "rgba(0,0,0,0.82)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    📸 {job.photoMeta?.length || job.images?.length || 0} Photos
                  </span>
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 800, color: "#fff", fontSize: 14 }}>
                    {job.customerName || job.streetAddress || job.service}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                    📍 {job.location} • {job.service}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#cbd5e1",
                      marginTop: 8,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>👷 {job.author}</span>
                    <span>{job.date}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* COMPANYCAM-STYLE CHRONOLOGICAL DAY-BY-DAY PHOTO STREAM */
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {groupedByDate.map((group) => (
            <div key={group.dateLabel} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Sticky Day Divider Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "4px 2px",
                }}
              >
                <span
                  style={{
                    padding: "5px 14px",
                    borderRadius: 99,
                    background: "rgba(226, 176, 71, 0.16)",
                    border: "1px solid rgba(226, 176, 71, 0.4)",
                    color: "#fde047",
                    fontSize: 12,
                    fontWeight: 900,
                  }}
                >
                  📅 {group.dateLabel}
                </span>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>
                  {group.jobs.length} {group.jobs.length === 1 ? "Job Check-In" : "Job Check-Ins"}
                </span>
                <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              </div>

              {/* Jobs for this Day */}
              {group.jobs.map((job) => {
                const timeStr = formatPinTime(job);
                const photos: PinPhotoMeta[] =
                  job.photoMeta && job.photoMeta.length > 0
                    ? job.photoMeta
                    : (job.images || []).map((url) => ({
                        url,
                        stage: "after" as PhotoStage,
                        capturedAt: job.date,
                        author: job.author,
                        isPublic: true,
                      }));

                return (
                  <div
                    key={job.id}
                    style={{
                      background: "#141722",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 16,
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {/* Job Header Bar */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span
                            style={{
                              padding: "3px 10px",
                              borderRadius: 99,
                              background: "rgba(56, 189, 248, 0.15)",
                              color: "#38bdf8",
                              fontSize: 12,
                              fontWeight: 800,
                            }}
                          >
                            👷 {job.author}
                          </span>
                          {timeStr && (
                            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>
                              🕒 {timeStr}
                            </span>
                          )}
                          <span
                            style={{
                              padding: "3px 9px",
                              borderRadius: 99,
                              background: "rgba(255,255,255,0.06)",
                              color: "#e2e8f0",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            📍 {job.streetAddress ? `${job.streetAddress}, ${job.location}` : job.location}
                          </span>
                        </div>

                        <h4
                          style={{
                            margin: "6px 0 0",
                            fontSize: 17,
                            fontWeight: 900,
                            color: "#fff",
                          }}
                        >
                          {job.customerName ? `${job.customerName} — ${job.service}` : job.service}
                        </h4>

                        {job.description && (
                          <p
                            style={{
                              margin: "4px 0 0",
                              fontSize: 13.5,
                              color: "#cbd5e1",
                              lineHeight: 1.45,
                            }}
                          >
                            &ldquo;{job.description}&rdquo;
                          </p>
                        )}
                      </div>

                      {/* Job Quick Actions */}
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        <label
                          style={{
                            padding: "7px 12px",
                            borderRadius: 9,
                            background: "rgba(34, 197, 94, 0.14)",
                            border: "1px solid rgba(34, 197, 94, 0.4)",
                            color: "#4ade80",
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {uploadingPinId === job.id ? "⏳ Uploading..." : "➕ Add Photos"}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            disabled={uploadingPinId === job.id}
                            onChange={(e) => handleQuickAddPhotos(job, e.target.files)}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => onOpenWorkspace(job)}
                          style={{
                            padding: "7px 13px",
                            borderRadius: 9,
                            background: "rgba(226, 176, 71, 0.16)",
                            border: "1px solid rgba(226, 176, 71, 0.45)",
                            color: "#fde047",
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          📂 Open Job Workspace ({photos.length})
                        </button>
                      </div>
                    </div>

                    {/* All Job Photos Strip / Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
                        gap: 10,
                      }}
                    >
                      {photos.map((ph, idx) => {
                        const st = STAGE_STYLE[ph.stage || "after"] || STAGE_STYLE.general;
                        return (
                          <div
                            key={`${ph.url}-${idx}`}
                            onClick={() => setLightbox({ pin: job, photoIndex: idx })}
                            style={{
                              position: "relative",
                              height: 165,
                              borderRadius: 12,
                              overflow: "hidden",
                              background: "#090b10",
                              border: "1px solid rgba(255,255,255,0.1)",
                              cursor: "pointer",
                            }}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={ph.url}
                              alt={`${job.service} photo ${idx + 1}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />

                            {/* Stage Badge */}
                            <span
                              style={{
                                position: "absolute",
                                top: 8,
                                left: 8,
                                padding: "3px 8px",
                                borderRadius: 6,
                                background: st.bg,
                                color: st.color,
                                fontSize: 10,
                                fontWeight: 900,
                              }}
                            >
                              {st.label}
                            </span>

                            {/* Caption or Capture Time Footer */}
                            {(ph.caption || ph.capturedAt) && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  padding: "5px 8px",
                                  background:
                                    "linear-gradient(to top, rgba(0,0,0,0.88), rgba(0,0,0,0.45), transparent)",
                                  color: "#f8fafc",
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {ph.caption ? `✨ ${ph.caption}` : `🕒 ${ph.capturedAt}`}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Load More Pagination Button */}
      {filteredPins.length > visibleCount && (
        <button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + 25)}
          style={{
            padding: "12px 20px",
            borderRadius: 12,
            background: "rgba(226, 176, 71, 0.14)",
            border: "1px solid rgba(226, 176, 71, 0.4)",
            color: "#fde047",
            fontWeight: 800,
            fontSize: 13,
            cursor: "pointer",
            alignSelf: "center",
          }}
        >
          ⬇️ Load More Jobs ({filteredPins.length - visibleCount} remaining)
        </button>
      )}

      {/* Full-Screen Photo Lightbox Inspector */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(5, 8, 14, 0.94)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 940,
              width: "100%",
              background: "#111520",
              border: "1px solid rgba(226, 176, 71, 0.35)",
              borderRadius: 16,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Lightbox Top Bar */}
            <div
              style={{
                padding: "12px 18px",
                background: "#090b10",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: "#fff", fontSize: 14 }}>
                  👷 {lightbox.pin.author} • {lightbox.pin.service} ({lightbox.pin.location})
                </div>
                <div style={{ fontSize: 11.5, color: "#94a3b8" }}>
                  Photo {lightbox.photoIndex + 1} of{" "}
                  {(lightbox.pin.photoMeta || lightbox.pin.images || []).length}
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                {(["before", "during", "after", "damage"] as PhotoStage[]).map((st) => {
                  const activeStage =
                    lightbox.pin.photoMeta?.[lightbox.photoIndex]?.stage || "after";
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() =>
                        handleChangePhotoStageInLightbox(
                          lightbox.pin,
                          lightbox.photoIndex,
                          st
                        )
                      }
                      style={{
                        padding: "5px 10px",
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        border:
                          activeStage === st
                            ? "1px solid #fde047"
                            : "1px solid rgba(255,255,255,0.14)",
                        background:
                          activeStage === st ? "#e2b047" : "rgba(255,255,255,0.05)",
                        color: activeStage === st ? "#090b10" : "#cbd5e1",
                        cursor: "pointer",
                      }}
                    >
                      {st}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    const p = lightbox.pin;
                    setLightbox(null);
                    onOpenWorkspace(p);
                  }}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: "rgba(56,189,248,0.16)",
                    border: "1px solid rgba(56,189,248,0.4)",
                    color: "#38bdf8",
                    fontSize: 11.5,
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  📂 Full Workspace &amp; Markup
                </button>

                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  style={{
                    padding: "6px 10px",
                    borderRadius: 8,
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#94a3b8",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Image Viewer */}
            <div
              style={{
                background: "#000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxHeight: "72vh",
                overflow: "hidden",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  lightbox.pin.photoMeta?.[lightbox.photoIndex]?.url ||
                  lightbox.pin.images?.[lightbox.photoIndex]
                }
                alt="Jobsite full preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "72vh",
                  objectFit: "contain",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
