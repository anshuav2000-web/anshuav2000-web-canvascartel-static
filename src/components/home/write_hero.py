import os

path = r'C:/Users/Priyankur/Downloads/canvascartel-main/canvascartel-main/src/components/home/HeroSection.tsx'

content = r"""import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  gsap,
  ScrollTrigger,
  Flip,
  MotionValue,
  useScroll,
  useTransform,
  useSpring,
} from "@gsap/react";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Play, Sparkles, Compass, ArrowDown, Star } from "lucide-react";
import { useSpring as useMotionSpring } from "framer-motion";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, Flip);

// Hero data
const heroData = {
  badge: "Creative Design & Marketing Studio",
  title: ["We build", "brands", "that people", "remember."],
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
  const [mouseOver, setMouseOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(false);

  // Framer motion springs
  const scrollY = useScroll();
  const ySpring = useSpring(scrollY.y, { stiffness: 100, damping: 30 });
  const opacitySpring = useSpring(0, { stiffness: 50, damping: 20 });

  // Animation state
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // GSAP animations with ScrollTrigger
  useGSAP(() => {
    const hero = document.querySelector(".hero-section");
    const titleLines = document.querySelectorAll(".title-line");
    const subtitle = document.querySelector(".subtitle");
    const stats = document.querySelectorAll(".stat-item");

    if (!hero) return;

    // Initial state
    gsap.set(titleLines, { opacity: 0, y: 50 });
    gsap.set(subtitle, { opacity: 0, y: 30 });
    gsap.set(stats, { opacity: 0, y: 20 });

    // Scroll-triggered animations with SplitText effect (simulated with line-by-line)
    const lineAnim = gsap.fromTo(
      titleLines,
      {
        opacity: 0,
        y: 60,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: {
          trigger: hero,
          start: "top 85%",
          end: "top 50%",
          scrub: 1.5,
          markers: false,
        },
      }
    );

    // Subtitle animation
    gsap.fromTo(
      subtitle,
      {
        opacity: 0,
        y: 40,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: hero,
          start: "top 75%",
          end: "top 40%",
          scrub: 1,
          markers: false,
        },
      }
    );

    // CTA animation
    gsap.fromTo(
      document.querySelectorAll(".cta-group"),
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: hero,
          start: "top 70%",
          end: "top 35%",
          scrub: 1,
          markers: false,
        },
      }
    );

    // Stats animation
    gsap.fromTo(
      stats,
      {
        opacity: 0,
        y: 30,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: hero,
          start: "top 65%",
          end: "top 30%",
          scrub: 1,
          markers: false,
        },
      }
    );

    // Magnetic effect on CTA buttons
    const ctaButtons = document.querySelectorAll(".magnetic-cta");
    ctaButtons.forEach((btn) => {
      const rect = btn.getBoundingClientRect();
      const button = btn as HTMLElement;

      document.addEventListener("mousemove", (e) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const moveX = (x - centerX) / centerX * -3;
        const moveY = (y - centerY) / centerY * -3;

        gsap.to(button, {
          x: moveX,
          y: moveY,
          duration: 0.2,
          cursor: "none",
          overwrite: true,
        });
      });

      document.addEventListener("mouseleave", () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
        });
      });
    });

    // Scrolling to hide cursor on mobile
    const timer = setTimeout(() => {
      const mobileQuery = window.matchMedia("(pointer: coarse)").matches;
      if (mobileQuery) {
        gsap.to("#custom-cursor", { opacity: 0, duration: 0.3 });
      }
    }, 500);

    return () => {
      document.removeEventListener("mousemove", () => {});
      clearTimeout(timer);
    };
  }, []);

  // Build CSS class for the hero
  const heroClass = `hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero transition-opacity duration-700 ${
    visible ? "opacity-100" : "opacity-0"
  }`;

  // Scroll progress for the hero (fades out on scroll)
  const scrollProgress = useTransform(scrollY, [0, 0.8], [0, 1]);

  return (
    <section className={heroClass}>
      {/* Background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Gradient mesh */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] animate-pulse animation-delay-1000" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[200px] animate-pulse animation-delay-2000" />

        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-primary/30 animate-float" />
        <div className="absolute top-40 right-20 w-1.5 h-1.5 rounded-full bg-accent/30 animate-float animation-delay-500" />
        <div className="absolute top-60 left-1/3 w-1 h-1 rounded-full bg-primary/20 animate-float animation-delay-1000" />
        <div className="absolute top-80 right-1/4 w-2 h-2 rounded-full bg-accent/20 animate-float animation-delay-1500" />
        <div className="absolute top-100 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/20 animate-float animation-delay-2000" />
        <div className="absolute top-120 right-1/3 w-1 h-1 rounded-full bg-accent/20 animate-float animation-delay-2500" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" aria-hidden="true" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-20 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border/40 bg-secondary/30 backdrop-blur-sm mb-6 sm:mb-8"
          >
            <motion.span
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent"
            />
            <span className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide uppercase">
              {heroData.badge}
            </span>
          </motion.div>

          {/* Split headline with line-by-line reveal */}
          <div className="relative max-w-4xl mx-auto px-2">
            <div className="grid grid-cols-1 gap-2 sm:gap-3">
              {heroData.title.map((line, index) => (
                <div
                  key={index}
                  className={`title-line relative overflow-hidden px-2 ${
                    index === 1 ? "col-span-1 sm:col-span-2" : ""
                  } ${index === 2 ? "col-span-1 sm:col-span-1" : ""}`}
                >
                  {/* Animated background for each line */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl" />
                  <div className="relative h-full flex items-center">
                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-display font-bold leading-tight text-foreground">
                      <span className="text-gradient">{line}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subtext */}
          <motion.p
            className="subtitle text-base sm:text-lg md:text-xl lg:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 px-4 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            {heroData.subtitle}
          </motion.p>

          {/* CTA Buttons with magnetic effect */}
          <motion.div
            className="cta-group flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="magnetic-cta hover-lift"
            >
              <Button
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base h-12"
                asChild
              >
                <Link to={heroData.primaryLink}>
                  {heroData.primaryButton}
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="magnetic-cta hover-lift"
            >
              <Button
                variant="glass"
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base h-12"
                asChild
              >
                <Link to={heroData.secondaryLink}>
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  {heroData.secondaryButton}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="stats-grid grid grid-cols-3 gap-3 sm:gap-6 md:gap-8 mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 border-t border-border/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            {heroData.stats.map((stat, index) => (
              <div key={stat.label} className="stat-item text-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gradient mb-1 sm:mb-2 block"
                >
                  {stat.number}
                </motion.div>
                <div className="text-xs sm:text-sm text-muted-foreground tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Decorative sparkle */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2.5 }}
            className="absolute top-12 left-10 hidden sm:block"
          >
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary/20" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="w-6 h-8 sm:w-8 sm:h-10 rounded-full border-2 border-border/30 flex items-start justify-center p-1.5 sm:p-2 cursor-pointer">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 sm:h-4 bg-gradient-to-b from-primary to-transparent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};
"""

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Written: {path} ({os.path.getsize(path)} bytes)')
