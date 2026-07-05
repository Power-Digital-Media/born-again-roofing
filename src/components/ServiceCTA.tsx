import React from "react";
import Link from "next/link";

export default function ServiceCTA() {
  return (
    <section className="section service-cta-section">
      <div className="container" style={{ maxWidth: "680px" }}>
        <div className="double-bezel-wrapper">
          <div className="double-bezel-inner service-cta-inner">
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Get Started Today</span>
            <h2 className="service-cta-heading">Ready to Protect Your Investment?</h2>
            <p className="service-cta-text">
              Get a free, no-obligation estimate from our GAF-certified team. We&apos;ll assess your needs and provide a transparent quote — no pressure, no hidden fees.
            </p>
            <div className="service-cta-actions">
              <Link href="/contact-us" className="btn btn-primary btn-island">
                Request Free Estimate
                <span className="btn-icon-wrapper">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
              <a href="tel:6015736178" className="service-cta-phone">
                Or call <strong>(601) 573-6178</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
