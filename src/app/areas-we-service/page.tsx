import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import TrustedBrands from "@/components/TrustedBrands";
import ServiceCTA from "@/components/ServiceCTA";

export const metadata: Metadata = {
  title: "Areas We Service | Born Again Home Remodeling and Roofing",
  description: "Explore all areas serviced by Born Again Home Remodeling and Roofing. We offer premium roofing and remodeling solutions across Central Mississippi. Call (601) 573-6178.",
  alternates: {
    canonical: "/areas-we-service/"
  }
};

const locations = [
  { name: "Brandon, MS", slug: "brandon-ms" },
  { name: "Byram, MS", slug: "byram-ms" },
  { name: "Canton, MS", slug: "canton-ms" },
  { name: "Clinton, MS", slug: "clinton-ms" },
  { name: "Crystal Springs, MS", slug: "crystal-springs-ms" },
  { name: "Florence, MS", slug: "florence-ms" },
  { name: "Flowood, MS", slug: "flowood-ms" },
  { name: "Gluckstadt, MS", slug: "gluckstadt-ms" },
  { name: "Hazlehurst, MS", slug: "hazlehurst-ms" },
  { name: "Jackson, MS", slug: "jackson-ms" },
  { name: "Madison, MS", slug: "madison-ms" },
  { name: "Pearl, MS", slug: "pearl-ms" },
  { name: "Raymond, MS", slug: "raymond-ms" },
  { name: "Richland, MS", slug: "richland-ms" },
  { name: "Ridgeland, MS", slug: "ridgeland-ms" },
  { name: "Terry, MS", slug: "terry-ms" },
  { name: "Utica, MS", slug: "utica-ms" },
  { name: "Vicksburg, MS", slug: "vicksburg-ms" },
  { name: "Yazoo City, MS", slug: "yazoo-city-ms" }
];

export default function AreasWeServicePage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Areas We Service" pageDescription="Explore all areas serviced by Born Again Home Remodeling and Roofing." path="/areas-we-service/" />

      {/* Hero */}
      <section className="service-hero">
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">
            Born Again Service Area
          </span>
          <h1>Areas We Service</h1>
          <p className="hero-subtext">
            Providing high-end roofing and remodeling services across the Central Mississippi and Jackson Metro Area.
          </p>

          <div style={{ marginTop: "2.5rem", textAlign: "center", maxWidth: "520px" }}>
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
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ color: "var(--primary)", fontSize: "1.8rem", marginBottom: "1.5rem" }}>
            Our Central Mississippi Service Coverage
          </h2>
          <p style={{ marginBottom: "2rem" }}>
            We are proud to serve communities throughout Hinds, Madison, Rankin, Copiah, and Warren counties. Click on a specific city below to explore localized roofing, siding, and remodeling projects near you.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 24px" }}>
            {locations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/areas-we-service/${loc.slug}`}
                style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text)", fontWeight: 600, fontSize: "0.95rem" }}
                className="loc-link"
              >
                <span style={{ color: "var(--secondary)" }}>📍</span> {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ServiceCTA />
    </>
  );
}
