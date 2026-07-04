import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

import ServicePinsCarousel from "@/components/ServicePinsCarousel";
import ServiceBentoGrid from "@/components/ServiceBentoGrid";
import ServiceArticle from "@/components/ServiceArticle";

export const metadata: Metadata = {
  title: "Metal Roofing Repair and Installation in Jackson, MS | Born Again Home Remodeling and Roofing",
  description: "Strength and Style with Expert Metal Roofing in Jackson, MS. When it comes to long-lasting protection, metal roofing stands out. Call (601) 573-6178.",
  alternates: {
    canonical: "/metal-roofing-repair-and-installation/"
  }
};

export default function MetalRoofingPage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Metal Roofing Repair and Installation in Jackson, MS" pageDescription="Strength and Style with Expert Metal Roofing. When it comes to long-lasting protection, metal roofing stands out." path="/metal-roofing-repair-and-installation/" />

      {/* Hero */}
      <section className="service-hero" style={{ backgroundImage: "url('/images/wp_metal-roof-standing-seam-1.png')" }}>
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">GAF Certified Quality</span>
          <h1>Metal Roofing Systems</h1>
          <p className="hero-subtext">
            Invest in lifetime durability and modern aesthetics. Premium standing seam and metal shingle installations in Central Mississippi.
          </p>
        </div>
      </section>

      {/* Dynamic Local Case Studies Carousel */}
      <section className="section" style={{ padding: "4rem 0 0" }}>
        <div className="container">
          <ServicePinsCarousel services={["Metal Roofing"]} />
        </div>
      </section>

      {/* Content Grid */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2.5rem" }}>
            <div>
              <h2 style={{ color: "var(--primary)", fontSize: "1.8rem", marginBottom: "1rem" }}>
                Lifetime Protection & Architectural Beauty
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Metal roofing has rapidly become a preferred choice for homeowners seeking maximum storm protection, longevity, and modern design. At Born Again Roofing, we specialize in high-performance metal roof systems designed to resist high winds, heavy rain, and solar heat.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "2rem" }}>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>✔</span> <strong>Standing Seam Panels:</strong> Hidden fastener systems for a sleek look.
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>✔</span> <strong>Metal Roof Repairs:</strong> Fixing seam leaks, boot cracks, and screw seals.
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>✔</span> <strong>Energy Efficiency:</strong> Highly reflective coatings lower cooling bills.
                </li>
              </ul>
              <div style={{ padding: "1.5rem", borderLeft: "4px solid var(--secondary)", background: "rgba(var(--primary-rgb), 0.03)", borderRadius: "var(--radius)" }}>
                <h4 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>Get a Metal Roofing Estimate</h4>
                <p style={{ fontSize: "0.95rem" }}>
                  Call our estimators at <a href="tel:6015736178" style={{ fontWeight: 700, color: "var(--secondary)" }}>(601) 573-6178</a> for direct project quotes.
                </p>
              </div>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Internal Subpages Nav */}
      <section className="section section-alt" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "3.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Our Specialties</span>
            <h2>Explore Our Metal Specialties</h2>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div className="specialty-card" style={{ maxWidth: "600px", width: "100%", padding: "3rem 2.5rem" }}>
              <div>
                <div className="specialty-icon-wrapper" style={{ margin: "0 auto 1.5rem" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" y1="3" x2="6" y2="21" strokeDasharray="2 2" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <line x1="18" y1="3" x2="18" y2="21" strokeDasharray="2 2" />
                    <path d="m3 9 9-7 9 7" />
                  </svg>
                </div>
                <h3 style={{ textAlign: "center" }}>Standing Seam Metal Roof Installation</h3>
                <p style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                  Discover our premium standing seam panel installation services featuring concealed fasteners for ultimate water-tight security and modern clean lines.
                </p>
              </div>
              <Link href="/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation" className="specialty-card-link" style={{ justifyContent: "center" }}>
                <span>Explore Standing Seam</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Faith-Based Q&A Educational Article */}
      <ServiceArticle service="metal-roofing" />

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
            services={["Metal Roofing"]} 
            overrideImages={[
              { url: "/images/wp_metal-roof-standing-seam-1.png", location: "Jackson, MS" },
              { url: "/images/wp_roofing-c.jpg", location: "Madison, MS" }
            ]}
          />
        </div>
      </section>

      {/* AEO GEO FAQ Block */}
      <section className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2.5rem", color: "var(--primary)" }}>
            Metal Roofing FAQ
          </h2>
          
          <div className="qa-block">
            <h3 className="qa-question">Are metal roofs noisier during rainstorms than shingle roofs?</h3>
            <p className="qa-answer">
              No. When installed with proper solid sheathing and thick attic insulation, a metal roof is <strong>no noisier</strong> than a standard shingle roof. The attic insulation dampens sound waves, maintaining a quiet, comfortable indoor environment.
            </p>
          </div>

          <div className="qa-block">
            <h3 className="qa-question">Does a metal roof attract lightning strikes?</h3>
            <p className="qa-answer">
              No. Metal conducts electricity, but it does not attract lightning. If lightning does strike a metal roof, the non-combustible metal paneling disperses the charge safely, making it far safer than a wood-framed shingle roof.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
