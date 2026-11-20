"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __barGaInitialized?: boolean;
  }
}

interface AnalyticsTrackerProps {
  gaId: string;
}

function ensureGtagQueue(gaId: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  if (!window.__barGaInitialized) {
    window.__barGaInitialized = true;
    window.gtag("js", new Date());
    if (!window.location.pathname.startsWith("/admin")) {
      window.gtag("config", gaId, { send_page_view: false });
    }
  }
}

export default function AnalyticsTracker({ gaId }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  // Track public pageviews synchronously into window.dataLayer so initial landing pages
  // never appear as "(not set)" while excluding /admin/* field-tech portal traffic.
  useEffect(() => {
    if (!gaId || !pathname || pathname.startsWith("/admin")) {
      return;
    }
    if (lastTrackedPathRef.current === pathname) return;
    lastTrackedPathRef.current = pathname;

    ensureGtagQueue(gaId);
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      send_to: gaId,
    });
  }, [gaId, pathname]);

  // Track click-to-call phone leads across all public pages
  useEffect(() => {
    if (!gaId) return;

    const handleClick = (e: MouseEvent) => {
      if (window.location.pathname.startsWith("/admin")) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      ensureGtagQueue(gaId);
      const rawHref = anchor.getAttribute("href") || "";
      window.gtag?.("event", "generate_lead", {
        event_category: "lead_phone",
        form_source: "click_to_call",
        event_label: "Phone Call Click",
        lead_origin: "Phone Call",
        page_path: window.location.pathname,
        value: 1.0,
        currency: "USD",
      });
      window.gtag?.("event", "click_to_call", {
        event_category: "lead_phone",
        phone_number: rawHref.replace(/^tel:/i, ""),
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [gaId]);

  return null;
}
