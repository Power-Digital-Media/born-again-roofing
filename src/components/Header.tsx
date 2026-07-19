"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const closeMenu = () => {
    setMobileMenuOpen(false);
    setServicesOpen(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "unset";
    }
  };

  return (
    <header className="glass header-container">
      <div className="container header-inner">
        
        {/* Logo / Brand */}
        <Link href="/" className="logo-link">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/wp_logo.png" alt="Born Again Roofing Logo" className="logo-img" />
          <div className="logo-text-wrapper">
            <span className="logo-title">Born Again</span>
            <span className="logo-subtitle">Roofing &amp; Remodeling</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="desktop-nav">
          <Link href="/about-us" className="nav-link">About Us</Link>
          
          {/* Services Dropdown */}
          <div className="dropdown">
            <span className="nav-link dropdown-toggle">
              Services ▾
            </span>
            <div className="dropdown-menu">
              <Link href="/residential-roofing">Residential Roofing</Link>
              <Link href="/metal-roofing-repair-and-installation">Metal Roofing</Link>
              <Link href="/storm-damage-roof-repair">Storm Damage Repair</Link>
              <div className="dropdown-divider" />
              <Link href="/bathroom-remodeling">Bathroom Remodeling</Link>
              <Link href="/kitchen-remodeling">Kitchen Remodeling</Link>
              <Link href="/whole-house-remodeling">Whole House Remodeling</Link>
            </div>
          </div>

          <Link href="/areas-we-service" className="nav-link">Areas Served</Link>
          <Link href="/pins" className="nav-link">Project Pins</Link>
          <Link href="/reviews" className="nav-link">Reviews</Link>
          <Link 
            href="/contact-us" 
            className="btn btn-primary btn-island"
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(
                new CustomEvent("open-estimate-drawer", {
                  detail: { type: "estimate" }
                })
              );
            }}
          >
            Free Estimate
            <span className="btn-icon-wrapper">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
        </nav>

        {/* Mobile menu toggle (Morphing Hamburger) */}
        <button 
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            if (!mobileMenuOpen) {
              setServicesOpen(false);
            }
            if (typeof document !== "undefined") {
              document.body.style.overflow = !mobileMenuOpen ? "hidden" : "unset";
            }
          }}
          className={`mobile-toggle ${mobileMenuOpen ? "open" : ""}`}
          aria-label="Toggle Menu"
        >
          <span className="line line-1"></span>
          <span className="line line-2"></span>
        </button>

      </div>

      {/* Mobile nav drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-nav-links">
          <Link href="/about-us" className="mobile-nav-link" onClick={closeMenu}>About Us</Link>
          
          {/* Services accordion */}
          <button
            className={`mobile-nav-link mobile-nav-accordion-toggle ${servicesOpen ? "expanded" : ""}`}
            onClick={() => setServicesOpen(!servicesOpen)}
            aria-expanded={servicesOpen}
          >
            Services
            <svg className="accordion-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div className={`mobile-nav-accordion-panel ${servicesOpen ? "expanded" : ""}`}>
            <Link href="/residential-roofing" className="mobile-nav-sublink" onClick={closeMenu}>Residential Roofing</Link>
            <Link href="/metal-roofing-repair-and-installation" className="mobile-nav-sublink" onClick={closeMenu}>Metal Roofing</Link>
            <Link href="/storm-damage-roof-repair" className="mobile-nav-sublink" onClick={closeMenu}>Storm Damage Repair</Link>
            <Link href="/bathroom-remodeling" className="mobile-nav-sublink" onClick={closeMenu}>Bathroom Remodeling</Link>
            <Link href="/kitchen-remodeling" className="mobile-nav-sublink" onClick={closeMenu}>Kitchen Remodeling</Link>
            <Link href="/whole-house-remodeling" className="mobile-nav-sublink" onClick={closeMenu}>Whole House Remodeling</Link>
          </div>

          <Link href="/areas-we-service" className="mobile-nav-link" onClick={closeMenu}>Areas Served</Link>
          <Link href="/pins" className="mobile-nav-link" onClick={closeMenu}>Project Pins</Link>
          <Link href="/reviews" className="mobile-nav-link" onClick={closeMenu}>Reviews</Link>
          <Link 
            href="/contact-us" 
            className="btn btn-primary btn-island mobile-nav-link mobile-cta" 
            onClick={(e) => {
              e.preventDefault();
              closeMenu();
              window.dispatchEvent(
                new CustomEvent("open-estimate-drawer", {
                  detail: { type: "estimate" }
                })
              );
            }}
          >
            Free Estimate
            <span className="btn-icon-wrapper">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>
          <div className="mobile-nav-phone mobile-nav-link">
            <a href="tel:6015736178" onClick={closeMenu}>
              Call: (601) 573-6178
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
