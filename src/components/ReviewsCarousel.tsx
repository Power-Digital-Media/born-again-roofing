"use client";

import React from "react";
import Link from "next/link";

interface ReviewItem {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
}

const featuredReviews: ReviewItem[] = [
  {
    name: "Sarah K.",
    location: "Pearl, MS",
    rating: 5,
    service: "GAF Silicone Coating",
    text: "Installed GAF silicone roof system on our flat metal roof. Outstanding leak sealing and workmanship!"
  },
  {
    name: "Thomas D.",
    location: "Canton, MS",
    rating: 5,
    service: "Bathroom Remodeling",
    text: "Entire bathroom demo, subfloor repair, and reinstall. The crew worked with absolute integrity."
  },
  {
    name: "Janice M.",
    location: "Madison, MS",
    rating: 5,
    service: "Window Installation",
    text: "Professionally installed 4 large windows that look fabulous. Great carpentry trim work!"
  }
];

export default function ReviewsCarousel() {
  return (
    <section className="reviews-section">
      <div className="container">
        
        {/* Title */}
        <div className="reviews-header">
          <span className="eyebrow">Customer Testimonials</span>
          <h2>What Families Are Saying</h2>
          <div className="rating-badge-wrapper">
            <span className="rating-score">5.0 Rating</span>
            <span className="rating-stars">★★★★★</span>
            <span className="rating-source">based on 130+ Google reviews</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="reviews-grid">
          {featuredReviews.map((rev, idx) => (
            <div key={idx} className="double-bezel-wrapper">
              <div className="double-bezel-inner review-card">
                
                {/* Golden Stars */}
                <div className="review-stars">
                  {"★".repeat(rev.rating)}
                </div>

                {/* Review Text */}
                <p className="review-text">
                  “{rev.text}”
                </p>

                {/* Reviewer Details */}
                <div className="reviewer-info">
                  <h4 className="reviewer-name">
                    {rev.name}
                  </h4>
                  <span className="reviewer-meta">
                    {rev.service} • {rev.location}
                  </span>
                </div>

                {/* Quotes Graphic Ornament */}
                <span className="quotes-ornament">“</span>
              </div>
            </div>
          ))}
        </div>

        {/* Read All Reviews Button */}
        <div className="reviews-cta">
          <Link href="/reviews" className="btn btn-outline btn-island">
            Read All Customer Reviews
            <span className="btn-icon-wrapper">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}
