"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
};

export default function GlassCard({ children, className = "", delay = 0, hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -5, scale: 1.01 } : undefined}
      className={`relative backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-xl ${className}`}
      style={{
        boxShadow: "0 8px 32px rgba(37, 99, 235, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
      }}
    >
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
}
