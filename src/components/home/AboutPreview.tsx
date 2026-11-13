import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Lightbulb, Rocket, Sparkles } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const values = [
  {
    icon: Users,
    title: "People First",
    description: "Our strongest USP isn't software or trends—it's people. We invest deeply in our team's skills and growth.",
  },
  {
    icon: Lightbulb,
    title: "Creative Excellence",
    description: "When skilled people are supported, trusted, and challenged, exceptional work naturally follows.",
  },
  {
    icon: Rocket,
    title: "Strategic Impact",
    description: "We create value for our clients and meaning for our team through purposeful, strategic work.",
  },
];

export const AboutPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-card relative overflow-hidden" aria-labelledby="about-heading" ref={ref}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
          {/* Left Content */}
          <motion.article
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <span className="text-primary text-xs sm:text-sm font-semibold uppercase tracking-wider inline-block mb-3 sm:mb-4 flex items-center gap-2">
              <Sparkles className="h-3 w-3 sm:h-4" />
              About Us
            </span>
            <h2 id="about-heading" className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mt-3 sm:mt-4 mb-4 sm:mb-6 leading-tight">
              More Than an Agency—
              <br className="hidden sm:block" />
              <span className="text-gradient">A Creative Community</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
              Canvas Cartel is a creative design and marketing studio built on
              one powerful belief: great brands are created by great people. We
              exist to turn skill into strategy, creativity into impact, and
              collaboration into growth.
            </p>

            {/* Values */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-8 sm:mb-10" role="list" aria-label="Our values">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  className="flex gap-3 sm:gap-4 group cursor-spot"
                  role="listitem"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors"
                  >
                    <value.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">{value.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button variant="gradient" className="w-full sm:w-auto h-12" asChild>
                <Link to="/about">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.article>

          {/* Right Visual */}
          <motion.aside
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative order-1 lg:order-2"
          >
            <div className="aspect-square rounded-2xl sm:rounded-3xl bg-gradient-card border border-border/50 overflow-hidden relative max-w-md mx-auto lg:max-w-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-4/5 h-4/5">
                  <motion.div
                    animate={{ y: [0, -20, 0], rotate: [12, 15, 12] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="absolute top-0 left-0 w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-primary/20 rounded-xl sm:rounded-2xl"
                  />
                  <motion.div
                    animate={{ y: [0, 15, 0], rotate: [-12, -15, -12] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                    className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-accent/20 rounded-xl sm:rounded-2xl"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-2 border-primary/30 rounded-full"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gradient">CC</span>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-2">Creative Community</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 glass-light rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-border/30 hidden sm:block hover-lift"
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm sm:text-base">✓</span>
                </div>
                <div>
                  <p className="font-semibold text-xs sm:text-sm">Trusted Partner</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">For brands across India</p>
                </div>
              </div>
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};
