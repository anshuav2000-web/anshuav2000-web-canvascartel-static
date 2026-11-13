import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MotionValue, useMotionValue, useSpring as useMotionSpring } from "framer-motion";
import { Logo, Sparkles, ArrowRight } from "lucide-react";

export const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const startRef = useRef<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Start the loading progress
    startRef.current = Date.now();
    const totalDuration = 2500; // 2.5 seconds total

    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsComplete(true);
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Handle completion
  useEffect(() => {
    if (isComplete) {
      // Small delay then navigate
      const timer = setTimeout(() => {
        navigate("/");
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, navigate]);

  // Custom cursor with label
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const cursorScale = useMotionSpring(1, { stiffness: 400, damping: 30 });
  const cursorLabel = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const hideCursor = () => {
      setShowCursor(false);
      setTimeout(() => setShowCursor(true), 1500);
    };

    document.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", hideCursor);
    document.addEventListener("click", hideCursor);

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", hideCursor);
      document.removeEventListener("click", hideCursor);
    };
  }, [cursorX, cursorY, cursorScale]);

  const cursorXLabel = useTransform(cursorX, (x) => Math.max(0, Math.min(x - 30, window.innerWidth - 60)));
  const cursorYLabel = useTransform(cursorY, (y) => Math.max(0, Math.min(y - 20, window.innerHeight - 40)));

  return (
    <>
      {/* Custom cursor */}
      <div
        className="fixed pointer-events-none z-[9999] transition-opacity duration-300"
        style={{
          opacity: showCursor ? 1 : 0,
          transform: `translate(${cursorX}px, ${cursorY}px) scale(${cursorScale})`,
        }}
      >
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div
          ref={cursorLabel}
          className="absolute top-12 sm:top-16 left-12 bg-black/70 text-white text-xs font-semibold px-3 py-1.5 rounded-md whitespace-nowrap pointer-events-none opacity-0 transition-opacity duration-300"
        >
          View
        </div>
      </div>

      {/* Branded preloader */}
      <div className="fixed inset-0 z-[10000] bg-[#0a0404] flex flex-col items-center justify-center overflow-hidden">
        {/* Dark gradient background with floating elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-[100px] animate-pulse animation-delay-1000" />
        </div>

        {/* Logo reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col items-center gap-4"
        >
          {/* Logo badge */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center shadow-xl">
            <Logo className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-display font-bold text-white text-center"
          >
            Canvas Cartel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-muted-foreground text-center max-w-xs"
          >
            Creative Design & Marketing Studio
          </motion.p>
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-16 w-full overflow-hidden">
          <motion.div
            className="h-1 bg-secondary/20 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
              initial={{ x: "-100%" }}
              animate={{ x: `${progress >= 100 ? 0 : -100 + `${progress}%` }} }}
              transition={{ duration: 0.1, ease: "linear" }}
            />
          </motion.div>
        </div>

        {/* Progress percentage */}
        <motion.p
          className="absolute bottom-6 text-sm text-muted-foreground font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Loading {Math.floor(progress)}%
        </motion.p>

        {/* Loading dots */}
        <div className="absolute top-1/3 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-primary"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
        >
          <div className="w-4 h-6 border border-border/30 rounded-full flex items-center justify-center">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-primary"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};
