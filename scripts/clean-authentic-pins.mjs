import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PINS_PATH = path.resolve(__dirname, "../src/data/pins.json");

// 15 un-geolocated ([null, null]) pins with fabricated out-of-state AI descriptions
const UNVERIFIED_OUT_OF_STATE_IDS = new Set([
  "161966", // NY
  "161394", // Dallas, TX
  "157243", // Houston, TX
  "155070", // Huntsville, AL
  "154555", // Houston, TX
  "150997", // Little Rock, AR
  "149604", // Fort Myers, FL
  "146776", // Dallas, TX
  "146108", // Baytown, TX
  "143840", // Houston, TX
  "142852", // Austin, TX
  "141794", // Cincinnati, OH
  "141044", // Salado, TX
  "140894", // Dallas, TX
  "140589", // Pflugerville, TX
]);

// 9 zero-image / blank / door-knocking stubs + 1 static duplicate of live Firestore pin
const BROKEN_OR_DUPLICATE_IDS = new Set([
  "152909",
  "149591",
  "147707",
  "139821",
  "139503",
  "138829",
  "136928",
  "134585",
  "133356",
  "144902", // duplicate of Firestore record
]);

// GPS-verified rural / suburb MS location corrections where original import mapped to a neighbor town
const LOCATION_OVERRIDES = {
  "56": "Pearl, MS",       // 32.2642, -90.1262 (Pearl, MS)
  "91": "Flowood, MS",     // 32.3399, -90.0896 (Flowood, MS)
  "84": "Braxton, MS",     // 32.0333, -89.9642 (Braxton, MS)
  "124": "Wesson, MS",     // 31.7671, -90.3650 (Wesson, MS)
  "127": "Wesson, MS",     // 31.7671, -90.3650 (Wesson, MS)
  "155051": "Mendenhall, MS", // 32.0310, -89.9231 (Mendenhall, MS)
  "149200": "Mendenhall, MS", // 32.1015, -89.9314 (Mendenhall area, MS)
  "146057": "Mendenhall, MS", // 32.0941, -89.9302 (Mendenhall area, MS)
  "135891": "Mendenhall, MS", // 32.1015, -89.9314 (Mendenhall area, MS)
  "138714": "Brookhaven, MS", // 31.7508, -90.6282 (Brookhaven area, MS)
  "140989": "Brandon, MS",    // Verified Brandon, MS inspection
};

const SERVICE_NORMALIZATIONS = {
  "109 Fermosa Dr, Brandon MS": "Roof Inspection",
  "Morgan, roofing and home": "Concrete & Patio",
  "But Born Again Roofing & Home Remodeling": "Concrete & Patio",
  "Born Again Roofing & Home Remod": "Flooring",
  "Born again roofing & home repair": "Concrete & Patio",
  "Born again, home remodeling": "Soffit & Fascia",
  "Door Knocking Inspections": "Roof Inspection",
  "Roof insoection": "Roof Inspection",
  "Roof inspection": "Roof Inspection",
  "Inpection": "Roof Inspection",
  "Roofinterior inspection": "Roof Inspection",
  "RoofInterior Inspection": "Roof Inspection",
  "Roof Interior Inspection": "Roof Inspection",
  "RoofInteriorFacia Inspection": "Roof Inspection",
  "AtticRoof Inspection": "Roof Inspection",
  "Roof install": "Residential Roofing",
  "Roof Install": "Residential Roofing",
  "New roof install": "Residential Roofing",
  "New architect roof install": "Residential Roofing",
  "Installed new architect shingle roof system": "Residential Roofing",
  "Installed new architect owens Corning duration roof aystem": "Residential Roofing",
  "Roof replacement": "Roof Replacement",
  "Reroof": "Roof Replacement",
  "Re-roof": "Roof Replacement",
  "Roof repair": "Roof Repair",
  "Metal roof install": "Metal Roofing",
  "Metal roof": "Metal Roofing",
  "Metal Roof": "Metal Roofing",
  "Metal roof repairs": "Metal Roofing",
  "Metal roof replacement": "Metal Roofing",
  "Reroof. - metal": "Metal Roofing",
  "Reroof - metal roofing": "Metal Roofing",
  "Remodle": "General Remodeling",
  "Remodel": "General Remodeling",
  "Total remodel": "Whole House Remodeling",
  "Bathroom remodel": "Bathroom Remodeling",
  "Vinal Floot": "Flooring",
  "Vinal floor": "Flooring",
  "Vinal flooring": "Flooring",
  "Vinal siding": "Siding & Gutters",
  "Pressure wahing": "Pressure Washing",
  "Pressure washing": "Pressure Washing",
  "Pressure washer": "Pressure Washing",
};

function replaceCityInStrings(pin, oldCityPattern, newCityName) {
  const reMs = new RegExp(`\\b${oldCityPattern},\\s*MS\\b`, "g");
  const reFull = new RegExp(`\\b${oldCityPattern},\\s*Mississippi\\b`, "g");
  const apply = (s) =>
    typeof s === "string"
      ? s.replace(reMs, `${newCityName}, MS`).replace(reFull, `${newCityName}, Mississippi`)
      : s;

  if (pin.title) pin.title = apply(pin.title);
  if (pin.description) pin.description = apply(pin.description);
  if (pin.detailedExplanation) pin.detailedExplanation = apply(pin.detailedExplanation);
  if (Array.isArray(pin.aeoAnswers)) {
    pin.aeoAnswers = pin.aeoAnswers.map((qa) => ({
      ...qa,
      question: apply(qa.question),
      answer: apply(qa.answer),
    }));
  }
}

function main() {
  const raw = JSON.parse(fs.readFileSync(PINS_PATH, "utf8"));
  const beforeCount = raw.length;

  let deletedOutOfState = 0;
  let deletedBrokenOrDup = 0;
  let stateFixed = 0;
  let cityFixed = 0;
  let serviceFixed = 0;

  const cleaned = [];

  for (const orig of raw) {
    const id = String(orig.id);

    if (UNVERIFIED_OUT_OF_STATE_IDS.has(id)) {
      deletedOutOfState++;
      continue;
    }
    if (BROKEN_OR_DUPLICATE_IDS.has(id) || !Array.isArray(orig.images) || orig.images.length === 0) {
      deletedBrokenOrDup++;
      continue;
    }

    const pin = structuredClone(orig);

    // 1. Apply GPS-verified location overrides
    const prevLocation = pin.location;
    if (LOCATION_OVERRIDES[id]) {
      const prevCity = (prevLocation.split(",")[0] || "").trim();
      pin.location = LOCATION_OVERRIDES[id];
      const nextCity = pin.location.split(",")[0].trim();
      if (prevCity && prevCity !== nextCity) {
        // Update generated title / detailedExplanation / aeoAnswers that used old city
        const reOldLoc = new RegExp(`\\b${prevCity},\\s*MS\\b`, "g");
        if (pin.title) pin.title = pin.title.replace(reOldLoc, `${nextCity}, MS`);
        if (pin.detailedExplanation) pin.detailedExplanation = pin.detailedExplanation.replace(reOldLoc, `${nextCity}, MS`);
        if (Array.isArray(pin.aeoAnswers)) {
          pin.aeoAnswers = pin.aeoAnswers.map((qa) => ({
            ...qa,
            question: qa.question.replace(reOldLoc, `${nextCity}, MS`),
            answer: qa.answer.replace(reOldLoc, `${nextCity}, MS`),
          }));
        }
      }
    }

    // 2. Specific pin-level fixes for concatenated text & state typos on GPS-verified MS jobs
    if (id === "56") {
      pin.description = pin.description
        .replace(/\s*Daniel Lickness Born Again Home Remodeling and Roofing LLC[\s\S]*$/, "")
        .replace(/\bPearl,\s*MI\b/g, "Pearl, MS");
      stateFixed++;
    } else if (id === "19") {
      pin.description = pin.description.replace(/\bMadison,\s*MI\b/g, "Madison, MS");
      stateFixed++;
    } else if (id === "58") {
      pin.description = pin.description.replace(/\bPearl,\s*MI\b/g, "Pearl, MS");
      stateFixed++;
    } else if (id === "91") {
      pin.description = pin.description.replace(/\bFlowwod,\s*MI\b/g, "Flowood, MS");
      stateFixed++;
    } else if (id === "107") {
      pin.description = pin.description.replace(/\bBrandon,\s*MI\b/g, "Brandon, MS");
      stateFixed++;
    } else if (id === "110") {
      pin.description = pin.description.replace(/\bPearl,\s*MI\b/g, "Pearl, MS");
      stateFixed++;
    } else if (id === "124") {
      pin.description = pin.description.replace(/\bWesson,\s*MA\b/g, "Wesson, MS");
      pin.service = "Residential Roofing";
      if (pin.title) pin.title = "Residential Roofing in Wesson, MS";
      stateFixed++;
    } else if (id === "144990") {
      pin.description = pin.description.replace(/\bWest Monroe,\s*LA\b/g, "Byram, MS");
      stateFixed++;
    } else if (id === "144927") {
      pin.description = pin.description.replace(/\bSavannah,\s*GA\b/g, "Jackson, MS");
      stateFixed++;
    }

    if (id === "140989") {
      pin.description = pin.description.replace(/\bJackson,\s*Mississippi\b/g, "Brandon, Mississippi");
    }

    if (id === "150181") {
      pin.description = pin.description.replace(/\bdoor knocking inspections\b/gi, "exterior and roof inspections");
    }

    // 3. Strip AI-robotic "in an unspecified location" phrases on un-geolocated MS inspections
    if (/unspecified location/i.test(pin.description)) {
      pin.description = pin.description
        .replace(/\s+in an unspecified location/gi, "")
        .replace(/\s*The service took place in an unspecified location due to missing geographic data\./gi, "");
    }

    // 4. Fix DataPins wrong-MS-city hallucinations strictly using each pin's GPS-verified city
    const verifiedCity = (pin.location.split(",")[0] || "").trim();
    if (verifiedCity) {
      const beforeDesc = JSON.stringify([pin.title, pin.description, pin.detailedExplanation, pin.aeoAnswers]);
      const wrongCities = ["Meridian", "Carthage", "Laurel", "Forest", "Flora", "Alonzo"];
      for (const wrong of wrongCities) {
        if (wrong.toLowerCase() !== verifiedCity.toLowerCase()) {
          replaceCityInStrings(pin, wrong, verifiedCity);
        }
      }
      // Also check any remaining "in <OtherCity>, MS/Mississippi" mismatch
      const mismatchRe = /\b(in|near|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?),\s*(MS|Mississippi)\b/g;
      pin.description = pin.description.replace(mismatchRe, (full, prep, mentioned, st) => {
        if (mentioned.trim().toLowerCase() !== verifiedCity.toLowerCase()) {
          return `${prep} ${verifiedCity}, ${st}`;
        }
        return full;
      });
      const afterDesc = JSON.stringify([pin.title, pin.description, pin.detailedExplanation, pin.aeoAnswers]);
      if (beforeDesc !== afterDesc) cityFixed++;
    }

    // 5. Scrub PII & normalize service labels
    const trimmedService = (pin.service || "").trim();
    if (SERVICE_NORMALIZATIONS[trimmedService]) {
      pin.service = SERVICE_NORMALIZATIONS[trimmedService];
      serviceFixed++;
    } else if (trimmedService !== pin.service) {
      pin.service = trimmedService;
    }

    cleaned.push(pin);
  }

  fs.writeFileSync(PINS_PATH, JSON.stringify(cleaned, null, 2) + "\n", "utf8");
  console.log({
    beforeCount,
    afterCount: cleaned.length,
    deletedOutOfState,
    deletedBrokenOrDup,
    stateFixed,
    cityFixed,
    serviceFixed,
  });
}

main();
