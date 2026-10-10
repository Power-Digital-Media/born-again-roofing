import { MetadataRoute } from 'next';
import { getPins } from '@/lib/db';

const BASE_URL = 'https://www.bornagainroofing.com';

// Rendered on request so newly submitted (Firestore-only) projects appear without a redeploy.
// Read-only: uses the same tenant-scoped getPins() source as /api/pins and the project pages.
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pins = await getPins();

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
    'commercial-roofing',
  ];

  return [
    // Homepage
    {
      url: `${BASE_URL}/`,
      priority: 1.0,
    },

    // Service index pages
    ...serviceIndexPages.map((page) => ({
      url: `${BASE_URL}/${page}/`,
      priority: 0.9,
    })),

    // Dynamic [service] pages
    ...servicePages.map((service) => ({
      url: `${BASE_URL}/${service}/`,
      priority: 0.8,
    })),

    // Residential roofing sub-services
    ...residentialSubServices.map((sub) => ({
      url: `${BASE_URL}/residential-roofing/${sub}/`,
      priority: 0.8,
    })),

    // Storm damage sub-services
    ...stormDamageSubServices.map((sub) => ({
      url: `${BASE_URL}/storm-damage-roof-repair/${sub}/`,
      priority: 0.8,
    })),

    // Metal roofing sub-services
    ...metalRoofingSubServices.map((sub) => ({
      url: `${BASE_URL}/metal-roofing-repair-and-installation/${sub}/`,
      priority: 0.8,
    })),

    // Area pages
    ...areaPages.map((area) => ({
      url: `${BASE_URL}/areas-we-service/${area}/`,
      priority: 0.7,
    })),

    // Static pages
    ...staticPages.map((page) => ({
      url: `${BASE_URL}/${page}/`,
      priority: 0.5,
    })),

    // Project detail pages: historical snapshot + live Firestore projects (priority 0.6)
    // lastmod is intentionally omitted: the recorded job date is not a page publication/modification time,
    // and getPins() exposes no reliable page timestamp.
    ...pins.map((pin) => ({
      url: `${BASE_URL}/pin-page/?id=${pin.id}`,
      priority: 0.6,
    })),
  ];
}
