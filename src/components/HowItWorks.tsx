"use client";

import { motion } from "framer-motion";

const steps = [
  {
    label: "Describe your idea",
    description: "Share your mood, story, or feeling in plain words. Our AI understands nuance and captures the emotion behind your words.",
    illustration: "describe",
  },
  {
    label: "Generate lyrics",
    description: "Get unique, meaningful lyrics powered by advanced AI. No generic lines—every output is tailored to your input.",
    illustration: "generate",
  },
  {
    label: "Edit & export",
    description: "Refine with simple prompts, then export. Your lyrics are ready for music-making or sharing.",
    illustration: "perfect",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/* Step 1: Single card, dark header + teal square, gray/teal content lines. Dotted circle partially around top-left. */
function IllustrateDescribe() {
  return (
    <div className="relative w-full max-w-[180px] mx-auto">
      <div className="absolute -top-2 -left-2 w-24 h-24 rounded-full border-2 border-dashed border-teal-500 opacity-90 pointer-events-none" aria-hidden />
      <div className="relative bg-white rounded-md shadow-md border border-lavender-600 overflow-hidden">
        <div className="h-7 bg-jet-black flex items-center pl-2">
          <div className="w-2 h-2 rounded-sm bg-teal shrink-0" />
        </div>
        <div className="p-2.5 space-y-1.5">
          <div className="h-1.5 bg-lavender-600 rounded w-full" />
          <div className="h-1.5 bg-lavender-600 rounded w-[85%]" />
          <div className="h-1.5 bg-teal-300 rounded w-[70%]" />
          <div className="h-1.5 bg-lavender-600 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

/* Step 2: Three overlapping cards, staggered. Each: teal square left, prominent teal bar on RIGHT. */
function IllustrateGenerate() {
  return (
    <div className="relative w-full max-w-[200px] mx-auto flex justify-center items-end">
      <div className="absolute w-[72%] left-[8%] bottom-0 rounded-md shadow border border-lavender-600 bg-white overflow-hidden transform -rotate-3">
        <div className="h-5 bg-jet-black flex items-center pl-1.5">
          <div className="w-1.5 h-1.5 rounded-sm bg-teal shrink-0" />
        </div>
        <div className="p-1.5 flex items-center justify-between gap-1">
          <div className="flex-1 space-y-1">
            <div className="h-1 bg-lavender-600 rounded w-full" />
            <div className="h-1 bg-lavender-600 rounded w-4/5" />
          </div>
          <div className="w-3 h-6 bg-teal rounded-sm shrink-0" />
        </div>
      </div>
      <div className="absolute w-[72%] left-[18%] bottom-1 rounded-md shadow-md border border-lavender-600 bg-white overflow-hidden transform rotate-1 z-10">
        <div className="h-5 bg-jet-black flex items-center pl-1.5">
          <div className="w-1.5 h-1.5 rounded-sm bg-teal shrink-0" />
        </div>
        <div className="p-1.5 flex items-center justify-between gap-1">
          <div className="flex-1 space-y-1">
            <div className="h-1 bg-lavender-600 rounded w-full" />
            <div className="h-1 bg-lavender-600 rounded w-4/5" />
          </div>
          <div className="w-3 h-6 bg-teal rounded-sm shrink-0" />
        </div>
      </div>
      <div className="relative w-[72%] rounded-md shadow-lg border border-lavender-600 bg-white overflow-hidden transform rotate-2 z-20">
        <div className="h-5 bg-jet-black flex items-center pl-1.5">
          <div className="w-1.5 h-1.5 rounded-sm bg-teal shrink-0" />
        </div>
        <div className="p-1.5 flex items-center justify-between gap-1">
          <div className="flex-1 space-y-1">
            <div className="h-1 bg-lavender-600 rounded w-full" />
            <div className="h-1 bg-lavender-600 rounded w-4/5" />
          </div>
          <div className="w-3 h-6 bg-teal rounded-sm shrink-0" />
        </div>
      </div>
    </div>
  );
}

/* Step 3: Three overlapping cards. Center card: teal bar graph (4 bars), teal line, checkmark circle top-right. */
function IllustratePerfect() {
  return (
    <div className="relative w-full max-w-[200px] mx-auto flex justify-center items-end">
      <div className="absolute w-[60%] left-[18%] bottom-0 rounded-md shadow border border-lavender-600 bg-white overflow-hidden transform -rotate-2">
        <div className="h-5 bg-jet-black/90 flex items-center pl-1.5" />
        <div className="p-1.5 space-y-1">
          <div className="h-1 bg-lavender-600 rounded w-full" />
          <div className="h-1 bg-lavender-600 rounded w-3/4" />
        </div>
      </div>
      <div className="absolute w-[60%] left-[22%] bottom-1 rounded-md shadow border border-lavender-600 bg-white overflow-hidden transform rotate-1">
        <div className="h-5 bg-jet-black/90 flex items-center pl-1.5" />
        <div className="p-1.5 space-y-1">
          <div className="h-1 bg-lavender-600 rounded w-4/5" />
          <div className="h-1 bg-lavender-600 rounded w-2/3" />
        </div>
      </div>
      <div className="relative w-[70%] rounded-md shadow-lg border border-lavender-600 bg-white overflow-hidden z-20">
        <div className="h-6 bg-jet-black flex items-center justify-between pl-2 pr-1.5">
          <div className="w-2 h-2 rounded-sm bg-teal shrink-0" />
          <div className="w-5 h-5 rounded-full bg-teal flex items-center justify-center shrink-0">
            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div className="p-2 space-y-1.5">
          <div className="flex items-end gap-0.5 h-6">
            <div className="w-2 bg-teal rounded-t flex-1 self-end" style={{ height: "40%" }} />
            <div className="w-2 bg-teal rounded-t flex-1 self-end" style={{ height: "65%" }} />
            <div className="w-2 bg-teal rounded-t flex-1 self-end" style={{ height: "85%" }} />
            <div className="w-2 bg-teal rounded-t flex-1 self-end" style={{ height: "100%" }} />
          </div>
          <div className="h-1 bg-teal-300 rounded w-full" />
          <div className="h-1 bg-lavender-600 rounded w-full" />
          <div className="h-1 bg-lavender-600 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}

function StepIllustration({ type }: { type: string }) {
  if (type === "describe") return <IllustrateDescribe />;
  if (type === "generate") return <IllustrateGenerate />;
  if (type === "perfect") return <IllustratePerfect />;
  return null;
}

export default function HowItWorks() {
  return (
    <section className="relative z-10 py-12 sm:py-24 lg:py-32 bg-neutral-500 overflow-hidden min-w-0">
      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
        {/* Header: thin accent line, title, 2-line description (like reference) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14 lg:mb-16"
        >
          <div className="w-10 h-0.5 bg-teal rounded-full mx-auto mb-4 sm:mb-5" aria-hidden />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-jet-black font-heading mb-2 sm:mb-3">
            How it works
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm lg:text-base max-w-xl mx-auto leading-relaxed px-1">
            Describe your mood or story in plain words. Our AI turns it into song-ready lyrics—then you edit and export.
          </p>
        </motion.div>

        {/* Flow: SVG dashed path (circle around step 1 + curves with arrowheads) + 3 steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          className="relative pt-4"
        >
          {/* SVG: dashed path with arrowheads - circle around first, then curves to step 2 and 3 */}
          <svg
            className="hidden lg:block absolute inset-0 w-full h-[180px] pointer-events-none"
            viewBox="0 0 1000 180"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <marker id="arrow-teal" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="var(--color-teal)" />
              </marker>
              <marker id="arrow-teal-2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="var(--color-teal)" />
              </marker>
            </defs>
            {/* Circle around first step (left column center) */}
            <circle
              cx="165"
              cy="88"
              r="52"
              fill="none"
              stroke="var(--color-teal)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            {/* Curve from step 1 to step 2 */}
            <path
              d="M 218 88 C 320 88 400 88 500 88"
              fill="none"
              stroke="var(--color-teal)"
              strokeWidth="2"
              strokeDasharray="6 4"
              markerEnd="url(#arrow-teal)"
            />
            {/* Curve from step 2 to step 3 */}
            <path
              d="M 500 88 C 600 88 700 88 835 88"
              fill="none"
              stroke="var(--color-teal)"
              strokeWidth="2"
              strokeDasharray="6 4"
              markerEnd="url(#arrow-teal-2)"
            />
          </svg>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-6 relative z-10 min-w-0">
            {steps.map((step) => (
              <motion.div
                key={step.label}
                variants={itemVariants}
                className="flex flex-col items-center text-center min-w-0"
              >
                <div className="flex justify-center mb-4 min-h-[80px] sm:min-h-[100px] lg:min-h-[140px] w-full">
                  <StepIllustration type={step.illustration} />
                </div>
                <h3 className="text-sm font-semibold text-jet-black font-heading mb-2">
                  {step.label}
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed max-w-[260px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
