export interface ExifDataResult {
  latitude?: number;
  longitude?: number;
  capturedAt?: string;
}

export interface GpsMatchCandidate {
  id: string;
  location: string;
  service: string;
  author: string;
  date: string;
  description: string;
  streetAddress?: string;
  customerName?: string;
  latitude?: number;
  longitude?: number;
  projectStatus?: "inspection" | "in_progress" | "completed";
}

export interface GpsJobMatch<T extends GpsMatchCandidate = GpsMatchCandidate> {
  job: T;
  distanceMeters: number;
  distanceFeet: number;
}

/**
 * Haversine formula to calculate exact distance in meters between two GPS coordinates.
 */
export function haversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the closest active/existing job pin within maxMeters (default 160m / ~525ft).
 */
export function findClosestJobByGps<T extends GpsMatchCandidate>(
  lat: number,
  lon: number,
  jobs: T[],
  maxMeters = 160
): GpsJobMatch<T> | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  let bestMatch: GpsJobMatch<T> | null = null;

  for (const job of jobs) {
    if (
      typeof job.latitude === "number" &&
      typeof job.longitude === "number" &&
      Number.isFinite(job.latitude) &&
      Number.isFinite(job.longitude)
    ) {
      const distMeters = haversineDistanceMeters(lat, lon, job.latitude, job.longitude);
      if (distMeters <= maxMeters) {
        if (!bestMatch || distMeters < bestMatch.distanceMeters) {
          bestMatch = {
            job,
            distanceMeters: Math.round(distMeters),
            distanceFeet: Math.round(distMeters * 3.28084),
          };
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Pure client-side JPEG EXIF parser to extract GPSLatitude, GPSLongitude, and DateTimeOriginal
 * directly from Camera Roll photos before HTML5 Canvas compression strips EXIF headers.
 */
export async function extractExifGpsFromFile(file: File): Promise<ExifDataResult> {
  try {
    const slice = file.slice(0, 131072); // First 128KB contains APP1 EXIF header
    const buffer = await slice.arrayBuffer();
    const view = new DataView(buffer);

    if (view.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) {
      return {};
    }

    let offset = 2;
    while (offset + 4 < view.byteLength) {
      const marker = view.getUint16(offset, false);
      offset += 2;

      // APP1 Marker (0xFFE1)
      if (marker === 0xffe1) {
        const length = view.getUint16(offset, false);
        if (offset + 8 >= view.byteLength) break;

        // Check "Exif\0\0"
        const exifHeader =
          view.getUint32(offset + 2, false) === 0x45786966 &&
          view.getUint16(offset + 6, false) === 0x0000;
        if (!exifHeader) {
          offset += length;
          continue;
        }

        const tiffStart = offset + 8;
        if (tiffStart + 8 >= view.byteLength) break;

        const endianMarker = view.getUint16(tiffStart, false);
        const littleEndian = endianMarker === 0x4949;
        if (!littleEndian && endianMarker !== 0x4d4d) break;

        const firstIfdOffset = view.getUint32(tiffStart + 4, littleEndian);
        const ifd0Start = tiffStart + firstIfdOffset;

        let gpsIfdPointer = 0;
        let exifIfdPointer = 0;
        let capturedAt: string | undefined;

        const readString = (strOffset: number, count: number): string => {
          let out = "";
          for (let i = 0; i < count - 1 && strOffset + i < view.byteLength; i++) {
            const code = view.getUint8(strOffset + i);
            if (code === 0) break;
            out += String.fromCharCode(code);
          }
          return out.trim();
        };

        const readRationalArray = (valOffset: number, count: number): number[] => {
          const vals: number[] = [];
          for (let i = 0; i < count; i++) {
            const pos = valOffset + i * 8;
            if (pos + 8 > view.byteLength) break;
            const num = view.getUint32(pos, littleEndian);
            const den = view.getUint32(pos + 4, littleEndian);
            vals.push(den !== 0 ? num / den : 0);
          }
          return vals;
        };

        if (ifd0Start + 2 < view.byteLength) {
          const entries = view.getUint16(ifd0Start, littleEndian);
          for (let i = 0; i < entries; i++) {
            const entryOffset = ifd0Start + 2 + i * 12;
            if (entryOffset + 12 > view.byteLength) break;
            const tag = view.getUint16(entryOffset, littleEndian);
            const count = view.getUint32(entryOffset + 4, littleEndian);
            const valOffset = tiffStart + view.getUint32(entryOffset + 8, littleEndian);

            if (tag === 0x0132 && count > 4 && valOffset < view.byteLength) {
              // DateTime ("YYYY:MM:DD HH:MM:SS")
              capturedAt = formatExifDate(readString(valOffset, count));
            } else if (tag === 0x8769) {
              // ExifIFDPointer
              exifIfdPointer = tiffStart + view.getUint32(entryOffset + 8, littleEndian);
            } else if (tag === 0x8825) {
              // GPSInfoIFDPointer
              gpsIfdPointer = tiffStart + view.getUint32(entryOffset + 8, littleEndian);
            }
          }
        }

        // Check Exif SubIFD for DateTimeOriginal (0x9003)
        if (exifIfdPointer > 0 && exifIfdPointer + 2 < view.byteLength) {
          const entries = view.getUint16(exifIfdPointer, littleEndian);
          for (let i = 0; i < entries; i++) {
            const entryOffset = exifIfdPointer + 2 + i * 12;
            if (entryOffset + 12 > view.byteLength) break;
            const tag = view.getUint16(entryOffset, littleEndian);
            const count = view.getUint32(entryOffset + 4, littleEndian);
            const valOffset = tiffStart + view.getUint32(entryOffset + 8, littleEndian);
            if (tag === 0x9003 && count > 4 && valOffset < view.byteLength) {
              capturedAt = formatExifDate(readString(valOffset, count)) || capturedAt;
            }
          }
        }

        // Parse GPS SubIFD
        let latitude: number | undefined;
        let longitude: number | undefined;

        if (gpsIfdPointer > 0 && gpsIfdPointer + 2 < view.byteLength) {
          const gpsEntries = view.getUint16(gpsIfdPointer, littleEndian);
          let latRef = "N";
          let lonRef = "E";
          let latDms: number[] = [];
          let lonDms: number[] = [];

          for (let i = 0; i < gpsEntries; i++) {
            const entryOffset = gpsIfdPointer + 2 + i * 12;
            if (entryOffset + 12 > view.byteLength) break;
            const tag = view.getUint16(entryOffset, littleEndian);
            const count = view.getUint32(entryOffset + 4, littleEndian);

            if (tag === 0x0001) {
              // GPSLatitudeRef
              const charCode = view.getUint8(entryOffset + 8);
              if (charCode === 83 || charCode === 115) latRef = "S";
            } else if (tag === 0x0002 && count === 3) {
              // GPSLatitude
              const valOffset = tiffStart + view.getUint32(entryOffset + 8, littleEndian);
              latDms = readRationalArray(valOffset, 3);
            } else if (tag === 0x0003) {
              // GPSLongitudeRef
              const charCode = view.getUint8(entryOffset + 8);
              if (charCode === 87 || charCode === 119) lonRef = "W";
            } else if (tag === 0x0004 && count === 3) {
              // GPSLongitude
              const valOffset = tiffStart + view.getUint32(entryOffset + 8, littleEndian);
              lonDms = readRationalArray(valOffset, 3);
            }
          }

          if (latDms.length === 3 && lonDms.length === 3) {
            const rawLat = latDms[0] + latDms[1] / 60 + latDms[2] / 3600;
            const rawLon = lonDms[0] + lonDms[1] / 60 + lonDms[2] / 3600;
            if (rawLat > 0 || rawLon > 0) {
              latitude = Number((latRef === "S" ? -rawLat : rawLat).toFixed(6));
              longitude = Number((lonRef === "W" ? -rawLon : rawLon).toFixed(6));
            }
          }
        }

        return { latitude, longitude, capturedAt };
      } else if ((marker & 0xff00) !== 0xff00) {
        break;
      } else {
        const segLength = view.getUint16(offset, false);
        offset += segLength;
      }
    }
  } catch (err) {
    console.warn("[EXIF] Could not parse EXIF metadata:", err);
  }
  return {};
}

function formatExifDate(raw: string): string | undefined {
  // raw format: "2026:10:27 14:05:22"
  if (!raw || raw.length < 10) return undefined;
  const normalized = raw.slice(0, 10).replace(/:/g, "-") + raw.slice(10);
  const parsed = new Date(normalized);
  if (isNaN(parsed.getTime())) return undefined;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export interface CompressPhotoOptions {
  maxDimension?: number;
  quality?: number;
  stampWatermark?: boolean;
  watermarkText?: {
    dateStr?: string;
    locationStr?: string;
    coordsStr?: string;
    authorStr?: string;
    stageStr?: string;
  };
}

/**
 * Compresses an image file to crisp 1600px HD JPEG (@ 0.82 quality) and optionally
 * stamps a CompanyCam-style Date/Time/GPS/Technician verification badge onto the corner.
 */
export async function compressAndPreparePhoto(
  fileOrDataUrl: File | string,
  options: CompressPhotoOptions = {}
): Promise<string> {
  const maxDim = options.maxDimension || 1600;
  const quality = options.quality || 0.82;

  const dataUrl =
    typeof fileOrDataUrl === "string"
      ? fileOrDataUrl
      : await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(fileOrDataUrl);
        });

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      if (options.stampWatermark && options.watermarkText) {
        const wm = options.watermarkText;
        const lines: string[] = [];
        if (wm.stageStr) lines.push(`STAGE: ${wm.stageStr.toUpperCase()}`);
        if (wm.dateStr) lines.push(wm.dateStr);
        if (wm.locationStr) lines.push(wm.locationStr);
        if (wm.coordsStr) lines.push(`GPS: ${wm.coordsStr}`);
        if (wm.authorStr) lines.push(`TECH: ${wm.authorStr}`);

        if (lines.length > 0) {
          const fontSize = Math.max(14, Math.round(width * 0.018));
          ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          const padding = Math.round(fontSize * 0.65);
          const lineHeight = Math.round(fontSize * 1.35);

          let maxLineWidth = 0;
          for (const line of lines) {
            const metrics = ctx.measureText(line);
            if (metrics.width > maxLineWidth) maxLineWidth = metrics.width;
          }

          const boxW = maxLineWidth + padding * 2;
          const boxH = lines.length * lineHeight + padding * 1.5;
          const boxX = width - boxW - Math.round(width * 0.02);
          const boxY = height - boxH - Math.round(height * 0.02);

          ctx.fillStyle = "rgba(10, 12, 18, 0.78)";
          ctx.beginPath();
          ctx.roundRect(boxX, boxY, boxW, boxH, 8);
          ctx.fill();

          ctx.strokeStyle = "rgba(226, 176, 71, 0.65)";
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = "#f8fafc";
          lines.forEach((line, idx) => {
            if (idx === 0 && wm.stageStr) {
              ctx.fillStyle = "#e2b047";
            } else {
              ctx.fillStyle = "#f8fafc";
            }
            ctx.fillText(line, boxX + padding, boxY + padding + fontSize * 0.85 + idx * lineHeight);
          });
        }
      }

      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export interface DefaultChecklistTemplateItem {
  id: string;
  label: string;
  requiredStage: "before" | "damage" | "during" | "material" | "after" | "general";
}

/**
 * Returns a CompanyCam-style required photo & SOP checklist tailored to the selected service.
 */
export function getDefaultChecklistForService(service: string): DefaultChecklistTemplateItem[] {
  const lower = (service || "").toLowerCase();
  if (lower.includes("roof") || lower.includes("shingle") || lower.includes("metal") || lower.includes("tarp")) {
    return [
      { id: "chk_curb_before", label: "Front Curb / Full Property Elevation (Before)", requiredStage: "before" },
      { id: "chk_damage_closeup", label: "Damage / Leak / Shingle Wear Close-Up", requiredStage: "damage" },
      { id: "chk_tearoff_deck", label: "Tear-Off / Decking & Underlayment Progress", requiredStage: "during" },
      { id: "chk_flashing_materials", label: "Materials, Flashing, Vents & Ridge Detail", requiredStage: "material" },
      { id: "chk_final_after", label: "Completed Roof Transformation (Matching After Angle)", requiredStage: "after" },
      { id: "chk_clean_sweep", label: "Clean Yard, Driveway & Magnet Nail Sweep", requiredStage: "after" },
    ];
  }

  return [
    { id: "chk_area_before", label: "Work Area / Room Overview (Before)", requiredStage: "before" },
    { id: "chk_issue_detail", label: "Existing Issue / Inspection Close-Up", requiredStage: "damage" },
    { id: "chk_prep_during", label: "Prep, Demo, or Mid-Project Progress", requiredStage: "during" },
    { id: "chk_materials_spec", label: "Installed Materials & Craftsmanship Detail", requiredStage: "material" },
    { id: "chk_completed_after", label: "Final Completed Transformation (After)", requiredStage: "after" },
    { id: "chk_site_clean", label: "Clean Jobsite & Walkthrough Ready", requiredStage: "after" },
  ];
}
