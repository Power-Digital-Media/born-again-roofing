import React from "react";
import Link from "next/link";

export default function HeroCTAs() {
  return (
    <div className="hero-ctas">
      {/* Desktop: links to contact page */}
      <Link href="/contact-us" className="btn btn-secondary btn-island hero-cta-desktop">
        Get A Free Estimate
        <span className="btn-icon-wrapper">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </Link>
      {/* Mobile: smooth-scrolls to form below */}
      <a href="/contact-us" className="btn btn-secondary btn-island hero-cta-mobile">
        Request Free Estimate
        <span className="btn-icon-wrapper">
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </a>
      <a href="tel:6015736178" className="btn btn-outline">
        Call: (601) 573-6178
      </a>
    </div>
  );
}
