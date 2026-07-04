import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

interface SubpageDetail {
  title: string;
  description: string;
  heading: string;
  subheading: string;
  bodyText: string;
  faqs: { q: string; a: string }[];
}

const subpages: Record<string, SubpageDetail> = {
  "roof-repair": {
    title: "Roof Repair in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Trusted roof repair in Jackson, MS by Born Again Home Remodeling and Roofing. Call (601) 573-6178 for fast, reliable roof service.",
    heading: "Roof Repair in Jackson, MS",
    subheading: "Fast, Reliable, and Durable Solutions for Any Leak or Damage",
    bodyText: "Roof leaks and shingle damage can escalate quickly into costly interior repairs. At Born Again Home Remodeling and Roofing, our experienced repair technicians are skilled at identifying the exact root cause of roof issues. We patch leaks, seal flashing, replace damaged shingles, and secure ventilation structures to restore your roof's integrity.",
    faqs: [
      {
        q: "How much does a typical roof repair cost in Jackson, MS?",
        a: "The cost of a roof repair depends on the size of the area, shingles materials, and location. Minor repairs (such as sealing flashing or replacing a few shingles) range from $250 to $600. Major leak repairs or wood repairs may cost more."
      },
      {
        q: "Do you offer emergency roof repair services?",
        a: "Yes, we provide urgent leak sealing and temporary tarping services to protect your home from active storms before permanent repairs can be completed."
      }
    ]
  },
  "roof-installation": {
    title: "Roof Installation in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Build with Confidence Through Expert Roof Installation in Jackson, MS. A new GAF architectural roof is a top investment. Call (601) 573-6178.",
    heading: "Roof Installation in Jackson, MS",
    subheading: "Premium Quality Architectural Roofing Systems Built to Last",
    bodyText: "A new roof is one of the most important investments you can make for your home. We install state-of-the-art GAF architectural roofing systems that combine high-end aesthetic appeal with extreme durability. Our installation crew operates with clean prep, proper ventilation, and complete site cleanup, ensuring your project is done right the first time.",
    faqs: [
      {
        q: "What is the lifespan of a newly installed asphalt shingle roof?",
        a: "A professional architectural shingle roof installation typically lasts 25 to 30 years, depending on attic ventilation, storm exposure, and shingle quality."
      },
      {
        q: "Are your roof installers licensed and insured?",
        a: "Yes, Born Again Home Remodeling and Roofing is fully licensed, bonded, and insured in the state of Mississippi, providing complete peace of mind."
      }
    ]
  },
  "asphalt-shingle-roof-repair-and-replacement": {
    title: "Asphalt Shingle Roof Repair and Replacement in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing offers asphalt shingle roof repair and replacement in Jackson, MS. Call (601) 573-6178 today.",
    heading: "Asphalt Shingle Roof Repair & Replacement",
    subheading: "Traditional and Architectural Shingle Services in Central Mississippi",
    bodyText: "Asphalt shingles are the most widely used roofing material in Jackson, MS, due to their versatility and budget-friendly cost. Whether you have minor shingle blow-offs from high winds or need a complete tear-off and replacement, we offer GAF shingle systems in various colors and styles, backed by lifetime system warranties.",
    faqs: [
      {
        q: "What are architectural shingles compared to standard 3-tab shingles?",
        a: "Architectural shingles (laminated shingles) are thicker, consist of multiple layers, and provide a dimensional look. They offer higher wind ratings (up to 130 mph) and double the lifespan of traditional 3-tab shingles."
      },
      {
        q: "How can I tell if my asphalt shingles need to be replaced?",
        a: "Key signs include bald spots (loss of protective granules), curled or cracked shingle edges, moss or mold growth, and water leaks inside your attic."
      }
    ]
  },
  "roof-inspections": {
    title: "Roof Inspections in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing provides thorough roof inspections in Jackson, MS. Call (601) 573-6178 to schedule your inspection.",
    heading: "Roof Inspections in Jackson, MS",
    subheading: "Comprehensive Roof Checklists and Photo Documentation",
    bodyText: "Regular roof inspections prevent minor wear and tear from becoming major water leaks. We perform exhaustive multi-point inspections checking shingle integrity, flashing seals, attic ventilation, chimney structural integrity, and gutter pathways. We provide complete photo reports detailing any recommended maintenance or repairs.",
    faqs: [
      {
        q: "How often should I have my home's roof inspected?",
        a: "We recommend inspecting your roof at least once a year, and immediately following major hailstorms or severe wind events in the Jackson Metro Area."
      },
      {
        q: "Can a roof inspection help with my insurance claim?",
        a: "Yes, our inspectors write up detailed reports with photographic evidence, which provides the documentation needed to verify wind or hail damage to your adjuster."
      }
    ]
  },
  "soffit-and-fascia-repair": {
    title: "Soffit and Fascia Repair in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "At Born Again Home Remodeling and Roofing, we provide expert Soffit and Fascia Repair in Jackson, MS, and surrounding areas. Call (601) 573-6178.",
    heading: "Soffit & Fascia Repair in Jackson, MS",
    subheading: "Protecting Your Roof Edges and Maintaining Ventilation Path",
    bodyText: "Soffit and fascia boards protect the roof eaves and rafters from moisture and pest intrusion. When paint peels or gutters overflow, wood rot can compromise these areas. We repair and replace rotted wood fascia boards, install clean aluminum or vinyl wraps, and ensure soffit vents remain open for proper attic temperature regulation.",
    faqs: [
      {
        q: "What is the difference between soffit and fascia?",
        a: "Fascia is the vertical board facing outwards where gutters are mounted. Soffit is the horizontal under-hang portion underneath the eaves that contains vents to allow cool air into the attic."
      },
      {
        q: "How do rotted fascia boards affect my gutter system?",
        a: "Gutters are mounted directly onto the fascia. If the fascia wood is rotted, gutters can sag, pull away from the house, and cause water to pool near your foundation."
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
      canonical: `/residential-roofing/${slug}/`
    }
  };
}

import ServiceBentoGrid from "@/components/ServiceBentoGrid";
import ServicePinsCarousel from "@/components/ServicePinsCarousel";

const slugToPinMapping: Record<string, string[]> = {
  "roof-repair": ["Roof Repair"],
  "roof-inspections": ["Roof Inspection"],
  "roof-installation": ["Residential Roofing"],
  "asphalt-shingle-roof-repair-and-replacement": ["Residential Roofing", "Roof Repair"],
  "soffit-and-fascia-repair": ["Soffit & Fascia"]
};

const subpageBentoImages: Record<string, { url: string; location: string }[]> = {
  "roof-repair": [
    { url: "/images/wp_roofing-f.jpg", location: "Jackson, MS" },
    { url: "/images/wp_roof-patches-leaks-1.png", location: "Brandon, MS" }
  ],
  "roof-installation": [
    { url: "/images/wp_roofing-c.jpg", location: "Madison, MS" },
    { url: "/images/wp_roofing-h.jpg", location: "Pearl, MS" }
  ],
  "asphalt-shingle-roof-repair-and-replacement": [
    { url: "/images/wp_GaF.jpg", location: "Flowood, MS" },
    { url: "/images/wp_certainteed.jpg", location: "Ridgeland, MS" }
  ],
  "roof-inspections": [
    { url: "/images/wp_roof-inspection2-1.png", location: "Canton, MS" },
    { url: "/images/wp_insurance-claims-1.png", location: "Clinton, MS" }
  ],
  "soffit-and-fascia-repair": [
    { url: "/images/wp_soffts-fascia-home-repair-1.png", location: "Byram, MS" },
    { url: "/images/wp_Roofing-d.jpg", location: "Jackson, MS" }
  ]
};

export default async function ResidentialSubpage({ params }: PageProps) {
  const { slug } = await params;
  const page = subpages[slug];

  if (!page) {
    notFound();
  }

  const mappedCategories = slugToPinMapping[slug] || ["Residential Roofing"];
  const overrideBentoImages = subpageBentoImages[slug];

  return (
    <>
      <LocalBusinessSchema pageTitle={page.title} pageDescription={page.description} path={`/residential-roofing/${slug}/`} />

      {/* Hero */}
      <section className="section" style={{ background: "linear-gradient(rgba(15, 34, 64, 0.95), rgba(15, 34, 64, 0.95))", color: "#ffffff", padding: "5rem 0 4rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{ color: "var(--secondary)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.15em" }}>
            Residential Roofing Specialty
          </span>
          <h1 style={{ color: "#ffffff", fontSize: "2.5rem", margin: "0.5rem 0 1rem" }}>{page.heading}</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>{page.subheading}</p>
        </div>
      </section>

      {/* Page Content */}
      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
          <div>
            <h2 style={{ color: "var(--primary)", fontSize: "1.8rem", marginBottom: "1rem" }}>Our Process & Commitment</h2>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.05rem", lineHeight: "1.6" }}>{page.bodyText}</p>
            
            <p style={{ marginBottom: "2rem" }}>
              {"We believe in doing things right. We don't cut corners, we use the highest grade materials from trusted manufacturers, and we back all our work with warranties you can rely on."}
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
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
