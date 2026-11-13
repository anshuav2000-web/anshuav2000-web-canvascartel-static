import { useState } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Youtube, 
  ChevronUp 
} from "lucide-react";

export const LargeCTA = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Form submission logic would go here
      console.log("Subscribed:", email);
      setEmail("");
    }
  };

  return (
    <section className="relative py-16 sm:py-24 bg-gradient-to-br from-primary via-accent to-primary text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-black/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "power2.out" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight"
          >
            Ready to Build Something <span className="text-gradient">Amazing?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "power2.out", delay: 0.2 }}
            className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8"
          >
            Let's create a brand that people remember. Get your free consultation and quote today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "power2.out", delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button
              asChild
              className="bg-white text-primary hover:bg-white/90 h-12 px-8 text-base"
            >
              <Link to="/contact">
                Get a Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="h-12 px-8 text-base"
            >
              <Link to="/services">
                View Our Services
              </Link>
            </Button>
          </motion.div>

          {/* Newsletter subscription */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "power2.out", delay: 0.4 }}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto"
          >
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-white/50 transition-colors"
              />
              <Button
                type="submit"
                className="bg-white text-primary hover:bg-white/90 h-12 px-6 text-base"
              >
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-white/60 mt-2">
              Subscribe to our newsletter for design tips and updates. No spam, ever.
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
};
