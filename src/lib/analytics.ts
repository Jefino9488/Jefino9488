// Google Analytics 4 (GA4) Utility for Single Page Applications (SPA)

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = (
  import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined
)?.trim();

let isInitialized = false;

/**
 * Initializes Google Analytics 4 by dynamically injecting the gtag.js script
 * and configuring the Measurement ID.
 */
export function initGA(): void {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || isInitialized) {
    return;
  }

  // Prevent multiple injections
  if (document.getElementById("ga-gtag-script")) {
    isInitialized = true;
    return;
  }

  // Inject gtag.js script
  const script = document.createElement("script");
  script.id = "ga-gtag-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  // Disable automatic initial page_view so AnalyticsTracker handles it consistently across all SPA route transitions
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false,
  });

  isInitialized = true;
}

/**
 * Tracks virtual pageviews on client-side route changes.
 */
export function trackPageView(path: string, title?: string): void {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || !window.gtag) {
    return;
  }

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title || document.title,
  });
}

/**
 * Tracks custom user events (e.g. project click, resume download).
 */
export function trackEvent(
  action: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID || !window.gtag) {
    return;
  }

  window.gtag("event", action, params);
}
