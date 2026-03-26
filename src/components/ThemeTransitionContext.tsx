"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

type ThemeTransitionContextValue = {
  setThemeWithTransition: (theme: "light" | "dark") => void;
};

const ThemeTransitionContext = createContext<ThemeTransitionContextValue | null>(null);

export function useThemeTransition() {
  const ctx = useContext(ThemeTransitionContext);
  return ctx;
}

const THEME_BG = {
  dark: "#0a0f1a",
  light: "#ffffff",
} as const;

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [transition, setTransition] = useState<{
    target: "light" | "dark";
    phase: "slide-in" | "fade-out";
  } | null>(null);

  const setThemeWithTransition = useCallback(
    (target: "light" | "dark") => {
      if (resolvedTheme === target) return;
      setTransition({ target, phase: "slide-in" });
    },
    [resolvedTheme]
  );

  const onSlideInComplete = useCallback(() => {
    if (transition) {
      setTheme(transition.target);
      setTransition((t) => (t ? { ...t, phase: "fade-out" } : null));
    }
  }, [transition, setTheme]);

  const onFadeOutComplete = useCallback(() => {
    setTransition(null);
  }, []);

  return (
    <ThemeTransitionContext.Provider value={{ setThemeWithTransition }}>
      {children}
      <AnimatePresence>
        {transition && (
          <motion.div
            key={transition.target}
            className="fixed inset-0 z-[9999] pointer-events-none"
            initial={false}
          >
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: THEME_BG[transition.target] }}
              initial={{ x: "100%", opacity: 1 }}
              animate={
                transition.phase === "slide-in"
                  ? { x: 0, opacity: 1 }
                  : { x: "-100%", opacity: 0.95 }
              }
              transition={{
                type: "tween",
                ease: [0.32, 0.72, 0, 1],
                duration: transition.phase === "slide-in" ? 0.35 : 0.25,
              }}
              onAnimationComplete={
                transition.phase === "slide-in" ? onSlideInComplete : onFadeOutComplete
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeTransitionContext.Provider>
  );
}
