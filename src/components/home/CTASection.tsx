import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSiteContent, defaultHomepageCTA, HomepageContent } from "@/hooks/useSiteContent";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const CTASection = () => {
  const { data } = useSiteContent<HomepageContent>('homepage');
  const cta = data?.cta || defaultHomepageCTA;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-background relative overflow-hidden" aria-labelledby="cta-heading" ref={ref}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{
              boxShadow: "0 0 60px hsl(var(--primary) / 0.2)",
              transition: { duration: 0.3 }
            }}
            className="border-gradient-soft rounded-3xl sm:rounded-3xl p-6 sm:p-10 md:p-12 lg:p-16 bg-gradient-card hover-lift"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              id="cta-heading"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 leading-tight"
            >
              {cta.title}{" "}
              <span className="text-gradient">{cta.titleHighlight}</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2 leading-relaxed"
            >
              {cta.description}
            </motion.p>
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              aria-label="Call to action"
            >
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="hover-lift">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto h-12" asChild>
                  <Link to={cta.primaryButtonLink || '/contact'}>
                    {cta.primaryButtonText}
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="hover-lift">
                <Button variant="glass" size="lg" className="w-full sm:w-auto h-12" asChild>
                  <Link to={cta.secondaryButtonLink || '/services'}>{cta.secondaryButtonText}</Link>
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
