import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { motion } from "framer-motion";
import { 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  User 
} from "lucide-react";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Founder, TechFlow",
    content: "Canvas Cartel transformed our brand completely. The new identity captured our vision perfectly and the quality of work is outstanding.",
    initials: "RS",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "CEO, Bloom Florals",
    content: "Working with Canvas Cartel was a game-changer for our e-commerce business. Our online sales increased by 200% within 6 months.",
    initials: "PP",
    color: "from-pink-500 to-rose-600",
  },
  {
    id: 3,
    name: "Deepak Mehta",
    role: "Marketing Director, Fitness Pro",
    content: "Their video production team delivered a cinematic brand film that's been viewed over 2M times across platforms.",
    initials: "DM",
    color: "from-violet-500 to-purple-600",
  },
];

export const TestimonialsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStart, setDragStart] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardWidth = useRef<number>(0);

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    setDragStart(e.clientX);
    setIsDragging(true);
    gsap.killTweensOf(containerRef.current);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart;
    setCurrentIndex((prev) => {
      const newIndex = prev - Math.round(deltaX / 150);
      return (newIndex + testimonials.length) % testimonials.length;
    });
    setDragStart(e.clientX);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    gsap.to(containerRef.current, {
      x: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  };

  // GSAP animations for cards
  useEffect(() => {
    const card = containerRef.current?.querySelector('[data-testimonial-card]');
    if (!card) return;

    gsap.fromTo(card, {
      opacity: 0,
      y: 40,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        end: "top 50%",
        scrub: 1,
      },
    });
  }, []);

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
            <span className="text-gradient">Testimonials</span>
          </motion.h2>
          <p className="text-muted-foreground text-sm">
            What our clients say about working with us
          </p>
        </div>

        {/* Testimonial slider */}
        <div className="relative max-w-4xl mx-auto">
          <div
            ref={containerRef}
            className="overflow-hidden"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  data-testimonial-card
                  className="w-full flex-shrink-0 px-2"
                >
                  <motion.div
                    className="bg-[var(--card)] border border-[var(--border)]/30 rounded-2xl p-6 sm:p-8 h-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {/* Quote mark */}
                    <div className="text-5xl text-primary/20 font-serif leading-none mb-4 select-none">
                      "
                    </div>

                    {/* Quote content */}
                    <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed mb-6">
                      "{testimonial.content}"
                    </p>

                    {/* Author info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br to-50% from-gradient flex items-center justify-center" style={{
                        background: `linear-gradient(135deg, ${testimonial.color})`,
                      }}>
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex gap-1 mt-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--border)] text-foreground flex items-center justify-center hover:bg-[var(--secondary)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[var(--card)] border border-[var(--border)] text-foreground flex items-center justify-center hover:bg-[var(--secondary)] transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary w-6" : "bg-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
