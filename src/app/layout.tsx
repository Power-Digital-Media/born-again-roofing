import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";
import ScrollRevealInit from "@/components/ScrollRevealInit";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Born Again Roofing",
    default: "Remodeling and Roofing Solutions in Jackson, MS | Born Again Home Remodeling and Roofing"
  },
  description: "At Born Again Home Remodeling and Roofing, we combine faith, integrity, and craftsmanship to deliver premium roofing and remodeling solutions in Jackson, MS, and surrounding areas. Call (601) 573-6178 for free estimates.",
  metadataBase: new URL("https://born-again-roofing.netlify.app"),
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ]
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    title: "Remodeling and Roofing Solutions in Jackson, MS",
    description: "At Born Again Home Remodeling and Roofing, we combine faith, integrity, and craftsmanship to deliver premium roofing and remodeling solutions in Jackson, MS.",
    url: "https://born-again-roofing.netlify.app/",
    siteName: "Born Again Home Remodeling and Roofing",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Born Again Home Remodeling and Roofing — Jackson, MS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Born Again Home Remodeling and Roofing",
    description: "Premium roofing and remodeling solutions in Jackson, MS. Built on faith, integrity, and expert craftsmanship.",
    images: ["/images/og-image.png"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${geist.variable}`}>
      <head>
        {/* GA4 Script Integration */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body style={{ fontFamily: "var(--font-geist), sans-serif", margin: 0, padding: 0 }}>
        <Header />
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>
        <Footer />
        <MobileBottomBar />
        <ScrollRevealInit />
      </body>
    </html>
  );
}
