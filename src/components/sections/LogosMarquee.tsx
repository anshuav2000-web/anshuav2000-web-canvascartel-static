import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef, useState } from "react";

// Logos data (sample from common design/development tools)
const logos = [
  { name: "Google", color: "#4285F4" },
  { name: "Microsoft", color: "#00A4EF" },
  { name: "Amazon", color: "#FF9900" },
  { name: "Apple", color: "#FF0000" },
  { name: "Figma", color: "#F24E1E" },
  { name: "Adobe", color: "#FF0000" },
  { name: "Notion", color: "#000000" },
  { name: "Slack", color: "#4A154B" },
  { name: "Atlassian", color: "#0052CC" },
  { name: "Zoom", color: "#2D8CFF" },
  { name: "Webflow", color: "#47399E" },
  { name: "Shopify", color: "#7Q4483" },
];

export const LogosMarquee = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useGSAP(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let scrollTween: gsap.core.Tween | null = null;

    // Start infinite scroll
    const startScroll = () => {
      if (scrollTween) scrollTween.kill();
      scrollTween = gsap.to(marquee, {
        x: () => -(marquee.scrollWidth / 2),
        duration: 30,
        ease: "none",
        repeat: -1,
        repeatDelay: 0,
      });
    };

    // Pause on hover
    marquee.addEventListener('mouseenter', () => {
      if (scrollTween) {
        scrollTween.pause();
        setIsPaused(true);
      }
    });

    marquee.addEventListener('mouseleave', () => {
      if (scrollTween) {
        scrollTween.resume();
        setIsPaused(false);
      }
    });

    startScroll();

    return () => {
      if (scrollTween) {
        scrollTween.kill();
      }
      marquee.removeEventListener('mouseenter', () => {});
      marquee.removeEventListener('mouseleave', () => {});
    };
  }, []);

  return (
    <section className="relative py-12 sm:py-16 bg-[var(--muted)] overflow-hidden">
      {/* Section header */}
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "power2.out" }}
          className="text-xl sm:text-2xl font-semibold text-foreground mb-6"
        >
          <span className="text-gradient">Trusted by</span> founders and teams worldwide
        </motion.h2>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          We partner with ambitious brands to create digital experiences that stand out.
        </p>
      </div>

      {/* Marquee container */}
      <div
        ref={marqueeRef}
        className="container mx-auto px-4 sm:px-6 overflow-hidden"
      >
        <motion.div
          animate={isPaused ? { x: 0 } : { x: ["0%", "-50%"] }}
          transition={{
            x: { duration: 30, ease: "linear", repeat: -1, repeatDelay: 0 },
          }}
          className="flex gap-8 sm:gap-12 lg:gap-16 xl:gap-20 2xl:gap-28"
        >
          {/* First set of logos */}
          <div className="flex flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 xl:gap-20 2xl:gap-28">
            {logos.map((logo, index) => (
              <div
                key={`${index}-first`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)]/40"
              >
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: logo.color }}
                >
                  <span className="hidden sm:inline">{logo.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{logo.name}</span>
              </div>
            ))}
          </div>

          {/* Second set of logos (duplicate for seamless loop) */}
          <div className="flex flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 xl:gap-20 2xl:gap-28">
            {logos.map((logo, index) => (
              <div
                key={`${index}-second`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)]/40"
              >
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: logo.color }}
                >
                  <span className="hidden sm:inline">{logo.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium text-foreground">{logo.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Hover pause overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/10">
          <span className="text-sm text-white/80">Pause scrolling</span>
        </div>
      </div>
    </section>
  );
};
