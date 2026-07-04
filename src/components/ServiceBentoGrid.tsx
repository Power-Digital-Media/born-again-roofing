"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import pinsData from "@/data/pins.json";

interface ServiceBentoGridProps {
  services: string[];
  fallbackImages?: string[];
  overrideImages?: { url: string; location: string }[];
}

export default function ServiceBentoGrid({ services, fallbackImages = ["/images/wp_roofing-c.jpg", "/images/wp_kitchen-remodel-a-1024x1024-1.jpg"], overrideImages }: ServiceBentoGridProps) {
  const bentoData = useMemo(() => {
    // Filter pins matching categories
    const matchingPins = pinsData.filter((pin) =>
      services.some((svc) => pin.service.toLowerCase().includes(svc.toLowerCase()))
    );

    // If override images are explicitly provided, prioritize them for premium aesthetic control
    if (overrideImages && overrideImages.length >= 2) {
      return {
        img1: overrideImages[0],
        img2: overrideImages[1],
        totalJobs: matchingPins.length
      };
    }

    // Extract unique images
    const images: { url: string; location: string }[] = [];
    matchingPins.forEach((pin) => {
      if (pin.images && pin.images.length > 0) {
        pin.images.forEach((img) => {
          if (!images.some((i) => i.url === img)) {
            images.push({ url: img, location: pin.location });
          }
        });
      }
    });

    return {
      img1: images[0] || { url: fallbackImages[0], location: "Central Mississippi" },
      img2: images[1] || { url: fallbackImages[1], location: "Central Mississippi" },
      totalJobs: matchingPins.length
    };
  }, [services, fallbackImages, overrideImages]);

  return (
    <div className="service-bento-grid scroll-reveal" style={{ marginTop: "2rem", marginBottom: "3rem" }}>
      <div className="bento-grid">
        
        {/* Cell 1: Large 8-span Card - Local Proof & Materials */}
        <div className="double-bezel-wrapper bento-col-8">
          <div className="double-bezel-inner bento-split-card">
            <div className="bento-split-content">
              <span className="bento-badge" style={{ background: "rgba(var(--secondary-rgb), 0.1)", color: "var(--secondary)", fontSize: "0.68rem", padding: "3px 8px", borderRadius: "20px", fontWeight: 700, textTransform: "uppercase", display: "inline-block", marginBottom: "12px" }}>
                GAF Certified Standards
              </span>
              <h3 style={{ fontSize: "1.3rem", margin: "0 0 10px", fontWeight: 800 }}>Premium Local Materials</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.5", margin: "0 0 15px" }}>
                We source only the highest grade materials from trusted manufacturers to protect your home. All shingles are installed strictly to manufacturer specifications to secure your lifetime GAF warranty.
              </p>
              <ul style={{ paddingLeft: "1.2rem", margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
                <li>GAF Timberline HDZ shingles & accessories</li>
                <li>Synthetic high-performance underlayment</li>
                <li>Rust-resistant, heavy-duty drip edge guides</li>
              </ul>
            </div>
            <div className="bento-split-image" style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bentoData.img1.url} alt="Local project site" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span className="bento-img-badge">{bentoData.img1.location}</span>
            </div>
          </div>
        </div>

        {/* Cell 2: Small 4-span Card - Faith & Integrity Promise */}
        <div className="double-bezel-wrapper bento-col-4">
          <div className="double-bezel-inner value-card-bento" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <span style={{ fontSize: "2rem", marginBottom: "12px", display: "block" }}>🛡️</span>
            <h3 style={{ fontSize: "1.25rem", margin: "0 0 8px", fontWeight: 800, color: "var(--primary)" }}>Our Faith Promise</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.55", margin: 0, flexGrow: 1 }}>
              {"Guided by our Christian principles, we put people before profits. You will always get honest estimates, transparent timelines, and clean job sites."}
            </p>
            <Link href="/about-us/" style={{ fontSize: "0.8rem", color: "var(--secondary)", fontWeight: 700, textDecoration: "none", marginTop: "15px", display: "block" }}>
              Learn About Us →
            </Link>
          </div>
        </div>

        {/* Cell 3: Small 4-span Card - Local Authority Stat */}
        <div className="double-bezel-wrapper bento-col-4">
          <div className="double-bezel-inner value-card-bento" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--secondary)", display: "block", lineHeight: 1, marginBottom: "8px" }}>
              {bentoData.totalJobs > 0 ? `${bentoData.totalJobs}+` : "145+"}
            </span>
            <h3 style={{ fontSize: "1.1rem", margin: "0 0 6px", fontWeight: 800 }}>Jobs Near You</h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.4", margin: 0 }}>
              Completed projects right in your neighborhood with real local photos.
            </p>
          </div>
        </div>

        {/* Cell 4: Large 8-span Card - Workmanship & Clean Site */}
        <div className="double-bezel-wrapper bento-col-8">
          <div className="double-bezel-inner bento-split-card" style={{ flexDirection: "row-reverse" }}>
            <div className="bento-split-content">
              <span className="bento-badge" style={{ background: "rgba(var(--secondary-rgb), 0.1)", color: "var(--secondary)", fontSize: "0.68rem", padding: "3px 8px", borderRadius: "20px", fontWeight: 700, textTransform: "uppercase", display: "inline-block", marginBottom: "12px" }}>
                Cleanup Guarantee
              </span>
              <h3 style={{ fontSize: "1.3rem", margin: "0 0 10px", fontWeight: 800 }}>Immaculate Job Cleanup</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.5", margin: 0 }}>
                We treat your lawn and driveway with respect. Our crew sweeps for stray nails using magnetic rollers and ensures all roofing debris is carted away before we depart. Your home will look completely born again.
              </p>
            </div>
            <div className="bento-split-image" style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={bentoData.img2.url} alt="Local project site photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span className="bento-img-badge">{bentoData.img2.location}</span>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 1.5rem;
        }

        .bento-col-8 {
          grid-column: span 8;
        }

        .bento-col-4 {
          grid-column: span 4;
        }

        .bento-split-card {
          display: flex;
          padding: 0 !important;
          height: 100%;
          min-height: 240px;
        }

        .bento-split-content {
          width: 55%;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .bento-split-image {
          width: 45%;
          height: 100%;
          min-height: 240px;
          overflow: hidden;
        }

        .bento-img-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(10, 12, 16, 0.75);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 20px;
        }

        .value-card-bento {
          padding: 1.75rem !important;
        }

        @media (max-content-width: 991px) {
          .bento-col-8, .bento-col-4 {
            grid-column: span 12;
          }
          .bento-split-card {
            flex-direction: column !important;
          }
          .bento-split-content, .bento-split-image {
            width: 100%;
          }
          .bento-split-image {
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
}
