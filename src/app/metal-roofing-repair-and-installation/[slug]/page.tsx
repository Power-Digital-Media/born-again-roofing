import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import TrustedBrands from "@/components/TrustedBrands";
import ServiceCTA from "@/components/ServiceCTA";

interface SubpageDetail {
  title: string;
  description: string;
  heading: string;
  subheading: string;
  bodyText: string;
  faqs: { q: string; a: string }[];
}

const subpages: Record<string, SubpageDetail> = {
  "standing-seam-metal-roof-installation": {
    title: "Standing Seam Metal Roof Installation in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Expert standing seam metal roof installation in Jackson, MS by Born Again Home Remodeling and Roofing. Call (601) 573-6178 today.",
    heading: "Standing Seam Metal Roof Installation",
    subheading: "Premium Concealed Fastener Metal Panels for Lifetime Security",
    bodyText: "Standing seam metal roofing features interlocking metal panels that run from the ridge down to the eaves. The seams are joined by raised interlocking joints (standing seams) containing concealed fasteners. Because the screws are hidden beneath the metal panels, they are protected from weather exposure, eliminating the most common cause of leaks in traditional metal roofs.",
    faqs: [
      {
        q: "What are the benefits of standing seam over exposed fastener metal roofs?",
        a: "Standing seam metal roofs completely hide the mounting screws under the seams. Exposed fastener roofs have thousands of exposed screws and rubber washers that can dry rot, back out, or leak over time, whereas standing seam represents a lifetime, virtually leak-free system."
      },
      {
        q: "What is the cost comparison between standing seam and shingles?",
        a: "Standing seam metal roofs have a higher initial cost than asphalt shingles (typically 2 to 3 times more). However, because they last 50+ years and lower cooling bills, they offer a superior return on investment over time."
      }
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(subpages).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = subpages[slug];
  if (!page) return {};
  
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/metal-roofing-repair-and-installation/${slug}/`
    }
  };
}

import ServiceBentoGrid from "@/components/ServiceBentoGrid";
import ServicePinsCarousel from "@/components/ServicePinsCarousel";

const subpageBentoImages: Record<string, { url: string; location: string }[]> = {
  "standing-seam-metal-roof-installation": [
    { url: "/images/wp_metal-roof-standing-seam-1.png", location: "Jackson, MS" },
    { url: "/images/wp_Roofing-d.jpg", location: "Brandon, MS" }
  ]
};

export default async function MetalSubpage({ params }: PageProps) {
  const { slug } = await params;
  const page = subpages[slug];

  if (!page) {
    notFound();
  }

  const mappedCategories = ["Metal Roofing"];
  const overrideBentoImages = subpageBentoImages[slug];

  return (
    <>
      <LocalBusinessSchema pageTitle={page.title} pageDescription={page.description} path={`/metal-roofing-repair-and-installation/${slug}/`} />

      {/* Hero */}
      <section className="service-hero">
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">
            Metal Roofing Specialty
          </span>
          <h1>{page.heading}</h1>
          <p className="hero-subtext">{page.subheading}</p>
          <div style={{ marginTop: "2.5rem", textAlign: "center", maxWidth: "520px" }}>
            <p
              style={{ fontStyle: "italic", fontSize: "0.95rem", lineHeight: "1.7", color: "rgba(255, 255, 255, 0.75)", margin: "0 0 0.5rem", fontWeight: "400" }}
              dangerouslySetInnerHTML={{ __html: `&ldquo;<em>Enlarge</em> the place of your tent, stretch your tent curtains wide, do not hold back; <em>strengthen your stakes</em>.&rdquo;` }}
            />
            <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              — Isaiah 54:2
            </span>
          </div>
        </div>
      </section>

      {/* Trusted Material Partners */}
      <TrustedBrands />

      {/* Page Content */}
      <section className="section">
        <div className="container">
            <h2 style={{ color: "var(--primary)", fontSize: "1.8rem", marginBottom: "1rem" }}>Lifetime Security & Design</h2>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.05rem", lineHeight: "1.6" }}>{page.bodyText}</p>
            
            <p style={{ marginBottom: "2rem" }}>
              Our expert technicians are trained in the specialized installation of standing seam metal roofing, using correct clip systems that allow panels to expand and contract naturally as temperatures change.
            </p>

            {/* Dynamic Local Case Studies Bento Grid */}
            <ServiceBentoGrid services={mappedCategories} overrideImages={overrideBentoImages} />

            {/* Dynamic Local Case Studies Carousel */}
            <ServicePinsCarousel services={mappedCategories} />

            {/* AEO GEO FAQ Blocks */}
            <div style={{ marginTop: "3rem" }}>
              <h3 style={{ color: "var(--primary)", fontSize: "1.4rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                Common Questions & Direct Answers
              </h3>
              {page.faqs.map((faq, index) => (
                <div key={index} className="qa-block">
                  <h4 className="qa-question">{faq.q}</h4>
                  <p className="qa-answer">{faq.a}</p>
                </div>
              ))}
            </div>
        </div>
      </section>
      <ServiceCTA />
    </>
  );
}
