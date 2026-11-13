import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { 
  LogosMarquee, 
  ServicesBento, 
  FeaturedWork, 
  ProcessTimeline, 
  AnimatedCounters, 
  IndustriesTabs, 
  TestimonialsSlider, 
  FAQSection, 
  LargeCTA, 
  Footer 
} from "@/components/sections";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      
      {/* Trusted by logos marquee */}
      <LogosMarquee />
      
      {/* Services bento grid */}
      <ServicesBento />
      
      {/* Featured work */}
      <FeaturedWork />
      
      {/* Process timeline */}
      <ProcessTimeline />
      
      {/* Animated counters */}
      <AnimatedCounters />
      
      {/* Industries tabs */}
      <IndustriesTabs />
      
      {/* Testimonials slider */}
      <TestimonialsSlider />
      
      {/* FAQ accordion */}
      <FAQSection />
      
      {/* Large CTA section */}
      <LargeCTA />
      
      {/* Footer */}
      <Footer />
    </Layout>
  );
};

export default Index;
