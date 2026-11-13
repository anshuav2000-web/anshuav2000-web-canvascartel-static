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
    title: "Discover & Research", 
    description: "We dive deep into your brand, business goals, and target audience to understand your unique value proposition.",
    icon: Search,
    color: "from-blue-500 to-cyan-600",
  },
  { 
    id: 2, 
    number: "02", 
    title: "Strategic Blueprint", 
    description: "Data-driven strategy and roadmap to position your brand effectively and reach your target market.",
    icon: Lightbulb,
    color: "from-purple-500 to-pink-600",
  },
  { 
    id: 3, 
    number: "03", 
    title: "Creative Design", 
    description: "Stunning visual identities and creatives that capture your brand essence and communicate your message.",
    icon: Palette,
    color: "from-pink-500 to-rose-600",
  },
  { 
    id: 4, 
    number: "04", 
    title: "Development & Build", 
    description: "We build, code, and produce your assets with precision, performance, and meticulous attention to detail.",
    icon: Wrench,
    color: "from-orange-500 to-red-600",
  },
  { 
    id: 5, 
    number: "05", 
    title: "Launch & Go-Live", 
    description: "We deploy and launch your brand to the world with a strategic go-to-market rollout plan.",
    icon: Rocket,
    color: "from-violet-500 to-purple-600",
  },
  { 
    id: 6, 
    number: "06", 
    title: "Scale & Grow", 
    description: "Continuous optimization, analytics tracking, and growth strategies to maximize ROI long-term.",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-600",
  },
];

export const ProcessTimeline = () => {
  return (
    <section className="relative py-20 sm:py-28 bg-[var(--background)] overflow-hidden">
      {/* Background glow decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[140px]" />
      </div>

      {/* Section header */}
      <div className="container mx-auto px-4 sm:px-6 text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary mb-4 inline-block border border-primary/20">
            How We Work
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Our Proven <span className="text-gradient">Process</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
            A step-by-step methodology designed to transform your vision into an exceptional digital reality.
          </p>
        </motion.div>
      </div>

      {/* Timeline container */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-5xl">
        <div className="relative">
          {/* Central vertical glowing line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary/30 hidden md:block rounded-full shadow-[0_0_15px_hsl(var(--primary)/0.3)]" />

          {/* Timeline steps */}
          <div className="space-y-12 md:space-y-16">
            {processSteps.map((step, index) => {
              const isEven = index % 2 === 1; // Even index (1, 3, 5 -> 2nd, 4th, 6th) comes from right, odd (0, 2, 4) from left
              const initialX = isEven ? 100 : -100;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: initialX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content card */}
                  <div className="w-full md:w-1/2">
                    <div className="p-6 sm:p-8 rounded-3xl bg-[var(--card)] border border-[var(--border)]/60 shadow-xl hover:border-primary/40 transition-all duration-300 group hover:-translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                          style={{ background: `linear-gradient(135deg, ${step.color})` }}
                        >
                          <step.icon className="w-7 h-7" />
                        </div>
                        <span className="text-3xl sm:text-4xl font-display font-extrabold text-muted-foreground/20 group-hover:text-primary/40 transition-colors">
                          {step.number}
                        </span>
                      </div>

                      <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node Indicator */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-[var(--background)] border-4 border-primary text-primary font-bold shadow-lg z-20">
                    <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                  </div>

                  {/* Empty space for alternating layout on desktop */}
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
