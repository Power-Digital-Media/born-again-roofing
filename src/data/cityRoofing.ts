/**
 * Genuine city-by-city local geography, housing-stock context, verified project logs,
 * and unique Q&As for all 19 Central Mississippi communities served from Florence, MS.
 *
 * Every project ID below corresponds to an authentic, photo-documented record in src/data/pins.json.
 */
export interface CityProject {
  id: string;
  summary: string;
}

export interface CityFaq {
  q: string;
  a: string;
}

export interface CityRoofing {
  cityName: string;
  county: string;
  /** Full <title> (<= 60 chars) */
  metaTitle: string;
  description: string;
  h1: string;
  eyebrow: string;
  /** Lead geographic overview */
  area: string;
  /** Verifiable local neighborhoods, corridors & landmarks */
  neighborhoods: string[];
  /** Unique city-specific roofing context (zero cross-city boilerplate) */
  roofingFocus: string;
  /** Unique city-specific home remodeling context */
  remodelingFocus: string;
  /** Verified project records from src/data/pins.json */
  projects: CityProject[];
  /** Neighboring Central MS service area slugs for geographic hub-and-spoke linking */
  nearbySlugs: string[];
  /** Unique city-tailored FAQs */
  faqs: CityFaq[];
}

export const cityRoofing: Record<string, CityRoofing> = {
  "florence-ms": {
    cityName: "Florence, MS",
    county: "Rankin County",
    metaTitle: "Roofing & Home Remodeling in Florence, MS | Born Again",
    description:
      "Headquartered right here in Florence, MS: 5.0★ GAF-certified roof repair, roof replacement, metal roofing & home remodeling. Free estimate: (601) 573-6178.",
    h1: "Roofing & Home Remodeling in Florence, MS (Our Home Base)",
    eyebrow: "Florence, MS Headquarters · Rankin County",
    area: "Florence is home base for Born Again Home Remodeling & Roofing—our trucks, estimators, and craftsmen dispatch daily right from Rankin County along the US-49 corridor, serving over 90 documented homes across Florence, Cleary, and Monterey.",
    neighborhoods: ["Downtown Florence", "Cleary Road Corridor", "Eagle Ridge", "Monterey", "Williams Road", "US-49 South"],
    roofingFocus:
      "Florence properties range from wooded acreage homes with steep architectural shingle and standing seam metal roofs to established brick ranch subdivisions near Florence High School. Pine needle buildup in roof valleys, aged neoprene pipe boots, and straight-line thunderstorm gusts pushing east across the Pearl River basin are the most frequent roof issues our local inspectors solve.",
    remodelingFocus:
      "Because our shop and crews are based right here in Florence, neighbors call us year-round for subfloor leveling and waterproof tile showers, kitchen cabinet and countertop upgrades, exterior window silicone sealing, rotted fascia wraps, and whole-home interior refreshes.",
    projects: [
      { id: "183448", summary: "Precision residential metal roof installation completed in Florence." },
      { id: "41", summary: "Full residential roof tear-off and new architectural shingle replacement." },
      { id: "48", summary: "Replacement of cracked plumbing pipe boots and roof vent caps to stop attic leaks." },
      { id: "32", summary: "Bathroom subfloor leveling compound prep and interior bathroom remodel." },
    ],
    nearbySlugs: ["richland-ms", "brandon-ms", "byram-ms", "pearl-ms"],
    faqs: [
      {
        q: "Where is Born Again Home Remodeling & Roofing located?",
        a: "Our headquarters is right here in Florence, MS (39073) in southern Rankin County. Because Florence is our home community, we can often inspect active roof leaks or storm damage across Florence, Richland, and Byram the same day you call (601) 573-6178."
      },
      {
        q: "Do you handle both metal roofs and architectural shingle roofs in Florence, MS?",
        a: "Yes. With over 90 documented jobs in Florence alone, our crews install GAF Timberline HDZ architectural shingles, concealed-fastener standing seam metal roofs, and agricultural/residential R-panel replacements."
      }
    ]
  },

  "jackson-ms": {
    cityName: "Jackson, MS",
    county: "Hinds, Rankin & Madison Counties",
    metaTitle: "Jackson, MS Local Projects & Neighborhoods | Born Again",
    description:
      "Explore 150+ verified roofing & home remodeling projects completed across Fondren, Belhaven, Northeast Jackson & Eastover by Born Again: (601) 573-6178.",
    h1: "Completed Projects & Neighborhoods Served in Jackson, MS",
    eyebrow: "150+ Verified Jackson Jobs · Hinds County & Metro",
    area: "From historic steep-slope roofs in Belhaven and Fondren to brick estates in Eastover, Woodland Hills, and Northeast Jackson, our crews have logged more than 150 photo-documented roofing and remodeling jobs across Mississippi's capital city.",
    neighborhoods: ["Fondren", "Belhaven", "Northeast Jackson", "Eastover", "Woodland Hills", "Colonial Mart", "Alta Woods & South Jackson"],
    roofingFocus:
      "Jackson's mature oak and pine canopy drops heavy limbs during spring squall lines, while older multi-valley roofs in Belhaven, Fondren, and Northeast Jackson demand custom step flashing around brick chimneys, skylights, and dormers. We also maintain low-slope TPO and GAF silicone coatings for commercial buildings along I-55 and County Line Road.",
    remodelingFocus:
      "Jackson homeowners frequently pair exterior roof protection with structural interior remodeling—leveling settled pier-and-beam or Yazoo-clay slab floors, gut-renovating 1950s–1980s kitchens and tile baths, repairing water-stained sheetrock ceilings, and painting brick and trim.",
    projects: [
      { id: "2", summary: "Detailed leak diagnostic inspection on a standing seam metal roof in Jackson." },
      { id: "20", summary: "Residential roof leak tracing and flashing evaluation to stop interior water entry." },
      { id: "76", summary: "Roof seam restoration sealing gaps and tears with high-solids GAF roof sealant." },
      { id: "44", summary: "Multi-slope residential roof damage assessment and written repair plan." },
    ],
    nearbySlugs: ["flowood-ms", "pearl-ms", "ridgeland-ms", "clinton-ms", "byram-ms"],
    faqs: [
      {
        q: "Which Jackson, MS neighborhoods do your roofing and remodeling crews cover?",
        a: "We work throughout all of Jackson—including Northeast Jackson, Eastover, Fondren, Belhaven, Woodland Hills, Twin Lakes, Meadowbrook, and South Jackson—dispatching 15 minutes north up US-49 and I-55 from our Florence base."
      },
      {
        q: "Can you repair chimney flashing and interior ceiling water stains on older Jackson homes?",
        a: "Yes. Brick chimneys in Belhaven, Fondren, and Northeast Jackson are a primary leak point when old mortar counter-flashing cracks. Our roofers rebuild the metal step and counter-flashing outside, and our drywall/paint team restores stained interior ceilings."
      }
    ]
  },

  "brandon-ms": {
    cityName: "Brandon, MS",
    county: "Rankin County",
    metaTitle: "Roofing & Home Remodeling in Brandon, MS | Born Again",
    description:
      "5.0★ GAF-certified roof repair, roof replacement, storm inspections & kitchen/bath home remodeling in Brandon, MS (39042 & 39047). Call (601) 573-6178.",
    h1: "Roofing & Home Remodeling in Brandon, MS",
    eyebrow: "Rankin County Seat · 39042 & 39047",
    area: "Located just minutes northeast of our Florence headquarters via MS-18 and I-20, Brandon is one of our busiest Rankin County communities—with more than 30 verified roofing, siding, kitchen, and exterior projects completed from Downtown Brandon to the Reservoir.",
    neighborhoods: ["Crossgates", "Castlewoods", "Reservoir East (39047)", "Shiloh Park", "Downtown Brandon", "Sunset Drive & MS-18"],
    roofingFocus:
      "Open wind fetch coming off the Ross Barnett Reservoir hits Castlewoods and 39047 roofs hard with lifted shingle tabs and ridge-cap blow-offs, while 1980s–2000s homes in Crossgates and Downtown Brandon often develop leaks around brick chimney chases, dormer siding, and aging 3-tab shingles ready for GAF Timberline HDZ architectural upgrades.",
    remodelingFocus:
      "Homeowners in Brandon rely on Born Again as much for custom home remodeling as roofing—updating Crossgates and Castlewoods kitchens and bathrooms, replacing rotted dormer Hardie siding and soffit/fascia trim, installing LVP flooring, and building privacy fencing and outdoor living upgrades.",
    projects: [
      { id: "143483", summary: "Full installation of a new residential metal roof system in Brandon." },
      { id: "123", summary: "Shingle roof leak repair replacing wind-damaged shingles and resealing penetrations." },
      { id: "24", summary: "Brandon roof leak inspection identifying compromised chimney chase flashing." },
      { id: "45", summary: "Exterior siding, soffit, and dormer trim replacement on a Brandon residence." },
    ],
    nearbySlugs: ["flowood-ms", "pearl-ms", "florence-ms", "richland-ms"],
    faqs: [
      {
        q: "Do you serve both 39042 Downtown Brandon and 39047 Reservoir Brandon?",
        a: "Yes. Our crews work daily across both Brandon ZIP codes—from MS-18, Crossgates, and Shiloh Park in 39042 up to Castlewoods, Spillway Road, and Hwy 25 in 39047."
      },
      {
        q: "Can Born Again handle both roof replacement and interior remodeling on our Brandon home?",
        a: "Yes. Unlike storm-only roofers, our full-time Rankin County craftsmen handle GAF shingle and metal roofs alongside custom kitchen remodeling, tiled walk-in showers, dormer siding rot repair, flooring, and interior/exterior painting."
      }
    ]
  },

  "madison-ms": {
    cityName: "Madison, MS",
    county: "Madison County",
    metaTitle: "Roofing & Home Remodeling in Madison, MS | Born Again",
    description:
      "5.0★ GAF architectural roof replacement, standing seam metal accents, synthetic slate & custom home remodeling in Madison, MS. Free estimate: (601) 573-6178.",
    h1: "Roof Replacement, Repair & Remodeling in Madison, MS",
    eyebrow: "Madison County · 39110 Architectural Standards",
    area: "Madison's custom brick and traditional residences along Highland Colony Parkway, Bozeman Road, Hoy Road, and US-51 require meticulous architectural roofing details, HOA-compliant palettes, and high-craftsmanship interior and exteriorcarpentry.",
    neighborhoods: ["Reunion", "Annandale", "Windermere", "Hoy Road Corridor", "Bozeman Road", "Madison Avenue & US-51"],
    roofingFocus:
      "High-pitch multi-gable roofs in Madison feature steep valleys, copper or matte-black standing seam porch accents, custom chimney crickets, and heavy dimensional shingles. We install GAF Timberline HDZ systems, Class 4 impact-resistant synthetic slate, and concealed-fastener metal panels while protecting manicured landscaping and driveways.",
    remodelingFocus:
      "Beyond roofing, our finish carpenters and remodelers complete structural 4x4 and 6x6 porch column replacements, insulated window and dormer upgrades, custom cabinetry, quartz countertops, spa-style tiled showers, and precision trim and painting across Madison.",
    projects: [
      { id: "120", summary: "Complete roof replacement installing a new GAF Timberline HDZ architectural shingle system." },
      { id: "38", summary: "Full tear-off roof replacement including rotted deck board replacement and new shingles." },
      { id: "19", summary: "Insulated dormer window installation and exterior weatherproofing in Madison." },
      { id: "8", summary: "Structural front-porch column replacement, custom trim wrap, and exterior paint." },
    ],
    nearbySlugs: ["ridgeland-ms", "gluckstadt-ms", "canton-ms", "flowood-ms"],
    faqs: [
      {
        q: "Do you help match Madison HOA shingle colors and architectural roofing requirements?",
        a: "Yes. Subdivisions across Madison (such as Reunion, Annandale, and surrounding neighborhoods) maintain strict architectural guidelines. We bring full-size GAF architectural shingle, synthetic slate, and standing seam metal color samples to your estimate so you can submit exact specs for HOA approval."
      },
      {
        q: "Can you replace rotted wood porch columns and dormer trim on brick homes in Madison?",
        a: "Yes—our documented Madison project log includes multiple front and back porch column replacements, dormer window/siding restorations, and exterior painting alongside full roof replacements."
      }
    ]
  },

  "pearl-ms": {
    cityName: "Pearl, MS",
    county: "Rankin County",
    metaTitle: "Roofing & Home Remodeling in Pearl, MS | Born Again",
    description:
      "70+ documented jobs in Pearl, MS! 5.0★ shingle & metal roof repair, roof replacement, silicone coatings & home remodeling. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Home Remodeling in Pearl, MS",
    eyebrow: "70+ Verified Pearl Projects · Rankin County",
    area: "Just north of Richland and Florence along US-80, I-20, and Airport Road, Pearl is one of our most active service hubs—with more than 70 technician-documented roofing, metal coating, gutter/eave, and interior remodeling visits.",
    neighborhoods: ["Airport Road Corridor", "Old Brandon Road", "US-80 Commercial District", "Riverwind", "McLaurin & Cross Park"],
    roofingFocus:
      "Pearl features a wide mix of established ranch homes needing 3-tab-to-architectural shingle upgrades, residential metal roofs requiring silicone seam sealing and screw/boot maintenance, cedar shake inspections, and flat commercial buildings along US-80 suited for high-solids GAF silicone coatings.",
    remodelingFocus:
      "Inside Pearl homes, our crews tackle bathroom vanity and shower updates, subfloor repairs, interior/exterior painting, fascia and soffit rot replacement, and kitchen layout refreshes.",
    projects: [
      { id: "183647", summary: "Silicone seam sealing and leak-prevention touch-ups on a Pearl metal roof." },
      { id: "183350", summary: "Detailed storm and wear inspection on a cedar shake roof in Pearl." },
      { id: "1", summary: "Commercial high-solids GAF silicone roof system installed on a skating rink in Pearl." },
      { id: "5", summary: "Monolithic GAF silicone roof restoration sealing flat/low-slope seams." },
    ],
    nearbySlugs: ["brandon-ms", "flowood-ms", "richland-ms", "florence-ms"],
    faqs: [
      {
        q: "How fast can you inspect a roof leak in Pearl, MS?",
        a: "Because Pearl sits just 12 minutes up US-49 to I-20 from our Florence headquarters, we have completed over 70 service calls in Pearl and can schedule free residential or commercial roof inspections promptly."
      },
      {
        q: "Do you coat and repair commercial metal and flat roofs along Hwy 80 in Pearl?",
        a: "Yes. We have completed multiple commercial GAF silicone roof restorations and metal roof leak repairs right here in Pearl for local businesses and facilities."
      }
    ]
  },

  "flowood-ms": {
    cityName: "Flowood, MS",
    county: "Rankin County",
    metaTitle: "Roofing & Home Remodeling in Flowood, MS | Born Again",
    description:
      "5.0★ roof replacement, storm inspections, commercial flat roofing & custom home remodeling along Lakeland Dr in Flowood, MS. Call (601) 573-6178.",
    h1: "Roof Replacement, Repair & Remodeling in Flowood, MS",
    eyebrow: "Lakeland Drive & Reservoir Corridor · Rankin County",
    area: "Spanning the Lakeland Drive (MS-25) commercial and residential corridor from the Pearl River east to the Reservoir, Flowood is home to two dozen documented Born Again roofing, commercial storm-inspection, flooring, and interior remodeling projects.",
    neighborhoods: ["Dogwood & Market Street", "Laurelwood", "Castlewoods West", "Lakeland Drive (MS-25)", "Winner's Circle & Old Fannin Road"],
    roofingFocus:
      "Flowood subdivisions near Old Fannin Road and the Reservoir experience heavy spring hail and thunderstorm gusts off the water, requiring complete tear-offs down to clean decking, synthetic underlayment, new valley metal, and architectural shingles—plus flat/TPO commercial roof inspections for medical and retail buildings along Lakeland Drive.",
    remodelingFocus:
      "Our Flowood remodeling log includes luxury flooring demolition and quarter-round millwork, bathroom plumbing and subfloor restorations, sheetrock hanging and finishing, and commercial interior build-outs.",
    projects: [
      { id: "143773", summary: "Full Flowood roof replacement: tear-off, soft decking repair, synthetic underlayment, flashing & ridge." },
      { id: "136", summary: "Post-storm residential roof inspection documenting wind and hail impact in Flowood." },
      { id: "70", summary: "Commercial building storm damage roof inspection along the Flowood corridor." },
      { id: "23", summary: "New flooring installation finished with custom mitered quarter-round molding." },
    ],
    nearbySlugs: ["brandon-ms", "pearl-ms", "jackson-ms", "ridgeland-ms"],
    faqs: [
      {
        q: "Do you inspect both residential homes and commercial buildings in Flowood, MS?",
        a: "Yes. We handle steep-slope GAF architectural shingle and metal roofs in Flowood neighborhoods like Laurelwood and Old Fannin, as well as flat TPO, metal, and silicone commercial roofs along Lakeland Drive and Airport Road."
      },
      {
        q: "What happens if you find soft roof decking during a Flowood roof tear-off?",
        a: "As documented on our Flowood replacements, we inspect every square foot of wood decking once old shingles are stripped, photograph any rotted OSB or plywood boards, and replace them cleanly so nails hold tight."
      }
    ]
  },

  "ridgeland-ms": {
    cityName: "Ridgeland, MS",
    county: "Madison County",
    metaTitle: "Roofing & Home Remodeling in Ridgeland, MS | Born Again",
    description:
      "5.0★ architectural shingle roof replacement, storm leak repair, metal roofs & kitchen/bath remodeling in Ridgeland, MS (39157). Call (601) 573-6178.",
    h1: "Roof Replacement, Repair & Remodeling in Ridgeland, MS",
    eyebrow: "Southern Madison County · Reservoir & I-55",
    area: "Positioned between Jackson and Madison along I-55, Highland Colony Parkway, Lake Harbour Drive, and the Ross Barnett Reservoir shoreline, Ridgeland features established 1970s–2000s neighborhoods ready for architectural roof upgrades and interior modernizations.",
    neighborhoods: ["Bridgewater", "Highland Colony", "Lake Harbour", "Old Agency Road", "Northpark & Pear Orchard", "Reservoir Shoreline"],
    roofingFocus:
      "Many established Ridgeland homes around Pear Orchard, Lake Harbour, and Old Trace are reaching the 20-to-25-year mark on older 3-tab or early architectural roofs. Upgrading to wind-rated GAF Timberline HDZ shingles, standing seam metal accents, or Class 4 synthetic shake/slate protects against Reservoir-corridor wind and hail.",
    remodelingFocus:
      "Ridgeland homeowners turn to our remodeling division for open-concept kitchen wall removals, custom cabinetry and quartz islands, primary suite walk-in tile showers, attic insulation upgrades, and exterior trim/siding rot replacement.",
    projects: [
      { id: "150814", summary: "Full tear-off of an aging 3-tab shingle roof and installation of new architectural shingles in Ridgeland." },
    ],
    nearbySlugs: ["madison-ms", "jackson-ms", "flowood-ms", "clinton-ms"],
    faqs: [
      {
        q: "Is upgrading from 3-tab shingles to architectural shingles worth it in Ridgeland, MS?",
        a: "Yes. Architectural laminated shingles are heavier, carry much higher wind-uplift ratings against storms crossing I-55 and the Reservoir, resist curling in summer heat, and add dimensional shadow lines that boost curb appeal across Ridgeland neighborhoods."
      },
      {
        q: "Do you remodel kitchens and bathrooms in Ridgeland townhouses and single-family homes?",
        a: "Yes. Our craftsmen complete full kitchen and bathroom renovations—including waterproof custom tile showers, solid-wood vanities, LVP flooring, recessed LED lighting, and interior painting—across 39157."
      }
    ]
  },

  "clinton-ms": {
    cityName: "Clinton, MS",
    county: "Hinds County",
    metaTitle: "Roofing & Home Remodeling in Clinton, MS | Born Again",
    description:
      "40+ verified jobs in Clinton, MS! 5.0★ shingle & metal roof repair, storm tarping, roof replacement & bath/home remodeling. Call (601) 573-6178.",
    h1: "Roof Repair, Storm Restoration & Remodeling in Clinton, MS",
    eyebrow: "40+ Verified Clinton Projects · Western Hinds County",
    area: "Along I-20, US-80, Springridge Road, and Pinehaven near Mississippi College, Clinton is one of our strongest Hinds County communities—with 44 documented roofing, emergency tree-damage tarping, metal roof maintenance, and custom bathroom remodeling projects.",
    neighborhoods: ["Olde Towne Clinton", "Springridge Road", "Pinehaven", "Lovett", "Northside Drive & Cynthia"],
    roofingFocus:
      "Weather systems tracking east from Vicksburg hit Clinton first across the Jackson Metro, bringing high thunderstorm gusts and fallen oak limbs onto roofs. Our Clinton field log includes rapid tree-impact tarping, missing-shingle repairs, standing seam metal ridge/eave fastener retrofits, and full GAF roof replacements.",
    remodelingFocus:
      "Clinton families also rely on Born Again for accessible ADA-friendly walk-in shower installations with built-in seating, rotted bathroom subfloor tear-outs, LVP flooring, sheetrock, and full interior updates.",
    projects: [
      { id: "154749", summary: "Emergency tree-damage roof inspection and protective tarp installation in Clinton." },
      { id: "151780", summary: "Residential shingle roof repair replacing storm-blown and damaged tabs." },
      { id: "143032", summary: "Standing seam metal roof maintenance replacing weathered screws along ridges and eaves." },
      { id: "160240", summary: "Custom bathroom remodel installing an accessible groutless walk-in shower with seating." },
    ],
    nearbySlugs: ["jackson-ms", "raymond-ms", "byram-ms", "vicksburg-ms"],
    faqs: [
      {
        q: "Do you provide emergency roof tarping after tree or wind damage in Clinton, MS?",
        a: "Yes. As documented in our Clinton project log, when a storm limb or high wind exposes your roof decking, our crew responds quickly to secure heavy-duty tarping, photograph the damage for your insurer, and plan the permanent repair."
      },
      {
        q: "Can you remodel bathrooms and replace damaged subfloors in older Clinton homes?",
        a: "Yes—we have completed numerous bathroom inspections, rotten subfloor replacements, and custom walk-in shower installations across Clinton."
      }
    ]
  },

  "byram-ms": {
    cityName: "Byram, MS",
    county: "Hinds County",
    metaTitle: "Roofing & Home Remodeling in Byram, MS | Born Again",
    description:
      "Just across the Pearl River from our Florence HQ: 5.0★ GAF roof replacement, leak repair & home remodeling in Byram, MS. Call (601) 573-6178.",
    h1: "Roof Replacement, Leak Repair & Remodeling in Byram, MS",
    eyebrow: "Neighboring Southern Hinds County · I-55 South",
    area: "Byram sits immediately west of our Florence headquarters across the Pearl River along Siwell Road, Terry Road, and I-55—making us one of the closest GAF-certified roofing and remodeling contractors serving Byram homeowners.",
    neighborhoods: ["Siwell Road Corridor", "Lakeshore", "rambling Woods", "Terry Road", "Davis Road & Swinging Bridge Area"],
    roofingFocus:
      "We have installed multiple complete architectural shingle roofing systems across Byram—including GAF Timberline HDZ and Driftwood architectural replacements—as well as pinpoint attic and roof-surface leak inspections after southern Hinds County hail and wind events.",
    remodelingFocus:
      "Byram homeowners call our team for walk-in shower conversions, structural framing and rafter repairs, exterior fascia/soffit replacement, and kitchen and flooring updates.",
    projects: [
      { id: "184470", summary: "Full installation of a new GAF Timberline HDZ architectural roof system in Byram." },
      { id: "134682", summary: "Complete tear-off and new Driftwood architectural shingle roof installation." },
      { id: "28", summary: "Comprehensive residential roof leak inspection and flashing evaluation in Byram." },
      { id: "157781", summary: "Bathroom shower inspection and scope preparation for a walk-in shower upgrade." },
    ],
    nearbySlugs: ["florence-ms", "terry-ms", "jackson-ms", "raymond-ms"],
    faqs: [
      {
        q: "How close is Born Again Roofing to Byram, MS?",
        a: "Our Florence headquarters is less than 15 minutes east of Byram via Cleary Road / Siwell Road, allowing fast same-week estimates and rapid emergency leak response."
      },
      {
        q: "What shingle brands do you install on Byram roof replacements?",
        a: "As a GAF-certified contractor, we primarily install GAF Timberline HDZ architectural shingle systems (with qualifying GAF warranty options), and we are also experienced with CertainTeed, Owens Corning, and metal roofing systems."
      }
    ]
  },

  "richland-ms": {
    cityName: "Richland, MS",
    county: "Rankin County",
    metaTitle: "Roofing & Home Remodeling in Richland, MS | Born Again",
    description:
      "5 minutes north of our Florence HQ: 5.0★ roof replacement, leak inspections & whole-house remodeling in Richland, MS (39218). Call (601) 573-6178.",
    h1: "Roofing & Home Remodeling in Richland, MS",
    eyebrow: "Immediate US-49 Neighbor · Rankin County",
    area: "Bordering our Florence home base directly to the north along US-49 and Cleary Road, Richland homeowners are our immediate Rankin County neighbors—just five minutes from our shop.",
    neighborhoods: ["Highway 49 Corridor", "Cleary & Scarborough", "Old Hwy 49", "Monterey Road Border"],
    roofingFocus:
      "Established one-story brick and vinyl-sided ranch homes in Richland face intense summer attic heat and heavy downpours along the Pearl River floodplain. We perform full architectural shingle replacements, attic ventilation upgrades, and leak source diagnostics across 39218.",
    remodelingFocus:
      "As shown in our Richland project log, our interior craftsmen complete full whole-house remodels—replacing worn flooring throughout, rebuilding kitchen and bath cabinetry, repairing drywall, and repainting entire interiors.",
    projects: [
      { id: "37", summary: "Complete residential architectural shingle roof replacement in Richland." },
      { id: "161726", summary: "Targeted roof leak diagnostic inspection identifying water entry points." },
      { id: "159408", summary: "Turnkey whole-house interior remodel in Richland: new flooring, rebuilt cabinets & full repaint." },
    ],
    nearbySlugs: ["florence-ms", "pearl-ms", "brandon-ms", "byram-ms"],
    faqs: [
      {
        q: "Do you handle full interior home renovations in Richland as well as roofing?",
        a: "Yes! One of our featured Richland projects involved replacing flooring, rebuilding cabinets, and repainting the entire interior of a home—right alongside our full architectural roof replacements down the street."
      },
      {
        q: "Are on-site roof inspections free for Richland homeowners?",
        a: "Yes. Because Richland borders Florence directly on US-49, our estimators can stop by quickly for a free, zero-pressure roof or remodeling estimate."
      }
    ]
  },

  "canton-ms": {
    cityName: "Canton, MS",
    county: "Madison County",
    metaTitle: "Roofing & Home Remodeling in Canton, MS | Born Again",
    description:
      "18+ documented jobs in Canton, MS: 5.0★ roof inspections, roof replacement, bathroom remodeling & flooring across Madison County: (601) 573-6178.",
    h1: "Roof Repair, Replacement & Remodeling in Canton, MS",
    eyebrow: "18+ Verified Canton Projects · Madison County Seat",
    area: "From historic homes around the Canton Courthouse Square to rural acreage and newer subdivisions along I-55, MS-22, and US-51, our crews have completed 18 documented roofing, bathroom, concrete, and flooring projects across Canton.",
    neighborhoods: ["Historic Courthouse Square", "Nissan Parkway & I-55", "MS-22 West", "Peace Street & US-51", "Deerfield Area"],
    roofingFocus:
      "Canton homes experience open agricultural wind gusts across northern Madison County that lift unsealed shingle tabs, loosen metal roof fasteners, and test flashing around chimneys and valleys. We provide thorough photo roof inspections, shingle and metal replacements, and storm documentation.",
    remodelingFocus:
      "Our 18 logged Canton projects span bathroom remodels and plumbing repairs, structural side-floor and subfloor restorations, drywall hanging, and custom polished concrete and LVP flooring.",
    projects: [
      { id: "31", summary: "Comprehensive residential roof damage inspection and photo report in Canton." },
      { id: "100", summary: "Bathroom remodel adjustments, plumbing fixture repairs, and interior door carpentry." },
      { id: "79", summary: "Custom polished concrete flooring installation completed in Canton." },
      { id: "165088", summary: "Structural floor framing and bathroom restoration on a Canton property." },
    ],
    nearbySlugs: ["gluckstadt-ms", "madison-ms", "ridgeland-ms", "yazoo-city-ms"],
    faqs: [
      {
        q: "Do your crews travel to rural properties outside downtown Canton, MS?",
        a: "Yes. We serve both in-town Canton homes near the Historic Square and rural residential, barn, and acreage properties across Madison County along MS-16, MS-22, MS-43, and US-51."
      },
      {
        q: "What remodeling trades do you offer in Canton besides roofing?",
        a: "Our documented Canton work includes bathroom and shower remodeling, subfloor and structural floor repairs, drywall, painting, and flooring installations."
      }
    ]
  },

  "gluckstadt-ms": {
    cityName: "Gluckstadt, MS",
    county: "Madison County",
    metaTitle: "Roof Replacement & Remodeling in Gluckstadt, MS | Born Again",
    description:
      "5.0★ GAF-certified roof replacement, Catch-All landscape protection, hail inspections & remodeling in Gluckstadt, MS. Call (601) 573-6178.",
    h1: "Roof Replacement, Storm Repair & Remodeling in Gluckstadt, MS",
    eyebrow: "Madison County · I-55 & Calhoun Station Corridor",
    area: "Mississippi's newest incorporated city along I-55, Gluckstadt Road, and Calhoun Station Parkway features high-value brick subdivisions where clean jobsite protection and GAF architectural roofing standards matter most.",
    neighborhoods: ["Germantown Corridor", "Calhoun Station Parkway", "Gluckstadt Road", "Stirling & Stribling Road Area"],
    roofingFocus:
      "Many Gluckstadt subdivisions built during the 2004–2014 growth wave now face hail-bruised shingles, wind-creased slopes, and builder-grade ventilation issues. As documented in our Gluckstadt project log, we deploy full Catch-All perimeter netting systems during tear-offs so flowerbeds, pools, and driveways stay untouched.",
    remodelingFocus:
      "Inside Gluckstadt homes, our craftsmen deliver primary bathroom walk-in shower upgrades, custom kitchen islands and quartz countertops, bonus-room drywall and painting, and patio cover carpentry.",
    projects: [
      { id: "147008", summary: "Full residential roof tear-off and deck preparation for a new roof in Gluckstadt." },
      { id: "146978", summary: "Deployment of a full Catch-All landscape and property protection system during a Gluckstadt re-roof." },
    ],
    nearbySlugs: ["madison-ms", "canton-ms", "ridgeland-ms", "jackson-ms"],
    faqs: [
      {
        q: "How do you protect landscaping and driveways during a Gluckstadt roof replacement?",
        a: "As shown in our Gluckstadt field photos, we use specialized Catch-All breathable perimeter netting and tarps over shrubs, AC condensers, and walkways, followed by multiple magnetic nail sweeps before departure."
      },
      {
        q: "Can you inspect our Gluckstadt roof for spring hail or wind damage?",
        a: "Yes. We provide free, honest slope-by-slope storm inspections across Gluckstadt and Germantown—showing you clear photos so you know whether your roof is healthy or merits an insurance claim."
      }
    ]
  },

  "terry-ms": {
    cityName: "Terry, MS",
    county: "Hinds County",
    metaTitle: "Roofing & Home Remodeling in Terry, MS | Born Again",
    description:
      "5.0★ architectural shingle roof replacement, metal roofs, storm tarping & residential remodeling in Terry, MS (39170). Call (601) 573-6178.",
    h1: "Roof Replacement, Repair & Remodeling in Terry, MS",
    eyebrow: "Southern Hinds County · I-55 Corridor",
    area: "Just minutes southwest of our Florence headquarters via Rosemary Road and I-55, Terry encompasses both town residences and rural Hinds County homesteads and river camps.",
    neighborhoods: ["Downtown Terry", "Rosemary Road", "Old Hwy 51", "Moncure & Pearl River Rural Acreage"],
    roofingFocus:
      "Open rural exposure around Terry subjects roofs to intense straight-line winds and heavy pine/oak debris. We install high-wind architectural shingle replacements, standing seam and R-panel metal roofs, and rapid storm repairs across 39170.",
    remodelingFocus:
      "Our documented Terry work also includes ground-up residential construction, structural concrete post footings, exterior siding and trim carpentry, and full interior renovations.",
    projects: [
      { id: "152906", summary: "Complete tear-off and new architectural shingle roof replacement in Terry." },
      { id: "184458", summary: "Residential construction and structural carpentry completed in Terry." },
      { id: "146773", summary: "Structural 10x10 post and concrete foundation work on a Pearl River property in Terry." },
    ],
    nearbySlugs: ["byram-ms", "florence-ms", "crystal-springs-ms", "raymond-ms"],
    faqs: [
      {
        q: "Do you service rural homes and acreage properties around Terry, MS?",
        a: "Yes. Terry is just 15–20 minutes west of our Florence shop, and our crews regularly handle architectural shingle roofs, metal roofs, and structural remodeling on both in-town and rural Terry properties."
      },
      {
        q: "Can you replace rotted roof decking or fascia boards during a Terry re-roof?",
        a: "Yes. Because our crew includes experienced framing carpenters, any rotted decking, rafter tails, or fascia wood discovered during tear-off is replaced cleanly on the spot."
      }
    ]
  },

  "raymond-ms": {
    cityName: "Raymond, MS",
    county: "Hinds County",
    metaTitle: "Roofing & Home Remodeling in Raymond, MS | Born Again",
    description:
      "5.0★ roof tear-offs, decking repair, shingle & metal roof replacement, and LVP flooring/remodeling in Raymond, MS (39154): (601) 573-6178.",
    h1: "Roof Replacement, Repair & Remodeling in Raymond, MS",
    eyebrow: "Central Hinds County · MS-18 & Natchez Trace",
    area: "Serving historic homes near Hinds Community College and country properties along MS-18, MS-467, and the Natchez Trace Parkway, our crews bring thorough decking-up roof replacements and interior carpentry to Raymond.",
    neighborhoods: ["Courthouse Square & Main Street", "Hinds CC Area", "MS-18 Corridor", "Oakley & MS-467"],
    roofingFocus:
      "As documented in our Raymond project records, older shingle roofs and patio covers in Raymond often hide moisture-softened roof decking beneath worn felt paper. We strip roofs down to bare wood, replace any damaged decking boards, and install synthetic underlayment and GAF architectural shingles.",
    remodelingFocus:
      "Indoors, our Raymond craftsmen repair damaged subfloor sections, install waterproof Luxury Vinyl Plank (LVP) flooring and cove base, and remodel kitchens and bathrooms.",
    projects: [
      { id: "135394", summary: "Full Raymond roof tear-off down to bare decking, replacing damaged wood before new shingles." },
      { id: "140529", summary: "Patio cover shingle removal, replacement of five rotted deck boards, and new roof installation." },
      { id: "150454", summary: "Flooring repair, waterproof luxury vinyl plank (LVP) installation, and cove base trim in Raymond." },
    ],
    nearbySlugs: ["clinton-ms", "byram-ms", "utica-ms", "jackson-ms"],
    faqs: [
      {
        q: "Do you inspect the wood decking underneath old shingles on Raymond roof replacements?",
        a: "Every single time. On multiple Raymond re-roofs, stripping old shingles and felt revealed hidden rotted decking boards that a roof-over would have trapped. We replace bad wood before laying synthetic underlayment and new shingles."
      },
      {
        q: "Do you offer subfloor repair and LVP flooring installation in Raymond, MS?",
        a: "Yes—our Raymond field log includes subfloor repairs paired with waterproof Luxury Vinyl Plank and trim installations."
      }
    ]
  },

  "crystal-springs-ms": {
    cityName: "Crystal Springs, MS",
    county: "Copiah County",
    metaTitle: "Roofing & Home Remodeling in Crystal Springs, MS | Born Again",
    description:
      "25 minutes south of our Florence HQ down I-55: 5.0★ metal & shingle roof repair, storm inspections & remodeling in Crystal Springs, MS: (601) 573-6178.",
    h1: "Roof Repair, Replacement & Remodeling in Crystal Springs, MS",
    eyebrow: "Northern Copiah County · I-55 & US-51",
    area: "Located straight south of Florence along I-55 and US-51 in northern Copiah County, Crystal Springs homeowners get fast local response from a permanent Central Mississippi contractor—not out-of-town storm chasers.",
    neighborhoods: ["Downtown Crystal Springs", "Chautauqua Park Area", "US-51 & MS-27", "Gallman & Hopewell"],
    roofingFocus:
      "Crystal Springs properties feature a strong mix of residential metal roofs and architectural shingle homes. Our documented local visits include metal roof fastener and seam leak inspections, post-storm shingle assessments, and full roof replacements.",
    remodelingFocus:
      "We also assist Crystal Springs homeowners with bathroom exhaust fan and lighting upgrades, exterior storm door replacements, subfloor repairs, and kitchen and bath remodeling.",
    projects: [
      { id: "34", summary: "Metal roof leak inspection identifying loose fasteners and seam gaps in Crystal Springs." },
      { id: "160477", summary: "Post-storm residential roof inspection and photo documentation in Crystal Springs." },
      { id: "166039", summary: "Removal of weathered exterior door and new storm door installation." },
      { id: "145", summary: "Bathroom exhaust vent fan with integrated lighting installed in Crystal Springs." },
    ],
    nearbySlugs: ["terry-ms", "hazlehurst-ms", "florence-ms", "byram-ms"],
    faqs: [
      {
        q: "Can you fix leaking screws and seams on an existing metal roof in Crystal Springs?",
        a: "Yes. Metal roofs across Copiah County frequently leak when original rubber-washer screws back out or weather over time. We inspect every rib, boot, and ridge cap to recommend targeted fastener/silicone repair or replacement."
      },
      {
        q: "Do you provide free storm damage roof inspections in Crystal Springs, MS?",
        a: "Yes. Call (601) 573-6178 and an estimator from our Florence base just up I-55 will inspect your roof and provide dated photos at no cost."
      }
    ]
  },

  "hazlehurst-ms": {
    cityName: "Hazlehurst, MS",
    county: "Copiah County",
    metaTitle: "Roofing & Home Remodeling in Hazlehurst, MS | Born Again",
    description:
      "6+ verified roofing projects in Hazlehurst, MS: 5.0★ shingle & metal roof replacement, attic leak inspections & home remodeling: (601) 573-6178.",
    h1: "Roof Replacement, Metal Roofs & Remodeling in Hazlehurst, MS",
    eyebrow: "Copiah County Seat · I-55 & MS-28",
    area: "As the county seat of Copiah County along I-55 and MS-28, Hazlehurst is a regular stop for our Florence-dispatched roofing crews—with 6 documented shingle replacements, metal roof replacements, and attic leak inspections.",
    neighborhoods: ["Downtown Hazlehurst", "Lake Hazle Area", "MS-28 Corridor", "Georgetown Road & US-51"],
    roofingFocus:
      "Our Hazlehurst field log highlights both full architectural shingle roof replacements and complete tear-off replacements of aging, improperly flashed metal roofs—paired with inside-the-attic moisture inspections to catch hidden decking leaks early.",
    remodelingFocus:
      "Alongside roofing, we serve Copiah County homeowners with interior drywall and ceiling water-stain restoration, rotten subfloor replacement, bathroom showers, and exterior siding/trim carpentry.",
    projects: [
      { id: "152633", summary: "Full tear-off of an old shingle roof and installation of a new architectural shingle system in Hazlehurst." },
      { id: "137969", summary: "Complete replacement of an aging metal roof system on a Hazlehurst residence." },
      { id: "145849", summary: "Metal roof leak repair correcting prior improper flashing in Hazlehurst." },
      { id: "151914", summary: "Interior attic and exterior roof deck inspection in Hazlehurst." },
    ],
    nearbySlugs: ["crystal-springs-ms", "terry-ms", "utica-ms", "florence-ms"],
    faqs: [
      {
        q: "Can you fix or replace a leaking metal roof installed poorly by a previous contractor in Hazlehurst?",
        a: "Yes—we have already corrected and replaced leaking metal roofs right here in Hazlehurst where prior installers skipped proper valley flashing or closure strips."
      },
      {
        q: "Do your inspectors check inside the attic during a Hazlehurst roof inspection?",
        a: "Whenever attic access is available, yes. Checking the underside of the roof decking reveals slow pipe-boot, chimney, and ventilation moisture long before ceiling stains drop into living rooms."
      }
    ]
  },

  "utica-ms": {
    cityName: "Utica, MS",
    county: "Hinds County",
    metaTitle: "Roofing & Home Remodeling in Utica, MS | Born Again",
    description:
      "5.0★ GAF shingle roof replacement, metal roofing, storm inspections & interior remodeling for Utica, MS (39175) homes. Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Remodeling in Utica, MS",
    eyebrow: "Southwestern Hinds County · MS-18 & MS-27",
    area: "Homeowners in Utica and rural southwestern Hinds County along MS-18 and MS-27 often struggle to get dependable, licensed metro contractors to show up—our Florence-based team proudly serves Utica with full roofing and remodeling coverage.",
    neighborhoods: ["Town of Utica", "MS-18 Corridor", "MS-27 South", "Hinds CC Utica Campus Area", "Cayuga & Learned Border"],
    roofingFocus:
      "Rural properties around Utica face open thunderstorm wind corridors and falling tree limbs that call for durable GAF architectural shingles or long-span metal roofing, backed by thorough flashing around brick chimneys and vent pipes.",
    remodelingFocus:
      "Whether restoring rotted porch posts and fascia boards, leveling pier-and-beam subfloors, or remodeling a farmhouse kitchen or bath, we bring one complete crew out to Utica so your project finishes on schedule.",
    projects: [],
    nearbySlugs: ["raymond-ms", "crystal-springs-ms", "clinton-ms", "vicksburg-ms"],
    faqs: [
      {
        q: "Do you provide free on-site roofing estimates out in Utica and Learned, MS?",
        a: "Yes. We travel MS-18 and MS-27 regularly across southwestern Hinds County to provide free, written on-site roofing and remodeling estimates."
      },
      {
        q: "Is metal roofing or architectural shingles better for rural homes near Utica?",
        a: "Both perform very well when installed to spec: GAF architectural shingles deliver strong wind resistance at a lower upfront cost, while standing seam or heavy-gauge metal roofs excel on rural homes and barns seeking multi-decade longevity."
      }
    ]
  },

  "vicksburg-ms": {
    cityName: "Vicksburg, MS",
    county: "Warren County",
    metaTitle: "Roofing & Home Remodeling in Vicksburg, MS | Born Again",
    description:
      "5.0★ GAF-certified roof replacement, storm damage repair, subfloor restoration & home remodeling in Vicksburg, MS (39180 & 39183): (601) 573-6178.",
    h1: "Roof Replacement, Storm Repair & Remodeling in Vicksburg, MS",
    eyebrow: "Warren County Seat · I-20 & Mississippi River Bluffs",
    area: "Perched on the bluffs above the Mississippi River at the western anchor of the I-20 corridor, Vicksburg's historic cottages, bluffside homes, and Bovina subdivisions face powerful river-valley storm fronts and high year-round humidity.",
    neighborhoods: ["Historic Downtown Bluffs", "Bovina", "Halls Ferry Road", "Indiana Avenue", "Clay Street & Beechwood"],
    roofingFocus:
      "Severe thunderstorm cells crossing the river from Louisiana strike Warren County with heavy hail and straight-line winds before reaching Jackson. Steep-pitch historic roofs and multi-valley ranch homes in Vicksburg benefit from high-wind GAF architectural shingles, custom metal valley flashing, and prompt storm tarping.",
    remodelingFocus:
      "High river-bluff humidity and older crawlspaces in Vicksburg also take a toll on interior wood framing—as documented in our Vicksburg field log, our crew removes mold-damaged, rotted subfloors down to the joists and rebuilds solid foundations for new baths, kitchens, and flooring.",
    projects: [
      { id: "154296", summary: "Full removal of a mold-damaged, rotted subfloor and structural subfloor rebuild in Vicksburg." },
    ],
    nearbySlugs: ["clinton-ms", "raymond-ms", "utica-ms", "yazoo-city-ms"],
    faqs: [
      {
        q: "Do your crews travel I-20 West to Vicksburg and Bovina for roofing and remodeling?",
        a: "Yes. Vicksburg is a straight shot west along I-20 for our crews, and we service Warren County for full roof replacements, storm damage claims inspections, structural subfloor rebuilds, and interior renovations."
      },
      {
        q: "Can you repair moisture-rotted crawlspace subfloors in older Vicksburg homes?",
        a: "Yes—our documented Vicksburg project work includes tearing out moldy, rotted subflooring, treating joists, and installing fresh structural decking ready for waterproof flooring."
      }
    ]
  },

  "yazoo-city-ms": {
    cityName: "Yazoo City, MS",
    county: "Yazoo County",
    metaTitle: "Roofing & Home Remodeling in Yazoo City, MS | Born Again",
    description:
      "5.0★ roof inspections, shingle & metal roof replacement, flashing/siding repair & remodeling in Yazoo City, MS (39194). Call (601) 573-6178.",
    h1: "Roof Repair, Replacement & Remodeling in Yazoo City, MS",
    eyebrow: "Yazoo County Seat · US-49 Corridor North",
    area: "Straight north up US-49 through Madison County into the Delta foothills, Yazoo City homeowners count on Born Again for honest roof inspections, leak-damaged siding and flashing rebuilds, and full roof replacements.",
    neighborhoods: ["Historic Main Street & Lintonia", "Jerry Clower Blvd (US-49)", "Fifteenth Street", "Benton & Vaughan Corridor"],
    roofingFocus:
      "Delta-edge spring storm tracks subject Yazoo County roofs to high winds and wind-driven rain against sidewalls and gables. As documented in our Yazoo City field records, leaks frequently start where roof-to-wall step flashing and adjacent siding have deteriorated—requiring both roofing and carpentry skill to fix permanently.",
    remodelingFocus:
      "Our craftsmen also support Yazoo City property owners with exterior Hardie/wood siding replacement, fascia and soffit rot repair, interior sheetrock ceiling restoration, and kitchen/bath updates.",
    projects: [
      { id: "163458", summary: "Comprehensive residential roof condition and storm inspection in Yazoo City." },
      { id: "160597", summary: "Removal of leak-damaged exterior siding and roof flashing with watertight replacement in Yazoo City." },
    ],
    nearbySlugs: ["canton-ms", "gluckstadt-ms", "madison-ms", "jackson-ms"],
    faqs: [
      {
        q: "Can you fix leaks where roof flashing meets exterior wall siding on Yazoo City homes?",
        a: "Yes! One of our documented Yazoo City projects solved that exact issue—stripping away water-damaged siding and failed flashing at the roofline, installing new metal step flashing, and hanging fresh siding."
      },
      {
        q: "How do I schedule a free roof inspection in Yazoo City, MS?",
        a: "Call (601) 573-6178 or submit our online estimate form and we will coordinate an on-site inspection on our US-49 Madison/Yazoo route."
      }
    ]
  },
};
