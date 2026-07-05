import React from "react";

interface SchemaProps {
  pageTitle?: string;
  pageDescription?: string;
  path?: string;
}

export default function LocalBusinessSchema({ pageTitle, pageDescription, path = "" }: SchemaProps) {
  const currentUrl = `https://www.bornagainroofing.com${path}`;
  const baseDescription = "At Born Again Home Remodeling and Roofing, we combine faith, integrity, and craftsmanship to deliver premium roofing and remodeling solutions in Jackson, MS, and surrounding Metro areas.";

  const businessSchema = {
    "@type": "RoofingContractor",
    "@id": "https://www.bornagainroofing.com/#roofingcontractor",
    "name": "Born Again Home Remodeling and Roofing",
    "alternateName": ["Born Again Roofing", "Born Again Home Remodeling"],
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
    "hasMap": "https://www.google.com/maps?cid=YOUR_GOOGLE_CID",
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
    "areaServed": [
      { "@type": "City", "name": "Jackson", "sameAs": "https://en.wikipedia.org/wiki/Jackson,_Mississippi" },
      { "@type": "City", "name": "Brandon" },
      { "@type": "City", "name": "Byram" },
      { "@type": "City", "name": "Canton" },
      { "@type": "City", "name": "Clinton" },
      { "@type": "City", "name": "Crystal Springs" },
      { "@type": "City", "name": "Florence" },
      { "@type": "City", "name": "Flowood" },
      { "@type": "City", "name": "Gluckstadt" },
      { "@type": "City", "name": "Hazlehurst" },
      { "@type": "City", "name": "Madison" },
      { "@type": "City", "name": "Pearl" },
      { "@type": "City", "name": "Raymond" },
      { "@type": "City", "name": "Richland" },
      { "@type": "City", "name": "Ridgeland" },
      { "@type": "City", "name": "Terry" },
      { "@type": "City", "name": "Utica" },
      { "@type": "City", "name": "Vicksburg" },
      { "@type": "City", "name": "Yazoo City" }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "130",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Happy Customer" },
        "datePublished": "2025-01-15",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Born Again Roofing did an amazing job on our roof replacement. Professional, on time, and great quality work. Highly recommend!"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Roofing and Remodeling Services",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Residential Roofing",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roof Repair", "url": "https://www.bornagainroofing.com/residential-roofing/roof-repair/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roof Installation", "url": "https://www.bornagainroofing.com/residential-roofing/roof-installation/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Asphalt Shingle Roof Repair and Replacement", "url": "https://www.bornagainroofing.com/residential-roofing/asphalt-shingle-roof-repair-and-replacement/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roof Inspections", "url": "https://www.bornagainroofing.com/residential-roofing/roof-inspections/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Soffit and Fascia Repair", "url": "https://www.bornagainroofing.com/residential-roofing/soffit-and-fascia-repair/" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Storm Damage Repair",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Emergency Roof Repair", "url": "https://www.bornagainroofing.com/storm-damage-roof-repair/emergency-roof-repair/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Hail Damage Roof Repair", "url": "https://www.bornagainroofing.com/storm-damage-roof-repair/hail-damage-roof-repair/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wind Damage Roof Repair", "url": "https://www.bornagainroofing.com/storm-damage-roof-repair/wind-damage-roof-repair/" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Roof Insurance Claims Help", "url": "https://www.bornagainroofing.com/storm-damage-roof-repair/roof-insurance-claims-help/" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          "name": "Metal Roofing",
          "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Standing Seam Metal Roof Installation", "url": "https://www.bornagainroofing.com/metal-roofing-repair-and-installation/standing-seam-metal-roof-installation/" } }
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
      "Roof Repair", "Roof Installation", "Storm Damage Restoration",
      "Hail Damage Repair", "Wind Damage Repair", "Emergency Tarping",
      "Metal Roofing", "Standing Seam", "GAF Shingles",
      "Kitchen Remodeling", "Bathroom Remodeling", "Whole House Remodeling",
      "Insurance Claims Assistance", "Roof Inspections"
    ],
    "slogan": "Where Faith, Craftsmanship, and Care Come Together",
    "foundingDate": "2020",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "minValue": 5,
      "maxValue": 15
    },
    "isicV4": "4391",
    "naics": "238160"
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

  // Build the @graph array
  const graphItems: Record<string, unknown>[] = [businessSchema, websiteSchema];

  if (path && path !== "/") {
    graphItems.push({
      "@type": "WebPage",
      "@id": `${currentUrl}#webpage`,
      "url": currentUrl,
      "name": pageTitle || "Born Again Roofing Service Page",
      "description": pageDescription || baseDescription,
      "isPartOf": {
        "@id": "https://www.bornagainroofing.com/#website"
      },
      "about": {
        "@id": "https://www.bornagainroofing.com/#roofingcontractor"
      }
    });

    // Add BreadcrumbList for subpages
    const pathParts = path.split("/").filter(Boolean);
    const breadcrumbItems = [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.bornagainroofing.com/"
      }
    ];

    let builtPath = "";
    pathParts.forEach((part, index) => {
      builtPath += `/${part}`;
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": index + 2,
        "name": part.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        "item": `https://www.bornagainroofing.com${builtPath}/`
      });
    });

    graphItems.push({
      "@type": "BreadcrumbList",
      "@id": `${currentUrl}#breadcrumb`,
      "itemListElement": breadcrumbItems
    });
  }

  const fullSchema = {
    "@context": "https://schema.org",
    "@graph": graphItems
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(fullSchema) }}
    />
  );
}
