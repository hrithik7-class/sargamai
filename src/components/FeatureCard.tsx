"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  variant: "hero" | "tall" | "small";
  delay?: number;
  stat?: string;
  statLabel?: string;
  chartData?: { label: string; value: number }[];
  genres?: string[];
}

const motionBase = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
});

const cardShell =
  "group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-lavender-600/30 hover:border-teal/20 bg-gradient-to-br from-lavender-800 to-lavender-700 transition-all duration-500 hover:shadow-[0_0_60px_rgba(0,212,255,0.06)]";

const hoverGlow = (
  <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
);

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  variant,
  delay = 0,
  stat,
  statLabel,
  chartData,
  genres,
}: FeatureCardProps) {
  if (variant === "hero") {
    return (
      <motion.div
        {...motionBase(delay)}
        className={cn(cardShell, "lg:col-span-2 p-7 sm:p-10")}
      >
        {hoverGlow}

        <div className="flex items-start justify-between mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0 group-hover:bg-teal/15 transition-colors duration-300">
            <Icon className="w-7 h-7 text-teal" strokeWidth={1.5} />
          </div>

          {stat && (
            <div className="text-right">
              <div className="text-4xl sm:text-5xl font-bold font-heading text-jet-black tabular-nums">
                {stat}
              </div>
              <div className="text-xs text-jet-black-600 uppercase tracking-widest mt-1">
                {statLabel}
              </div>
            </div>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold font-heading text-jet-black mb-3 leading-tight">
          {title}
        </h3>
        <p className="text-jet-black-600 text-sm sm:text-base leading-relaxed max-w-lg mb-10">
          {description}
        </p>

        {chartData && (
          <div>
            <p className="text-[10px] text-jet-black-600 uppercase tracking-widest mb-3 font-medium">
              Usage trend — last 6 months
            </p>
            <div className="flex items-end gap-2 h-20 sm:h-28">
              {chartData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1.5">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${item.value}%` }}
                    viewport={{ once: true }}
                    transition={{
                      delay: delay + index * 0.07,
                      duration: 0.7,
                      ease: "easeOut",
                    }}
                    className={cn(
                      "w-full rounded-t-lg",
                      index === chartData.length - 1
                        ? "bg-teal shadow-[0_-4px_20px_rgba(0,212,255,0.3)]"
                        : "bg-teal/20"
                    )}
                    style={{ height: `${item.value}%` }}
                  />
                  <span className="text-[9px] text-jet-black-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  if (variant === "tall") {
    return (
      <motion.div
        {...motionBase(delay)}
        className={cn(cardShell, "lg:row-span-2 p-7 sm:p-8 flex flex-col")}
      >
        {hoverGlow}

        <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-6 group-hover:bg-teal/15 transition-colors duration-300 shrink-0">
          <Icon className="w-6 h-6 text-teal" strokeWidth={1.5} />
        </div>

        <h3 className="text-xl sm:text-2xl font-bold font-heading text-jet-black mb-3">
          {title}
        </h3>
        <p className="text-jet-black-600 text-sm leading-relaxed mb-8">
          {description}
        </p>

        {genres && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {genres.map((genre, i) => (
              <motion.span
                key={genre}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: delay + i * 0.05, duration: 0.35 }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200",
                  i === 0
                    ? "bg-teal text-lavender-900 border-teal"
                    : "bg-teal/10 text-teal border-teal/20 hover:bg-teal/20"
                )}
              >
                {genre}
              </motion.span>
            ))}
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-lavender-600/30 text-jet-black-600 border border-lavender-600/20">
              +42 more
            </span>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      {...motionBase(delay)}
      className={cn(cardShell, "p-6 sm:p-7")}
    >
      {hoverGlow}

      <div className="w-11 h-11 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mb-5 group-hover:bg-teal/15 transition-colors duration-300">
        <Icon className="w-5 h-5 text-teal" strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-bold font-heading text-jet-black mb-2">
        {title}
      </h3>
      <p className="text-jet-black-600 text-sm leading-relaxed">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-1.5 text-teal text-xs font-semibold opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
        <span>Learn more</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 6h10M7 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </motion.div>
  );
}
