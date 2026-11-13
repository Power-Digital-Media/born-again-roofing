import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getPins, PinType } from "@/lib/db";
import { cityRoofing } from "@/data/cityRoofing";
import ContactForm from "@/components/ContactForm";
import RoofingHeroActions from "@/components/RoofingHeroActions";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import FAQSchema from "@/components/FAQSchema";

export const revalidate = 300;

interface LocationDetail {
  title: string;
  description: string;
  cityName: string;
}

const locations: Record<string, LocationDetail> = {
  "brandon-ms": {
    cityName: "Brandon, MS",
    title: "Roof Repair, Replacement & Remodeling in Brandon, MS",
    description: "GAF-certified roof repair, architectural shingle replacement, metal roofing, storm inspections, and home remodeling in Brandon, MS. Call (601) 573-6178."
  },
  "byram-ms": {
    cityName: "Byram, MS",
    title: "Roof Repair, Replacement & Remodeling in Byram, MS",
    description: "GAF-certified roof repair, shingle replacement, storm & wind damage inspections, and home remodeling in Byram, MS. Free estimates: (601) 573-6178."
  },
  "canton-ms": {
    cityName: "Canton, MS",
    title: "Roof Repair, Replacement & Remodeling in Canton, MS",
    description: "Roof repair, architectural shingle replacement, metal roofing, storm damage inspections, and home remodeling in Canton, MS. Call (601) 573-6178."
  },
  "clinton-ms": {
    cityName: "Clinton, MS",
    title: "Roof Repair, Storm Damage & Remodeling in Clinton, MS",
    description: "Shingle roof repair, standing seam metal roof service, storm tarping & inspections, and home remodeling in Clinton, MS. Call (601) 573-6178."
  },
  "crystal-springs-ms": {
    cityName: "Crystal Springs, MS",
    title: "Roof Repair, Replacement & Remodeling in Crystal Springs, MS",
    description: "GAF shingle roof replacement, metal roofing, storm damage roof repair, and home remodeling in Crystal Springs, MS. Call (601) 573-6178."
  },
  "florence-ms": {
    cityName: "Florence, MS",
    title: "Roof Repair, Replacement & Remodeling in Florence, MS",
    description: "Headquartered at 150 Highland Dr in Florence, MS: GAF-certified roof repair, roof replacement, storm damage inspections, metal roofing, and home remodeling. Call (601) 573-6178."
  },
  "flowood-ms": {
    cityName: "Flowood, MS",
    title: "Roof Replacement, Repair & Remodeling in Flowood, MS",
    description: "Full roof replacement, storm damage roof inspections, leak repair, metal roofing, and home remodeling in Flowood, MS. Free estimates: (601) 573-6178."
  },
  "gluckstadt-ms": {
    cityName: "Gluckstadt, MS",
    title: "Roof Replacement, Repair & Remodeling in Gluckstadt, MS",
    description: "GAF-certified roof replacement, hail & wind roof inspections, metal roofing, and interior home remodeling in Gluckstadt, MS. Call (601) 573-6178."
  },
  "hazlehurst-ms": {
    cityName: "Hazlehurst, MS",
    title: "Roof Repair, Replacement & Remodeling in Hazlehurst, MS",
    description: "Trusted roof repair, roof replacement, metal roofing, storm damage inspections, and home remodeling in Hazlehurst, MS. Call (601) 573-6178."
  },
  "jackson-ms": {
    cityName: "Jackson, MS",
    title: "Roof Repair, Replacement & Remodeling in Jackson, MS",
    description: "GAF-certified roof repair, roof replacement, storm & hail inspections, metal roofing, and home remodeling for Jackson, MS homes. Free estimates: (601) 573-6178."
  },
  "madison-ms": {
    cityName: "Madison, MS",
    title: "Roof Replacement, Repair & Remodeling in Madison, MS",
    description: "GAF architectural shingle roof replacement, storm & hail roof repair, standing seam metal roofing, and custom remodeling in Madison, MS. Call (601) 573-6178."
  },
  "pearl-ms": {
    cityName: "Pearl, MS",
    title: "Roof Repair, Metal Roofing & Remodeling in Pearl, MS",
    description: "Roof repair, shingle replacement, metal & silicone roof service, storm inspections, and home remodeling for Pearl, MS homes. Call (601) 573-6178."
  },
  "raymond-ms": {
    cityName: "Raymond, MS",
    title: "Roof Repair, Replacement & Remodeling in Raymond, MS",
    description: "Roof leak repair, full shingle & metal roof replacement, storm inspections, and home remodeling for Raymond, MS homeowners. Call (601) 573-6178."
  },
  "richland-ms": {
    cityName: "Richland, MS",
    title: "Roof Repair, Replacement & Remodeling in Richland, MS",
    description: "Local roof repair, GAF shingle replacement, storm damage restoration, metal roofing, and home remodeling in Richland, MS. Call (601) 573-6178."
  },
  "ridgeland-ms": {
    cityName: "Ridgeland, MS",
    title: "Roof Replacement, Repair & Remodeling in Ridgeland, MS",
    description: "Architectural shingle roof replacement, storm & leak repair, metal roofing, and kitchen & bath remodeling for Ridgeland, MS homes. Call (601) 573-6178."
  },
  "terry-ms": {
    cityName: "Terry, MS",
    title: "Roof Repair, Replacement & Remodeling in Terry, MS",
    description: "Residential roof repair, shingle & metal roof replacement, storm tarping, and home remodeling in Terry, MS. Free estimates: (601) 573-6178."
  },
  "utica-ms": {
    cityName: "Utica, MS",
    title: "Roof Repair, Replacement & Remodeling in Utica, MS",
    description: "Residential roof repair, shingle & metal roof installation, storm inspections, and home remodeling in Utica, MS. Free estimates: (601) 573-6178."
  },
  "vicksburg-ms": {
    cityName: "Vicksburg, MS",
    title: "Roof Repair, Replacement & Remodeling in Vicksburg, MS",
    description: "Roof repair, GAF architectural shingle replacement, standing seam metal roofing, storm inspections, and remodeling in Vicksburg, MS. Call (601) 573-6178."
  },
  "yazoo-city-ms": {
    cityName: "Yazoo City, MS",
    title: "Roof Repair, Replacement & Remodeling in Yazoo City, MS",
    description: "Roof repair, roof replacement, storm & wind damage restoration, metal roofing, and home remodeling in Yazoo City, MS. Call (601) 573-6178."
  }
};

export function generateStaticParams() {
  return Object.keys(locations).map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

function isRoofingPin(pin: PinType): boolean {
  const haystack = `${pin.service} ${pin.description}`.toLowerCase();
  return (
    haystack.includes("roof") ||
    haystack.includes("shingle") ||
    haystack.includes("hail") ||
    haystack.includes("storm") ||
    haystack.includes("tarp") ||
    haystack.includes("flashing") ||
    haystack.includes("soffit") ||
    haystack.includes("fascia")
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = locations[slug];
  if (!page) return {};

  const rawTitle = cityRoofing[slug]?.title ?? page.title;
  return {
    title: rawTitle.includes("|") ? { absolute: rawTitle } : rawTitle,
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

  const shortCity = page.cityName.replace(/,\s*MS$/i, "");
  const cityInfo = cityRoofing[slug];
  const allPins = await getPins();
  const validPins = allPins.filter(
    (p) => Array.isArray(p.images) && p.images.length > 0 && p.location
  );

  // Match exact city pins first; sort Roofing projects to the top, newest IDs first
  const exactCityPins = validPins
    .filter((p) => p.location.trim().toLowerCase() === page.cityName.toLowerCase())
    .sort((a, b) => {
      const aRoof = isRoofingPin(a) ? 1 : 0;
      const bRoof = isRoofingPin(b) ? 1 : 0;
      if (bRoof !== aRoof) return bRoof - aRoof;
      return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

  const isNearbyFallback = exactCityPins.length === 0;
  const displayPins = (
    isNearbyFallback
      ? validPins.filter((p) => isRoofingPin(p)).slice(0, 6)
      : exactCityPins.slice(0, 6)
  );

  const curatedSummaries = (cityInfo?.projects || []).filter((pr) =>
    validPins.some((pn) => String(pn.id) === String(pr.id))
  );

  const projectAnswer = !isNearbyFallback
    ? `Born Again Home Remodeling & Roofing has documented ${exactCityPins.length} verified project${exactCityPins.length === 1 ? "" : "s"} in ${page.cityName}, including ${exactCityPins
        .slice(0, 3)
        .map((p) => `${p.service.toLowerCase()} (${p.date})`)
        .join(", ")}.`
    : `Our Florence-headquartered crews serve ${page.cityName} and neighboring Central Mississippi communities with GAF-certified roof repair, roof replacement, storm inspections, metal roofing, and home remodeling.`;

  return (
    <>
      <LocalBusinessSchema
        pageTitle={cityInfo?.title ?? page.title}
        pageDescription={cityInfo?.description ?? page.description}
        path={`/areas-we-service/${slug}/`}
      />

      {/* Hero */}
      <section className="service-hero">
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">
            Born Again Roofing &amp; Remodeling · Central MS
          </span>
          <h1>{cityInfo?.h1 ?? `Roof Repair, Replacement & Home Remodeling in ${page.cityName}`}</h1>
          <p className="hero-subtext">
            {cityInfo?.area ?? `Serving homeowners across ${page.cityName} from our headquarters in Florence, MS.`}{" "}
            Request a free on-site roof inspection or remodeling estimate today.
          </p>
          <RoofingHeroActions
            defaultService="Roof Replacement"
            ctaLabel={`Get Free ${shortCity} Estimate`}
          />
        </div>
      </section>

      {/* Main Content + Inline Estimate Form */}
      <section className="section">
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
            gap: "3rem",
            alignItems: "start",
          }}
        >
          <div>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>
              Local Central MS Craftsmanship
            </span>
            <h2 style={{ color: "var(--primary)", fontSize: "1.85rem", margin: "0.4rem 0 1rem" }}>
              GAF-Certified Roofing &amp; Remodeling in {page.cityName}
            </h2>
            <p style={{ marginBottom: "1.25rem", fontSize: "1.03rem", lineHeight: "1.7", color: "var(--text-muted)" }}>
              At <strong>Born Again Home Remodeling &amp; Roofing</strong>, our local Central Mississippi crews serve homeowners in{" "}
              <strong>{page.cityName}</strong> with honest assessments, clean job sites, and durable materials. Whether your home needs an urgent{" "}
              <Link href="/residential-roofing/roof-repair/" className="service-link">roof leak repair</Link>, a full{" "}
              <Link href="/residential-roofing/roof-installation/" className="service-link">GAF architectural shingle replacement</Link>,{" "}
              <Link href="/storm-damage-roof-repair/" className="service-link">wind or hail storm restoration</Link>,{" "}
              <Link href="/metal-roofing-repair-and-installation/" className="service-link">standing seam metal roofing</Link>, or custom{" "}
              <Link href="/kitchen-remodeling/" className="service-link">kitchen</Link> and{" "}
              <Link href="/bathroom-remodeling/" className="service-link">bathroom remodeling</Link>, every project begins with a thorough on-site inspection and written estimate.
            </p>

            {curatedSummaries.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ color: "var(--primary)", fontSize: "1.2rem", margin: "0 0 0.65rem" }}>
                  Highlighted Roofing Work in {page.cityName}
                </h3>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", color: "var(--text-muted)" }}>
                  {curatedSummaries.map((project) => {
                    const pin = validPins.find((pn) => String(pn.id) === String(project.id));
                    if (!pin) return null;
                    return (
                      <li key={project.id} style={{ marginBottom: "0.5rem", lineHeight: 1.6 }}>
                        <strong style={{ color: "#ffffff" }}>{pin.date}:</strong> {project.summary}{" "}
                        <Link href={`/pin-page/?id=${project.id}`} className="service-link">
                          View photos
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Services Available in City */}
            <div
              className="double-bezel-wrapper"
              style={{ marginBottom: "2rem" }}
            >
              <div className="double-bezel-inner" style={{ padding: "1.75rem" }}>
                <h3 style={{ color: "#ffffff", fontSize: "1.15rem", marginBottom: "1rem" }}>
                  Services Available in {page.cityName}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                    gap: "0.65rem 1.25rem",
                  }}
                >
                  <Link href="/residential-roofing/roof-repair/" className="service-link">Roof Leak &amp; Shingle Repair →</Link>
                  <Link href="/residential-roofing/roof-installation/" className="service-link">New Roof Replacement →</Link>
                  <Link href="/storm-damage-roof-repair/hail-damage-roof-repair/" className="service-link">Hail &amp; Wind Damage Repair →</Link>
                  <Link href="/storm-damage-roof-repair/emergency-roof-repair/" className="service-link">Emergency Roof Tarping →</Link>
                  <Link href="/residential-roofing/roof-inspections/" className="service-link">Free Roof Inspections →</Link>
                  <Link href="/metal-roofing-repair-and-installation/" className="service-link">Standing Seam Metal Roofs →</Link>
                  <Link href="/commercial-roofing/" className="service-link">Commercial &amp; Flat Roofing →</Link>
                  <Link href="/kitchen-remodeling/" className="service-link">Kitchen Remodeling →</Link>
                  <Link href="/bathroom-remodeling/" className="service-link">Bathroom Remodeling →</Link>
                  <Link href="/whole-house-remodeling/" className="service-link">Whole House Remodeling →</Link>
                </div>
              </div>
            </div>

            {/* AEO / GEO FAQ Blocks */}
            <div style={{ marginTop: "2.5rem" }}>
              <h3 style={{ color: "var(--primary)", fontSize: "1.4rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                {shortCity}, MS Roofing &amp; Remodeling FAQ
              </h3>

              <div className="qa-block">
                <h4 className="qa-question">Do you offer free roof inspections and estimates in {page.cityName}?</h4>
                <p className="qa-answer">
                  Yes. Born Again Home Remodeling &amp; Roofing provides free, no-obligation on-site roof inspections and written remodeling estimates across <strong>{page.cityName}</strong>. Call <a href="tel:6015736178" style={{ color: "var(--secondary)", fontWeight: 700 }}>(601) 573-6178</a> or submit the form on this page to schedule.
                </p>
              </div>

              <div className="qa-block">
                <h4 className="qa-question">What recent work has Born Again completed near {page.cityName}?</h4>
                <p className="qa-answer">{projectAnswer}</p>
              </div>

              <div className="qa-block">
                <h4 className="qa-question">How does Central Mississippi weather impact roofs in {page.cityName}?</h4>
                <p className="qa-answer">
                  Homes in <strong>{page.cityName}</strong> face high summer UV heat, heavy Gulf moisture, straight-line thunderstorm winds, and spring hail. We install GAF architectural shingle systems and concealed-fastener standing seam metal roofs engineered to handle Mississippi storms, with GAF system warranty options available on eligible installations.
                </p>
              </div>
            </div>
          </div>

          <div style={{ position: "sticky", top: "6.5rem" }}>
            <ContactForm compact defaultService="Roof Replacement" />
          </div>
        </div>
      </section>

      {/* Server-Rendered Verified Project Photo Cards */}
      {displayPins.length > 0 && (
        <section className="section section-alt" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
              <div>
                <span className="eyebrow" style={{ color: "var(--secondary)" }}>
                  {isNearbyFallback ? "Central Mississippi Project Log" : `Verified ${shortCity} Project Log`}
                </span>
                <h2 style={{ color: "#ffffff", margin: "0.35rem 0 0" }}>
                  {isNearbyFallback
                    ? `Recent Roofing Projects Near ${page.cityName}`
                    : `Completed Projects in ${page.cityName} (${exactCityPins.length})`}
                </h2>
              </div>
              <Link href="/pins/" className="service-link">
                Explore All Central MS Pins →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {displayPins.map((pin) => (
                <Link
                  key={pin.id}
                  href={`/pin-page/?id=${pin.id}`}
                  className="double-bezel-wrapper"
                  style={{ textDecoration: "none" }}
                >
                  <div className="double-bezel-inner" style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pin.images[0]}
                      alt={`${pin.service} in ${pin.location}`}
                      loading="lazy"
                      style={{ width: "100%", height: "210px", objectFit: "cover", display: "block" }}
                    />
                    <div style={{ padding: "1.25rem 1.4rem 1.4rem" }}>
                      <span
                        style={{
                          fontSize: "0.74rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--secondary)",
                        }}
                      >
                        {pin.location} · {pin.date}
                      </span>
                      <h3 style={{ color: "#ffffff", margin: "0.4rem 0 0.5rem", fontSize: "1.1rem" }}>
                        {pin.service}
                      </h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.6, margin: 0 }}>
                        {pin.description.length > 140 ? `${pin.description.slice(0, 140)}...` : pin.description}
                      </p>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "0.75rem", marginBottom: 0 }}>
                        Logged by {pin.author}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQSchema
        faqs={[
          {
            question: `Do you offer free roof inspections and estimates in ${page.cityName}?`,
            answer: `Yes. Born Again Home Remodeling & Roofing provides free, no-obligation on-site roof inspections and written remodeling estimates across ${page.cityName}. Call (601) 573-6178 or submit our online form to schedule.`,
          },
          {
            question: `What recent work has Born Again completed near ${page.cityName}?`,
            answer: projectAnswer,
          },
          {
            question: `How does Central Mississippi weather impact roofs in ${page.cityName}?`,
            answer: `Homes in ${page.cityName} face high summer UV heat, heavy Gulf moisture, straight-line thunderstorm winds, and spring hail. We install GAF architectural shingle systems and concealed-fastener standing seam metal roofs engineered for Mississippi weather.`,
          },
        ]}
      />
    </>
  );
}
