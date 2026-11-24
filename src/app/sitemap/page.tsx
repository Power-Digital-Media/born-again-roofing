import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Browse the HTML sitemap for Born Again Home Remodeling and Roofing. View links to all roofing and remodeling services, locations, and company pages.",
  alternates: {
    canonical: "/sitemap/"
  }
};

const locations = [
  { name: "Florence, MS (HQ)", slug: "florence-ms" },
  { name: "Brandon, MS", slug: "brandon-ms" },
  { name: "Jackson, MS", slug: "jackson-ms" },
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

const mainPages = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about-us/" },
  { name: "Customer Reviews", path: "/reviews/" },
  { name: "Project Pins", path: "/pins/" },
  { name: "Areas We Service", path: "/areas-we-service/" },
  { name: "Contact Us", path: "/contact-us/" },
  { name: "Blog", path: "/blog/" },
  { name: "Privacy Policy", path: "/privacy-policy/" },
  { name: "Terms and Conditions", path: "/terms-and-conditions/" }
];

const roofingPages = [
  { name: "Residential Roofing", path: "/residential-roofing/" },
  { name: "Roof Repair", path: "/residential-roofing/roof-repair/" },
  { name: "Roof Replacement & Installation", path: "/residential-roofing/roof-installation/" },
  { name: "Asphalt Shingle Roofing", path: "/residential-roofing/asphalt-shingle-roof-repair-and-replacement/" },
  { name: "Roof Inspections", path: "/residential-roofing/roof-inspections/" },
  { name: "Soffit & Fascia Repair", path: "/residential-roofing/soffit-and-fascia-repair/" }
];

const stormPages = [
  { name: "Storm Damage Roof Repair", path: "/storm-damage-roof-repair/" },
  { name: "Emergency Roof Repair & Tarping", path: "/storm-damage-roof-repair/emergency-roof-repair/" },
  { name: "Roof Patches & Leak Repair", path: "/storm-damage-roof-repair/roof-patches-and-leak-repair/" },
  { name: "Hail Damage Roof Repair", path: "/storm-damage-roof-repair/hail-damage-roof-repair/" },
  { name: "Wind Damage Roof Repair", path: "/storm-damage-roof-repair/wind-damage-roof-repair/" },
  { name: "Roof Insurance Claims Help", path: "/storm-damage-roof-repair/roof-insurance-claims-help/" }
];

const metalPages = [
  { name: "Commercial & Flat Roofing", path: "/commercial-roofing/" },
  { name: "Metal Roofing Repair & Systems", path: "/metal-roofing-repair-and-installation/" },
  { name: "Standing Seam Metal Roof Installation", path: "/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation/" }
];

const remodelingPages = [
  { name: "Bathroom Remodeling", path: "/bathroom-remodeling/" },
  { name: "Kitchen Remodeling", path: "/kitchen-remodeling/" },
  { name: "Whole House Remodeling", path: "/whole-house-remodeling/" },
  { name: "Interior & Exterior Painting", path: "/painting/" },
  { name: "Remodel Plumbing Services", path: "/plumbing/" },
  { name: "Remodel Electrical Services", path: "/electrical/" },
  { name: "Flooring Installation", path: "/flooring/" },
  { name: "Custom Tile & Showers", path: "/tile-service/" },
  { name: "Sheetrock & Drywall", path: "/sheetrock/" },
  { name: "Attic Insulation", path: "/insulation/" },
  { name: "Structural Framing", path: "/framing/" },
  { name: "Trim & Carpentry", path: "/trim/" },
  { name: "Skylight Repair & Replacement", path: "/skylight-repair-and-replacement/" },
  { name: "Synthetic Shingle Roofing", path: "/synthetic-shingles/" },
  { name: "Synthetic Slate Roof Installation", path: "/synthetic-slate-roof-installation/" },
  { name: "Synthetic Tile Roofing", path: "/synthetic-tile-roofing/" },
  { name: "Synthetic Cedar Shake Roofing", path: "/synthetic-wood-roofing/" }
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
            A complete directory of roofing, storm restoration, remodeling, and Central Mississippi service area pages.
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

          {/* Metal & Commercial Roofing */}
          <div>
            <h3 style={{ color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "6px", marginBottom: "1.25rem" }}>Metal &amp; Commercial</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {metalPages.map((page) => (
                <li key={page.path}><Link href={page.path} style={{ color: "var(--text-muted)", fontWeight: 600 }}>{page.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Remodeling & Trades */}
          <div style={{ gridColumn: "span 2" }} className="span-2">
            <h3 style={{ color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "6px", marginBottom: "1.25rem" }}>Remodeling &amp; Specialties</h3>
            <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }} className="remodel-list">
              {remodelingPages.map((page) => (
                <li key={page.path}><Link href={page.path} style={{ color: "var(--text-muted)", fontWeight: 600 }}>{page.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* Areas We Service */}
          <div style={{ gridColumn: "span 2" }} className="span-2">
            <h3 style={{ color: "var(--primary)", borderBottom: "2px solid var(--secondary)", paddingBottom: "6px", marginBottom: "1.25rem" }}>Central MS Service Areas</h3>
            <ul style={{ listStyle: "none", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }} className="remodel-list">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link href={`/areas-we-service/${loc.slug}/`} style={{ color: "var(--text-muted)", fontWeight: 600 }}>
                    {loc.slug === "jackson-ms" ? "Jackson, MS Completed Projects & Areas" : `Roofing & Remodeling in ${loc.name}`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>
    </>
  );
}
