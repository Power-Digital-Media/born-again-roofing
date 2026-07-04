import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";

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
  metadataBase: new URL("https://www.bornagainroofing.com"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Remodeling and Roofing Solutions in Jackson, MS",
    description: "At Born Again Home Remodeling and Roofing, we combine faith, integrity, and craftsmanship to deliver premium roofing and remodeling solutions in Jackson, MS.",
    url: "https://www.bornagainroofing.com/",
    siteName: "Born Again Home Remodeling and Roofing",
    locale: "en_US",
    type: "website"
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
      </body>
    </html>
  );
}
