"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  chart?: boolean;
  chartData?: { label: string; value: number }[];
  delay?: number;
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  gradient,
  chart,
  chartData,
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-full"
    >
      <motion.div
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="h-full bg-neutral-500 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-sm border border-lavender-600 hover:border-teal-800/50 hover:shadow-xl hover:shadow-teal-900/10 transition-all duration-300 min-w-0 flex flex-col group"
      >
        {/* Icon with glow on hover */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={cn(
            "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.25rem] bg-gradient-to-br flex items-center justify-center mb-5 sm:mb-6 text-white shadow-lg shrink-0 ring-2 ring-white/10 group-hover:ring-teal-400/30 transition-all duration-300",
            gradient
          )}
        >
          <Icon className="w-7 h-7 sm:w-8 sm:h-8" strokeWidth={2} />
        </motion.div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-jet-black mb-2 sm:mb-3 font-heading group-hover:text-teal-800 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-jet-black-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-5 flex-1">
          {description}
        </p>

        {/* Mini Analytics Chart */}
        {chart && chartData && (
          <div className="mt-auto pt-4 sm:pt-5 border-t border-lavender-600/80 group-hover:border-teal-800/30 transition-colors min-w-0">
            <p className="text-[10px] sm:text-xs text-neutral-300 uppercase tracking-wider mb-2.5 font-medium">
              Usage trend
            </p>
            <div className="flex items-end gap-1 sm:gap-1.5 h-14 sm:h-20">
              {chartData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${item.value}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: delay + index * 0.06, duration: 0.6, ease: "easeOut" }}
                  className={cn(
                    "flex-1 rounded-t-md min-h-[6px]",
                    index === chartData.length - 1
                      ? "bg-gradient-to-t from-teal to-teal-600"
                      : "bg-gradient-to-t from-teal-800/90 to-teal-900/90"
                  )}
                  style={{ height: `${item.value}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-neutral-300">
              {chartData.map((item) => (
                <span key={item.label}>{item.label}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
