import { useEffect } from "react";
import { useSiteContent, BrandingContent } from "@/hooks/useSiteContent";

// Helper to update or create favicon link
const updateFaviconLink = (rel: string, href: string, type?: string, sizes?: string) => {
  // Build a unique selector based on rel and sizes
  const selector = sizes 
    ? `link[rel="${rel}"][sizes="${sizes}"]` 
    : `link[rel="${rel}"]:not([sizes])`;
  
  let link = document.querySelector(selector) as HTMLLinkElement;
  
  if (!link && href) {
    link = document.createElement('link');
    link.rel = rel;
    if (sizes) link.sizes.add(sizes);
    document.head.appendChild(link);
  }
  
  if (link) {
    link.href = href;
    if (type) link.type = type;
  }
};

export const DynamicFavicon = () => {
  const { data: branding } = useSiteContent<BrandingContent>('branding');

  useEffect(() => {
    const faviconUrl = branding?.faviconUrl;
    
    if (faviconUrl) {
      // Update all favicon links to use database favicon
      // This ensures Google Search and browsers pick up the correct favicon
      
      // Standard icon (no size)
      updateFaviconLink('icon', faviconUrl, 'image/png');
      
      // Sized icons for Google Search compatibility
      updateFaviconLink('icon', faviconUrl, 'image/png', '32x32');
      updateFaviconLink('icon', faviconUrl, 'image/png', '16x16');
      
      // Apple touch icon
      updateFaviconLink('apple-touch-icon', faviconUrl, undefined, '180x180');
      
      // Shortcut icon (legacy support)
      updateFaviconLink('shortcut icon', faviconUrl);
      
      console.log('[DynamicFavicon] Updated all favicons to:', faviconUrl);
    }
  }, [branding?.faviconUrl]);

  return null;
};
