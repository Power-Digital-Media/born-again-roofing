import React from "react";

interface SchemaProps {
  pageTitle?: string;
  pageDescription?: string;
  path?: string;
}

export default function LocalBusinessSchema({ pageTitle, pageDescription, path = "" }: SchemaProps) {
  const currentUrl = `https://www.bornagainroofing.com${path}`;
  const baseDescription = "At Born Again Home Remodeling and Roofing, we combine faith, integrity, and craftsmanship to deliver premium roofing and remodeling solutions in Jackson, MS, and surrounding Metro areas.";

  const schema = {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "name": "Born Again Home Remodeling and Roofing",
    "alternateName": "Born Again Roofing",
    "image": "https://www.bornagainroofing.com/images/logo.png",
    "@id": "https://www.bornagainroofing.com/#roofingcontractor",
    "url": "https://www.bornagainroofing.com/",
    "telephone": "(601) 573-6178",
    "priceRange": "$$",
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
      "Jackson, MS", "Brandon, MS", "Byram, MS", "Canton, MS", 
      "Clinton, MS", "Crystal Springs, MS", "Florence, MS", 
      "Flowood, MS", "Gluckstadt, MS", "Hazlehurst, MS", 
      "Madison, MS", "Pearl, MS", "Raymond, MS", "Richland, MS", 
      "Ridgeland, MS", "Terry, MS", "Utica, MS", "Vicksburg, MS", 
      "Yazoo City, MS"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "130",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // If this is a subpage, wrap the standard business schema in a list or append the service details
  let pageSchema: Record<string, unknown> = schema;

  if (path && path !== "/") {
    pageSchema = {
      "@context": "https://schema.org",
      "@graph": [
        schema,
        {
          "@type": "WebPage",
          "@id": `${currentUrl}#webpage`,
          "url": currentUrl,
          "name": pageTitle || "Born Again Roofing Service Page",
          "description": pageDescription || baseDescription,
          "isPartOf": {
            "@id": "https://www.bornagainroofing.com/#website"
          }
        }
      ]
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
    />
  );
}
