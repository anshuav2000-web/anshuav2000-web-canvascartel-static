import { useState, useEffect } from 'react';
import { X, Gift, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteContent, PopupOfferContent, defaultPopupOfferContent } from '@/hooks/useSiteContent';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const PopupOffer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { data } = useSiteContent<PopupOfferContent>('popup-offer');
  const content = data || defaultPopupOfferContent;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!content.enabled) return;

    // Check if should show on current page
    const shouldShowOnPage = content.showOnPages.length === 0 || 
      content.showOnPages.some(page => location.pathname === page || page === '*');
    
    if (!shouldShowOnPage) return;

    // Check session storage for "shown once" setting
    if (content.showOncePerSession) {
      const hasShown = sessionStorage.getItem('popup-offer-shown');
      if (hasShown) return;
    }

    // Check expiry date
    if (content.expiryDate) {
      const expiry = new Date(content.expiryDate);
      if (new Date() > expiry) return;
    }

    // Show popup after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (content.showOncePerSession) {
        sessionStorage.setItem('popup-offer-shown', 'true');
      }
    }, content.delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [content, location.pathname]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCopyCode = () => {
    if (content.discountCode) {
      navigator.clipboard.writeText(content.discountCode);
      setCopied(true);
      toast.success('Discount code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleButtonClick = () => {
    setIsVisible(false);
    if (content.buttonLink) {
      navigate(content.buttonLink);
    }
  };

  if (!isVisible || !content.enabled) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ backgroundColor: content.backgroundColor || 'hsl(var(--card))' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          {content.imageUrl && (
            <div className="md:w-2/5 h-48 md:h-auto">
              <img
                src={content.imageUrl}
                alt="Offer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className={`p-8 ${content.imageUrl ? 'md:w-3/5' : 'w-full'} flex flex-col items-center text-center`}>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>

            {content.subtitle && (
              <span className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">
                {content.subtitle}
              </span>
            )}

            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3">
              {content.title}
            </h2>

            <p className="text-muted-foreground mb-6">
              {content.description}
            </p>

            {/* Discount Code */}
            {content.discountCode && (
              <div className="w-full mb-6">
                <div 
                  onClick={handleCopyCode}
                  className="flex items-center justify-center gap-3 p-4 rounded-xl bg-primary/10 border-2 border-dashed border-primary/30 cursor-pointer hover:bg-primary/20 transition-colors"
                >
                  <span className="text-xl font-mono font-bold text-primary tracking-wider">
                    {content.discountCode}
                  </span>
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Click to copy code
                </p>
              </div>
            )}

            <Button 
              onClick={handleButtonClick}
              variant="hero"
              size="lg"
              className="w-full"
            >
              {content.buttonText}
            </Button>

            <button
              onClick={handleClose}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              No thanks, I'll pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
