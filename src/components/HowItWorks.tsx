"use client";

import { motion } from "framer-motion";
import { MessageSquare, Sparkles, Download } from "lucide-react";

const steps = [
  {
    number: "01",
    label: "Describe your idea",
    description:
      "Share your mood, story, or feeling in plain words. Our AI understands nuance — the difference between heartbreak at midnight and hopeful longing at dawn.",
    icon: MessageSquare,
    detail: "Natural language input",
  },
  {
    number: "02",
    label: "Generate lyrics",
    description:
      "Receive full, structured lyrics in under 3 seconds. Verse, chorus, bridge — complete song architecture tailored to your genre and mood.",
    icon: Sparkles,
    detail: "< 3 seconds per generation",
  },
  {
    number: "03",
    label: "Edit & export",
    description:
      "Refine any section with natural language prompts. When it's perfect, export as PDF, plain text, or copy directly to your creative workflow.",
    icon: Download,
    detail: "Multiple export formats",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.05 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HowItWorks() {
  return (
    <section className="relative z-10 py-24 sm:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--page-bg)]" />
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-teal) 1px, transparent 1px), linear-gradient(90deg, var(--color-teal) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: "rgba(0,212,255,0.03)" }}
        aria-hidden
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 sm:mb-24 max-w-xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold uppercase tracking-widest mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            How it works
          </motion.span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-jet-black leading-[1.1] tracking-tight mb-5">
            Simple.<br />
            <span className="text-teal">Powerful.</span>
          </h2>

          <p className="text-jet-black-600 text-base sm:text-lg leading-relaxed">
            Three steps from a blank page to polished, emotion-driven lyrics.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="relative"
        >
          <div
            className="hidden lg:block absolute left-[1.75rem] top-10 bottom-10 w-px pointer-events-none"
            style={{ background: "linear-gradient(to bottom, rgba(0,212,255,0.4), rgba(0,212,255,0.15), transparent)" }}
            aria-hidden
          />

          <div className="space-y-5 sm:space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                variants={rowVariants}
                className="group relative flex gap-6 sm:gap-10 items-start rounded-2xl sm:rounded-3xl border border-lavender-600/30 bg-gradient-to-br from-lavender-800 to-lavender-700 p-6 sm:p-8 lg:p-10 hover:border-teal/20 hover:shadow-[0_0_50px_rgba(0,212,255,0.05)] transition-all duration-500"
              >
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full border border-teal/20 bg-teal/5 group-hover:bg-teal/10 group-hover:border-teal/40 transition-all duration-300 flex items-center justify-center">
                    <span className="font-heading font-bold text-lg text-teal tabular-nums leading-none">
                      {step.number}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className="lg:hidden absolute left-1/2 -translate-x-1/2 top-full mt-1 w-px h-5"
                      style={{ background: "linear-gradient(to bottom, rgba(0,212,255,0.3), transparent)" }}
                      aria-hidden
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center gap-3 mb-3">
                    <step.icon className="w-4 h-4 text-teal shrink-0" strokeWidth={1.5} />
                    <h3 className="text-lg sm:text-xl font-bold font-heading text-jet-black">
                      {step.label}
                    </h3>
                  </div>

                  <p className="text-jet-black-600 text-sm sm:text-base leading-relaxed mb-4 max-w-lg">
                    {step.description}
                  </p>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal/8 border border-teal/15 text-teal text-xs font-medium">
                    <span className="w-1 h-1 rounded-full bg-teal" />
                    {step.detail}
                  </span>
                </div>

                <div className="absolute right-0 top-8 bottom-8 w-[2px] rounded-full bg-teal opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
