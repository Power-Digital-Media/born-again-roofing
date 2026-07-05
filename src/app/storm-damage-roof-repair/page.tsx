import React from "react";
import Link from "next/link";
import { Metadata } from "next";

import LocalBusinessSchema from "@/components/LocalBusinessSchema";

import ServicePinsCarousel from "@/components/ServicePinsCarousel";
import ServiceBentoGrid from "@/components/ServiceBentoGrid";
import ServiceArticle from "@/components/ServiceArticle";
import TrustedBrands from "@/components/TrustedBrands";
import ServiceCTA from "@/components/ServiceCTA";

export const metadata: Metadata = {
  title: "Storm Damage Roof Repair in Jackson, MS | Born Again Home Remodeling and Roofing",
  description: "Born Again Home Remodeling and Roofing offers storm damage roof repair in Jackson, MS. Call (601) 573-6178 for fast, reliable service.",
  alternates: {
    canonical: "/storm-damage-roof-repair/"
  }
};

export default function StormDamagePage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Storm Damage Roof Repair in Jackson, MS" pageDescription="Born Again Home Remodeling and Roofing offers storm damage roof repair in Jackson, MS." path="/storm-damage-roof-repair/" />

      {/* Hero */}
      <section className="service-hero" style={{ backgroundImage: "url('/images/wp_storm-damage-home-roof-1.png')" }}>
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">Emergency Response</span>
          <h1>Storm Damage Roof Repair</h1>
          <p className="hero-subtext">
            Fast, professional emergency response for wind, hail, and storm damage. We secure your home and handle your insurance adjusters directly.
          </p>
        </div>
      </section>

      {/* Trusted Material Partners */}
      <TrustedBrands />

      {/* Dynamic Local Case Studies Carousel */}
      <section className="section" style={{ padding: "4rem 0 0" }}>
        <div className="container">
          <ServicePinsCarousel services={["Roof Repair", "Roof Inspection", "Emergency Roof Repair"]} />
        </div>
      </section>

      {/* Storm Damage Links Grid */}
      <section className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
              <h2 style={{ color: "var(--primary)", fontSize: "1.8rem", marginBottom: "1rem" }}>
                Restoring Safety and Integrity After a Storm
              </h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Mississippi weather can be severe, and storms hit without warning. When your roof is compromised by wind, hail, or falling debris, fast action is essential. Born Again Roofing provides professional inspection and repair services to secure leaks, patch shingles, and replace structural wood quickly.
              </p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px", marginBottom: "2rem" }}>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>✔</span> <strong>Emergency Repair:</strong> 24/7 tarping and emergency damage control.
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>✔</span> <strong>Hail Damage Restoration:</strong> Fixing soft spots, cracks, and shingle dents.
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>✔</span> <strong>Wind Damage Repair:</strong> Replacing missing shingle runs and ridge caps.
                </li>
                <li style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <span style={{ color: "var(--secondary)" }}>✔</span> <strong>Insurance Claims:</strong> Direct adjuster documentation and claim tracking.
                </li>
              </ul>
              <div style={{ padding: "1.5rem", borderLeft: "4px solid var(--secondary)", background: "rgba(var(--primary-rgb), 0.03)", borderRadius: "var(--radius)" }}>
                <h4 style={{ color: "var(--primary)", marginBottom: "0.5rem" }}>Active Roof Leak?</h4>
                <p style={{ fontSize: "0.95rem" }}>
                  Call our emergency storm dispatch at <a href="tel:6015736178" style={{ fontWeight: 700, color: "var(--secondary)" }}>(601) 573-6178</a> immediately.
                </p>
              </div>
        </div>
      </section>

      {/* Internal Navigation Subpages */}
      <section className="section section-alt" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "3.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Our Specialties</span>
            <h2>Our Storm Restoration Specialties</h2>
          </div>
          <div className="specialty-grid">
            
            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m13 10-3 3h3v3l3-3h-3v-3z" fill="currentColor" />
                  </svg>
                </div>
                <h3>Emergency Roof Repair</h3>
                <p>
                  Urgent roof tarping and structural checks to stop severe leaks during active storm conditions.
                </p>
              </div>
              <Link href="/storm-damage-roof-repair/emergency-roof-repair" className="specialty-card-link">
                <span>Emergency Help</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.47-.47-1.12-.75-1.83-.75h-.75c-.71 0-1.36.28-1.83.75-2.46 0-5 1.71-5 4.5A3.5 3.5 0 0 0 10 19Z" />
                    <path d="M12 21v1" />
                    <path d="M8 20v1" />
                    <path d="M16 20v1" />
                  </svg>
                </div>
                <h3>Roof Patches & Leaks</h3>
                <p>
                  Precise leak tracking and shingles patches to restore water-tight integrity after high winds.
                </p>
              </div>
              <Link href="/storm-damage-roof-repair/roof-patches-and-leak-repair" className="specialty-card-link">
                <span>Explore Patches</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                </div>
                <h3>Hail Damage Repair</h3>
                <p>
                  Inspect and fix hidden cracks, shingle dents, and granule loss caused by hailstorms.
                </p>
              </div>
              <Link href="/storm-damage-roof-repair/hail-damage-roof-repair" className="specialty-card-link">
                <span>Explore Hail Repair</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2M20 12a2 2 0 1 1-2-2h4" />
                  </svg>
                </div>
                <h3>Wind Damage Repair</h3>
                <p>
                  Replace shingle runs, flashing seals, and ridge caps blown off by strong thunderstorm winds.
                </p>
              </div>
              <Link href="/storm-damage-roof-repair/wind-damage-roof-repair" className="specialty-card-link">
                <span>Explore Wind Repair</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

            <div className="specialty-card">
              <div>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v8" />
                    <path d="M9 11h6" />
                  </svg>
                </div>
                <h3>Insurance Claims Help</h3>
                <p>
                  Get certified photo inspection records and reports to help file and justify storm claims.
                </p>
              </div>
              <Link href="/storm-damage-roof-repair/roof-insurance-claims-help" className="specialty-card-link">
                <span>Explore Claims Help</span>
                <svg width="14" height="14" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 6H11M11 6L6 1M11 6L6 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Faith-Based Q&A Educational Article */}
      <ServiceArticle service="storm-damage" />

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
            services={["Roof Repair", "Roof Inspection", "Emergency Roof Repair"]} 
            overrideImages={[
              { url: "/images/wp_storm-damage-home-roof-1.png", location: "Jackson, MS" },
              { url: "/images/wp_roofing-c.jpg", location: "Brandon, MS" }
            ]}
          />
        </div>
      </section>

      {/* AEO GEO FAQ Block */}
      <section className="section">
        <div className="container" style={{ maxWidth: "800px" }}>
          <h2 style={{ textAlign: "center", marginBottom: "2.5rem", color: "var(--primary)" }}>
            Storm Damage & Insurance FAQ
          </h2>
          
          <div className="qa-block">
            <h3 className="qa-question">Will my home insurance policy cover a roof replacement due to storm damage?</h3>
            <p className="qa-answer">
              {"Yes, in most cases, if your roof has suffered verifiable wind or hail damage from a storm, your homeowner's insurance policy will cover the cost of repair or replacement. It is essential to get a professional roof inspection first to document the damage before submitting your claim."}
            </p>
          </div>

          <div className="qa-block">
            <h3 className="qa-question">How long do I have to file a roof insurance claim after a storm?</h3>
            <p className="qa-answer">
              While timeframes vary by provider, most policies require you to file a storm claim within <strong>1 year</strong> (12 months) of the date of the weather event. Filing as soon as possible prevents additional water rot, which may not be covered if deemed due to neglect.
            </p>
          </div>
        </div>
      </section>

      <ServiceCTA />
    </>
  );
}
