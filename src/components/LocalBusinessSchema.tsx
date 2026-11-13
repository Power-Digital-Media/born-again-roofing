import React from "react";

interface SchemaProps {
  pageTitle?: string;
  pageDescription?: string;
  path?: string;
}

const MISSISSIPPI_STATE = {
  "@type": "State",
  "name": "Mississippi",
  "sameAs": "https://en.wikipedia.org/wiki/Mississippi",
};

const SERVED_MS_CITIES = [
  { name: "Florence, MS", sameAs: "https://en.wikipedia.org/wiki/Florence,_Mississippi" },
  { name: "Jackson, MS", sameAs: "https://en.wikipedia.org/wiki/Jackson,_Mississippi" },
  { name: "Brandon, MS", sameAs: "https://en.wikipedia.org/wiki/Brandon,_Mississippi" },
  { name: "Madison, MS", sameAs: "https://en.wikipedia.org/wiki/Madison,_Mississippi" },
  { name: "Pearl, MS", sameAs: "https://en.wikipedia.org/wiki/Pearl,_Mississippi" },
  { name: "Flowood, MS", sameAs: "https://en.wikipedia.org/wiki/Flowood,_Mississippi" },
  { name: "Ridgeland, MS", sameAs: "https://en.wikipedia.org/wiki/Ridgeland,_Mississippi" },
  { name: "Clinton, MS", sameAs: "https://en.wikipedia.org/wiki/Clinton,_Mississippi" },
  { name: "Byram, MS", sameAs: "https://en.wikipedia.org/wiki/Byram,_Mississippi" },
  { name: "Richland, MS", sameAs: "https://en.wikipedia.org/wiki/Richland,_Mississippi" },
  { name: "Canton, MS", sameAs: "https://en.wikipedia.org/wiki/Canton,_Mississippi" },
  { name: "Gluckstadt, MS", sameAs: "https://en.wikipedia.org/wiki/Gluckstadt,_Mississippi" },
  { name: "Terry, MS", sameAs: "https://en.wikipedia.org/wiki/Terry,_Mississippi" },
  { name: "Raymond, MS", sameAs: "https://en.wikipedia.org/wiki/Raymond,_Mississippi" },
  { name: "Crystal Springs, MS", sameAs: "https://en.wikipedia.org/wiki/Crystal_Springs,_Mississippi" },
  { name: "Hazlehurst, MS", sameAs: "https://en.wikipedia.org/wiki/Hazlehurst,_Mississippi" },
  { name: "Utica, MS", sameAs: "https://en.wikipedia.org/wiki/Utica,_Mississippi" },
  { name: "Vicksburg, MS", sameAs: "https://en.wikipedia.org/wiki/Vicksburg,_Mississippi" },
  { name: "Yazoo City, MS", sameAs: "https://en.wikipedia.org/wiki/Yazoo_City,_Mississippi" },
];

export default function LocalBusinessSchema({ pageTitle, pageDescription, path = "" }: SchemaProps) {
  const currentUrl = `https://www.bornagainroofing.com${path}`;
  const baseDescription =
    "Born Again Home Remodeling & Roofing LLC provides GAF-certified roof repair, roof replacement, storm & hail damage restoration, roof inspections, standing seam metal roofing, commercial roofing, and custom home remodeling across Florence, Brandon, Madison, Jackson, and Central Mississippi.";

  const businessSchema = {
    "@type": ["RoofingContractor", "HomeAndConstructionBusiness", "GeneralContractor"],
    "@id": "https://www.bornagainroofing.com/#roofingcontractor",
    "name": "Born Again Home Remodeling and Roofing",
    "alternateName": [
      "Born Again Home Remodeling & Roofing",
      "Born Again Roofing",
      "Born Again Home Remodeling",
    ],
    "legalName": "Born Again Home Remodeling & Roofing LLC",
    "description": baseDescription,
    "image": [
      "https://www.bornagainroofing.com/images/logo.png",
      "https://www.bornagainroofing.com/images/wp_roofing-c.jpg",
      "https://www.bornagainroofing.com/images/wp_logo.png"
    ],
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.bornagainroofing.com/images/logo.png",
      "width": 300,
      "height": 300
    },
    "url": "https://www.bornagainroofing.com/",
    "telephone": "+1-601-573-6178",
    "priceRange": "$$",
    "currenciesAccepted": "USD",
    "paymentAccepted": "Cash, Credit Card, Check, Insurance",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "150 Highland Dr",
      "addressLocality": "Florence",
      "addressRegion": "MS",
      "postalCode": "39073",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 32.1610,
      "longitude": -90.1309
    },
    "hasMap": "https://www.google.com/maps?cid=7250007381384144851",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "17:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/BornAgainHomeRemodelingAndRoofing/",
      "https://www.bbb.org/us/ms/florence/profile/home-improvement/born-again-home-remodeling-roofing-llc-0523-141851401"
    ],
    "areaServed": SERVED_MS_CITIES.map((city) => ({
      "@type": "City",
      "name": city.name,
      "sameAs": city.sameAs,
      "containedInPlace": MISSISSIPPI_STATE,
    })),
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Roofing and Home Remodeling Services in Central Mississippi",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Residential Roofing",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roof Repair", "url": "https://www.bornagainroofing.com/residential-roofing/roof-repair/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roof Installation & Replacement", "url": "https://www.bornagainroofing.com/residential-roofing/roof-installation/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asphalt Shingle Roof Repair and Replacement", "url": "https://www.bornagainroofing.com/residential-roofing/asphalt-shingle-roof-repair-and-replacement/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roof Inspections", "url": "https://www.bornagainroofing.com/residential-roofing/roof-inspections/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Soffit and Fascia Repair", "url": "https://www.bornagainroofing.com/residential-roofing/soffit-and-fascia-repair/" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Storm Damage Roof Repair",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Emergency Roof Repair & Tarping", "url": "https://www.bornagainroofing.com/storm-damage-roof-repair/emergency-roof-repair/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hail Damage Roof Repair", "url": "https://www.bornagainroofing.com/storm-damage-roof-repair/hail-damage-roof-repair/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wind Damage Roof Repair", "url": "https://www.bornagainroofing.com/storm-damage-roof-repair/wind-damage-roof-repair/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roof Insurance Claims Help", "url": "https://www.bornagainroofing.com/storm-damage-roof-repair/roof-insurance-claims-help/" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Metal & Commercial Roofing",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Standing Seam Metal Roof Installation", "url": "https://www.bornagainroofing.com/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial & Flat Roofing", "url": "https://www.bornagainroofing.com/commercial-roofing/" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Home Remodeling",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bathroom Remodeling", "url": "https://www.bornagainroofing.com/bathroom-remodeling/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Kitchen Remodeling", "url": "https://www.bornagainroofing.com/kitchen-remodeling/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Whole House Remodeling", "url": "https://www.bornagainroofing.com/whole-house-remodeling/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Interior/Exterior Painting", "url": "https://www.bornagainroofing.com/painting/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Flooring", "url": "https://www.bornagainroofing.com/flooring/" } }
          ]
        }
      ]
    },
    "knowsAbout": [
      "Roof Repair", "Roof Replacement", "Roof Installation", "Storm Damage Restoration",
      "Hail Damage Repair", "Wind Damage Repair", "Emergency Tarping",
      "Metal Roofing", "Standing Seam Metal Roofs", "Commercial Flat Roofing", "GAF Architectural Shingles",
      "Kitchen Remodeling", "Bathroom Remodeling", "Whole House Remodeling",
      "Insurance Claims Assistance", "Roof Inspections"
    ],
    "slogan": "Where Faith, Craftsmanship, and Care Come Together",
    "foundingDate": "2020"
  };

  const websiteSchema = {
    "@type": "WebSite",
    "@id": "https://www.bornagainroofing.com/#website",
    "url": "https://www.bornagainroofing.com/",
    "name": "Born Again Home Remodeling and Roofing",
    "publisher": {
      "@id": "https://www.bornagainroofing.com/#roofingcontractor"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.bornagainroofing.com/sitemap/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const webpageSchema: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": `${currentUrl}#webpage`,
    "url": currentUrl,
    "name":
      pageTitle ||
      (path === "/"
        ? "Roofing Contractors & Home Remodeling in Jackson, MS | Born Again Home Remodeling & Roofing"
        : "Born Again Home Remodeling and Roofing"),
    "description": pageDescription || baseDescription,
    "isPartOf": {
      "@id": "https://www.bornagainroofing.com/#website"
    },
    "about": {
      "@id": "https://www.bornagainroofing.com/#roofingcontractor"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        "h1",
        ".hero-subtext",
        ".service-hero-inner p",
        ".faq-question-text",
        ".faq-answer-text",
        ".scripture-text",
        ".aeo-lead",
        ".speakable"
      ]
    }
  };

  const fullSchema = {
    "@context": "https://schema.org",
    "@graph": [businessSchema, websiteSchema, webpageSchema]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(fullSchema) }}
    />
  );
}
