import React from "react";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export const metadata: Metadata = {
  title: "Terms and Conditions | Born Again Home Remodeling and Roofing",
  description: "Read the Terms and Conditions of Born Again Home Remodeling and Roofing in Jackson, MS. Call (601) 573-6178 for details.",
  alternates: {
    canonical: "/terms-and-conditions/"
  }
};

export default function TermsAndConditionsPage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Terms and Conditions" pageDescription="Read the Terms and Conditions of Born Again Home Remodeling and Roofing in Jackson, MS." path="/terms-and-conditions/" />

      {/* Hero */}
      <section className="section" style={{ background: "linear-gradient(rgba(15, 34, 64, 0.95), rgba(15, 34, 64, 0.95))", color: "#ffffff", padding: "4rem 0 3rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ color: "#ffffff", fontSize: "2.25rem" }}>Terms & Conditions</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1rem", marginTop: "0.5rem" }}>
            Last updated: July 3, 2026
          </p>
        </div>
      </section>

      {/* Terms Text */}
      <section className="section">
        <div className="container" style={{ maxWidth: "800px", margin: "0 auto", lineHeight: "1.7" }}>
          <p style={{ marginBottom: "1.5rem" }}>
            Welcome to www.bornagainroofing.com. By accessing our website, booking an estimate, or scheduling services, you agree to comply with and be bound by the following Terms and Conditions.
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>1. Estimate Bookings & Scheduling</h3>
          <p style={{ marginBottom: "1.5rem" }}>
            Estimate requests submitted via our forms are subject to review and confirmation by our team. We reserve the right to decline booking requests for areas outside our active service boundaries or on days we are closed (Sundays).
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>2. SMS Communications & Consent</h3>
          <p style={{ marginBottom: "1.5rem" }}>
            By checking the consent box or submitting form data including a cell phone number, you explicitly agree to receive SMS communications. These communications are restricted to: appointment scheduling, booking confirmations, estimate reminders, follow-ups, and coordination of contracted roofing or remodeling services. Msg & data rates may apply.
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>3. Intellectual Property</h3>
          <p style={{ marginBottom: "1.5rem" }}>
            All website content, visual tree designs, custom logos, text, project pins documentation, and layout designs are the property of Born Again Home Remodeling and Roofing LLC and may not be reproduced without express written consent.
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>4. Governing Law</h3>
          <p style={{ marginBottom: "1.5rem" }}>
            These terms shall be governed by and construed in accordance with the laws of the State of Mississippi, without regard to conflict of law principles.
          </p>

          <h3 style={{ color: "var(--primary)", margin: "1.5rem 0 0.75rem" }}>5. Contact Us</h3>
          <p>
            If you have any questions about these Terms, please contact us at <a href="tel:6015736178" style={{ fontWeight: 700, color: "var(--secondary)" }}>(601) 573-6178</a>.
          </p>
        </div>
      </section>
    </>
  );
}
