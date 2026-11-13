import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Share2,
  Globe,
  Video,
  Camera,
  Target,
  Workflow,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const services = [
  { icon: Megaphone, title: "Advertisement Design", description: "Eye-catching advertisements that communicate clearly and convert. We create visuals that stop the scroll and drive action." },
  { icon: Share2, title: "Social Media Content", description: "Content that connects, not just posts. Strategic social media presence that builds community and engagement." },
  { icon: Globe, title: "Website Development", description: "Websites that blend stunning design with peak performance. Fast, responsive, and built for results." },
  { icon: Video, title: "Video Production", description: "Compelling video content that tells your brand story. From concept to final cut, we bring visions to life." },
  { icon: Camera, title: "Photo Production", description: "Professional photography that captures your brand essence. High-quality visuals that make an impact." },
  { icon: Target, title: "Marketing Strategy", description: "Complete marketing plans built around insight, creativity, and execution. Strategic roadmaps for growth." },
  { icon: Workflow, title: "n8n Automation", description: "Streamline your business with powerful workflow automation. Connect apps, automate tasks, and boost productivity." },
];

export const ServicesPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden" aria-labelledby="services-heading">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10" ref={ref}>
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16 px-2"
        >
          <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            What We Do
          </span>
          <h2 id="services-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-3 sm:mt-4 mb-4 sm:mb-6">
            Creative Marketing Services for <span className="text-gradient">Impact</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            We partner with brands to build strong visual identities and smart marketing systems. Every solution is tailored, strategic, and driven by skill—not templates.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6" role="list" aria-label="Our services">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group p-5 sm:p-6 md:p-8 rounded-2xl bg-gradient-card border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.15)] hover-lift"
              role="listitem"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:bg-primary/20 transition-colors"
              >
                <service.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 sm:mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{service.description}</p>
              <Link
                to={`/services/${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center text-xs sm:text-sm text-primary mt-4 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Learn more <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-8 sm:mt-10 md:mt-12"
          aria-label="Services navigation"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button variant="gradient" size="lg" className="w-full sm:w-auto h-12" asChild>
              <Link to="/services">
                Explore All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </motion.nav>
      </div>
    </section>
  );
};
