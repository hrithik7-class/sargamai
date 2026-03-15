"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/** Music-themed pill: background images + theme-aware overlay and thumb (dark in light, black/white in dark). */
const LIGHT_IMAGE =
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
const DARK_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) {
    return (
      <div className="w-12 h-6 rounded-full bg-lavender-600/50 animate-pulse shrink-0" aria-hidden />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="relative w-12 h-6 rounded-full overflow-hidden shrink-0 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-[var(--page-bg)] shadow-inner"
    >
      {/* Two halves: light image left, dark image right */}
      <div className="absolute inset-0 flex">
        <div
          className="w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${LIGHT_IMAGE})` }}
        />
        <div
          className="w-1/2 h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${DARK_IMAGE})` }}
        />
      </div>
      {/* Theme-aware overlay: darker in light mode (pill reads dark), grayscale in dark (black/white) */}
      <div
        className={`absolute inset-0 ${isDark ? "bg-black/20 grayscale" : "bg-black/35"}`}
        aria-hidden
      />
      {/* Sliding thumb: black in light mode, white in dark mode */}
      <motion.span
        className={`absolute top-0.5 bottom-0.5 w-5 rounded-full shadow-md border ${
          isDark
            ? "bg-white border-white/60"
            : "bg-jet-black-900 border-jet-black-700"
        }`}
        initial={false}
        animate={{ left: isDark ? "calc(100% - 24px)" : "4px" }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </button>
  );
}
