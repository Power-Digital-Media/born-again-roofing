"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { PinType, PinPhotoMeta, PhotoStage, ChecklistItem, PhotoComment } from "@/lib/db";
import {
  extractExifGpsFromFile,
  findClosestJobByGps,
  compressAndPreparePhoto,
  getDefaultChecklistForService,
} from "@/lib/exif-gps";
import PhotoMarkupModal from "@/components/PhotoMarkupModal";
import { BeforeAfterSlider, generateBeforeAfterCompositeDataUrl } from "@/components/BeforeAfterBuilder";
import GhostCameraModal from "@/components/GhostCameraModal";
import CrewMessengerPanel from "@/components/CrewMessengerPanel";
import ProjectWorkspaceModal from "@/components/ProjectWorkspaceModal";

const cityCoords: Record<string, [number, number]> = {
  "Pearl, MS": [32.2729, -90.1312],
  "Jackson, MS": [32.2988, -90.1848],
  "Florence, MS": [32.1610, -90.1290],
  "Brandon, MS": [32.2732, -89.9859],
  "Madison, MS": [32.4610, -90.1171],
  "Byram, MS": [32.1813, -90.2476],
  "Clinton, MS": [32.3415, -90.3218],
  "Flowood, MS": [32.3276, -90.1345],
  "Ridgeland, MS": [32.4288, -90.1312],
  "Canton, MS": [32.6126, -90.0368],
  "Vicksburg, MS": [32.3526, -90.8779],
  "Yazoo City, MS": [32.8551, -90.4076],
  "Crystal Springs, MS": [31.9863, -90.3582],
  "Hazlehurst, MS": [31.8615, -90.3954],
  "Raymond, MS": [32.2593, -90.4237],
  "Richland, MS": [32.2354, -90.1565],
  "Terry, MS": [32.1038, -90.3204],
  "Utica, MS": [32.1121, -90.6272],
  "Gluckstadt, MS": [32.5188, -90.1315],
  "Magee, MS": [31.8710, -89.7337],
  "Hattiesburg, MS": [31.3271, -89.2903]
};


const serviceList = [
  "Residential Roofing",
  "Metal Roofing",
  "Commercial Roofing",
  "Roof Inspection & Tarping",
  "General Remodeling",
  "Bathroom Remodeling",
  "Kitchen Remodeling",
  "Whole House Remodeling",
  "Painting (Interior/Exterior)",
  "Fencing & Decking",
  "Sheetrock & Drywall",
  "Siding & Gutters",
  "Custom Cabinets & Carpentry",
  "Flooring & Tile",
  "Custom Category..."
];

const DEFAULT_TECHNICIANS = [
  "Chris Smith",
  "Damien Johnston",
  "Christopher Heard",
  "Kevin Heard",
  "Eddie Buchanan",
  "Robert Christoforo",
  "Daniel Lickness",
  "David Dilmore"
];

export default function DropPinPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "tech" | null>(null);
  const [passcode, setPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  const [author, setAuthor] = useState("");
  const [quickReviewAuthor, setQuickReviewAuthor] = useState("");
  const [date] = useState(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    return today.toLocaleDateString("en-US", options);
  });
  const [location, setLocation] = useState("");
  const [service, setService] = useState("");
  const [customService, setCustomService] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [stateInput, setStateInput] = useState("MS");
  const [zipCode, setZipCode] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState<number | "">("");
  const [longitude, setLongitude] = useState<number | "">("");
  const [images, setImages] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [transpondApiKey, setTranspondApiKey] = useState("");
  const [transpondGroupId, setTranspondGroupId] = useState("");
  const [transpondConfigured, setTranspondConfigured] = useState(false);
  const [socialConnected, setSocialConnected] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [transpondSaveStatus, setTranspondSaveStatus] = useState("idle"); // idle, saving, saved, error
  const [showSocialWarningModal, setShowSocialWarningModal] = useState(false);
  const [expandedTab, setExpandedTab] = useState<"google" | "crm" | "social" | "team" | null>(null);
  const [showAddTechInput, setShowAddTechInput] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [authorList, setAuthorList] = useState<string[]>(DEFAULT_TECHNICIANS);
  const [newTechName, setNewTechName] = useState("");
  const [newRooferPasscode, setNewRooferPasscode] = useState("");
  const [isUpdatingPasscode, setIsUpdatingPasscode] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");
  const [newReviewUrlInput, setNewReviewUrlInput] = useState("");
  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  // CompanyCam + Messenger Suite State
  const [portalMode, setPortalMode] = useState<"capture" | "projects" | "messenger">("capture");
  const [allPins, setAllPins] = useState<PinType[]>([]);
  const [selectedWorkspacePin, setSelectedWorkspacePin] = useState<PinType | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState<"all" | "in_progress" | "inspection" | "completed">("all");
  const [photoMetaList, setPhotoMetaList] = useState<PinPhotoMeta[]>([]);
  const [stampWatermark, setStampWatermark] = useState(true);
  const [markupPhotoIndex, setMarkupPhotoIndex] = useState<number | null>(null);
  const [ghostCamMode, setGhostCamMode] = useState<"ghost_photo" | "video_walkthrough" | null>(null);
  const [buildingCollage, setBuildingCollage] = useState(false);
  const [beforeAfterCollageUrl, setBeforeAfterCollageUrl] = useState("");
  const [walkthroughVideoUrl, setWalkthroughVideoUrl] = useState("");
  const [projectStatus, setProjectStatus] = useState<"in_progress" | "inspection" | "completed">("completed");
  const [publishToPublicMap, setPublishToPublicMap] = useState(true);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [showInternalSection, setShowInternalSection] = useState(false);
  const [isDictating, setIsDictating] = useState(false);
  const [autoMatchedJob, setAutoMatchedJob] = useState<{ job: PinType; distanceFeet: number; source: "gps" | "exif" } | null>(null);
  const [lastCreatedPin, setLastCreatedPin] = useState<PinType | null>(null);

  // Signed session token issued by /api/auth/login (stored per device, 90 days).
  const authHeaders = useCallback((json = true): Record<string, string> => {
    const headers: Record<string, string> = json ? { "Content-Type": "application/json" } : {};
    try {
      const raw = localStorage.getItem("roofer_pin_token");
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.token && saved.expiresAt > Date.now()) {
          headers["Authorization"] = `Bearer ${saved.token}`;
        }
      }
    } catch {}
    return headers;
  }, []);

  const fetchAllPins = useCallback(async () => {
    try {
      const res = await fetch("/api/pins/?includeInternal=true", { headers: authHeaders(false) });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllPins(data);
        }
      }
    } catch (err) {
      console.error("Failed to load project folders:", err);
    }
  }, [authHeaders]);

  // If the server says the session is no longer valid, return to the passcode screen.
  const handleSessionExpired = () => {
    localStorage.removeItem("roofer_pin_token");
    sessionStorage.removeItem("roofer_pin_auth");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const fetchTranspondSettings = async () => {
    try {
      const res = await fetch("/api/auth/transpond/settings", { headers: authHeaders(false) });
      if (res.status === 401) {
        handleSessionExpired();
        return;
      }
      if (res.status === 403) {
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setTranspondConfigured(data.configured || false);
        setTranspondGroupId(data.transpondGroupId || "");
        if (data.configured) {
          setTranspondApiKey(data.transpondApiKey || "");
        }
        setSocialConnected(data.socialConnected || false);
        setGoogleConnected(data.googleConnected || false);
        if (data.technicians && Array.isArray(data.technicians) && data.technicians.length > 0) {
          const merged = Array.from(new Set([...data.technicians, ...DEFAULT_TECHNICIANS]));
          setAuthorList(merged);
        } else {
          setAuthorList(DEFAULT_TECHNICIANS);
        }
        setCompanyName(data.companyName || "Born Again Roofing");
        setGoogleReviewUrl(data.googleReviewUrl || "");
        setNewReviewUrlInput(data.googleReviewUrl || "");
      }
    } catch (err) {
      console.error("Failed to load Transpond settings:", err);
    }
  };

  const handleSaveTranspondSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setTranspondSaveStatus("saving");
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ apiKey: transpondApiKey, groupId: transpondGroupId })
      });
      if (res.ok) {
        setTranspondSaveStatus("saved");
        setTranspondConfigured(true);
        setTimeout(() => setTranspondSaveStatus("idle"), 3000);
        fetchTranspondSettings();
      } else {
        setTranspondSaveStatus("error");
      }
    } catch (err) {
      setTranspondSaveStatus("error");
      console.error(err);
    }
  };

  const handleAddTechnician = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTechName.trim();
    if (!trimmed) return;
    const updatedTechs = authorList.includes(trimmed) ? authorList : [...authorList, trimmed];
    setAuthorList(updatedTechs);
    setAuthor(trimmed);
    setQuickReviewAuthor(trimmed);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("pindrop_selected_author", trimmed);
      } catch {}
    }
    setNewTechName("");
    setShowAddTechInput(false);
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ technicians: updatedTechs })
      });
      if (res.ok) {
        fetchTranspondSettings();
      }
    } catch (err) {
      console.error("Failed to save technician to server:", err);
    }
  };

  const handleDeleteTechnician = async (techName: string) => {
    if (!confirm(`Are you sure you want to remove ${techName}?`)) return;
    const updatedTechs = authorList.filter((tech) => tech !== techName);
    setAuthorList(updatedTechs);
    if (author === techName) setAuthor("");
    if (quickReviewAuthor === techName) setQuickReviewAuthor("");
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ technicians: updatedTechs })
      });
      if (res.ok) {
        fetchTranspondSettings();
      } else {
        alert("Failed to delete technician name.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting technician.");
    }
  };

  const handleSavePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRooferPasscode.trim()) return;
    setIsUpdatingPasscode(true);
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ rooferPasscode: newRooferPasscode.trim() })
      });
      if (res.ok) {
        setNewRooferPasscode("");
        alert("Portal passcode updated successfully!");
        fetchTranspondSettings();
      } else {
        alert("Failed to update passcode.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving passcode.");
    } finally {
      setIsUpdatingPasscode(false);
    }
  };

  const handleSaveReviewUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/transpond/settings", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ googleReviewUrl: newReviewUrlInput.trim() })
      });
      if (res.ok) {
        alert("Google Review Link updated successfully!");
        fetchTranspondSettings();
      } else {
        alert("Failed to update Google Review Link.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving review link.");
    }
  };

  const handleConnectGoogle = async () => {
    try {
      setIsConnectingGoogle(true);
      const res = await fetch("/api/auth/google/login", {
        headers: {
          ...authHeaders(false),
          Accept: "application/json",
        },
      });

      if (res.status === 401 || res.status === 403) {
        alert("Administrator authorization required to connect Google Business Profile.");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to initiate Google connection.");
        return;
      }

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Invalid response from server when initiating Google connection.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Error connecting to Google: ${msg}`);
    } finally {
      setIsConnectingGoogle(false);
    }
  };

  const geocodeAddress = async () => {
    if (!streetAddress.trim()) {
      alert("Please enter a street address.");
      return;
    }

    setIsGeocoding(true);
    try {
      const parts = [
        streetAddress.trim(),
        cityInput.trim(),
        stateInput.trim(),
        zipCode.trim()
      ].filter(Boolean);
      
      const searchString = parts.join(", ");

      const response = await fetch(
        `/api/geocode/?q=${encodeURIComponent(searchString)}`
      );
      if (response.ok) {
        const results = await response.json();
        if (results && results.length > 0) {
          const firstResult = results[0];
          const lat = parseFloat(firstResult.lat);
          const lon = parseFloat(firstResult.lon);
          setLatitude(lat);
          setLongitude(lon);

          // Extract city from result
          let matchedCity = "";
          const displayName = firstResult.display_name.toLowerCase();
          for (const city of Object.keys(cityCoords)) {
            const cityNameOnly = city.split(",")[0].toLowerCase().trim();
            if (displayName.includes(cityNameOnly)) {
              matchedCity = city;
              break;
            }
          }
          if (matchedCity) {
            setLocation(matchedCity);
          } else {
            let closestCity = "";
            let minDistance = Infinity;
            for (const [city, coords] of Object.entries(cityCoords)) {
              const dist = Math.pow(lat - coords[0], 2) + Math.pow(lon - coords[1], 2);
              if (dist < minDistance) {
                minDistance = dist;
                closestCity = city;
              }
            }
            if (closestCity) {
              setLocation(closestCity);
            }
          }
          alert(`Success! Found coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)}. Location updated to: ${matchedCity || "nearest match"}.`);
        } else {
          alert("Could not find coordinates for that address. Please check the spelling or enter coordinates manually.");
        }
      } else {
        alert("Address lookup failed. Please enter coordinates manually.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
      alert("Error contacting address lookup service. Please enter coordinates manually.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const [geoLoading, setGeoLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Check authentication and URL params on load
  useEffect(() => {
    const cachedAuth = sessionStorage.getItem("roofer_pin_auth");
    let hasValidToken = false;
    let initialRole: "admin" | "tech" = "tech";
    try {
      const saved = JSON.parse(localStorage.getItem("roofer_pin_token") || "null");
      hasValidToken = !!(saved && saved.token && saved.expiresAt > Date.now());
      if (saved && saved.role === "admin") {
        initialRole = "admin";
      }
    } catch {}
    if (cachedAuth === "true" || hasValidToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
      setUserRole(initialRole);
      fetchTranspondSettings();
      fetchAllPins();
      try {
        const savedAuthor = localStorage.getItem("pindrop_selected_author");
        if (savedAuthor) {
          setAuthor(savedAuthor);
          setQuickReviewAuthor(savedAuthor);
        }
      } catch {}
      const tourSeen = localStorage.getItem("pindrop_tour_seen");
      if (!tourSeen) {
        setTimeout(() => setTourStep(1), 800);
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const googleSync = urlParams.get("google_sync");
    const errorMsg = urlParams.get("message");
    if (googleSync === "success") {
      alert("🎉 Success! Your Google Business Profile is now connected and synced with PinDrop!");
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (googleSync === "error") {
      alert(`❌ Google Auth Failed: ${errorMsg || "Unknown Error"}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasscodeError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      if (res.ok) {
        const loginData = await res.json().catch(() => ({}));
        const role: "admin" | "tech" = loginData.role === "admin" ? "admin" : "tech";
        setUserRole(role);
        if (loginData.token) {
          localStorage.setItem(
            "roofer_pin_token",
            JSON.stringify({ token: loginData.token, expiresAt: loginData.expiresAt, role })
          );
        }
        sessionStorage.setItem("roofer_pin_auth", "true");
        setIsAuthenticated(true);
        fetchTranspondSettings();
        fetchAllPins();
        try {
          const savedAuthor = localStorage.getItem("pindrop_selected_author");
          if (savedAuthor) {
            setAuthor(savedAuthor);
            setQuickReviewAuthor(savedAuthor);
          }
        } catch {}
        const tourSeen = localStorage.getItem("pindrop_tour_seen");
        if (!tourSeen) {
          setTimeout(() => setTourStep(1), 800);
        }
      } else {
        const data = await res.json();
        setPasscodeError(data.error || "Incorrect passcode. Please try again.");
      }
    } catch {
      setPasscodeError("Connection error. Please try again.");
    }
  };

  const handleFinishTour = () => {
    localStorage.setItem("pindrop_tour_seen", "true");
    setTourStep(null);
    setExpandedTab(null);
  };

  const handleRestartTour = () => {
    setTourStep(1);
    setExpandedTab(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Scroll to active walkthrough elements smoothly when step changes
  useEffect(() => {
    if (tourStep === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (tourStep && tourStep >= 2) {
      setTimeout(() => {
        // Scroll to integrations card
        const integrationsCard = document.querySelector(".double-bezel-wrapper[style*='margin: 2rem auto 0']");
        if (integrationsCard) {
          integrationsCard.scrollIntoView({ behavior: "smooth", block: "center" });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }
      }, 150); // Small timeout to allow tab state to expand
    }
  }, [tourStep]);

  // Auto-populate default SOP checklist when service changes
  useEffect(() => {
    const finalSvc = service === "Custom Category..." ? customService : service;
    if (finalSvc) {
      setChecklist(
        getDefaultChecklistForService(finalSvc).map((item) => ({
          ...item,
          completed: false,
        }))
      );
    }
  }, [service, customService]);

  const applyCoordinatesAndMatchJob = (lat: number, lng: number, source: "gps" | "exif") => {
    setLatitude(lat);
    setLongitude(lng);

    let closestCity = "";
    let minDistance = Infinity;
    for (const [city, coords] of Object.entries(cityCoords)) {
      const dist = Math.pow(lat - coords[0], 2) + Math.pow(lng - coords[1], 2);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = city;
      }
    }
    if (closestCity && !location) {
      setLocation(closestCity);
    }

    // Check if within ~525 ft (160m) of an existing job folder
    const match = findClosestJobByGps(lat, lng, allPins, 160);
    if (match) {
      setAutoMatchedJob({
        job: match.job,
        distanceFeet: Math.round(match.distanceMeters * 3.28084),
        source,
      });
    }
  };

  const getGPSLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setGeoLoading(false);
        applyCoordinatesAndMatchJob(lat, lng, "gps");
      },
      (error) => {
        setGeoLoading(false);
        console.error("GPS position fetch error:", error);
        alert(`Failed to fetch location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleVoiceDictate = () => {
    const SpeechRec =
      typeof window !== "undefined"
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;
    if (!SpeechRec) {
      alert("Voice dictation is supported in Chrome, Safari, and Edge on mobile/desktop.");
      return;
    }
    if (isDictating) {
      setIsDictating(false);
      return;
    }
    const recognition = new SpeechRec();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsDictating(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setDescription((prev) => `${prev ? prev.trim() + " " : ""}${transcript.trim()}`);
      }
    };
    recognition.onerror = () => setIsDictating(false);
    recognition.onend = () => setIsDictating(false);
    recognition.start();
  };

  const uploadBase64Photo = async (base64Data: string): Promise<string> => {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ base64Data }),
    });
    if (response.status === 401) {
      handleSessionExpired();
      throw new Error("Your session expired. Please sign in again.");
    }
    if (!response.ok) {
      throw new Error("Photo upload failed");
    }
    const data = await response.json();
    return data.url || base64Data;
  };

  // Client-side 1600px HD compression, EXIF GPS extraction, and Firebase Storage upload helper
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    setUploadStatus("Processing HD images & reading EXIF GPS...");

    try {
      const fileList = Array.from(files);
      const newUrls: string[] = [];
      const newMetaItems: PinPhotoMeta[] = [];

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        setUploadStatus(`Compressing HD photo ${i + 1} of ${fileList.length}...`);

        // 1. Extract EXIF GPS coordinates from camera roll photo if present
        const exif = await extractExifGpsFromFile(file);
        if (exif.latitude && exif.longitude && latitude === "" && longitude === "") {
          applyCoordinatesAndMatchJob(exif.latitude, exif.longitude, "exif");
        }

        const defaultStage: PhotoStage =
          photoMetaList.length === 0 && i === 0 ? "after" : "during";

        // 2. Compress at 1600px @ 0.82 JPEG + optional Date/GPS/Tech watermark stamp
        const compressedBase64 = await compressAndPreparePhoto(file, {
          maxDimension: 1600,
          quality: 0.82,
          stampWatermark,
          watermarkText: stampWatermark
            ? {
                dateStr: exif.capturedAt || new Date().toLocaleString(),
                locationStr: location || undefined,
                coordsStr: exif.latitude ? `${exif.latitude.toFixed(3)}, ${exif.longitude?.toFixed(3)}` : undefined,
                stageStr: defaultStage,
                authorStr: author || undefined,
              }
            : undefined,
        });

        setUploadStatus(`Uploading HD photo ${i + 1} of ${fileList.length} to Cloud...`);
        const url = await uploadBase64Photo(compressedBase64);
        newUrls.push(url);
        newMetaItems.push({
          url,
          stage: defaultStage,
          caption: "",
          author: author || "Field Specialist",
          capturedAt: exif.capturedAt || new Date().toISOString(),
          isPublic: true,
          comments: [],
        });
      }

      setImages((prev) => [...prev, ...newUrls]);
      setPhotoMetaList((prev) => [...prev, ...newMetaItems]);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const msg = err instanceof Error ? err.message : String(err);
      alert(msg || "Failed to upload one or more photos. Please try again.");
    } finally {
      setIsCompressing(false);
      setUploadStatus("");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPhotoMetaList((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleBuildBeforeAfterCollage = async () => {
    const beforeItem = photoMetaList.find((p) => p.stage === "before") || photoMetaList[0];
    const afterItem = photoMetaList.find((p) => p.stage === "after") || photoMetaList[photoMetaList.length - 1];
    if (!beforeItem || !afterItem) return;
    setBuildingCollage(true);
    try {
      const collageBase64 = await generateBeforeAfterCompositeDataUrl({
        beforeUrl: beforeItem.url,
        afterUrl: afterItem.url,
        companyName: companyName || "Born Again Roofing",
        service: (service === "Custom Category..." ? customService : service) || "Roofing & Remodeling",
        location: location || "Central MS",
      });
      const uploadedCollageUrl = await uploadBase64Photo(collageBase64);
      setBeforeAfterCollageUrl(uploadedCollageUrl);
      setImages((prev) => [uploadedCollageUrl, ...prev]);
      setPhotoMetaList((prev) => [
        {
          url: uploadedCollageUrl,
          stage: "after",
          caption: "Before & After Transformation Split",
          author: author || "Field Specialist",
          capturedAt: new Date().toISOString(),
          isPublic: true,
          comments: [],
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Failed building collage:", err);
      alert("Could not generate Before/After graphic.");
    } finally {
      setBuildingCollage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalService = service === "Custom Category..." ? customService : service;

    if (!author || !location || !finalService || !description || images.length === 0) {
      setSubmitError("Please fill in all fields and upload at least one image.");
      return;
    }

    setSubmitLoading(true);
    setSubmitError("");

    const publicImageUrls = photoMetaList
      .filter((m) => m.isPublic !== false)
      .map((m) => m.url);

    const payload = {
      author,
      date,
      location,
      service: finalService,
      description,
      images: publicImageUrls.length > 0 ? publicImageUrls : images,
      photoMeta: photoMetaList,
      beforeAfterCollageUrl: beforeAfterCollageUrl || undefined,
      walkthroughVideoUrl: walkthroughVideoUrl || undefined,
      projectStatus,
      publishToPublicMap,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      streetAddress: streetAddress.trim() || undefined,
      internalNotes: internalNotes.trim() || undefined,
      checklist,
      latitude: latitude !== "" ? latitude : undefined,
      longitude: longitude !== "" ? longitude : undefined
    };

    try {
      const response = await fetch("/api/pins/", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(payload)
      });

      if (response.status === 401) {
        handleSessionExpired();
      }

      if (response.ok) {
        const resData = await response.json();
        if (resData.pin) {
          setLastCreatedPin(resData.pin);
        }
        fetchAllPins();
        setSubmitSuccess(true);
        // Reset form values
        setDescription("");
        setImages([]);
        setPhotoMetaList([]);
        setBeforeAfterCollageUrl("");
        setWalkthroughVideoUrl("");
        setCustomerName("");
        setCustomerPhone("");
        setInternalNotes("");
        setAutoMatchedJob(null);
        setLatitude("");
        setLongitude("");
        setService("");
        setCustomService("");
        setStreetAddress("");
        setCityInput("");
        setStateInput("MS");
        setZipCode("");
      } else {
        const errorData = await response.json();
        setSubmitError(errorData.error || "Failed to drop pin. Try again.");
      }
    } catch (err) {
      console.error("Failed to post pin:", err);
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login-backdrop">
        <div className="double-bezel-wrapper login-card">
          <div className="double-bezel-inner login-inner">
            <h2 className="title">PDM PinDrop</h2>
            <p className="subtitle">Enter passcode to drop job pins</p>
            <form onSubmit={handleLogin} className="form">
              <input
                type="password"
                placeholder="Passcode"
                className="input"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
              {passcodeError && <p className="error">{passcodeError}</p>}
              <button type="submit" className="btn btn-outline submit-btn">
                Unlock Portal
              </button>
            </form>
          </div>
        </div>

        <style jsx>{`
          .login-backdrop {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 80vh;
            background: var(--bg);
          }
          .login-card {
            width: 100%;
            max-width: 400px;
          }
          .login-inner {
            padding: 2.5rem !important;
            text-align: center;
          }
          .title {
            color: var(--primary);
            font-size: 1.8rem;
            font-weight: 800;
            margin-bottom: 0.25rem;
          }
          .subtitle {
            color: var(--text-muted);
            font-size: 0.9rem;
            margin-bottom: 2rem;
          }
          .form {
            display: flex;
            flex-direction: column;
            gap: 1.25rem;
          }
          .input {
            width: 100%;
            padding: 0.8rem 1rem;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border);
            border-radius: 8px;
            color: #ffffff;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s;
            text-align: center;
          }
          .input:focus {
            border-color: var(--secondary);
          }
          .error {
            color: #ef4444;
            font-size: 0.82rem;
            margin: 0;
          }
          .submit-btn {
            padding: 0.85rem !important;
            font-size: 0.95rem;
            font-weight: 700;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="portal-container">
      <div className="container">
        
        <div className="portal-header" style={{ position: "relative" }}>
          <span className="eyebrow" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Power Digital Media</span>
            <button 
              type="button"
              onClick={handleRestartTour}
              style={{ background: "rgba(226, 176, 71, 0.15)", border: "1px solid #e2b047", color: "#e2b047", padding: "4px 12px", borderRadius: "20px", fontSize: "0.72rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}
            >
              🎓 Take Tour
            </button>
          </span>
          <h1>PDM PinDrop</h1>
          <p className="subtitle">Field Photo Documentation, Crew Messenger &amp; Live SEO Pin Engine</p>

          {/* CompanyCam Top Mode Switcher */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            {(
              [
                { id: "capture", label: "📍 Capture / Check-In" },
                { id: "projects", label: `🗂️ Active Jobs & Folders (${allPins.length})` },
                { id: "messenger", label: "💬 Crew Messenger" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPortalMode(tab.id)}
                style={{
                  padding: "10px 18px",
                  borderRadius: 99,
                  border: portalMode === tab.id ? "1px solid #e2b047" : "1px solid rgba(255,255,255,0.12)",
                  background: portalMode === tab.id ? "rgba(226,176,71,0.2)" : "rgba(255,255,255,0.03)",
                  color: portalMode === tab.id ? "#ffffff" : "#94a3b8",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* MODE 2: ACTIVE JOBS & FOLDERS FEED */}
        {portalMode === "projects" && (
          <div style={{ maxWidth: 860, margin: "0 auto 2.5rem", display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "#16161f",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 16,
                padding: 18,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#fff" }}>
                    🗂️ Job Folders &amp; Multi-Day Project Workspaces
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#94a3b8" }}>
                    Click any job folder to add more Before/During/After photos, annotate damage, check off SOPs, upload PDFs, capture homeowner e-signatures, or share the Customer/Insurance Report link.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPortalMode("capture")}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 10,
                    background: "#e2b047",
                    border: "none",
                    color: "#0f172a",
                    fontWeight: 800,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ➕ Start New Job Pin
                </button>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  placeholder="Search by customer name, street, city, technician, or service..."
                  style={{
                    flex: 1,
                    minWidth: 220,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "#0d0d14",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "#fff",
                    fontSize: 13,
                  }}
                />
                {(
                  [
                    { id: "all", label: "All Jobs" },
                    { id: "in_progress", label: "🚧 In Progress" },
                    { id: "inspection", label: "🔍 Inspection" },
                    { id: "completed", label: "✅ Completed" },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setProjectStatusFilter(st.id)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: projectStatusFilter === st.id ? "1px solid #e2b047" : "1px solid rgba(255,255,255,0.1)",
                      background: projectStatusFilter === st.id ? "rgba(226,176,71,0.16)" : "rgba(255,255,255,0.03)",
                      color: projectStatusFilter === st.id ? "#fff" : "#94a3b8",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
                {allPins
                  .filter((p) => {
                    if (projectStatusFilter !== "all" && (p.projectStatus || "completed") !== projectStatusFilter) {
                      return false;
                    }
                    if (!projectSearch.trim()) return true;
                    const q = projectSearch.toLowerCase();
                    return (
                      (p.customerName || "").toLowerCase().includes(q) ||
                      (p.streetAddress || "").toLowerCase().includes(q) ||
                      p.location.toLowerCase().includes(q) ||
                      p.service.toLowerCase().includes(q) ||
                      p.author.toLowerCase().includes(q)
                    );
                  })
                  .map((job) => {
                    const thumb = job.images?.[0] || job.photoMeta?.[0]?.url;
                    const statusLabel =
                      job.projectStatus === "in_progress"
                        ? "🚧 In Progress"
                        : job.projectStatus === "inspection"
                        ? "🔍 Inspection"
                        : "✅ Completed";
                    return (
                      <div
                        key={job.id}
                        onClick={() => setSelectedWorkspacePin(job)}
                        style={{
                          background: "#0d0d14",
                          borderRadius: 14,
                          border: "1px solid rgba(255,255,255,0.09)",
                          overflow: "hidden",
                          cursor: "pointer",
                          transition: "transform 0.15s, border-color 0.15s",
                        }}
                      >
                        <div style={{ height: 150, background: "#1e293b", position: "relative" }}>
                          {thumb && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={thumb} alt={job.service} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          )}
                          <span
                            style={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              padding: "3px 9px",
                              borderRadius: 99,
                              background: "rgba(0,0,0,0.75)",
                              color: "#fde047",
                              fontSize: 11,
                              fontWeight: 800,
                            }}
                          >
                            {statusLabel}
                          </span>
                          <span
                            style={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              padding: "3px 8px",
                              borderRadius: 6,
                              background: "rgba(0,0,0,0.78)",
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 700,
                            }}
                          >
                            📸 {job.photoMeta?.length || job.images?.length || 0} Photos
                          </span>
                        </div>
                        <div style={{ padding: 12 }}>
                          <div style={{ fontWeight: 800, color: "#fff", fontSize: 14, marginBottom: 2 }}>
                            {job.customerName || job.service}
                          </div>
                          <div style={{ fontSize: 12, color: "#cbd5e1" }}>
                            {job.location} • {job.service}
                          </div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 6, display: "flex", justifyContent: "space-between" }}>
                            <span>👷 {job.author}</span>
                            <span>{job.date}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: CREW MESSENGER */}
        {portalMode === "messenger" && (
          <div style={{ maxWidth: 820, margin: "0 auto 2.5rem" }}>
            <CrewMessengerPanel
              currentAuthorName={author || authorList[0] || "Field Specialist"}
              currentAuthorRole={userRole === "admin" ? "admin" : "tech"}
              crewMembers={authorList.map((name) => ({ name }))}
              pins={allPins}
              authHeaders={() => authHeaders(false)}
              onOpenProject={(pin) => setSelectedWorkspacePin(pin)}
            />
          </div>
        )}

        {/* MODE 1: CAPTURE / CHECK-IN */}
        {portalMode === "capture" && submitSuccess ? (
          <div className="double-bezel-wrapper success-card">
            <div className="double-bezel-inner success-inner">
              <span className="success-icon">🎉</span>
              <h3>Pin Dropped Successfully!</h3>
              <p style={{ marginBottom: "1.5rem" }}>The job has been recorded and will show on the map and feed in real-time.</p>
              
              {/* Customer & Insurance Photo Report Portal Card */}
              {lastCreatedPin?.reportToken && (
                <div style={{ background: "rgba(226, 176, 71, 0.08)", border: "1px solid rgba(226, 176, 71, 0.35)", borderRadius: "12px", padding: "1.25rem", marginBottom: "1.25rem", textAlign: "left" }}>
                  <h4 style={{ color: "#fde047", fontSize: "0.95rem", fontWeight: "800", marginBottom: "0.4rem" }}>
                    📄 Share Customer / Insurance Photo Report
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "#cbd5e1", margin: "0 0 0.85rem 0", lineHeight: "1.45" }}>
                    Send the interactive Before/After timeline, HD photos, e-signature pad &amp; printable PDF report directly to the homeowner or adjuster:
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <a
                      href={`/project-report/${lastCreatedPin.reportToken}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline"
                      style={{ flex: "1 1 140px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", padding: "8px 12px", background: "#e2b047", color: "#0f172a", fontWeight: 800 }}
                    >
                      📄 Open Photo Report ↗
                    </a>
                    <a
                      href={`sms:${lastCreatedPin.customerPhone || ""}?&body=${encodeURIComponent(
                        `Hi ${lastCreatedPin.customerName || "there"}, here is your official ${companyName || "Born Again Roofing"} Photo Report & Project Timeline: ${typeof window !== "undefined" ? window.location.origin : ""}/project-report/${lastCreatedPin.reportToken}`
                      )}`}
                      className="btn btn-outline"
                      style={{ flex: "1 1 140px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", padding: "8px 12px" }}
                    >
                      📲 Text Report to Customer
                    </a>
                  </div>
                </div>
              )}

              {/* Review request integration */}
              <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
                <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: "800", marginBottom: "0.5rem" }}>👉 Send Google Review Request</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1rem 0", lineHeight: "1.5" }}>
                  Send a pre-filled review request to the customer&apos;s phone or email right now:
                </p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href={`sms:?body=${encodeURIComponent(
                      `Hi! This is ${author ? author.split(" ")[0] : (companyName || "our representative")} from ${companyName || "our company"}. It was a pleasure working on your home. Would you mind leaving us a quick Google review? You can leave it here: ${googleReviewUrl}`
                    )}`}
                    className="btn btn-outline"
                    style={{ flex: "1 1 120px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", padding: "8px 12px", background: "rgba(226, 176, 71, 0.05)" }}
                  >
                    💬 Send SMS
                  </a>
                  <a
                    href={`mailto:?subject=${encodeURIComponent(`Review for ${companyName || "our company"}`)}&body=${encodeURIComponent(
                      `Hi there,\n\nThis is ${author ? author.split(" ")[0] : (companyName || "our representative")} from ${companyName || "our company"}. It was a pleasure working on your home. Would you mind leaving us a quick Google review?\n\nYou can leave it here:\n${googleReviewUrl}\n\nThank you!`
                    )}`}
                    className="btn btn-outline"
                    style={{ flex: "1 1 120px", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", padding: "8px 12px", background: "rgba(226, 176, 71, 0.05)" }}
                  >
                    ✉️ Send Email
                  </a>
                </div>
              </div>

              <div className="success-buttons">
                <button onClick={() => setSubmitSuccess(false)} className="btn btn-outline" style={{ width: "100%" }}>
                  Drop Another Pin
                </button>
                <Link href="/pins/" className="btn btn-outline" style={{ background: "transparent", width: "100%" }}>
                  View Project Map
                </Link>
              </div>
            </div>
          </div>
        ) : portalMode === "capture" ? (
          <>
            <div className="double-bezel-wrapper form-card">
            <div className="double-bezel-inner form-inner">
              <form onSubmit={handleSubmit} className="portal-form">

                {/* Auto-Detected Nearby Job Banner (Geolocation / Photo EXIF Match) */}
                {autoMatchedJob && (
                  <div
                    style={{
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "rgba(226,176,71,0.14)",
                      border: "1px solid #e2b047",
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#fde047" }}>
                      📍 Auto-Detected Nearby Job ({autoMatchedJob.distanceFeet} ft away via{" "}
                      {autoMatchedJob.source === "exif" ? "Photo EXIF GPS" : "Live GPS"}):
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#fff" }}>
                      <strong>{autoMatchedJob.job.customerName || autoMatchedJob.job.service}</strong> in{" "}
                      {autoMatchedJob.job.location} ({autoMatchedJob.job.date})
                    </div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedWorkspacePin(autoMatchedJob.job)}
                        style={{
                          padding: "7px 12px",
                          borderRadius: 8,
                          background: "#e2b047",
                          border: "none",
                          color: "#0f172a",
                          fontWeight: 800,
                          fontSize: "0.76rem",
                          cursor: "pointer",
                        }}
                      >
                        🗂️ Open This Job Folder &amp; Add Photos
                      </button>
                      <button
                        type="button"
                        onClick={() => setAutoMatchedJob(null)}
                        style={{
                          padding: "7px 10px",
                          borderRadius: 8,
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "#cbd5e1",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Dismiss (Create New Pin)
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Roofer Name */}
                <div className="form-group" style={{ border: tourStep === 1 ? "2px solid #e2b047" : "1px solid transparent", borderRadius: "8px", padding: tourStep === 1 ? "8px" : "0", boxShadow: tourStep === 1 ? "0 0 12px rgba(226, 176, 71, 0.4)" : "none", transition: "all 0.3s" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label">Roofer/Technician Name</label>
                    {author && userRole === "admin" && (
                      <button
                        type="button"
                        onClick={() => handleDeleteTechnician(author)}
                        style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.72rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px", padding: "0 0 4px 0" }}
                      >
                        🗑️ Delete {author}
                      </button>
                    )}
                  </div>
                  <select
                    className="form-input"
                    value={author}
                    onChange={(e) => {
                      if (e.target.value === "ADD_NEW_TECH") {
                        setShowAddTechInput(true);
                        setAuthor("");
                      } else {
                        setAuthor(e.target.value);
                        setQuickReviewAuthor(e.target.value);
                        if (e.target.value) {
                          try {
                            localStorage.setItem("pindrop_selected_author", e.target.value);
                          } catch {}
                        }
                      }
                    }}
                    required={!showAddTechInput}
                  >
                    <option value="">Select Technician</option>
                    {authorList.map((auth) => (
                      <option key={auth} value={auth}>{auth}</option>
                    ))}
                    <option value="ADD_NEW_TECH" style={{ color: "#e2b047", fontWeight: "bold" }}>+ Add New Technician...</option>
                  </select>

                  {showAddTechInput && (
                    <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                      <input
                        type="text"
                        placeholder="Technician full name"
                        value={newTechName}
                        onChange={(e) => setNewTechName(e.target.value)}
                        style={{ flex: 1, padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                      />
                      <button
                        type="button"
                        onClick={async (e) => {
                          await handleAddTechnician(e);
                          setShowAddTechInput(false);
                        }}
                        className="btn btn-outline"
                        style={{ fontSize: "0.72rem", height: "30px", background: "rgba(226, 176, 71, 0.15)", color: "#e2b047", border: "1px solid #e2b047", cursor: "pointer", borderRadius: "4px" }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddTechInput(false);
                          setNewTechName("");
                        }}
                        style={{ fontSize: "0.72rem", height: "30px", background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Job Location */}
                <div className="form-group">
                  <label className="form-label">Location (City)</label>
                  <select
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  >
                    <option value="">Select City</option>
                    {Object.keys(cityCoords).sort().map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Service Category */}
                <div className="form-group">
                  <label className="form-label">Service Type</label>
                  <select
                    className="form-input"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  >
                    <option value="">Select Service Type</option>
                    {serviceList.map((svc) => (
                      <option key={svc} value={svc}>{svc}</option>
                    ))}
                  </select>
                </div>

                {service === "Custom Category..." && (
                  <div className="form-group animate-fade-in">
                    <label className="form-label">Specify Custom Service Type</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sheetrock & Drywall, Plumbing, Siding"
                      value={customService}
                      onChange={(e) => setCustomService(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* GPS Coordinates Wrapper */}
                <div className="form-group">
                  <label className="form-label">GPS / Location Coordinates</label>
                  <div className="gps-row">
                    <button
                      type="button"
                      className="btn btn-outline gps-btn"
                      onClick={getGPSLocation}
                      disabled={geoLoading}
                    >
                      {geoLoading ? "Locating..." : "📍 Get Current Coords"}
                    </button>
                    <div className="coords-display">
                      <div className="coord-field">
                        <span>Lat:</span>
                        <input
                          type="number"
                          step="any"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          placeholder="e.g. 32.27"
                          className="coord-input"
                          style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 8px", color: "#ffffff" }}
                        />
                      </div>
                      <div className="coord-field">
                        <span>Lng:</span>
                        <input
                          type="number"
                          step="any"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value === "" ? "" : parseFloat(e.target.value))}
                          placeholder="e.g. -90.13"
                          className="coord-input"
                          style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", borderRadius: "4px", padding: "4px 8px", color: "#ffffff" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Lookup Helper */}
                <div className="form-group" style={{ background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", borderRadius: "8px", padding: "1.25rem" }}>
                  <label className="form-label" style={{ fontSize: "0.75rem", color: "var(--secondary)", marginBottom: "0.5rem" }}>Convert Address to Coords (Optional)</label>
                  
                  {/* Street Address */}
                  <div style={{ marginBottom: "0.75rem" }}>
                    <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 150 Highland Dr"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* City, State, Zip Row */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "1rem" }}>
                    <div style={{ flex: "2 1 120px" }}>
                      <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>City</label>
                      <input
                        type="text"
                        placeholder="e.g. Brandon"
                        value={cityInput}
                        onChange={(e) => setCityInput(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div style={{ flex: "1 1 60px" }}>
                      <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>State</label>
                      <input
                        type="text"
                        placeholder="MS"
                        value={stateInput}
                        onChange={(e) => setStateInput(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div style={{ flex: "1.5 1 80px" }}>
                      <label style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>Zip Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 39042"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  {/* Convert Button */}
                  <button
                    type="button"
                    onClick={geocodeAddress}
                    className="convert-btn"
                    disabled={isGeocoding}
                    style={{ width: "100%", justifyContent: "center", height: "42px" }}
                  >
                    {isGeocoding ? "Searching Coordinates..." : "🔍 Convert to Coordinates"}
                  </button>

                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: "8px 0 0 0", lineHeight: "1.4" }}>
                    If you are in the office, enter the job address and click Convert to automatically update coordinates and matching city.
                  </p>
                </div>

                {/* Date & Job Status Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="text" className="form-input" value={date} disabled />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Status</label>
                    <select
                      className="form-input"
                      value={projectStatus}
                      onChange={(e) => {
                        const val = e.target.value as "in_progress" | "inspection" | "completed";
                        setProjectStatus(val);
                        if (val === "inspection") setPublishToPublicMap(false);
                        if (val === "completed") setPublishToPublicMap(true);
                      }}
                    >
                      <option value="completed">✅ Completed Project</option>
                      <option value="in_progress">🚧 Active Job (In Progress)</option>
                      <option value="inspection">🔍 Inspection Only (Internal)</option>
                    </select>
                  </div>
                </div>

                {/* Description + Hands-Free Voice Dictation */}
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                    <label className="form-label">Project Description</label>
                    <button
                      type="button"
                      onClick={handleVoiceDictate}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 99,
                        border: isDictating ? "1px solid #ef4444" : "1px solid rgba(226,176,71,0.4)",
                        background: isDictating ? "rgba(239,68,68,0.2)" : "rgba(226,176,71,0.12)",
                        color: isDictating ? "#fca5a5" : "#fde047",
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {isDictating ? "🛑 Listening... Tap to Stop" : "🎙️ Voice Dictate Notes"}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Describe the job. E.g., Installed a GAF Timberline HDZ architectural roof system in Byram, MS. Completed leak diagnostics near the chimney."
                    className="form-input textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {/* Collapsible Private Customer Info & SOP Checklist Drawer */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.09)",
                    borderRadius: 10,
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowInternalSection(!showInternalSection)}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "transparent",
                      border: "none",
                      color: "#e2e8f0",
                      fontSize: "0.8rem",
                      fontWeight: 800,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span>🔒 Customer Info, Private Crew Notes &amp; SOP Checklist (Optional)</span>
                    <span>{showInternalSection ? "▲" : "▼"}</span>
                  </button>

                  {showInternalSection && (
                    <div style={{ padding: "0 14px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <input
                          type="text"
                          placeholder="Customer Name (Private)"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="form-input"
                        />
                        <input
                          type="text"
                          placeholder="Customer Phone (for Portal SMS)"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <textarea
                        rows={2}
                        placeholder="Private Crew / Adjuster Notes (Never shown on public map)..."
                        value={internalNotes}
                        onChange={(e) => setInternalNotes(e.target.value)}
                        className="form-input textarea"
                      />
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.78rem", color: "#cbd5e1", cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          checked={publishToPublicMap}
                          onChange={(e) => setPublishToPublicMap(e.target.checked)}
                        />
                        🌐 Publish this job to the Public SEO Project Map
                      </label>

                      {checklist.length > 0 && (
                        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#fde047" }}>
                            ✅ Required SOP Photo &amp; Inspection Checklist:
                          </div>
                          {checklist.map((item, idx) => (
                            <label
                              key={item.id}
                              style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.76rem", color: item.completed ? "#4ade80" : "#e2e8f0", cursor: "pointer" }}
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={(e) => {
                                  const next = [...checklist];
                                  next[idx] = {
                                    ...item,
                                    completed: e.target.checked,
                                    completedBy: e.target.checked ? author || "Tech" : undefined,
                                    completedAt: e.target.checked ? new Date().toISOString() : undefined,
                                  };
                                  setChecklist(next);
                                }}
                              />
                              <span>{item.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Photo Upload, Ghost Cam, Markup & Stage Tagging */}
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                    <label className="form-label">Project Photographs (HD 1600px • Up to 60)</label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.73rem", color: "#cbd5e1", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={stampWatermark}
                        onChange={(e) => setStampWatermark(e.target.checked)}
                      />
                      🏷️ Stamp Date/GPS Watermark
                    </label>
                  </div>
                  {isCompressing ? (
                    <div className="upload-btn disabled">
                      {uploadStatus || "Processing HD Images..."}
                    </div>
                  ) : (
                    <div className="upload-buttons-container">
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="upload-hidden-input"
                        id="photo-capture"
                        onChange={handleImageUpload}
                        disabled={isCompressing}
                      />
                      <label htmlFor="photo-capture" className="upload-btn primary-upload-btn">
                        📸 Take Live HD Photo
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="upload-hidden-input"
                        id="photo-gallery"
                        onChange={handleImageUpload}
                        disabled={isCompressing}
                      />
                      <label htmlFor="photo-gallery" className="upload-btn outline-upload-btn">
                        📁 Select from Gallery (Auto-Reads EXIF GPS)
                      </label>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          type="button"
                          onClick={() => setGhostCamMode("ghost_photo")}
                          style={{
                            flex: 1,
                            padding: "10px 12px",
                            borderRadius: 8,
                            background: "rgba(168,85,247,0.16)",
                            border: "1px solid rgba(168,85,247,0.4)",
                            color: "#e9d5ff",
                            fontSize: "0.78rem",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          👻 Ghost Cam (After Alignment)
                        </button>
                        <button
                          type="button"
                          onClick={() => setGhostCamMode("video_walkthrough")}
                          style={{
                            flex: 1,
                            padding: "10px 12px",
                            borderRadius: 8,
                            background: "rgba(59,130,246,0.16)",
                            border: "1px solid rgba(59,130,246,0.4)",
                            color: "#93c5fd",
                            fontSize: "0.78rem",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          🎥 Video Walkthrough + Voice
                        </button>

                        {photoMetaList.length >= 2 && (
                          <button
                            type="button"
                            onClick={handleBuildBeforeAfterCollage}
                            disabled={buildingCollage}
                            style={{
                              flex: 1,
                              padding: "10px 12px",
                              borderRadius: 8,
                              background: "rgba(226,176,71,0.16)",
                              border: "1px solid rgba(226,176,71,0.45)",
                              color: "#fde047",
                              fontSize: "0.78rem",
                              fontWeight: 800,
                              cursor: "pointer",
                            }}
                          >
                            {buildingCollage ? "Building Split..." : "✨ Build Before/After Graphic"}
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Interactive Before/After Preview if both stages are tagged */}
                  {photoMetaList.some((p) => p.stage === "before") &&
                    photoMetaList.some((p) => p.stage === "after") && (
                      <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: "0.74rem", fontWeight: 800, color: "#fde047", marginBottom: 6 }}>
                          ⚡ Live Before &amp; After Slider Preview
                        </div>
                        <BeforeAfterSlider
                          beforeUrl={photoMetaList.find((p) => p.stage === "before")!.url}
                          afterUrl={photoMetaList.find((p) => p.stage === "after")!.url}
                          height={220}
                        />
                      </div>
                    )}

                  {photoMetaList.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                        gap: 10,
                        marginTop: 12,
                      }}
                    >
                      {photoMetaList.map((item, idx) => (
                        <div
                          key={`${item.url}-${idx}`}
                          style={{
                            background: "#0d0d14",
                            borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.12)",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div style={{ position: "relative", height: 125 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.url} alt={`Preview ${idx}`} className="preview-img" />
                            <button
                              type="button"
                              className="preview-remove"
                              onClick={() => handleRemoveImage(idx)}
                            >
                              &times;
                            </button>
                            <button
                              type="button"
                              onClick={() => setMarkupPhotoIndex(idx)}
                              style={{
                                position: "absolute",
                                bottom: 6,
                                left: 6,
                                padding: "3px 8px",
                                borderRadius: 6,
                                background: "rgba(0,0,0,0.82)",
                                border: "1px solid rgba(255,255,255,0.25)",
                                color: "#fff",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              ✏️ Markup / 💬 ({item.comments?.length || 0})
                            </button>
                          </div>
                          <div style={{ padding: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                            <div style={{ display: "flex", gap: 4 }}>
                              <select
                                value={item.stage}
                                onChange={(e) => {
                                  const next = [...photoMetaList];
                                  next[idx] = { ...next[idx], stage: e.target.value as PhotoStage };
                                  setPhotoMetaList(next);
                                }}
                                style={{
                                  flex: 1,
                                  padding: "3px 6px",
                                  borderRadius: 4,
                                  background: "#16161f",
                                  border: "1px solid rgba(255,255,255,0.15)",
                                  color: "#fff",
                                  fontSize: "0.7rem",
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
                                  const next = [...photoMetaList];
                                  next[idx] = { ...next[idx], isPublic: item.isPublic === false };
                                  setPhotoMetaList(next);
                                }}
                                style={{
                                  padding: "3px 6px",
                                  borderRadius: 4,
                                  border: "1px solid rgba(255,255,255,0.15)",
                                  background: item.isPublic !== false ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.2)",
                                  color: item.isPublic !== false ? "#4ade80" : "#f87171",
                                  fontSize: "0.65rem",
                                  fontWeight: 700,
                                  cursor: "pointer",
                                }}
                              >
                                {item.isPublic !== false ? "🌐" : "🔒"}
                              </button>
                            </div>
                            <input
                              type="text"
                              value={item.caption || ""}
                              onChange={(e) => {
                                const next = [...photoMetaList];
                                next[idx] = { ...next[idx], caption: e.target.value };
                                setPhotoMetaList(next);
                              }}
                              placeholder="Photo note..."
                              style={{
                                padding: "3px 6px",
                                borderRadius: 4,
                                background: "#16161f",
                                border: "1px solid rgba(255,255,255,0.1)",
                                color: "#e2e8f0",
                                fontSize: "0.68rem",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {submitError && <p className="submit-error">{submitError}</p>}

                {/* Form Buttons */}
                <button
                  type="submit"
                  className="btn btn-outline submit-form-btn"
                  disabled={submitLoading || isCompressing}
                >
                  {submitLoading ? "Submitting..." : "Submit Project Pin"}
                </button>

              </form>
            </div>
          </div>

          {/* Quick Review Requester */}
          <div className="double-bezel-wrapper" style={{ maxWidth: "580px", margin: "2rem auto 0", height: "auto" }}>
            <div className="double-bezel-inner" style={{ padding: "1.5rem", textAlign: "left", height: "auto" }}>
              <h3 style={{ color: "#ffffff", fontSize: "1.05rem", fontWeight: "800", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>⚡</span> Direct Review Requester
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 1.25rem 0", lineHeight: "1.5" }}>
                Send a review request immediately to your customer (no pin drop required):
              </p>
              
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <select
                    className="form-input"
                    value={quickReviewAuthor}
                    onChange={(e) => {
                      setQuickReviewAuthor(e.target.value);
                      setAuthor(e.target.value);
                      if (e.target.value) {
                        try {
                          localStorage.setItem("pindrop_selected_author", e.target.value);
                        } catch {}
                      }
                    }}
                    style={{ margin: 0, width: "100%", height: "42px", background: "rgba(255, 255, 255, 0.02)" }}
                  >
                    <option value="">Select Your Name...</option>
                    {authorList.map((auth) => (
                      <option key={auth} value={auth}>{auth}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", gap: "10px", flex: "1 1 250px" }}>
                  <a
                    href={quickReviewAuthor ? `sms:?body=${encodeURIComponent(
                      `Hi! This is ${quickReviewAuthor.split(" ")[0]} from ${companyName || "our company"}. It was a pleasure working on your home. Would you mind leaving us a quick Google review? You can leave it here: ${googleReviewUrl}`
                    )}` : "#"}
                    onClick={(e) => { 
                      if (!quickReviewAuthor) { e.preventDefault(); alert("Please select a technician name first!"); }
                      else if (!googleReviewUrl) { e.preventDefault(); alert("Please configure your Google Review Link in the settings accordion below first!"); }
                    }}
                    className="btn btn-outline"
                    style={{ flex: "1", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", height: "42px", background: (quickReviewAuthor && googleReviewUrl) ? "rgba(226, 176, 71, 0.08)" : "rgba(255, 255, 255, 0.02)", opacity: (quickReviewAuthor && googleReviewUrl) ? 1 : 0.5 }}
                  >
                    💬 Text Customer
                  </a>
                  <a
                    href={quickReviewAuthor ? `mailto:?subject=${encodeURIComponent(`Review for ${companyName || "our company"}`)}&body=${encodeURIComponent(
                      `Hi there,\n\nThis is ${quickReviewAuthor.split(" ")[0]} from ${companyName || "our company"}. It was a pleasure working on your home. Would you mind leaving us a quick Google review?\n\nYou can leave it here:\n${googleReviewUrl}\n\nThank you!`
                    )}` : "#"}
                    onClick={(e) => { 
                      if (!quickReviewAuthor) { e.preventDefault(); alert("Please select a technician name first!"); }
                      else if (!googleReviewUrl) { e.preventDefault(); alert("Please configure your Google Review Link in the settings accordion below first!"); }
                    }}
                    className="btn btn-outline"
                    style={{ flex: "1", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", fontSize: "0.8rem", height: "42px", background: (quickReviewAuthor && googleReviewUrl) ? "rgba(226, 176, 71, 0.08)" : "rgba(255, 255, 255, 0.02)", opacity: (quickReviewAuthor && googleReviewUrl) ? 1 : 0.5 }}
                  >
                    ✉️ Email Customer
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Unified Integrations Accordion Card */}
          {userRole === "admin" && (
          <div className="double-bezel-wrapper" style={{ maxWidth: "580px", margin: "2rem auto 0", height: "auto" }}>
            <div className="double-bezel-inner" style={{ padding: "1.5rem", textAlign: "left", height: "auto" }}>
              <h3 style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: "800", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <span>🔌</span> Unified Integrations
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  
                  <div style={{ border: tourStep === 2 ? "2px solid #e2b047" : "1px solid rgba(255, 255, 255, 0.05)", boxShadow: tourStep === 2 ? "0 0 10px rgba(226, 176, 71, 0.3)" : "none", transition: "all 0.3s", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
                    <div 
                      onClick={() => setExpandedTab(expandedTab === "google" ? null : "google")}
                      style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "rgba(255, 255, 255, 0.02)", userSelect: "none" }}
                    >
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>🌐</span> Google Maps Sync
                      </span>
                      <span style={{ color: googleConnected ? "#10b981" : "#e1b047", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                        {googleConnected ? "✓ Connected" : "⚠️ Pending"} {expandedTab === "google" ? "▲" : "▼"}
                      </span>
                    </div>
                    
                    {expandedTab === "google" && (
                      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 1rem 0", lineHeight: "1.4" }}>
                          Push check-ins and project photos straight to Google Maps. (<span style={{ color: "#e2b047", cursor: "pointer", textDecoration: "underline" }} onClick={() => setShowGoogleModal(true)}>Guide</span>)
                        </p>
                        <button
                          type="button"
                          onClick={handleConnectGoogle}
                          disabled={isConnectingGoogle}
                          className="btn btn-outline"
                          style={{ width: "100%", fontSize: "0.75rem", height: "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(226, 176, 71, 0.08)", color: "#ffffff", border: "1px solid #e2b047", cursor: isConnectingGoogle ? "not-allowed" : "pointer" }}
                        >
                          {isConnectingGoogle ? "Connecting to Google..." : (googleConnected ? "🔄 Re-connect Maps Profile" : "Connect Maps Profile")}
                        </button>

                        <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                          <h5 style={{ color: "#ffffff", fontSize: "0.78rem", fontWeight: "700", marginBottom: "8px" }}>⭐ Google Review Link</h5>
                          <form onSubmit={handleSaveReviewUrl} style={{ display: "flex", gap: "8px" }}>
                            <input
                              type="text"
                              placeholder="Paste Google Review Link"
                              value={newReviewUrlInput}
                              onChange={(e) => setNewReviewUrlInput(e.target.value)}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                            />
                            <button
                              type="submit"
                              className="btn btn-outline"
                              style={{ fontSize: "0.72rem", height: "30px", background: "rgba(226, 176, 71, 0.15)", color: "#e2b047", border: "1px solid #e2b047", cursor: "pointer", borderRadius: "4px", padding: "0 12px" }}
                            >
                              Save Link
                            </button>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ border: tourStep === 3 ? "2px solid #e2b047" : "1px solid rgba(255, 255, 255, 0.05)", boxShadow: tourStep === 3 ? "0 0 10px rgba(226, 176, 71, 0.3)" : "none", transition: "all 0.3s", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
                    <div 
                      onClick={() => setExpandedTab(expandedTab === "crm" ? null : "crm")}
                      style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "rgba(255, 255, 255, 0.02)", userSelect: "none" }}
                    >
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>📋</span> Transpond CRM
                      </span>
                      {transpondConfigured ? (
                        <span style={{ color: "#4caf50", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                          ✓ Connected {expandedTab === "crm" ? "▲" : "▼"}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                          Not Configured {expandedTab === "crm" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                    
                    {expandedTab === "crm" && (
                      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 1rem 0", lineHeight: "1.4" }}>
                          Sync reviews and customer leads into your CRM account.
                        </p>
                        
                        <form onSubmit={handleSaveTranspondSettings} style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                          <input
                            type="password"
                            placeholder="Transpond API Key"
                            value={transpondApiKey === "env_configured" ? "" : transpondApiKey}
                            disabled={transpondApiKey === "env_configured"}
                            onChange={(e) => setTranspondApiKey(e.target.value)}
                            style={{ width: "100%", padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                          />
                          {transpondApiKey === "env_configured" && (
                            <div style={{ fontSize: "0.65rem", color: "#4caf50", marginTop: "-4px" }}>Configured in environment file</div>
                          )}
                          <input
                            type="text"
                            placeholder="Transpond Group ID"
                            value={transpondGroupId}
                            onChange={(e) => setTranspondGroupId(e.target.value)}
                            style={{ width: "100%", padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                          />
                          <button
                            type="submit"
                            className="btn btn-outline"
                            disabled={transpondSaveStatus === "saving" || transpondApiKey === "env_configured"}
                            style={{ width: "100%", fontSize: "0.72rem", height: "30px", background: "rgba(255, 255, 255, 0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", borderRadius: "4px" }}
                          >
                            {transpondSaveStatus === "saving" ? "Saving..." : transpondSaveStatus === "saved" ? "Saved! ✓" : "Save CRM Keys"}
                          </button>
                        </form>

                        <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
                          <h5 style={{ color: "#ffffff", fontSize: "0.78rem", fontWeight: "700", marginBottom: "8px" }}>🔒 Update Field Passcode</h5>
                          <form onSubmit={handleSavePasscode} style={{ display: "flex", gap: "8px" }}>
                            <input
                              type="password"
                              placeholder="New Field Passcode"
                              value={newRooferPasscode}
                              onChange={(e) => setNewRooferPasscode(e.target.value)}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "0.75rem", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#fff" }}
                            />
                            <button
                              type="submit"
                              className="btn btn-outline"
                              disabled={isUpdatingPasscode}
                              style={{ fontSize: "0.72rem", height: "30px", background: "rgba(226, 176, 71, 0.15)", color: "#e2b047", border: "1px solid #e2b047", cursor: "pointer", borderRadius: "4px", padding: "0 12px" }}
                            >
                              {isUpdatingPasscode ? "Saving..." : "Save"}
                            </button>
                          </form>
                        </div>

                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px", marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                          <span>Don&apos;t have accounts?</span>
                          <a href="https://get.capsulenow.io/w87ng8tquqti" target="_blank" rel="noopener noreferrer" style={{ color: "#e2b047", textDecoration: "underline" }}>Capsule</a>
                          <span>•</span>
                          <a href="https://get.capsulenow.io/h70zife95sd6-no30m" target="_blank" rel="noopener noreferrer" style={{ color: "#e2b047", textDecoration: "underline" }}>Transpond</a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ border: tourStep === 4 ? "2px solid #e2b047" : "1px solid rgba(255, 255, 255, 0.05)", boxShadow: tourStep === 4 ? "0 0 10px rgba(226, 176, 71, 0.3)" : "none", transition: "all 0.3s", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.01)" }}>
                    <div 
                      onClick={() => setExpandedTab(expandedTab === "social" ? null : "social")}
                      style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: "rgba(255, 255, 255, 0.02)", userSelect: "none" }}
                    >
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>📱</span> Social Media Auto-Post
                      </span>
                      {socialConnected ? (
                        <span style={{ color: "#4caf50", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                          ✓ Active {expandedTab === "social" ? "▲" : "▼"}
                        </span>
                      ) : (
                        <span style={{ color: transpondConfigured ? "#e1b047" : "#f44336", fontSize: "0.7rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "4px" }}>
                          {transpondConfigured ? "Not Connected" : "🔒 Locked"} {expandedTab === "social" ? "▲" : "▼"}
                        </span>
                      )}
                    </div>
                    
                    {expandedTab === "social" && (
                      <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.15)" }}>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "0 0 1rem 0", lineHeight: "1.4" }}>
                          Auto-post check-ins to Facebook, Instagram & LinkedIn.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            if (!transpondConfigured) {
                              setShowSocialWarningModal(true);
                            } else {
                              window.open("https://www.facebook.com/v15.0/dialog/oauth?client_id=3446478465675846&redirect_uri=https%3A%2F%2Fweb.mpzmail.com%2Fcp%2Fcompany%2Fintegrations%2FoAuth%2Fresponse%2F77&state=&scope=pages_show_list%2Cleads_retrieval%2Cpages_read_engagement%2Cpages_manage_posts%2Cinstagram_basic%2Cinstagram_content_publish%2Cbusiness_management%2Cread_insights%2Cinstagram_manage_insights%2Cpages_manage_metadata%2Cpages_messaging", "_blank");
                            }
                          }}
                          className="btn btn-outline"
                          style={{ width: "100%", fontSize: "0.75rem", height: "36px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "rgba(255, 255, 255, 0.02)", color: "#ffffff", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer" }}
                        >
                          {!transpondConfigured ? "🔒 Unlock Feature" : "🔌 Connect Social Pages"}
                        </button>
                      </div>
                    )}
                  </div>



                </div>
              </div>
            </div>
          )}
            </>
           ) : null}

          {/* CompanyCam Modals: Photo Markup, Ghost Camera & Single-Project Workspace */}
          {markupPhotoIndex !== null && photoMetaList[markupPhotoIndex] && (
            <PhotoMarkupModal
              imageUrl={photoMetaList[markupPhotoIndex].url}
              initialComments={photoMetaList[markupPhotoIndex].comments || []}
              authorName={author || "Field Specialist"}
              technicians={authorList}
              onClose={() => setMarkupPhotoIndex(null)}
              onSaveAnnotatedImage={async (annotatedDataUrl) => {
                let finalUrl = photoMetaList[markupPhotoIndex].url;
                if (annotatedDataUrl !== photoMetaList[markupPhotoIndex].url) {
                  finalUrl = await uploadBase64Photo(annotatedDataUrl);
                }
                const nextMeta = [...photoMetaList];
                nextMeta[markupPhotoIndex] = {
                  ...nextMeta[markupPhotoIndex],
                  url: finalUrl,
                };
                setPhotoMetaList(nextMeta);
                const nextImgs = [...images];
                nextImgs[markupPhotoIndex] = finalUrl;
                setImages(nextImgs);
              }}
              onAddPhotoComment={async (comment) => {
                const nextMeta = [...photoMetaList];
                const existing = nextMeta[markupPhotoIndex].comments || [];
                nextMeta[markupPhotoIndex] = {
                  ...nextMeta[markupPhotoIndex],
                  comments: [
                    ...existing,
                    {
                      ...comment,
                      id: `pcomm_${Date.now()}`,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                };
                setPhotoMetaList(nextMeta);
              }}
            />
          )}

          {ghostCamMode && (
            <GhostCameraModal
              ghostBeforeUrl={
                photoMetaList.find((p) => p.stage === "before")?.url || photoMetaList[0]?.url
              }
              mode={ghostCamMode}
              onClose={() => setGhostCamMode(null)}
              onCapturePhoto={async (dataUrl) => {
                setGhostCamMode(null);
                setIsCompressing(true);
                setUploadStatus("Uploading Ghost-Aligned HD Photo...");
                try {
                  const uploadedUrl = await uploadBase64Photo(dataUrl);
                  setImages((prev) => [...prev, uploadedUrl]);
                  setPhotoMetaList((prev) => [
                    ...prev,
                    {
                      url: uploadedUrl,
                      stage: "after",
                      caption: "Ghost-Cam Aligned After Shot",
                      uploadedBy: author || "Field Specialist",
                      capturedAt: new Date().toISOString(),
                      isPublic: true,
                      comments: [],
                    },
                  ]);
                } catch (err) {
                  console.error("Failed uploading ghost photo:", err);
                } finally {
                  setIsCompressing(false);
                  setUploadStatus("");
                }
              }}
              onCaptureVideo={async (videoDataUrl, transcript) => {
                setGhostCamMode(null);
                setIsCompressing(true);
                setUploadStatus("Uploading Field Video Walkthrough...");
                try {
                  const resBlob = await fetch(videoDataUrl);
                  const videoBlob = await resBlob.blob();
                  const file = new File([videoBlob], `walkthrough_${Date.now()}.webm`, {
                    type: videoBlob.type || "video/webm",
                  });
                  const formData = new FormData();
                  formData.append("file", file);
                  const res = await fetch("/api/upload", {
                    method: "POST",
                    headers: authHeaders(false),
                    body: formData,
                  });
                  const data = await res.json();
                  if (data.url) {
                    setWalkthroughVideoUrl(data.url);
                  } else {
                    setWalkthroughVideoUrl(videoDataUrl);
                  }
                  if (transcript) {
                    setDescription((prev) =>
                      `${prev ? prev.trim() + " " : ""}${transcript.trim()}`
                    );
                  }
                } catch (err) {
                  console.error("Video upload failed:", err);
                  setWalkthroughVideoUrl(videoDataUrl);
                } finally {
                  setIsCompressing(false);
                  setUploadStatus("");
                }
              }}
            />
          )}

          {selectedWorkspacePin && (
            <ProjectWorkspaceModal
              pin={selectedWorkspacePin}
              companyName={companyName || "Born Again Roofing"}
              currentTechName={author || authorList[0] || "Field Specialist"}
              crewMembers={authorList.map((name) => ({ name }))}
              authHeaders={() => authHeaders(false)}
              onClose={() => setSelectedWorkspacePin(null)}
              onUpdated={(updated) => {
                setSelectedWorkspacePin(updated);
                setAllPins((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
              }}
            />
          )}

          {/* Google Business API Instructions Modal */}
          {showGoogleModal && (
            <div style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.85)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: "1.5rem",
              backdropFilter: "blur(8px)"
            }}>
              <div className="double-bezel-wrapper" style={{ maxWidth: "600px", width: "100%", height: "auto", maxHeight: "90vh", overflowY: "auto" }}>
                <div className="double-bezel-inner" style={{ padding: "2rem", position: "relative" }}>
                  <button 
                    onClick={() => setShowGoogleModal(false)}
                    style={{
                      position: "absolute",
                      top: "1.25rem",
                      right: "1.25rem",
                      background: "none",
                      border: "none",
                      color: "#ffffff",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      opacity: 0.7,
                      transition: "opacity 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = "1"}
                    onMouseOut={(e) => e.currentTarget.style.opacity = "0.7"}
                  >
                    ✕
                  </button>
                  
                  <h3 style={{ color: "#ffffff", fontSize: "1.25rem", fontWeight: "900", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    🌐 Google My Business Sync Setup
                  </h3>
                  
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                    Follow these steps in your Google Cloud Console to enable automatic posting of check-ins directly to your Google Business Profile (Google Maps card):
                  </p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.8rem", color: "#ffffff", lineHeight: "1.6", textAlign: "left" }}>
                    <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <strong style={{ color: "#e2b047", display: "block", marginBottom: "4px" }}>Step 1: Open Google Cloud Console</strong>
                      Go to <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" style={{ color: "#e2b047", textDecoration: "underline" }}>console.cloud.google.com</a> and sign in with the Google Account that manages the business maps profile. Create a new project (e.g., &quot;PinDrop SEO&quot;).
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <strong style={{ color: "#e2b047", display: "block", marginBottom: "4px" }}>Step 2: Request Access to Business Profile APIs</strong>
                      Search for and enable the <strong>My Business Account Management API</strong> and <strong>My Business Business Information API</strong>.
                      <span style={{ display: "block", color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "4px" }}>
                        *Note: Because this API is restricted to prevent Google Maps spam, Google Cloud requires you to submit a quick request form. It usually takes 2-3 business days to get access approval.
                      </span>
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <strong style={{ color: "#e2b047", display: "block", marginBottom: "4px" }}>Step 3: Create OAuth Credentials</strong>
                      Go to <strong>APIs & Services &gt; Credentials</strong>. Create an &quot;OAuth Client ID&quot; (select &quot;Web Application&quot;). 
                      Add your deployment domains (e.g., `https://bornagainroofing.com` and `http://localhost:3000`) under **Authorized Javascript Origins** and **Authorized Redirect URIs**.
                    </div>

                    <div style={{ background: "rgba(255, 255, 255, 0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <strong style={{ color: "#e2b047", display: "block", marginBottom: "4px" }}>Step 4: Save API Credentials to App</strong>
                      Add your Client ID and Client Secret to the server configuration (`.env.local`):
                      <pre style={{ margin: "8px 0 0 0", padding: "8px", background: "#0a0f1d", color: "#8ab4f8", fontSize: "0.75rem", overflowX: "auto", borderRadius: "4px" }}>
                        GOOGLE_CLIENT_ID=your_id_here{"\n"}
                        GOOGLE_CLIENT_SECRET=your_secret_here
                      </pre>
                    </div>
                  </div>

                  {/* Mock GBP Post Preview Card */}
                  <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "1.5rem" }}>
                    <h4 style={{ color: "#ffffff", fontSize: "0.9rem", fontWeight: "700", marginBottom: "0.75rem", textAlign: "left" }}>
                      📸 Google Maps Post Preview (Example):
                    </h4>
                    <div style={{ background: "#ffffff", color: "#1f2937", borderRadius: "12px", padding: "16px", textAlign: "left", boxShadow: "0 4px 20px rgba(0,0,0,0.3)", maxWidth: "420px", margin: "0 auto" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#e2b047", fontWeight: "bold", fontSize: "0.8rem" }}>BA</div>
                        <div>
                          <strong style={{ fontSize: "0.85rem", color: "#111827", display: "block" }}>Born Again Home Remodeling & Roofing</strong>
                          <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>Google Maps Update • Just now</span>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "#374151", margin: "0 0 12px 0", lineHeight: "1.4" }}>
                        📍 <strong>Jackson, MS</strong><br/>
                        Installed a GAF Timberline HDZ architectural roof replacement, replacing old shingle decking with heavy-duty felt underlayment and custom leak barriers...
                      </p>
                      <div style={{ width: "100%", height: "180px", borderRadius: "8px", background: "url('/images/remodeling-hero.jpg') center/cover no-repeat" }}></div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowGoogleModal(false)}
                    className="btn btn-outline"
                    style={{ width: "100%", marginTop: "1.5rem", height: "42px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    Close Setup Instructions
                  </button>
                </div>
              </div>
            </div>
          )}

           {/* Social Media Subscription Warning Modal */}
           {showSocialWarningModal && (
             <div style={{
               position: "fixed",
               top: 0,
               left: 0,
               width: "100%",
               height: "100%",
               backgroundColor: "rgba(0, 0, 0, 0.85)",
               display: "flex",
               alignItems: "center",
               justifyContent: "center",
               zIndex: 9999,
               padding: "1.5rem",
               backdropFilter: "blur(8px)"
             }}>
               <div className="double-bezel-wrapper" style={{ maxWidth: "500px", width: "100%", height: "auto" }}>
                 <div className="double-bezel-inner" style={{ padding: "2rem", position: "relative", textAlign: "left" }}>
                   <button 
                     onClick={() => setShowSocialWarningModal(false)}
                     style={{
                       position: "absolute",
                       top: "1.25rem",
                       right: "1.25rem",
                       background: "none",
                       border: "none",
                       color: "#ffffff",
                       fontSize: "1.5rem",
                       cursor: "pointer",
                       opacity: 0.7
                     }}
                   >
                     ✕
                   </button>
                   
                   <h3 style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "900", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                     ⚠️ Subscription Required
                   </h3>
                   
                   <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                     Automating social media posts requires active subscriptions to <strong>Capsule CRM</strong> and <strong>Transpond</strong> (approx. $50.00/mo combined) to handle background automations.
                   </p>

                   <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "1.5rem" }}>
                     <a 
                       href="https://get.capsulenow.io/w87ng8tquqti" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="btn btn-outline" 
                       style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40px", fontSize: "0.8rem", color: "#e2b047", border: "1px solid #e2b047" }}
                     >
                       🚀 Sign up for Capsule CRM
                     </a>
                     <a 
                       href="https://get.capsulenow.io/h70zife95sd6-no30m" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="btn btn-outline" 
                       style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "40px", fontSize: "0.8rem", color: "#e2b047", border: "1px solid #e2b047" }}
                     >
                       🚀 Sign up for Transpond Social
                     </a>
                   </div>

                   <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.02)", padding: "10px 12px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
                     <strong>Already have accounts?</strong><br/>
                     Copy your API Key and Group ID from your Transpond settings and save them under the **Transpond CRM** card to instantly unlock this feature!
                   </div>
                 </div>
               </div>
             </div>
           )}

            {/* Interactive Tour Overlay */}
            {tourStep !== null && (
              <div style={{
                position: "fixed",
                bottom: "2rem",
                right: "2rem",
                zIndex: 10000,
                maxWidth: "360px",
                width: "calc(100% - 4rem)",
                backgroundColor: "#111827",
                border: "2px solid #e2b047",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5), 0 0 10px rgba(226, 176, 71, 0.2)",
                padding: "1.25rem",
                textAlign: "left"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "1px", color: "#e2b047", fontWeight: "bold" }}>
                    App Walkthrough ({tourStep}/4)
                  </span>
                  <button 
                    onClick={handleFinishTour}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.9rem" }}
                  >
                    ✕
                  </button>
                </div>
                
                <div style={{ fontSize: "0.82rem", color: "#ffffff", lineHeight: "1.5", marginBottom: "1.25rem" }}>
                  {tourStep === 1 && (
                    <div>
                      <strong>👋 Welcome to PDM PinDrop!</strong><br/><br/>
                      First, select your name from the <strong>Roofer/Technician</strong> dropdown and select the <strong>Location (City)</strong> to start pinning jobs.
                    </div>
                  )}
                  {tourStep === 2 && (
                    <div>
                      <strong>🌐 Step 1: Google Maps Sync</strong><br/><br/>
                      We have expanded the <strong>Google Maps Sync</strong> section. Click <strong>Connect Maps Profile</strong> to link your business page so all pin drops post updates to maps.
                    </div>
                  )}
                  {tourStep === 3 && (
                    <div>
                      <strong>📋 Step 2: Transpond CRM Link</strong><br/><br/>
                      Here is your <strong>Transpond CRM</strong> manager. Paste your API Key & Group ID to sync customer reviews. If you don&apos;t have a subscription yet, click the Capsule or Transpond signup links.
                    </div>
                  )}
                  {tourStep === 4 && (
                    <div>
                      <strong>📱 Step 3: Social Media Auto-Post</strong><br/><br/>
                      Once CRM keys are saved, this section unlocks. Click <strong>Connect Social Pages</strong> to open the Meta Auth window and link Facebook & Instagram profiles!
                    </div>
                  )}
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button 
                    onClick={handleFinishTour}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.75rem", cursor: "pointer", padding: 0 }}
                  >
                    Skip Tour
                  </button>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {tourStep > 1 && (
                      <button 
                        onClick={() => {
                          const prevStep = tourStep - 1;
                          setTourStep(prevStep);
                          if (prevStep === 1) setExpandedTab(null);
                          if (prevStep === 2) setExpandedTab("google");
                          if (prevStep === 3) setExpandedTab("crm");
                          if (prevStep === 4) setExpandedTab("social");
                        }}
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "4px 12px", borderRadius: "4px", fontSize: "0.75rem", cursor: "pointer" }}
                      >
                        Back
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        if (tourStep < 4) {
                          const nextStep = tourStep + 1;
                          setTourStep(nextStep);
                          if (nextStep === 2) setExpandedTab("google");
                          if (nextStep === 3) setExpandedTab("crm");
                          if (nextStep === 4) setExpandedTab("social");
                        } else {
                          handleFinishTour();
                        }
                      }}
                      style={{ background: "#e2b047", border: "none", color: "#000", padding: "4px 14px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", cursor: "pointer" }}
                    >
                      {tourStep === 4 ? "Finish" : "Next"}
                    </button>
                  </div>
                </div>
              </div>
            )}

       </div>

      <style jsx>{`
        .portal-container {
          background: var(--bg);
          padding: 5rem 0;
          min-height: 90vh;
        }
        .portal-header {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 3rem;
        }
        .eyebrow {
          color: var(--secondary);
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .portal-header h1 {
          color: #ffffff;
          margin: 0.25rem 0 0.5rem;
          font-size: 2.2rem;
          font-weight: 800;
        }
        .subtitle {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.5;
        }
        .form-card {
          max-width: 580px;
          margin: 0 auto;
        }
        .form-inner {
          padding: 2.5rem !important;
        }
        .portal-form {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-label {
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: var(--secondary);
        }
        .form-input:disabled {
          background: rgba(255, 255, 255, 0.03);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        select.form-input {
          cursor: pointer;
        }
        select.form-input option {
          background: #0f172a;
          color: #ffffff;
        }
        .textarea {
          resize: vertical;
          line-height: 1.5;
        }
        .gps-row {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .gps-btn {
          flex-shrink: 0;
          font-size: 0.8rem;
          padding: 0.6rem 1.2rem !important;
          background: rgba(226, 176, 71, 0.05);
        }
        .coords-display {
          display: flex;
          gap: 1rem;
          flex-grow: 1;
        }
        .coord-field {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-grow: 1;
        }
        .coord-input {
          width: 100%;
          background: transparent;
          border: none;
          color: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          outline: none;
        }
        .convert-btn {
          background: var(--secondary);
          color: #0f172a;
          border: 1px solid var(--secondary);
          border-radius: 8px;
          padding: 0.75rem 1.25rem;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .convert-btn:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #0f172a;
          box-shadow: 0 4px 12px rgba(226, 176, 71, 0.25);
        }
        .convert-btn:disabled {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--border);
          color: var(--text-muted);
          cursor: not-allowed;
        }
        
        .upload-hidden-input {
          display: none;
        }
        .upload-buttons-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
        }
        .upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.9rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.9rem;
          text-align: center;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
        }
        .upload-btn.disabled {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: var(--border) !important;
          color: var(--text-muted) !important;
          cursor: not-allowed !important;
        }
        .primary-upload-btn {
          background: var(--secondary);
          color: #0f172a;
          border: 1px solid var(--secondary);
        }
        .primary-upload-btn:hover {
          background: #ffffff;
          border-color: #ffffff;
          color: #0f172a;
          box-shadow: 0 4px 12px rgba(226, 176, 71, 0.25);
        }
        .outline-upload-btn {
          background: rgba(255, 255, 255, 0.01);
          color: #ffffff;
          border: 2px dashed rgba(226, 176, 71, 0.25);
        }
        .outline-upload-btn:hover {
          background: rgba(226, 176, 71, 0.05);
          border-color: var(--secondary);
          color: var(--secondary);
        }
        .preview-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
          margin-top: 1rem;
        }
        .preview-item {
          position: relative;
          aspect-ratio: 1;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid var(--border);
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .preview-remove {
          position: absolute;
          top: 4px;
          right: 4px;
          background: rgba(15, 23, 42, 0.85);
          border: none;
          color: #ffffff;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .preview-remove:hover {
          background: #ef4444;
        }
        .submit-error {
          color: #ef4444;
          font-size: 0.85rem;
          text-align: center;
          margin: 0;
          font-weight: 600;
        }
        .submit-form-btn {
          width: 100%;
          padding: 0.9rem !important;
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 0.5rem;
        }
        
        /* Success Card Styles */
        .success-card {
          max-width: 500px;
          margin: 0 auto;
        }
        .success-inner {
          padding: 3rem !important;
          text-align: center;
        }
        .success-icon {
          font-size: 3.5rem;
          display: block;
          margin-bottom: 1.25rem;
        }
        .success-inner h3 {
          color: var(--primary);
          font-size: 1.6rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .success-inner p {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .success-buttons {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}
