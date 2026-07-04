import React from "react";
import { serviceArticles } from "@/data/serviceArticles";

interface ServiceArticleProps {
  service: string;
}

export default function ServiceArticle({ service }: ServiceArticleProps) {
  const article = serviceArticles[service];

  if (!article) return null;

  return (
    <section className="section" style={{ borderTop: "1px solid var(--border)", padding: "5rem 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Article Header */}
        <div style={{ marginBottom: "3rem" }}>
          <span className="eyebrow" style={{ color: "var(--secondary)", letterSpacing: "0.1em" }}>Faith-Based Quality Guide</span>
          <h2 style={{ fontSize: "2.3rem", fontWeight: "850", color: "var(--primary)", marginTop: "0.5rem", lineHeight: "1.25" }}>
            {article.title}
          </h2>
          <p style={{ fontSize: "1.15rem", color: "var(--text-muted)", marginTop: "0.5rem", fontStyle: "italic" }}>
            {article.subtitle}
          </p>
        </div>

        {/* Article Intro Body */}
        <div style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-muted)", marginBottom: "3rem" }}>
          <p>{article.intro}</p>
        </div>

        {/* Scripture Callout Block */}
        {article.scriptureRef && (
          <div className="double-bezel-wrapper" style={{ marginBottom: "3.5rem" }}>
            <div className="double-bezel-inner" style={{ padding: "2rem", background: "rgba(226, 176, 71, 0.02)", borderLeft: "4px solid var(--secondary)" }}>
              <p style={{ fontStyle: "italic", fontSize: "1.05rem", lineHeight: "1.65", color: "var(--primary)", margin: "0 0 1rem 0" }}>
                &ldquo;{article.scriptureText}&rdquo;
              </p>
              <p style={{ fontSize: "0.88rem", fontWeight: "700", color: "var(--secondary)", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                &mdash; {article.scriptureRef}
              </p>
            </div>
          </div>
        )}

        {/* Q&A Sections */}
        <div>
          <h3 style={{ fontSize: "1.5rem", fontWeight: "850", color: "var(--primary)", marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
            Answering Your Most Asked Questions
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {article.sections.map((section, index) => (
              <div key={index} style={{ display: "flex", gap: "16px" }}>
                <span className="aeo-q-badge" style={{ 
                  background: "rgba(226, 176, 71, 0.08)", 
                  color: "var(--secondary)", 
                  width: "32px", 
                  height: "32px", 
                  borderRadius: "8px", 
                  display: "flex", 
                  alignItems: "center", 
                  fontWeight: "800", 
                  flexShrink: 0, 
                  justifyContent: "center",
                  fontSize: "0.95rem"
                }}>Q</span>
                <div>
                  <h4 style={{ fontSize: "1.18rem", fontWeight: "800", color: "var(--primary)", margin: "4px 0 1rem" }}>
                    {section.heading}
                  </h4>
                  <div style={{ fontSize: "1rem", lineHeight: "1.65", color: "var(--text-muted)" }}>
                    {section.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
