import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { 
  Palette, 
  Megaphone, 
  Globe, 
  Video, 
  Camera, 
  Target, 
  Workflow, 
  Sparkles 
} from "lucide-react";

// Service cards data
const services = [
  {
    id: 1,
    icon: Palette,
    title: "Branding & Graphic Design",
    description: "Custom brand identities, logos, and visual systems that make your brand unforgettable.",
    gradient: "from-indigo-500 to-purple-600",
    glow: "hsl(262, 85%, 60%)",
  },
  {
    id: 2,
    icon: Megaphone,
    title: "Social Media Marketing",
    description: "Strategic social content that builds community, drives engagement, and grows your audience.",
    gradient: "from-pink-500 to-rose-600",
    glow: "hsl(348, 90%, 60%)",
  },
  {
    id: 3,
    icon: Globe,
    title: "Website Development",
    description: "Fast, responsive, conversion-optimized websites built with the latest technologies.",
    gradient: "from-blue-500 to-cyan-600",
    glow: "hsl(200, 85%, 55%)",
  },
  {
    id: 4,
    icon: Video,
    title: "Video Production",
    description: "Professional video production from concept to final cut, including motion graphics.",
    gradient: "from-orange-500 to-red-600",
    glow: "hsl(25, 90%, 60%)",
  },
  {
    id: 5,
    icon: Camera,
    title: "Photography",
    description: "High-quality product and creative photography that captures your brand essence.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "hsl(160, 85%, 45%)",
  },
  {
    id: 6,
    icon: Target,
    title: "Digital Marketing Strategy",
    description: "Data-driven marketing strategies with SEO, campaigns, and performance tracking.",
    gradient: "from-violet-500 to-purple-700",
    glow: "hsl(262, 85%, 55%)",
  },
  {
    id: 7,
    icon: Workflow,
    title: "AI & Business Automation",
    description: "AI workflows, WhatsApp bots, lead generation, and CRM automation to scale your business.",
    gradient: "from-cyan-500 to-blue-600",
    glow: "hsl(200, 85%, 55%)",
  },
];

export const ServicesBento = () => {
  const cardsRef = useRef<Map<number, HTMLElement>>(new Map());
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // 3D tilt and glow effect
  useEffect(() => {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach((card) => {
      const element = card as HTMLElement;
      const id = parseInt(element.dataset.id || '0');

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (-y / rect.height) * 12;
        const rotateY = (x / rect.width) * 12;

        gsap.to(element, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1200,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });

        // Glow effect follows cursor
        const glow = element.querySelector('.glow-layer') as HTMLElement;
        if (glow) {
          const glowIntensity = Math.min(Math.abs(x) + Math.abs(y) / 100, 1) * 0.3;
          gsap.to(glow, {
            scale: 1 + glowIntensity * 0.5,
            opacity: 0.6 + glowIntensity * 0.4,
            duration: 0.3,
            ease: "power2.out",
          });
        }

        // Change active card highlight
        if (activeCard !== id) {
          setActiveCard(id);
        }
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });

        const glow = element.querySelector('.glow-layer') as HTMLElement;
        if (glow) {
          gsap.to(glow, {
            scale: 1,
            opacity: 0.6,
            duration: 0.5,
            ease: "power2.out",
          });
        }

        setActiveCard(null);
      });
    });
  }, [activeCard]);

  return (
    <section className="relative py-16 sm:py-20 bg-[var(--background)]">
      {/* Section header */}
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "power2.out" }}
          className="text-xl sm:text-2xl font-semibold text-foreground mb-4"
        >
          <span className="text-gradient">What We Do</span>
        </motion.h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Complete creative and marketing solutions tailored to your business needs.
        </p>
      </div>

      {/* Bento grid */}
      <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {services.map((service) => (
            <motion.div
              key={service.id}
              data-tilt={service.id}
              data-id={service.id}
              className="group relative bg-[var(--card)] border border-[var(--border)]/30 rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-300 hover:border-[var(--border)]/60 hover:shadow-xl hover:shadow-black/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "power2.out" }}
            >
              {/* Glow layer (follows cursor) */}
              <div className="glow-layer absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: `radial-gradient(ellipse at center, ${service.glow}/20 0%, transparent 70%)`,
              }} />

              {/* Icon */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br to-50% from-gradient mb-4 flex items-center justify-center glow-on-hover" style={{
                background: `linear-gradient(135deg, ${service.gradient})`,
              }}>
                <service.icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              {/* Hover pulse effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: `radial-gradient(ellipse at center, ${service.glow}/10 0%, transparent 70%)`,
              }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
