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
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    id: 1,
    icon: Palette,
    title: "Branding & Graphic Design",
    description: "Custom brand identities, striking logos, and comprehensive visual systems that make your brand unforgettable.",
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    glow: "rgba(244, 63, 94, 0.25)",
    span: "col-span-1 lg:col-span-2 row-span-2",
    badge: "Most Popular",
  },
  {
    id: 2,
    icon: Globe,
    title: "Website Development",
    description: "Lightning-fast, responsive, conversion-optimized websites built with modern web technologies.",
    gradient: "from-blue-500 via-indigo-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.25)",
    span: "col-span-1 lg:col-span-2 row-span-1",
    badge: "High Performance",
  },
  {
    id: 3,
    icon: Megaphone,
    title: "Social Media Marketing",
    description: "Strategic content campaigns that build loyal communities, drive engagement, and accelerate growth.",
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    glow: "rgba(168, 85, 247, 0.25)",
    span: "col-span-1 lg:col-span-1 row-span-1",
  },
  {
    id: 4,
    icon: Video,
    title: "Video Production",
    description: "Cinematic brand films and motion graphics from concept to final cut.",
    gradient: "from-orange-500 via-amber-500 to-red-500",
    glow: "rgba(249, 115, 22, 0.25)",
    span: "col-span-1 lg:col-span-1 row-span-1",
  },
  {
    id: 5,
    icon: Workflow,
    title: "AI & Business Automation",
    description: "Advanced AI agents, WhatsApp workflows, and CRM automation to scale operations effortlessly.",
    gradient: "from-cyan-500 via-teal-500 to-blue-500",
    glow: "rgba(6, 182, 212, 0.25)",
    span: "col-span-1 lg:col-span-2 row-span-1",
    badge: "Cutting Edge",
  },
  {
    id: 6,
    icon: Camera,
    title: "Photography & Content",
    description: "Stunning product and creative photography that captures your brand essence.",
    gradient: "from-emerald-500 via-teal-500 to-green-500",
    glow: "rgba(16, 185, 129, 0.25)",
    span: "col-span-1 lg:col-span-1 row-span-1",
  },
  {
    id: 7,
    icon: Target,
    title: "Digital Marketing Strategy",
    description: "Data-driven SEO, PPC campaigns, and performance tracking to maximize ROI.",
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    glow: "rgba(139, 92, 246, 0.25)",
    span: "col-span-1 lg:col-span-1 row-span-1",
  },
];

export const ServicesBento = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="relative py-24 sm:py-32 bg-[var(--background)] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[150px]" />
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
            Our Expertise
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
            What <span className="text-gradient">We Do</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            Comprehensive creative, marketing, and technology solutions tailored to elevate your brand and accelerate growth.
          </p>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            const isHovered = hoveredId === service.id;

            return (
              <motion.div
                key={service.id}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className={`group relative p-8 rounded-3xl bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)]/70 shadow-xl hover:border-primary/50 transition-all duration-500 overflow-hidden flex flex-col justify-between ${
                  service.span || "col-span-1"
                }`}
                style={{
                  boxShadow: isHovered ? `0 20px 40px -15px ${service.glow}` : undefined,
                }}
              >
                {/* Dynamic radial glow on hover */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${service.glow} 0%, transparent 70%)`
                  }}
                />

                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500"
                      style={{ background: `linear-gradient(135deg, ${service.gradient})` }}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>

                    {service.badge && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-secondary/80 border border-border/60 text-foreground">
                        {service.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>

                {/* Footer action link */}
                <div className="pt-4 border-t border-[var(--border)]/40 flex items-center justify-between">
                  <Link 
                    to="/services"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
                  >
                    Explore Service
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
