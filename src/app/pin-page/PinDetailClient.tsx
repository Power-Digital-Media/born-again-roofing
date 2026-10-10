"use client";

import React, { useState } from "react";
import Link from "next/link";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ContactForm from "@/components/ContactForm";

// Public, render-safe subset of a project record. Coordinates and internal fields
// (latitude, longitude, clientId) are deliberately excluded so they are never serialized into the page.
export interface PublicPin {
  id: string;
  location: string;
  service: string;
  author: string;
  date: string;
  description: string;
  detailedExplanation?: string;
  images: string[];
  title?: string;
  aeoAnswers?: { question: string; answer: string }[];
}

export default function PinDetailClient({ pin, heading }: { pin: PublicPin; heading: string }) {
  // Pin data arrives pre-fetched from the server so the job details are in the initial HTML.
  const [activeImageState, setActiveImageState] = useState<string | null>(null);

  const activeImage = activeImageState || pin.images?.[0];

  return (
    <>
      <LocalBusinessSchema pageTitle={`${heading} - ${pin.location}`} pageDescription={pin.description} path={`/pin-page/?id=${pin.id}`} />

      {/* Hero Header */}
      <section className="detail-hero">
        <div className="container detail-hero-inner scroll-reveal">
          <span className="eyebrow" style={{ color: "var(--secondary)" }}>Project Gallery</span>
          <h1>{heading}</h1>
          <p className="hero-subtext">
            Completed on {pin.date} in {pin.location}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="section detail-content">
        <div className="container detail-grid">
          
          <div className="detail-left-column">
            <Link href="/pins" className="back-link">
              ← Back to Project Feed
            </Link>
            
            {/* Image Showcase */}
            <div className="double-bezel-wrapper detail-image-wrapper">
              <div className="double-bezel-inner detail-image-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeImage}
                  alt={heading}
                  className="detail-img"
                />
              </div>
            </div>

            {/* Thumbnail Gallery (if there are multiple images) */}
            {pin.images && pin.images.length > 1 && (
              <>
                <h4 className="project-gallery-title">Job Photos</h4>
                <div className="project-images-gallery">
                  {pin.images.map((img) => (
                    <button
                      key={img}
                      className="gallery-thumbnail-wrapper"
                      onClick={() => setActiveImageState(img)}
                      aria-label="View larger image"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${heading}, photo ${pin.images.indexOf(img) + 1}`}
                        className={`gallery-thumb-img ${activeImage === img ? "active-thumb" : ""}`}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="double-bezel-wrapper detail-desc-wrapper">
              <div className="double-bezel-inner detail-desc-inner">
                <div className="detail-meta">
                  <span>Technician: {pin.author}</span>
                  <span>Category: {pin.service}</span>
                </div>
                <p className="detail-description">
                  {pin.description}
                </p>
              </div>
            </div>

            {/* Answer Engine Section */}
            <div className="answer-engine-section">
              <h2>Project Analysis & Expert Answers</h2>
              <p className="answer-engine-subtitle">
                Deep-dive insights and local FAQ regarding {(pin.service || "roofing").toLowerCase()} solutions.
              </p>

              {pin.detailedExplanation && (
                <div className="double-bezel-wrapper ae-desc-wrapper" style={{ marginBottom: "2.5rem" }}>
                  <div className="double-bezel-inner ae-detailed-desc" style={{ padding: "2.25rem 2rem", margin: 0 }}>
                    {pin.detailedExplanation}
                  </div>
                </div>
              )}

              {pin.aeoAnswers && pin.aeoAnswers.length > 0 && (
                <div className="ae-qa-container">
                  {pin.aeoAnswers.map((qa, index) => (
                    <div key={index} className="double-bezel-wrapper">
                      <div className="double-bezel-inner ae-qa-card">
                        <h3 className="ae-qa-question">{qa.question}</h3>
                        <p className="ae-qa-answer">{qa.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <p className="detail-footer-note" style={{ marginTop: "3rem" }}>
              {"This project is a testament to our commitment to craftsmanship and durability. Whether it's complex commercial grade roofs or local residential repairs, we treat every home with absolute integrity."}
            </p>
          </div>
          
          <div className="detail-right-column">
            <ContactForm />
          </div>

        </div>
      </section>

      <style jsx>{`
        .empty-pin-detail {
          text-align: center;
          padding: 8rem 0;
          background: var(--bg);
        }

        .empty-pin-detail h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .empty-pin-detail p {
          color: var(--text-muted);
          margin-bottom: 2rem;
        }

        .detail-hero {
          background: linear-gradient(rgba(10, 12, 16, 0.94), rgba(10, 12, 16, 0.98));
          color: #ffffff;
          padding: 6rem 0 4rem;
          text-align: center;
        }

        .detail-hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .detail-hero h1 {
          color: #ffffff;
          margin: 0.5rem 0 0.5rem;
        }

        .hero-subtext {
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .detail-content {
          background: var(--bg);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 4rem;
          align-items: flex-start;
        }

        @media (max-width: 900px) {
          .detail-grid {
            grid-template-columns: 1fr;
            gap: 4rem;
          }
        }

        .back-link {
          display: inline-block;
          color: var(--secondary);
          font-weight: 700;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }

        .back-link:hover {
          color: var(--primary);
          transform: translateX(-4px);
        }

        .detail-image-wrapper {
          margin-bottom: 2rem;
          padding: 0 !important;
          border-radius: 28px !important;
        }

        .detail-image-inner {
          padding: 0 !important;
          border-radius: 20px !important;
          overflow: hidden;
        }

        .detail-img {
          width: 100%;
          height: auto;
          display: block;
          max-height: 500px;
          object-fit: cover;
        }

        .detail-desc-wrapper {
          margin-bottom: 2rem;
        }

        .detail-desc-inner {
          padding: 2.25rem 2rem !important;
        }

        .detail-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 700;
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .detail-description {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text);
          margin: 0;
        }

        .detail-footer-note {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
      `}</style>
    </>
  );
}
