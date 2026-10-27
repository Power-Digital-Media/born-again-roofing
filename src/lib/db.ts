import fs from "fs";
import path from "path";
import pinsData from "@/data/pins.json";
import { getFirestoreAccessToken } from "./firestore-admin";

export type PhotoStage = "before" | "during" | "after" | "damage" | "material" | "general";

export interface PhotoComment {
  id: string;
  author: string;
  authorRole?: "tech" | "admin" | "homeowner";
  text: string;
  mentions?: string[];
  pinX?: number; // 0-100 percentage X on photo
  pinY?: number; // 0-100 percentage Y on photo
  createdAt: string;
}

export interface PinPhotoMeta {
  url: string;
  stage: PhotoStage;
  caption?: string;
  capturedAt: string;
  author?: string;
  isPublic: boolean;
  annotated?: boolean;
  mediaType?: "image" | "video";
  comments?: PhotoComment[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  requiredStage?: PhotoStage;
  assignedTo?: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ProjectSignature {
  id: string;
  signerName: string;
  signerRole: string;
  agreementText: string;
  signatureDataUrl: string;
  signedAt: string;
}

export interface ProjectMessage {
  id: string;
  pinId: string; // Pin ID or "general-crew"
  projectLabel?: string;
  author: string;
  authorRole: "tech" | "admin" | "homeowner" | "system";
  text: string;
  mentions?: string[];
  attachmentUrl?: string;
  photoIndex?: number;
  pinX?: number;
  pinY?: number;
  createdAt: string;
  clientId?: string;
}

export interface PinType {
  id: string;
  author: string;
  date: string;
  location: string;
  service: string;
  description: string;
  images: string[];
  photoMeta?: PinPhotoMeta[];
  beforeAfterCollageUrl?: string;
  walkthroughVideoUrl?: string;
  projectStatus?: "inspection" | "in_progress" | "completed";
  publishToPublicMap?: boolean;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  streetAddress?: string;
  internalNotes?: string;
  checklist?: ChecklistItem[];
  documents?: ProjectDocument[];
  signatures?: ProjectSignature[];
  reportToken?: string;
  detailedExplanation?: string;
  aeoAnswers?: { question: string; answer: string }[];
  latitude?: number;
  longitude?: number;
  clientId?: string;
  updatedAt?: string;
}

let inMemoryPins: PinType[] = [...(pinsData as PinType[])];
let inMemoryMessages: ProjectMessage[] = [];

// Helper to convert Firestore REST document format to standard PinType JSON
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseFirestoreValue(val: any): any {
  if (!val) return undefined;
  if ("stringValue" in val) return val.stringValue;
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("integerValue" in val) return Number(val.integerValue);
  if ("booleanValue" in val) return val.booleanValue;
  if ("arrayValue" in val) {
    const values = val.arrayValue.values || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return values.map((v: any) => parseFirestoreValue(v));
  }
  if ("mapValue" in val) {
    const mapFields = val.mapValue.fields || {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: Record<string, any> = {};
    for (const [k, v] of Object.entries(mapFields)) {
      obj[k] = parseFirestoreValue(v);
    }
    return obj;
  }
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseFirestoreDocument(doc: any): PinType {
  const actualDoc = doc.document ? doc.document : doc;
  const fields = actualDoc.fields || {};

  return {
    id: parseFirestoreValue(fields.id) || (actualDoc.name ? actualDoc.name.split("/").pop() : "") || "",
    author: parseFirestoreValue(fields.author) || "Unknown",
    date: parseFirestoreValue(fields.date) || "",
    location: parseFirestoreValue(fields.location) || "",
    service: parseFirestoreValue(fields.service) || "",
    description: parseFirestoreValue(fields.description) || "",
    images: parseFirestoreValue(fields.images) || [],
    photoMeta: parseFirestoreValue(fields.photoMeta) || undefined,
    beforeAfterCollageUrl: parseFirestoreValue(fields.beforeAfterCollageUrl) || undefined,
    walkthroughVideoUrl: parseFirestoreValue(fields.walkthroughVideoUrl) || undefined,
    projectStatus: parseFirestoreValue(fields.projectStatus) || "completed",
    publishToPublicMap:
      fields.publishToPublicMap !== undefined
        ? Boolean(parseFirestoreValue(fields.publishToPublicMap))
        : true,
    customerName: parseFirestoreValue(fields.customerName) || undefined,
    customerPhone: parseFirestoreValue(fields.customerPhone) || undefined,
    customerEmail: parseFirestoreValue(fields.customerEmail) || undefined,
    streetAddress: parseFirestoreValue(fields.streetAddress) || undefined,
    internalNotes: parseFirestoreValue(fields.internalNotes) || undefined,
    checklist: parseFirestoreValue(fields.checklist) || undefined,
    documents: parseFirestoreValue(fields.documents) || undefined,
    signatures: parseFirestoreValue(fields.signatures) || undefined,
    reportToken: parseFirestoreValue(fields.reportToken) || undefined,
    latitude: parseFirestoreValue(fields.latitude),
    longitude: parseFirestoreValue(fields.longitude),
    detailedExplanation: parseFirestoreValue(fields.detailedExplanation) || "",
    aeoAnswers: parseFirestoreValue(fields.aeoAnswers) || [],
    clientId: parseFirestoreValue(fields.clientId) || "born-again-roofing",
    updatedAt: parseFirestoreValue(fields.updatedAt) || undefined,
  };
}

// Helper to convert standard JS object to Firestore REST document fields
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFirestoreValue(val: any): any {
  if (typeof val === "string") return { stringValue: val };
  if (typeof val === "number") return Number.isFinite(val) ? { doubleValue: val } : { nullValue: null };
  if (typeof val === "boolean") return { booleanValue: val };
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map((v) => toFirestoreValue(v)),
      },
    };
  }
  if (val && typeof val === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fields: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v);
      }
    }
    return { mapValue: { fields } };
  }
  return { nullValue: null };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFirestoreDocument(obj: Record<string, any>): { fields: Record<string, any> } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      fields[k] = toFirestoreValue(v);
    }
  }
  return { fields };
}

/**
 * Strips private customer details, internal crew notes, and internal-only photos
 * before serving pins to public website visitors.
 */
export function sanitizePinForPublic(pin: PinType): PinType {
  const publicPhotoMeta = pin.photoMeta
    ? pin.photoMeta
        .filter((m) => m.isPublic !== false)
        .map((m) => ({
          ...m,
          // Strip internal crew comments from public view
          comments: undefined,
        }))
    : undefined;

  const publicImages =
    publicPhotoMeta && publicPhotoMeta.length > 0
      ? publicPhotoMeta.filter((m) => m.mediaType !== "video").map((m) => m.url)
      : pin.images || [];

  return {
    id: pin.id,
    author: pin.author,
    date: pin.date,
    location: pin.location,
    service: pin.service,
    description: pin.description,
    images: publicImages.length > 0 ? publicImages : pin.images,
    photoMeta: publicPhotoMeta,
    beforeAfterCollageUrl: pin.beforeAfterCollageUrl,
    walkthroughVideoUrl: pin.walkthroughVideoUrl,
    projectStatus: pin.projectStatus || "completed",
    publishToPublicMap: pin.publishToPublicMap !== false,
    detailedExplanation: pin.detailedExplanation || "",
    aeoAnswers: pin.aeoAnswers || [],
    latitude: pin.latitude,
    longitude: pin.longitude,
    clientId: pin.clientId,
    updatedAt: pin.updatedAt,
  };
}

export async function getPins(options?: { includeInternal?: boolean }): Promise<PinType[]> {
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";
  const includeInternal = Boolean(options?.includeInternal);

  let merged: PinType[] = [];

  // 1. Try Firebase Firestore REST API (using runQuery to filter by clientId)
  if (firebaseProjectId) {
    try {
      const queryBody = {
        structuredQuery: {
          from: [{ collectionId: "pins" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "clientId" },
              op: "EQUAL",
              value: { stringValue: clientId },
            },
          },
        },
      };

      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents:runQuery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryBody),
          cache: includeInternal ? "no-store" : undefined,
          next: includeInternal ? undefined : { revalidate: 30 },
        }
      );

      if (res.ok) {
        const results = await res.json();
        const dbPins = results
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((r: any) => r.document)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((r: any) => parseFirestoreDocument(r));

        merged = [...dbPins, ...(pinsData as PinType[])];
      } else {
        console.error("Firebase Firestore runQuery error status:", res.status);
      }
    } catch (err) {
      console.error("Failed to fetch from Firebase Firestore runQuery:", err);
    }
  }

  // 2. Try Supabase REST API (fallback filtering by clientId if no Firebase results)
  if (merged.length === 0 && supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(
        `${supabaseUrl}/rest/v1/pins?select=*&clientId=eq.${clientId}&order=id.desc`,
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
          next: { revalidate: 60 },
        }
      );
      if (res.ok) {
        const dbPins = await res.json();
        merged = [...dbPins, ...(pinsData as PinType[])];
      }
    } catch (err) {
      console.error("Failed to fetch from Supabase:", err);
    }
  }

  // 3. Fallback to local memory if database calls did not yield pins
  if (merged.length === 0) {
    merged = inMemoryPins;
  }

  // Deduplicate and sort by ID descending (newest first)
  const seen = new Set<string>();
  const unique = merged.filter((p) => {
    const duplicate = seen.has(p.id);
    seen.add(p.id);
    return !duplicate;
  });

  const sorted = unique.sort((a, b) => {
    const numA = Number(a.id) || 0;
    const numB = Number(b.id) || 0;
    return numB - numA;
  });

  if (includeInternal) {
    return sorted;
  }

  return sorted
    .filter((p) => p.publishToPublicMap !== false)
    .map((p) => sanitizePinForPublic(p));
}

export async function getPinByReportToken(token: string): Promise<PinType | null> {
  if (!token) return null;
  const allPins = await getPins({ includeInternal: true });
  return allPins.find((p) => p.reportToken === token || p.id === token) || null;
}

export async function addPin(pin: Omit<PinType, "id">): Promise<PinType | null> {
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";

  const pinId = Date.now().toString();
  const reportToken =
    pin.reportToken ||
    `rep_${pinId}_${Math.random().toString(36).substring(2, 9)}`;

  const newPin: PinType = {
    ...pin,
    id: pinId,
    clientId,
    reportToken,
    projectStatus: pin.projectStatus || "completed",
    publishToPublicMap: pin.publishToPublicMap !== undefined ? pin.publishToPublicMap : true,
    updatedAt: new Date().toISOString(),
  };

  // 1. Write to Firebase Firestore REST API
  if (firebaseProjectId) {
    try {
      const firestoreDoc = toFirestoreDocument(newPin);
      const token = await getFirestoreAccessToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/pins?documentId=${pinId}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(firestoreDoc),
        }
      );
      if (res.ok) {
        console.log(`Successfully wrote new pin to Firebase Firestore under clientId: ${clientId}`);
        inMemoryPins = [newPin, ...inMemoryPins.filter((p) => p.id !== newPin.id)];

        // Only trigger public Google & Transpond posts if published to public map
        if (newPin.publishToPublicMap !== false && newPin.images.length > 0) {
          try {
            const { publishPinToGmb } = await import("./google-gmb");
            publishPinToGmb(newPin).catch((err) =>
              console.error("[GMB] Background publish error:", err)
            );
          } catch (gmbErr) {
            console.error("[GMB] Trigger failed:", gmbErr);
          }

          try {
            const { publishPinToTranspondSocial } = await import("./transpond-social");
            publishPinToTranspondSocial(newPin).catch((err) =>
              console.error("[Transpond Social] Background publish error:", err)
            );
          } catch (socialErr) {
            console.error("[Transpond Social] Trigger failed:", socialErr);
          }
        }

        return newPin;
      } else {
        const errText = await res.text();
        console.error("Firebase Firestore write error:", errText);
        return null;
      }
    } catch (err) {
      console.error("Failed to write to Firebase Firestore:", err);
      return null;
    }
  }

  // 2. Write to Supabase REST API (fallback)
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/pins`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(newPin),
      });
      if (res.ok) {
        const created = await res.json();
        return Array.isArray(created) ? created[0] : created;
      }
    } catch (err) {
      console.error("Failed to write to Supabase:", err);
    }
  }

  // Local development fallback (in-memory + git-ignored runtime cache)
  inMemoryPins = [newPin, ...inMemoryPins];
  try {
    if (process.env.NODE_ENV === "development") {
      const runtimeDir = path.join(process.cwd(), ".local-runtime");
      if (!fs.existsSync(runtimeDir)) fs.mkdirSync(runtimeDir, { recursive: true });
      fs.writeFileSync(
        path.join(runtimeDir, "pins-cache.json"),
        JSON.stringify(inMemoryPins, null, 2),
        "utf-8"
      );
    }
  } catch (err) {
    console.warn("Runtime cache write skipped:", err);
  }

  return newPin;
}

export async function updatePin(
  pinId: string,
  updates: Partial<PinType>
): Promise<PinType | null> {
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
  const allPins = await getPins({ includeInternal: true });
  const existing = allPins.find((p) => p.id === pinId);
  if (!existing) return null;

  const mergedPin: PinType = {
    ...existing,
    ...updates,
    id: existing.id,
    clientId: existing.clientId || process.env.PDM_CLIENT_ID || "born-again-roofing",
    reportToken:
      existing.reportToken ||
      updates.reportToken ||
      `rep_${existing.id}_${Math.random().toString(36).substring(2, 9)}`,
    updatedAt: new Date().toISOString(),
  };

  // Recompute public images array if photoMeta was updated
  if (mergedPin.photoMeta && mergedPin.photoMeta.length > 0) {
    const publicImgUrls = mergedPin.photoMeta
      .filter((m) => m.isPublic !== false && m.mediaType !== "video")
      .map((m) => m.url);
    if (publicImgUrls.length > 0) {
      mergedPin.images = publicImgUrls;
    }
  }

  if (firebaseProjectId) {
    try {
      const firestoreDoc = toFirestoreDocument(mergedPin);
      const token = await getFirestoreAccessToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/pins/${encodeURIComponent(pinId)}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(firestoreDoc),
        }
      );

      if (res.ok) {
        inMemoryPins = [mergedPin, ...inMemoryPins.filter((p) => p.id !== pinId)];
        return mergedPin;
      } else {
        const errText = await res.text();
        console.error("Firestore updatePin PATCH failed:", errText);
      }
    } catch (err) {
      console.error("Failed to update pin in Firestore:", err);
    }
  }

  inMemoryPins = [mergedPin, ...inMemoryPins.filter((p) => p.id !== pinId)];
  return mergedPin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Native CompanyCam Messenger & Activity Stream Functions
// ─────────────────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseFirestoreMessage(doc: any): ProjectMessage {
  const actualDoc = doc.document ? doc.document : doc;
  const fields = actualDoc.fields || {};
  return {
    id: parseFirestoreValue(fields.id) || (actualDoc.name ? actualDoc.name.split("/").pop() : "") || "",
    pinId: parseFirestoreValue(fields.pinId) || "general-crew",
    projectLabel: parseFirestoreValue(fields.projectLabel) || undefined,
    author: parseFirestoreValue(fields.author) || "Crew Member",
    authorRole: parseFirestoreValue(fields.authorRole) || "tech",
    text: parseFirestoreValue(fields.text) || "",
    mentions: parseFirestoreValue(fields.mentions) || [],
    attachmentUrl: parseFirestoreValue(fields.attachmentUrl) || undefined,
    photoIndex: parseFirestoreValue(fields.photoIndex),
    pinX: parseFirestoreValue(fields.pinX),
    pinY: parseFirestoreValue(fields.pinY),
    createdAt: parseFirestoreValue(fields.createdAt) || new Date().toISOString(),
    clientId: parseFirestoreValue(fields.clientId) || "born-again-roofing",
  };
}

export async function getMessages(pinIdFilter?: string): Promise<ProjectMessage[]> {
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
  const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";

  let messages: ProjectMessage[] = [...inMemoryMessages];

  if (firebaseProjectId) {
    try {
      const queryBody = {
        structuredQuery: {
          from: [{ collectionId: "pin_messages" }],
          where: {
            fieldFilter: {
              field: { fieldPath: "clientId" },
              op: "EQUAL",
              value: { stringValue: clientId },
            },
          },
        },
      };

      const res = await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents:runQuery`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(queryBody),
          cache: "no-store",
        }
      );

      if (res.ok) {
        const results = await res.json();
        const dbMsgs = results
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((r: any) => r.document)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((r: any) => parseFirestoreMessage(r));
        const seen = new Set<string>();
        messages = [...dbMsgs, ...inMemoryMessages].filter((m) => {
          if (!m.id || seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
      }
    } catch (err) {
      console.error("Failed to fetch pin_messages from Firestore:", err);
    }
  }

  if (pinIdFilter) {
    messages = messages.filter((m) => m.pinId === pinIdFilter);
  }

  return messages.sort(
    (a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
  );
}

export async function addMessage(
  msg: Omit<ProjectMessage, "id" | "createdAt">
): Promise<ProjectMessage> {
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "pdm-pindrop-central";
  const clientId = process.env.PDM_CLIENT_ID || "born-again-roofing";
  const msgId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // Extract @mentions automatically from text
  const extractedMentions = Array.from(
    new Set([
      ...(msg.mentions || []),
      ...(msg.text.match(/@([a-zA-Z0-9_.-]+(?:\s+[a-zA-Z0-9_.-]+)?)/g) || []).map((m) =>
        m.slice(1).trim()
      ),
    ])
  );

  const newMsg: ProjectMessage = {
    ...msg,
    id: msgId,
    mentions: extractedMentions,
    createdAt: new Date().toISOString(),
    clientId,
  };

  inMemoryMessages = [newMsg, ...inMemoryMessages];

  if (firebaseProjectId) {
    try {
      const firestoreDoc = toFirestoreDocument(newMsg);
      const token = await getFirestoreAccessToken();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      await fetch(
        `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/pin_messages?documentId=${msgId}`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(firestoreDoc),
        }
      );
    } catch (err) {
      console.error("Failed to persist message to Firestore:", err);
    }
  }

  return newMsg;
}
