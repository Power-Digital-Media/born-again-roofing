"use client";

import React from "react";
import Link from "next/link";

interface RoofingHeroActionsProps {
  defaultService?: string;
  ctaLabel?: string;
  emergency?: boolean;
}

export default function RoofingHeroActions({
  defaultService = "Roof Replacement",
  ctaLabel = "Get Free Roof Estimate",
  emergency = false,
}: RoofingHeroActionsProps) {
  const handleOpenDrawer = (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("open-estimate-drawer", {
        detail: {
          type: emergency ? "emergency" : "estimate",
          defaultService,
        },
      })
    );
  };

  return (
    <div
      className="service-hero-actions"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.9rem",
        marginTop: "1.75rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link
          href="/contact-us/"
          onClick={handleOpenDrawer}
          className="btn btn-secondary btn-island"
        >
          {ctaLabel}
          <span className="btn-icon-wrapper">
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 11L11 1M11 1H3M11 1V9"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
        <a
          href="tel:6015736178"
          className="btn btn-outline"
          style={{
            color: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.3)",
          }}
        >
          Call (601) 573-6178
        </a>
      </div>
      <div
        style={{
          display: "inline-flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.82rem",
          color: "rgba(255, 255, 255, 0.85)",
          fontWeight: 600,
        }}
      >
        <span style={{ color: "var(--secondary)", letterSpacing: "0.05em" }}>
          ★★★★★
        </span>
        <span>5.0 (130+ Google Reviews)</span>
        <span style={{ opacity: 0.45 }}>·</span>
        <span>GAF Certified</span>
        <span style={{ opacity: 0.45 }}>·</span>
        <span>Serving Central MS</span>
      </div>
    </div>
  );
}
