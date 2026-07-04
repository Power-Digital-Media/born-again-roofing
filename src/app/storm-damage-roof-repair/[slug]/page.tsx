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
  "emergency-roof-repair": {
    title: "Emergency Roof Repair in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Roof damage doesn't wait for a convenient time, and neither should your repairs. At Born Again Home Remodeling and Roofing, we provide urgent emergency tarping and repairs in Jackson, MS. Call (601) 573-6178.",
    heading: "Emergency Roof Repair",
    subheading: "Urgent Storm Tarping and Leak Seals to Protect Your Home",
    bodyText: "Severe storms, fallen trees, and strong winds can compromise your roof instantly. Our emergency crew is ready to respond with immediate temporary seals, wood patches, and professional tarping to stop structural water leaks and protect your family and belongings before permanent repairs can be completed.",
    faqs: [
      {
        q: "What is included in an emergency roof repair service?",
        a: "Emergency service focuses on immediate hazard mitigation and waterproofing. This typically involves scaling the roof safely, clearing debris, applying professional-grade tarps, and sealing critical penetration points."
      },
      {
        q: "How soon can you install a permanent roof replacement after emergency tarping?",
        a: "Once the weather clears and your insurance adjuster completes their inspection, we can typically schedule and complete a full roof replacement within 3 to 7 days."
      }
    ]
  },
  "roof-patches-and-leak-repair": {
    title: "Roof Patches and Leak Repair in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Comprehensive Roof Patching and Leak Repair Services in Jackson, MS. From storm damage to aging materials, leaks can come from many sources. Call (601) 573-6178.",
    heading: "Roof Patches & Leak Repair",
    subheading: "Targeted Repair Solutions to Stop Water Penetration",
    bodyText: "From minor seam breaks to shingles decay, roof leaks can originate from plumbing vents, chimney flashings, valleys, or skylights. Our leak specialists use advanced tracking methods to locate the source of water intrusion and apply durable patches, rubber collars, and replacement shingles to guarantee a water-tight seal.",
    faqs: [
      {
        q: "How do you identify the source of a hidden roof leak?",
        a: "Our inspection team checks valleys, chimney flashing seals, skylight curbs, and plumbing vent collars, which are the most common points of origin for water entry."
      },
      {
        q: "Can a roof patch match the color of my existing shingles?",
        a: "We carry various shingle lines and styles to closely match the color of your existing roof, though some slight color differences may exist due to natural weathering."
      }
    ]
  },
  "hail-damage-roof-repair": {
    title: "Hail Damage Roof Repair in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Restore Your Roof with Expert Hail Damage Repair in Jackson, MS. Hailstorms can strike without warning. Call (601) 573-6178 today.",
    heading: "Hail Damage Roof Repair",
    subheading: "Identifying and Restoring Soft Spots and Cracks Caused by Hail",
    bodyText: "Hailstorms leave hidden damage across your roof by bruising asphalt shingles, fracturing fiberglass mats, and washing away protective stone granules. This accelerates shingle decay and leads to leaks over time. We provide expert inspection reports to document hail strikes and complete necessary repairs to restore your roof's warranty and safety.",
    faqs: [
      {
        q: "How does hail damage affect my shingles?",
        a: "Hail bruises the backing mat of shingles, fracturing the seal and causing protective granules to shed. Without granules, UV rays quickly decay the underlying asphalt, causing leaks."
      },
      {
        q: "My roof isn't leaking. Do I still need to check for hail damage?",
        a: "Yes. Hail damage is usually progressive and does not cause immediate leaks. However, failing to document it within your policy's claim window can leave you responsible for replacement costs later."
      }
    ]
  },
  "wind-damage-roof-repair": {
    title: "Wind Damage Roof Repair in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing offers wind damage roof repair in Jackson, MS. Call (601) 573-6178 for reliable storm roof service.",
    heading: "Wind Damage Roof Repair",
    subheading: "Fixing Shingle Blow-offs and Compromised Flashing Seals",
    bodyText: "High thunderstorm winds can lift shingles, break adhesive seals, and peel back ridge caps. When wind exposes the underlying wood decking, water has a direct path inside your home. We inspect for creases, missing shingles, and loose flashings, replacing damaged runs to prevent leaks and strengthen wind resistance.",
    faqs: [
      {
        q: "What wind speeds can standard roofing shingles withstand?",
        a: "Standard 3-tab shingles are rated for winds up to 60-70 mph. GAF architectural shingles installed by Born Again Roofing are rated for winds up to 110-130 mph with proper high-wind installation."
      },
      {
        q: "What should I do if I find shingles in my yard after high winds?",
        a: "Contact us immediately. Finding shingles on the ground means areas of your roof are exposed, leaving the wood decking vulnerable to rain and leaks."
      }
    ]
  },
  "roof-insurance-claims-help": {
    title: "Roof Insurance Claims Assistance in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Get professional assistance with your roof insurance claims in Jackson, MS. We provide detailed photo inspections. Call (601) 573-6178.",
    heading: "Roof Insurance Claims Assistance",
    subheading: "Professional Documentation and Support for Your Adjuster Inspections",
    bodyText: "Navigating roof insurance claims can be stressful and confusing. Our inspectors write detailed multi-point storm damage reports accompanied by clear photo evidence. We meet with your adjuster on-site during their inspection, ensuring all wind, hail, or debris damage is fully identified so you get the coverage your policy dictates.",
    faqs: [
      {
        q: "Do I have to pay my deductible for a storm damage roof replacement?",
        a: "Yes. Homeowners are legally required to pay their insurance deductible. Any contractor claiming to 'absorb' or waive a deductible may be engaging in insurance fraud. We offer fair, transparent pricing to work within your claim limits."
      },
      {
        q: "What happens if the insurance adjuster denies my roof claim?",
        a: "If denied, you can request a second inspection or seek re-evaluation. We can provide additional photo evidence, chimney checkups, and shingle creasing details to support your dispute."
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
      canonical: `/storm-damage-roof-repair/${slug}/`
    }
  };
}

import ServiceBentoGrid from "@/components/ServiceBentoGrid";
import ServicePinsCarousel from "@/components/ServicePinsCarousel";

const slugToPinMapping: Record<string, string[]> = {
  "emergency-roof-repair": ["Emergency Roof Repair", "Roof Repair"],
  "roof-patches-and-leak-repair": ["Roof Repair"],
  "hail-damage-roof-repair": ["Roof Repair", "Residential Roofing"],
  "wind-damage-roof-repair": ["Roof Repair", "Residential Roofing"],
  "roof-insurance-claims-help": ["Roof Inspection", "Roof Repair"]
};

const subpageBentoImages: Record<string, { url: string; location: string }[]> = {
  "emergency-roof-repair": [
    { url: "/images/wp_emergency-storm-emergency-roof-repair-1.png", location: "Jackson, MS" },
    { url: "/images/wp_storm-damage-home-roof-1.png", location: "Brandon, MS" }
  ],
  "roof-patches-and-leak-repair": [
    { url: "/images/wp_roof-patches-leaks-1.png", location: "Pearl, MS" },
    { url: "/images/wp_skylight-leak-repair-1.png", location: "Madison, MS" }
  ],
  "hail-damage-roof-repair": [
    { url: "/images/wp_hail-damage-roof-1.png", location: "Florence, MS" },
    { url: "/images/wp_roof-inspection2-1.png", location: "Ridgeland, MS" }
  ],
  "wind-damage-roof-repair": [
    { url: "/images/wp_wind-roof-damage-1.png", location: "Clinton, MS" },
    { url: "/images/wp_soffts-fascia-home-repair-1.png", location: "Byram, MS" }
  ],
  "roof-insurance-claims-help": [
    { url: "/images/wp_insurance-claims-1.png", location: "Canton, MS" },
    { url: "/images/wp_roof-inspection2-1.png", location: "Jackson, MS" }
  ]
};

export default async function StormDamageSubpage({ params }: PageProps) {
  const { slug } = await params;
  const page = subpages[slug];

  if (!page) {
    notFound();
  }

  const mappedCategories = slugToPinMapping[slug] || ["Roof Repair"];
  const overrideBentoImages = subpageBentoImages[slug];

  return (
    <>
      <LocalBusinessSchema pageTitle={page.title} pageDescription={page.description} path={`/storm-damage-roof-repair/${slug}/`} />

      {/* Hero */}
      <section className="section" style={{ background: "linear-gradient(rgba(15, 34, 64, 0.95), rgba(15, 34, 64, 0.95))", color: "#ffffff", padding: "5rem 0 4rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{ color: "var(--secondary)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.15em" }}>
            Storm Damage Specialty
          </span>
          <h1 style={{ color: "#ffffff", fontSize: "2.5rem", margin: "0.5rem 0 1rem" }}>{page.heading}</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>{page.subheading}</p>
        </div>
      </section>

      {/* Page Content */}
      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
          <div>
            <h2 style={{ color: "var(--primary)", fontSize: "1.8rem", marginBottom: "1rem" }}>Restoration & Care</h2>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.05rem", lineHeight: "1.6" }}>{page.bodyText}</p>
            
            <p style={{ marginBottom: "2rem" }}>
              Our team operates with high integrity. We provide clear, accurate inspection assessments so you can make informed decisions. We use top GAF materials to ensure your repaired or replaced roof resists future Mississippi storms.
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
