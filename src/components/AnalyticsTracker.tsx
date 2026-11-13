"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

interface AnalyticsTrackerProps {
  gaId: string;
}

export default function AnalyticsTracker({ gaId }: AnalyticsTrackerProps) {
  const pathname = usePathname();

  // Track public pageviews while excluding /admin/* field-tech portal traffic
  // (cellular CGNAT gateways in Dallas/Atlanta otherwise skew GA4 state reports).
  useEffect(() => {
    if (!gaId || !pathname || pathname.startsWith("/admin")) {
      return;
    }
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("config", gaId, {
        page_path: pathname,
      });
    }
  }, [gaId, pathname]);

  // Track click-to-call phone leads across all public pages
  useEffect(() => {
    if (!gaId) return;

    const handleClick = (e: MouseEvent) => {
      if (window.location.pathname.startsWith("/admin")) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      if (typeof window.gtag === "function") {
        const rawHref = anchor.getAttribute("href") || "";
        window.gtag("event", "generate_lead", {
          event_category: "Lead",
          event_label: "Phone Call Click",
          lead_origin: "Phone Call",
          page_path: window.location.pathname,
          value: 1.0,
          currency: "USD",
        });
        window.gtag("event", "click_to_call", {
          phone_number: rawHref.replace(/^tel:/i, ""),
          page_path: window.location.pathname,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [gaId]);

  return null;
}
