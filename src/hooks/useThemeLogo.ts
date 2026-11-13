import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSiteContent, BrandingContent, defaultBrandingContent } from "@/hooks/useSiteContent";

export const useThemeLogo = () => {
  const { resolvedTheme } = useTheme();
  const { data: branding } = useSiteContent<BrandingContent>('branding');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Before mounting, use light logo to prevent hydration mismatch
  const isDark = mounted ? resolvedTheme === 'dark' : false;
  
  // Use database values with defaults
  const brandingData = branding || defaultBrandingContent;
  
  // Use dark logo if available and in dark mode, otherwise fall back to light logo
  const logoUrl = isDark && brandingData.logoUrlDark 
    ? brandingData.logoUrlDark 
    : (brandingData.logoUrl || '');
  
  const siteName = brandingData.siteName || 'Canvas Cartel';
  const faviconUrl = brandingData.faviconUrl || '';
  
  return { logoUrl, siteName, isDark, faviconUrl, mounted };
};
