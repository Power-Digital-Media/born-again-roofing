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
              <img src="/images/wp_logo.png" alt="Born Again Logo" className="footer-logo-img" />
              <div className="logo-text-wrapper">
                <span className="logo-title">Born Again</span>
                <span className="logo-subtitle">Roofing & Remodeling</span>
              </div>
            </Link>
            <p className="footer-description">
              Serving Jackson and surrounding Mississippi areas with premium roofing, siding, and remodeling solutions. Built on faith, integrity, and expert craftsmanship.
            </p>
            <div className="footer-phone">
              Call: <a href="tel:6015736178" className="phone-highlight">(601) 573-6178</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/reviews">Customer Reviews</Link></li>
              <li><Link href="/pins">Project Portfolio (Pins)</Link></li>
              <li><Link href="/contact-us">Contact & Estimates</Link></li>
              <li><Link href="/blog">Our Blog</Link></li>
              <li><Link href="/sitemap">Sitemap</Link></li>
            </ul>
          </div>

          {/* Services Links */}
          <div className="footer-nav-col">
            <h4 className="footer-heading">Our Services</h4>
            <ul className="footer-links">
              <li><Link href="/residential-roofing">Residential Roofing</Link></li>
              <li><Link href="/metal-roofing-repair-and-installation">Metal Roofing Systems</Link></li>
              <li><Link href="/storm-damage-roof-repair">Storm Damage Repair</Link></li>
              <li><Link href="/bathroom-remodeling">Bathroom Remodeling</Link></li>
              <li><Link href="/kitchen-remodeling">Kitchen Remodeling</Link></li>
              <li><Link href="/whole-house-remodeling">Whole House Remodeling</Link></li>
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
              * Emergency roofing leak assistance available 24/7.
            </p>
          </div>

        </div>

        {/* Areas Served List Section */}
        <div className="footer-areas-section">
          <h5 className="areas-heading">Areas We Service in Mississippi:</h5>
          <div className="areas-grid">
            <Link href="/areas-we-service/jackson-ms">Jackson</Link>
            <Link href="/areas-we-service/brandon-ms">Brandon</Link>
            <Link href="/areas-we-service/byram-ms">Byram</Link>
            <Link href="/areas-we-service/canton-ms">Canton</Link>
            <Link href="/areas-we-service/clinton-ms">Clinton</Link>
            <Link href="/areas-we-service/crystal-springs-ms">Crystal Springs</Link>
            <Link href="/areas-we-service/florence-ms">Florence</Link>
            <Link href="/areas-we-service/flowood-ms">Flowood</Link>
            <Link href="/areas-we-service/gluckstadt-ms">Gluckstadt</Link>
            <Link href="/areas-we-service/hazlehurst-ms">Hazlehurst</Link>
            <Link href="/areas-we-service/madison-ms">Madison</Link>
            <Link href="/areas-we-service/pearl-ms">Pearl</Link>
            <Link href="/areas-we-service/raymond-ms">Raymond</Link>
            <Link href="/areas-we-service/richland-ms">Richland</Link>
            <Link href="/areas-we-service/ridgeland-ms">Ridgeland</Link>
            <Link href="/areas-we-service/terry-ms">Terry</Link>
            <Link href="/areas-we-service/utica-ms">Utica</Link>
            <Link href="/areas-we-service/vicksburg-ms">Vicksburg</Link>
            <Link href="/areas-we-service/yazoo-city-ms">Yazoo City</Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Born Again Home Remodeling and Roofing LLC. All Rights Reserved.</p>
          <div className="footer-legal">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms and Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
