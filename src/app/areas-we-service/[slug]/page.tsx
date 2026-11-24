import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getPins, PinType } from "@/lib/db";
import { cityRoofing } from "@/data/cityRoofing";
import ContactForm from "@/components/ContactForm";
import RoofingHeroActions from "@/components/RoofingHeroActions";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

export const revalidate = 300;

export function generateStaticParams() {
  return Object.keys(cityRoofing).map((slug) => ({ slug }));
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
  const city = cityRoofing[slug];
  if (!city) return {};

  return {
    title: { absolute: city.metaTitle },
    description: city.description,
    alternates: {
      canonical: `/areas-we-service/${slug}/`,
    },
  };
}

export default async function LocationSubpage({ params }: PageProps) {
  const { slug } = await params;
  const city = cityRoofing[slug];

  if (!city) {
    notFound();
  }

  const shortCity = city.cityName.replace(/,\s*MS$/i, "");
  const isJacksonHub = slug === "jackson-ms";
  const allPins = await getPins();
  const validPins = allPins.filter(
    (p) => Array.isArray(p.images) && p.images.length > 0 && p.location
  );

  // Match exact city pins first; sort Roofing projects to the top, newest IDs first
  const exactCityPins = validPins
    .filter((p) => p.location.trim().toLowerCase() === city.cityName.toLowerCase())
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

  const curatedSummaries = city.projects.filter((pr) =>
    validPins.some((pn) => String(pn.id) === String(pr.id))
  );

  const neighborCities = city.nearbySlugs
    .map((ns) => ({ slug: ns, info: cityRoofing[ns] }))
    .filter((x) => Boolean(x.info));

  return (
    <>
      <LocalBusinessSchema
        pageTitle={city.metaTitle}
        pageDescription={city.description}
        path={`/areas-we-service/${slug}/`}
        areaCityName={city.cityName}
      />

      {/* Hero */}
      <section className="service-hero">
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">{city.eyebrow}</span>
          <h1>{city.h1}</h1>
          <p className="hero-subtext">{city.area}</p>
          <RoofingHeroActions
            defaultService="Roof Replacement"
            ctaLabel={`Get Free ${shortCity} Estimate`}
          />
        </div>
      </section>

      {/* Main City-Specific Content + Inline Estimate Form */}
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
              {city.county} · Local Field Coverage
            </span>
            <h2 style={{ color: "var(--primary)", fontSize: "1.85rem", margin: "0.4rem 0 1rem" }}>
              {isJacksonHub
                ? "Jackson Roofing & Remodeling Coverage by Neighborhood"
                : `Roofing & Storm Protection for ${city.cityName} Homes`}
            </h2>
            <p style={{ marginBottom: "1.25rem", fontSize: "1.03rem", lineHeight: "1.75", color: "var(--text-muted)" }}>
              {city.roofingFocus}
            </p>

            {isJacksonHub ? (
              <p style={{ marginBottom: "1.5rem", fontSize: "0.98rem", lineHeight: "1.7", color: "var(--text-muted)" }}>
                Looking for full service specs and warranty details? Explore our main{" "}
                <Link href="/" className="service-link">Jackson, MS Roofing &amp; Home Remodeling hub</Link>,{" "}
                <Link href="/residential-roofing/roof-installation/" className="service-link">GAF roof replacement in Jackson</Link>,{" "}
                <Link href="/residential-roofing/roof-repair/" className="service-link">Jackson roof leak repair</Link>,{" "}
                <Link href="/storm-damage-roof-repair/hail-damage-roof-repair/" className="service-link">hail damage roof inspections</Link>, or{" "}
                <Link href="/commercial-roofing/" className="service-link">commercial &amp; flat roofing</Link>.
              </p>
            ) : null}

            <h2 style={{ color: "var(--primary)", fontSize: "1.55rem", margin: "1.75rem 0 0.85rem" }}>
              Home Remodeling &amp; Exterior Carpentry in {shortCity}
            </h2>
            <p style={{ marginBottom: "1.5rem", fontSize: "1.02rem", lineHeight: "1.75", color: "var(--text-muted)" }}>
              {city.remodelingFocus}
            </p>

            {/* Neighborhoods & Corridors Badges */}
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#ffffff", fontSize: "1.08rem", marginBottom: "0.75rem" }}>
                {shortCity} Neighborhoods &amp; Corridors We Serve:
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {city.neighborhoods.map((nb) => (
                  <span
                    key={nb}
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      padding: "0.35rem 0.75rem",
                      borderRadius: "999px",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--border)",
                      color: "#e2e8f0",
                    }}
                  >
                    {nb}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlighted Verified Projects */}
            {curatedSummaries.length > 0 && (
              <div style={{ marginBottom: "2rem" }}>
                <h3 style={{ color: "var(--primary)", fontSize: "1.2rem", margin: "0 0 0.65rem" }}>
                  Highlighted Field Logs in {city.cityName}
                </h3>
                <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem", color: "var(--text-muted)" }}>
                  {curatedSummaries.map((project) => {
                    const pin = validPins.find((pn) => String(pn.id) === String(project.id));
                    if (!pin) return null;
                    return (
                      <li key={project.id} style={{ marginBottom: "0.55rem", lineHeight: 1.65 }}>
                        <strong style={{ color: "#ffffff" }}>{pin.date} ({pin.service}):</strong> {project.summary}{" "}
                        <Link href={`/pin-page/?id=${project.id}`} rel="nofollow" prefetch={false} className="service-link">
                          View photos
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Core Services Available in City */}
            <div className="double-bezel-wrapper" style={{ marginBottom: "2rem" }}>
              <div className="double-bezel-inner" style={{ padding: "1.75rem" }}>
                <h3 style={{ color: "#ffffff", fontSize: "1.15rem", marginBottom: "1rem" }}>
                  Roofing &amp; Remodeling Services in {city.cityName}
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                    gap: "0.65rem 1.25rem",
                  }}
                >
                  <Link href="/residential-roofing/roof-installation/" className="service-link">Roof Replacement &amp; Install →</Link>
                  <Link href="/residential-roofing/roof-repair/" className="service-link">Roof Leak &amp; Shingle Repair →</Link>
                  <Link href="/storm-damage-roof-repair/hail-damage-roof-repair/" className="service-link">Hail &amp; Storm Inspections →</Link>
                  <Link href="/storm-damage-roof-repair/emergency-roof-repair/" className="service-link">24/7 Emergency Tarping →</Link>
                  <Link href="/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation/" className="service-link">Standing Seam Metal Roofs →</Link>
                  <Link href="/commercial-roofing/" className="service-link">Commercial &amp; Flat Roofing →</Link>
                  <Link href="/kitchen-remodeling/" className="service-link">Kitchen Remodeling →</Link>
                  <Link href="/bathroom-remodeling/" className="service-link">Bathroom Remodeling →</Link>
                  <Link href="/whole-house-remodeling/" className="service-link">Whole House Remodeling →</Link>
                  <Link href="/flooring/" className="service-link">LVP, Tile &amp; Subfloor Repair →</Link>
                </div>
              </div>
            </div>

            {/* City-Specific FAQ Blocks */}
            <div style={{ marginTop: "2.5rem" }}>
              <h2 style={{ color: "var(--primary)", fontSize: "1.45rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "8px" }}>
                {shortCity}, MS Roofing &amp; Remodeling Questions
              </h2>

              {city.faqs.map((faq, idx) => (
                <div key={idx} className="qa-block">
                  <h3 className="qa-question">{faq.q}</h3>
                  <p className="qa-answer">{faq.a}</p>
                </div>
              ))}
            </div>

            {/* Geographic Hub-and-Spoke Neighbor Links */}
            {neighborCities.length > 0 && (
              <div style={{ marginTop: "2rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#ffffff", marginRight: "0.75rem" }}>
                  Nearby Communities We Serve:
                </span>
                <span style={{ display: "inline-flex", flexWrap: "wrap", gap: "0.5rem 1.15rem", fontSize: "0.92rem" }}>
                  {neighborCities.map(({ slug: nSlug, info }) => (
                    <Link key={nSlug} href={`/areas-we-service/${nSlug}/`} className="service-link">
                      {info.cityName} →
                    </Link>
                  ))}
                </span>
              </div>
            )}
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
                    ? `Recent Roofing Projects Near ${city.cityName}`
                    : `Completed Projects in ${city.cityName} (${exactCityPins.length})`}
                </h2>
              </div>
              <Link href="/pins/" prefetch={false} className="service-link">
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
                  rel="nofollow"
                  prefetch={false}
                  className="double-bezel-wrapper"
                  style={{ textDecoration: "none" }}
                >
                  <div className="double-bezel-inner" style={{ padding: 0, overflow: "hidden", height: "100%" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pin.images[0]}
                      alt={`${pin.service} in ${pin.location}`}
                      width={640}
                      height={420}
                      loading="lazy"
                      decoding="async"
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
    </>
  );
}
