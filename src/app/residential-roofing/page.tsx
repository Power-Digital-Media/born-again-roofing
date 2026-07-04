import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

import ServicePinsCarousel from "@/components/ServicePinsCarousel";
import ServiceBentoGrid from "@/components/ServiceBentoGrid";
import ServiceArticle from "@/components/ServiceArticle";

export const metadata: Metadata = {
  title: "Residential Roofing in Jackson, MS | Born Again Home Remodeling and Roofing",
  description: "Complete Residential Roofing Services in Jackson, MS. From small repairs to major projects, our skilled team is ready to help. Call (601) 573-6178.",
  alternates: {
    canonical: "/residential-roofing/"
  }
};

export default function ResidentialRoofingPage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Residential Roofing in Jackson, MS" pageDescription="Complete Residential Roofing Services. No matter your roofing needs, our skilled team is ready to help." path="/residential-roofing/" />

      {/* Hero */}
      <section className="service-hero" style={{ backgroundImage: "url('/images/wp_roofing-c.jpg')" }}>
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">Our Services</span>
          <h1>Residential Roofing Services</h1>
          <p className="hero-subtext">
            {"No matter your roofing needs, our skilled team is ready to help. From small leak repairs to major custom architectural shingle installations, we protect your family's investment."}
          </p>
        </div>
      </section>

      {/* Dynamic Local Case Studies Carousel */}
      <section className="section" style={{ padding: "4rem 0 0" }}>
        <div className="container">
          <ServicePinsCarousel services={["Residential Roofing", "Roof Repair", "Roof Inspection", "Soffit & Fascia"]} />
        </div>
      </section>

      {/* Main Content & Form Grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "4rem", alignItems: "start" }}>
            
            <div className="services-intro-col">
              <span className="eyebrow" style={{ color: "var(--secondary)" }}>GAF Certified Quality</span>
              <h2 style={{ fontSize: "2rem", marginBottom: "1.25rem", color: "var(--primary)" }}>
                {"Complete Care For Your Home's Roof"}
              </h2>
              <p style={{ fontSize: "1.05rem", lineHeight: "1.7", color: "var(--text-muted)", marginBottom: "1.75rem" }}>
                {"A secure roof is the first line of defense for your family and belongings. Born Again Roofing offers licensed, GAF-certified services to handle any residential roofing concern with complete transparency and top-tier craftsmanship."}
              </p>
              
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2.5rem" }}>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "0.98rem", color: "var(--text-muted)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: "18px", height: "18px", color: "var(--secondary)", flexShrink: 0, marginTop: "3px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span><strong>Roof Repair:</strong> Fixing storm damage, leaks, punctures, and missing shingle issues quickly.</span>
                </li>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "0.98rem", color: "var(--text-muted)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: "18px", height: "18px", color: "var(--secondary)", flexShrink: 0, marginTop: "3px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span><strong>Roof Inspections:</strong> Comprehensive drone-assisted documentation of shingle and decking health.</span>
                </li>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "0.98rem", color: "var(--text-muted)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: "18px", height: "18px", color: "var(--secondary)", flexShrink: 0, marginTop: "3px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span><strong>Roof Installation:</strong> Brand new, energy-efficient architectural shingle roof systems.</span>
                </li>
                <li style={{ display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "0.98rem", color: "var(--text-muted)" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: "18px", height: "18px", color: "var(--secondary)", flexShrink: 0, marginTop: "3px" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span><strong>Soffit & Fascia:</strong> Repairing structural wood rot and maintaining attic ventilation edges.</span>
                </li>
              </ul>
              
              <div style={{ padding: "2rem", borderLeft: "4px solid var(--secondary)", background: "rgba(255, 255, 255, 0.01)", border: "1px solid var(--border)", borderLeftWidth: "4px", borderRadius: "12px" }}>
                <h4 style={{ color: "var(--primary)", fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.5rem" }}>Need immediate assistance?</h4>
                <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", margin: 0, lineHeight: "1.5" }}>
                  {"Call our local Jackson hotline at "}
                  <a href="tel:6015736178" style={{ fontWeight: 700, color: "var(--secondary)" }}>(601) 573-6178</a>
                  {" to speak directly with David Dilmore or an on-duty estimator."}
                </p>
              </div>
            </div>

            <div className="double-bezel-wrapper">
              <div className="double-bezel-inner" style={{ padding: "1.5rem" }}>
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="section section-alt" style={{ borderTop: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "3.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Our Specialties</span>
            <h2>Explore Our Residential Specialties</h2>
          </div>
          
          <div className="specialty-grid">
            
            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path d="M14.7 12.5a3 3 0 0 0-4.2-4.2L7 11.8v2.7h2.7l3.5-3.5Z" />
                  </svg>
                </div>
                <h3>Roof Repair</h3>
                <p>
                  Fast, reliable repair services to fix minor leaks, missing shingles, and pipe boot damage before it spreads inside your home.
                </p>
              </div>
              <Link href="/residential-roofing/roof-repair" className="specialty-card-link">
                <span>Explore Roof Repair</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <line x1="9" y1="22" x2="9" y2="16" />
                    <line x1="15" y1="22" x2="15" y2="16" />
                  </svg>
                </div>
                <h3>Roof Installation</h3>
                <p>
                  Build with confidence using our top-rated GAF architectural shingle installation options with lifetime warranties and wind resistance.
                </p>
              </div>
              <Link href="/residential-roofing/roof-installation" className="specialty-card-link">
                <span>Explore Installation</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10h18" />
                    <path d="M3 14h18" />
                    <path d="M3 18h18" />
                    <path d="m3 6 9-4 9 4" />
                  </svg>
                </div>
                <h3>Asphalt Shingles</h3>
                <p>
                  The most popular and cost-effective roofing choice. Professional shingle repairs and architectural replacements.
                </p>
              </div>
              <Link href="/residential-roofing/asphalt-shingle-roof-repair-and-replacement" className="specialty-card-link">
                <span>Explore Shingles</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="m9 15 2 2 4-4" />
                  </svg>
                </div>
                <h3>Roof Inspections</h3>
                <p>
                  Thorough inspection checklists and report sheets to identify wear, tear, leaks, storm damage, or age related deterioration.
                </p>
              </div>
              <Link href="/residential-roofing/roof-inspections" className="specialty-card-link">
                <span>Explore Inspections</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                    <line x1="6" y1="12" x2="18" y2="12" />
                    <line x1="6" y1="16" x2="18" y2="16" />
                  </svg>
                </div>
                <h3>Soffit & Fascia Repair</h3>
                <p>
                  Protect the edges of your roof and ensure proper attic ventilation with professional soffit and wood fascia repairs.
                </p>
              </div>
              <Link href="/residential-roofing/soffit-and-fascia-repair" className="specialty-card-link">
                <span>Explore Soffit/Fascia</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Faith-Based Q&A Educational Article */}
      <ServiceArticle service="residential-roofing" />

      {/* Dynamic Local Case Studies Bento Grid (Full Width) */}
      <section className="section section-alt" style={{ borderTop: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.01)", padding: "5rem 0" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "3.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Local Craftsmanship</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "850", color: "var(--primary)", marginTop: "0.5rem" }}>
              Proven Results In Your Area
            </h2>
          </div>
          <ServiceBentoGrid 
            services={["Residential Roofing", "Roof Repair", "Roof Inspection", "Soffit & Fascia"]} 
            overrideImages={[
              { url: "/images/wp_roofing-c.jpg", location: "Jackson, MS" },
              { url: "/images/wp_synthetic-tile-roofing-home-1.png", location: "Brandon, MS" }
            ]}
          />
        </div>
      </section>

      {/* AEO GEO FAQ Block */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <div className="text-center" style={{ marginBottom: "3.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Answers to Your Questions</span>
            <h2>Residential Roofing FAQ</h2>
          </div>
          
          <div className="aeo-qa-container">
            
            <div className="double-bezel-wrapper" style={{ marginBottom: "2rem" }}>
              <div className="double-bezel-inner aeo-qa-card" style={{ padding: "2.5rem" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <span className="aeo-q-badge" style={{ background: "rgba(var(--secondary-rgb), 0.1)", color: "var(--secondary)", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", fontWeight: "800", flexShrink: 0, justifyContent: "center" }}>Q</span>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--primary)", margin: "4px 0 1rem" }}>How long does a new residential roof installation take?</h3>
                    <p style={{ fontSize: "1rem", lineHeight: "1.65", color: "var(--text-muted)", margin: 0 }}>
                      {"For most average-sized residential homes (1,500 to 3,000 sq ft), a complete roof installation takes "}<strong>1 to 2 days</strong>{" to complete. Our GAF-certified crew handles the process cleanly, from tearing off old shingles to thorough magnetic yard sweeping, minimizing disruption to your schedule."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="double-bezel-wrapper">
              <div className="double-bezel-inner aeo-qa-card" style={{ padding: "2.5rem" }}>
                <div style={{ display: "flex", gap: "16px" }}>
                  <span className="aeo-q-badge" style={{ background: "rgba(var(--secondary-rgb), 0.1)", color: "var(--secondary)", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", fontWeight: "800", flexShrink: 0, justifyContent: "center" }}>Q</span>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--primary)", margin: "4px 0 1rem" }}>What is asphalt shingle roofing?</h3>
                    <p style={{ fontSize: "1rem", lineHeight: "1.65", color: "var(--text-muted)", margin: 0 }}>
                      {"Asphalt shingle roofing is the most popular residential option in America due to its balance of durability, cost-effectiveness, and design flexibility. Architectural shingles provide a thicker, multi-dimensional look that withstands higher wind ratings and lasts 25 to 50 years with a certified installation."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
