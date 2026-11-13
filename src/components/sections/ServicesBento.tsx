import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Palette, 
  Megaphone, 
  Globe, 
  Video, 
  Camera, 
  Target, 
  Workflow, 
  ArrowRight,
  Sparkles,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    icon: Palette,
    title: "Branding & Graphic Design",
    subtitle: "Visual Identity & Systems",
    description: "Custom brand identities, striking logos, and comprehensive design systems that make your brand unforgettable.",
    features: ["Visual Identity", "Logo Design", "Brand Guidelines", "Print & Packaging"],
    gradient: "from-pink-500 to-rose-600",
    glow: "rgba(244, 63, 94, 0.3)",
    number: "01",
  },
  {
    id: 2,
    icon: Globe,
    title: "Website Development",
    subtitle: "High-Performance Digital Platforms",
    description: "Lightning-fast, responsive, conversion-optimized websites built with modern technologies and clean architecture.",
    features: ["Custom Web Apps", "E-Commerce Stores", "UI/UX Architecture", "Speed Optimization"],
    gradient: "from-blue-500 to-indigo-600",
    glow: "rgba(59, 130, 246, 0.3)",
    number: "02",
  },
  {
    id: 3,
    icon: Megaphone,
    title: "Social Media Marketing",
    subtitle: "Community & Engagement",
    description: "Strategic content campaigns that build loyal communities, drive interaction, and accelerate audience growth.",
    features: ["Content Strategy", "Community Growth", "Paid Ad Campaigns", "Viral Short-Form"],
    gradient: "from-purple-500 to-pink-600",
    glow: "rgba(168, 85, 247, 0.3)",
    number: "03",
  },
  {
    id: 4,
    icon: Video,
    title: "Video Production",
    subtitle: "Cinematic Brand Storytelling",
    description: "Professional video production, cinematic commercials, and motion graphics from concept to final cut.",
    features: ["Brand Films", "Motion Graphics", "Commercials", "Post-Production"],
    gradient: "from-orange-500 to-red-600",
    glow: "rgba(249, 115, 22, 0.3)",
    number: "04",
  },
  {
    id: 5,
    icon: Workflow,
    title: "AI & Business Automation",
    subtitle: "Next-Gen Scalability",
    description: "Advanced AI agents, WhatsApp bots, lead generation funnels, and CRM automation to scale operations.",
    features: ["AI Agents", "n8n Workflows", "WhatsApp Automation", "CRM Integration"],
    gradient: "from-cyan-500 to-blue-600",
    glow: "rgba(6, 182, 212, 0.3)",
    number: "05",
  },
  {
    id: 6,
    icon: Camera,
    title: "Photography & Content",
    subtitle: "Capturing Brand Essence",
    description: "Stunning product and creative lifestyle photography that captures your brand essence with perfection.",
    features: ["Product Shoots", "Lifestyle Content", "Studio Lighting", "Professional Retouching"],
    gradient: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.3)",
    number: "06",
  },
];

export const ServicesBento = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative py-24 sm:py-32 bg-[var(--background)] overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[180px]" />
      </div>

      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary mb-4 inline-block border border-primary/20">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
            Services Built For <span className="text-gradient">Scale</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Hover over any service to explore our cutting-edge capabilities and deliverables.
          </p>
        </motion.div>
      </div>

      {/* Trendy Interactive Spotlight Showcase Layout */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isDimmed = hoveredIndex !== null && hoveredIndex !== index;

            return (
              <motion.div
                key={service.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={`group relative p-8 rounded-3xl bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)]/70 shadow-xl transition-all duration-500 overflow-hidden flex flex-col justify-between ${
                  isDimmed ? "opacity-40 scale-[0.98]" : "opacity-100 scale-100"
                }`}
                style={{
                  boxShadow: hoveredIndex === index ? `0 25px 50px -12px ${service.glow}` : undefined,
                }}
              >
                {/* Spotlight background gradient */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${service.glow} 0%, transparent 70%)`
                  }}
                />

                <div>
                  {/* Top Header & Number */}
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500"
                      style={{ background: `linear-gradient(135deg, ${service.gradient})` }}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-display font-extrabold text-muted-foreground/20 group-hover:text-primary/40 transition-colors">
                      {service.number}
                    </span>
                  </div>

                  {/* Subtitle & Title */}
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-1 block">
                    {service.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Feature Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 text-foreground border border-border/60 group-hover:border-primary/40 transition-colors"
                      >
                        <Check className="w-3 h-3 text-primary" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-4 border-t border-[var(--border)]/40 flex items-center justify-between">
                  <Link 
                    to="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                  >
                    Start Project
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Sparkles className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
