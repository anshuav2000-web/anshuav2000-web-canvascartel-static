import { Layout } from "@/components/layout/Layout";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Sparkles,
  Star,
  Zap,
  TrendingUp,
  DollarSign
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ThreeDHero } from "@/components/hero/ThreeDHero";
import { Quiz } from "@/components/quiz/Quiz";
import { QuoteCalculator } from "@/components/quote/QuoteCalculator";

const services = [
  { icon: "branding", title: "Branding & Graphic Design", description: "Unique visual identities that make your brand unforgettable." },
  { icon: "social", title: "Social Media Marketing", description: "Engage your audience with strategic social media campaigns." },
  { icon: "website", title: "Website Development", description: "High-performance websites that convert visitors into customers." },
  { icon: "video", title: "Video Production", description: "Professional video content that tells your brand story." },
  { icon: "photo", title: "Photography", description: "Stunning photography that captures the essence of your brand." },
  { icon: "marketing", title: "Digital Marketing Strategy", description: "SEO, campaigns, and data-driven strategies for growth." },
  { icon: "ai", title: "AI & Business Automation", description: "N8n workflows, WhatsApp AI agents, and CRM automation." },
];

const industries = [
  "Healthcare", "Restaurants", "Real Estate", "E-commerce", "Startups"
];

const testimonials = [
  { quote: "Canvas Cartel transformed our brand completely. The new identity exceeded our expectations.", name: "Rahul Sharma", company: "TechStart", initials: "RS" },
  { quote: "Their AI automation solutions saved us 20 hours per week. Truly impressed.", name: "Meera Patel", company: "MediCare", initials: "MP" },
  { quote: "The most professional agency we've worked with. Highly recommended.", name: "Arjun Krishnan", company: "BuildNet", initials: "AK" },
];

export const HomePage = () => {
  return (
    <Layout>
      {/* 3D Hero Section */}
      <ThreeDHero />

      {/* Stats Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Projects Completed" },
              { value: "30+", label: "Happy Clients" },
              { value: "5+", label: "Years Experience" },
              { value: "98%", label: "Client Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-4"
              >
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Section - "Find Your Service" */}
      <section className="py-16 sm:py-20 bg-[var(--background)]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
              <span className="text-gradient">Find Your Perfect Service</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Answer a few quick questions and we'll recommend the best services for your business
            </p>
          </motion.div>

          <Quiz />
        </div>
      </section>

      {/* Quote Calculator Section */}
      <section className="py-16 sm:py-20 bg-[var(--secondary)]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
              <span className="text-gradient">Get Your Project Quote</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select services, choose your project size, and get an instant estimate. No commitments, just insights.
            </p>
          </motion.div>

          <QuoteCalculator />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 bg-[var(--background)]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-display font-bold text-center mb-4"
          >
            <span className="text-gradient">Our Services</span>
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Comprehensive creative and marketing solutions tailored to your business needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--card)] border border-border hover:border-primary/30 transition-all hover:shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-16 sm:py-20 bg-[var(--secondary)]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-display font-bold text-center mb-8"
          >
            <span className="text-gradient">We Serve Industries</span>
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="px-6 py-3 rounded-xl bg-[var(--card)] border border-border hover:border-primary/30 transition-all hover:shadow-md"
              >
                {industry}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-[var(--background)]">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-display font-bold text-center mb-8"
          >
            <span className="text-gradient">Client Testimonials</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-[var(--card)] border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-[var(--secondary)]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-display font-bold mb-4"
          >
            <span className="text-gradient">Ready to Transform Your Brand?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-muted-foreground mb-8 max-w-lg mx-auto"
          >
            Let's discuss your project and create something amazing together.
          </motion.p>
          <Link to="/contact">
            <button className="h-12 px-8 rounded-lg bg-gradient-to-r from-primary to-accent text-white font-semibold hover:from-primary/90 hover:to-accent/90 transition-all hover:scale-105">
              Start Your Project
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
