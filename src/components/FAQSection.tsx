"use client";

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How do I know if my roof needs a minor repair or a full replacement?",
    answer: "Generally, if roof damage is localized (e.g., a few missing shingles, a small leak near a chimney flange, or minor wind damage), a roof repair is sufficient. However, if the roof is over 15–20 years old, has widespread shingle decay (bald spots, curling, cracking), or has suffered significant storm structural damage, a full roof replacement is the safest, most cost-effective long-term solution."
  },
  {
    question: "How do I handle an insurance claim for wind or hail roof damage?",
    answer: "To file an insurance claim, first schedule a professional roof inspection with a licensed contractor like Born Again Roofing. We will document the storm damage with clear photo evidence. Next, contact your insurance provider to file the claim, sharing our inspection report. We work directly with your adjuster to ensure all wind or hail damage is accurately assessed and covered."
  },
  {
    question: "What are the benefits of choosing a standing seam metal roof?",
    answer: "Standing seam metal roofing offers exceptional durability, lasting 50 years or more with minimal maintenance. It provides superior wind, fire, and hail resistance compared to asphalt shingles. Additionally, metal roofing reflects solar heat, lowering cooling costs during hot Mississippi summers, and stands out as a premium investment that increases your home's resale value."
  },
  {
    question: "Do you offer warranties on your residential roofing installations?",
    answer: "Yes. Three different warranties can apply to a roof. GAF provides a manufacturer warranty on its shingles, and as a GAF certified contractor we can offer GAF system warranties on eligible installations, with coverage of up to 50 years on qualifying shingle systems. Born Again also provides its own workmanship warranty covering our installation work. Coverage and duration depend on the products installed and the applicable warranty terms, so not every roof qualifies for the longest option. We explain which options apply to your roof in your written estimate."
  }
];

export default function FAQSection() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="faq-list" style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr", marginTop: "3rem" }}>
      {faqs.map((faq, idx) => {
        const isOpen = openIndexes.includes(idx);
        return (
          <div key={idx} className="double-bezel-wrapper faq-item-wrapper">
            <div 
              className={`double-bezel-inner faq-card ${isOpen ? "faq-card--open" : ""}`}
              data-open={isOpen ? "true" : "false"}
              onClick={() => toggleIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleIndex(idx); } }}
            >
              <h3 className="faq-question">
                <span className="faq-question-text">
                  <span className="faq-q-badge">Q</span>
                  {faq.question}
                </span>
                <span 
                  className="faq-toggle-icon"
                  aria-hidden="true"
                >
                  ▼
                </span>
              </h3>
              
              <div className="faq-answer-wrapper" data-open={isOpen ? "true" : "false"}>
                <p className="faq-answer-text">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
