"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark" || (!mounted && true);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-full bg-lavender-600/50 animate-pulse" aria-hidden />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative w-10 h-10 rounded-full bg-lavender-600/80 hover:bg-lavender-500 border border-lavender-500/50 flex items-center justify-center text-jet-black transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-[var(--page-bg)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Sun className="w-5 h-5" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Moon className="w-5 h-5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
