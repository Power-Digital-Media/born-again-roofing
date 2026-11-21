import React from "react";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import TrustedBrands from "@/components/TrustedBrands";

export const metadata: Metadata = {
  title: {
    absolute: "Free Roof & Remodeling Inspection | Jackson & Brandon, MS",
  },
  description:
    "Book your 100% free on-site roof inspection or home remodeling estimate in Brandon, Florence, Madison & Jackson, MS. Same-week scheduling: (601) 573-6178.",
  alternates: {
    canonical: "/contact-us/",
  },
};

export default function ContactUsPage() {
  return (
    <>
      <LocalBusinessSchema
        pageTitle="Contact Us — Free Roof & Remodeling Inspection"
        pageDescription="Book your free on-site roof inspection or home remodeling estimate across Jackson, Brandon, Florence, and Madison, MS."
        path="/contact-us/"
      />

      {/* Compact Hero so the Estimate Form appears immediately above the fold on mobile */}
      <section className="service-hero" style={{ padding: "4.5rem 0 2rem" }}>
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">5.0★ Rated · Same-Week Scheduling</span>
          <h1>Get Your Free Roof or Remodeling Estimate</h1>
          <p className="hero-subtext" style={{ marginBottom: "0.75rem" }}>
            {"Honest on-site inspections across Florence, Brandon, Madison & Jackson, MS—or call us directly at "}
            <a
              href="tel:6015736178"
              style={{ color: "var(--secondary)", fontWeight: 800 }}
            >
              (601) 573-6178
            </a>
            {"."}
          </p>
        </div>
      </section>

      {/* Contact Form First on Mobile & Desktop for Maximum Conversion Engagement */}
      <section className="section" style={{ paddingTop: "2rem" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2.5rem",
              maxWidth: "1020px",
              margin: "0 auto",
            }}
          >
            <div>
              <ContactForm defaultService="Roof Replacement" />
            </div>

            <div className="double-bezel-wrapper">
              <div
                className="double-bezel-inner"
                style={{
                  padding: "2.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.75rem",
                }}
              >
                <div>
                  <h4
                    style={{
                      color: "var(--secondary)",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Call Directly
                  </h4>
                  <a
                    href="tel:6015736178"
                    style={{
                      fontSize: "1.55rem",
                      fontWeight: 800,
                      color: "#ffffff",
                      textDecoration: "none",
                    }}
                  >
                    (601) 573-6178
                  </a>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-muted)",
                      marginTop: "0.35rem",
                    }}
                  >
                    Speak directly with David Dilmore or an on-duty estimator.
                  </p>
                </div>
                <div>
                  <h4
                    style={{
                      color: "var(--secondary)",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Service Area
                  </h4>
                  <p style={{ color: "var(--text-muted)", lineHeight: "1.6" }}>
                    Florence (HQ), Brandon, Flowood, Jackson, Madison, Ridgeland,
                    Pearl, Clinton, Byram, Vicksburg, and surrounding Central
                    Mississippi.
                  </p>
                </div>
                <div>
                  <h4
                    style={{
                      color: "var(--secondary)",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Business Hours
                  </h4>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      color: "var(--text-muted)",
                      lineHeight: "1.6",
                    }}
                  >
                    <strong style={{ color: "#ffffff" }}>Monday - Friday:</strong>{" "}
                    8:00 AM - 5:00 PM <br />
                    <strong style={{ color: "#ffffff" }}>
                      Saturday - Sunday:
                    </strong>{" "}
                    Closed (24/7 Emergency Storm Tarping)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Material Partners Below Form */}
      <TrustedBrands />
    </>
  );
}
