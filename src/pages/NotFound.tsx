import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search, Mail } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    // Set 404 meta for SEO
    document.title = "Page Not Found | Canvas Cartel";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'The page you are looking for could not be found. Return to Canvas Cartel homepage or explore our services.');
    }
    // Set noindex for 404 pages
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, follow');
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Large 404 with gradient */}
          <div className="relative mb-8">
            <h1 className="text-[150px] md:text-[200px] font-display font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-primary/40 to-primary/5">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-12 h-12 text-primary" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="gap-2">
              <Link to="/">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link to="/services">
                <ArrowLeft className="w-4 h-4" />
                View Services
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="gap-2">
              <Link to="/contact">
                <Mail className="w-4 h-4" />
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Quick links */}
          <div className="border-t border-border pt-8">
            <p className="text-sm text-muted-foreground mb-4">Popular pages you might be looking for:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/about" className="text-primary hover:underline text-sm">About Us</Link>
              <Link to="/services" className="text-primary hover:underline text-sm">Our Services</Link>
              <Link to="/projects" className="text-primary hover:underline text-sm">Projects</Link>
              <Link to="/contact" className="text-primary hover:underline text-sm">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
