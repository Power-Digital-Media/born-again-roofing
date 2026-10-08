/**
 * Static roofing guide content + SEO overrides for roofing sub-pages.
 * Site-owned content only. Deliberately contains no pricing, warranty,
 * licensing, rating or ranking claims, and does not touch Pin Drop data.
 *
 * Page titles omit the brand: the root layout title template appends
 * " | Born Again Roofing".
 */
export interface RoofingGuide {
  /** <title> without brand suffix */
  title: string;
  description: string;
  /** Optional H1 override */
  heading?: string;
  signsHeading: string;
  signs: string[];
  processHeading: string;
  process: string[];
  decisionHeading: string;
  decision: string;
  related: { href: string; label: string }[];
  /** Optional hero eyebrow override */
  eyebrow?: string;
  /** Optional GAF certification / warranty explainer */
  gaf?: boolean;
}

export const gafExplainer = {
  heading: "GAF roofing systems and warranty options",
  intro:
    "Born Again is a GAF certified roofing contractor, and we install GAF architectural shingles, including the Timberline line. Working with a GAF certified contractor matters most when it comes to warranties, because three different kinds of coverage can apply to a roof:",
  types: [
    { name: "Manufacturer (product) warranty", text: "GAF's coverage for manufacturing defects in its shingles. Lifetime limited coverage is available on qualifying shingle lines." },
    { name: "System warranty", text: "Available when eligible GAF shingles and accessory products are installed together as a system by a certified contractor. GAF advertises system coverage of up to 50 years on qualifying shingle systems." },
    { name: "Workmanship warranty", text: "Born Again's own coverage for the quality of our installation work. This is separate from GAF's product and system warranties." },
  ],
  note:
    "Warranty length, what is covered, and eligibility depend on the specific shingles and accessories installed, installation to GAF's specifications, and the applicable GAF warranty terms. Not every installation qualifies for the longest warranty option. We explain which options apply to your roof in your written estimate, and you are welcome to ask for the warranty terms before you sign.",
};

const estimate = { href: "/contact-us/", label: "Request a Roofing Estimate" };

export const roofingGuides: Record<string, RoofingGuide> = {
  "roof-repair": {
    title: "Roof Repair in Jackson, MS",
    description:
      "Leaks, missing shingles, and damaged flashing repaired for Jackson-area homes. See what a repair visit involves, then call (601) 573-6178.",
    signsHeading: "Signs your roof may need repair",
    signs: [
      "Water stains or discoloration on ceilings or along attic rafters",
      "Shingles that are missing, cracked, curled, or lifting at the edges",
      "Granules collecting in gutters or at the base of downspouts",
      "Exposed or rusted flashing around chimneys, vents, and skylights",
    ],
    processHeading: "What a roof repair visit involves",
    process: [
      "We look at the roof surface, flashing, penetrations, and the attic underside where it is accessible.",
      "We trace the problem back to its source, which is often not directly above the stain you see inside.",
      "We explain what we found with photos and recommend the smallest repair that solves it.",
      "We make the repair and clean up the work area.",
    ],
    decisionHeading: "Repair or replace?",
    decision:
      "A repair usually makes sense when damage is limited to one area and the surrounding roof is in sound condition. When problems are spread across the roof, the same leaks keep returning, or the shingles are worn through across large sections, replacement may be the better long-term choice. We will tell you which applies to your roof after looking at it.",
    related: [
      { href: "/storm-damage-roof-repair/roof-patches-and-leak-repair/", label: "Roof patches and leak repair" },
      { href: "/residential-roofing/roof-inspections/", label: "Roof inspections" },
      { href: "/residential-roofing/roof-installation/", label: "Roof replacement" },
      estimate,
    ],
  },
  "roof-installation": {
    eyebrow: "GAF Certified Roofing Contractor",
    gaf: true,
    title: "Roof Replacement in Jackson, MS",
    description:
      "New roof installation and full replacement for Jackson-area homes, from tear-off to cleanup. Request an estimate or call (601) 573-6178.",
    heading: "Roof Replacement & Installation in Jackson, MS",
    signsHeading: "When a roof replacement is worth considering",
    signs: [
      "Shingles are worn, brittle, or losing granules across much of the roof",
      "Repairs are becoming frequent or leaks keep coming back",
      "Storm damage affects large sections of the roof",
      "The roof is approaching the end of its expected service life",
    ],
    processHeading: "How a roof replacement works",
    process: [
      "Inspection and estimate: we look at the roof and decking condition and discuss material options.",
      "Tear-off: the old roofing is removed and the deck is checked for damaged or rotted wood.",
      "Installation: underlayment, flashing, ventilation components, and new roofing are installed.",
      "Cleanup and walkthrough: debris and nails are cleared from the property.",
    ],
    decisionHeading: "Choosing a roofing material",
    decision:
      "Architectural asphalt shingles are the most common choice for homes in the Jackson area. Standing seam metal is another option for homeowners who want a different look and a longer-lasting material at a higher upfront cost. We can walk through both during your estimate.",
    related: [
      { href: "/residential-roofing/asphalt-shingle-roof-repair-and-replacement/", label: "Asphalt shingle roofing" },
      { href: "/metal-roofing-repair-and-installation/", label: "Metal roofing" },
      { href: "/residential-roofing/roof-repair/", label: "Roof repair" },
      estimate,
    ],
  },
  "asphalt-shingle-roof-repair-and-replacement": {
    eyebrow: "GAF Certified Roofing Contractor",
    gaf: true,
    title: "Asphalt Shingle Roofing in Jackson, MS",
    description:
      "Asphalt shingle repair and replacement for homes in Jackson and nearby cities. Learn the warning signs and how we approach each job, then request an estimate.",
    signsHeading: "Warning signs on asphalt shingle roofs",
    signs: [
      "Bald spots where the protective granules have worn away",
      "Curling or cupping shingle edges",
      "Cracked shingles or visible nail pops",
      "Moss or algae growth on shaded roof slopes",
    ],
    processHeading: "How we approach shingle work",
    process: [
      "We inspect the shingles, flashing, and ventilation to see how widespread the wear is.",
      "For isolated damage, we replace affected shingles and reseal flashing.",
      "For widespread wear, we discuss a full tear-off and re-roof.",
      "We confirm the plan with you before any work starts.",
    ],
    decisionHeading: "Architectural vs. 3-tab shingles",
    decision:
      "Architectural (laminated) shingles are thicker and have a dimensional look. Older 3-tab shingles are flatter and lighter. Most homeowners replacing a roof today choose architectural shingles, but the right choice depends on your home and budget.",
    related: [
      { href: "/residential-roofing/roof-repair/", label: "Roof repair" },
      { href: "/residential-roofing/roof-installation/", label: "Roof replacement" },
      { href: "/storm-damage-roof-repair/wind-damage-roof-repair/", label: "Wind damage repair" },
      estimate,
    ],
  },
  "roof-inspections": {
    title: "Roof Inspections in Jackson, MS",
    description:
      "Roof inspections for Jackson-area homeowners after storms, before buying a home, or when you suspect a leak. See what we check and request an inspection.",
    signsHeading: "When to schedule a roof inspection",
    signs: [
      "After hail, high winds, or a severe storm",
      "When you notice stains, leaks, or missing shingles",
      "Before buying or selling a home",
      "When you are deciding between repair and replacement",
    ],
    processHeading: "What a roof inspection includes",
    process: [
      "Roof surface: shingle condition, missing or damaged sections, and signs of impact.",
      "Flashing and penetrations: chimneys, vents, skylights, and valleys.",
      "Roof edges: fascia, soffit, and gutters where they meet the roof.",
      "Attic underside, when accessible: signs of moisture, daylight, or ventilation problems.",
      "A summary of what we found, with photos, and our recommendation.",
    ],
    decisionHeading: "What happens after the inspection",
    decision:
      "If the roof is in good shape, we will tell you so. If it needs work, you will get a clear explanation of what is wrong and whether a repair or replacement is appropriate. Photo documentation can also help if you decide to file an insurance claim.",
    related: [
      { href: "/storm-damage-roof-repair/roof-insurance-claims-help/", label: "Roof insurance claims help" },
      { href: "/storm-damage-roof-repair/hail-damage-roof-repair/", label: "Hail damage repair" },
      { href: "/residential-roofing/roof-repair/", label: "Roof repair" },
      estimate,
    ],
  },
  "soffit-and-fascia-repair": {
    title: "Soffit & Fascia Repair in Jackson, MS",
    description:
      "Rotted or damaged soffit and fascia repaired on Jackson-area homes to protect roof edges and attic ventilation. Request an estimate or call (601) 573-6178.",
    signsHeading: "Signs of soffit and fascia damage",
    signs: [
      "Peeling paint or soft, rotted wood at the roof edge",
      "Gutters sagging or pulling away from the house",
      "Gaps where birds, insects, or rodents can enter the attic",
      "Water stains on eaves or exterior walls",
    ],
    processHeading: "How the repair goes",
    process: [
      "We check how far the damage extends along the roof edge.",
      "Rotted boards are removed and replaced.",
      "We confirm soffit vents remain open for attic airflow.",
      "Repaired areas are finished so they are ready for paint or wrap.",
    ],
    decisionHeading: "Why it matters for the roof",
    decision:
      "Fascia and soffit protect the ends of the rafters and keep moisture out of the eaves. Ignoring rot at the roof edge can lead to larger roofing and structural repairs.",
    related: [
      { href: "/residential-roofing/roof-repair/", label: "Roof repair" },
      { href: "/residential-roofing/roof-inspections/", label: "Roof inspections" },
      estimate,
    ],
  },
  "emergency-roof-repair": {
    title: "Emergency Roof Repair in Jackson, MS",
    description:
      "Storm-damaged roof or active leak? We provide emergency tarping and temporary repairs in Jackson and nearby cities. Call (601) 573-6178.",
    heading: "Emergency Roof Repair in Jackson, MS",
    signsHeading: "When to call for emergency roof service",
    signs: [
      "A tree limb or debris has hit the roof",
      "Shingles have blown off and the decking is exposed",
      "Water is actively entering the home",
      "A section of the roof is visibly sagging or open",
    ],
    processHeading: "What emergency service covers",
    process: [
      "Safety first: if there is structural danger inside the home, stay out of the affected area.",
      "We tarp or temporarily seal the exposed area to stop further water entry.",
      "We document the damage with photos, which can help with an insurance claim.",
      "Once the weather clears, we plan the permanent repair or replacement.",
    ],
    decisionHeading: "After the roof is protected",
    decision:
      "A tarp is a temporary measure. We will explain what permanent repair is needed and help you understand your options, including whether the damage should be reported to your insurer.",
    related: [
      { href: "/storm-damage-roof-repair/roof-insurance-claims-help/", label: "Roof insurance claims help" },
      { href: "/storm-damage-roof-repair/roof-patches-and-leak-repair/", label: "Leak repair" },
      { href: "/residential-roofing/roof-installation/", label: "Roof replacement" },
      estimate,
    ],
  },
  "roof-patches-and-leak-repair": {
    title: "Roof Leak Repair in Jackson, MS",
    description:
      "Finding and fixing roof leaks around vents, chimneys, valleys, and skylights for Jackson-area homes. See common leak sources and request a repair estimate.",
    heading: "Roof Leak Repair & Patching in Jackson, MS",
    signsHeading: "Common sources of roof leaks",
    signs: [
      "Cracked or dried-out seals around plumbing vent pipes",
      "Failed flashing at chimneys, walls, and skylights",
      "Valleys where two roof slopes meet and carry heavy runoff",
      "Damaged or missing shingles after wind",
    ],
    processHeading: "How we track down a leak",
    process: [
      "We start inside, looking at stains and the attic underside where reachable.",
      "We follow the water path up and across to the likely entry point on the roof.",
      "We inspect nearby flashing, penetrations, and shingles.",
      "We repair the entry point and check the surrounding area.",
    ],
    decisionHeading: "When a patch is not enough",
    decision:
      "A patch can solve a single entry point. If the surrounding shingles are worn or there are multiple leaks, repeated patching may not be a good use of money and replacement could be worth discussing.",
    related: [
      { href: "/residential-roofing/roof-repair/", label: "Roof repair" },
      { href: "/storm-damage-roof-repair/emergency-roof-repair/", label: "Emergency roof repair" },
      { href: "/residential-roofing/roof-inspections/", label: "Roof inspections" },
      estimate,
    ],
  },
  "hail-damage-roof-repair": {
    title: "Hail Damage Roof Repair in Jackson, MS",
    description:
      "Hail damage can be hard to spot from the ground. Learn what to look for, how we inspect, and how to document damage for Jackson-area homes.",
    heading: "Hail Damage Roof Repair in Jackson, MS",
    signsHeading: "What hail damage can look like",
    signs: [
      "Dents or dings on metal vents, flashing, and gutters",
      "Shingles with bruises, cracks, or exposed mat",
      "Granules washed into gutters or onto the ground",
      "Random, scattered impact marks across the roof surface",
    ],
    processHeading: "How we inspect for hail damage",
    process: [
      "We check soft metals (vents, flashing, gutters) first, since they show impact marks clearly.",
      "We examine shingles on each slope for impact points and granule loss.",
      "We photograph the damage and note where it is concentrated.",
      "We explain whether the damage is repairable or points toward replacement.",
    ],
    decisionHeading: "Repair, replace, or file a claim?",
    decision:
      "Light, isolated damage may be repairable. Widespread impact damage often leads to a replacement conversation. If you plan to file a claim, document damage soon after the storm and check your policy's claim timeline.",
    related: [
      { href: "/storm-damage-roof-repair/roof-insurance-claims-help/", label: "Roof insurance claims help" },
      { href: "/residential-roofing/roof-inspections/", label: "Roof inspections" },
      { href: "/residential-roofing/roof-installation/", label: "Roof replacement" },
      estimate,
    ],
  },
  "wind-damage-roof-repair": {
    title: "Wind Damage Roof Repair in Jackson, MS",
    description:
      "Missing shingles, lifted edges, and loose flashing after high winds. See what wind damage looks like and how we repair it on Jackson-area roofs.",
    heading: "Wind Damage Roof Repair in Jackson, MS",
    signsHeading: "What wind damage looks like",
    signs: [
      "Shingles missing from the roof or found in the yard",
      "Creased shingles where the tab was folded back",
      "Lifted edges or broken sealant strips",
      "Loose or displaced ridge caps and flashing",
    ],
    processHeading: "How we handle wind damage",
    process: [
      "We inspect all slopes, with extra attention to edges, ridges, and corners where wind pressure is highest.",
      "We check the exposed decking for moisture damage.",
      "We replace missing or damaged shingles and resecure flashing.",
      "We discuss whether the remaining roof is in condition to last.",
    ],
    decisionHeading: "Why to act quickly",
    decision:
      "Even a few missing shingles leave the underlayment and decking exposed. A quick repair is typically much less involved than fixing water damage later.",
    related: [
      { href: "/storm-damage-roof-repair/emergency-roof-repair/", label: "Emergency roof repair" },
      { href: "/residential-roofing/roof-repair/", label: "Roof repair" },
      { href: "/storm-damage-roof-repair/roof-insurance-claims-help/", label: "Roof insurance claims help" },
      estimate,
    ],
  },
  "roof-insurance-claims-help": {
    title: "Roof Insurance Claim Help in Jackson, MS",
    description:
      "How roof inspections and photo documentation can support a storm damage claim, and what to expect when your adjuster visits. Jackson-area homeowners.",
    heading: "Roof Insurance Claim Help in Jackson, MS",
    signsHeading: "When a roof claim may be worth exploring",
    signs: [
      "A recent hail or wind storm affected your neighborhood",
      "You see missing shingles, dents on metal, or granule loss",
      "A leak appeared after a storm",
      "A previous inspection noted possible storm damage",
    ],
    processHeading: "How we can help",
    process: [
      "We inspect the roof and document damage with dated photos.",
      "You review the findings and decide whether to file a claim with your insurer.",
      "We are available to talk through the damage with your adjuster during their inspection.",
      "If the claim is approved, we can provide an estimate for the repair or replacement.",
    ],
    decisionHeading: "What to know",
    decision:
      "Whether damage is covered and how much is paid is decided by your insurance company and your policy. We provide documentation and an honest assessment of the roof, but we cannot guarantee a claim outcome. Homeowners remain responsible for their deductible.",
    related: [
      { href: "/storm-damage-roof-repair/hail-damage-roof-repair/", label: "Hail damage repair" },
      { href: "/storm-damage-roof-repair/wind-damage-roof-repair/", label: "Wind damage repair" },
      { href: "/residential-roofing/roof-inspections/", label: "Roof inspections" },
      estimate,
    ],
  },
  "standing-seam-metal-roof-installation": {
    title: "Standing Seam Metal Roofs in Jackson, MS",
    description:
      "Standing seam metal roof installation for Jackson-area homes. Learn how concealed-fastener panels work and what to consider before choosing metal.",
    signsHeading: "Why homeowners choose standing seam metal",
    signs: [
      "Concealed fasteners reduce exposed screw heads on the roof surface",
      "Long panel runs mean fewer seams across each slope",
      "A different look from asphalt shingles",
      "Metal roofing is generally considered long-lasting",
    ],
    processHeading: "How an installation works",
    process: [
      "Estimate: we look at the roof shape, slopes, and penetrations to plan panel layout.",
      "Preparation: existing roofing is removed or assessed and the deck is checked.",
      "Underlayment, trim, and flashing are installed.",
      "Panels are fastened with clips that let metal expand and contract with temperature.",
    ],
    decisionHeading: "Metal or asphalt shingles?",
    decision:
      "Standing seam metal costs more upfront than asphalt shingles. For some homeowners, the appearance and longevity justify that cost; for others, architectural shingles are the better fit. We can compare both for your home during your estimate.",
    related: [
      { href: "/metal-roofing-repair-and-installation/", label: "Metal roofing overview" },
      { href: "/residential-roofing/roof-installation/", label: "Roof replacement" },
      { href: "/residential-roofing/roof-inspections/", label: "Roof inspections" },
      estimate,
    ],
  },
};
