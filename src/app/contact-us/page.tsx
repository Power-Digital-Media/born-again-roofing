import React from "react";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import TrustedBrands from "@/components/TrustedBrands";

export const metadata: Metadata = {
  title: "Contact Us | Born Again Home Remodeling and Roofing",
  description: "Get in touch with Born Again Home Remodeling and Roofing. We offer free estimates for roofing, siding, and remodeling across Jackson, MS. Call (601) 573-6178.",
  alternates: {
    canonical: "/contact-us/"
  }
};

export default function ContactUsPage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Contact Us" pageDescription="Get in touch with Born Again Home Remodeling and Roofing." path="/contact-us/" />

      {/* Hero */}
      <section className="service-hero">
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">Get In Touch</span>
          <h1>Contact Our Team</h1>
          <p className="hero-subtext">
            {"We're here to serve you. Book your free estimate or send us a message below."}
          </p>

          <div style={{ marginTop: "2.5rem", textAlign: "center", maxWidth: "520px" }}>
            <p
              style={{ fontStyle: "italic", fontSize: "0.95rem", lineHeight: "1.7", color: "rgba(255, 255, 255, 0.75)", margin: "0 0 0.5rem", fontWeight: "400" }}
              dangerouslySetInnerHTML={{ __html: `&ldquo;<em>Ask</em> and it will be given to you; <em>seek</em> and you will find; <em>knock</em> and the door will be opened to you.&rdquo;` }}
            />
            <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              — Matthew 7:7
            </span>
          </div>
        </div>
      </section>

      {/* Trusted Material Partners */}
      <TrustedBrands />

      {/* Contact Info + Form */}
      <section className="section">
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto 3rem", textAlign: "center" }}>
            <h2 style={{ color: "var(--primary)", fontSize: "1.8rem", marginBottom: "1rem" }}>Reach Out Today</h2>
            <p style={{ marginBottom: "2rem", fontSize: "1.05rem", lineHeight: "1.7", color: "var(--text-muted)" }}>
              Whether you have an active storm leak, need an inspection sheet for your insurance adjuster, or are ready to schedule custom kitchen cabinet remodeling, our team is ready to help.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem", maxWidth: "1000px", margin: "0 auto" }}>
            {/* Contact Details */}
            <div className="double-bezel-wrapper">
              <div className="double-bezel-inner" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div>
                  <h4 style={{ color: "var(--secondary)", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Call Directly</h4>
                  <a href="tel:6015736178" style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ffffff", textDecoration: "none" }}>
                    (601) 573-6178
                  </a>
                </div>
                <div>
                  <h4 style={{ color: "var(--secondary)", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Service Area</h4>
                  <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>Jackson Metro Area, Brandon, Flowood, Madison, Ridgeland, Pearl, Clinton, Vicksburg, and surrounding Central Mississippi.</p>
                </div>
                <div>
                  <h4 style={{ color: "var(--secondary)", fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Business Hours</h4>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                    <strong style={{ color: "#ffffff" }}>Monday - Friday:</strong> 8:00 AM - 5:00 PM <br />
                    <strong style={{ color: "#ffffff" }}>Saturday - Sunday:</strong> Closed (24/7 Emergency Tarping)
                  </p>
                </div>
              </div>
            </div>

            {/* Estimate Form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
