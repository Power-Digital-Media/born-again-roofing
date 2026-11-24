import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ServiceCTA from "@/components/ServiceCTA";
import RoofingHeroActions from "@/components/RoofingHeroActions";
import ServiceBentoGrid, { BentoTradeVariant } from "@/components/ServiceBentoGrid";
import ServicePinsCarousel from "@/components/ServicePinsCarousel";
import ServiceArticle from "@/components/ServiceArticle";
import TrustedBrands from "@/components/TrustedBrands";

interface ServiceDetail {
  title: string;
  description: string;
  heading: string;
  subheading: string;
  bodyText: string;
  localContext: string;
  scopeChecklist: string[];
  bentoVariant: BentoTradeVariant;
  relatedLinks: { href: string; label: string }[];
  faqs: { q: string; a: string }[];
}

const services: Record<string, ServiceDetail> = {
  "bathroom-remodeling": {
    title: "Bathroom Remodeler in Jackson, MS | Born Again Remodeling",
    description:
      "5.0★ bathroom remodeler serving Jackson, Brandon, Madison & Florence, MS. Custom waterproof tile showers, vanities, tubs & subfloor repair: (601) 573-6178.",
    heading: "Bathroom Remodeling in Jackson & Central MS",
    subheading: "Custom Walk-In Tile Showers, Vanities, Tub Conversions & Subfloor Restoration",
    bodyText:
      "Bathrooms demand structural waterproofing behind every wall and beneath every floor tile—not surface cosmetics that fail in two years. As a full-service Central Mississippi bathroom remodeler, our in-house crew handles complete bathroom demolition, rotted subfloor replacement, waterproof shower pan and membrane construction, custom porcelain and stone tile, solid-wood vanities, plumbing rough-ins, and ventilation upgrades.",
    localContext:
      "Across older pier-and-beam cottages in Fondren and Belhaven as well as slab homes in Brandon, Madison, Flowood, Clinton, and Florence, slow toilet wax-ring leaks and unsealed tub surrounds frequently soften subfloors or wick moisture into studs. We inspect every framing cavity during demo and rebuild it dry, level, and code-compliant.",
    scopeChecklist: [
      "Tub-to-walk-in-shower conversions with Schluter-style waterproof membranes & recessed niches",
      "Rotted plywood subfloor & joist restoration around toilets, tubs, and shower pans",
      "Solid-plywood custom vanities, quartz/granite tops, frameless glass & modern fixtures",
      "Quiet humidity-venting exhaust fans, GFCI circuits & vanity LED lighting",
    ],
    bentoVariant: "kitchen_bath",
    relatedLinks: [
      { href: "/tile-service/", label: "Custom Tile & Shower Surrounds" },
      { href: "/plumbing/", label: "Remodel Plumbing & Valves" },
      { href: "/kitchen-remodeling/", label: "Kitchen Remodeling" },
      { href: "/flooring/", label: "Waterproof LVP & Tile Flooring" },
    ],
    faqs: [
      { q: "How long does a complete bathroom remodel take in Jackson, MS?", a: "Most hall and guest bathroom remodels take 7 to 12 working days, while custom primary suite bathroom renovations with walk-in tile showers, freestanding tubs, and custom vanities typically span 2 to 3 weeks depending on tile layout and glass fabrication." },
      { q: "Do you repair hidden subfloor water damage during a bathroom remodel?", a: "Yes. Replacing water-damaged or moldy subflooring and treating floor joists before new underlayment goes down is standard practice on our bathroom remodels so your new tile never cracks or shifts." },
      { q: "Do you install accessible walk-in showers with grab bars and built-in benches?", a: "Yes. We build low-curb and curbless walk-in showers with solid wood wall blocking for grab bars, slip-resistant mosaic shower floors, handheld diverters, and built-in bench seating." }
    ]
  },
  "kitchen-remodeling": {
    title: "Kitchen Remodeling in Jackson, MS | Born Again Remodeling",
    description:
      "5.0★ custom kitchen remodeling in Jackson, Brandon, Madison & Florence, MS. Solid-wood cabinets, quartz & granite countertops, islands & tile: (601) 573-6178.",
    heading: "Kitchen Remodeling in Jackson & Central MS",
    subheading: "Custom Wood Cabinetry, Quartz & Granite Countertops, Islands & Open Layouts",
    bodyText:
      "The kitchen is the gathering center of your home. Our Central Mississippi remodeling craftsmen manage your entire kitchen renovation under one roof—from clean demolition and load-bearing wall openings to custom solid-wood cabinetry, quartz and Taj Mahal granite countertops, tile backsplashes, sink and appliance plumbing, under-cabinet LED lighting, flooring, and trim.",
    localContext:
      "Many 1970s–2000s homes in Brandon, Northeast Jackson, Madison, Ridgeland, Clinton, and Pearl were built with closed-off galley kitchens, soffit bulkheads, and particle-board cabinets. We routinely remove non-structural bulkheads or install engineered LVL beams to open the kitchen into your family room while maximizing island seating and pantry storage.",
    scopeChecklist: [
      "Custom-built solid-wood & furniture-grade plywood cabinets with soft-close hardware",
      "Templated quartz, granite & natural stone countertops with undermount sinks",
      "Load-bearing wall openings, center islands, tile backsplashes & pot-filler plumbing",
      "Recessed LED ceiling grids, pendant wiring, under-cabinet lighting & LVP/hardwood floors",
    ],
    bentoVariant: "kitchen_bath",
    relatedLinks: [
      { href: "/whole-house-remodeling/", label: "Open-Concept & Whole House Remodeling" },
      { href: "/tile-service/", label: "Kitchen Backsplash & Tile" },
      { href: "/electrical/", label: "Recessed LED & Appliance Wiring" },
      { href: "/bathroom-remodeling/", label: "Bathroom Remodeling" },
    ],
    faqs: [
      { q: "Can my family stay in our home during a kitchen remodel?", a: "Yes. Most homeowners remain at home throughout the project. We isolate the work zone with zip-wall dust barriers, protect adjacent floors, and coordinate plumbing and electrical rough-ins efficiently so downtime without a sink or range is minimized." },
      { q: "Do you build custom cabinets or install pre-fabricated cabinets?", a: "We offer both custom-fabricated solid-wood cabinetry built to exact ceiling height and wall dimensions, as well as furniture-grade semi-custom cabinetry to fit your target budget and timeline." },
      { q: "Can you remove the wall between my kitchen and living room?", a: "Yes. We evaluate ceiling and roof load paths in the attic, erect temporary shoring walls, and install properly sized LVL structural beams while rerouting any electrical, HVAC, or plumbing lines inside the wall." }
    ]
  },
  "whole-house-remodeling": {
    title: "Whole House Remodeling Jackson, MS | Born Again Remodeling",
    description:
      "Turnkey whole-house remodeling & structural renovations in Jackson, Brandon, Madison & Florence, MS. Open floor plans, framing, kitchens, baths & flooring.",
    heading: "Whole House Remodeling in Jackson & Central MS",
    subheading: "Turnkey Interior Renovations, Structural Layout Changes & Multi-Room Restorations",
    bodyText:
      "Coordinating five separate subcontractors on a multi-room renovation leads to Finger-pointing and stalled schedules. Born Again Home Remodeling & Roofing delivers turnkey whole-house remodeling across Central Mississippi—handling structural framing, subfloor leveling, insulation, electrical and plumbing updates, sheetrock, custom kitchens and baths, flooring, millwork, painting, and exterior roofing under one accountable local team.",
    localContext:
      "Whether you recently purchased an older home in Belhaven, Eastover, Madison, Brandon, or Florence that needs a head-to-toe modernization, or you are restoring a property after storm or water damage, we sequence every trade in the proper order—envelope and structure first, mechanical rough-ins second, and crisp interior finishes last.",
    scopeChecklist: [
      "Load-bearing wall removals, LVL beam headers, room reconfigurations & subfloor rebuilds",
      "Coordinated kitchen, primary bath, guest bath & laundry room renovations",
      "Whole-home LVP/hardwood flooring, 5/8\" & 1/2\" drywall, baseboards, crown molding & doors",
      "Exterior roof, soffit/fascia, window sealing & siding restoration under one contract",
    ],
    bentoVariant: "structural",
    relatedLinks: [
      { href: "/kitchen-remodeling/", label: "Kitchen Remodeling" },
      { href: "/bathroom-remodeling/", label: "Bathroom Remodeling" },
      { href: "/framing/", label: "Structural Framing & LVL Beams" },
      { href: "/flooring/", label: "Whole-Home Flooring Installation" },
    ],
    faqs: [
      { q: "Do you handle structural load-bearing wall removals during a whole-house remodel?", a: "Yes. We inspect attic joist and rafter bearing points, install temporary support walls, set engineered LVL beams on solid posts down to the slab or piers, and handle all framing, drywall, electrical, and flooring patches seamlessly." },
      { q: "Do you pull municipal permits in Hinds, Rankin, and Madison counties?", a: "Yes. When structural framing, electrical, plumbing, or roof modifications require local city or county permitting in Jackson, Brandon, Madison, Flowood, Pearl, Ridgeland, or Clinton, we coordinate code compliance and inspections." },
      { q: "How do you keep a whole-house remodel on budget?", a: "We write detailed, itemized scopes after inspecting attics, subfloors, and roofs upfront. If any hidden rot or wiring defect is uncovered during demolition, we pause, show you photos, and review exact options in writing before proceeding." }
    ]
  },
  "painting": {
    title: "Interior & Exterior House Painting Jackson, MS | Born Again",
    description:
      "5.0★ interior & exterior house painting in Jackson, Brandon, Madison & Florence, MS. Drywall repair, wood rot prep, siding, cabinets & trim: (601) 573-6178.",
    heading: "Interior & Exterior Painting in Jackson, MS",
    subheading: "Prep-First Residential Painting for Walls, Ceilings, Cabinets, Brick & Siding",
    bodyText:
      "Lasting paint work is 70% surface preparation. Our Central Mississippi painting craftsmen never spray over chalky siding, peeling fascia, or nail-popped drywall. Every job begins with thorough scraping, drywall patching, wood-rot repair, caulking with high-flex elastomeric sealants, stain-blocking primer, and two uniform coats of premium architectural paint.",
    localContext:
      "Intense Mississippi UV sunlight and Gulf humidity blister cheap exterior paint on south- and west-facing Gables, fascia boards, and porch columns across Brandon, Madison, Flowood, and Jackson. Before exterior painting begins, our carpenters replace any soft fascia, soffit, or siding boards so moisture never pushes the new finish off.",
    scopeChecklist: [
      "Interior wall, ceiling, baseboard, door & crown molding painting with crisp cut lines",
      "Exterior siding, brick limewash/masonry coatings, porch columns, shutters & fascia wraps",
      "Drywall crack repair, water-stain blocking, popcorn ceiling smoothing & texture matching",
      "Cabinetry sanding, bonding primer & durable enamel spraying for kitchen/bath updates",
    ],
    bentoVariant: "interior_finish",
    relatedLinks: [
      { href: "/sheetrock/", label: "Sheetrock & Drywall Repair" },
      { href: "/trim/", label: "Fascia, Trim & Crown Molding" },
      { href: "/residential-roofing/soffit-and-fascia-repair/", label: "Soffit & Fascia Wood Repair" },
      { href: "/whole-house-remodeling/", label: "Whole House Remodeling" },
    ],
    faqs: [
      { q: "How many coats of paint do you apply on interior and exterior jobs?", a: "We apply dedicated bonding or stain-blocking primer over bare wood, patched drywall, and color transitions, followed by two full coats of top-shelf paint (such as Sherwin-Williams or Benjamin Moore lines) for rich, washable coverage." },
      { q: "Can you replace rotted wood siding or fascia boards before painting my house?", a: "Yes—unlike paint-only crews who paint over soft wood, our carpenters replace rotted fascia, soffit, corner boards, dormers, and porch posts before priming and painting." }
    ]
  },
  "plumbing": {
    title: "Remodel Plumbing & Fixture Installation Jackson, MS | Born Again",
    description:
      "Code-compliant remodel plumbing rough-ins, shower valves, tub conversions, vanities & kitchen sink lines across Jackson, Brandon, Madison & Florence, MS.",
    heading: "Remodel Plumbing & Fixture Installation in Jackson, MS",
    subheading: "Shower Valves, Drain Relocations, Tub-to-Shower Rough-Ins & Kitchen Hookups",
    bodyText:
      "Every successful kitchen, bathroom, or laundry room renovation depends on leak-free supply and drain plumbing hidden inside the walls and slab. Integrated directly into our Central Mississippi remodeling workflow, we handle PEX and copper supply line routing, PVC drain and vent relocations, pressure-balanced and thermostatic shower valves, freestanding tub drains, vanity hookups, and kitchen island sink installations.",
    localContext:
      "When remodeling slab-on-grade homes in Brandon, Madison, Flowood, and Pearl or raised crawlspace homes in Jackson, Clinton, and Florence, moving a shower drain, freestanding tub, or kitchen island sink requires precise slab trenching, proper 1/4-inch-per-foot drain pitch, concrete patch sealing, and pressure testing before tile or cabinetry is installed.",
    scopeChecklist: [
      "Custom walk-in shower rough-in valves, handheld diverters & linear/center shower drains",
      "Slab & crawlspace drain relocations for tub-to-shower conversions and kitchen islands",
      " Bathroom vanity faucets, comfort-height toilets, shut-off valves & supply braided lines",
      "Undermount kitchen sinks, garbage disposals, ice-maker lines & dishwasher connections",
    ],
    bentoVariant: "plumbing",
    relatedLinks: [
      { href: "/bathroom-remodeling/", label: "Bathroom Remodeling" },
      { href: "/kitchen-remodeling/", label: "Kitchen Remodeling" },
      { href: "/tile-service/", label: "Waterproof Tile Showers" },
      { href: "/whole-house-remodeling/", label: "Whole House Remodeling" },
    ],
    faqs: [
      { q: "Do you handle slab drain relocations when converting a tub to a walk-in shower?", a: "Yes. Most older tubs use a 1.5-inch drain near the wall, whereas walk-in tile showers require a 2-inch trapped drain properly centered in the shower pan. We saw-cut the slab cleanly, install code-compliant 2-inch PVC plumbing, pressure-test, and re-pour concrete before waterproofing." },
      { q: "Are newly installed plumbing lines pressure-tested before walls are closed?", a: "Yes. Every new supply connection, shower valve body, and drain assembly is water-tested under full pressure and inspected for dry joints before cement board, sheetrock, or cabinetry goes in." },
      { q: "Can you replace water-damaged subfloors around leaking toilets or tubs at the same time?", a: "Yes. Because we are full-scope remodeling contractors, we cut out rotted subflooring, sister weakened joists, set a new flange at finished floor height, and install waterproof flooring and resetting fixtures in one seamless visit." }
    ]
  },
  "electrical": {
    title: "Remodel Electrical & Lighting Installation Jackson, MS | Born Again",
    description:
      "Safe remodel electrical wiring, recessed LED ceiling lighting, under-cabinet lights, GFCI outlets & fan mounts in Jackson, Brandon, Madison & Florence, MS.",
    heading: "Remodel Electrical & Lighting Services in Jackson, MS",
    subheading: "Recessed LED Layouts, Under-Cabinet Lighting, Circuit Rerouting & Fixture Upgrades",
    bodyText:
      "Modernizing a kitchen, bathroom, living room, or open-concept floor plan requires thoughtful lighting design and safe, code-compliant wiring. As part of our residential remodeling projects across Central Mississippi, we reroute switches and circuits inside removed walls, lay out recessed LED can lighting grids, wire kitchen island pendants and under-cabinet task strips, add bathroom exhaust vent fans, and install GFCI/AFCI protection.",
    localContext:
      "Older homes throughout Jackson, Clinton, Brandon, Ridgeland, and Florence often suffer from dim single-fixture living rooms, ungrounded or non-GFCI bathroom receptacles, and overloaded kitchen countertop circuits. Upgrading wiring while walls or ceilings are open during a remodel is the cleanest, most cost-effective time to modernize safety and lighting.",
    scopeChecklist: [
      "Laser-aligned 4\" & 6\" dimmable recessed LED ceiling lighting for kitchens & living rooms",
      "Safe wire, switch & junction rerouting when removing walls for open-concept layouts",
      "Kitchen island receptacles, dedicated microwave/disposal circuits & under-cabinet LEDs",
      "Bathroom GFCI outlets, lighted vanity mirrors, exhaust vent fans & porch/ceiling fan mounts",
    ],
    bentoVariant: "electrical",
    relatedLinks: [
      { href: "/kitchen-remodeling/", label: "Kitchen Remodeling" },
      { href: "/bathroom-remodeling/", label: "Bathroom Remodeling" },
      { href: "/whole-house-remodeling/", label: "Whole House Remodeling" },
      { href: "/sheetrock/", label: "Drywall & Ceiling Finishing" },
    ],
    faqs: [
      { q: "Can you reroute electrical wires and light switches when removing an interior wall?", a: "Yes. Before removing any framing studs, we trace every circuit in the wall, safely relocate switches to logical entry points, route wiring cleanly through attic or floor framing without illegal hidden splices, and patch all drywall smooth." },
      { q: "Do you install recessed LED wafer and can lights in rooms that currently have no ceiling light?", a: "Yes. We fish wiring cleanly through attic spaces or ceiling joists, install IC-rated airtight LED fixtures with smooth wall dimmers, and leave ceilings clean and paint-ready." },
      { q: "Do kitchen and bathroom remodels require GFCI outlets?", a: "Yes. Electrical code requires GFCI protection on all bathroom receptacles and kitchen countertop/island outlets near water sources. We bring every remodeled space up to current safety standards." }
    ]
  },
  "flooring": {
    title: "Flooring Installation (LVP, Hardwood & Tile) Jackson, MS | Born Again",
    description:
      "Waterproof luxury vinyl plank (LVP), engineered hardwood & porcelain tile flooring + subfloor leveling in Jackson, Brandon, Madison & Florence, MS.",
    heading: "Flooring Installation in Jackson & Central MS",
    subheading: "Waterproof Luxury Vinyl Plank (LVP), Hardwood, Tile & Subfloor Leveling",
    bodyText:
      "New flooring transforms an entire home in days—provided the concrete slab or wood subfloor underneath is flat, dry, and structurally solid. Our Central Mississippi flooring installers handle tear-out of worn carpet, cracked tile, or water-buckled planks, grind high concrete humps, pour self-leveling compound in low spots, replace rotted wood subfloors, and install commercial-wear-layer LVP, hardwood, and porcelain tile finished with tight baseboards and shoe molding.",
    localContext:
      "Yazoo clay soil movement across Hinds, Rankin, and Madison counties frequently leaves slight waves or settling cracks in concrete slabs, which will cause click-lock flooring joints to separate if installers skip slab prep. We check slab flatness with straightedges and moisture meters before laying a single plank.",
    scopeChecklist: [
      "100% waterproof rigid-core Luxury Vinyl Plank (LVP) with attached acoustic pad",
      "Engineered & solid hardwood flooring plus large-format porcelain & ceramic tile",
      "Concrete slab grinding, self-leveling compound & pier-and-beam subfloor replacement",
      "Carpet/tile demolition, door jamb undercutting, flush transitions & painted shoe molding",
    ],
    bentoVariant: "interior_finish",
    relatedLinks: [
      { href: "/tile-service/", label: "Custom Tile Flooring & Showers" },
      { href: "/trim/", label: "Baseboards, Shoe Molding & Trim" },
      { href: "/whole-house-remodeling/", label: "Whole House Remodeling" },
      { href: "/bathroom-remodeling/", label: "Bathroom Subfloor & Remodeling" },
    ],
    faqs: [
      { q: "What is the most durable flooring for Central Mississippi homes with kids, pets, and humidity?", a: "Rigid-core 20-mil+ wear-layer Luxury Vinyl Plank (LVP) and porcelain tile are the two top performers in Mississippi's humid climate—both resist pet scratches, mud, and kitchen/bath spills without cupping or swelling." },
      { q: "Do you level uneven concrete slabs or repair soft wood subfloors before laying new floors?", a: "Yes. Subfloor preparation is the most important step in flooring installation. We grind high slab ridges, float low spots with self-leveling underlayment, or replace rotted plywood on crawlspace homes so your new floor feels solid underfoot." }
    ]
  },
  "tile-service": {
    title: "Custom Tile Showers, Backsplashes & Floors Jackson, MS | Born Again",
    description:
      "Waterproof custom tile walk-in showers, kitchen backsplashes & porcelain floor tile installed in Jackson, Brandon, Madison, Canton & Florence, MS.",
    heading: "Custom Tile & Shower Installation in Jackson, MS",
    subheading: "Waterproof Walk-In Showers, Kitchen Backsplashes & Porcelain Floor Tile",
    bodyText:
      "Precision tile work requires dead-flat substrates, 100% waterproof shower membranes, laser-aligned grout lines, and stain-resistant grouts. Our tile setters build custom walk-in tiled showers with recessed shampoo niches and corner benches, intricate herringbone and subway kitchen backsplashes, fireplace surrounds, and large-format porcelain floors across Central Mississippi.",
    localContext:
      "Tile and grout alone are not waterproof—setting shower tile directly over green drywall is the #1 cause of rotted bathroom walls we tear out across Jackson, Brandon, and Madison. Every Born Again shower enclosure is built over cement backer board and continuous waterproof membrane systems before any thinset touches the wall.",
    scopeChecklist: [
      "Custom tiled shower walls, curbless/low-curb pans, built-in benches & recessed niches",
      "Kitchen subway, zellige, mosaic & natural stone slab-to-cabinet backsplashes",
      "Large-format porcelain floor tile laid over uncoupling/crack-isolation membranes",
      "Mold-resistant high-performance grout & silicone movement joints at all corners",
    ],
    bentoVariant: "kitchen_bath",
    relatedLinks: [
      { href: "/bathroom-remodeling/", label: "Full Bathroom Remodeling" },
      { href: "/kitchen-remodeling/", label: "Kitchen Remodeling" },
      { href: "/flooring/", label: "Flooring Installation" },
      { href: "/plumbing/", label: "Shower Valve & Drain Plumbing" },
    ],
    faqs: [
      { q: "How do you waterproof a custom tiled walk-in shower so it never leaks?", a: "We never install shower tile over bare drywall. We frame solid backing, install cement board or foam waterproof panels, seal every seam, screw penetration, niche, and pan corner with continuous waterproofing membrane, and flood-test the pan." },
      { q: "Do you install large-format 12x24 and 24x48 porcelain tiles without lippage?", a: "Yes. We prep substrates flat, back-butter large-format tiles with medium-bed polymer-modified mortar, and use mechanical lippage-leveling clips for flush, even transitions." }
    ]
  },
  "sheetrock": {
    title: "Sheetrock & Ceiling Drywall Repair Jackson, MS | Born Again",
    description:
      "Expert sheetrock hanging, roof-leak ceiling drywall repair, taping, mudding & texture matching across Jackson, Brandon, Madison & Florence, MS: (601) 573-6178.",
    heading: "Sheetrock & Drywall Repair in Jackson, MS",
    subheading: "Ceiling Water-Damage Restoration, New Room Hanging, Taping & Seamless Texture Match",
    bodyText:
      "Whether a roof or plumbing leak stained and sagged your living room ceiling, foundation settling cracked hallway corners, or a newly framed remodel needs complete drywall hanging, our finishers deliver glass-smooth walls and ceilings. Because Born Again handles both roofing and interior remodeling, we can stop the exterior roof leak AND restore your interior insulation, sheetrock, texture, and paint in one coordinated call.",
    localContext:
      "Across Central Mississippi homes with popcorn, knockdown, orange-peel, or smooth slick-finish ceilings, bad patches stand out immediately under natural window light. We feather joints wide with multiple coats of compound, vacuum-sand with dust control, match existing ceiling textures, and prime/paint ceiling-to-corner.",
    scopeChecklist: [
      "Water-damaged ceiling & wall drywall cutout, wet insulation replacement & stain priming",
      "5/8\" sag-resistant ceiling board & 1/2\" wall sheetrock hanging for remodels & additions",
      "Three-coat taping, mudding, skim coating, popcorn removal & custom texture matching",
      "Yazoo-clay settling crack repairs around door headers, windows & vaulted ceiling peaks",
    ],
    bentoVariant: "interior_finish",
    relatedLinks: [
      { href: "/painting/", label: "Interior & Ceiling Painting" },
      { href: "/residential-roofing/roof-repair/", label: "Stop the Source: Roof Leak Repair" },
      { href: "/insulation/", label: "Attic Insulation Replacement" },
      { href: "/whole-house-remodeling/", label: "Whole House Remodeling" },
    ],
    faqs: [
      { q: "Can you fix both the roof leak outside and the water-damaged ceiling drywall inside?", a: "Yes! Most roofers leave you with a hole in your ceiling, and most drywallers cannot fix the leaking roof flashing above it. Born Again repairs the roof leak first, verifies it is 100% dry, replaces wet attic insulation, and hangs, finishes, and paints the ceiling seamlessly." },
      { q: "What thickness of sheetrock do you install on ceilings?", a: "We install 5/8-inch drywall on ceilings to prevent board sag between 16-inch or 24-inch ceiling joists in humid Mississippi conditions, and 1/2-inch drywall (or moisture-resistant board in baths) on walls." }
    ]
  },
  "insulation": {
    title: "Attic Insulation Installation Jackson, MS | Born Again",
    description:
      "Cut summer AC bills with R-38 to R-60 blown-in cellulose, fiberglass batt & attic baffle insulation in Jackson, Brandon, Madison & Florence, MS.",
    heading: "Attic & Crawlspace Insulation in Jackson, MS",
    subheading: "High-R Blown-In & Batt Insulation Paired With Proper Roof Soffit Airflow",
    bodyText:
      "During July and August in Central Mississippi, unshaded attic spaces routinely exceed 135°F—radiating heat straight through under-insulated bedroom ceilings and forcing HVAC units to run nonstop. Because our team understands both roof ventilation and interior thermal envelopes, we install blown-in cellulose and fiberglass batt insulation to R-38–R-60 while keeping soffit vent baffles clear so your roof deck breathes properly.",
    localContext:
      "Many older homes in Jackson, Brandon, Pearl, Clinton, and Florence have settled down to just 3–5 inches of compressed attic insulation (under R-13), or suffered wet, matted insulation from past roof or ductwork condensation. Upgrading attic insulation during a roof replacement or remodel delivers one of the fastest utility-bill paybacks available.",
    scopeChecklist: [
      "Blown-in cellulose & fiberglass attic cap-offs brought up to ENERGY STAR R-38–R-49+ depth",
      "Rafter soffit vent baffles installed so blown insulation never chokes eave intake airflow",
      "Removal & replacement of water-damaged or rodent-soiled attic insulation after roof leaks",
      "Exterior wall & floor joist fiberglass batt insulation during whole-house remodels",
    ],
    bentoVariant: "structural",
    relatedLinks: [
      { href: "/residential-roofing/roof-inspections/", label: "Roof & Attic Ventilation Inspections" },
      { href: "/residential-roofing/soffit-and-fascia-repair/", label: "Soffit Vent & Fascia Repair" },
      { href: "/sheetrock/", label: "Ceiling Drywall Restoration" },
      { href: "/whole-house-remodeling/", label: "Whole House Remodeling" },
    ],
    faqs: [
      { q: "What R-value of attic insulation do Central Mississippi homes need?", a: "For Climate Zone 3 (Jackson, Brandon, Madison, and Central MS), building science guidelines recommend R-38 to R-49 (roughly 13 to 16+ inches of blown-in insulation) across attic floors, paired with air-sealed ceiling penetrations." },
      { q: "Will adding attic insulation block my roof's soffit vents?", a: "Not when installed by roofing pros. Before blowing insulation near the eaves, we staple rigid airflow baffles between rafters so cool intake air flows freely from your soffit vents up to your ridge vents—protecting your shingles from premature heat baking." }
    ]
  },
  "framing": {
    title: "Structural Framing, Rafters & LVL Beams Jackson, MS | Born Again",
    description:
      "Load-bearing wall LVL beams, roof rafter & decking repair, porch columns & room framing in Jackson, Brandon, Madison & Florence, MS: (601) 573-6178.",
    heading: "Structural Framing & Carpentry in Jackson, MS",
    subheading: "LVL Header Beams, Rotted Rafter & Subfloor Restoration, Porch Posts & Wall Framing",
    bodyText:
      "Solid carpentry is the backbone of safe roofing and lasting remodeling. Our experienced framers install engineered laminated veneer lumber (LVL) beams for open-concept living areas, sister or rebuild storm-cracked roof rafters and sagging ridge framing, replace rotted roof decking and floor joists, reset structural front-porch columns, and frame interior layout modifications.",
    localContext:
      "From tree-impacted roof trusses in Clinton and Byram to porch-post wood rot in Madison and open-concept kitchen wall removals in Brandon and Jackson, structural carpentry requires proper load-path shoring, hurricane-tie hardware, and straight, plumb stud walls so tile, cabinets, and roofs sit dead true.",
    scopeChecklist: [
      "Engineered LVL header beams & load-bearing wall openings for open floor plans",
      "Storm-damaged roof rafter, truss, collar-tie & OSB/plywood roof decking replacement",
      "Structural 4x4 / 6x6 treated & cedar porch column replacements with rot-proof bases",
      "Subfloor joist sistering, sill-plate rot repair & custom interior room/closet framing",
    ],
    bentoVariant: "structural",
    relatedLinks: [
      { href: "/whole-house-remodeling/", label: "Whole House Remodeling" },
      { href: "/storm-damage-roof-repair/", label: "Tree & Storm Roof Repair" },
      { href: "/trim/", label: "Exterior Trim, Columns & Millwork" },
      { href: "/sheetrock/", label: "Sheetrock & Finishing" },
    ],
    faqs: [
      { q: "Can you repair rotted or tree-damaged roof rafters during a roof replacement?", a: "Yes. Unlike shingle-only crews that nail over wavy, rotted wood, our framing carpenters sister weakened rafters, rebuild damaged eaves and fascia tails, and install solid structural decking before underlayment and shingles go down." },
      { q: "Do you replace rotted front porch columns on two-story and ranch homes?", a: "Yes. We safely jack and support the porch header beam, remove rotted wood columns, install treated structural posts on moisture-isolated bases, and finish them in cedar, composite PVC, or painted trim wraps." }
    ]
  },
  "trim": {
    title: "Exterior Fascia Trim, Columns & Crown Molding Jackson, MS | Born Again",
    description:
      "Exterior fascia & dormer trim, porch column wraps, Hardie siding repairs, baseboards & crown molding in Jackson, Brandon, Madison & Florence, MS.",
    heading: "Exterior Fascia Trim & Interior Millwork in Jackson, MS",
    subheading: "Rot-Resistant Fascia, Dormer Siding, Porch Column Wraps, Baseboards & Crown Molding",
    bodyText:
      "Crisp trim work protects your roofline from water intrusion outside and gives remodeled rooms architectural polish inside. Outdoors, our finish carpenters replace rotted wood fascia, rake boards, dormer siding, and porch columns using fiber-cement (Hardie), cellular PVC, or primed treated millwork. Indoors, we cut tight coped crown molding, tall baseboards, window/door casings, and decorative board-and-batten accent walls.",
    localContext:
      "High dormer walls, chimney chases, and roof-to-wall intersections are among the fastest-rotting spots on Central Mississippi homes when original builder pine absorbs splashback rain. Upgrading vulnerable exterior trim to fiber-cement or PVC during a roof or paint project ends the rot cycle permanently.",
    scopeChecklist: [
      "Exterior roof fascia, rake boards, gable siding & chimney chase rebuilds (Hardie & PVC)",
      "Structural porch post wraps, beadboard porch ceilings & rot-proof door brickmould",
      "Interior crown molding, tall 5.25\"–7.25\" baseboards, shoe molding & door/window casings",
      "Custom board-and-batten walls, fireplace mantels & interior solid-core door hanging",
    ],
    bentoVariant: "interior_finish",
    relatedLinks: [
      { href: "/residential-roofing/soffit-and-fascia-repair/", label: "Roof Soffit & Fascia Repair" },
      { href: "/painting/", label: "Interior & Exterior Painting" },
      { href: "/flooring/", label: "Flooring & Shoe Molding" },
      { href: "/framing/", label: "Porch Columns & Structural Carpentry" },
    ],
    faqs: [
      { q: "What materials hold up best against wood rot on Mississippi fascia and dormer trim?", a: "James Hardie fiber-cement trim/siding and cellular PVC trim boards are completely impervious to water rot and termites, holding paint far longer than finger-jointed pine in humid Gulf weather." },
      { q: "Do you repair leaking chimney siding and flashing together?", a: "Yes—chimney chases in Jackson, Brandon, and Madison very often leak where rotted siding meets rusted step flashing. Our roofers and carpenters rebuild the wood chase, install new metal step/counter flashing, hang fiber-cement siding, and paint it to match." }
    ]
  },
  "skylight-repair-and-replacement": {
    title: "Skylight Leak Repair & Replacement Jackson, MS | Born Again",
    description:
      "Stop skylight roof leaks permanently! Curb-mounted skylight replacement, step-flashing kits & interior drywall repair in Jackson, Brandon, Flowood & Madison, MS.",
    heading: "Skylight Leak Repair & Replacement in Jackson, MS",
    subheading: "Custom Step-Flashed Skylight Curbs, Low-E Glazing & Leak-Free Roof Integration",
    bodyText:
      "Skylights rarely leak through the glass itself—almost every skylight leak comes from cracked perimeter mastics, missing step flashing, condensation channels, or decayed rubber dome gaskets. Never let a handyman smear roofing tar around a leaking skylight; tar cracks within one Mississippi summer. Our roofers strip back surrounding shingles, install ice-and-water barrier up the curb walls, weave step-by-step metal flashing kits, or replace aged acrylic domes with modern Low-E tempered glass skylights.",
    localContext:
      "Many 1980s and 1990s homes in Flowood, Northeast Jackson, Ridgeland, Brandon, and Madison still have original plastic bubble skylights that have yellowed, hailed-cracked, or lost seal integrity. Replacing skylights simultaneously with a roof replacement saves labor because the surrounding shingles and flashing are already open.",
    scopeChecklist: [
      "Full curb-mounted & deck-mounted Low-E insulated glass skylight replacements",
      "Ice-and-water shield curb wrapping + engineered step, head & sill metal flashing",
      "Emergency skylight leak diagnostics, hail-cracked dome replacement & shingle tie-ins",
      "Interior skylight light-well sheetrock, trim & paint restoration after water stains",
    ],
    bentoVariant: "structural",
    relatedLinks: [
      { href: "/storm-damage-roof-repair/roof-patches-and-leak-repair/", label: "Roof Leak Tracking & Patching" },
      { href: "/residential-roofing/roof-installation/", label: "Replace Skylights During New Roof" },
      { href: "/sheetrock/", label: "Interior Skylight Well Drywall Repair" },
      { href: "/storm-damage-roof-repair/hail-damage-roof-repair/", label: "Hail Damage Inspections" },
    ],
    faqs: [
      { q: "Why should I replace an older skylight during a roof replacement?", a: "Re-flashing a 20-year-old skylight onto a brand-new 30-to-50-year roof leaves the oldest seal on the roof in place; if the skylight fails three years later, new shingles must be torn back up. Installing a new factory-flashed Low-E skylight during tear-off synchronizes both lifespans and cuts heat gain." },
      { q: "Can you repair water-stained drywall inside my skylight shaft too?", a: "Yes. Once our roofing crew seals or replaces the exterior skylight and flashing, our interior drywall and paint finishers repair, re-tape, and repaint the interior light well so no stain remains." }
    ]
  },
  "synthetic-shingles": {
    title: "Class 4 Synthetic Shingle Roofing Jackson, MS | Born Again",
    description:
      "UL 2218 Class 4 hail-rated synthetic composite shingle roof installation in Jackson, Madison, Ridgeland & Brandon, MS. Free estimate: (601) 573-6178.",
    heading: "Synthetic Composite Shingle Roofing in Jackson, MS",
    subheading: "UL 2218 Class 4 Hail Resistance & Dimensional Architectural Profiles",
    bodyText:
      "Engineered polymer composite shingles combine virgin resins, UV inhibitors, and impact modifiers to replicate heavy architectural slate or hand-split shake profiles with superior storm toughness. Carrying UL 2218 Class 4 impact ratings and 110–130 mph wind uplift resistance, synthetic shingles resist granule shedding, algae streaking, thermal cracking, and hailstone bruising across decades of Mississippi weather.",
    localContext:
      "For custom homes in Madison, Ridgeland, Reunion, Eastover, Flowood, and Brandon Reserve where HOA aesthetics and severe spring hail protection both matter, Class 4 synthetic roofing offers 50-year+ curb appeal and may qualify for impact-resistant homeowner insurance premium discounts depending on your carrier.",
    scopeChecklist: [
      "UL 2218 Class 4 hail-impact & Class A fire-rated composite roofing profiles",
      "Full synthetic underlayment, ice/water valley membranes & heavy-gauge metal valleys",
      "Zero granule loss, algae streaking, curling, or wood-rot maintenance",
      "Custom hip, ridge, chimney cricket & dormer copper or pre-finished steel flashing",
    ],
    bentoVariant: "synthetic",
    relatedLinks: [
      { href: "/synthetic-slate-roof-installation/", label: "Synthetic Slate Roof Installation" },
      { href: "/synthetic-wood-roofing/", label: "Synthetic Cedar Shake Roofing" },
      { href: "/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation/", label: "Standing Seam Metal Roofs" },
      { href: "/residential-roofing/roof-installation/", label: "GAF Architectural Shingle Roofs" },
    ],
    faqs: [
      { q: "How long does a Class 4 synthetic shingle roof last in Mississippi?", a: "Premium synthetic composite roofs are engineered for a 50-year+ service life because they contain no asphalt oils to dry out under Mississippi summer UV and no loose surface granules to wash into gutters." },
      { q: "Can a Class 4 impact-rated synthetic roof lower my homeowner's insurance?", a: "Many Mississippi insurance carriers offer premium credits for documented UL 2218 Class 4 impact-resistant roof installations; check with your insurance agent and we will supply product specification sheets for your policy file." }
    ]
  },
  "synthetic-slate-roof-installation": {
    title: "Synthetic Slate Roof Installation Jackson, MS | Born Again",
    description:
      "Lightweight Class 4 hail-resistant synthetic slate roof installation for homes in Madison, Ridgeland, Jackson & Brandon, MS. Free estimate: (601) 573-6178.",
    heading: "Synthetic Slate Roof Installation in Jackson & Madison, MS",
    subheading: "Authentic Chiseled Estate Slate Aesthetics at a Fraction of Quarried Stone Weight",
    bodyText:
      "Quarried stone slate weighs 800 to 1,500 pounds per roofing square—requiring expensive structural rafter engineering—and cracks easily under large hail or foot traffic. Synthetic polymer slate replicates the authentic hand-chiseled edges and multi-width color blends of natural slate at roughly one-quarter the weight, installing cleanly onto standard residential roof framing with UL 2218 Class 4 hail protection.",
    localContext:
      "On traditional brick, Tudor, French country, and historic homes across Madison, Ridgeland, Eastover, Belhaven, and Brandon, synthetic slate delivers timeless architectural prestige that stands up to Central Mississippi hailstorms, 110+ mph straight-line winds, and humid summer algae without ever delaminating or cracking.",
    scopeChecklist: [
      "Authentic chiseled-edge multi-width slate profiles with zero structural truss reinforcement needed",
      "UL 2218 Class 4 hail impact resistance—won't shatter under hail or maintenance foot traffic",
      "UV-stabilized through-body color blends in charcoal, weathered gray, castle gray & slate black",
      "Custom-fabricated copper or Kynar-coated steel valleys, chimney counter-flashing & drip edge",
    ],
    bentoVariant: "synthetic",
    relatedLinks: [
      { href: "/synthetic-shingles/", label: "Class 4 Synthetic Shingles" },
      { href: "/synthetic-tile-roofing/", label: "Synthetic Spanish & Clay Tile" },
      { href: "/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation/", label: "Standing Seam Metal Accents" },
      { href: "/areas-we-service/madison-ms/", label: "Roofing in Madison, MS" },
    ],
    faqs: [
      { q: "Does my home need extra structural framing to support a synthetic slate roof?", a: "No. Synthetic composite slate weighs roughly 4 to 5 times less than natural quarried slate—similar in weight to heavy architectural asphalt shingles—so standard code-built residential trusses and rafters support it without structural retrofits." },
      { q: "How does synthetic slate perform in Central Mississippi hail and high winds?", a: "Unlike brittle real slate tiles that fracture when struck by 1.5-inch hail, composite slate flexes on impact to achieve a UL 2218 Class 4 hail rating and uses reinforced nail zones rated for 110+ mph winds." },
      { q: "Will dark synthetic slate fade under Mississippi summer sun?", a: "Quality synthetic slate is molded with UV inhibitors throughout the entire polymer body rather than painted on top, preventing patchy fading, chalking, or dark algae streaks." }
    ]
  },
  "synthetic-tile-roofing": {
    title: "Synthetic Clay & Spanish Tile Roofing Jackson, MS | Born Again",
    description:
      "Lightweight Class 4 hail-rated synthetic Spanish & barrel tile roofing in Jackson, Madison, Ridgeland & Brandon, MS. Free estimate: (601) 573-6178.",
    heading: "Synthetic Spanish & Clay Tile Roofing in Jackson, MS",
    subheading: "Mediterranean Barrel Tile Curb Appeal Engineered Against Hail & Foot-Traffic Cracks",
    bodyText:
      "Traditional terra-cotta and concrete barrel tiles crack easily during hailstorms, absorb moisture, and overload standard roof framing. Synthetic composite Spanish and Mediterranean tile roofing captures the exact high-barrel shadow lines and warm terracotta or stone blends of clay tile in a lightweight, UL 2218 Class 4 impact-resistant polymer system.",
    localContext:
      "Natural air channels beneath curved barrel tiles create above-sheathing ventilation that sheds radiant solar heat before it enters your attic—helping stucco, brick, and lakefront properties around the Ross Barnett Reservoir in Ridgeland, Brandon, Flowood, and Madison stay cooler all summer.",
    scopeChecklist: [
      "High-barrel Spanish & flat Mediterranean composite tile profiles",
      "Class 4 hail impact durability—walkable for chimney/gutter maintenance without cracking",
      "Natural under-tile airflow gap reduces attic radiant heat transfer",
      "High-temp peel-and-stick underlayment & custom bird-stop eave closures",
    ],
    bentoVariant: "synthetic",
    relatedLinks: [
      { href: "/synthetic-slate-roof-installation/", label: "Synthetic Slate Roofing" },
      { href: "/synthetic-shingles/", label: "Synthetic Composite Shingles" },
      { href: "/storm-damage-roof-repair/hail-damage-roof-repair/", label: "Hail Damage Roof Repair" },
      { href: "/residential-roofing/roof-installation/", label: "Full Roof Replacement" },
    ],
    faqs: [
      { q: "Can synthetic Spanish tile crack during a Mississippi hailstorm?", a: "Unlike brittle clay or concrete tile that shatters under hailstones, synthetic polymer barrel tiles carry a UL 2218 Class 4 impact rating and flex without breaking." },
      { q: "Does synthetic tile help lower summer attic temperatures?", a: "Yes. The raised barrel profile creates a natural ventilating air cushion between the tile and roof deck that dissipates solar heat before it conducts into the attic." }
    ]
  },
  "synthetic-wood-roofing": {
    title: "Synthetic Cedar Shake Roofing Jackson, MS | Born Again",
    description:
      "Rot-proof, Class A fire-rated & Class 4 hail-resistant synthetic cedar shake roofing in Jackson, Ridgeland, Madison & Brandon, MS: (601) 573-6178.",
    heading: "Synthetic Cedar Shake Roofing in Jackson, MS",
    subheading: "Authentic Hand-Split Cedar Texture Without Wood Rot, Termites, Moss or Fire Risk",
    bodyText:
      "Real wood cedar shakes struggle in Mississippi's warm, humid climate—absorbing rain, growing moss and mildew, attracting carpenter bees, curling in the sun, and requiring recurring chemical treatments. Synthetic cedar shake roofing is molded directly from real hand-split cedar timbers to capture deep wood grain and staggered shadow lines while providing Class A fire resistance, UL 2218 Class 4 hail durability, and zero rot forever.",
    localContext:
      "We have inspected cedar shake roofs right here in Pearl, Madison, Ridgeland, and Jackson where humidity and storm branches split natural wood shakes prematurely. Upgrading to composite shake preserves your home's warm rustic architecture without ongoing maintenance or insurer fire-rating surcharges.",
    scopeChecklist: [
      "Deep-grain multi-width hand-split cedar shake profiles in weathered & natural wood tones",
      "Class A fire rating & UL 2218 Class 4 hail impact resistance",
      "100% impervious to Mississippi humidity rot, moss, mold, curling & insects",
      "Zero staining, oiling, or chemical preservative treatments required",
    ],
    bentoVariant: "synthetic",
    relatedLinks: [
      { href: "/synthetic-slate-roof-installation/", label: "Synthetic Slate Roofing" },
      { href: "/synthetic-shingles/", label: "Synthetic Shingles" },
      { href: "/residential-roofing/roof-installation/", label: "GAF Architectural Shingle Replacement" },
      { href: "/residential-roofing/roof-inspections/", label: "Free Roof Inspections" },
    ],
    faqs: [
      { q: "Does synthetic cedar shake require periodic staining, sealing, or moss cleaning?", a: "No. Unlike natural cedar shakes that cup, split, and rot in humid Southern climates without regular chemical maintenance, polymer composite shakes never absorb water and require zero sealing or staining." },
      { q: "Are synthetic cedar shakes safer for homeowner insurance than real wood shakes?", a: "Yes. Many insurers surcharge or restrict real wood shake roofs due to fire and hail vulnerability, whereas premium synthetic shakes offer Class A fire ratings and Class 4 impact ratings." }
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(services).map((service) => ({ service }));
}

interface PageProps {
  params: Promise<{ service: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service } = await params;
  const page = services[service];
  if (!page) return {};
  
  return {
    title: page.title.includes("|") ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: {
      canonical: `/${service}/`
    }
  };
}

const serviceToPinMapping: Record<string, string[]> = {
  "bathroom-remodeling": ["Bathroom Remodeling", "Custom shower", "Shower inspection"],
  "kitchen-remodeling": ["Kitchen Remodeling", "Custom cabinets", "New cabinets", "Granite"],
  "whole-house-remodeling": ["Whole House Remodeling", "General Remodeling", "Flooring"],
  "painting": ["Interior & Exterior Painting", "Painting", "Exterior paint"],
  "plumbing": ["Plumbing", "Bathroom Remodeling", "Custom shower"],
  "electrical": ["General Remodeling", "Kitchen Remodeling"],
  "flooring": ["Flooring", "Luxury vinyl flooring", "Subfloor"],
  "tile-service": ["Tile", "Custom shower", "Bathroom Remodeling"],
  "sheetrock": ["Interior paint and patch", "General Remodeling"],
  "insulation": ["Insulation", "Roof and Attic Inspection", "Residential Roofing"],
  "framing": ["Frame walls", "Subfloor", "Exterior wood repair", "General Remodeling"],
  "trim": ["Trim", "Soffit & Fascia", "Replace siding", "Exterior wood repair"],
  "skylight-repair-and-replacement": ["skylight", "Roof Repair", "Roof Inspection"],
  "synthetic-shingles": ["Residential Roofing", "Roof Replacement"],
  "synthetic-slate-roof-installation": ["Residential Roofing", "Roof Replacement"],
  "synthetic-tile-roofing": ["Clay tile", "Residential Roofing", "Roof Replacement"],
  "synthetic-wood-roofing": ["Roof Inspection", "Residential Roofing", "Roof Replacement"]
};

const serviceBentoImages: Record<string, { url: string; location: string }[]> = {
  "bathroom-remodeling": [
    { url: "/images/wp_bathroom-h.jpg", location: "Jackson, MS" },
    { url: "/images/wp_bathroom-vanity.png", location: "Canton, MS" }
  ],
  "kitchen-remodeling": [
    { url: "/images/wp_kitchen-remodel-a-1024x1024-1.jpg", location: "Jackson, MS" },
    { url: "/images/wp_kitchen-remodel-f-1024x1024-1.jpg", location: "Brandon, MS" }
  ],
  "whole-house-remodeling": [
    { url: "/images/wp_485382474_1402210311014300_5390508438186907525_n.jpg", location: "Jackson, MS" },
    { url: "/images/wp_kitchen-remodel-g-1024x1024-1.jpg", location: "Madison, MS" }
  ],
  "painting": [
    { url: "/images/wp_kitchen-remodel-g.jpg", location: "Jackson, MS" },
    { url: "/images/wp_kitchen-remodel-f-1024x1024-1.jpg", location: "Pearl, MS" }
  ],
  "tile-service": [
    { url: "/images/wp_bathroom-h.jpg", location: "Jackson, MS" },
    { url: "/images/wp_kitchen-remodel-a-1024x1024-1.jpg", location: "Canton, MS" }
  ],
  "flooring": [
    { url: "/images/wp_kitchen-remodel-g-1024x1024-1.jpg", location: "Jackson, MS" },
    { url: "/images/wp_interiorpaint-1024x1024.jpg", location: "Flowood, MS" }
  ],
  "plumbing": [
    { url: "/images/wp_plumbing-768x1024.jpg", location: "Jackson, MS" },
    { url: "/images/wp_bathroom-vanity.png", location: "Pearl, MS" }
  ],
  "electrical": [
    { url: "/images/wp_cabinets-c.jpg", location: "Madison, MS" },
    { url: "/images/wp_interiorpaint-1024x1024.jpg", location: "Florence, MS" }
  ],
  "sheetrock": [
    { url: "/images/wp_interiorpaint-1024x1024.jpg", location: "Canton, MS" },
    { url: "/images/wp_flooring-b.jpg", location: "Clinton, MS" }
  ],
  "insulation": [
    { url: "/images/wp_interiorpaint-1024x1024.jpg", location: "Brandon, MS" },
    { url: "/images/wp_kitchen-remodel-g.jpg", location: "Ridgeland, MS" }
  ],
  "framing": [
    { url: "/images/wp_interiorpaint-1024x1024.jpg", location: "Jackson, MS" },
    { url: "/images/wp_soffts-fascia-home-repair-1.png", location: "Byram, MS" }
  ],
  "trim": [
    { url: "/images/wp_cabinets-d.jpg", location: "Jackson, MS" },
    { url: "/images/wp_soffts-fascia-home-repair-1.png", location: "Madison, MS" }
  ],
  "skylight-repair-and-replacement": [
    { url: "/images/wp_skylight-leak-repair-1.png", location: "Flowood, MS" },
    { url: "/images/wp_roofing-c.jpg", location: "Pearl, MS" }
  ],
  "synthetic-shingles": [
    { url: "/images/wp_synthetic-shingles-1.png", location: "Brandon, MS" },
    { url: "/images/wp_gaf.jpg", location: "Jackson, MS" }
  ],
  "synthetic-slate-roof-installation": [
    { url: "/images/wp_synthetic-slate-roofing-1.png", location: "Madison, MS" },
    { url: "/images/wp_certainteed.jpg", location: "Florence, MS" }
  ],
  "synthetic-tile-roofing": [
    { url: "/images/wp_synthetic-tile-roofing-home-1.png", location: "Pearl, MS" },
    { url: "/images/wp_roofing-f.jpg", location: "Canton, MS" }
  ],
  "synthetic-wood-roofing": [
    { url: "/images/wp_synthetic-wood-roofing-1.png", location: "Ridgeland, MS" },
    { url: "/images/wp_owens.jpg", location: "Clinton, MS" }
  ]
};

export default async function ServiceSubpage({ params }: PageProps) {
  const { service } = await params;
  const page = services[service];

  if (!page) {
    notFound();
  }

  const mappedCategories = serviceToPinMapping[service] || ["General Remodeling"];
  const overrideBentoImages = serviceBentoImages[service];

  const serviceVerses: Record<string, { ref: string; text: string }> = {
    "bathroom-remodeling": { ref: "Colossians 3:23", text: "Whatever you do, <em>work heartily</em>, as for the Lord and not for men." },
    "kitchen-remodeling": { ref: "Proverbs 24:3-4", text: "By <em>wisdom</em> a house is built, and through <em>understanding</em> it is established; through knowledge its rooms are filled with <em>rare and beautiful treasures</em>." },
    "whole-house-remodeling": { ref: "Isaiah 61:4", text: "They will <em>rebuild the ancient ruins</em> and restore the places long devastated; they will <em>renew</em> the ruined cities." },
    "painting": { ref: "Ecclesiastes 3:11", text: "He has made <em>everything beautiful</em> in its time." },
    "plumbing": { ref: "John 7:38", text: "Whoever believes in me, as Scripture has said, <em>rivers of living water</em> will flow from within them." },
    "electrical": { ref: "Matthew 5:16", text: "Let your <em>light shine</em> before others, that they may see your good deeds and <em>glorify your Father</em> in heaven." },
    "flooring": { ref: "Psalm 40:2", text: "He set my feet on <em>a rock</em> and gave me <em>a firm place to stand</em>." },
    "tile-service": { ref: "1 Corinthians 3:11", text: "For no one can lay any <em>foundation</em> other than the one already laid, which is <em>Jesus Christ</em>." },
    "sheetrock": { ref: "Nehemiah 4:6", text: "So we <em>rebuilt the wall</em> till all of it reached half its height, for the people worked with <em>all their heart</em>." },
    "insulation": { ref: "Psalm 91:1", text: "Whoever dwells in the <em>shelter of the Most High</em> will rest in the <em>shadow of the Almighty</em>." },
    "framing": { ref: "Proverbs 24:27", text: "Put your outdoor work in order and get your fields ready; after that, <em>build your house</em>." },
    "trim": { ref: "Exodus 31:4-5", text: "To make <em>artistic designs</em> for work in gold, silver and bronze, to cut and set stones, to <em>work in wood</em>, and to engage in all kinds of crafts." },
    "skylight-repair-and-replacement": { ref: "Genesis 1:3", text: "And God said, <em>Let there be light</em>, and there was light." },
    "synthetic-shingles": { ref: "Proverbs 10:25", text: "When the storm has swept by, the wicked are gone, but the <em>righteous stand firm</em> forever." },
    "synthetic-slate-roof-installation": { ref: "Matthew 7:24", text: "Everyone who hears these words of mine and puts them into practice is like <em>a wise man</em> who <em>built his house on the rock</em>." },
    "synthetic-tile-roofing": { ref: "Psalm 127:1", text: "Unless <em>the Lord builds the house</em>, the builders labor in vain." },
    "synthetic-wood-roofing": { ref: "Isaiah 44:14", text: "He cut down <em>cedars</em>... He took <em>cypress and oak</em>. He let them grow among the trees of the forest." }
  };

  const verse = serviceVerses[service];
  const isRoofingSpecialty =
    service === "skylight-repair-and-replacement" ||
    service.startsWith("synthetic-");
  const defaultFormService =
    service === "skylight-repair-and-replacement"
      ? "Roof Repair"
      : service.startsWith("synthetic-")
        ? "Roof Replacement"
        : "Home Remodeling / Additions";
  const heroCtaLabel = isRoofingSpecialty
    ? "Get Free Roof Estimate"
    : "Get Free Remodel Estimate";

  return (
    <>
      <LocalBusinessSchema
        pageTitle={page.title}
        pageDescription={page.description}
        path={`/${service}/`}
        serviceName={page.heading}
      />

      {/* Hero */}
      <section className="service-hero">
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">
            {isRoofingSpecialty ? "Specialty Roofing · Central MS" : "Home Remodeling · Central MS"}
          </span>
          <h1>{page.heading}</h1>
          <p className="hero-subtext">{page.subheading}</p>

          <RoofingHeroActions
            defaultService={defaultFormService}
            ctaLabel={heroCtaLabel}
          />

          {verse && (
            <div style={{ marginTop: "2rem", textAlign: "center", maxWidth: "520px" }}>
              <p
                style={{ fontStyle: "italic", fontSize: "0.95rem", lineHeight: "1.7", color: "rgba(255, 255, 255, 0.75)", margin: "0 0 0.5rem", fontWeight: "400" }}
                dangerouslySetInnerHTML={{ __html: `&ldquo;${verse.text}&rdquo;` }}
              />
              <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                — {verse.ref}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Trusted Material Partners */}
      <TrustedBrands />

      {/* Dynamic Local Case Studies Carousel */}
      <section className="section" style={{ padding: "4rem 0 0" }}>
        <div className="container">
          <ServicePinsCarousel services={mappedCategories} />
        </div>
      </section>

      {/* Page Content — Unique Trade-Specific Scope & Central MS Context */}
      <section className="section service-content">
        <div className="container" style={{ maxWidth: "840px" }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Scope &amp; Local Standards</span>
            <h2 style={{ fontSize: "2rem", marginBottom: "1.15rem", color: "var(--primary)", marginTop: "0.5rem" }}>
              How We Approach {page.heading.replace(/\s+in\s+Jackson.*$/i, "")}
            </h2>
            <p className="service-intro" style={{ fontSize: "1.06rem", lineHeight: "1.75", color: "var(--text-muted)", marginBottom: "1.35rem" }}>
              {page.bodyText}
            </p>
            <p className="service-body" style={{ fontSize: "1rem", lineHeight: "1.7", color: "var(--text-muted)", marginBottom: "2rem" }}>
              {page.localContext}
            </p>

            {/* Trade-Specific Scope Checklist */}
            <div className="double-bezel-wrapper" style={{ marginBottom: "2rem" }}>
              <div className="double-bezel-inner" style={{ padding: "1.85rem 2rem" }}>
                <h3 style={{ color: "#ffffff", fontSize: "1.2rem", marginBottom: "1rem" }}>
                  What&apos;s Included in Our Written Scope
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                  {page.scopeChecklist.map((item, idx) => (
                    <li key={idx} style={{ display: "flex", gap: "10px", alignItems: "flex-start", color: "var(--text-muted)", lineHeight: 1.6 }}>
                      <span style={{ color: "var(--secondary)", fontWeight: 800, flexShrink: 0 }}>✔</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contextual Related Services + Priority Central MS Cities */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem 1.35rem", alignItems: "center", fontSize: "0.95rem" }}>
              <strong style={{ color: "#ffffff" }}>Related Services:</strong>
              {page.relatedLinks.map((rel) => (
                <Link key={rel.href} href={rel.href} className="service-link">
                  {rel.label} →
                </Link>
              ))}
            </div>
            <p style={{ fontSize: "0.92rem", color: "var(--text-muted)", marginTop: "1rem", marginBottom: 0 }}>
              Serving homeowners across{" "}
              <Link href="/areas-we-service/florence-ms/" className="service-link">Florence</Link>,{" "}
              <Link href="/areas-we-service/brandon-ms/" className="service-link">Brandon</Link>,{" "}
              <Link href="/areas-we-service/jackson-ms/" className="service-link">Jackson</Link>,{" "}
              <Link href="/areas-we-service/madison-ms/" className="service-link">Madison</Link>,{" "}
              <Link href="/areas-we-service/flowood-ms/" className="service-link">Flowood</Link>,{" "}
              <Link href="/areas-we-service/pearl-ms/" className="service-link">Pearl</Link>,{" "}
              <Link href="/areas-we-service/ridgeland-ms/" className="service-link">Ridgeland</Link>, and{" "}
              <Link href="/areas-we-service/clinton-ms/" className="service-link">Clinton, MS</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Faith-Based Q&A Educational Article */}
      <ServiceArticle service={service} />

      {/* Trade-Specific Bento Grid */}
      <section className="section section-alt" style={{ borderTop: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.01)", padding: "5rem 0" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "3.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Local Craftsmanship</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "850", color: "var(--primary)", marginTop: "0.5rem" }}>
              Proven Results In Your Area
            </h2>
          </div>
          <ServiceBentoGrid
            services={mappedCategories}
            variant={page.bentoVariant}
            overrideImages={overrideBentoImages}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" style={{ borderTop: "1px solid var(--border)", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: "850px" }}>
          <div className="service-faqs">
            <div className="text-center" style={{ marginBottom: "3.5rem" }}>
              <span className="eyebrow" style={{ color: "var(--secondary)" }}>FAQ</span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: "850", color: "var(--primary)", marginTop: "0.5rem" }}>
                Common Questions &amp; Direct Answers
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {page.faqs.map((faq, index) => (
                <div key={index} className="double-bezel-wrapper">
                  <div className="double-bezel-inner" style={{ padding: "1.75rem" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--primary)", marginBottom: "0.75rem" }}>
                      {faq.q}
                    </h3>
                    <p style={{ fontSize: "0.98rem", lineHeight: "1.65", color: "var(--text-muted)", margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <ServiceCTA defaultService={defaultFormService} />
    </>
  );
}
