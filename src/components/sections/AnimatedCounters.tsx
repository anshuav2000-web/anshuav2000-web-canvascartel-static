import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Star, Award, Clock, TrendingUp } from "lucide-react";

// Counter data
const counters = [
  { 
    id: 1, 
    value: 50, 
    suffix: "+", 
    label: "Projects Delivered",
    icon: Star,
    color: "text-amber-500",
  },
  { 
    id: 2, 
    value: 30, 
    suffix: "+", 
    label: "Happy Clients",
    icon: Award,
    color: "text-blue-500",
  },
  { 
    id: 3, 
    value: 5, 
    suffix: "+", 
    label: "Years Experience",
    icon: Clock,
    color: "text-emerald-500",
  },
  { 
    id: 4, 
    value: 98, 
    suffix: "%", 
    label: "Client Satisfaction",
    icon: TrendingUp,
    color: "text-violet-500",
  },
];

export const AnimatedCounters = () => {
  return (
    <section className="relative py-16 sm:py-20 bg-[var(--background)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {counters.map((counter, index) => (
            <motion.div
              key={counter.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "power2.out", delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br to-50% from-gradient flex items-center justify-center mx-auto mb-3" style={{
                background: `linear-gradient(135deg, ${counter.color} / 10 0%, transparent 70%)`,
              }}>
                <counter.icon className={`w-6 h-6 ${counter.color}`} />
              </div>
              
              <div className="relative inline-block" data-counter={counter.value} data-is-in-view="true">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "power2.out" }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gradient mb-2"
                >
                  {counter.value}
                  <span className="text-2xl sm:text-3xl lg:text-4xl">{counter.suffix}</span>
                </motion.div>
              </div>

              <p className="text-sm text-muted-foreground mt-1">{counter.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
