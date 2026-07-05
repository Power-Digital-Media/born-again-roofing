import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.bornagainroofing.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Dynamic [service] pages
  const servicePages = [
    'bathroom-remodeling',
    'kitchen-remodeling',
    'whole-house-remodeling',
    'painting',
    'plumbing',
    'electrical',
    'flooring',
    'tile-service',
    'sheetrock',
    'insulation',
    'framing',
    'trim',
    'skylight-repair-and-replacement',
    'synthetic-shingles',
    'synthetic-slate-roof-installation',
    'synthetic-tile-roofing',
    'synthetic-wood-roofing',
  ];

  // Residential roofing sub-services
  const residentialSubServices = [
    'roof-repair',
    'roof-installation',
    'asphalt-shingle-roof-repair-and-replacement',
    'roof-inspections',
    'soffit-and-fascia-repair',
  ];

  // Storm damage sub-services
  const stormDamageSubServices = [
    'emergency-roof-repair',
    'roof-patches-and-leak-repair',
    'hail-damage-roof-repair',
    'wind-damage-roof-repair',
    'roof-insurance-claims-help',
  ];

  // Metal roofing sub-services
  const metalRoofingSubServices = [
    'standing-seam-metal-roof-installation',
  ];

  // Area pages
  const areaPages = [
    'brandon-ms',
    'byram-ms',
    'canton-ms',
    'clinton-ms',
    'crystal-springs-ms',
    'florence-ms',
    'flowood-ms',
    'gluckstadt-ms',
    'hazlehurst-ms',
    'jackson-ms',
    'madison-ms',
    'pearl-ms',
    'raymond-ms',
    'richland-ms',
    'ridgeland-ms',
    'terry-ms',
    'utica-ms',
    'vicksburg-ms',
    'yazoo-city-ms',
  ];

  // Static pages (priority 0.5)
  const staticPages = [
    'about-us',
    'contact-us',
    'reviews',
    'blog',
    'pins',
    'areas-we-service',
    'sitemap',
    'privacy-policy',
    'terms-and-conditions',
  ];

  // Service index pages (priority 0.9)
  const serviceIndexPages = [
    'residential-roofing',
    'storm-damage-roof-repair',
    'metal-roofing-repair-and-installation',
  ];

  return [
    // Homepage
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      priority: 1.0,
    },

    // Service index pages
    ...serviceIndexPages.map((page) => ({
      url: `${BASE_URL}/${page}/`,
      lastModified: now,
      priority: 0.9,
    })),

    // Dynamic [service] pages
    ...servicePages.map((service) => ({
      url: `${BASE_URL}/${service}/`,
      lastModified: now,
      priority: 0.8,
    })),

    // Residential roofing sub-services
    ...residentialSubServices.map((sub) => ({
      url: `${BASE_URL}/residential-roofing/${sub}/`,
      lastModified: now,
      priority: 0.8,
    })),

    // Storm damage sub-services
    ...stormDamageSubServices.map((sub) => ({
      url: `${BASE_URL}/storm-damage-roof-repair/${sub}/`,
      lastModified: now,
      priority: 0.8,
    })),

    // Metal roofing sub-services
    ...metalRoofingSubServices.map((sub) => ({
      url: `${BASE_URL}/metal-roofing-repair-and-installation/${sub}/`,
      lastModified: now,
      priority: 0.8,
    })),

    // Area pages
    ...areaPages.map((area) => ({
      url: `${BASE_URL}/areas-we-service/${area}/`,
      lastModified: now,
      priority: 0.7,
    })),

    // Static pages
    ...staticPages.map((page) => ({
      url: `${BASE_URL}/${page}/`,
      lastModified: now,
      priority: 0.5,
    })),
  ];
}
