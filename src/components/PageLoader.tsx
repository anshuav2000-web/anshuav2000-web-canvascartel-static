import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { 
  useSiteContent, 
  BrandingContent, 
  defaultBrandingContent,
  LoadingPageContent,
  defaultLoadingPageContent
} from "@/hooks/useSiteContent";

export const PageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const { resolvedTheme } = useTheme();
  const { data: branding, isLoading: isBrandingLoading } = useSiteContent<BrandingContent>('branding');
  const { data: loadingSettings, isLoading: isSettingsLoading } = useSiteContent<LoadingPageContent>('loading-page');
  
  // Track previous path to prevent double-render on same route
  const prevPathRef = useRef<string | null>(null);
  const isInitialMount = useRef(true);
  
  const siteName = branding?.siteName || defaultBrandingContent.siteName;
  const settings = loadingSettings || defaultLoadingPageContent;
  const isDark = resolvedTheme === 'dark';
  
  // Determine which logo to show based on settings and theme
  const getDisplayLogoUrl = () => {
    if (isSettingsLoading) return '';
    
    // If custom loading logo is enabled, use it (no theme variant for custom loading logo)
    if (settings.useCustomLogo && settings.customLogoUrl) {
      return settings.customLogoUrl;
    }
    
    // Otherwise use branding logo with theme awareness
    if (isDark && branding?.logoUrlDark) {
      return branding.logoUrlDark;
    }
    return branding?.logoUrl || '';
  };
  
  const displayLogoUrl = getDisplayLogoUrl();

  useEffect(() => {
    // Don't show loader if disabled
    if (!settings.enabled) return;
    
    // Skip initial mount to prevent flash on first load
    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevPathRef.current = location.pathname;
      return;
    }
    
    // Skip if the path hasn't actually changed (prevents double render)
    if (prevPathRef.current === location.pathname) {
      return;
    }
    
    prevPathRef.current = location.pathname;

    // Show loader on route change
    setIsLoading(true);
    setIsVisible(true);

    // Hide loader after configured duration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, settings.duration);

    // Remove from DOM after animation
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, settings.duration + 200);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [location.pathname, settings.enabled, settings.duration]);

  if (!isVisible || !settings.enabled) return null;

  const getAnimationClass = () => {
    switch (settings.animationType) {
      case 'pulse':
        return 'animate-pulse-logo';
      case 'float':
        return 'animate-logo-float';
      default:
        return '';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${
        isLoading ? "opacity-100" : "opacity-0"
      }`}
      style={{ 
        backgroundColor: settings.backgroundColor || 'hsl(var(--background))'
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        {settings.showLogo && (
          <div className="relative">
            {/* Always show logo image - never show text fallback */}
            <img
              src={displayLogoUrl || "https://dsuvcvbtxdftlbhuvsnv.supabase.co/storage/v1/object/public/site-assets/loading/loading-logo-1767101147927.png"}
              alt={siteName}
              className={`object-contain ${getAnimationClass()} ${
                settings.logoSize === 'small' ? 'h-10 sm:h-12 max-w-[120px]' :
                settings.logoSize === 'large' ? 'h-20 sm:h-28 max-w-[280px]' :
                settings.logoSize === 'xlarge' ? 'h-28 sm:h-36 max-w-[360px]' :
                'h-16 sm:h-20 max-w-[200px]'
              }`}
            />
            
            {/* Glow effect behind logo */}
            {settings.animationType === 'pulse' && (
              <div className="absolute inset-0 -z-10 blur-2xl opacity-50">
                <div 
                  className="w-full h-full rounded-full animate-pulse-slow" 
                  style={{ backgroundColor: settings.glowColor || 'hsl(var(--primary) / 0.3)' }}
                />
              </div>
            )}
          </div>
        )}

        {/* Loading bar */}
        {settings.showLoadingBar && (
          <div className="w-32 sm:w-48 h-1 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-loading-bar" />
          </div>
        )}

        {/* Loading text */}
        {settings.showLoadingText && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {settings.loadingText}
          </p>
        )}
      </div>
    </div>
  );
};
