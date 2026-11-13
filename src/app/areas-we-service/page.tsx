import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import TrustedBrands from "@/components/TrustedBrands";
import ServiceCTA from "@/components/ServiceCTA";
import RoofingHeroActions from "@/components/RoofingHeroActions";

export const metadata: Metadata = {
  title: "Central MS Roofing & Remodeling Service Areas",
  description: "Explore all 19 Central Mississippi cities served by Born Again Home Remodeling & Roofing from our Florence, MS headquarters. Free estimates: (601) 573-6178.",
  alternates: {
    canonical: "/areas-we-service/"
  }
};

const locations = [
  { name: "Florence, MS (HQ)", slug: "florence-ms" },
  { name: "Jackson, MS", slug: "jackson-ms" },
  { name: "Brandon, MS", slug: "brandon-ms" },
  { name: "Madison, MS", slug: "madison-ms" },
  { name: "Pearl, MS", slug: "pearl-ms" },
  { name: "Flowood, MS", slug: "flowood-ms" },
  { name: "Ridgeland, MS", slug: "ridgeland-ms" },
  { name: "Clinton, MS", slug: "clinton-ms" },
  { name: "Byram, MS", slug: "byram-ms" },
  { name: "Richland, MS", slug: "richland-ms" },
  { name: "Canton, MS", slug: "canton-ms" },
  { name: "Gluckstadt, MS", slug: "gluckstadt-ms" },
  { name: "Terry, MS", slug: "terry-ms" },
  { name: "Raymond, MS", slug: "raymond-ms" },
  { name: "Crystal Springs, MS", slug: "crystal-springs-ms" },
  { name: "Hazlehurst, MS", slug: "hazlehurst-ms" },
  { name: "Utica, MS", slug: "utica-ms" },
  { name: "Vicksburg, MS", slug: "vicksburg-ms" },
  { name: "Yazoo City, MS", slug: "yazoo-city-ms" }
];

export default function AreasWeServicePage() {
  return (
    <>
      <LocalBusinessSchema
        pageTitle="Central MS Roofing & Remodeling Service Areas"
        pageDescription="Explore all 19 Central Mississippi cities served by Born Again Home Remodeling & Roofing."
        path="/areas-we-service/"
      />

      {/* Hero */}
      <section className="service-hero">
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">
            Born Again Service Area · Central Mississippi
          </span>
          <h1>Central Mississippi Areas We Service</h1>
          <p className="hero-subtext">
            Headquartered at 150 Highland Dr in Florence, MS, our GAF-certified roofing and home remodeling crews serve homeowners across Rankin, Hinds, Madison, Copiah, Warren, and Yazoo counties.
          </p>

          <RoofingHeroActions
            defaultService="Roof Replacement"
            ctaLabel="Get Free Roof Estimate"
          />

          <div style={{ marginTop: "2rem", textAlign: "center", maxWidth: "520px" }}>
            <p
              style={{ fontStyle: "italic", fontSize: "0.95rem", lineHeight: "1.7", color: "rgba(255, 255, 255, 0.75)", margin: "0 0 0.5rem", fontWeight: "400" }}
              dangerouslySetInnerHTML={{ __html: `&ldquo;The earth is the Lord&rsquo;s, and <em>everything in it</em>, the world, and <em>all who live in it</em>.&rdquo;` }}
            />
            <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              — Psalm 24:1
            </span>
          </div>
        </div>
      </section>

      {/* Trusted Material Partners */}
      <TrustedBrands />

      {/* Locations Directory List */}
      <section className="section">
        <div className="container" style={{ maxWidth: "860px" }}>
          <h2 style={{ color: "var(--primary)", fontSize: "1.8rem", marginBottom: "1rem" }}>
            Roofing &amp; Remodeling Across 19 Central MS Communities
          </h2>
          <p style={{ marginBottom: "2rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
            Select your city below to view local roofing repairs, full shingle and metal roof replacements, storm inspections, and interior remodeling projects documented by our crew near you.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px 24px" }}>
            {locations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/areas-we-service/${loc.slug}/`}
                style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text)", fontWeight: 600, fontSize: "0.98rem" }}
                className="loc-link"
              >
                <span style={{ color: "var(--secondary)" }}>📍</span> {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ServiceCTA defaultService="Roof Replacement" />
    </>
  );
}
