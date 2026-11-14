import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Palette, 
  Megaphone, 
  Globe, 
  Video, 
  Camera, 
  Target, 
  Workflow, 
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";

const serviceCategories = [
  { id: "all", label: "All Services" },
  { id: "design", label: "Design & Branding" },
  { id: "dev", label: "Development & Tech" },
  { id: "marketing", label: "Marketing & Growth" },
  { id: "media", label: "Video & Content" },
];

const defaultServices = [
  {
    id: 1,
    category: "design",
    icon: Palette,
    title: "Branding & Graphic Design",
    description: "Custom brand identities, striking logos, and comprehensive visual systems that make your brand unforgettable.",
    features: ["Visual Identity", "Logo Design", "Brand Guidelines", "Print & Packaging"],
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    glow: "rgba(244, 63, 94, 0.35)",
  },
  {
    id: 2,
    category: "dev",
    icon: Globe,
    title: "Website Development",
    description: "Lightning-fast, responsive, conversion-optimized websites built with modern web technologies and clean code.",
    features: ["Custom Web Apps", "E-Commerce", "UI/UX Architecture", "Performance Tuning"],
    gradient: "from-blue-500 via-indigo-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.35)",
  },
  {
    id: 3,
    category: "marketing",
    icon: Megaphone,
    title: "Social Media Marketing",
    description: "Strategic content campaigns that build loyal communities, drive engagement, and accelerate audience growth.",
    features: ["Content Strategy", "Community Management", "Paid Ad Campaigns", "Viral Reels & Shorts"],
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    glow: "rgba(168, 85, 247, 0.35)",
  },
  {
    id: 4,
    category: "media",
    icon: Video,
    title: "Video Production",
    description: "Cinematic brand films, promotional commercials, and motion graphics from concept to final cut.",
    features: ["Brand Commercials", "Motion Graphics", "Product Teasers", "Post-Production"],
    gradient: "from-orange-500 via-amber-500 to-red-500",
    glow: "rgba(249, 115, 22, 0.35)",
  },
  {
    id: 5,
    category: "dev",
    icon: Workflow,
    title: "AI & Business Automation",
    description: "Advanced AI agents, WhatsApp workflows, and CRM automation to scale your business operations effortlessly.",
    features: ["AI Chatbots", "n8n Workflows", "WhatsApp Agents", "CRM Integration"],
    gradient: "from-cyan-500 via-teal-500 to-blue-500",
    glow: "rgba(6, 182, 212, 0.35)",
  },
  {
    id: 6,
    category: "media",
    icon: Camera,
    title: "Photography & Content",
    description: "Stunning product and creative lifestyle photography that captures your brand essence perfectly.",
    features: ["Product Shoots", "Lifestyle Photography", "Studio Lighting", "Retouching"],
    gradient: "from-emerald-500 via-teal-500 to-green-500",
    glow: "rgba(16, 185, 129, 0.35)",
  },
  {
    id: 7,
    category: "marketing",
    icon: Target,
    title: "Digital Marketing Strategy",
    description: "Data-driven SEO, PPC ad campaigns, and comprehensive analytics tracking to maximize your ROI.",
    features: ["Advanced SEO", "PPC & Google Ads", "Funnel Optimization", "Analytics & Reporting"],
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    glow: "rgba(139, 92, 246, 0.35)",
  },
];

export const ServicesBento = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data: siteServices } = useSiteContent<any[]>("services");

  const servicesList = siteServices && siteServices.length > 0 ? siteServices : defaultServices;

  const filteredServices = activeCategory === "all" 
    ? servicesList 
    : servicesList.filter((s: any) => s.category === activeCategory);

  return (
    <section className="relative py-24 sm:py-32 bg-[var(--background)] overflow-hidden">
      {/* Bright luminous background glow effects (avoiding heavy black look) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-primary/20 via-accent/15 to-transparent rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-accent/20 via-primary/15 to-transparent rounded-full blur-[180px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/15 text-primary mb-4 inline-block border border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.2)]">
            What We Do
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-extrabold text-foreground mb-4">
            Transforming Ideas Into <span className="text-gradient">Reality</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg mb-10">
            Explore our comprehensive suite of creative, technical, and strategic services designed to empower your brand and accelerate growth.
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 scale-105"
                    : "bg-[var(--card)] border border-[var(--border)] text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-secondary/50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Services Grid Layout */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          <AnimatePresence>
            {filteredServices.map((service: any, index: number) => {
              const IconComponent = service.icon || Sparkles;

              return (
                <motion.div
                  layout
                  key={service.id || index}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -30 }}
                  transition={{ duration: 0.5, delay: index * 0.06 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative p-8 rounded-3xl bg-[var(--card)]/95 backdrop-blur-xl border border-[var(--border)]/80 shadow-2xl hover:border-primary/60 transition-all duration-500 overflow-hidden flex flex-col justify-between"
                  style={{
                    boxShadow: `0 20px 40px -15px ${service.glow || 'rgba(255, 107, 74, 0.25)'}`,
                  }}
                >
                  {/* Glowing background gradient on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 85% 15%, ${service.glow || 'rgba(255, 107, 74, 0.35)'} 0%, transparent 70%)`
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div 
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
                        style={{ background: `linear-gradient(135deg, ${service.gradient || '#ff6b4a, #ff8a6a'})` }}
                      >
                        {typeof IconComponent === 'function' ? <IconComponent className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-secondary/80 text-foreground border border-border/60">
                        {service.category || 'Service'}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl sm:text-2xl font-display font-extrabold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6 font-normal">
                      {service.description}
                    </p>

                    {/* Features list */}
                    {service.features && service.features.length > 0 && (
                      <div className="space-y-2.5 mb-8">
                        {service.features.map((feature: string, idx: number) => (
                          <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/90 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="pt-5 border-t border-[var(--border)]/50 flex items-center justify-between relative z-10">
                    <Link 
                      to="/contact"
                      className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:text-accent transition-colors"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </Link>
                    <Sparkles className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
