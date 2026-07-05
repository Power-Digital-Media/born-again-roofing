import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import ServiceCTA from "@/components/ServiceCTA";

interface ServiceDetail {
  title: string;
  description: string;
  heading: string;
  subheading: string;
  bodyText: string;
  faqs: { q: string; a: string }[];
}

const services: Record<string, ServiceDetail> = {
  "bathroom-remodeling": {
    title: "Bathroom Remodeling in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing LLC repairs subfloors and bathrooms in Jackson and Canton, Mississippi. Call (601) 573-6178 for details.",
    heading: "Bathroom Remodeling",
    subheading: "Custom Bathroom Renovations & Subfloor Repair Services",
    bodyText: "Bathrooms should be spaces of comfort and relaxation, not just utility. We handle complete bathroom demolition, subfloor water-damage repair, custom shower and tile installations, plumbing setups, and vanity fittings. Our craftsmen ensure your new bathroom is beautifully finished and structurally sound.",
    faqs: [
      { q: "How long does a bathroom remodeling project take?", a: "A standard bathroom remodel typically takes 1 to 2 weeks, depending on the layout modifications, tile work complexity, and plumbing additions." },
      { q: "Do you repair subfloor water damage during a bathroom remodel?", a: "Yes. Moldy or rotted subfloor repair is a key part of our structural remodeling service, ensuring your bathroom foundation remains completely solid before laying down new tile or flooring." }
    ]
  },
  "kitchen-remodeling": {
    title: "Kitchen Remodeling in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing LLC builds new cabinets and applies fresh paint in homes in Jackson, MS. Call (601) 573-6178 today.",
    heading: "Kitchen Remodeling",
    subheading: "Beautiful Cabinets, Countertops, and Complete Layout Upgrades",
    bodyText: "The kitchen is the heart of your home. We specialize in kitchen remodeling demolition, custom cabinets fabrication, granite and quartz countertops, backsplash tile work, plumbing hookups, and professional paint application. We design kitchens that blend practical cooking layouts with high-end aesthetic appeal.",
    faqs: [
      { q: "Can I remain in my home during a kitchen remodel?", a: "Yes, though the kitchen space itself will be out of service during the demolition and cabinetry installation stages. We work efficiently to minimize downtime." },
      { q: "Do you build custom cabinets or install pre-fabricated options?", a: "We offer both custom-fabricated wooden cabinetry built to your exact kitchen dimensions, and high-quality pre-fabricated options to fit various budget preferences." }
    ]
  },
  "whole-house-remodeling": {
    title: "Whole House Remodeling in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Transform Your Living Space with Whole House Remodeling in Jackson, MS. Your home should reflect your lifestyle and meet your needs. Call (601) 573-6178.",
    heading: "Whole House Remodeling",
    subheading: "Complete Interior Transformations & Structural Modifications",
    bodyText: "Bring your dream home to life with our comprehensive whole-house remodeling services. From open-concept wall removals and framing to insulation, sheetrock, flooring, trim, and paint, we manage every phase of your home renovation with premium craftsmanship and clear, honest scheduling.",
    faqs: [
      { q: "Do you handle structural load-bearing wall removals?", a: "Yes. Our remodeling services include proper structural engineering checks, beam calculations, and framing to safely create open-concept layouts." },
      { q: "Do I need permits for a whole-house remodel in Jackson, MS?", a: "Yes, major structural, electrical, or plumbing modifications require local permits. We coordinate all permitting requirements for your project." }
    ]
  },
  "painting": {
    title: "Painting in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Call Born Again Home Remodeling and Roofing LLC at 601-573-6178 for professional painting in Jackson, MS. Schedule your free estimate today.",
    heading: "Interior & Exterior Painting",
    subheading: "Flawless Finishes for Walls, Siding, and Trim",
    bodyText: "Fresh paint is one of the most effective ways to update your home. We provide professional interior and exterior painting services. Our process includes meticulous surface prep—drywall patching, sanding, pressure washing siding, and priming—to ensure a flawless, long-lasting finish using premium paints.",
    faqs: [
      { q: "How many coats of paint do you apply?", a: "We apply a minimum of two coats of premium paint over proper primer to ensure rich, uniform color and durable coverage." },
      { q: "Do you handle drywall repairs before painting?", a: "Yes. Drywall patching, sheetrock repair, and trim sanding are standard parts of our prep work to guarantee clean, smooth walls." }
    ]
  },
  "plumbing": {
    title: "Plumbing in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Give Born Again Home Remodeling and Roofing a call at 601-573-6178 for plumbing in Jackson, MS. Schedule your plumbing service today.",
    heading: "Plumbing Installation & Repair",
    subheading: "Reliable Plumbing Services for Remodels and Maintenance",
    bodyText: "Whether you are installing new sinks, showers, toilets, or need pipe adjustments during a remodel, we provide licensed plumbing services. We ensure all connections, valves, drains, and supply lines meet local building codes and resist leaks.",
    faqs: [
      { q: "Do you install plumbing fixtures during bathroom and kitchen remodels?", a: "Yes. We coordinate plumbing line relocations, drain hookups, sink installations, and shower valve fittings as part of our remodeling workflow." },
      { q: "Do you offer leak checks for newly installed plumbing?", a: "Yes. Every line and fixture undergoes pressure testing and comprehensive inspection to ensure 100% leak-free security." }
    ]
  },
  "electrical": {
    title: "Electrical Installation and Repair in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Call Born Again Home Remodeling and Roofing at 601-573-6173 for electrical installation and repair in Jackson, MS. Schedule your estimate.",
    heading: "Electrical Services",
    subheading: "Safe Wiring, Fixture Mounts, and Ceiling Fan Installations",
    bodyText: "Safe, up-to-code electrical work is crucial for any home. We handle electrical wiring relocations during remodeling, outlet additions, panel checks, light fixtures, and ceiling fan mounts (including LED controls). All work is performed by qualified technicians to ensure safety.",
    faqs: [
      { q: "Can you relocate light switches and outlets during a wall removal?", a: "Yes. We re-route electrical lines, add code-compliant outlets, and install switches in convenient locations during framing and sheetrocking." },
      { q: "Do you install LED recessed lighting systems?", a: "Yes. We design and install energy-efficient LED recessed lighting layout arrays for kitchens, living rooms, and bedrooms." }
    ]
  },
  "flooring": {
    title: "Flooring Installation in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "From complete home renovations to precise flooring installation in Jackson, MS, and surrounding areas, our team ensures every detail meets your needs.",
    heading: "Flooring Installation",
    subheading: "Hardwood, Luxury Vinyl Plank, and Premium Laminate Options",
    bodyText: "Upgrade the comfort and value of your home with our professional flooring installation services. We install hardwood flooring, durable luxury vinyl plank (LVP), and high-quality laminates. We prepare the subfloor, ensure clean level transitions, and finish with matching baseboards and quarter rounds.",
    faqs: [
      { q: "What is the best flooring option for high-moisture bathrooms?", a: "Luxury Vinyl Plank (LVP) and ceramic tile are the best choices because they are 100% waterproof and resist warping from bathroom moisture." },
      { q: "Do you remove existing flooring before installation?", a: "Yes. We handle the complete removal, disposal, and subfloor prep (leveling and patching) for a smooth, flat floor finish." }
    ]
  },
  "tile-service": {
    title: "Tile Service in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Looking for tile service in Jackson, MS? Call Born Again Home Remodeling and Roofing at 601-573-6178 today for expert tile installation.",
    heading: "Professional Tile Service",
    subheading: "Custom Showers, Backsplashes, and Ceramic Tile Flooring",
    bodyText: "Tile work adds a premium look and water protection to kitchens and bathrooms. We specialize in custom tile installations—bathroom shower surrounds, kitchen backsplashes, and tile flooring. We use quality underlayments and waterproof grouts to ensure beauty and longevity.",
    faqs: [
      { q: "How do you waterproof a custom tiled shower?", a: "We install professional waterproofing membrane systems (such as Schluter-Kerdi) beneath the tile to completely seal the shower wall cavities and base from moisture leaks." },
      { q: "What sizes of tile do you install?", a: "We install all tile types and sizes, including large format tiles, traditional subway tiles, mosaic patterns, and natural stone." }
    ]
  },
  "sheetrock": {
    title: "Sheetrock Installation in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Strong Walls, Smooth Finishes: Expert Sheetrock Services You Can Trust. At Born Again Home Remodeling and Roofing, we take pride in building quality walls.",
    heading: "Sheetrock & Drywall Services",
    subheading: "Hanging, Taping, Mudding, and Drywall Finishing",
    bodyText: "Smooth walls are the foundation of a beautiful room. We handle complete sheetrock hanging, joint taping, mudding, and custom texturing. Whether you need repairs for water-damaged ceiling drywall or complete sheetrocking for a newly framed room, we deliver flat, paint-ready walls.",
    faqs: [
      { q: "What is your standard sheetrock thickness for ceilings?", a: "We use 5/8-inch drywall for ceilings to prevent sagging between ceiling joists, and 1/2-inch drywall for standard interior walls." },
      { q: "Do you repair water-damaged drywall?", a: "Yes. We cut out water-damaged sheetrock, identify and seal leaks, replace insulation if needed, and patch in new drywall with seamless texture matching." }
    ]
  },
  "insulation": {
    title: "Attic Insulation in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "When you need insulation installation in Jackson, MS, call Born Again Home Remodeling and Roofing at 601-573-6178 today. Save on utility bills.",
    heading: "Insulation Installation",
    subheading: "Improving Energy Efficiency and Attic Climate Control",
    bodyText: "Proper insulation is crucial for keeping your home comfortable and reducing energy bills during hot summers and cold winters. We install fiberglass batt insulation and blown-in cellulose in attics and crawlspaces, ensuring correct R-value coverage and draft protection.",
    faqs: [
      { q: "How does insulation help lower my utility bills?", a: "Properly rated attic insulation acts as a barrier, preventing heat transfer. This keeps cool air in during summer, reducing the workload on your HVAC system." },
      { q: "What is R-value in insulation?", a: "R-value measures an insulation material's thermal resistance. Higher R-values mean greater insulating effectiveness. Mississippi homes typically benefit from R-38 to R-60 in attic spaces." }
    ]
  },
  "framing": {
    title: "Framing Services in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing offers framing services in Jackson, MS. Call (601) 573-6178 for solid carpentry and framing solutions.",
    heading: "Structural Framing Services",
    subheading: "Wood Stud Framing, Wall Additions, and Rafter Carpentry",
    bodyText: "Strong structural framing is the skeleton of any home modification. We offer wood stud framing for room additions, wall configurations, ceiling joists, and roof rafter repairs. We ensure all structural framing meets local load-bearing requirements.",
    faqs: [
      { q: "Do you frame new walls for room additions?", a: "Yes. We build timber wall frames, calculate load distributions, and prep structural headers for windows and doors." },
      { q: "Can you repair rotted wood rafters?", a: "Yes. Rafter rot is a common result of chronic roof leaks. We sister or replace damaged rafter studs to restore roof load support." }
    ]
  },
  "trim": {
    title: "Roof Trim in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing provides help with roof trim in Jackson, MS. Call (601) 573-6178 to schedule your services.",
    heading: "Roof Trim & Millwork",
    subheading: "Fascia Trim, Crown Molding, and Detailed Trim Finishes",
    bodyText: "Trim finishes add architectural character and complete your home's exterior and interior look. We handle fascia trim boards, baseboards, door frames, and crown moldings. We ensure tight miter cuts and smooth finishes for a premium, custom appearance.",
    faqs: [
      { q: "What materials do you use for exterior roof trim?", a: "We use rot-resistant treated lumber, composite materials (such as PVC), and painted wood wrapped in aluminum coils for maintenance-free durability." },
      { q: "Do you install interior crown molding?", a: "Yes. We install custom crown molding and door trim as part of our interior finishing remodeling services." }
    ]
  },
  "skylight-repair-and-replacement": {
    title: "Skylight Repair and Replacement in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing offers skylight repair and replacement in Jackson, MS. Call (601) 573-6178 for expert service today.",
    heading: "Skylight Repair & Replacement",
    subheading: "Leak Sealing and New Curb-Mounted Skylight Installations",
    bodyText: "Skylights are beautiful sources of natural light, but they are highly susceptible to leaking if the flashing or rubber seals decay. We repair flashing, replace old dome glass with energy-efficient glazed options, and build waterproof curbs to protect your home from water leaks.",
    faqs: [
      { q: "Why do skylights leak?", a: "Most skylight leaks are caused by decayed perimeter flashing, failing sealants, or compromised rubber gaskets around the glass dome." },
      { q: "Should I replace my skylight when getting a new roof?", a: "Yes. It is highly recommended to replace skylights during a roof replacement, as the skylight flashing must be torn off anyway, making it the most cost-effective time to install a new unit." }
    ]
  },
  "synthetic-shingles": {
    title: "Synthetic Shingles in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing installs and repairs synthetic shingles in Jackson, MS. Call (601) 573-6178 for quality roofing.",
    heading: "Synthetic Shingles Installation",
    subheading: "Premium Engineered Composites for High-End Design and Protection",
    bodyText: "Synthetic roofing shingles are engineered composite materials (made of polymers and rubbers) designed to replicate the look of natural slate or cedar shakes. They offer exceptional impact ratings (Class 4), high wind resistance, and a lifetime lifespan without the maintenance or weight concerns of natural materials.",
    faqs: [
      { q: "What is the lifespan of a synthetic shingle roof?", a: "Synthetic shingle systems typically last 50 years or more and are backed by extensive lifetime manufacturer warranties." },
      { q: "Are synthetic shingles fire-resistant?", a: "Yes, most premium synthetic shingles carry a Class A fire rating, which is the highest level of fire resistance available for residential roofing." }
    ]
  },
  "synthetic-slate-roof-installation": {
    title: "Synthetic Slate Roof Installation in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing provides synthetic slate roof installation in Jackson, MS. Call (601) 573-6178 for expert service.",
    heading: "Synthetic Slate Roof Installation",
    subheading: "The Elegance of Natural Slate Without the Structural Weight Concerns",
    bodyText: "Natural slate is stunning but incredibly heavy and brittle. Synthetic slate shingles replicate the authentic chiseled edges of slate using lightweight, impact-resistant polymers. This allows you to achieve a luxury estate look without reinforcing your home's wood framing.",
    faqs: [
      { q: "How much lighter is synthetic slate than natural slate?", a: "Synthetic slate is roughly 4 to 5 times lighter than natural slate, meaning standard roof trusses can support it without costly structural reinforcements." },
      { q: "Does synthetic slate resist fading?", a: "Yes. Synthetic slate is engineered with UV stabilizers to resist color fading, maintaining its deep charcoal or gray tones for decades." }
    ]
  },
  "synthetic-tile-roofing": {
    title: "Synthetic Tile Roofing in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing installs and repairs synthetic tile roofing in Jackson, MS. Call (601) 573-6178 for expert service.",
    heading: "Synthetic Tile Roofing",
    subheading: "Mediterranean Aesthetics with Modern Durability",
    bodyText: "Enjoy the beautiful, classic look of Spanish clay tile roofing with the benefits of lightweight polymer materials. Synthetic tile roofing resists cracking, moss growth, and wind lifting, making it a durable choice for high-end properties.",
    faqs: [
      { q: "Can synthetic clay tile break during a hailstorm?", a: "Unlike real clay tiles, which are fragile and crack easily, synthetic polymer tiles are impact-resistant, carrying a Class 4 hail rating." },
      { q: "Is synthetic tile roofing energy-efficient?", a: "Yes. The curved design of synthetic tiles allows air to circulate underneath the roof, lowering attic temperatures and AC workloads." }
    ]
  },
  "synthetic-wood-roofing": {
    title: "Synthetic Wood Roofing in Jackson, MS | Born Again Home Remodeling and Roofing",
    description: "Born Again Home Remodeling and Roofing offers synthetic wood roofing in Jackson, MS. Call (601) 573-6178 for expert installation today.",
    heading: "Synthetic Wood Shake Roofing",
    subheading: "The Rustic Charm of Cedar Shakes Without the Fire or Rot Risks",
    bodyText: "Natural cedar shakes look beautiful but are susceptible to mold, rot, insect damage, and fire. Synthetic wood shakes replicate the textured wood grain and warm tones of cedar while offering Class A fire ratings and polymer resistance to rot and weathering.",
    faqs: [
      { q: "Does synthetic wood shake require regular sealing?", a: "No. Natural cedar shakes require regular chemical treatments to prevent decay. Synthetic wood shakes require zero maintenance, sealing, or staining." },
      { q: "Are synthetic shakes wind-resistant?", a: "Yes. They are designed to interlock securely, and carry wind-uplift ratings up to 110 mph or more." }
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(services).map((service) => ({ service }));
}

interface PageProps {
  params: Promise<{ service: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service } = await params;
  const page = services[service];
  if (!page) return {};
  
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${service}/`
    }
  };
}

import ServiceBentoGrid from "@/components/ServiceBentoGrid";
import ServicePinsCarousel from "@/components/ServicePinsCarousel";
import ServiceArticle from "@/components/ServiceArticle";
import TrustedBrands from "@/components/TrustedBrands";

const serviceToPinMapping: Record<string, string[]> = {
  "bathroom-remodeling": ["Bathroom Remodeling"],
  "kitchen-remodeling": ["Kitchen Remodeling", "Cabinet Remodeling"],
  "whole-house-remodeling": ["Cabinet Remodeling", "Flooring", "Sheetrock & Drywall", "Trim & Columns"],
  "painting": ["Interior & Exterior Painting"],
  "plumbing": ["Bathroom Remodeling", "General Remodeling"],
  "electrical": ["Trim & Columns", "General Remodeling"],
  "flooring": ["Flooring"],
  "tile-service": ["Flooring", "Bathroom Remodeling"],
  "sheetrock": ["Sheetrock & Drywall"],
  "insulation": ["General Remodeling"],
  "framing": ["General Remodeling"],
  "trim": ["Trim & Columns"],
  "skylight-repair-and-replacement": ["Roof Repair"],
  "synthetic-shingles": ["Residential Roofing"],
  "synthetic-slate-roof-installation": ["Residential Roofing"],
  "synthetic-tile-roofing": ["Residential Roofing"],
  "synthetic-wood-roofing": ["Residential Roofing"]
};

const serviceBentoImages: Record<string, { url: string; location: string }[]> = {
  "bathroom-remodeling": [
    { url: "/images/wp_bathroom-h.jpg", location: "Jackson, MS" },
    { url: "/images/wp_bathroom-vanity.png", location: "Canton, MS" }
  ],
  "kitchen-remodeling": [
    { url: "/images/wp_kitchen-remodel-a-1024x1024-1.jpg", location: "Jackson, MS" },
    { url: "/images/wp_kitchen-remodel-f-1024x1024-1.jpg", location: "Brandon, MS" }
  ],
  "whole-house-remodeling": [
    { url: "/images/wp_addition-home-f.jpg", location: "Jackson, MS" },
    { url: "/images/wp_kitchen-remodel-g-1024x1024-1.jpg", location: "Madison, MS" }
  ],
  "painting": [
    { url: "/images/wp_kitchen-remodel-g.jpg", location: "Jackson, MS" },
    { url: "/images/wp_kitchen-remodel-f-1024x1024-1.jpg", location: "Pearl, MS" }
  ],
  "tile-service": [
    { url: "/images/wp_bathroom-h.jpg", location: "Jackson, MS" },
    { url: "/images/wp_kitchen-remodel-a-1024x1024-1.jpg", location: "Canton, MS" }
  ],
  "flooring": [
    { url: "/images/wp_kitchen-remodel-g-1024x1024-1.jpg", location: "Jackson, MS" },
    { url: "/images/wp_addition-home-f.jpg", location: "Flowood, MS" }
  ],
  "plumbing": [
    { url: "/images/wp_plumbing-768x1024.jpg", location: "Jackson, MS" },
    { url: "/images/wp_bathroom-vanity.png", location: "Pearl, MS" }
  ],
  "electrical": [
    { url: "/images/wp_cabinets-c.jpg", location: "Madison, MS" },
    { url: "/images/wp_addition-home-f.jpg", location: "Florence, MS" }
  ],
  "sheetrock": [
    { url: "/images/wp_interiorpaint-1024x1024.jpg", location: "Canton, MS" },
    { url: "/images/wp_flooring-b.jpg", location: "Clinton, MS" }
  ],
  "insulation": [
    { url: "/images/wp_addition-home-f.jpg", location: "Brandon, MS" },
    { url: "/images/wp_kitchen-remodel-g.jpg", location: "Ridgeland, MS" }
  ],
  "framing": [
    { url: "/images/wp_addition-home-f.jpg", location: "Jackson, MS" },
    { url: "/images/wp_soffts-fascia-home-repair-1.png", location: "Byram, MS" }
  ],
  "trim": [
    { url: "/images/wp_cabinets-d.jpg", location: "Jackson, MS" },
    { url: "/images/wp_soffts-fascia-home-repair-1.png", location: "Madison, MS" }
  ],
  "skylight-repair-and-replacement": [
    { url: "/images/wp_skylight-leak-repair-1.png", location: "Flowood, MS" },
    { url: "/images/wp_roofing-c.jpg", location: "Pearl, MS" }
  ],
  "synthetic-shingles": [
    { url: "/images/wp_synthetic-shingles-1.png", location: "Brandon, MS" },
    { url: "/images/wp_gaf.jpg", location: "Jackson, MS" }
  ],
  "synthetic-slate-roof-installation": [
    { url: "/images/wp_synthetic-slate-roofing-1.png", location: "Madison, MS" },
    { url: "/images/wp_certainteed.jpg", location: "Florence, MS" }
  ],
  "synthetic-tile-roofing": [
    { url: "/images/wp_synthetic-tile-roofing-home-1.png", location: "Pearl, MS" },
    { url: "/images/wp_roofing-f.jpg", location: "Canton, MS" }
  ],
  "synthetic-wood-roofing": [
    { url: "/images/wp_synthetic-wood-roofing-1.png", location: "Ridgeland, MS" },
    { url: "/images/wp_owens.jpg", location: "Clinton, MS" }
  ]
};

export default async function ServiceSubpage({ params }: PageProps) {
  const { service } = await params;
  const page = services[service];

  if (!page) {
    notFound();
  }

  const mappedCategories = serviceToPinMapping[service] || ["General Remodeling"];
  const overrideBentoImages = serviceBentoImages[service];

  const serviceVerses: Record<string, { ref: string; text: string }> = {
    "bathroom-remodeling": { ref: "Colossians 3:23", text: "Whatever you do, <em>work heartily</em>, as for the Lord and not for men." },
    "kitchen-remodeling": { ref: "Proverbs 24:3-4", text: "By <em>wisdom</em> a house is built, and through <em>understanding</em> it is established; through knowledge its rooms are filled with <em>rare and beautiful treasures</em>." },
    "whole-house-remodeling": { ref: "Isaiah 61:4", text: "They will <em>rebuild the ancient ruins</em> and restore the places long devastated; they will <em>renew</em> the ruined cities." },
    "painting": { ref: "Ecclesiastes 3:11", text: "He has made <em>everything beautiful</em> in its time." },
    "plumbing": { ref: "John 7:38", text: "Whoever believes in me, as Scripture has said, <em>rivers of living water</em> will flow from within them." },
    "electrical": { ref: "Matthew 5:16", text: "Let your <em>light shine</em> before others, that they may see your good deeds and <em>glorify your Father</em> in heaven." },
    "flooring": { ref: "Psalm 40:2", text: "He set my feet on <em>a rock</em> and gave me <em>a firm place to stand</em>." },
    "tile-service": { ref: "1 Corinthians 3:11", text: "For no one can lay any <em>foundation</em> other than the one already laid, which is <em>Jesus Christ</em>." },
    "sheetrock": { ref: "Nehemiah 4:6", text: "So we <em>rebuilt the wall</em> till all of it reached half its height, for the people worked with <em>all their heart</em>." },
    "insulation": { ref: "Psalm 91:1", text: "Whoever dwells in the <em>shelter of the Most High</em> will rest in the <em>shadow of the Almighty</em>." },
    "framing": { ref: "Proverbs 24:27", text: "Put your outdoor work in order and get your fields ready; after that, <em>build your house</em>." },
    "trim": { ref: "Exodus 31:4-5", text: "To make <em>artistic designs</em> for work in gold, silver and bronze, to cut and set stones, to <em>work in wood</em>, and to engage in all kinds of crafts." },
    "skylight-repair-and-replacement": { ref: "Genesis 1:3", text: "And God said, <em>Let there be light</em>, and there was light." },
    "synthetic-shingles": { ref: "Proverbs 10:25", text: "When the storm has swept by, the wicked are gone, but the <em>righteous stand firm</em> forever." },
    "synthetic-slate-roof-installation": { ref: "Matthew 7:24", text: "Everyone who hears these words of mine and puts them into practice is like <em>a wise man</em> who <em>built his house on the rock</em>." },
    "synthetic-tile-roofing": { ref: "Psalm 127:1", text: "Unless <em>the Lord builds the house</em>, the builders labor in vain." },
    "synthetic-wood-roofing": { ref: "Isaiah 44:14", text: "He cut down <em>cedars</em>... He took <em>cypress and oak</em>. He let them grow among the trees of the forest." }
  };

  const verse = serviceVerses[service];

  return (
    <>
      <LocalBusinessSchema pageTitle={page.title} pageDescription={page.description} path={`/${service}/`} />

      {/* Hero */}
      <section className="service-hero">
        <div className="container service-hero-inner scroll-reveal">
          <span className="eyebrow">
            Born Again Specialty Service
          </span>
          <h1>{page.heading}</h1>
          <p className="hero-subtext">{page.subheading}</p>

          {verse && (
            <div style={{ marginTop: "2.5rem", textAlign: "center", maxWidth: "520px" }}>
              <p
                style={{ fontStyle: "italic", fontSize: "0.95rem", lineHeight: "1.7", color: "rgba(255, 255, 255, 0.75)", margin: "0 0 0.5rem", fontWeight: "400" }}
                dangerouslySetInnerHTML={{ __html: `&ldquo;${verse.text}&rdquo;` }}
              />
              <span style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--secondary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                — {verse.ref}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Trusted Material Partners */}
      <TrustedBrands />

      {/* Dynamic Local Case Studies Carousel (Full Width directly below Hero) */}
      <section className="section" style={{ padding: "4rem 0 0" }}>
        <div className="container">
          <ServicePinsCarousel services={mappedCategories} />
        </div>
      </section>

      {/* Page Content */}
      <section className="section service-content">
        <div className="container" style={{ maxWidth: "800px" }}>
          
          <div>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Our Commitment</span>
            <h2 style={{ fontSize: "2rem", marginBottom: "1.25rem", color: "var(--primary)", marginTop: "0.5rem" }}>
              Quality Workmanship Guarantee
            </h2>
            <p className="service-intro" style={{ fontSize: "1.08rem", lineHeight: "1.7", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
              {page.bodyText}
            </p>
            
            <p className="service-body" style={{ fontSize: "0.98rem", lineHeight: "1.6", color: "var(--text-muted)" }}>
              Our team operates with high integrity. We provide clear, accurate inspection assessments so you can make informed decisions. We use top GAF materials to ensure your repaired or replaced roof resists future Mississippi storms.
            </p>
          </div>

        </div>
      </section>

      {/* Faith-Based Q&A Educational Article */}
      <ServiceArticle service={service} />

      {/* Dynamic Local Case Studies Bento Grid (Full Width) */}
      <section className="section section-alt" style={{ borderTop: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.01)", padding: "5rem 0" }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: "3.5rem" }}>
            <span className="eyebrow" style={{ color: "var(--secondary)" }}>Local Craftsmanship</span>
            <h2 style={{ fontSize: "2.2rem", fontWeight: "850", color: "var(--primary)", marginTop: "0.5rem" }}>
              Proven Results In Your Area
            </h2>
          </div>
          <ServiceBentoGrid services={mappedCategories} overrideImages={overrideBentoImages} />
        </div>
      </section>

      {/* FAQ Section (Full Width, Centered) */}
      <section className="section" style={{ borderTop: "1px solid var(--border)", padding: "5rem 0" }}>
        <div className="container" style={{ maxWidth: "850px" }}>
          <div className="service-faqs">
            <div className="text-center" style={{ marginBottom: "3.5rem" }}>
              <span className="eyebrow" style={{ color: "var(--secondary)" }}>FAQ</span>
              <h2 style={{ fontSize: "2.2rem", fontWeight: "850", color: "var(--primary)", marginTop: "0.5rem" }}>
                Common Questions & Direct Answers
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {page.faqs.map((faq, index) => (
                <div key={index} className="double-bezel-wrapper">
                  <div className="double-bezel-inner" style={{ padding: "1.75rem" }}>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--primary)", marginBottom: "0.75rem" }}>
                      {faq.q}
                    </h4>
                    <p style={{ fontSize: "0.98rem", lineHeight: "1.65", color: "var(--text-muted)", margin: 0 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <ServiceCTA />
    </>
  );
}

