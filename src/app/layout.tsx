import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";
import ScrollRevealInit from "@/components/ScrollRevealInit";
import FormDrawer from "@/components/FormDrawer";
import FloatingCTA from "@/components/FloatingCTA";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "700", "800"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Born Again Roofing",
    default: "Born Again Roofing & Home Remodeling | Jackson & Brandon MS",
  },
  description:
    "5.0★ GAF-certified roof replacement, storm repair & kitchen/bath home remodeling in Brandon, Florence, Madison & Jackson, MS. Free inspection: (601) 573-6178.",
  metadataBase: new URL("https://www.bornagainroofing.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title:
      "Born Again Roofing & Home Remodeling | Jackson, Brandon & Florence, MS",
    description:
      "5.0★ GAF-certified roof repair, roof replacement, storm damage restoration, metal roofing & custom home remodeling across Central Mississippi.",
    url: "https://www.bornagainroofing.com/",
    siteName: "Born Again Home Remodeling and Roofing",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Born Again Home Remodeling and Roofing — Central Mississippi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Born Again Roofing & Home Remodeling | Central MS",
    description:
      "5.0★ GAF-certified roofing and custom home remodeling across Florence, Brandon, Madison & Jackson, MS. Free inspection: (601) 573-6178.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geist.variable}`}>
      <head>
        {GA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(id){try{if(location.pathname.indexOf('/admin')===0)return;window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};window.__barGaBootPath=location.pathname;window.gtag('js',new Date());window.gtag('config',id,{page_path:location.pathname,page_location:location.href});}catch(_){}})(${JSON.stringify(
                GA_ID
              )});`,
            }}
          />
        )}
      </head>
      <body
        style={{
          fontFamily: "var(--font-geist), sans-serif",
          margin: 0,
          padding: 0,
        }}
      >
        {GA_ID && <AnalyticsTracker gaId={GA_ID} />}
        <Header />
        <main style={{ flexGrow: 1 }}>{children}</main>
        <Footer />
        <MobileBottomBar />
        <ScrollRevealInit />
        <FormDrawer />
        <FloatingCTA />
      </body>
    </html>
  );
}
