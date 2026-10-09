import React from "react";
import Link from "next/link";
import { Metadata } from "next";

import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ServiceCTA from "@/components/ServiceCTA";
import pinsData from "@/data/pins.json";

export const metadata: Metadata = {
  title: "Commercial Roofing in Jackson, MS",
  description: "Commercial roof repair, flat roof systems, silicone roof restoration, and metal roofing for Central Mississippi buildings. Call (601) 573-6178.",
  alternates: {
    canonical: "/commercial-roofing/"
  }
};

type Pin = { id: number | string; location: string; author: string; date: string; images?: string[] };

// Real completed jobs, read from the existing project records (read-only).
// Summaries are written from each record's description; photos and credits come from the record.
const featuredJobs: { id: string; label: string; summary: string }[] = [
  { id: "10", label: "TPO flat roof system", summary: "New 060 commercial-grade TPO flat roof system installed on a commercial building." },
  { id: "1", label: "Silicone roof coating", summary: "High-solid silicone roof coating applied to a skating rink roof." },
  { id: "13", label: "Silicone roof preparation", summary: "Roof pressure-washed and chemically cleaned to prepare for a GAF silicone roof system." },
  { id: "70", label: "Commercial storm damage inspection", summary: "Storm damage inspection of a commercial building to document the damage and plan repairs." },
  { id: "137968", label: "Metal roof replacement", summary: "Old metal roof system removed from a gym, then new insulation, R-panels and ridge installed." },
  { id: "157624", label: "Metal building repair", summary: "Damaged metal wall and roof panels removed and replaced on a metal building." }
];

const services = [
  {
    title: "Flat Roof Systems",
    body: "Installation and leak repair for low-slope and flat commercial roofs, including TPO membrane systems. Leak detection helps locate where water is getting in before repairs are scoped."
  },
  {
    title: "Silicone Roof Restoration",
    body: "For many aging flat and metal roofs, cleaning, preparing and coating the existing roof with a silicone system can be an alternative to a full tear-off. Whether it is the right choice depends on the condition of the roof and the system installed."
  },
  {
    title: "Metal Roof Replacement & Repair",
    body: "Replacement of worn metal roof systems, fastener and seam repair, and panel replacement on metal buildings, using exposed-fastener R-panel and standing seam systems."
  },
  {
    title: "Storm Damage Inspections",
    body: "Roof and exterior inspections after wind, hail or falling-tree damage, with clear documentation of what was found to support repair planning."
  }
];

export default function CommercialRoofingPage() {
  const pins = pinsData as unknown as Pin[];
  const jobs = featuredJobs
    .map((job) => ({ ...job, pin: pins.find((p) => String(p.id) === job.id) }))
    .filter((j) => j.pin && j.pin.images && j.pin.images.length > 0);

  return (
    <>
      <LocalBusinessSchema
        pageTitle="Commercial Roofing in Jackson, MS"
        pageDescription="Commercial roof repair, flat roof systems, silicone roof restoration, and metal roofing for Central Mississippi buildings."
        path="/commercial-roofing/"
      />

      {/* Hero */}
      <section className="service-hero" style={{ backgroundImage: "url('/images/job_295508.jpg')" }}>
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">Commercial &amp; Flat Roofing</span>
          <h1>Commercial Roofing in Jackson, MS</h1>
          <p className="hero-subtext">
            Flat roof systems, silicone roof restoration, metal roof replacement, and storm damage inspections for businesses and buildings across Central Mississippi.
          </p>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "2rem" }}>
            <Link href="/contact-us/" className="btn btn-primary">Request a Roofing Estimate</Link>
            <a href="tel:6015736178" className="btn btn-outline">Call (601) 573-6178</a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div className="text-center" style={{ marginBottom: "2.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>What We Handle</span>
            <h2>Commercial Roofing Services</h2>
            <p style={{ maxWidth: "700px", margin: "1rem auto 0" }}>
              Every commercial roofing estimate starts with an on-site look at the roof. We look at the roof&apos;s condition and the source of any leaks, then explain the repair, restoration and replacement options. Warranty availability depends on the system installed and the manufacturer&apos;s terms.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "1.5rem" }}>
            {services.map((s) => (
              <div key={s.title} className="double-bezel-wrapper">
                <div className="double-bezel-inner" style={{ padding: "2rem" }}>
                  <h3 style={{ color: "#ffffff", marginBottom: "0.75rem" }}>{s.title}</h3>
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.65 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real project examples */}
      <section className="section section-alt" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: "1100px" }}>
          <div className="text-center" style={{ marginBottom: "2.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Recent Work</span>
            <h2>Commercial &amp; Flat Roof Projects</h2>
            <p style={{ maxWidth: "700px", margin: "1rem auto 0" }}>
              Completed jobs documented by our technicians. Each links to the full project record with photos.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {jobs.map(({ id, label, summary, pin }) => (
              <Link key={id} href={`/pin-page/?id=${id}`} className="double-bezel-wrapper" style={{ textDecoration: "none" }}>
                <div className="double-bezel-inner" style={{ padding: 0, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pin!.images![0]}
                    alt={`${label} in ${pin!.location}`}
                    loading="lazy"
                    style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
                  />
                  <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--secondary)" }}>
                      {pin!.location} · {pin!.date}
                    </span>
                    <h3 style={{ color: "#ffffff", margin: "0.4rem 0 0.5rem", fontSize: "1.15rem" }}>{label}</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>{summary}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.75rem", marginBottom: 0 }}>
                      Technician: {pin!.author}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Related pages */}
      <section className="section">
        <div className="container text-center" style={{ maxWidth: "800px" }}>
          <h2>Related Roofing Services</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "1.5rem 0 0", display: "flex", flexWrap: "wrap", gap: "0.75rem 1.5rem", justifyContent: "center" }}>
            <li><Link href="/metal-roofing-repair-and-installation/" className="service-link">Metal Roofing</Link></li>
            <li><Link href="/storm-damage-roof-repair/" className="service-link">Storm Damage Repair</Link></li>
            <li><Link href="/residential-roofing/roof-inspections/" className="service-link">Roof Inspections</Link></li>
            <li><Link href="/residential-roofing/" className="service-link">Residential Roofing</Link></li>
          </ul>
        </div>
      </section>

      <ServiceCTA />
    </>
  );
}
