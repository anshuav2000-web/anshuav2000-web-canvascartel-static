import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plus, Minus } from "lucide-react";

// FAQ data
const faqs = [
  {
    id: 1,
    question: "What services does Canvas Cartel provide?",
    answer: "We offer a comprehensive range of creative and marketing services including branding & graphic design, social media marketing, website development, video production, photography, digital marketing strategy, and AI & business automation."
  },
  {
    id: 2,
    question: "How long does a typical project take?",
    answer: "Project timelines vary depending on the scope and complexity. Most projects take 4-8 weeks from discovery to delivery. We provide a detailed timeline during the discovery phase."
  },
  {
    id: 3,
    question: "What is your pricing structure?",
    answer: "We offer flexible pricing options including fixed-price packages and custom proposals. All projects begin with a free consultation and quote to ensure the best fit for your budget and goals."
  },
  {
    id: 4,
    question: "Do you work with startups and established businesses?",
    answer: "Yes! We work with startups, SMEs, healthcare providers, restaurants, real estate companies, and e-commerce businesses of all sizes."
  },
  {
    id: 5,
    question: "Can you create AI and WhatsApp automation for us?",
    answer: "Absolutely! We specialize in AI workflows, WhatsApp AI agents, lead generation systems, and CRM automation using n8n and other tools."
  },
  {
    id: 6,
    question: "How do you handle ongoing support and maintenance?",
    answer: "We offer comprehensive ongoing support and maintenance packages to ensure your digital presence stays optimized and up-to-date."
  },
];

export const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="relative py-16 sm:py-20 bg-[var(--background)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "power2.out" }}
            className="text-xl sm:text-2xl font-semibold text-foreground mb-4"
          >
            <span className="text-gradient">Frequently Asked Questions</span>
          </motion.h2>
          <p className="text-muted-foreground text-sm">
            Everything you need to know about our services and process
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              className="bg-[var(--card)] border border-[var(--border)]/30 rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "power2.out" }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-[var(--secondary)]/30 transition-colors"
                onClick={() => toggleFAQ(faq.id)}
              >
                <span className="font-medium text-foreground text-sm sm:text-base">
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br to-50% from-gradient flex items-center justify-center transition-all duration-300 ${
                  openFAQ === faq.id ? "rotate-45" : ""
                }`} style={{
                  background: `linear-gradient(135deg, ${openFAQ === faq.id ? "#FF6B4A" : "#1a1010"})`,
                }}>
                  {openFAQ === faq.id ? (
                    <Plus className="w-4 h-4 text-white" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openFAQ === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
