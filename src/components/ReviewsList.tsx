"use client";

import React, { useState } from "react";
import ContactForm from "@/components/ContactForm";
import TrustedBrands from "@/components/TrustedBrands";

interface Review {
  name: string;
  location: string;
  rating: number;
  category: "roofing" | "remodeling";
  service: string;
  text: string;
}

const allReviews: Review[] = [
  {
    name: "Janice M.",
    location: "Madison, MS",
    rating: 5,
    category: "remodeling",
    service: "Window Installation",
    text: "Born Again Home Remodeling professionally installed 4 large windows that look fabulous. They even installed a window AC unit and wrapped it perfectly to seal out moisture. Great carpentry trim work!"
  },
  {
    name: "Thomas D.",
    location: "Canton, MS",
    rating: 5,
    category: "remodeling",
    service: "Bathroom Remodeling",
    text: "We had significant foundation and subfloor repair, entire bathroom demo and reinstall, and several other roof and ceiling repairs made to our house. The crew worked with absolute integrity and did an outstanding job."
  },
  {
    name: "Sarah K.",
    location: "Pearl, MS",
    rating: 5,
    category: "roofing",
    service: "GAF Silicone Coating",
    text: "Damien Johnston and the team pressure washed, prepped, and installed a GAF silicone roof system on our flat metal roof. Outstanding leak sealing and workmanship! Highly recommend their roofing services."
  },
  {
    name: "Richard P.",
    location: "Brandon, MS",
    rating: 5,
    category: "remodeling",
    service: "Privacy Fence Installation",
    text: "They installed a new wooden privacy fence in our backyard. Solid posts, straight runs, and excellent gate hardware. Very fair estimate and honest operations."
  },
  {
    name: "Dianne W.",
    location: "Jackson, MS",
    rating: 5,
    category: "roofing",
    service: "GAF Shingle Replacement",
    text: "We had our old shingles replaced with GAF Timberline HDZ architectural shingles. Honest assessment, neat cleanup, and excellent GAF system warranty. Best contractor experience we've had!"
  },
  {
    name: "Matthew S.",
    location: "Clinton, MS",
    rating: 5,
    category: "roofing",
    service: "Storm Damage Repair",
    text: "Had emergency leak repair and shingle replacements after severe wind damage. They helped meet with our insurance adjuster. True lifesavers who operate with complete honesty."
  },
  {
    name: "Brenda H.",
    location: "Ridgeland, MS",
    rating: 5,
    category: "remodeling",
    service: "Kitchen Renovation",
    text: "Fabulous kitchen remodel! Solid wood cabinets, beautiful paint styling, and granite countertops. Working heartily as unto the Lord—they showed true Christian values and clean jobsite discipline."
  },
  {
    name: "Robert T.",
    location: "Florence, MS",
    rating: 5,
    category: "roofing",
    service: "Standing Seam Metal Roof",
    text: "Concealed fastener standing seam roof installation. Beautiful bronze gold metal that keeps our home cooler. Solid craftsmanship, respectful crew, and no hidden change orders!"
  },
  {
    name: "Carolyn L.",
    location: "Byram, MS",
    rating: 5,
    category: "remodeling",
    service: "Drywall & Painting",
    text: "Replaced rotted sheetrock on our kitchen ceiling, taped, mudded, and painted. Perfectly smooth, looks brand new! Excellent cleanup afterwards too."
  }
];

export default function ReviewsList() {
  const [activeTab, setActiveTab] = useState<"all" | "roofing" | "remodeling">("all");

  const filteredReviews = allReviews.filter((rev) => {
    if (activeTab === "all") return true;
    return rev.category === activeTab;
  });

  const getBentoClass = (index: number, count: number) => {
    // If it's the last item, avoid leaving empty spaces:
    if (index === count - 1) {
      if (index % 4 === 0) return "bento-col-12";
      if (index % 4 === 2) return "bento-col-8";
    }
    
    const pattern = ["bento-col-8", "bento-col-4", "bento-col-4", "bento-col-8", "bento-col-6", "bento-col-6", "bento-col-4", "bento-col-8", "bento-col-12"];
    return pattern[index % pattern.length];
  };

  return (
    <>
      {/* Hero Section */}
      <section className="service-hero">
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">Verified Testimonials</span>
          <h1>Customer Reviews</h1>
          <p className="hero-subtext">
            See what families and businesses in the Jackson Metro Area say about our faith-first roofing and remodeling craftsmanship.
          </p>

          <div style={{ marginTop: "2.5rem", textAlign: "center", maxWidth: "520px" }}>
            <p
              style={{ fontStyle: "italic", fontSize: "0.95rem", lineHeight: "1.7", color: "rgba(255, 255, 255, 0.75)", margin: "0 0 0.5rem", fontWeight: "400" }}
              dangerouslySetInnerHTML={{ __html: `&ldquo;A <em>good name</em> is more desirable than great riches; to be held in <em>high esteem</em> is better than silver or gold.&rdquo;` }}
            />
            <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              — Proverbs 22:1
            </span>
          </div>
        </div>
      </section>

      {/* Trusted Material Partners */}
      <TrustedBrands />

      {/* Main Reviews Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            
            {/* Scoreboard Panel */}
            <div className="double-bezel-wrapper">
              <div className="double-bezel-inner" style={{ padding: "2.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", alignItems: "center" }}>
                
                {/* Rating Block */}
                <div className="reviews-scoreboard-rating">
                  <div style={{ fontSize: "4.5rem", fontWeight: "900", color: "#ffffff", lineHeight: "1" }}>5.0</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: "4px", margin: "1rem 0 0.5rem", color: "var(--secondary)" }}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "1.25rem" }}>
                    based on 130+ Google reviews
                  </div>
                  <a
                    href="https://www.google.com/search?q=Born+Again+Home+Remodeling+and+Roofing+Pearl+MS#lrd=0x86282f761bf6d3d3:0x649d334d1a5ca7d3,1,,,,"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-island"
                    style={{ fontSize: "0.8rem", padding: "8px 16px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <span>See All Google Reviews</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                </div>

                {/* Trust badges list */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>
                    Mississippi&apos;s Trusted Craftsmanship
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span><strong style={{ color: "#ffffff" }}>Faith-First Stewardship</strong> — honest pricing, no hidden costs</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span><strong style={{ color: "#ffffff" }}>GAF Certified Materials</strong> — lifetime shingle warranties</span>
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span><strong style={{ color: "#ffffff" }}>Clean Jobsite Guarantee</strong> — complete cleanup, daily respect</span>
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", justifyContent: "center" }}>
              {([
                { key: "all" as const, label: "All", count: allReviews.length },
                { key: "roofing" as const, label: "Roofing", count: allReviews.filter(r => r.category === "roofing").length },
                { key: "remodeling" as const, label: "Remodeling", count: allReviews.filter(r => r.category === "remodeling").length }
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: "12px 20px",
                    border: "none",
                    borderBottom: activeTab === tab.key ? "2px solid var(--secondary)" : "2px solid transparent",
                    background: "transparent",
                    color: activeTab === tab.key ? "var(--secondary)" : "var(--text-muted)",
                    fontSize: "0.88rem",
                    fontWeight: activeTab === tab.key ? "800" : "600",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    letterSpacing: "0.02em",
                    marginBottom: "-1px"
                  }}
                >
                  {tab.label} <span style={{ opacity: 0.6 }}>({tab.count})</span>
                </button>
              ))}
            </div>

            {/* Reviews Grid */}
            <div className="bento-grid">
              {filteredReviews.map((rev, index) => (
                <div key={index} className={`double-bezel-wrapper ${getBentoClass(index, filteredReviews.length)}`}>
                  <div className="double-bezel-inner" style={{ padding: "2rem", display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between", position: "relative" }}>
                    
                    {/* Quote mark ornament */}
                    <span style={{ position: "absolute", top: "1rem", right: "2rem", fontSize: "6rem", fontWeight: "900", color: "var(--secondary)", opacity: 0.03, lineHeight: "1", userSelect: "none" }}>“</span>

                    {/* Top block */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                        <div style={{ display: "flex", gap: "2px", color: "var(--secondary)" }}>
                          {[...Array(rev.rating)].map((_, i) => (
                            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <span style={{ fontSize: "0.75rem", background: "rgba(226, 176, 71, 0.06)", border: "1px solid rgba(226, 176, 71, 0.15)", color: "var(--secondary)", padding: "3px 8px", borderRadius: "4px", fontWeight: "700" }}>
                          {rev.service}
                        </span>
                      </div>

                      <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.98rem", lineHeight: "1.7", color: "var(--text-muted)", fontStyle: "italic" }}>
                        &ldquo;{rev.text}&rdquo;
                      </p>
                    </div>

                    {/* Bottom details */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255, 255, 255, 0.03)", paddingTop: "1rem", marginTop: "auto" }}>
                      <h4 style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: "800", margin: 0 }}>{rev.name}</h4>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {rev.location}
                      </span>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Full-width bottom CTA & Estimate Form */}
      <section className="section section-alt" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Get A Free Quote</span>
            <h2 style={{ fontSize: "2rem", fontWeight: "900", color: "#ffffff", marginTop: "0.5rem" }}>
              Ready to Protect Your Home?
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", marginTop: "0.5rem" }}>
              Book an appointment with our team. Honest, clear estimates with zero pressure.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
