import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "About Us | Born Again Home Remodeling and Roofing",
  description: "We've built a reputation as one of Mississippi's leading roofing and remodeling companies because we treat every project as if it were our own. Call (601) 573-6178.",
  alternates: {
    canonical: "/about-us/"
  }
};

export default function AboutUsPage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="About Us" pageDescription="We've built a reputation as one of Mississippi's leading roofing and remodeling companies." path="/about-us/" />

      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero-inner scroll-reveal">
          <span className="eyebrow">Our Story</span>
          <h1>About Our Company</h1>
          <p className="hero-subtext">
            {"At Born Again Home Remodeling and Roofing, we are proud to be a Christian-owned company serving Jackson, MS, and surrounding communities."}
          </p>
        </div>
      </section>

      {/* Who We Are & Services Section */}
      <section className="section content-section">
        <div className="container">
          <div className="about-grid-two-col">
            
            <div className="about-story-col">
              <h2>Who We Are</h2>
              <p className="intro-paragraph" style={{ marginBottom: "1.5rem" }}>
                {"At Born Again Home Remodeling and Roofing, we are proud to be a Christian-owned company serving Jackson, MS, and surrounding communities. Our mission is simple: put people first, treat every project with integrity, and deliver results that leave your home looking “born again.”"}
              </p>
              <p className="body-paragraph" style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "1.5rem" }}>
                {"We believe that strong values create strong homes. Guided by our Christian principles, we focus on honesty, fairness, and hard work in every job. Our customers know that we put their needs before profits, and we strive to build lasting relationships based on trust."}
              </p>
              <p className="body-paragraph" style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: "1.7", marginBottom: "0" }}>
                {"When you choose Born Again Home Remodeling and Roofing, you’re not just getting a contractor — you’re partnering with a team that truly cares about your family and your home."}
              </p>
            </div>

            <div className="double-bezel-wrapper" style={{ height: "auto" }}>
              <div className="double-bezel-inner" style={{ padding: "2.5rem" }}>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>Our Remodeling & Roofing Expertise</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0.5rem 0 1.5rem" }}>
                  {"Complete home solutions that bring beauty, safety, and value to your home."}
                </p>
                <ul className="about-services-list" style={{ display: "grid", gap: "0.85rem", padding: 0, listStyle: "none", margin: 0 }}>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "0.85rem", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="var(--secondary)" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "4px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}><strong style={{ color: "#ffffff" }}>Residential roofing</strong> – installation, repairs, and inspections</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "0.85rem", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="var(--secondary)" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "4px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}><strong style={{ color: "#ffffff" }}>Storm damage roof repair</strong> – hail and wind damage restoration</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "0.85rem", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="var(--secondary)" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "4px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}><strong style={{ color: "#ffffff" }}>Emergency roof repair</strong> – fast response when you need it most</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "0.85rem", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="var(--secondary)" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "4px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}><strong style={{ color: "#ffffff" }}>Roof insurance claims help</strong> – guidance to simplify the process</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "0.85rem", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="var(--secondary)" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "4px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}><strong style={{ color: "#ffffff" }}>Metal and synthetic roofing</strong> – durable, modern, and stylish choices</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "0.85rem", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="var(--secondary)" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "4px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}><strong style={{ color: "#ffffff" }}>Bathroom remodeling</strong> – updates that blend function and comfort</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px", paddingBottom: "0.85rem", borderBottom: "1px solid rgba(255, 255, 255, 0.03)" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="var(--secondary)" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "4px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}><strong style={{ color: "#ffffff" }}>Kitchen remodeling</strong> – from minor upgrades to full renovations</span>
                  </li>
                  <li style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="var(--secondary)" style={{ width: "16px", height: "16px", flexShrink: 0, marginTop: "4px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}><strong style={{ color: "#ffffff" }}>Whole-home remodeling</strong> – tailored solutions to bring your vision to life</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section difference-section" style={{ borderTop: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.01)" }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: "800px", margin: "0 auto 4rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Why Homeowners Trust Us</span>
            <h2 style={{ marginBottom: "1.5rem" }}>Why Choose Born Again Home Remodeling and Roofing?</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", lineHeight: "1.65" }}>
              {"We’ve built a reputation as one of Mississippi’s leading roofing and remodeling companies because we treat every project as if it were our own home. From high-quality materials to skilled craftsmanship, every detail matters. Our team is here to protect your home, improve your living spaces, and give you confidence that your investment will last for years to come."}
            </p>
          </div>
          
          <div className="difference-grid">
            
            <div className="double-bezel-wrapper">
              <div className="double-bezel-inner diff-card" style={{ padding: "3rem 2.5rem" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 8H7" />
                  </svg>
                </div>
                <h3 style={{ color: "#ffffff", fontSize: "1.35rem", fontWeight: "800", marginBottom: "1rem" }}>Faith & Integrity</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: "1.7" }}>
                  {"As a Christian-owned business, "}<strong>Born Again Home Remodeling and Roofing</strong>{" is built on honesty, integrity, and service. We treat every home as if it were our own, focusing on your needs first—not profits. Our goal is to earn your trust and deliver results that honor both your home and our values."}
                </p>
              </div>
            </div>
            
            <div className="double-bezel-wrapper">
              <div className="double-bezel-inner diff-card" style={{ padding: "3rem 2.5rem" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </div>
                <h3 style={{ color: "#ffffff", fontSize: "1.35rem", fontWeight: "800", marginBottom: "1rem" }}>Skilled Craftsmanship</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: "1.7" }}>
                  {"We believe strong homes start with strong work. That's why "}<strong>Born Again Home Remodeling and Roofing</strong>{" uses durable, industry-leading materials and proven installation techniques. Our experienced team handles every detail with precision, ensuring your roof or remodel not only looks beautiful but also protects and performs for years to come."}
                </p>
              </div>
            </div>
            
            <div className="double-bezel-wrapper">
              <div className="double-bezel-inner diff-card" style={{ padding: "3rem 2.5rem" }}>
                <div className="specialty-icon-wrapper">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h3 style={{ color: "#ffffff", fontSize: "1.35rem", fontWeight: "800", marginBottom: "1rem" }}>Dedicated Service</h3>
                <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.98rem", lineHeight: "1.7" }}>
                  {"From the first consultation to the final walkthrough, "}<strong>Born Again Home Remodeling and Roofing</strong>{" puts customer care at the center of every project. We provide clear communication, reliable timelines, and respectful crews. Our commitment doesn't stop when the work is done—we're here to support you long after the project is complete."}
                </p>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="section values-section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container narrow-container">
          <h3 className="values-title" style={{ color: "#ffffff" }}>Our Three Core Values</h3>
          <div className="editorial-values-list">
            
            <div className="editorial-value-item">
              <span className="editorial-value-num">01</span>
              <div className="editorial-value-content">
                <h3 style={{ color: "#ffffff" }}>Faith</h3>
                <p>{"We operate our business with a servant's heart, striving to honor God through our work ethic, respect, and character."}</p>
              </div>
            </div>
            
            <div className="editorial-value-item">
              <span className="editorial-value-num">02</span>
              <div className="editorial-value-content">
                <h3 style={{ color: "#ffffff" }}>Integrity</h3>
                <p>{"No hidden fees, no unnecessary repairs, and no shortcuts. We provide clear, accurate inspections and estimates to protect your family and home."}</p>
              </div>
            </div>
            
            <div className="editorial-value-item">
              <span className="editorial-value-num">03</span>
              <div className="editorial-value-content">
                <h3 style={{ color: "#ffffff" }}>Craftsmanship</h3>
                <p>{"Our technicians are certified professionals trained in standard-compliant structural framing, flashing, and installations, ensuring your project stands for decades."}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Owner Section */}
      <section className="section owner-section">
        <div className="container">
          <div className="owner-grid">
            
            <div className="double-bezel-wrapper">
              <div className="double-bezel-inner owner-quote-card" style={{ padding: "3rem 2.5rem", position: "relative" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.15, position: "absolute", top: "2rem", left: "2.5rem" }}>
                  <path d="M12 2v20M17 8H7" />
                </svg>
                <p className="owner-quote-text" style={{ fontStyle: "italic", fontSize: "1.15rem", lineHeight: "1.7", color: "var(--text)", marginTop: "1rem" }}>
                  {"\"Where faith, craftsmanship, and neighborly care come together. We treat every home as if it were our own, focusing on your needs first—not profits.\""}
                </p>
                <div className="owner-meta" style={{ marginTop: "2rem" }}>
                  <span className="owner-signature" style={{ display: "block", fontFamily: "var(--font-plus-jakarta), cursive, sans-serif", fontSize: "1.5rem", fontWeight: "700", fontStyle: "italic", color: "var(--secondary)", letterSpacing: "-0.02em" }}>David Dilmore</span>
                  <span className="owner-title" style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "4px" }}>Owner & Founder</span>
                </div>
              </div>
            </div>

            <div className="owner-story-text">
              <h3>A Letter From Our Owner</h3>
              <p>
                {"Welcome to Born Again Home Remodeling and Roofing. When I founded this business in 2007, I wanted to build more than a contracting service—I wanted to build a company our neighbors in Florence, Jackson, and surrounding Central Mississippi could depend on for honesty and quality."}
              </p>
              <p>
                {"For the last 19 years, we've lived out that commitment on every roof, remodel, and fence we install. We believe that true craftsmanship starts with structural integrity and ends with complete clean-up and satisfaction. When we step onto your property, we are there to serve you and protect your family's investment."}
              </p>
              <p>
                {"Thank you for considering us for your home. We look forward to showing you the Born Again difference."}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* High-Impact CTA Section */}
      <section className="about-cta-section">
        <div className="container">
          <div className="double-bezel-wrapper about-cta-card">
            <div className="double-bezel-inner" style={{ padding: "3.5rem 2.5rem", textAlign: "center" }}>
              <span className="eyebrow" style={{ color: "var(--secondary)" }}>Get In Touch</span>
              <h2>Ready to Transform Your Home?</h2>
              <p>
                {"Let Born Again Home Remodeling and Roofing show you why so many families in Jackson, MS, trust us with their homes. Call us today for a free, honest inspection and estimate."}
              </p>
              <div className="about-cta-buttons">
                <a href="tel:6015736178" className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: "18px", height: "18px", marginRight: "8px", verticalAlign: "middle", display: "inline-block" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a20.373 20.373 0 0 1-7.147-7.147c-.453-.44-.287-.927.09-1.21l1.293-.97a1.125 1.125 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                  <span>Call (601) 573-6178</span>
                </a>
                <Link href="/contact-us" className="btn btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: "18px", height: "18px", marginRight: "8px", verticalAlign: "middle", display: "inline-block" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                  </svg>
                  <span>Book Free Estimate</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
