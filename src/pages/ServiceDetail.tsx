import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Loader2, LucideIcon, Megaphone, Share2, Globe, Video, Camera, Target, Palette, Briefcase, TrendingUp, Zap, Workflow } from "lucide-react";
import { useSiteContent, defaultServices, ServicesContent, ServiceItem } from "@/hooks/useSiteContent";
import { useState } from "react";

// Icon mapping for dynamic rendering
const iconMap: Record<string, LucideIcon> = {
  Megaphone,
  Share2,
  Globe,
  Video,
  Camera,
  Target,
  Palette,
  Briefcase,
  TrendingUp,
  Zap,
  Workflow,
};

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSiteContent<ServicesContent>('services');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const services = data?.services || defaultServices;
  const service = services.find((s) => s.id === serviceId);
  const currentIndex = services.findIndex((s) => s.id === serviceId);
  const prevService = currentIndex > 0 ? services[currentIndex - 1] : null;
  const nextService = currentIndex < services.length - 1 ? services[currentIndex + 1] : null;

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!service) {
    navigate('/services', { replace: true });
    return null;
  }

  const IconComponent = iconMap[service.icon] || Briefcase;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-hero relative noise">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link 
            to="/services" 
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <IconComponent className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
                  {service.title}
                </h1>
                <p className="text-primary font-semibold text-lg mt-2">{service.pricing}</p>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {service.fullDescription || service.description}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              What's <span className="text-gradient">Included</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {service.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 hover-lift transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {service.gallery && service.gallery.length > 0 && (
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Our <span className="text-gradient">Work</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.gallery.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className="aspect-[4/3] rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <img 
                    src={image} 
                    alt={`${service.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {service.videos && service.videos.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-display font-bold mb-8 text-center">
              Video <span className="text-gradient">Showcase</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {service.videos.map((video, index) => {
                // Check if it's an uploaded video file
                const isUploadedVideo = video.includes('supabase') && 
                  (video.endsWith('.mp4') || video.endsWith('.webm') || video.endsWith('.mov') || video.endsWith('.avi'));
                
                if (isUploadedVideo) {
                  return (
                    <div key={index} className="aspect-video rounded-xl overflow-hidden bg-muted">
                      <video
                        src={video}
                        title={`${service.title} - Video ${index + 1}`}
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      />
                    </div>
                  );
                }
                
                // Parse YouTube or Vimeo URLs
                let embedUrl = "";
                if (video.includes("youtube.com") || video.includes("youtu.be")) {
                  const videoId = video.includes("youtu.be") 
                    ? video.split("youtu.be/")[1]?.split("?")[0]
                    : video.split("v=")[1]?.split("&")[0];
                  if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`;
                } else if (video.includes("vimeo.com")) {
                  const videoId = video.split("vimeo.com/")[1]?.split("?")[0];
                  if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
                }
                
                if (!embedUrl) return null;
                
                return (
                  <div key={index} className="aspect-video rounded-xl overflow-hidden bg-muted">
                    <iframe
                      src={embedUrl}
                      title={`${service.title} - Video ${index + 1}`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-foreground hover:text-primary transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImage} 
            alt="Gallery image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Navigation */}
      <section className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {prevService ? (
              <Link 
                to={`/services/${prevService.id}`}
                className="flex items-center gap-3 group"
              >
                <ArrowLeft className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Previous</span>
                  <p className="font-display font-semibold group-hover:text-primary transition-colors">
                    {prevService.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}
            
            {nextService ? (
              <Link 
                to={`/services/${nextService.id}`}
                className="flex items-center gap-3 text-right group"
              >
                <div>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Next</span>
                  <p className="font-display font-semibold group-hover:text-primary transition-colors">
                    {nextService.title}
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Get <span className="text-gradient">Started?</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss your requirements and create something extraordinary together.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
