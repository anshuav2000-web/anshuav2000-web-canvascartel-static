import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useScroll, useTransform, useSpring } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Play, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const heroData = {
  badge: "Creative Design & Marketing Studio",
  title: "We build brands that people remember.",
  subtitle: "We turn creativity into impact and collaboration into growth. From eye-catching advertisements to complete marketing plans, we help brands show up with clarity, confidence, and consistency.",
  primaryButton: "Start Your Project",
  primaryLink: "/contact",
  secondaryButton: "View Our Work",
  secondaryLink: "/projects",
  stats: [
    { number: "50+", label: "Projects Delivered" },
    { number: "30+", label: "Happy Clients" },
    { number: "5+", label: "Years Experience" },
  ],
};

export const HeroSection = () => {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useGSAP(() => {
    const hero = document.querySelector(".hero-section");
    if (!hero) return;

    gsap.fromTo(
      ".hero-content-anim",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  return (
    <section className={`hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)] transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}>
      {/* Vibrant, bright, rich gradient glow background (fixing dark black issue) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-br from-primary/30 via-accent/25 to-transparent rounded-full blur-[140px] animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-accent/25 rounded-full blur-[180px]" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" aria-hidden="true" />
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Top Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="hero-content-anim inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md mb-8 shadow-[0_0_20px_hsl(var(--primary)/0.2)]"
          >
            <Sparkles className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: "6s" }} />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-foreground uppercase">
              {heroData.badge}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-content-anim text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tight text-foreground mb-8 leading-[1.08]"
          >
            We build <span className="text-gradient drop-shadow-sm">brands</span> that people <span className="text-gradient">remember.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-content-anim text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
          >
            {heroData.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-content-anim flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16"
          >
            <Button
              variant="gradient"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 rounded-2xl"
              asChild
            >
              <Link to={heroData.primaryLink}>
                {heroData.primaryButton}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              variant="glass"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-semibold border border-border/60 hover:border-primary/50 hover:bg-secondary/50 hover:scale-105 transition-all duration-300 rounded-2xl"
              asChild
            >
              <Link to={heroData.secondaryLink}>
                <Play className="mr-2 h-4 w-4 fill-foreground" />
                {heroData.secondaryButton}
              </Link>
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="hero-content-anim grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-[var(--card)]/80 backdrop-blur-xl border border-[var(--border)]/60 shadow-xl"
          >
            {heroData.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-gradient mb-1">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
