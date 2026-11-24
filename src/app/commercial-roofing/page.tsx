import React from "react";
import Link from "next/link";
import { Metadata } from "next";

import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ServiceCTA from "@/components/ServiceCTA";
import RoofingHeroActions from "@/components/RoofingHeroActions";
import pinsData from "@/data/pins.json";

export const metadata: Metadata = {
  title: {
    absolute: "Commercial & Flat Roofing Jackson, MS | TPO, Metal & Silicone",
  },
  description:
    "5.0★ commercial roof repair, TPO flat roofs, GAF silicone roof coatings & metal roof replacement across Jackson, Flowood, Pearl & Brandon, MS: (601) 573-6178.",
  alternates: {
    canonical: "/commercial-roofing/",
  },
};

type Pin = { id: number | string; location: string; author: string; date: string; images?: string[] };

const featuredJobs: { id: string; label: string; summary: string }[] = [
  { id: "10", label: "TPO flat roof system", summary: "New 060 commercial-grade TPO flat roof system installed on a commercial building." },
  { id: "1", label: "Silicone roof coating", summary: "High-solids silicone roof coating applied to a commercial skating rink roof in Pearl, MS." },
  { id: "13", label: "Silicone roof preparation", summary: "Commercial roof pressure-washed and chemically cleaned to prepare for a GAF silicone roof system." },
  { id: "70", label: "Commercial storm damage inspection", summary: "Storm damage inspection of a commercial building in Flowood, MS to document leaks and plan repairs." },
  { id: "137968", label: "Gymnasium metal roof replacement", summary: "Old metal roof system removed from a gym, then new insulation, R-panels, and ridge installed." },
  { id: "157624", label: "Metal building panel repair", summary: "Damaged metal wall and roof panels removed and replaced on a commercial metal building." }
];

const services = [
  {
    title: "TPO & Low-Slope Flat Roof Systems",
    body: "Installation, seam welding, flashing restoration, and leak repair for low-slope and flat commercial roofs—including 60-mil commercial TPO membranes engineered to reflect Mississippi summer heat."
  },
  {
    title: "GAF High-Solids Silicone Roof Coatings",
    body: "For structurally sound aging flat, modified bitumen, or metal commercial roofs, pressure-washing, seam reinforcing, and applying a monolithic silicone coating stops leaks and extends service life without disruptive tear-off."
  },
  {
    title: "Commercial Metal & R-Panel Replacement",
    body: "Full replacement of weathered commercial metal roofs on warehouses, churches, gyms, and retail buildings, plus fastener retrofits, curb flashing, and storm-damaged panel replacement."
  },
  {
    title: "Commercial Storm & Leak Diagnostics",
    body: "Detailed moisture, parapet wall, HVAC curb, scupper, and roof-drain inspections after hail or high winds across Jackson, Flowood, Pearl, Brandon, Madison, and Florence, MS."
  }
];

const commercialFaqs = [
  {
    q: "When is a silicone roof coating better than a full commercial flat roof tear-off?",
    a: "If the underlying roof deck and insulation are still structurally sound and dry across most of the building, a high-solids GAF silicone restoration system seals seams, flashings, and fastener heads into one seamless waterproof membrane at a fraction of tear-off cost—with zero interior business disruption. If core checks show saturated insulation or rotted decking, a full TPO or metal replacement is the safer long-term investment."
  },
  {
    q: "What types of commercial buildings do you service in Central Mississippi?",
    a: "Our Florence-based commercial crews service retail centers, medical and office buildings, churches, gymnasiums, warehouses, industrial metal buildings, and multi-unit properties along Lakeland Drive in Flowood, US-80 in Pearl and Brandon, I-55 in Jackson, Ridgeland, and Madison, and US-49 in Rankin County."
  },
  {
    q: "Can you repair active flat roof leaks around HVAC curbs, parapet walls, and drains?",
    a: "Yes. Over 80% of commercial flat roof leaks originate at rooftop penetrations—HVAC pitch pockets, pipe boots, parapet wall coping, scuppers, and clogged internal drains—rather than the open field membrane. We trace water entry to its source and rebuild the flashing or membrane transition cleanly."
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
        pageTitle="Commercial & Flat Roofing in Jackson, MS"
        pageDescription="Commercial roof repair, TPO flat roof systems, GAF silicone roof coatings, and metal building roofing across Jackson, Flowood, Pearl, Brandon & Central MS."
        path="/commercial-roofing/"
        serviceName="Commercial & Flat Roofing"
      />

      {/* Hero */}
      <section className="service-hero" style={{ backgroundImage: "url('/images/job_295508.webp')" }}>
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">Commercial &amp; Flat Roofing</span>
          <h1>Commercial &amp; Flat Roofing in Jackson, MS</h1>
          <p className="hero-subtext">
            60-mil TPO flat roof systems, GAF high-solids silicone roof coatings, metal building roof replacement, and leak diagnostics for businesses, churches, and facilities across Central Mississippi.
          </p>
          <RoofingHeroActions
            defaultService="Commercial Roofing"
            ctaLabel="Get Commercial Roof Estimate"
          />
        </div>
      </section>

      {/* Services */}
      <section className="section">
        <div className="container" style={{ maxWidth: "1000px" }}>
          <div className="text-center" style={{ marginBottom: "2.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Commercial Capabilities</span>
            <h2>Flat, Silicone &amp; Metal Commercial Roofing</h2>
            <p style={{ maxWidth: "740px", margin: "1rem auto 0", color: "var(--text-muted)", lineHeight: 1.7 }}>
              Every commercial roofing estimate starts with an on-site walk of your roof deck, parapet walls, HVAC curbs, and drainage paths across{" "}
              <Link href="/areas-we-service/jackson-ms/" className="service-link">Jackson</Link>,{" "}
              <Link href="/areas-we-service/flowood-ms/" className="service-link">Flowood</Link>,{" "}
              <Link href="/areas-we-service/pearl-ms/" className="service-link">Pearl</Link>,{" "}
              <Link href="/areas-we-service/brandon-ms/" className="service-link">Brandon</Link>, and{" "}
              <Link href="/areas-we-service/madison-ms/" className="service-link">Madison, MS</Link>. We document every leak source with photos and provide written options for targeted repair, silicone coating restoration, or full membrane/metal replacement.
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
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Verified Field Log</span>
            <h2>Completed Commercial &amp; Flat Roof Projects</h2>
            <p style={{ maxWidth: "700px", margin: "1rem auto 0", color: "var(--text-muted)" }}>
              Completed commercial TPO, silicone restoration, and metal building jobs documented by our Central Mississippi crews.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {jobs.map(({ id, label, summary, pin }) => (
              <Link key={id} href={`/pin-page/?id=${id}`} rel="nofollow" prefetch={false} className="double-bezel-wrapper" style={{ textDecoration: "none" }}>
                <div className="double-bezel-inner" style={{ padding: 0, overflow: "hidden" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pin!.images![0]}
                    alt={`${label} in ${pin!.location}`}
                    width={640}
                    height={440}
                    loading="lazy"
                    decoding="async"
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

      {/* Commercial Roofing FAQ */}
      <section className="section" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container" style={{ maxWidth: "840px" }}>
          <div className="text-center" style={{ marginBottom: "2.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Property Manager &amp; Owner FAQ</span>
            <h2>Commercial &amp; Flat Roofing Questions</h2>
          </div>
          {commercialFaqs.map((faq, idx) => (
            <div key={idx} className="qa-block">
              <h3 className="qa-question">{faq.q}</h3>
              <p className="qa-answer">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related pages */}
      <section className="section section-alt" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container text-center" style={{ maxWidth: "800px" }}>
          <h2>Related Roofing Services</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: "1.5rem 0 0", display: "flex", flexWrap: "wrap", gap: "0.75rem 1.5rem", justifyContent: "center" }}>
            <li><Link href="/metal-roofing-repair-and-installation/" className="service-link">Metal Roofing Repair &amp; Systems</Link></li>
            <li><Link href="/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation/" className="service-link">Standing Seam Metal Roofs</Link></li>
            <li><Link href="/storm-damage-roof-repair/" className="service-link">Storm Damage Repair</Link></li>
            <li><Link href="/residential-roofing/roof-inspections/" className="service-link">Roof Inspections</Link></li>
            <li><Link href="/residential-roofing/" className="service-link">Residential Roofing</Link></li>
          </ul>
        </div>
      </section>

      <ServiceCTA defaultService="Commercial Roofing" />
    </>
  );
}
