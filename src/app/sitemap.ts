import { MetadataRoute } from 'next';

const BASE_URL = 'https://www.bornagainroofing.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Core roofing pillar pages (highest commercial priority)
  const serviceIndexPages = [
    'residential-roofing',
    'storm-damage-roof-repair',
    'metal-roofing-repair-and-installation',
    'commercial-roofing',
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

  // Central Mississippi service area hubs (all 19 verified MS communities)
  const areaPages = [
    'florence-ms',
    'jackson-ms',
    'brandon-ms',
    'madison-ms',
    'pearl-ms',
    'flowood-ms',
    'ridgeland-ms',
    'clinton-ms',
    'byram-ms',
    'richland-ms',
    'canton-ms',
    'gluckstadt-ms',
    'terry-ms',
    'raymond-ms',
    'crystal-springs-ms',
    'hazlehurst-ms',
    'utica-ms',
    'vicksburg-ms',
    'yazoo-city-ms',
  ];

  // Dynamic [service] pages (remodeling + specialty roofing)
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

  // Static company & trust pages
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

  // Note: Individual /pin-page/?id=* query-string views are intentionally excluded
  // from sitemap.xml and marked noindex,follow so 100% of crawl budget and project
  // content equity concentrates onto the canonical service and Central MS city pages.
  return [
    {
      url: `${BASE_URL}/`,
      priority: 1.0,
    },

    ...serviceIndexPages.map((page) => ({
      url: `${BASE_URL}/${page}/`,
      priority: 0.95,
    })),

    ...residentialSubServices.map((sub) => ({
      url: `${BASE_URL}/residential-roofing/${sub}/`,
      priority: 0.85,
    })),

    ...stormDamageSubServices.map((sub) => ({
      url: `${BASE_URL}/storm-damage-roof-repair/${sub}/`,
      priority: 0.85,
    })),

    ...metalRoofingSubServices.map((sub) => ({
      url: `${BASE_URL}/metal-roofing-repair-and-installation/${sub}/`,
      priority: 0.85,
    })),

    ...areaPages.map((area) => ({
      url: `${BASE_URL}/areas-we-service/${area}/`,
      priority: 0.85,
    })),

    ...servicePages.map((service) => ({
      url: `${BASE_URL}/${service}/`,
      priority: 0.8,
    })),

    ...staticPages.map((page) => ({
      url: `${BASE_URL}/${page}/`,
      priority: 0.5,
    })),
  ];
}
