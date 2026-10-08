import React from "react";
import Link from "next/link";
import { gafExplainer, type RoofingGuide } from "@/data/roofingGuides";

/** Static, server-rendered guide block (signs, process, repair-vs-replace, related links). */
export default function RoofingGuideSection({ guide }: { guide: RoofingGuide }) {
  const h3 = { color: "var(--primary)", fontSize: "1.3rem", margin: "0 0 0.75rem" } as const;
  const li = { marginBottom: "0.5rem", lineHeight: 1.6, color: "var(--text-muted)" } as const;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto 3rem", textAlign: "left" }}>
      <h3 style={h3}>{guide.signsHeading}</h3>
      <ul style={{ paddingLeft: "1.25rem", marginBottom: "2rem" }}>
        {guide.signs.map((s) => <li key={s} style={li}>{s}</li>)}
      </ul>

      <h3 style={h3}>{guide.processHeading}</h3>
      <ol style={{ paddingLeft: "1.25rem", marginBottom: "2rem" }}>
        {guide.process.map((s) => <li key={s} style={li}>{s}</li>)}
      </ol>

      <h3 style={h3}>{guide.decisionHeading}</h3>
      <p style={{ ...li, marginBottom: "2rem" }}>{guide.decision}</p>

      {guide.gaf && (
        <section aria-labelledby="gaf-heading" style={{ marginBottom: "2rem" }}>
          <h3 id="gaf-heading" style={h3}>{gafExplainer.heading}</h3>
          <p style={{ ...li, marginBottom: "1rem" }}>{gafExplainer.intro}</p>
          <ul style={{ paddingLeft: "1.25rem", marginBottom: "1rem" }}>
            {gafExplainer.types.map((t) => (
              <li key={t.name} style={li}><strong>{t.name}:</strong> {t.text}</li>
            ))}
          </ul>
          <p style={{ ...li, marginBottom: 0 }}>{gafExplainer.note}</p>
        </section>
      )}

      <nav aria-label="Related roofing pages">
        <h3 style={h3}>Related roofing pages</h3>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "0.5rem 1.5rem" }}>
          {guide.related.map((r) => (
            <li key={r.href}><Link href={r.href} className="service-link">{r.label}</Link></li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
