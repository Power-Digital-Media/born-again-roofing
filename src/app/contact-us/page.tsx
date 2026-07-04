import React from "react";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

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
      <section className="section" style={{ background: "linear-gradient(rgba(15, 34, 64, 0.95), rgba(15, 34, 64, 0.95))", color: "#ffffff", padding: "5rem 0 4rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ color: "#ffffff", fontSize: "2.5rem", marginBottom: "1rem" }}>Contact Our Team</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            {"We're here to serve you. Book your free estimate or send us a message below."}
          </p>
        </div>
      </section>

      {/* Form & Info Grid */}
      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem" }}>
          <div>
            <h2 style={{ color: "var(--primary)", marginBottom: "1rem" }}>Reach Out Today</h2>
            <p style={{ marginBottom: "1.5rem" }}>
              Whether you have an active storm leak, need an inspection sheet for your insurance adjuster, or are ready to schedule custom kitchen cabinet remodeling, our team is ready to help.
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", margin: "2rem 0" }}>
              <div>
                <h4 style={{ color: "var(--primary)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Call Directly:</h4>
                <a href="tel:6015736178" style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--secondary)" }}>
                  (601) 573-6178
                </a>
              </div>
              <div>
                <h4 style={{ color: "var(--primary)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Service Area:</h4>
                <p>Jackson Metro Area, Brandon, Flowood, Madison, Ridgeland, Pearl, Clinton, Vicksburg, and surrounding Central Mississippi.</p>
              </div>
              <div>
                <h4 style={{ color: "var(--primary)", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Business Hours:</h4>
                <p style={{ fontSize: "0.95rem" }}>
                  <strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM <br />
                  <strong>Saturday - Sunday:</strong> Closed (24/7 Emergency Tarping)
                </p>
              </div>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
