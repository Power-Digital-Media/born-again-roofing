import React from "react";
import ContactForm from "./ContactForm";

export default function EmergencyCTA() {
  return (
    <section className="section emergency-cta-section">
      <div className="container" style={{ maxWidth: "800px" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span className="eyebrow" style={{ color: "#e53e3e" }}>Active Roof Leak or Damage?</span>
          <h2 style={{ fontSize: "2rem", fontWeight: "850", color: "#ffffff", marginTop: "0.5rem" }}>
            Get Immediate Tarping & Repair Crews Dispatched
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "1rem", maxWidth: "600px", margin: "1rem auto 0" }}>
            Submit our emergency response dispatch form below. Our storm inspector will be alerted and call you back immediately to coordinate tarping crews.
          </p>
        </div>

        <div id="emergency-dispatch-form" style={{ maxWidth: "680px", margin: "0 auto" }}>
          <ContactForm type="emergency" />
        </div>

        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <p style={{ fontSize: "1rem", color: "var(--text-muted)", margin: 0 }}>
            Need to talk to someone right now? Call our emergency storm hotline:
          </p>
          <a href="tel:6015736178" className="btn btn-primary btn-emergency" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "10px", padding: "12px 28px", textDecoration: "none", borderRadius: "30px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ width: "18px", height: "18px", display: "inline-block" }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a20.373 20.373 0 0 1-7.147-7.147c-.453-.44-.287-.927.09-1.21l1.293-.97a1.125 1.125 0 0 0 .417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            <strong>Call (601) 573-6178</strong>
          </a>
        </div>
      </div>
    </section>
  );
}
