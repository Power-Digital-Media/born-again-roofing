/**
 * Roofing-led + Remodeling local metadata and geographic context for all 19
 * Central Mississippi service-area pages.
 *
 * Project summaries below are condensed strictly from published project records
 * in src/data/pins.json; live and historical project cards are also rendered
 * server-side via getPins() in src/app/areas-we-service/[slug]/page.tsx.
 */
export interface CityProject {
  id: string;
  /** Plain-language summary restating only what the published record states */
  summary: string;
}

export interface CityRoofing {
  /** <title> without brand suffix (layout template appends "| Born Again Home Remodeling & Roofing") */
  title: string;
  description: string;
  h1: string;
  /** Verifiable Mississippi geography only */
  area: string;
  projects: CityProject[];
}

export const cityRoofing: Record<string, CityRoofing> = {
  "florence-ms": {
    title: "Roof Repair, Replacement & Remodeling in Florence, MS",
    description:
      "Headquartered at 150 Highland Dr in Florence, MS: GAF-certified roof repair, roof replacement, storm damage inspections, metal roofing, and home remodeling. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Florence, MS",
    area: "Born Again Home Remodeling & Roofing is headquartered right here in Florence at 150 Highland Dr in Rankin County along the US-49 corridor.",
    projects: [],
  },
  "jackson-ms": {
    title: "Roof Repair, Replacement & Remodeling in Jackson, MS",
    description:
      "GAF-certified roof repair, roof replacement, storm & hail inspections, metal roofing, and home remodeling for Jackson, MS homes. Free estimates: (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Jackson, MS",
    area: "Jackson spans Hinds, Rankin, and Madison counties, and our Florence-based crews work throughout the entire Jackson metro area.",
    projects: [
      { id: "2", summary: "Inspection of a standing seam metal roof for leaks, looking for potential water entry points." },
      { id: "20", summary: "Roof leak inspection to find and assess damage before water got into the home." },
      { id: "44", summary: "Inspection of a residential roof to judge how severe the damage was and recommend targeted repairs." },
      { id: "76", summary: "Roof seam repair: gaps and tears were sealed with GAF high solids roof sealant." },
    ],
  },
  "brandon-ms": {
    title: "Roof Repair, Replacement & Remodeling in Brandon, MS",
    description:
      "GAF-certified roof repair, architectural shingle replacement, metal roofing, storm inspections, and home remodeling in Brandon, MS. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Brandon, MS",
    area: "Brandon is the county seat of Rankin County, minutes northeast of our Florence headquarters.",
    projects: [
      { id: "24", summary: "Roof leak inspection that found the chimney's integrity was compromised." },
      { id: "123", summary: "Roof repair that included assessing damage, replacing damaged shingles, and fixing leaks." },
      { id: "143483", summary: "Installation of a new metal roof system." },
    ],
  },
  "madison-ms": {
    title: "Roof Replacement, Repair & Remodeling in Madison, MS",
    description:
      "GAF architectural shingle roof replacement, storm & hail roof repair, standing seam metal roofing, and custom remodeling in Madison, MS. Call (601) 573-6178.",
    h1: "Roof Replacement, Repair & Home Remodeling in Madison, MS",
    area: "Madison is in Madison County along the I-55 corridor north of Jackson and Ridgeland.",
    projects: [
      { id: "38", summary: "Roof replacement: old shingles removed, rotten deck boards replaced, and new shingles installed." },
      { id: "120", summary: "Installation of a new architectural-style HDZ roof system as part of a roof replacement." },
    ],
  },
  "pearl-ms": {
    title: "Roof Repair, Metal Roofing & Remodeling in Pearl, MS",
    description:
      "Roof repair, shingle replacement, metal & silicone roof service, storm inspections, and home remodeling for Pearl, MS homes. Call (601) 573-6178.",
    h1: "Roof Repair, Metal Roofing & Home Remodeling in Pearl, MS",
    area: "Pearl sits in Rankin County along I-20 just east of Jackson and north of Richland and Florence.",
    projects: [
      { id: "183647", summary: "Silicone touch-ups on a metal roof, sealing gaps to help prevent leaks." },
      { id: "183350", summary: "Inspection of a cedar shake roof for damaged pieces." },
      { id: "5", summary: "Installation of a new GAF silicone roof." },
    ],
  },
  "flowood-ms": {
    title: "Roof Replacement, Repair & Remodeling in Flowood, MS",
    description:
      "Full roof replacement, storm damage roof inspections, leak repair, metal roofing, and home remodeling in Flowood, MS. Free estimates: (601) 573-6178.",
    h1: "Roof Replacement, Repair & Home Remodeling in Flowood, MS",
    area: "Flowood is in Rankin County along the Lakeland Drive (MS-25) corridor east of Jackson.",
    projects: [
      { id: "143773", summary: "Full roof replacement with Owens Corning shingles: old roof removed, soft decking repaired, and synthetic underlayment, new flashing, and ridge installed." },
      { id: "136", summary: "Roof inspection after storms to identify damage and plan repairs." },
    ],
  },
  "ridgeland-ms": {
    title: "Roof Replacement, Repair & Remodeling in Ridgeland, MS",
    description:
      "Architectural shingle roof replacement, storm & leak repair, metal roofing, and kitchen & bath remodeling for Ridgeland, MS homes. Call (601) 573-6178.",
    h1: "Roof Replacement, Repair & Home Remodeling in Ridgeland, MS",
    area: "Ridgeland sits in southern Madison County along I-55 and the Ross Barnett Reservoir just north of Jackson.",
    projects: [
      { id: "150814", summary: "The existing 3-tab roof was removed and new architectural shingles were installed." },
    ],
  },
  "clinton-ms": {
    title: "Roof Repair, Storm Damage & Remodeling in Clinton, MS",
    description:
      "Shingle roof repair, standing seam metal roof service, storm tarping & inspections, and home remodeling in Clinton, MS. Call (601) 573-6178.",
    h1: "Roof Repair, Storm Damage & Home Remodeling in Clinton, MS",
    area: "Clinton is in Hinds County along the I-20 corridor west of Jackson.",
    projects: [
      { id: "151780", summary: "Repair of missing and damaged shingles on a residential roof." },
      { id: "143032", summary: "Replacement of screws on a standing seam metal roof along the ridges and eaves." },
      { id: "154749", summary: "Roof inspection after tree damage, with a tarp installed to protect the interior until permanent repairs." },
    ],
  },
  "byram-ms": {
    title: "Roof Repair, Replacement & Remodeling in Byram, MS",
    description:
      "GAF-certified roof repair, shingle replacement, storm & wind damage inspections, and home remodeling in Byram, MS. Free estimates: (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Byram, MS",
    area: "Byram is in southern Hinds County along I-55 just west of our Rankin County headquarters in Florence.",
    projects: [],
  },
  "richland-ms": {
    title: "Roof Repair, Replacement & Remodeling in Richland, MS",
    description:
      "Local roof repair, GAF shingle replacement, storm damage restoration, metal roofing, and home remodeling in Richland, MS. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Richland, MS",
    area: "Richland neighbors our Florence headquarters directly to the north along US-49 in Rankin County.",
    projects: [],
  },
  "canton-ms": {
    title: "Roof Repair, Replacement & Remodeling in Canton, MS",
    description:
      "Roof repair, architectural shingle replacement, metal roofing, storm damage inspections, and home remodeling in Canton, MS. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Canton, MS",
    area: "Canton is the county seat of Madison County along I-55 north of Gluckstadt and Madison.",
    projects: [],
  },
  "gluckstadt-ms": {
    title: "Roof Replacement, Repair & Remodeling in Gluckstadt, MS",
    description:
      "GAF-certified roof replacement, hail & wind roof inspections, metal roofing, and interior home remodeling in Gluckstadt, MS. Call (601) 573-6178.",
    h1: "Roof Replacement, Repair & Home Remodeling in Gluckstadt, MS",
    area: "Gluckstadt is in Madison County along I-55 between Madison and Canton.",
    projects: [],
  },
  "terry-ms": {
    title: "Roof Repair, Replacement & Remodeling in Terry, MS",
    description:
      "Residential roof repair, shingle & metal roof replacement, storm tarping, and home remodeling in Terry, MS. Free estimates: (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Terry, MS",
    area: "Terry is in southern Hinds County along I-55 just south of Byram and west of Florence.",
    projects: [],
  },
  "raymond-ms": {
    title: "Roof Repair, Replacement & Remodeling in Raymond, MS",
    description:
      "Roof leak repair, full shingle & metal roof replacement, storm inspections, and home remodeling for Raymond, MS homeowners. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Raymond, MS",
    area: "Raymond sits in central Hinds County along MS-18 southwest of Clinton and Jackson.",
    projects: [],
  },
  "crystal-springs-ms": {
    title: "Roof Repair, Replacement & Remodeling in Crystal Springs, MS",
    description:
      "GAF shingle roof replacement, metal roofing, storm damage roof repair, and home remodeling in Crystal Springs, MS. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Crystal Springs, MS",
    area: "Crystal Springs is in northern Copiah County along I-55 south of Terry and Florence.",
    projects: [],
  },
  "hazlehurst-ms": {
    title: "Roof Repair, Replacement & Remodeling in Hazlehurst, MS",
    description:
      "Trusted roof repair, roof replacement, metal roofing, storm damage inspections, and home remodeling in Hazlehurst, MS. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Hazlehurst, MS",
    area: "Hazlehurst is the county seat of Copiah County along I-55 south of Crystal Springs.",
    projects: [],
  },
  "utica-ms": {
    title: "Roof Repair, Replacement & Remodeling in Utica, MS",
    description:
      "Residential roof repair, shingle & metal roof installation, storm inspections, and home remodeling in Utica, MS. Free estimates: (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Utica, MS",
    area: "Utica sits in southwestern Hinds County along MS-18 and MS-27.",
    projects: [],
  },
  "vicksburg-ms": {
    title: "Roof Repair, Replacement & Remodeling in Vicksburg, MS",
    description:
      "Roof repair, GAF architectural shingle replacement, standing seam metal roofing, storm inspections, and remodeling in Vicksburg, MS. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Vicksburg, MS",
    area: "Vicksburg is the county seat of Warren County along the I-20 corridor west of Clinton and Jackson.",
    projects: [],
  },
  "yazoo-city-ms": {
    title: "Roof Repair, Replacement & Remodeling in Yazoo City, MS",
    description:
      "Roof repair, roof replacement, storm & wind damage restoration, metal roofing, and home remodeling in Yazoo City, MS. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Yazoo City, MS",
    area: "Yazoo City is the county seat of Yazoo County along the US-49 corridor northwest of Madison County.",
    projects: [],
  },
};
