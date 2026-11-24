import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        
        {/* Top Grid */}
        <div className="footer-top-grid">
          
          {/* Brand Info */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-header.webp" alt="Born Again Home Remodeling and Roofing Logo" className="footer-logo-img" width={48} height={48} loading="lazy" decoding="async" />
              <div className="logo-text-wrapper">
                <span className="logo-title">Born Again</span>
                <span className="logo-subtitle">Home Remodeling &amp; Roofing</span>
              </div>
            </Link>
            <p className="footer-description">
              Headquartered in Florence, MS and serving Jackson, Brandon, Madison, Pearl, Flowood, and Central Mississippi with GAF-certified roofing and custom home remodeling. Built on faith, integrity, and craftsmanship.
            </p>
            <div className="footer-phone">
              Call: <a href="tel:6015736178" className="phone-highlight">(601) 573-6178</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/about-us/">About Us</Link></li>
              <li><Link href="/reviews/">Customer Reviews</Link></li>
              <li><Link href="/pins/" prefetch={false}>Project Portfolio (Pins)</Link></li>
              <li><Link href="/areas-we-service/">Service Areas</Link></li>
              <li><Link href="/contact-us/">Contact &amp; Free Estimate</Link></li>
              <li><Link href="/blog/">Roofing &amp; Remodeling Blog</Link></li>
              <li><Link href="/sitemap/">HTML Sitemap</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Roofing &amp; Remodeling</h4>
            <ul className="footer-links">
              <li><Link href="/residential-roofing/">Residential Roofing</Link></li>
              <li><Link href="/residential-roofing/roof-installation/">Roof Replacement</Link></li>
              <li><Link href="/residential-roofing/roof-repair/">Roof Repair</Link></li>
              <li><Link href="/storm-damage-roof-repair/">Storm Damage Restoration</Link></li>
              <li><Link href="/storm-damage-roof-repair/hail-damage-roof-repair/">Hail Damage Roof Repair</Link></li>
              <li><Link href="/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation/">Standing Seam Metal Roofs</Link></li>
              <li><Link href="/commercial-roofing/">Commercial &amp; Flat Roofing</Link></li>
              <li><Link href="/kitchen-remodeling/">Kitchen Remodeling</Link></li>
              <li><Link href="/bathroom-remodeling/">Bathroom Remodeling</Link></li>
              <li><Link href="/whole-house-remodeling/">Whole House Remodeling</Link></li>
            </ul>
          </div>

          {/* Operations & Hours */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Business Hours</h4>
            <ul className="footer-hours">
              <li>
                <span>Monday - Friday:</span>
                <strong>8:00 AM - 5:00 PM</strong>
              </li>
              <li className="closed-day">
                <span>Saturday - Sunday:</span>
                <strong>Closed</strong>
              </li>
            </ul>
            <p className="footer-hours-note">
              * Emergency storm tarping &amp; active roof leak response available 24/7.
            </p>
          </div>

        </div>

        {/* Areas Served List Section */}
        <div className="footer-areas-section">
          <h5 className="areas-heading">Central Mississippi Cities We Serve:</h5>
          <div className="areas-grid">
            <Link href="/areas-we-service/florence-ms/">Florence (HQ)</Link>
            <Link href="/areas-we-service/brandon-ms/">Brandon</Link>
            <Link href="/areas-we-service/jackson-ms/">Jackson</Link>
            <Link href="/areas-we-service/madison-ms/">Madison</Link>
            <Link href="/areas-we-service/pearl-ms/">Pearl</Link>
            <Link href="/areas-we-service/flowood-ms/">Flowood</Link>
            <Link href="/areas-we-service/ridgeland-ms/">Ridgeland</Link>
            <Link href="/areas-we-service/clinton-ms/">Clinton</Link>
            <Link href="/areas-we-service/byram-ms/">Byram</Link>
            <Link href="/areas-we-service/richland-ms/">Richland</Link>
            <Link href="/areas-we-service/canton-ms/">Canton</Link>
            <Link href="/areas-we-service/gluckstadt-ms/">Gluckstadt</Link>
            <Link href="/areas-we-service/terry-ms/">Terry</Link>
            <Link href="/areas-we-service/raymond-ms/">Raymond</Link>
            <Link href="/areas-we-service/crystal-springs-ms/">Crystal Springs</Link>
            <Link href="/areas-we-service/hazlehurst-ms/">Hazlehurst</Link>
            <Link href="/areas-we-service/utica-ms/">Utica</Link>
            <Link href="/areas-we-service/vicksburg-ms/">Vicksburg</Link>
            <Link href="/areas-we-service/yazoo-city-ms/">Yazoo City</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Born Again Home Remodeling and Roofing LLC. All Rights Reserved.</p>
          <div className="footer-legal">
            <Link href="/privacy-policy/">Privacy Policy</Link>
            <Link href="/terms-and-conditions/">Terms and Conditions</Link>
            <span className="footer-separator">•</span>
            <span className="footer-credit">Designed &amp; Engineered by <a href="https://powerdigitalmedia.org" target="_blank" rel="noopener noreferrer" className="credit-link">Power Digital Media</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
