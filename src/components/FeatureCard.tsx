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
      <div className="bg-neutral-500 rounded-3xl p-6 shadow-sm border border-lavender-600 hover:shadow-lg transition-all duration-300 h-full">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 text-white shadow-lg`}>
          <Icon className="w-7 h-7" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-jet-black mb-3 font-heading">{title}</h3>
        
        {/* Description */}
        <p className="text-jet-black-600 leading-relaxed mb-4">{description}</p>

        {/* Mini Analytics Chart */}
        {chart && chartData && (
          <div className="mt-4 pt-4 border-t border-lavender-600">
            <div className="flex items-end gap-1 h-16">
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
            <div className="flex justify-between mt-2 text-xs text-neutral-300">
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
