import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook, Youtube, Github, Globe, Sparkles, Package } from "lucide-react";
import { useSiteContent, FooterContent, defaultFooterContent } from "@/hooks/useSiteContent";
import { useThemeLogo } from "@/hooks/useThemeLogo";

// Social icon mapping
const socialIconMap = {
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Facebook: Facebook,
  YouTube: Youtube,
  GitHub: Github,
  Gmail: Mail,
};

export const Footer = () => {
  const { logoUrl, siteName } = useThemeLogo();
  const { data: headerFooterData } = useSiteContent<HeaderFooterContent>("header-footer");

  const footer = headerFooterData?.footer || defaultFooterContent;

  return (
    <footer className="bg-card border-t border-border/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12">
          {/* Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="group cursor-spot">
              <img
                src={logoUrl || "https://dsuvcvbtxdftlbhuvsnv.supabase.co/storage/v1/object/public/site-assets/logos/logo-light-1767101176264.png"}
                alt={siteName}
                className="h-8 sm:h-10 max-w-[140px] sm:max-w-[180px] object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]"
              />
            </Link>
            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{footer.tagline}</p>
            <div className="flex gap-3 sm:gap-4 pt-2">
              {footer.socialLinks.map((social) => {
                const Icon = socialIconMap[social.platform] || Instagram;
                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-secondary/50 hover:bg-primary/20 border border-border/30 transition-all duration-300 hover-lift cursor-spot"
                    aria-label={social.platform}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground hover:text-primary" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary/60" />
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {["Home", "About", "Services", "Projects", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm flex items-center gap-1.5 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
              <Package className="h-4 w-4 text-primary/60" />
              Services
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {footer.servicesLinks.map((service, index) => (
                <li key={index}>
                  <Link
                    to="/services"
                    className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm flex items-center gap-1.5 group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary/60" />
              Contact Us
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center gap-2 sm:gap-3 text-muted-foreground text-xs sm:text-sm group cursor-spot">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="break-all">{footer.contactEmail}</span>
              </li>
              <li className="flex items-center gap-2 sm:gap-3 text-muted-foreground text-xs sm:text-sm group cursor-spot">
                <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>{footer.contactPhone}</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3 text-muted-foreground text-xs sm:text-sm group cursor-spot">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span>{footer.contactAddress}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-border/30 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
          © {new Date().getFullYear()} {footer.copyrightText}
        </p>
        <div className="flex gap-4 sm:gap-6">
          <Link
            to="/privacy"
            className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
          >
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};
