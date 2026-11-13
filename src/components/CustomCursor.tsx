import { useEffect, useRef, useState } from "react";
import { useMotionValue, useTransform, useSpring, MotionValue } from "framer-motion";

export const CustomCursor = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Cursor dot
  const cursorScale = useSpring(1, { stiffness: 400, damping: 30 });
  const cursorX = useTransform(mouseX, (x) => x - 20);
  const cursorY = useTransform(mouseY, (y) => y - 20);

  // Cursor label (shows on hover)
  const [showLabel, setShowLabel] = useState(false);
  const labelX = useTransform(mouseX, (x) => x - 30);
  const labelY = useTransform(mouseY, (y) => y - 20);
  const labelOpacity = useTransform(showLabel, (v) => v ? 1 : 0);

  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  // Update cursor position
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  // Show label on hover
  useEffect(() => {
    const handleMouseEnter = () => setShowLabel(true);
    const handleMouseLeave = () => setShowLabel(false);

    const cursorElements = document.querySelectorAll('[data-cursor-label]');
    cursorElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      cursorElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Cursor dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[9999] transition-transform duration-300"
        style={{
          x: cursorX,
          y: cursorY,
          scale: cursorScale,
        }}
      >
        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="6" cy="6" r="2" fill="white" />
          </svg>
        </div>
      </div>

      {/* Cursor label */}
      <div
        ref={labelRef}
        className="fixed pointer-events-none z-[9999] transition-opacity duration-300"
        style={{
          x: labelX,
          y: labelY,
          opacity: labelOpacity,
        }}
      >
        <div className="bg-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-md whitespace-nowrap shadow-lg border border-white/10">
          View
        </div>
      </div>
    </>
  );
};
