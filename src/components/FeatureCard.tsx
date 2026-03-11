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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
    >
      <div className="bg-neutral-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-lavender-600 hover:shadow-lg transition-all duration-300 h-full min-w-0">
        {/* Icon */}
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 sm:mb-5 text-white shadow-lg shrink-0`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-jet-black mb-2 sm:mb-3 font-heading">{title}</h3>
        
        {/* Description */}
        <p className="text-jet-black-600 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">{description}</p>

        {/* Mini Analytics Chart */}
        {chart && chartData && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-lavender-600 min-w-0">
            <div className="flex items-end gap-0.5 sm:gap-1 h-12 sm:h-16">
              {chartData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${item.value}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: delay + index * 0.1, duration: 0.5 }}
                  className={cn(
                    "flex-1 rounded-t-md",
                    index === chartData.length - 1
                      ? "bg-gradient-to-t from-teal to-teal-700"
                      : "bg-gradient-to-t from-teal-800 to-teal-900"
                  )}
                  style={{ height: `${item.value}%`, minHeight: '4px' }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-neutral-300">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
