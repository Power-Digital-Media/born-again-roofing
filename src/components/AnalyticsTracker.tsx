"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    __barGaBootPath?: string;
    __barGtagScriptLoaded?: boolean;
  }
}

interface AnalyticsTrackerProps {
  gaId: string;
}

const SESSION_TIMEOUT_GUARD_MS = 25 * 60 * 1000; // 25 minutes

export function ensureGtagQueue(gaId: string): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  if (!window.__barGaBootPath) {
    window.__barGaBootPath = window.location.pathname;
    window.gtag("js", new Date());
    window.gtag("config", gaId, {
      page_path: window.location.pathname,
      page_location: window.location.href,
    });
  }
}

function loadGtagScriptOnce(gaId: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;
  if (window.__barGtagScriptLoaded) return;
  window.__barGtagScriptLoaded = true;

  ensureGtagQueue(gaId);
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
    gaId
  )}`;
  document.head.appendChild(script);
}

/**
 * Fires `generate_lead` AND session-deduplicated `qualify_lead` (configured as an
 * active GA4 Key Event on properties/558135974) + flushes gtag.js immediately so
 * verified form submissions and phone calls always register as GA4 Key Events.
 */
export function emitVerifiedLeadConversion(params: {
  gaId?: string;
  eventCategory: "lead_form" | "lead_phone";
  formSource: string;
  leadOrigin: string;
  value?: number;
  extra?: Record<string, string | number>;
}): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;

  const effectiveGaId =
    params.gaId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-CY1Y3Y7YFR";
  ensureGtagQueue(effectiveGaId);
  loadGtagScriptOnce(effectiveGaId);

  const payload: Record<string, string | number> = {
    event_category: params.eventCategory,
    form_source: params.formSource,
    lead_origin: params.leadOrigin,
    page_path: window.location.pathname,
    value: params.value ?? 1.0,
    currency: "USD",
    ...(params.extra || {}),
  };

  window.gtag?.("event", "generate_lead", payload);

  // Also emit `qualify_lead` once per browser session so GA4's active `qualify_lead`
  // Key Event increments ONCE_PER_SESSION immediately!
  let alreadyCountedInSession = false;
  try {
    alreadyCountedInSession =
      window.sessionStorage.getItem("__bar_qualified_lead_v1") === "1";
    if (!alreadyCountedInSession) {
      window.sessionStorage.setItem("__bar_qualified_lead_v1", "1");
    }
  } catch {
    // Ignore storage restrictions
  }

  if (!alreadyCountedInSession) {
    window.gtag?.("event", "qualify_lead", payload);
  }
}

export default function AnalyticsTracker({ gaId }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const initialBootHandledRef = useRef(false);
  const lastTrackedPathRef = useRef<string | null>(null);
  const hiddenSinceRef = useRef<number | null>(null);

  // Defer heavy 183KB gtag.js download until first user interaction OR post-load idle window,
  // while completely skipping /admin/* field-crew routes.
  useEffect(() => {
    if (!gaId || typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/admin")) return;

    ensureGtagQueue(gaId);

    const onFirstInteraction = () => {
      loadGtagScriptOnce(gaId);
      cleanupListeners();
    };

    const events = ["pointerdown", "touchstart", "keydown", "scroll"] as const;
    const cleanupListeners = () => {
      for (const ev of events) {
        window.removeEventListener(ev, onFirstInteraction);
      }
    };

    for (const ev of events) {
      window.addEventListener(ev, onFirstInteraction, {
        once: true,
        passive: true,
      });
    }

    const fallbackTimer = window.setTimeout(() => {
      loadGtagScriptOnce(gaId);
      cleanupListeners();
    }, 4500);

    return () => {
      cleanupListeners();
      window.clearTimeout(fallbackTimer);
    };
  }, [gaId]);

  // Track subsequent SPA navigations cleanly without duplicating the initial <head> page_view
  useEffect(() => {
    if (!gaId || !pathname || pathname.startsWith("/admin")) {
      return;
    }

    ensureGtagQueue(gaId);

    if (!initialBootHandledRef.current) {
      initialBootHandledRef.current = true;
      lastTrackedPathRef.current = pathname;
      // If user navigated from /admin to a public page in-session, fire page_view now
      if (window.__barGaBootPath !== pathname) {
        loadGtagScriptOnce(gaId);
        window.gtag?.("event", "page_view", {
          page_path: pathname,
          page_location: window.location.href,
          page_title: document.title,
          send_to: gaId,
        });
      }
      return;
    }

    if (lastTrackedPathRef.current === pathname) return;
    lastTrackedPathRef.current = pathname;

    loadGtagScriptOnce(gaId);
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      send_to: gaId,
    });
  }, [gaId, pathname]);

  // Prevent GA4 "(not set)" landing pages when a backgrounded tab resumes after >= 25m timeout
  useEffect(() => {
    if (!gaId || typeof document === "undefined") return;

    const onVisibilityChange = () => {
      if (window.location.pathname.startsWith("/admin")) return;
      if (document.visibilityState === "hidden") {
        hiddenSinceRef.current = Date.now();
      } else if (
        document.visibilityState === "visible" &&
        hiddenSinceRef.current !== null
      ) {
        const elapsed = Date.now() - hiddenSinceRef.current;
        hiddenSinceRef.current = null;
        if (elapsed >= SESSION_TIMEOUT_GUARD_MS) {
          ensureGtagQueue(gaId);
          loadGtagScriptOnce(gaId);
          window.gtag?.("event", "page_view", {
            page_path: window.location.pathname,
            page_location: window.location.href,
            page_title: document.title,
            send_to: gaId,
          });
        }
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [gaId]);

  // Track click-to-call phone leads across all public pages
  useEffect(() => {
    if (!gaId) return;

    const handleClick = (e: MouseEvent) => {
      if (window.location.pathname.startsWith("/admin")) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href^="tel:"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const rawHref = anchor.getAttribute("href") || "";
      const cleanPhone = rawHref.replace(/^tel:/i, "");

      emitVerifiedLeadConversion({
        gaId,
        eventCategory: "lead_phone",
        formSource: "click_to_call",
        leadOrigin: "Phone Call",
        value: 1.0,
        extra: {
          event_label: "Phone Call Click",
          phone_number: cleanPhone,
        },
      });

      window.gtag?.("event", "click_to_call", {
        event_category: "lead_phone",
        phone_number: cleanPhone,
        page_path: window.location.pathname,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [gaId]);

  return null;
}
