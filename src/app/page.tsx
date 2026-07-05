import React from "react";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import FAQSection from "@/components/FAQSection";
import HeroCTAs from "@/components/HeroCTAs";

export default function Home() {
  return (
    <>
      <LocalBusinessSchema path="/" />

      {/* Hero Section */}
      <section className="hero-section">
        <Image
          src="/images/wp_486049337_1404947030740628_1371524052289147842_n.jpg"
          alt="Born Again Roofing hero — Jackson MS roofing professionals"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', zIndex: 0 }}
          quality={75}
        />
        <div className="hero-overlay" />
        <div className="container hero-grid">
          
          <div className="hero-content scroll-reveal">
            <span className="eyebrow">{"Where Faith, Craftsmanship, and Care Come Together"}</span>
            <h1 className="hero-title">
              Remodeling & <br />
              <span className="italic-descender">Roofing Solutions</span> <br />
              in Jackson, MS
            </h1>
            <p className="hero-subtext hero-subtext-full">
              As a local, Christian-owned roofing company, Born Again Home Remodeling and Roofing is built on honesty, integrity, and service. We deliver premium roofing and home remodeling solutions across Jackson, Mississippi and the surrounding communities.
            </p>
            <p className="hero-subtext hero-subtext-short">
              Premium roofing and remodeling built on faith, integrity, and expert craftsmanship — serving Jackson, MS and surrounding communities.
            </p>
            <HeroCTAs />

            {/* Mobile-only: compact trust line below CTA */}
            <div className="hero-trust-line">
              <span className="hero-trust-stars">★★★★★</span>
              <span className="hero-trust-text">5.0 Rating · 130+ Google Reviews</span>
            </div>

            {/* Mobile-only: scroll indicator */}
            <div className="hero-scroll-indicator" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          
          <div id="estimate-form" className="hero-form-wrapper scroll-reveal">
            <ContactForm />
          </div>

        </div>
      </section>

      {/* Credentials Banner (Logo / Trust Wall directly below Hero) */}
      <section className="credentials-section">
        <div className="container credentials-inner" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
          <div className="credential-item reveal-on-scroll" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="specialty-icon-wrapper" style={{ margin: 0, width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 8H7" />
              </svg>
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>Faith & Integrity</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>Honest operations, fair pricing</p>
            </div>
          </div>
          
          <div className="credential-item reveal-on-scroll" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="specialty-icon-wrapper" style={{ margin: 0, width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>GAF Certified Materials</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>Lifetime shingle warranties</p>
            </div>
          </div>

          <div className="credential-item reveal-on-scroll" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div className="specialty-icon-wrapper" style={{ margin: 0, width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>Locally Owned & Operated</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>Serving Central Mississippi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Showcase Slider */}
      <ReviewsCarousel />

      {/* Services Section */}
      <section className="section services-section">
        <div className="container">
          
          <div className="services-header reveal-on-scroll">
            <span className="eyebrow">Expert Capabilities</span>
            <h2>Our Core Services</h2>
            <p>
              We provide comprehensive exterior and interior home services designed to protect your home and increase its value.
            </p>
          </div>

          <div className="bento-grid">
            
            {/* Service 1 - Wide split bento card (GAF Roofing Image) */}
            <div className="double-bezel-wrapper bento-col-8 reveal-on-scroll">
              <div className="double-bezel-inner bento-split-card">
                <div className="bento-split-content">
                  <div className="specialty-icon-wrapper">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <path d="M9 22V12h6v9" />
                    </svg>
                  </div>
                  <h3 style={{ color: "#ffffff" }}>Residential Roofing</h3>
                  <p className="service-desc">
                    Complete roof repair, roof installations, inspections, asphalt shingle replacements, and fascia repair using GAF certified materials.
                  </p>
                  <Link href="/residential-roofing" className="service-link">
                    Learn More <span className="arrow">↗</span>
                  </Link>
                </div>
                <div className="bento-split-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/wp_roofing-c.jpg" alt="GAF Asphalt Shingle Roofing Job" className="bento-img" />
                </div>
              </div>
            </div>

            {/* Service 2 - Standard 1/3 card (Storm Damage) */}
            <div className="double-bezel-wrapper bento-col-4 reveal-on-scroll">
              <div className="double-bezel-inner service-card-bg" style={{ backgroundImage: "linear-gradient(rgba(10, 12, 16, 0.85), rgba(10, 12, 16, 0.95)), url('/images/wp_storm-damage-home-roof-1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m13 10-3 3h3v3l3-3h-3v-3z" fill="currentColor" />
                  </svg>
                </div>
                <h3 style={{ color: "#ffffff" }}>Storm Damage Repair</h3>
                <p className="service-desc" style={{ color: "#94a3b8" }}>
                  Emergency patching, leak repair, wind and hail damage restoration, plus insurance claim filing assistance.
                </p>
                <Link href="/storm-damage-roof-repair" className="service-link" style={{ color: "var(--secondary)", marginTop: "auto" }}>
                  Learn More <span className="arrow">↗</span>
                </Link>
              </div>
            </div>

            {/* Service 3 - Standard 1/3 card (Metal Roofing) */}
            <div className="double-bezel-wrapper bento-col-4 reveal-on-scroll">
              <div className="double-bezel-inner service-card-bg" style={{ backgroundImage: "linear-gradient(rgba(10, 12, 16, 0.85), rgba(10, 12, 16, 0.95)), url('/images/wp_metal-roof-standing-seam-1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="6" y1="3" x2="6" y2="21" strokeDasharray="2 2" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <line x1="18" y1="3" x2="18" y2="21" strokeDasharray="2 2" />
                    <path d="m3 9 9-7 9 7" />
                  </svg>
                </div>
                <h3 style={{ color: "#ffffff" }}>Metal Roofing Systems</h3>
                <p className="service-desc" style={{ color: "#94a3b8" }}>
                  Durable standing seam metal roofing, repair, and installations for long-lasting protection.
                </p>
                <Link href="/metal-roofing-repair-and-installation" className="service-link" style={{ color: "var(--secondary)", marginTop: "auto" }}>
                  Learn More <span className="arrow">↗</span>
                </Link>
              </div>
            </div>

            {/* Service 4 - Wide split bento card (Kitchen Remodel Image) */}
            <div className="double-bezel-wrapper bento-col-8 reveal-on-scroll">
              <div className="double-bezel-inner bento-split-card">
                <div className="bento-split-content">
                  <div className="specialty-icon-wrapper">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M6 11V7a3 3 0 0 1 6 0v4" />
                      <circle cx="9" cy="16" r="1" />
                      <circle cx="15" cy="16" r="1" />
                    </svg>
                  </div>
                  <h3 style={{ color: "#ffffff" }}>Kitchen & Bath Remodeling</h3>
                  <p className="service-desc">
                    Beautiful structural demos, custom cabinet installations, granite countertop styling, sheetrock, and plumbing.
                  </p>
                  <Link href="/bathroom-remodeling" className="service-link">
                    Learn More <span className="arrow">↗</span>
                  </Link>
                </div>
                <div className="bento-split-image">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/wp_kitchen-remodel-a-1024x1024-1.jpg" alt="Kitchen Remodeling Job" className="bento-img" />
                </div>
              </div>
            </div>

            {/* Service 5 - Standard 1/2 card (Painting) */}
            <div className="double-bezel-wrapper bento-col-6 reveal-on-scroll">
              <div className="double-bezel-inner service-card-bg" style={{ backgroundImage: "linear-gradient(rgba(10, 12, 16, 0.85), rgba(10, 12, 16, 0.95)), url('/images/wp_interiorpaint-1024x1024.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="3" width="16" height="6" rx="1.5" />
                    <path d="M12 9v8a3 3 0 0 0 3 3h2" />
                    <circle cx="17" cy="20" r="1" />
                  </svg>
                </div>
                <h3 style={{ color: "#ffffff" }}>Interior/Exterior Painting</h3>
                <p className="service-desc" style={{ color: "#94a3b8" }}>
                  Professional residential painting, drywall patching, framing, trim, and carpentry upgrades.
                </p>
                <Link href="/painting" className="service-link" style={{ color: "var(--secondary)", marginTop: "auto" }}>
                  Learn More <span className="arrow">↗</span>
                </Link>
              </div>
            </div>

            {/* Service 6 - Standard 1/2 card (Whole House) */}
            <div className="double-bezel-wrapper bento-col-6 reveal-on-scroll">
              <div className="double-bezel-inner service-card-bg" style={{ backgroundImage: "linear-gradient(rgba(10, 12, 16, 0.85), rgba(10, 12, 16, 0.95)), url('/images/wp_synthetic-tile-roofing-home-1.png')", backgroundSize: "cover", backgroundPosition: "center" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <line x1="9" y1="22" x2="9" y2="12" />
                    <line x1="15" y1="22" x2="15" y2="12" />
                    <line x1="9" y1="12" x2="15" y2="12" />
                  </svg>
                </div>
                <h3 style={{ color: "#ffffff" }}>Whole House Remodeling</h3>
                <p className="service-desc" style={{ color: "#94a3b8" }}>
                  Complete home layout transformations, framing, insulation, tile services, and finishing trim.
                </p>
                <Link href="/whole-house-remodeling" className="service-link" style={{ color: "var(--secondary)", marginTop: "auto" }}>
                  Learn More <span className="arrow">↗</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Projects Carousel (Loaded dynamically below the fold for LCP optimization) */}
      <ProjectsCarousel />

      {/* Why Choose Us Section */}
      <section className="section section-alt" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <div className="services-header reveal-on-scroll">
            <span className="eyebrow">Our Difference</span>
            <h2>Why Choose Born Again?</h2>
            <p>
              We treat every home as if it were our own, focusing on your needs first—not profits.
            </p>
          </div>

          <div className="grid-layout three-col-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>
            
            <div className="double-bezel-wrapper reveal-on-scroll">
              <div className="double-bezel-inner value-card" style={{ padding: "3rem 2.5rem" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 8H7" />
                  </svg>
                </div>
                <span className="value-number" style={{ position: "absolute", top: "2rem", right: "2.5rem", fontSize: "3.5rem", fontWeight: "900", color: "var(--secondary)", opacity: 0.08 }}>01</span>
                <h3 style={{ color: "#ffffff", fontSize: "1.35rem", fontWeight: "800", marginBottom: "1rem" }}>Faith & Integrity</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: "1.7" }}>
                  {"As a Christian-owned business, Born Again Home Remodeling and Roofing is built on honesty, integrity, and service. We focus on your needs, deliver clear estimates, and never recommend repairs or replacements you don't actually need."}
                </p>
              </div>
            </div>

            <div className="double-bezel-wrapper reveal-on-scroll">
              <div className="double-bezel-inner value-card" style={{ padding: "3rem 2.5rem" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <span className="value-number" style={{ position: "absolute", top: "2rem", right: "2.5rem", fontSize: "3.5rem", fontWeight: "900", color: "var(--secondary)", opacity: 0.08 }}>02</span>
                <h3 style={{ color: "#ffffff", fontSize: "1.35rem", fontWeight: "800", marginBottom: "1rem" }}>Skilled Craftsmanship</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: "1.7" }}>
                  We believe strong homes start with strong work. Our experienced crews use durable, industry-leading GAF architectural shingles and standing seam metal panels, applying proven techniques so your roof or remodel stands the test of time.
                </p>
              </div>
            </div>

            <div className="double-bezel-wrapper reveal-on-scroll">
              <div className="double-bezel-inner value-card" style={{ padding: "3rem 2.5rem" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <span className="value-number" style={{ position: "absolute", top: "2rem", right: "2.5rem", fontSize: "3.5rem", fontWeight: "900", color: "var(--secondary)", opacity: 0.08 }}>03</span>
                <h3 style={{ color: "#ffffff", fontSize: "1.35rem", fontWeight: "800", marginBottom: "1rem" }}>Neighborly Care</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: "1.7" }}>
                  As a locally owned team serving Jackson, MS and surrounding areas, we treat you like a neighbor. We provide transparent timelines, respectful cleanup, and follow up long after the project is complete to ensure your absolute satisfaction.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Answer Engine & Generative Engine Optimization (AEO / GEO) FAQ section */}
      <section className="section">
        <div className="container">
          
          <div className="faq-header reveal-on-scroll">
            <span className="eyebrow">Expert Answers</span>
            <h2>Frequently Asked Questions</h2>
            <p>
              Get direct, expert answers to common roofing questions compiled by our certified technicians in Jackson, MS.
            </p>
          </div>

          <FAQSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bottom-cta-section">
        <div className="container bottom-cta-inner">
          <span className="eyebrow" style={{ color: "var(--secondary)" }}>Get Started Today</span>
          <h2>Ready to Protect Your Home with Born Again Quality?</h2>
          <p>
            Our certified inspectors and remodelers are ready to serve you. Contact us today to schedule your appointment or receive a free estimate.
          </p>
          <div className="bottom-cta-buttons">
            <Link href="/contact-us" className="btn btn-secondary btn-island">
              Book Free Estimate
              <span className="btn-icon-wrapper">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
            <a href="tel:6015736178" className="btn btn-outline" style={{ color: "#ffffff", borderColor: "rgba(255, 255, 255, 0.25)" }}>
              Call: (601) 573-6178
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
