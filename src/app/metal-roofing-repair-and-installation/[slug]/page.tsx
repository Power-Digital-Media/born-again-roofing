import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import TrustedBrands from "@/components/TrustedBrands";
import ServiceCTA from "@/components/ServiceCTA";
import RoofingGuideSection from "@/components/RoofingGuideSection";
import RoofingHeroActions from "@/components/RoofingHeroActions";
import ServiceBentoGrid from "@/components/ServiceBentoGrid";
import ServicePinsCarousel from "@/components/ServicePinsCarousel";
import { roofingGuides } from "@/data/roofingGuides";

interface SubpageDetail {
  title: string;
  description: string;
  heading: string;
  subheading: string;
  bodyText: string;
  specsHeading: string;
  specsBody: string;
  specsList: string[];
  faqs: { q: string; a: string }[];
}

const subpages: Record<string, SubpageDetail> = {
  "standing-seam-metal-roof-installation": {
    title: "Standing Seam Metal Roof Installation Jackson, MS | Born Again",
    description:
      "Concealed-fastener 24 & 26-gauge standing seam metal roof installation across Jackson, Brandon, Madison & Florence, MS. Free on-site estimate: (601) 573-6178.",
    heading: "Standing Seam Metal Roof Installation in Jackson, MS",
    subheading: "Concealed-Fastener Architectural Metal Panels Built for Mississippi Storms & Heat",
    bodyText:
      "Standing seam metal roofing uses continuous vertical metal panels that run unbroken from the roof ridge to the eaves, joined by raised interlocking seams over hidden mounting clips. Because zero screw heads penetrate the weather surface, standing seam eliminates the #1 failure point of exposed-fastener agricultural metal roofs—dry-rotted rubber washers and backed-out screws after years of 140°F Mississippi summer roof deck expansion.",
    specsHeading: "How We Engineer Standing Seam Roofs for Central Mississippi Homes",
    specsBody:
      "Installing standing seam properly across Jackson, Madison, Brandon, Ridgeland, Flowood, and Florence requires custom metalwork at every valley, chimney cricket, skylight curb, and vented ridge—never caulked shortcuts:",
    specsList: [
      "Heavy-duty 24-gauge & 26-gauge architectural steel panels with concealed expansion clips",
      "High-temperature peel-and-stick synthetic underlayment engineered for metal roof heat loads",
      "Reflective Kynar 500 (PVDF) & SMP coil coatings that resist chalking, fading, and Gulf humidity",
      "Custom-hemmed W-valleys, sidewall step flashing, pipe-boot flashing & baffled ridge ventilation",
    ],
    faqs: [
      {
        q: "Why choose concealed-fastener standing seam over an exposed-fastener R-panel metal roof?",
        a: "Exposed-fastener roofs drive thousands of neoprene-washer screws straight through the flat face of the metal panels; over 7–12 Mississippi summers, thermal expansion elongates screw holes and UV dries out washers. Standing seam hides every fastener underneath raised interlocking vertical ribs on sliding clips, allowing the panels to expand and contract freely without ever breaking a waterproof seal."
      },
      {
        q: "How much energy can a standing seam metal roof save during Mississippi summers?",
        a: "Cool-roof pigment coatings on standing seam panels reflect a high percentage of solar radiation rather than absorbing heat into your attic like dark asphalt shingles. Paired with balanced soffit-to-ridge airflow and proper attic insulation, homeowners across Hinds, Rankin, and Madison counties regularly notice substantially lower attic temperatures and reduced peak AC runtimes."
      },
      {
        q: "Can you install standing seam metal accents on porch roofs, dormers, and bay windows?",
        a: "Yes. In addition to full-home standing seam replacements, we fabricate and install matte black, bronze, charcoal, and copper-tone standing seam accent roofs over front porches, dormers, and bay windows alongside new GAF architectural shingle roofs."
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
    title: { absolute: page.title },
    description: page.description,
    alternates: {
      canonical: `/metal-roofing-repair-and-installation/${slug}/`
    }
  };
}

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

  const mappedCategories = ["Metal Roofing", "Metal Roof Installation"];
  const overrideBentoImages = subpageBentoImages[slug];

  return (
    <>
      <LocalBusinessSchema
        pageTitle={page.title}
        pageDescription={page.description}
        path={`/metal-roofing-repair-and-installation/${slug}/`}
        serviceName="Standing Seam Metal Roof Installation"
      />

      {/* Hero */}
      <section className="service-hero" style={{ backgroundImage: "url('/images/wp_metal-roof-standing-seam-1.png')" }}>
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">
            Concealed-Fastener Metal Systems
          </span>
          <h1>{page.heading}</h1>
          <p className="hero-subtext">{page.subheading}</p>
          <RoofingHeroActions
            defaultService="Metal Roofing"
            ctaLabel="Get Standing Seam Roof Estimate"
          />
          <div style={{ marginTop: "2rem", textAlign: "center", maxWidth: "520px" }}>
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
          <div style={{ maxWidth: "840px", margin: "0 auto 3rem" }}>
            <h2 style={{ color: "var(--primary)", fontSize: "1.9rem", marginBottom: "1rem" }}>
              Why Central MS Homeowners Upgrade to Standing Seam Metal
            </h2>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-muted)" }}>
              {page.bodyText}
            </p>

            <div className="double-bezel-wrapper" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
              <div className="double-bezel-inner" style={{ padding: "2rem" }}>
                <h3 style={{ color: "#ffffff", fontSize: "1.3rem", marginBottom: "0.75rem" }}>
                  {page.specsHeading}
                </h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.65, marginBottom: "1rem" }}>
                  {page.specsBody}
                </p>
                <ul style={{ paddingLeft: "1.25rem", margin: 0, color: "var(--text-muted)", lineHeight: 1.75 }}>
                  {page.specsList.map((item, i) => (
                    <li key={i} style={{ marginBottom: "0.4rem" }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p style={{ marginBottom: 0, fontSize: "0.98rem", lineHeight: "1.7", color: "var(--text-muted)" }}>
              Need repairs or silicone sealing on an existing metal roof instead of a full standing seam replacement? Visit our{" "}
              <Link href="/metal-roofing-repair-and-installation/" className="service-link">Metal Roof Repair &amp; Systems</Link>{" "}
              page or compare{" "}
              <Link href="/residential-roofing/roof-installation/" className="service-link">GAF architectural shingle roof replacement</Link>{" "}
              options across{" "}
              <Link href="/areas-we-service/madison-ms/" className="service-link">Madison</Link>,{" "}
              <Link href="/areas-we-service/brandon-ms/" className="service-link">Brandon</Link>,{" "}
              <Link href="/areas-we-service/ridgeland-ms/" className="service-link">Ridgeland</Link>, and{" "}
              <Link href="/areas-we-service/florence-ms/" className="service-link">Florence, MS</Link>.
            </p>
          </div>

          {roofingGuides[slug] && <RoofingGuideSection guide={roofingGuides[slug]} />}

          <ServiceBentoGrid services={mappedCategories} variant="metal" overrideImages={overrideBentoImages} />

          <ServicePinsCarousel services={mappedCategories} />

          <div style={{ marginTop: "3rem", maxWidth: "840px", marginLeft: "auto", marginRight: "auto" }}>
            <h2 style={{ color: "var(--primary)", fontSize: "1.55rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
              Standing Seam Metal Roof FAQ
            </h2>
            {page.faqs.map((faq, index) => (
              <div key={index} className="qa-block">
                <h3 className="qa-question">{faq.q}</h3>
                <p className="qa-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <ServiceCTA defaultService="Metal Roofing" />
    </>
  );
}
