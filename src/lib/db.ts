import fs from "fs";
import path from "path";
import pinsData from "@/data/pins.json";

export interface PinType {
  id: string;
  author: string;
  date: string;
  location: string;
  service: string;
  description: string;
  images: string[];
  detailedExplanation?: string;
  aeoAnswers?: { question: string; answer: string }[];
  latitude?: number;
  longitude?: number;
}

// In serverless, fs.writeFileSync is read-only at runtime.
// We keep an in-memory cache for the current lambda instance for local dev fallback.
let inMemoryPins: PinType[] = [...pinsData] as PinType[];

export async function getPins(): Promise<PinType[]> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/pins?select=*&order=id.desc`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        // Revalidate cache every 60 seconds
        next: { revalidate: 60 },
      });
      if (res.ok) {
        const dbPins = await res.json();
        // Merge Supabase database pins with static fallback pins
        // Since database pins represent new ones, we put them at the top!
        const merged = [...dbPins, ...pinsData] as PinType[];
        // Deduplicate by ID
        const seen = new Set();
        return merged.filter((p) => {
          const duplicate = seen.has(p.id);
          seen.add(p.id);
          return !duplicate;
        });
      } else {
        console.error("Supabase returned error status:", res.status);
      }
    } catch (err) {
      console.error("Failed to fetch from Supabase:", err);
    }
  }
  
  return inMemoryPins;
}

export async function addPin(pin: Omit<PinType, "id">): Promise<PinType | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  const newPin: PinType = {
    ...pin,
    id: Date.now().toString(),
  };

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
      } else {
        const errText = await res.text();
        console.error("Supabase insert error:", errText);
      }
    } catch (err) {
      console.error("Failed to write to Supabase:", err);
    }
  }

  // Fallback for local development or when Supabase is not configured
  console.log("Supabase not configured or insertion failed. Appending locally...");
  try {
    inMemoryPins = [newPin, ...inMemoryPins];
    
    // Attempt local write if running in development mode
    if (process.env.NODE_ENV === "development") {
      const dataDir = path.join(process.cwd(), "src", "data");
      const pinsFilePath = path.join(dataDir, "pins.json");
      fs.writeFileSync(pinsFilePath, JSON.stringify(inMemoryPins, null, 2), "utf-8");
      console.log("Successfully appended new pin to local src/data/pins.json");
    }
    return newPin;
  } catch (err) {
    console.error("Failed to write to local file system:", err);
  }

  return newPin;
}
