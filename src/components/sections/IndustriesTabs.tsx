import { useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { 
  Heart, 
  UtensilsCrossed, 
  Home, 
  ShoppingCart, 
  Rocket 
} from "lucide-react";

// Industries data
const industries = [
  { 
    id: "healthcare", 
    name: "Healthcare", 
    icon: Heart,
    description: "Healthcare solutions for clinics and medical providers",
    color: "from-rose-500 to-red-600",
  },
  { 
    id: "restaurants", 
    name: "Restaurants", 
    icon: UtensilsCrossed,
    description: "Food and beverage branding for restaurants and cafes",
    color: "from-orange-500 to-amber-600",
  },
  { 
    id: "real-estate", 
    name: "Real Estate", 
    icon: Home,
    description: "Real estate marketing and property branding",
    color: "from-blue-500 to-indigo-600",
  },
  { 
    id: "ecommerce", 
    name: "E-commerce", 
    icon: ShoppingCart,
    description: "E-commerce solutions for online retail stores",
    color: "from-purple-500 to-indigo-600",
  },
  { 
    id: "startups", 
    name: "Startups", 
    icon: Rocket,
    description: "Startup branding and growth marketing for new businesses",
    color: "from-emerald-500 to-teal-600",
  },
];

export const IndustriesTabs = () => {
  const [activeIndustry, setActiveIndustry] = useState<string>("all");

  return (
    <section className="relative py-16 sm:py-20 bg-[var(--secondary)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "power2.out" }}
            className="text-xl sm:text-2xl font-semibold text-foreground mb-4"
          >
            <span className="text-gradient">Industries We Serve</span>
          </motion.h2>
          <p className="text-muted-foreground text-sm">
            Trusted by businesses across diverse sectors
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            onClick={() => setActiveIndustry("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeIndustry === "all"
                ? "bg-gradient-to-r from-primary to-accent text-white glow"
                : "bg-[var(--card)] text-muted-foreground hover:text-foreground hover:bg-[var(--secondary)]"
            }`}
          >
            All Industries
          </button>
          {industries.map((industry) => (
            <button
              key={industry.id}
              onClick={() => setActiveIndustry(industry.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                activeIndustry === industry.id
                  ? "bg-gradient-to-r from-primary to-accent text-white glow"
                  : "bg-[var(--card)] text-muted-foreground hover:text-foreground hover:bg-[var(--secondary)]"
              }`}
            >
              <industry.icon className="w-4 h-4" />
              {industry.name}
            </button>
          ))}
        </div>

        {/* Industry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {industries.map((industry) => (
            <motion.div
              key={industry.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "power2.out" }}
              className={`relative rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                activeIndustry === industry.id
                  ? "bg-gradient-to-br to-50% from-gradient ring-2 ring-primary"
                  : "bg-[var(--card)] border border-[var(--border)]/30 hover:border-[var(--border)]/60 hover:shadow-lg hover:shadow-black/10"
              }`}
              style={{
                background: activeIndustry === industry.id
                  ? `linear-gradient(135deg, ${industry.color})`
                  : "transparent",
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{
                background: activeIndustry === industry.id
                  ? "rgba(255,255,255,0.2)"
                  : `linear-gradient(135deg, ${industry.color})`,
              }}>
                <industry.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className={`font-semibold text-center mb-1 ${
                activeIndustry === industry.id ? "text-white" : "text-foreground"
              }`}>
                {industry.name}
              </h3>
              
              <p className={`text-xs text-center ${activeIndustry === industry.id ? "text-white/80" : "text-muted-foreground"}`}>
                {industry.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
