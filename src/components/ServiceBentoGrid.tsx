"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import pinsData from "@/data/pins.json";

export type BentoTradeVariant =
  | "shingle"
  | "metal"
  | "storm"
  | "synthetic"
  | "kitchen_bath"
  | "plumbing"
  | "electrical"
  | "interior_finish"
  | "structural";

interface ServiceBentoGridProps {
  services: string[];
  variant?: BentoTradeVariant;
  fallbackImages?: string[];
  overrideImages?: { url: string; location: string }[];
}

interface VariantCopy {
  badge1: string;
  heading1: string;
  body1: string;
  bullets1: string[];
  statLabel: string;
  statDesc: string;
  badge2: string;
  heading2: string;
  body2: string;
}

const VARIANT_COPY: Record<BentoTradeVariant, VariantCopy> = {
  shingle: {
    badge1: "GAF Certified Standards",
    heading1: "Architectural Shingle Systems",
    body1:
      "We install complete roofing systems built for Central Mississippi heat, humidity, and thunderstorm winds—never cutting corners on underlayment, starter strips, or flashing details.",
    bullets1: [
      "GAF Timberline HDZ architectural shingles & ridge caps",
      "Breathable synthetic underlayment & ice/water valley shields",
      "Heavy-duty rust-resistant drip edge & new pipe boot flashing",
    ],
    statLabel: "Central MS Roof Logs",
    statDesc: "Documented shingle repairs, inspections & full replacements across the Jackson Metro.",
    badge2: "Property Protection",
    heading2: "Magnetic Nail Sweep & Clean Yard",
    body2:
      "We protect landscaping, AC units, and walkways during tear-off, roll driveways and lawns with commercial magnets for stray nails, and haul away every scrap of debris before final walkthrough.",
  },
  metal: {
    badge1: "Concealed & Structural Metal",
    heading1: "Precision Metal Panel Craftsmanship",
    body1:
      "From architectural standing seam panels with hidden expansion clips to heavy-gauge R-panel replacements and high-solids silicone coatings, every seam and transition is engineered to shed Gulf storms.",
    bullets1: [
      "Concealed-clip standing seam panels built for thermal movement",
      "High-temp synthetic underlayment & custom hemmed valley flashing",
      "UV-reflective finishes engineered to cut Mississippi attic heat",
    ],
    statLabel: "Metal Roof Projects",
    statDesc: "Completed standing seam, metal roof repairs & silicone restorations across Central MS.",
    badge2: "Clean Jobsite Standard",
    heading2: "Protected Grounds & Metal Trim Cleanup",
    body2:
      "Metal panel shearing and trim fabrication leave sharp offcuts if crews rush. Our technicians stage panels neatly, sweep the perimeter with heavy-duty magnets, and leave your yard spotless.",
  },
  storm: {
    badge1: "24/7 Storm & Hail Response",
    heading1: "Photo-Documented Storm Restoration",
    body1:
      "After hail, straight-line winds, or fallen limbs, we secure exposed decking fast and document bruised shingles, creased tabs, and soft-metal hits with clear dated inspection photos.",
    bullets1: [
      "Emergency heavy-duty roof tarping & active leak mitigation",
      "Slope-by-slope hail bruise, granule loss & flashing inspection",
      "On-site walkthrough availability when your insurance adjuster visits",
    ],
    statLabel: "Storm & Leak Calls",
    statDesc: "Verified storm inspections, tarping & leak repairs across Hinds, Rankin & Madison counties.",
    badge2: "No High-Pressure Tactics",
    heading2: "Honest Assessments & Full Site Cleanup",
    body2:
      "Unlike out-of-state storm chasers, we live and work right here in Central Mississippi. If a targeted repair solves the leak, we tell you honestly—and every job finishes with magnetic yard cleanup.",
  },
  synthetic: {
    badge1: "Class 4 Impact Composite",
    heading1: "Lightweight Estate Slate, Shake & Tile",
    body1:
      "Engineered polymer composite roofing delivers the dimensional beauty of quarried slate, hand-split cedar shake, or Spanish tile without overloading standard residential roof trusses.",
    bullets1: [
      "UL 2218 Class 4 hail impact & high-wind interlocking profiles",
      "Class A fire resistance options & UV color-stabilized polymers",
      "Zero rot, moss, insect decay, or periodic chemical sealing",
    ],
    statLabel: "Roofing Portfolio",
    statDesc: "Specialty & residential roofing projects documented across Central Mississippi.",
    badge2: "White-Glove Execution",
    heading2: "Custom Copper/Metal Flashing & Yard Care",
    body2:
      "Specialty composite roofs demand custom valley, chimney, and dormer metalwork. Our crews stage materials carefully, protect flowerbeds and driveways, and leave your property immaculate.",
  },
  kitchen_bath: {
    badge1: "Waterproof & Solid-Wood Build",
    heading1: "Built Behind the Walls to Last",
    body1:
      "Great kitchen and bathroom remodels start beneath the finish surface—replacing soft subfloors, waterproofing shower assemblies before tile goes up, and fitting solid-plywood cabinetry plumb and level.",
    bullets1: [
      "Waterproof cement-board & membrane shower enclosures",
      "Solid-wood & plywood cabinetry, quartz/granite tops & tile backsplashes",
      "Rotted subfloor replacement & code-compliant fixture rough-ins",
    ],
    statLabel: "Remodel Projects",
    statDesc: "Documented kitchen, bath & interior renovations completed in Central MS homes.",
    badge2: "Livable Home Protocol",
    heading2: "Dust Containment & Daily Floor Protection",
    body2:
      "Remodeling happens inside your family's living space. We hang zip-wall dust barriers, lay heavy floor runners along hallways, and sweep and organize the work zone at the close of every shift.",
  },
  plumbing: {
    badge1: "Code-Compliant Rough-Ins",
    heading1: "Pressure-Tested Supply & Drain Lines",
    body1:
      "During kitchen, bath, and whole-house renovations, hidden plumbing joints have to stay dry for decades. We route PEX and copper supply lines, set shower Mixing valves, and slope PVC drains to code.",
    bullets1: [
      "Custom shower diverter valves, freestanding tubs & vanity hookups",
      "Kitchen island sink relocations, disposals & dishwasher lines",
      "Multi-point pressure & drain-flow testing before closing walls",
    ],
    statLabel: "Remodel & Trade Logs",
    statDesc: "Verified bath, kitchen & structural remodel projects across Central Mississippi.",
    badge2: "Respectful Interior Work",
    heading2: "Protected Floors & Dry Subfloor Checks",
    body2:
      "Before setting any new toilet, tub, or vanity, we inspect the surrounding subfloor for past moisture rot, protect finished flooring with drop runners, and leave every fixture clean and tested.",
  },
  electrical: {
    badge1: "Safe Remodel Wiring",
    heading1: "Clean Circuits, Recessed LEDs & Controls",
    body1:
      "Open-concept wall removals, kitchen upgrades, and room additions require safe circuit routing, properly rated junction boxes, and balanced lighting layouts built strictly to electrical code.",
    bullets1: [
      "Recessed LED ceiling grids, under-cabinet task lighting & dimmers",
      "GFCI/AFCI kitchen & bath outlets and dedicated appliance circuits",
      "Safe switch/wire rerouting during load-bearing wall removals",
    ],
    statLabel: "Interior Remodel Logs",
    statDesc: "Completed interior renovations, lighting & carpentry upgrades in Central MS.",
    badge2: "Neat Cutouts & Cleanup",
    heading2: "Minimal Drywall Disruption & Spotless Rooms",
    body2:
      "We measure laser-straight recessed can layouts, protect furniture and flooring from drywall dust, and vacuum every room thoroughly once fixtures and plates are mounted.",
  },
  interior_finish: {
    badge1: "Prep-First Finish Quality",
    heading1: "Smooth Substrates, Tight Miters & Durable Coats",
    body1:
      "Paint, drywall, flooring, tile, and trim only look as good as the surface preparation underneath. Our craftsmen level subfloors, feather sheetrock seams, caulk gaps, and prime before final finishes.",
    bullets1: [
      "Subfloor leveling, moisture checks & clean transitions for LVP/hardwood",
      "Seamless 5/8\" & 1/2\" drywall hanging, taping, mudding & texture match",
      "Tight mitered baseboards, crown molding, fascia & two-coat premium paint",
    ],
    statLabel: "Finish Trade Projects",
    statDesc: "Verified painting, flooring, drywall & trim installations across Central MS.",
    badge2: "Clean Interior Execution",
    heading2: "Masked Surfaces, Drop Cloths & Dust Control",
    body2:
      "Every window, cabinet, hardware piece, and floor edge is masked and covered before sanding or painting begins—so your home is move-in clean the moment our crew wraps up.",
  },
  structural: {
    badge1: "Structural & Envelope Integrity",
    heading1: "Engineered Framing, Rafters & Attic Protection",
    body1:
      "Whether opening a load-bearing wall with an LVL beam, sistering storm-damaged roof rafters, sealing a leaking skylight curb, or blowing R-38+ attic insulation, we build for structural longevity.",
    bullets1: [
      "Load-bearing LVL header beams, wall framing & roof rafter carpentry",
      "High-R blown-in & batt attic insulation with clear soffit baffle airflow",
      "Waterproof skylight curb flashing & exterior wood rot restoration",
    ],
    statLabel: "Structural & Roof Logs",
    statDesc: "Documented framing, insulation & exterior restoration jobs in Central MS.",
    badge2: "Turnkey Stewardship",
    heading2: "Clear Scope, Permitting & Complete Debris Removal",
    body2:
      "Structural work demands clear communication and zero surprises. We walk you through every framing or attic finding with photos, keep work areas contained, and haul away all construction debris.",
  },
};

function inferVariant(services: string[]): BentoTradeVariant {
  const joined = services.join(" ").toLowerCase();
  if (joined.includes("metal")) return "metal";
  if (joined.includes("emergency") || joined.includes("storm")) return "storm";
  if (joined.includes("bathroom") || joined.includes("kitchen") || joined.includes("cabinet")) {
    return "kitchen_bath";
  }
  if (joined.includes("paint") || joined.includes("flooring") || joined.includes("sheetrock") || joined.includes("trim")) {
    return "interior_finish";
  }
  if (joined.includes("general remodeling")) return "structural";
  return "shingle";
}

export default function ServiceBentoGrid({
  services,
  variant,
  fallbackImages = ["/images/wp_roofing-c.jpg", "/images/wp_kitchen-remodel-a-1024x1024-1.jpg"],
  overrideImages,
}: ServiceBentoGridProps) {
  const activeVariant = variant ?? inferVariant(services);
  const copy = VARIANT_COPY[activeVariant];

  const bentoData = useMemo(() => {
    const matchingPins = pinsData.filter((pin) =>
      services.some((svc) => pin.service.toLowerCase().includes(svc.toLowerCase()))
    );

    if (overrideImages && overrideImages.length >= 2) {
      return {
        img1: overrideImages[0],
        img2: overrideImages[1],
        totalJobs: matchingPins.length,
      };
    }

    const images: { url: string; location: string }[] = [];
    matchingPins.forEach((pin) => {
      if (pin.images && pin.images.length > 0) {
        pin.images.forEach((img) => {
          if (!images.some((i) => i.url === img)) {
            images.push({ url: img, location: pin.location });
          }
        });
      }
    });

    return {
      img1: images[0] || { url: fallbackImages[0], location: "Central Mississippi" },
      img2: images[1] || { url: fallbackImages[1], location: "Central Mississippi" },
      totalJobs: matchingPins.length,
    };
  }, [services, fallbackImages, overrideImages]);

  return (
    <div className="service-bento-grid scroll-reveal" style={{ marginTop: "2rem", marginBottom: "3rem" }}>
      <div className="bento-grid">
        
        {/* Cell 1: Large 8-span Card - Trade-Specific Materials & Standards */}
        <div className="double-bezel-wrapper bento-col-8">
          <div className="double-bezel-inner bento-split-card">
            <div className="bento-split-content">
              <span className="bento-badge" style={{ background: "rgba(var(--secondary-rgb), 0.1)", color: "var(--secondary)", fontSize: "0.68rem", padding: "3px 8px", borderRadius: "20px", fontWeight: 700, textTransform: "uppercase", display: "inline-block", marginBottom: "12px" }}>
                {copy.badge1}
              </span>
              <h3 style={{ fontSize: "1.3rem", margin: "0 0 10px", fontWeight: 800 }}>{copy.heading1}</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.5", margin: "0 0 15px" }}>
                {copy.body1}
              </p>
              <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                {copy.bullets1.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="bento-split-image" style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bentoData.img1.url} alt={`${copy.heading1} in ${bentoData.img1.location}`} width={800} height={600} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span className="bento-img-badge">{bentoData.img1.location}</span>
            </div>
          </div>
        </div>

        {/* Cell 2: Small 4-span Card - Faith & Integrity Promise */}
        <div className="double-bezel-wrapper bento-col-4">
          <div className="double-bezel-inner value-card-bento" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <span style={{ fontSize: "2rem", marginBottom: "12px", display: "block" }}>🛡️</span>
            <h3 style={{ fontSize: "1.25rem", margin: "0 0 8px", fontWeight: 800, color: "var(--primary)" }}>Our Faith Promise</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.55", margin: 0, flexGrow: 1 }}>
              Guided by Christian principles since 2007, we put Central Mississippi families before short-term profits—with written estimates, honest scopes, and dependable follow-through.
            </p>
            <Link href="/about-us/" style={{ fontSize: "0.8rem", color: "var(--secondary)", fontWeight: 700, textDecoration: "none", marginTop: "15px", display: "block" }}>
              Meet Our Team →
            </Link>
          </div>
        </div>

        {/* Cell 3: Small 4-span Card - Local Authority Stat */}
        <div className="double-bezel-wrapper bento-col-4">
          <div className="double-bezel-inner value-card-bento" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--secondary)", display: "block", lineHeight: 1, marginBottom: "8px" }}>
              {bentoData.totalJobs >= 10 ? `${bentoData.totalJobs}+` : "500+"}
            </span>
            <h3 style={{ fontSize: "1.1rem", margin: "0 0 6px", fontWeight: 800 }}>{copy.statLabel}</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.4", margin: 0 }}>
              {copy.statDesc}
            </p>
          </div>
        </div>

        {/* Cell 4: Large 8-span Card - Trade-Specific Jobsite Protection */}
        <div className="double-bezel-wrapper bento-col-8">
          <div className="double-bezel-inner bento-split-card" style={{ flexDirection: "row-reverse" }}>
            <div className="bento-split-content">
              <span className="bento-badge" style={{ background: "rgba(var(--secondary-rgb), 0.1)", color: "var(--secondary)", fontSize: "0.68rem", padding: "3px 8px", borderRadius: "20px", fontWeight: 700, textTransform: "uppercase", display: "inline-block", marginBottom: "12px" }}>
                {copy.badge2}
              </span>
              <h3 style={{ fontSize: "1.3rem", margin: "0 0 10px", fontWeight: 800 }}>{copy.heading2}</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.5", margin: 0 }}>
                {copy.body2}
              </p>
            </div>
            <div className="bento-split-image" style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bentoData.img2.url} alt={`${copy.heading2} in ${bentoData.img2.location}`} width={800} height={600} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span className="bento-img-badge">{bentoData.img2.location}</span>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
        }

        .bento-col-8 {
          grid-column: span 8;
        }

        .bento-col-4 {
          grid-column: span 4;
        }

        .bento-split-card {
          display: flex;
          padding: 0 !important;
          height: 100%;
          min-height: 240px;
        }

        .bento-split-content {
          width: 55%;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bento-split-image {
          width: 45%;
          height: 100%;
          min-height: 240px;
          overflow: hidden;
        }

        .bento-img-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(10, 12, 16, 0.75);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
        }

        .value-card-bento {
          padding: 1.75rem !important;
        }

        @media (max-width: 991px) {
          .bento-grid {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }
          .bento-col-8, .bento-col-4 {
            grid-column: auto !important;
          }
          .bento-split-card {
            flex-direction: column !important;
          }
          .bento-split-content, .bento-split-image {
            width: 100% !important;
          }
          .bento-split-image {
            min-height: 240px;
          }
        }
      `}</style>
    </div>
  );
}
