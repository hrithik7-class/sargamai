"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";
import { useThemeTransition } from "@/components/ThemeTransitionContext";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const themeTransition = useThemeTransition();
  const setThemeFn = themeTransition?.setThemeWithTransition ?? setTheme;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) {
    return (
      <div className="w-[72px] h-9 rounded-lg bg-lavender-600/50 animate-pulse shrink-0" aria-hidden />
    );
  }

  return (
    <div className={cn("relative flex rounded-lg border border-lavender-600 bg-lavender-700 p-1 shrink-0", className)}>
      <button
        type="button"
        onClick={() => setThemeFn("light")}
        aria-label="Switch to light theme"
        className={`relative z-10 flex items-center justify-center w-9 h-7 rounded-md transition-colors ${
          !isDark ? "text-white" : "text-neutral-400 hover:text-jet-black"
        }`}
      >
        <Sun className="w-4 h-4" strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={() => setThemeFn("dark")}
        aria-label="Switch to dark theme"
        className={`relative z-10 flex items-center justify-center w-9 h-7 rounded-md transition-colors ${
          isDark ? "text-white" : "text-neutral-400 hover:text-jet-black"
        }`}
      >
        <Moon className="w-4 h-4" strokeWidth={1.5} />
      </button>
      <motion.div
        layout
        className="absolute top-1 bottom-1 w-9 rounded-md bg-teal"
        initial={false}
        animate={{
          left: isDark ? "calc(100% - 40px)" : "4px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  );
}
