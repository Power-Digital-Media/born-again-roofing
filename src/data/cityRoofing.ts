/**
 * Roofing-first content for the seven priority city pages.
 *
 * Project summaries below are condensed from the published Pin Drop project
 * records in src/data/pins.json (read-only; Pin Drop is not modified). Each
 * entry references a real project id; no details have been added beyond what
 * the published record states. Where a city has few published roofing
 * projects, fewer are listed rather than inventing differences.
 */
export interface CityProject {
  id: string;
  /** Plain-language summary restating only what the published record says */
  summary: string;
}

export interface CityRoofing {
  title: string;
  description: string;
  h1: string;
  /** Verifiable geography only */
  area: string;
  projects: CityProject[];
}

export const cityRoofing: Record<string, CityRoofing> = {
  "jackson-ms": {
    title: "Roof Repair & Replacement in Jackson, MS",
    description:
      "Roof repair, leak inspections, and metal roof service for Jackson homes. See recent local work, then request an estimate or call (601) 573-6178.",
    h1: "Roof Repair & Replacement in Jackson, MS",
    area: "Jackson sits across Hinds, Rankin, and Madison counties, and we work throughout the metro area.",
    projects: [
      { id: "2", summary: "Inspection of a standing seam metal roof for leaks, looking for potential water entry points." },
      { id: "20", summary: "Roof leak inspection to find and assess damage before water got into the home." },
      { id: "44", summary: "Inspection of a residential roof to judge how severe the damage was and recommend targeted repairs." },
      { id: "76", summary: "Roof seam repair: gaps and tears were sealed with GAF high solids roof sealant." },
    ],
  },
  "brandon-ms": {
    title: "Roof Repair & Metal Roofing in Brandon, MS",
    description:
      "Roof repair, chimney-area leak inspections, and metal roof installation for homes in Brandon, MS. Request a roofing estimate or call (601) 573-6178.",
    h1: "Roof Repair & Metal Roofing in Brandon, MS",
    area: "Brandon is the county seat of Rankin County.",
    projects: [
      { id: "24", summary: "Roof leak inspection that found the chimney's integrity was compromised." },
      { id: "123", summary: "Roof repair that included assessing damage, replacing damaged shingles, and fixing leaks." },
      { id: "143483", summary: "Installation of a new metal roof system." },
    ],
  },
  "pearl-ms": {
    title: "Roof Inspections & Metal Roofing in Pearl, MS",
    description:
      "Metal roof silicone maintenance, roof inspections, and silicone roof work for Pearl, MS homes. Request a roofing estimate or call (601) 573-6178.",
    h1: "Roof Inspections & Metal Roofing in Pearl, MS",
    area: "Pearl is in Rankin County, just east of Jackson.",
    projects: [
      { id: "183647", summary: "Silicone touch-ups on a metal roof, sealing gaps to help prevent leaks." },
      { id: "183350", summary: "Inspection of a cedar shake roof for damaged pieces." },
      { id: "5", summary: "Installation of a new GAF silicone roof." },
    ],
  },
  "madison-ms": {
    title: "Roof Replacement in Madison, MS",
    description:
      "Roof replacement and architectural shingle installation for Madison, MS homes, including deck repair at tear-off. Request an estimate or call (601) 573-6178.",
    h1: "Roof Replacement in Madison, MS",
    area: "Madison is in Madison County, north of Jackson.",
    projects: [
      { id: "38", summary: "Roof replacement: old shingles removed, rotten deck boards replaced, and new shingles installed." },
      { id: "120", summary: "Installation of a new architectural-style HDZ roof system as part of a roof replacement." },
    ],
  },
  "ridgeland-ms": {
    title: "Roof Replacement in Ridgeland, MS",
    description:
      "Roof replacement for Ridgeland, MS homes, including upgrades from 3-tab to architectural shingles. Request a roofing estimate or call (601) 573-6178.",
    h1: "Roof Replacement in Ridgeland, MS",
    area: "Ridgeland is in Madison County, just north of Jackson.",
    projects: [
      { id: "150814", summary: "The existing 3-tab roof was removed and new architectural shingles were installed." },
    ],
  },
  "flowood-ms": {
    title: "Roof Replacement & Inspections in Flowood, MS",
    description:
      "Full roof replacement and storm damage roof inspections in Flowood, MS. Request a roofing estimate or call (601) 573-6178.",
    h1: "Roof Replacement & Inspections in Flowood, MS",
    area: "Flowood is in Rankin County, east of Jackson.",
    projects: [
      { id: "143773", summary: "Full roof replacement with Owens Corning shingles: old roof removed, soft decking repaired, and synthetic underlayment, new flashing, and ridge installed." },
      { id: "136", summary: "Roof inspection after storms to identify damage and plan repairs." },
    ],
  },
  "clinton-ms": {
    title: "Roof Repair & Storm Damage in Clinton, MS",
    description:
      "Shingle repair, standing seam metal roof repair, and storm damage inspections and tarping in Clinton, MS. Request an estimate or call (601) 573-6178.",
    h1: "Roof Repair & Storm Damage in Clinton, MS",
    area: "Clinton is in Hinds County, west of Jackson.",
    projects: [
      { id: "151780", summary: "Repair of missing and damaged shingles on a residential roof." },
      { id: "143032", summary: "Replacement of screws on a standing seam metal roof along the ridges and eaves." },
      { id: "154749", summary: "Roof inspection after tree damage, with a tarp installed to protect the interior until permanent repairs." },
    ],
  },
};
