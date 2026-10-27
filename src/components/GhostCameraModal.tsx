"use client";

import React, { useState, useRef, useEffect } from "react";

interface GhostCameraModalProps {
  ghostBeforeUrl?: string;
  mode: "ghost_photo" | "video_walkthrough";
  onClose: () => void;
  onCapturePhoto?: (dataUrl: string) => Promise<void>;
  onCaptureVideo?: (videoDataUrl: string, spokenTranscript: string) => Promise<void>;
}

/**
 * CompanyCam-style Ghost-Overlay Alignment Camera (matches 'After' photo angle to 'Before' photo)
 * AND AI Voice + Video Jobsite Walkthrough Recorder.
 */
export default function GhostCameraModal({
  ghostBeforeUrl,
  mode,
  onClose,
  onCapturePhoto,
  onCaptureVideo,
}: GhostCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [ghostOpacity, setGhostOpacity] = useState<number>(38);
  const [cameraError, setCameraError] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [spokenTranscript, setSpokenTranscript] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    let active = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1600 },
            height: { ideal: 1200 },
          },
          audio: mode === "video_walkthrough",
        });
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setCameraError(
          "Could not access camera. Please allow camera permissions or use the standard Take Photo button."
        );
      }
    };

    startCamera();
    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [mode]);

  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleSnapAlignedPhoto = async () => {
    const video = videoRef.current;
    if (!video || !onCapturePhoto) return;
    setIsProcessing(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 960;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        await onCapturePhoto(dataUrl);
        onClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartVideoWalkthrough = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    setRecordingSeconds(0);

    try {
      let chosenMime = "";
      if (typeof MediaRecorder !== "undefined" && typeof MediaRecorder.isTypeSupported === "function") {
        const candidates = [
          "video/mp4",
          "video/webm;codecs=vp9,opus",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ];
        for (const c of candidates) {
          if (MediaRecorder.isTypeSupported(c)) {
            chosenMime = c;
            break;
          }
        }
      }

      const recorder = chosenMime
        ? new MediaRecorder(streamRef.current, { mimeType: chosenMime })
        : new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        setIsProcessing(true);
        try {
          const finalMime = recorder.mimeType || chosenMime || "video/mp4";
          const blob = new Blob(chunksRef.current, { type: finalMime });
          const base64Video = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(blob);
          });
          if (onCaptureVideo) {
            await onCaptureVideo(base64Video, spokenTranscript);
          }
          onClose();
        } catch (err) {
          console.error("Video save error:", err);
        } finally {
          setIsProcessing(false);
        }
      };

      recorder.start(500);
      setIsRecording(true);

      // Start Web Speech API live transcription simultaneously if supported
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        const recognition = new SpeechRec();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = "en-US";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          let added = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              added += event.results[i][0].transcript + " ";
            }
          }
          if (added.trim()) {
            setSpokenTranscript((prev) => `${prev} ${added.trim()}`.trim());
          }
        };
        try {
          recognition.start();
        } catch {}
      }
    } catch (err) {
      console.error("MediaRecorder error:", err);
      alert("Video recording is not supported on this browser.");
    }
  };

  const handleStopVideoWalkthrough = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(5, 7, 12, 0.95)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "740px",
          background: "#11141d",
          border: "1px solid rgba(226, 176, 71, 0.4)",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "0.85rem 1.25rem",
            background: "#0b0d13",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <strong style={{ color: "#e2b047", fontSize: "0.95rem" }}>
            {mode === "ghost_photo"
              ? "👻 Ghost Camera — Align 'After' Shot with 'Before' Photo"
              : "🎥 AI Video & Voice Jobsite Walkthrough"}
          </strong>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "440px",
            background: "#000",
            overflow: "hidden",
          }}
        >
          {cameraError ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#f87171",
                fontSize: "0.9rem",
              }}
            >
              {cameraError}
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Ghost Before Image Overlay */}
              {mode === "ghost_photo" && ghostBeforeUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ghostBeforeUrl}
                  alt="Ghost alignment overlay"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: ghostOpacity / 100,
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Alignment Gridlines */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  border: "1px solid rgba(226, 176, 71, 0.25)",
                  backgroundImage:
                    "linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)",
                  backgroundSize: "33.33% 33.33%",
                  pointerEvents: "none",
                }}
              />

              {isRecording && (
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    background: "rgba(239, 68, 68, 0.9)",
                    color: "#fff",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                  }}
                >
                  ● REC {recordingSeconds}s
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls Footer */}
        <div style={{ padding: "1rem 1.25rem", background: "#0b0d13" }}>
          {mode === "ghost_photo" && ghostBeforeUrl && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "0.78rem", color: "#cbd5e1", minWidth: "150px" }}>
                👻 Ghost Overlay: {ghostOpacity}%
              </span>
              <input
                type="range"
                min={0}
                max={85}
                value={ghostOpacity}
                onChange={(e) => setGhostOpacity(Number(e.target.value))}
                style={{ flex: 1, accentColor: "#e2b047" }}
              />
            </div>
          )}

          {mode === "video_walkthrough" && (
            <div style={{ marginBottom: "0.85rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.74rem",
                  color: "#e2b047",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                🎙️ Live Walkthrough Voice Notes (Auto-transcribed as you speak):
              </label>
              <textarea
                rows={2}
                value={spokenTranscript}
                onChange={(e) => setSpokenTranscript(e.target.value)}
                placeholder="Speak while recording your walkthrough or type notes here..."
                style={{
                  width: "100%",
                  background: "#11141d",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  padding: "8px",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              />
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "9px 16px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#94a3b8",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <label
                style={{
                  padding: "9px 14px",
                  borderRadius: "8px",
                  background: "rgba(56, 189, 248, 0.12)",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                  color: "#38bdf8",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                📲 Native Camera / Upload
                <input
                  type="file"
                  accept={mode === "video_walkthrough" ? "video/*" : "image/*"}
                  capture="environment"
                  style={{ display: "none" }}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsProcessing(true);
                    try {
                      const dataUrl = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = (err) => reject(err);
                        reader.readAsDataURL(file);
                      });
                      if (mode === "ghost_photo" && onCapturePhoto) {
                        await onCapturePhoto(dataUrl);
                      } else if (mode === "video_walkthrough" && onCaptureVideo) {
                        await onCaptureVideo(dataUrl, spokenTranscript);
                      }
                      onClose();
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                />
              </label>
            </div>

            {mode === "ghost_photo" ? (
              <button
                type="button"
                onClick={handleSnapAlignedPhoto}
                disabled={isProcessing || !!cameraError}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  background: "#e2b047",
                  color: "#090b10",
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {isProcessing ? "Capturing..." : "📸 Snap Aligned 'After' Photo"}
              </button>
            ) : !isRecording ? (
              <button
                type="button"
                onClick={handleStartVideoWalkthrough}
                disabled={isProcessing || !!cameraError}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  background: "#ef4444",
                  color: "#ffffff",
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🔴 Start Walkthrough Video
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStopVideoWalkthrough}
                style={{
                  padding: "10px 24px",
                  borderRadius: "10px",
                  background: "#22c55e",
                  color: "#090b10",
                  fontWeight: 900,
                  fontSize: "0.9rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                ⏹️ Finish & Upload Walkthrough ({recordingSeconds}s)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
