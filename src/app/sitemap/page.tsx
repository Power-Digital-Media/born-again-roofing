import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "Sitemap | Born Again Home Remodeling and Roofing",
  description: "Browse the HTML sitemap for Born Again Home Remodeling and Roofing. View links to all roofing and remodeling services, locations, and company pages.",
  alternates: {
    canonical: "/sitemap/"
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

const mainPages = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us" },
  { name: "Reviews", path: "/reviews" },
  { name: "Project Pins", path: "/pins" },
  { name: "Contact Us", path: "/contact-us" },
  { name: "Blog", path: "/blog" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms and Conditions", path: "/terms-and-conditions" }
];

const roofingPages = [
  { name: "Residential Roofing Index", path: "/residential-roofing" },
  { name: "Roof Repair", path: "/residential-roofing/roof-repair" },
  { name: "Roof Installation", path: "/residential-roofing/roof-installation" },
  { name: "Asphalt Shingles", path: "/residential-roofing/asphalt-shingle-roof-repair-and-replacement" },
  { name: "Roof Inspections", path: "/residential-roofing/roof-inspections" },
  { name: "Soffit & Fascia Repair", path: "/residential-roofing/soffit-and-fascia-repair" }
];

const stormPages = [
  { name: "Storm Damage Repair Index", path: "/storm-damage-roof-repair" },
  { name: "Emergency Roof Repair", path: "/storm-damage-roof-repair/emergency-roof-repair" },
  { name: "Roof Patches & Leaks", path: "/storm-damage-roof-repair/roof-patches-and-leak-repair" },
  { name: "Hail Damage Repair", path: "/storm-damage-roof-repair/hail-damage-roof-repair" },
  { name: "Wind Damage Repair", path: "/storm-damage-roof-repair/wind-damage-roof-repair" },
  { name: "Insurance Claims Help", path: "/storm-damage-roof-repair/roof-insurance-claims-help" }
];

const metalPages = [
  { name: "Metal Roofing Index", path: "/metal-roofing-repair-and-installation" },
  { name: "Standing Seam Installation", path: "/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation" }
];

const remodelingPages = [
  { name: "Bathroom Remodeling", path: "/bathroom-remodeling" },
  { name: "Kitchen Remodeling", path: "/kitchen-remodeling" },
  { name: "Whole House Remodeling", path: "/whole-house-remodeling" },
  { name: "Painting Services", path: "/painting" },
  { name: "Plumbing Services", path: "/plumbing" },
  { name: "Electrical Services", path: "/electrical" },
  { name: "Flooring Installation", path: "/flooring" },
  { name: "Tile Service", path: "/tile-service" },
  { name: "Sheetrock Installation", path: "/sheetrock" },
  { name: "Insulation Installation", path: "/insulation" },
  { name: "Framing Services", path: "/framing" },
  { name: "Trim & Carpentry", path: "/trim" },
  { name: "Skylight Repair & Replacement", path: "/skylight-repair-and-replacement" },
  { name: "Synthetic Shingles", path: "/synthetic-shingles" },
  { name: "Synthetic Slate Roof", path: "/synthetic-slate-roof-installation" },
  { name: "Synthetic Tile Roofing", path: "/synthetic-tile-roofing" },
  { name: "Synthetic Wood Roofing", path: "/synthetic-wood-roofing" }
];

export default function SitemapPage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Sitemap" pageDescription="Browse the HTML sitemap for Born Again Home Remodeling and Roofing." path="/sitemap/" />

      {/* Hero */}
      <section className="section" style={{ background: "linear-gradient(rgba(15, 34, 64, 0.95), rgba(15, 34, 64, 0.95))", color: "#ffffff", padding: "5rem 0 4rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ color: "#ffffff", fontSize: "2.5rem", marginBottom: "1rem" }}>Website Sitemap</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.1rem" }}>
            A complete list of all accessible pages on www.bornagainroofing.com.
          </p>
        </div>
      </section>

      {/* Directory Index */}
      <section className="section">
        <div className="container sitemap-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
          
          {/* Main Pages */}
          <div>
            <h3 style={{ color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "6px", marginBottom: "1.25rem" }}>Main Pages</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {mainPages.map((page) => (
                <li key={page.path}><Link href={page.path} style={{ color: "var(--text-muted)", fontWeight: 600 }}>{page.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Residential Roofing */}
          <div>
            <h3 style={{ color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "6px", marginBottom: "1.25rem" }}>Residential Roofing</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {roofingPages.map((page) => (
                <li key={page.path}><Link href={page.path} style={{ color: "var(--text-muted)", fontWeight: 600 }}>{page.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Storm Damage */}
          <div>
            <h3 style={{ color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "6px", marginBottom: "1.25rem" }}>Storm Damage</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {stormPages.map((page) => (
                <li key={page.path}><Link href={page.path} style={{ color: "var(--text-muted)", fontWeight: 600 }}>{page.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Metal Roofing */}
          <div>
            <h3 style={{ color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "6px", marginBottom: "1.25rem" }}>Metal Roofing</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {metalPages.map((page) => (
                <li key={page.path}><Link href={page.path} style={{ color: "var(--text-muted)", fontWeight: 600 }}>{page.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Remodeling & Trades */}
          <div style={{ gridColumn: "span 2" }} className="span-2">
            <h3 style={{ color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "6px", marginBottom: "1.25rem" }}>Remodeling & Specialties</h3>
            <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }} className="remodel-list">
              {remodelingPages.map((page) => (
                <li key={page.path}><Link href={page.path} style={{ color: "var(--text-muted)", fontWeight: 600 }}>{page.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Areas We Service */}
          <div style={{ gridColumn: "span 2" }} className="span-2">
            <h3 style={{ color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "6px", marginBottom: "1.25rem" }}>Service Location Pages</h3>
            <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }} className="remodel-list">
              {locations.map((loc) => (
                <li key={loc.slug}><Link href={`/areas-we-service/${loc.slug}`} style={{ color: "var(--text-muted)", fontWeight: 600 }}>Roofing & Remodeling in {loc.name}</Link></li>
              ))}
            </ul>
          </div>

        </div>
      </section>
    </>
  );
}
