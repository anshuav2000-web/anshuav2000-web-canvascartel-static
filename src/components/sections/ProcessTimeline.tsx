import { gsap } from "gsap";
import { motion } from "framer-motion";
import { 
  Search, 
  Lightbulb, 
  Palette, 
  Wrench, 
  Rocket, 
  TrendingUp 
} from "lucide-react";

// Process steps
const processSteps = [
  { 
    id: 1, 
    number: "01", 
    title: "Discover", 
    description: "We dive deep into your brand, goals, and target audience to understand your unique value.",
    icon: Search,
    color: "from-blue-500 to-cyan-600",
  },
  { 
    id: 2, 
    number: "02", 
    title: "Strategy", 
    description: "Data-driven strategy to position your brand and reach your target market effectively.",
    icon: Lightbulb,
    color: "from-purple-500 to-pink-600",
  },
  { 
    id: 3, 
    number: "03", 
    title: "Design", 
    description: "Creatives that capture your brand essence and communicate your message beautifully.",
    icon: Palette,
    color: "from-pink-500 to-rose-600",
  },
  { 
    id: 4, 
    number: "04", 
    title: "Build", 
    description: "We build, develop, and produce your assets with precision and attention to detail.",
    icon: Wrench,
    color: "from-orange-500 to-red-600",
  },
  { 
    id: 5, 
    number: "05", 
    title: "Launch", 
    description: "We launch your brand to the world with a strategic go-to-market plan.",
    icon: Rocket,
    color: "from-violet-500 to-purple-600",
  },
  { 
    id: 6, 
    number: "06", 
    title: "Grow", 
    description: "Continuous optimization and growth strategies to maximize your ROI long-term.",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-600",
  },
];

export const ProcessTimeline = () => {
  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-b from-[var(--background)] to-[var(--secondary)]">
      {/* Section header */}
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "power2.out" }}
          className="text-xl sm:text-2xl font-semibold text-foreground mb-4"
        >
          <span className="text-gradient">Our Process</span>
        </motion.h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          A proven methodology that delivers exceptional results for our clients.
        </p>
      </div>

      {/* Timeline */}
      <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 sm:left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary" />

          {/* Timeline steps */}
          <div className="space-y-8 sm:space-y-12">
            {processSteps.map((step, index) => (
              <div 
                key={step.id}
                className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0"
              >
                {/* Step indicator */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br to-50% from-gradient flex items-center justify-center shadow-lg" style={{
                    background: `linear-gradient(135deg, ${step.color})`,
                  }}>
                    <step.icon className="w-6 h-6 text-white" />
                    <span className="absolute inset-0 rounded-2xl ring-4 ring-[var(--background)]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-[var(--background)] border border-[var(--border)] text-xs font-bold text-foreground flex items-center justify-center">
                    {step.number}
                  </span>
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step number badge */}
                <div className="hidden sm:block w-16 h-16 rounded-xl bg-[var(--card)] border border-[var(--border)]/30 flex items-center justify-center text-lg font-bold text-foreground">
                  {step.number}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
