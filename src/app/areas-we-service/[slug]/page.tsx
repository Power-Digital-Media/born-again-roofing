import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import pinsData from "@/data/pins.json";
import { cityRoofing } from "@/data/cityRoofing";
import ContactForm from "@/components/ContactForm";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import FAQSchema from "@/components/FAQSchema";

interface LocationDetail {
  title: string;
  description: string;
  cityName: string;
}

const locations: Record<string, LocationDetail> = {
  "brandon-ms": {
    cityName: "Brandon, MS",
    title: "Bathroom and Kitchen Remodeling in Brandon, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing LLC specializes in kitchen remodel demolition and roofing in Brandon, MS, safely restoring homes. Call (601) 573-6178."
  },
  "byram-ms": {
    cityName: "Byram, MS",
    title: "Bathroom and Kitchen Remodeling in Byram, MS | Born Again Home Remodeling and Roofing",
    description: "Transform Your Home with Expert Remodeling in Byram, MS. Your home should be a place that inspires comfort and style. Call (601) 573-6178 for details."
  },
  "canton-ms": {
    cityName: "Canton, MS",
    title: "Bathroom and Kitchen Remodeling in Canton, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing LLC builds custom cabinets, roofing, and flooring in Canton, MS. Call (601) 573-6178 for free estimates."
  },
  "clinton-ms": {
    cityName: "Clinton, MS",
    title: "Bathroom and Kitchen Remodeling in Clinton, MS | Born Again Home Remodeling and Roofing",
    description: "Expert Remodeling Services in Clinton, MS. Your home should reflect your lifestyle, blending comfort, function, and style in every detail. Call (601) 573-6178."
  },
  "crystal-springs-ms": {
    cityName: "Crystal Springs, MS",
    title: "Bathroom and Kitchen Remodeling in Crystal Springs, MS | Born Again Home Remodeling and Roofing",
    description: "Transforming Homes Inside and Out: Expert Remodeling and Roofing Services in Crystal Springs, MS. Your home deserves skilled care. Call (601) 573-6178."
  },
  "florence-ms": {
    cityName: "Florence, MS",
    title: "Bathroom and Remodeling in Florence, MS | Born Again Home Remodeling and Roofing",
    description: "Transform Your Home with Remodeling in Florence, MS. Your home should be a space that blends comfort, beauty, and function. Call (601) 573-6178 today."
  },
  "flowood-ms": {
    cityName: "Flowood, MS",
    title: "Bathroom and Kitchen Remodeling in Flowood, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling & Roofing offers bathroom & kitchen remodeling and roofing in Flowood, MS. Call 601-573-6178 for trusted services."
  },
  "gluckstadt-ms": {
    cityName: "Gluckstadt, MS",
    title: "Bathroom and Kitchen Remodeling in Gluckstadt, MS | Born Again Home Remodeling and Roofing",
    description: "From updating outdated bathrooms to designing kitchens that bring families together, our team delivers results in Gluckstadt, MS. Call (601) 573-6178."
  },
  "hazlehurst-ms": {
    cityName: "Hazlehurst, MS",
    title: "Bathroom and Kitchen Remodeling in Hazlehurst, MS | Born Again Home Remodeling and Roofing",
    description: "Our skilled team proudly offers bathroom and kitchen remodeling and roofing in Hazlehurst, MS, adding beauty and value. Call (601) 573-6178 today."
  },
  "jackson-ms": {
    cityName: "Jackson, MS",
    title: "Bathroom and Kitchen Remodeling in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Bathroom Remodeling Services and Roofing in Jackson, MS. Bathrooms should be places of comfort and relaxation. Call (601) 573-6178 for estimates."
  },
  "madison-ms": {
    cityName: "Madison, MS",
    title: "Bathroom and Kitchen Remodeling in Madison, MS | Born Again Home Remodeling and Roofing",
    description: "Investing in bathroom and kitchen remodeling and roofing adds beauty and utility to Madison, MS homes. Call (601) 573-6178 to speak with our experts."
  },
  "pearl-ms": {
    cityName: "Pearl, MS",
    title: "Bathroom and Kitchen Remodeling in Pearl, MS | Born Again Home Remodeling and Roofing",
    description: "Transform Your Home with Remodeling and Roofing in Pearl, MS. Your home should be a place that inspires comfort. Call (601) 573-6178 for details."
  },
  "raymond-ms": {
    cityName: "Raymond, MS",
    title: "Bathroom and Kitchen Remodeling in Raymond, MS | Born Again Home Remodeling and Roofing",
    description: "Whether you want a luxurious bathroom or a modern kitchen, our team delivers premium remodeling results in Raymond, MS. Call (601) 573-6178."
  },
  "richland-ms": {
    cityName: "Richland, MS",
    title: "Bathroom and Kitchen Remodeling in Richland, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling & Roofing offers bathroom & kitchen remodeling and roofing in Richland, MS. Call 601 573-6178 for trusted services."
  },
  "ridgeland-ms": {
    cityName: "Ridgeland, MS",
    title: "Bathroom and Kitchen Remodeling in Ridgeland, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling & Roofing offers bathroom & kitchen remodels and roofing in Ridgeland, MS. Call 601 573-6178 for trusted services."
  },
  "terry-ms": {
    cityName: "Terry, MS",
    title: "Bathroom and Kitchen Remodeling in Terry, MS | Born Again Home Remodeling and Roofing",
    description: "Transform Your Home with Remodeling and Roofing in Terry, MS. Your home should be a space that combines comfort and beauty. Call (601) 573-6178."
  },
  "utica-ms": {
    cityName: "Utica, MS",
    title: "Utica, MS | Born Again Home Remodeling and Roofing LLC",
    description: "From relaxing, spa-like bathrooms to modern kitchens designed for family gatherings, our team serves Utica, MS with craftsmanship. Call (601) 573-6178."
  },
  "vicksburg-ms": {
    cityName: "Vicksburg, MS",
    title: "Bathroom and Kitchen Remodeling in Vicksburg, MS | Born Again Home Remodeling and Roofing",
    description: "Transform Your Home with Remodeling and Roofing in Vicksburg, MS. Your home should combine comfort, function, and beauty. Call (601) 573-6178."
  },
  "yazoo-city-ms": {
    cityName: "Yazoo City, MS",
    title: "Bathroom and Remodeling Services in Yazoo City, MS | Born Again Home Remodeling and Roofing",
    description: "Transform Your Home with Remodeling and Roofing in Yazoo City, MS. Enjoy spaces where style and function come together. Call (601) 573-6178 today."
  }
};

export function generateStaticParams() {
  return Object.keys(locations).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = locations[slug];
  if (!page) return {};
  
  return {
    title: cityRoofing[slug]?.title ?? page.title,
    description: cityRoofing[slug]?.description ?? page.description,
    alternates: {
      canonical: `/areas-we-service/${slug}/`
    }
  };
}

export default async function LocationSubpage({ params }: PageProps) {
  const { slug } = await params;
  const page = locations[slug];

  if (!page) {
    notFound();
  }

  const projectAnswer = cityRoofing[slug]
    ? `Recent roofing projects in our ${page.cityName} project log include: ` + cityRoofing[slug].projects.filter((pr) => pinsData.some((pn) => pn.id === pr.id)).map((pr) => pr.summary).join(" ")
    : "";

  return (
    <>
      <LocalBusinessSchema pageTitle={cityRoofing[slug]?.title ?? page.title} pageDescription={cityRoofing[slug]?.description ?? page.description} path={`/areas-we-service/${slug}/`} />

      {/* Hero */}
      <section className="section" style={{ background: "linear-gradient(rgba(15, 34, 64, 0.95), rgba(15, 34, 64, 0.95))", color: "#ffffff", padding: "5rem 0 4rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{ color: "var(--secondary)", fontWeight: 700, textTransform: "uppercase", fontSize: "0.85rem", letterSpacing: "0.15em" }}>
            Born Again Roofing & Remodeling
          </span>
          <h1 style={{ color: "#ffffff", fontSize: "2.5rem", margin: "0.5rem 0 1rem" }}>{cityRoofing[slug]?.h1 ?? `Services in ${page.cityName}`}</h1>
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "1.1rem", maxWidth: "600px", margin: "0 auto" }}>
            Dedicated local craftsmanship serving families and property owners in {page.cityName}.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "3rem" }}>
          <div>
            <h2 style={{ color: "var(--primary)", fontSize: "1.8rem", marginBottom: "1rem" }}>Your Trusted Local Contractor</h2>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.05rem", lineHeight: "1.6" }}>
              At Born Again Home Remodeling and Roofing, we are committed to serving the residents of <strong>{page.cityName}</strong> with high-quality exterior and interior residential upgrades. Whether you need a GAF architectural shingle roof replacement, storm damage inspection, kitchen cabinet replacement, or custom tile bathroom installation, our crew focuses on durable, well-finished work. GAF warranty options are available on eligible roofing installations.
            </p>
            {cityRoofing[slug] && (
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ color: "var(--primary)", fontSize: "1.4rem", marginBottom: "0.75rem" }}>Roofing in {page.cityName}</h2>
                <p style={{ marginBottom: "1rem", fontSize: "1.05rem", lineHeight: "1.6" }}>
                  {cityRoofing[slug].area} Every roofing estimate starts with a look at your roof, so we can recommend repair or replacement based on its actual condition.
                </p>
                <h3 style={{ color: "var(--primary)", fontSize: "1.15rem", margin: "0 0 0.5rem" }}>Recent roofing work in {page.cityName}</h3>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
                  {cityRoofing[slug].projects.map((project) => {
                    const pin = pinsData.find((pn) => pn.id === project.id);
                    if (!pin) return null;
                    return (
                      <li key={project.id} style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>
                        <strong>{pin.date}:</strong> {project.summary}{" "}
                        <Link href={`/pin-page/?id=${project.id}`} className="service-link">View project</Link>
                      </li>
                    );
                  })}
                </ul>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem", margin: 0 }}>
                  <li><Link href="/residential-roofing/roof-repair/" className="service-link">Roof repair</Link></li>
                  <li><Link href="/residential-roofing/roof-installation/" className="service-link">Roof replacement</Link></li>
                  <li><Link href="/storm-damage-roof-repair/" className="service-link">Storm damage repair</Link></li>
                  <li><Link href="/residential-roofing/roof-inspections/" className="service-link">Roof inspections</Link></li>
                  <li><Link href="/metal-roofing-repair-and-installation/" className="service-link">Metal roofing</Link></li>
              <li><Link href="/commercial-roofing/" className="service-link">Commercial roofing</Link></li>
                </ul>
              </div>
            )}
            
            <p style={{ marginBottom: "2.5rem" }}>
              We operate with high integrity, fair transparent pricing, and clean work sites. We serve homeowners across Hinds, Madison, Rankin, and Copiah counties.
            </p>

            {/* AEO GEO FAQ Blocks */}
            <div style={{ marginTop: "3rem" }}>
              <h3 style={{ color: "var(--primary)", fontSize: "1.4rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                Common Local Service Questions
              </h3>
              
              <div className="qa-block">
                <h4 className="qa-question">Do you offer free roofing and remodeling estimates in {page.cityName}?</h4>
                <p className="qa-answer">
                  Yes, Born Again Roofing provides completely free, no-obligation written estimates for all roofing, siding, and remodeling projects in <strong>{page.cityName}</strong>. Our inspector will visit your property, assess the required work, and provide a clear, itemized quote.
                </p>
              </div>

              {cityRoofing[slug] && (
                <div className="qa-block">
                  <h4 className="qa-question">What roofing work has Born Again done in {page.cityName}?</h4>
                  <p className="qa-answer">{projectAnswer}</p>
                </div>
              )}

              <div className="qa-block">
                <h4 className="qa-question">How does local weather affect roofing materials in {page.cityName}?</h4>
                <p className="qa-answer">
                  Central Mississippi weather can bring intense UV sun heat, severe wind storms, and seasonal hail. We recommend GAF architectural shingles or standing seam metal panels, and we can explain how each handles Mississippi weather when we inspect your roof in <strong>{page.cityName}</strong>.
                </p>
              </div>
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      <FAQSchema faqs={[
        ...(cityRoofing[slug] ? [{ question: `What roofing work has Born Again done in ${page.cityName}?`, answer: projectAnswer }] : []),
        {
          question: `Do you offer free roofing and remodeling estimates in ${page.cityName}?`,
          answer: `Yes, Born Again Roofing provides completely free, no-obligation written estimates for all roofing, siding, and remodeling projects in ${page.cityName}. Our inspector will visit your property, assess the required work, and provide a clear, itemized quote.`
        },
        {
          question: `How does local weather affect roofing materials in ${page.cityName}?`,
          answer: `Central Mississippi weather can bring intense UV sun heat, severe wind storms, and seasonal hail. We recommend GAF architectural shingles or standing seam metal panels, and we can explain how each handles Mississippi weather when we inspect your roof in ${page.cityName}.`
        }
      ]} />
    </>
  );
}
