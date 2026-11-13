import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

/**
 * Custom hook for scroll-triggered animations using GSAP
 * Uses only transform and opacity for 60fps performance
 */
export const useScrollAnimations = () => {
  useGSAP(() => {
    // Animate elements with data-animate attribute
    const animateElements = (delay = 0) => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el, index) => {
        const element = el as HTMLElement;
        const trigger = element.dataset.animate as string;
        const start = trigger.includes('top') ? 'top 85%' : 'top 90%';
        const end = trigger.includes('bottom') ? 'top 30%' : 'top 60%';

        gsap.fromTo(element, {
          opacity: 0,
          y: 60,
        }, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: index * 0.1 + delay,
          scrollTrigger: {
            trigger: element,
            start: start,
            end: end,
            scrub: 1.5,
            markers: false,
          },
        });
      });
    };

    // Run on load and onIntersection
    animateElements(0);

    return () => {
      // Cleanup on unmount
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el) => {
        const trigger = el as HTMLElement;
        const st = gsap.matchScrollTrigger({
          trigger: trigger,
          onEnter: () => {},
          onLeave: () => {},
          onEnterBack: () => {},
          onLeaveBack: () => {},
        });
      });
    };
  }, []);
};

/**
 * Hook for revealing elements on scroll (GSAP)
 */
export const useRevealOnScroll = (delay = 0, duration = 0.8) => {
  useGSAP(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    elements.forEach((el, index) => {
      const element = el as HTMLElement;
      gsap.fromTo(element, {
        opacity: 0,
        y: 40,
      }, {
        opacity: 1,
        y: 0,
        duration: duration,
        ease: "power3.out",
        delay: index * 0.1 + delay,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "top 40%",
          scrub: 1,
          markers: false,
        },
      });
    });
  }, [delay, duration]);
};

/**
 * Hook for counting numbers on scroll
 */
export const useAnimatedCounters = (duration = 2, delay = 0) => {
  useGSAP(() => {
    const counters = document.querySelectorAll('[data-counter]');
    counters.forEach((counter, index) => {
      const element = counter as HTMLElement;
      const target = parseFloat(element.dataset.counter || '0');
      const isInView = element.dataset.isInView === 'true';

      if (isInView) {
        gsap.to(element, {
          duration: duration,
          ease: "power2.out",
          textContent: target,
          snap: { textContent: 1 },
          delay: index * 0.1 + delay,
          onUpdate: () => {
            element.textContent = Math.round(parseFloat(element.dataset.counter || '0'));
          },
        });
      }
    });
  }, [duration, delay]);
};

/**
 * Hook for parallax effects on scroll
 */
export const useParallax = () => {
  useGSAP(() => {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    parallaxElements.forEach((el, index) => {
      const element = el as HTMLElement;
      const speed = parseFloat(element.dataset.parallax || '0.2');

      gsap.to(element, {
        y: () => window.scrollY * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          markers: false,
        },
      });
    });
  }, []);
};

/**
 * Hook for staggered card animations in a grid
 */
export const useStaggeredGrid = (delay = 0.1, stagger = 0.1) => {
  useGSAP(() => {
    const grid = document.querySelector('[data-grid]');
    if (!grid) return;

    const items = grid.querySelectorAll('[data-grid-item]');
    gsap.fromTo(items, {
      opacity: 0,
      y: 40,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      stagger: stagger,
      scrollTrigger: {
        trigger: grid,
        start: "top 90%",
        end: "top 50%",
        scrub: 1.5,
        markers: false,
      },
    });
  }, [delay, stagger]);
};

/**
 * Hook for animated text on scroll
 */
export const useAnimatedText = () => {
  useGSAP(() => {
    const texts = document.querySelectorAll('[data-text-animate]');
    texts.forEach((el, index) => {
      const element = el as HTMLElement;
      gsap.fromTo(element, {
        opacity: 0,
        scale: 0.95,
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: index * 0.1,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          end: "top 60%",
          scrub: 1,
          markers: false,
        },
      });
    });
  }, []);
};

/**
 * Hook for hover glow effects
 */
export const useHoverGlow = () => {
  useGSAP(() => {
    const glowImages = document.querySelectorAll('[data-glow]');
    glowImages.forEach((el) => {
      const element = el as HTMLElement;
      const glow = element.querySelector('.glow-layer') as HTMLElement;

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        if (glow) {
          gsap.to(glow, {
            x: x * 0.5,
            y: y * 0.5,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      });

      element.addEventListener('mouseleave', () => {
        if (glow) {
          gsap.to(glow, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });
    });
  }, []);
};

/**
 * Hook for 3D tilt effect on cards
 */
export const use3DTilt = () => {
  useGSAP(() => {
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach((card) => {
      const element = card as HTMLElement;

      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = (-y / rect.height) * 15;
        const rotateY = (x / rect.width) * 15;

        gsap.set(element, {
          rotateX: rotateX,
          rotateY: rotateY,
          transformPerspective: 1000,
          ease: "power2.out",
          overwrite: true,
        });
      });

      element.addEventListener('mouseleave', () => {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        });
      });
    });
  }, []);
};

/**
 * Hook for draggable slider (for testimonials)
 */
export const useDraggableSlider = () => {
  // This will be implemented with Framer Motion or GSAP Draggable
  // For now, we'll use Framer Motion's useDrag
  return null;
};

/**
 * Hook for animated counters with framer-motion
 */
export const useFramerCounters = (duration = 2, delay = 0) => {
  // Use framer-motion for counters
  // This is handled by the component itself
  return null;
};
