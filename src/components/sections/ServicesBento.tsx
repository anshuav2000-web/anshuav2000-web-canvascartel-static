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
import { Button } from "@/components/ui/button";

const serviceCategories = [
  { id: "all", label: "All Services" },
  { id: "design", label: "Design & Branding" },
  { id: "dev", label: "Development & Tech" },
  { id: "marketing", label: "Marketing & Growth" },
  { id: "media", label: "Video & Content" },
];

const services = [
  {
    id: 1,
    category: "design",
    icon: Palette,
    title: "Branding & Graphic Design",
    description: "Custom brand identities, striking logos, and comprehensive visual systems that make your brand unforgettable.",
    features: ["Visual Identity", "Logo Design", "Brand Guidelines", "Print & Packaging"],
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    glow: "rgba(244, 63, 94, 0.25)",
  },
  {
    id: 2,
    category: "dev",
    icon: Globe,
    title: "Website Development",
    description: "Lightning-fast, responsive, conversion-optimized websites built with modern web technologies and clean code.",
    features: ["Custom Web Apps", "E-Commerce", "UI/UX Architecture", "Performance Tuning"],
    gradient: "from-blue-500 via-indigo-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.25)",
  },
  {
    id: 3,
    category: "marketing",
    icon: Megaphone,
    title: "Social Media Marketing",
    description: "Strategic content campaigns that build loyal communities, drive engagement, and accelerate audience growth.",
    features: ["Content Strategy", "Community Management", "Paid Ad Campaigns", "Viral Reels & Shorts"],
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    glow: "rgba(168, 85, 247, 0.25)",
  },
  {
    id: 4,
    category: "media",
    icon: Video,
    title: "Video Production",
    description: "Cinematic brand films, promotional commercials, and motion graphics from concept to final cut.",
    features: ["Brand Commercials", "Motion Graphics", "Product Teasers", "Post-Production"],
    gradient: "from-orange-500 via-amber-500 to-red-500",
    glow: "rgba(249, 115, 22, 0.25)",
  },
  {
    id: 5,
    category: "dev",
    icon: Workflow,
    title: "AI & Business Automation",
    description: "Advanced AI agents, WhatsApp workflows, and CRM automation to scale your business operations effortlessly.",
    features: ["AI Chatbots", "n8n Workflows", "WhatsApp Agents", "CRM Integration"],
    gradient: "from-cyan-500 via-teal-500 to-blue-500",
    glow: "rgba(6, 182, 212, 0.25)",
  },
  {
    id: 6,
    category: "media",
    icon: Camera,
    title: "Photography & Content",
    description: "Stunning product and creative lifestyle photography that captures your brand essence perfectly.",
    features: ["Product Shoots", "Lifestyle Photography", "Studio Lighting", "Retouching"],
    gradient: "from-emerald-500 via-teal-500 to-green-500",
    glow: "rgba(16, 185, 129, 0.25)",
  },
  {
    id: 7,
    category: "marketing",
    icon: Target,
    title: "Digital Marketing Strategy",
    description: "Data-driven SEO, PPC ad campaigns, and comprehensive analytics tracking to maximize your ROI.",
    features: ["Advanced SEO", "PPC & Google Ads", "Funnel Optimization", "Analytics & Reporting"],
    gradient: "from-violet-500 via-purple-500 to-indigo-500",
    glow: "rgba(139, 92, 246, 0.25)",
  },
];

export const ServicesBento = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  return (
    <section className="relative py-24 sm:py-32 bg-[var(--background)] overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[160px]" />
      </div>

      {/* Section Header */}
      <div className="container mx-auto px-4 sm:px-6 text-center mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary mb-4 inline-block border border-primary/20">
            Our Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
            What <span className="text-gradient">We Do</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg mb-8">
            Explore our comprehensive suite of creative, technical, and strategic services designed to empower your brand.
          </p>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 scale-105"
                    : "bg-[var(--card)] border border-[var(--border)] text-muted-foreground hover:text-foreground hover:border-primary/40"
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
            {filteredServices.map((service, index) => {
              const IconComponent = service.icon;

              return (
                <motion.div
                  layout
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative p-8 rounded-3xl bg-[var(--card)]/90 backdrop-blur-xl border border-[var(--border)]/70 shadow-xl hover:border-primary/50 transition-all duration-500 overflow-hidden flex flex-col justify-between"
                  style={{
                    boxShadow: `0 15px 35px -10px ${service.glow}`,
                  }}
                >
                  {/* Glowing background gradient on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 90% 10%, ${service.glow} 0%, transparent 70%)`
                    }}
                  />

                  <div>
                    {/* Icon Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div 
                        className="w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500"
                        style={{ background: `linear-gradient(135deg, ${service.gradient})` }}
                      >
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-secondary text-muted-foreground border border-border/40">
                        {service.category}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Features list */}
                    <div className="space-y-2.5 mb-8">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-foreground/80 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-[var(--border)]/40 flex items-center justify-between">
                    <Link 
                      to="/contact"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:underline"
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
