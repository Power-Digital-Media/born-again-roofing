import React from "react";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "Privacy Policy | Born Again Home Remodeling and Roofing",
  description: "Read the Privacy Policy of Born Again Home Remodeling and Roofing in Jackson, MS. Call (601) 573-6178 with any questions about our services.",
  alternates: {
    canonical: "/privacy-policy/"
  }
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Privacy Policy" pageDescription="Read the Privacy Policy of Born Again Home Remodeling and Roofing in Jackson, MS." path="/privacy-policy/" />

      {/* Hero */}
      <section className="section" style={{ background: "linear-gradient(rgba(15, 34, 64, 0.95), rgba(15, 34, 64, 0.95))", color: "#ffffff", padding: "4rem 0 3rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ color: "#ffffff", fontSize: "2.25rem" }}>Privacy Policy</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1rem", marginTop: "0.5rem" }}>
            Last updated: July 3, 2026
          </p>
        </div>
      </section>

      {/* Policy Text */}
      <section className="section">
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.7" }}>
          <p style={{ marginBottom: "1.5rem" }}>
            Born Again Home Remodeling and Roofing LLC values your privacy. This Privacy Policy describes how we collect, use, and share information when you visit our website, www.bornagainroofing.com, or submit forms to receive estimates.
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>1. Information We Collect</h3>
          <p style={{ marginBottom: "1.5rem" }}>
            When you submit an estimate form or contact us, we collect your name, cell phone number, email address, and appointment details. We also collect usage statistics (such as clicks and pages visited) via Google Analytics to analyze and improve website performance.
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>2. How We Use Information</h3>
          <p style={{ marginBottom: "1.5rem" }}>
            We use your contact details to schedule estimates, send booking confirmations, send appointment reminders, follow up on quotes, and coordinate roofing or remodeling services.
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>3. SMS Communications</h3>
          <p style={{ marginBottom: "1.5rem" }}>
            {"By submitting your cell phone number on our contact forms, you agree to receive SMS text messages relating to booking confirmations, schedule shifts, and follow-ups. You may opt out of SMS communications at any time by replying \"STOP\"."}
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>4. Sharing Your Information</h3>
          <p style={{ marginBottom: "1.5rem" }}>
            We do not sell, rent, or share your personal information with third parties for marketing purposes. Contact information is only shared with our internal crew to coordinate service visits at your property.
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>5. Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please call us at <a href="tel:6015736178" style={{ fontWeight: 700, color: "var(--secondary)" }}>(601) 573-6178</a>.
          </p>
        </div>
      </section>
    </>
  );
}
