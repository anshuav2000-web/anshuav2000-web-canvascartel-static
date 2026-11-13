import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Award, Zap, Users, Star, TrendingUp } from "lucide-react";

/**
 * SEO-optimized content section for homepage
 * Provides 600-800 words of keyword-rich, semantic HTML content
 * with proper H2-H6 heading hierarchy for search engines
 */
export const SEOContent = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Block - SEO optimized with proper heading hierarchy */}
          <article className="prose prose-invert max-w-none">
            {/* H2 - Primary topic */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold mb-6 text-foreground">
              India's Premier <span className="text-gradient">Creative Design & Marketing Studio</span>
            </h2>
            
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
              Canvas Cartel is a full-service creative agency based in India, specializing in advertisement design, 
              social media marketing, website development, and video production. We transform brands through 
              strategic creativity and data-driven marketing solutions that deliver measurable results.
            </p>

            {/* H3 - Subtopic 1 */}
            <h3 className="text-xl sm:text-2xl font-display font-semibold mt-10 mb-4 text-foreground">
              Comprehensive Digital Marketing Services
            </h3>
            
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
              Our integrated approach combines creative excellence with marketing strategy to help businesses 
              grow their digital presence. From brand identity development to performance marketing campaigns, 
              we provide end-to-end solutions tailored to your unique business objectives.
            </p>

            {/* Service highlights grid */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 my-8">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-card border border-border/50">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">Advertisement Design</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Print ads, digital banners, outdoor advertising, and campaign creatives that drive conversions
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-card border border-border/50">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">Social Media Marketing</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Content strategy, community management, and paid advertising across all major platforms
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-card border border-border/50">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">Website Development</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Custom responsive websites, e-commerce solutions, landing pages, and SEO optimization
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-card border border-border/50">
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm sm:text-base text-foreground">Video Production</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    Brand films, product videos, social media content, and motion graphics
                  </p>
                </div>
              </div>
            </div>

            {/* H3 - Subtopic 2 */}
            <h3 className="text-xl sm:text-2xl font-display font-semibold mt-10 mb-4 text-foreground">
              Why Choose Canvas Cartel for Your Brand
            </h3>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
              As a leading creative marketing agency in India, we bring together skilled designers, strategists, 
              and marketers who are passionate about creating impactful brand experiences. Our approach combines 
              artistic creativity with business acumen to deliver campaigns that not only look stunning but 
              also drive real business growth.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 sm:gap-6 my-8">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground font-medium">Award-Winning Designs</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground font-medium">100+ Happy Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground font-medium">5-Star Rated</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm text-foreground font-medium">Proven ROI</span>
              </div>
            </div>

            {/* H4 - Detailed subtopic */}
            <h4 className="text-lg sm:text-xl font-display font-semibold mt-8 mb-3 text-foreground">
              Our Creative Process
            </h4>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4">
              Every project begins with understanding your brand, audience, and goals. Our proven four-step 
              process—Discovery, Strategy, Creation, and Delivery—ensures that every campaign is strategically 
              aligned and creatively executed to exceed expectations.
            </p>

            {/* H5 - Sub-subtopic */}
            <h5 className="text-base sm:text-lg font-display font-medium mt-6 mb-2 text-foreground">
              Industries We Serve
            </h5>

            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              We work with businesses across diverse sectors including e-commerce, technology, hospitality, 
              healthcare, education, real estate, and FMCG. Our industry-specific expertise allows us to 
              create targeted marketing strategies that resonate with your specific audience.
            </p>

            {/* H6 - Minor heading */}
            <h6 className="text-sm sm:text-base font-display font-medium mt-6 mb-2 text-foreground">
              Ready to Transform Your Brand?
            </h6>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Whether you're launching a new product, rebranding your business, or looking to amplify your 
              digital presence, Canvas Cartel is your trusted creative partner. Based in Mumbai, India, we 
              serve clients nationwide and globally with our comprehensive suite of creative and marketing services.
            </p>

            {/* Internal links for SEO */}
            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border/50">
              <Link 
                to="/services" 
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Explore Our Services <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <Link 
                to="/projects" 
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                View Our Portfolio <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                About Our Team <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Get a Free Quote <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
