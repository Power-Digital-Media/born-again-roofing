import React from "react";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Blog | Born Again Home Remodeling and Roofing",
  description: "Read the latest news and advice on roofing and remodeling from Born Again Home Remodeling and Roofing. Call (601) 573-6178.",
  alternates: {
    canonical: "/blog/"
  }
};

export default function BlogPage() {
  return (
    <>
      <LocalBusinessSchema pageTitle="Blog" pageDescription="Read the latest news and advice from Born Again Home Remodeling and Roofing." path="/blog/" />

      {/* Hero */}
      <section className="blog-hero">
        <div className="container blog-hero-inner scroll-reveal">
          <span className="eyebrow" style={{ color: "var(--secondary)" }}>Resources & News</span>
          <h1>Our Blog</h1>
          <p className="hero-subtext">
            Roofing tips, remodeling advice, and company updates.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section blog-content">
        <div className="container blog-grid">
          
          <div className="blog-posts-column">
            <div className="double-bezel-wrapper">
              <div className="double-bezel-inner empty-state-card">
                <span className="empty-icon">📰</span>
                <h2>No Articles Posted Yet</h2>
                <p>
                  We are preparing a series of helpful guides, local project spotlights, and expert roofing tips to help Mississippi homeowners maintain their properties. Check back soon for our first posts!
                </p>
              </div>
            </div>
          </div>
          
          <div className="blog-sidebar">
            <ContactForm type="callback" />
          </div>

        </div>
      </section>
    </>
  );
}
