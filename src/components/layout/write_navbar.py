import os

path = r'C:/Users/Priyankur/Downloads/canvascartel-main/canvascartel-main/src/components/layout/Navbar.tsx'

content = '''import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, ChevronRight, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { 
  useSiteContent, 
  HeaderContent,
  defaultHeaderContent,
} from "@/hooks/useSiteContent";
import { useThemeLogo } from "@/hooks/useThemeLogo";
import { cn } from "@/lib/utils";

interface HeaderFooterContent {
  header: HeaderContent;
}

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logoUrl, siteName } = useThemeLogo();
  const { data: headerFooterData } = useSiteContent<HeaderFooterContent>('header-footer');
  const { theme, setTheme, resolvedTheme } = useTheme();

  const header = headerFooterData?.header || defaultHeaderContent;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('nav') && !target.closest('[data-modal]')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const getActiveClass = (path: string) => {
    return location.pathname === path 
      ? "text-white after:absolute after:border-primary after:border-b-2 after:w-full after:bottom-0 after:transition-all after:duration-300"
      : "text-muted-foreground hover:text-white hover:after:bg-primary/60 hover:after:transition-all hover:after:duration-300";
  };

  // Generate staggered transition delay for mobile menu items
  const getStaggerDelay = (index: number) => \`\${index * 60}ms\`;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled 
          ? "bg-[#0a0404]/95 backdrop-blur-2xl border-b border-[#1a1010]/40 shadow-2xl shadow-black/30"
          : "bg-transparent border-b border-transparent"
      )}
      style={{
        "--scroll-direction": scrollDirection === 'up' ? '1' : '-1',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 md:h-24 lg:h-28">
          {/* Left: Logo - Always visible, no lazy loading */}
          <Link 
            to="/" 
            className="flex items-center gap-3 flex-shrink-0 group cursor-pointer"
            aria-label={\`\${siteName} - Home\`}
          >
            <div className="flex items-center">
              <img 
                src={logoUrl || "https://dsuvcvbtxdftlbhuvsnv.supabase.co/storage/v1/object/public/site-assets/logos/logo-light-1767101176264.png"}
                alt={siteName}
                width={160}
                height={48}
                loading="eager"
                decoding="sync"
                className="h-9 w-auto sm:h-11 max-w-[180px] object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_20px_hsl(0,_85%,_55%_/_0.4)]"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#3a2a1a]/20 to-[#2a1a0a]/20 border border-[#3a2a1a]/30">
              <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-[#ff6b4a]" />
              <span className="text-sm font-outfit font-bold text-[#f0e8e0] tracking-wide">
                {siteName}
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center justify-center gap-1 xl:gap-2">
              {header.navLinks.map((link, index) => (
                <Link
                  key={link.id}
                  to={link.path}
                  className={cn(
                    "relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group",
                    getActiveClass(link.path)
                  )}
                  onMouseEnter={(e) => {
                    if (location.pathname !== link.path) {
                      const el = e.currentTarget;
                      const after = el.querySelector(':scope .after:last-child');
                      if (after) {
                        setTimeout(() => {
                          let width = 0;
                          const timer = setInterval(() => {
                            width += 12;
                            after.style.width = width + 'px';
                            if (width >= 80) clearInterval(timer);
                          }, 16);
                        }, 50);
                      }
                    }
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    const after = el.querySelector(':scope .after:last-child');
                    if (after) {
                      after.style.width = '0px';
                    }
                  }}
                >
                  <span className="flex items-center gap-2">
                    {link.name}
                    <span className="after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:rounded-full after:transition-all after:duration-300 after:origin-bottom after:ease-out" style={{ pointerEvents: 'none' }} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Theme Toggle + CTA */}
          <div className="hidden lg:flex items-center justify-end flex-shrink-0 gap-3">
            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className={cn(
                "p-2.5 rounded-xl transition-all duration-300 cursor-pointer",
                scrolled 
                  ? "bg-secondary/30 hover:bg-secondary/50 text-[#f0e8e0] hover:text-[#f0e8e0]" 
                  : "text-[#f0e8e0] hover:text-[#f0e8e0]"
              )}
              aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                background: 'radial-gradient(ellipse at center, hsl(0,85%,55% / 0.05) 0%, transparent 70%)',
              }}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-500 transition-transform duration-300 hover:scale-110" />
              ) : (
                <Moon className="h-5 w-5 text-blue-500 transition-transform duration-300 hover:scale-110" />
              )}
            </button>
            <Button 
              variant="gradient" 
              size="default" 
              className="h-11 !py-3 text-sm font-semibold text-white"
              onClick={() => navigate(header.ctaLink)}
            >
              {header.ctaText}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile: Hamburger Menu */}
          <button
            className="lg:hidden p-2.5 -mr-2 cursor-pointer rounded-xl transition-all duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            style={{
              background: 'radial-gradient(ellipse at center, hsl(0,85%,55% / 0.08) 0%, transparent 70%)',
            }}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-[#f0e8e0] transition-transform duration-300 hover:scale-110" />
            ) : (
              <Menu className="h-6 w-6 text-[#f0e8e0] transition-transform duration-300 hover:scale-110" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu - Full Screen Overlay with staggered animation */}
      <div
        className={cn(
          "lg:hidden transition-all duration-500 ease-out",
          isOpen 
            ? "opacity-100 visible max-h-[100vh] pt-8" 
            : "opacity-0 invisible max-h-0 overflow-hidden"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 py-6 flex flex-col gap-1">
          {header.navLinks.map((link, index) => (
            <Link
              key={link.id}
              to={link.path}
              className={cn(
                "text-lg font-medium py-4 px-4 rounded-xl transition-all duration-200 flex items-center gap-3 group",
                location.pathname === link.path 
                  ? "text-white bg-gradient-to-r from-[#3a2a1a]/20 to-[#2a1a0a]/20 border border-[#3a2a1a]/40" 
                  : "text-[#f0e8e0] hover:text-white hover:bg-secondary/30"
              )}
              style={{ 
                transitionDelay: getStaggerDelay(index),
                position: 'relative',
              }}
            >
              <span className={cn(
                "absolute left-0 top-1 bottom-1 w-0.5 rounded-full transition-all duration-300",
                location.pathname === link.path 
                  ? "bg-gradient-to-b from-[#ff6b4a] to-[#ff8a6a]" 
                  : "bg-[#ff6b4a]/30 group-hover:from-[#ff6b4a] group-hover:to-[#ff8a6a]"
              )} 
              />
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
                location.pathname === link.path && "text-transparent"
              )} />
              <span className="relative z-10">{link.name}</span>
            </Link>
          ))}
          
          <div className="mt-4 pt-4 border-t border-[#1a1010]/30">
            <Button 
              variant="gradient" 
              className="w-full justify-center h-12 text-base font-semibold"
              onClick={() => {
                setIsOpen(false);
                navigate(header.ctaLink);
              }}
            >
              {header.ctaText}
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Theme Toggle */}
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="mt-3 flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 cursor-pointer text-[#f0e8e0]"
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'radial-gradient(ellipse at center, hsl(0,85%,55% / 0.05) 0%, transparent 70%)',
            }}
          >
            <span className="text-sm">{resolvedTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            {resolvedTheme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-blue-500" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
'''

with open(path, 'w') as f:
    f.write(content)

print(f'Written: {path} ({os.path.getsize(path)} bytes)')
