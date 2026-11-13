import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useScroll } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { 
  ArrowRight, 
  Play, 
  Sparkles, 
  Palette, 
  Code, 
  Video, 
  Camera, 
  Megaphone, 
  Cpu, 
  Layers, 
  PenTool, 
  Globe, 
  Zap 
} from "lucide-react";

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

// Floating background icons representing services & graphic design tools (emanating from center)
const floatingIcons = [
  { icon: Palette, top: "20%", left: "15%", delay: 0.1, duration: 6, x: -30, y: -20 },
  { icon: PenTool, top: "15%", right: "18%", delay: 0.3, duration: 7, x: 40, y: -25 },
  { icon: Code, top: "45%", left: "8%", delay: 0.5, duration: 8, x: -50, y: 15 },
  { icon: Video, top: "40%", right: "10%", delay: 0.2, duration: 6.5, x: 45, y: 20 },
  { icon: Camera, top: "75%", left: "20%", delay: 0.4, duration: 7.5, x: -35, y: 40 },
  { icon: Megaphone, top: "70%", right: "22%", delay: 0.6, duration: 6, x: 35, y: 35 },
  { icon: Layers, top: "25%", left: "30%", delay: 0.25, duration: 7, x: -15, y: -35 },
  { icon: Cpu, top: "65%", right: "32%", delay: 0.45, duration: 8.5, x: 25, y: 45 },
  { icon: Globe, top: "82%", left: "45%", delay: 0.35, duration: 9, x: 0, y: 50 },
  { icon: Zap, top: "28%", right: "38%", delay: 0.15, duration: 6, x: 10, y: -30 },
];

// Interactive Floating Icon with Magnetic Repel (Push-back) Effect
const FloatingIcon = ({ item }: { item: typeof floatingIcons[0] }) => {
  const [repelOffset, setRepelOffset] = useState({ x: 0, y: 0 });
  const IconComponent = item.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Magnetic repel (push away like matching magnetic poles) when within 140px
    if (distance < 140) {
      const force = (140 - distance) / 140;
      setRepelOffset({
        x: -distanceX * force * 0.8,
        y: -distanceY * force * 0.8,
      });
    } else {
      setRepelOffset({ x: 0, y: 0 });
    }
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setRepelOffset({ x: 0, y: 0 })}
      animate={{
        x: repelOffset.x,
        y: repelOffset.y,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      style={{ top: item.top, left: item.left, right: item.right }}
      className="absolute z-0 p-3 rounded-2xl bg-transparent border-0 text-gray-400/40 pointer-events-auto cursor-pointer"
    >
      <motion.div
        animate={{
          y: [0, item.y, 0],
          x: [0, item.x, 0],
          opacity: [0.25, 0.5, 0.25],
        }}
        transition={{
          duration: item.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400/40 hover:text-primary transition-colors duration-300" />
      </motion.div>
    </motion.div>
  );
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
      {/* Vibrant background glow & Emanating Floating Icons with Magnetic Repel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-br from-primary/35 via-accent/30 to-transparent rounded-full blur-[160px] animate-pulse" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 -right-40 w-[600px] h-[600px] bg-accent/30 rounded-full blur-[180px]" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:50px_50px]" aria-hidden="true" />

        {/* Floating Icons with Magnetic Push-Back Effect */}
        {floatingIcons.map((item, index) => (
          <FloatingIcon key={index} item={item} />
        ))}
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
