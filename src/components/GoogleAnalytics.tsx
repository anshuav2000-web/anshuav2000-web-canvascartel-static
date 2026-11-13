import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteContent, SEOContent } from "@/hooks/useSiteContent";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const GoogleAnalytics = () => {
  const location = useLocation();
  const { data: seo } = useSiteContent<SEOContent>('seo');

  useEffect(() => {
    const gaId = seo?.googleAnalyticsId;
    const gscId = seo?.googleSearchConsoleId;

    // Inject Google Search Console verification meta tag
    if (gscId) {
      let gscMeta = document.querySelector('meta[name="google-site-verification"]');
      if (!gscMeta) {
        gscMeta = document.createElement('meta');
        gscMeta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(gscMeta);
      }
      gscMeta.setAttribute('content', gscId);
    }

    // Only load GA if ID is provided
    if (!gaId) return;

    // Check if GA script already exists
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag"]`);
    if (existingScript) return;

    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      page_path: location.pathname,
    });
  }, [seo?.googleAnalyticsId, seo?.googleSearchConsoleId]);

  // Track page views on route change
  useEffect(() => {
    const gaId = seo?.googleAnalyticsId;
    if (!gaId || !window.gtag) return;

    window.gtag('config', gaId, {
      page_path: location.pathname,
    });
  }, [location.pathname, seo?.googleAnalyticsId]);

  return null;
};
