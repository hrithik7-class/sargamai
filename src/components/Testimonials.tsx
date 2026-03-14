"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

/** Single testimonial: portrait, quote, rating, and words to highlight in teal */
type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  image: string;
  comment: string;
  highlightWords: string[];
  rating: number;
};

// Testimonial data with image URLs (Unsplash portraits)
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Music Producer",
    company: "Studio 92 Productions",
    avatar: "SJ",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    comment: "SargamAI has completely transformed our songwriting workflow. The AI generates studio-quality lyrics that actually make sense and sound professional. It's like having a world-class co-writer available 24/7.",
    highlightWords: ["Thank you", "professional"],
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Platinum Artist",
    company: "Independent",
    avatar: "MC",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    comment: "After using SargamAI for 6 months, I've landed 3 record deals. The lyrics are incredibly meaningful and emotionally resonant. This is a game-changer for independent artists!",
    highlightWords: ["meaningful", "game-changer"],
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Content Director",
    company: "Viral Hits Media",
    avatar: "ED",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    comment: "We create 50+ videos weekly and SargamAI helps us generate unique lyrics in seconds. The quality is consistently outstanding and our engagement has increased by 340%.",
    highlightWords: ["outstanding", "340%"],
    rating: 5,
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Songwriter",
    company: "Harmony Records",
    avatar: "JW",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    comment: "I would like to say a big Thank you for your immense effort and support. In addition, I have a feeling that our further events are going to be Great as well, good luck to the team.",
    highlightWords: ["Thank you", "Great"],
    rating: 5,
  },
  {
    id: 5,
    name: "Priya Sharma",
    role: "Music Director",
    company: "Bollywood Studios",
    avatar: "PS",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    comment: "SargamAI delivers exactly what we need—lyrics that feel authentic and versatile across genres. Our team uses it daily. Highly recommend.",
    highlightWords: ["authentic", "Highly recommend"],
    rating: 5,
  },
];

const ROTATE_INTERVAL_MS = 5000; // 5 seconds — loop: 1→2→3→4→5→1…

/** Renders quote text with given phrases highlighted in teal (first occurrence of each). */
function QuoteWithHighlights({ text, highlightWords }: { text: string; highlightWords: string[] }) {
  let remaining = text;
  const parts: { str: string; highlight: boolean }[] = [];

  for (const word of highlightWords) {
    const idx = remaining.toLowerCase().indexOf(word.toLowerCase());
    if (idx === -1) continue;
    if (idx > 0) {
      parts.push({ str: remaining.slice(0, idx), highlight: false });
    }
    parts.push({ str: remaining.slice(idx, idx + word.length), highlight: true });
    remaining = remaining.slice(idx + word.length);
  }
  if (remaining) parts.push({ str: remaining, highlight: false });

  return (
    <p className="text-jet-black-600 leading-relaxed text-xs sm:text-sm">
      {parts.map((p, i) =>
        p.highlight ? (
          <span key={i} className="font-semibold text-teal">
            {p.str}
          </span>
        ) : (
          <span key={i}>{p.str}</span>
        )
      )}
    </p>
  );
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = testimonials.length;

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  // Auto-rotate every 4–5 seconds: first goes to last, second comes to first, loop
  useEffect(() => {
    const timer = setInterval(goNext, ROTATE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [goNext]);

  const current = testimonials[activeIndex];

  return (
    <section className="relative z-10 py-8 sm:py-14 bg-neutral-500 overflow-hidden min-w-0">
      {/* Background: dotted pattern top-right, soft lavender glow */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 right-0 w-40 h-40 sm:w-52 sm:h-52 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, var(--color-lavender-400) 1.5px, transparent 1.5px)`,
            backgroundSize: "10px 10px",
          }}
          aria-hidden
        />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-56 h-56 bg-lavender-700/50 rounded-full blur-3xl -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-48 bg-teal-900/20 rounded-full blur-3xl translate-x-1/3" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-jet-black font-heading mb-5 sm:mb-6 uppercase tracking-tight">
          What they say about us
        </h2>

        {/* Mobile: settled single-column — quote first, then avatar + name, stars, simple nav */}
        <div className="lg:hidden flex flex-col gap-5 min-w-0">
          <div className="rounded-2xl border border-lavender-600 bg-neutral-500 shadow-lg p-4 sm:p-5 min-h-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <QuoteWithHighlights
                  text={current.comment}
                  highlightWords={current.highlightWords}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 shrink-0 min-w-0"
              >
                <img
                  src={current.image}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border-2 border-lavender-400 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-jet-black text-sm truncate">{current.name}</p>
                  <p className="text-neutral-300 text-xs truncate">{current.role}, {current.company}</p>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-0.5 ml-auto shrink-0" aria-label={`${current.rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${star <= current.rating ? "fill-teal text-teal" : "fill-lavender-600 text-lavender-600"}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              className="w-10 h-10 rounded-full border-2 border-lavender-400 bg-neutral-500 text-neutral-300 hover:text-jet-black hover:border-teal flex items-center justify-center transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full border-2 border-teal text-jet-black text-sm font-medium">
              {activeIndex + 1} / {total}
            </span>
            <button
              type="button"
              onClick={goNext}
              className="w-10 h-10 rounded-full bg-teal text-white flex items-center justify-center hover:bg-teal-600 transition-colors shadow-md"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {/* Thumbnail strip on mobile — horizontal scroll, subtle */}
          <div className="flex justify-center gap-2 overflow-x-auto pb-1">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 rounded-full overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
                  i === activeIndex ? "w-9 h-9 border-teal ring-2 ring-teal/30" : "w-7 h-7 border-transparent opacity-60"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              >
                <img
                  src={t.image}
                  alt=""
                  className={`w-full h-full object-cover ${i === activeIndex ? "" : "grayscale"}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Desktop (lg): two-column — image left (full width of column), description + nav right */}
        <div className="hidden lg:flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch min-w-0">
          <div className="w-full lg:min-w-[240px] lg:max-w-[320px] lg:shrink-0 lg:self-start">
            <div className="rounded-xl border-2 border-lavender-400 bg-gradient-to-b from-lavender-700 to-neutral-500 p-1.5 sm:p-2 shadow-md overflow-hidden w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="rounded-lg overflow-hidden w-full"
                >
                  <div className="aspect-[3/4] w-full relative bg-lavender-600 rounded-lg overflow-hidden">
                    <img
                      src={current.image}
                      alt=""
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="pt-2 pb-0.5">
                    <p className="font-bold text-jet-black text-sm sm:text-base truncate">{current.name}</p>
                    <p className="text-neutral-300 text-[10px] sm:text-xs truncate">
                      {current.role}, {current.company}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-4 lg:min-h-[320px]">
            <div className="w-full rounded-xl border border-lavender-600 bg-neutral-500 shadow-lg p-3 sm:p-4 h-[120px] sm:h-[140px] overflow-y-auto shrink-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  <QuoteWithHighlights
                    text={current.comment}
                    highlightWords={current.highlightWords}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full border-2 border-teal text-jet-black text-xs font-medium shrink-0">
                  {activeIndex + 1}/{total}
                </span>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {testimonials.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={`shrink-0 rounded-lg overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 ${
                        i === activeIndex
                          ? "w-10 h-10 sm:w-11 sm:h-11 border-teal ring-2 ring-teal/30"
                          : "w-7 h-7 sm:w-8 sm:h-8 border-transparent opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    >
                      <img
                        src={t.image}
                        alt=""
                        className={`w-full h-full object-cover ${i === activeIndex ? "" : "grayscale"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={goPrev}
                  className="w-9 h-9 rounded-full border-2 border-lavender-400 bg-neutral-500 text-neutral-300 hover:text-jet-black hover:border-teal flex items-center justify-center transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center hover:bg-teal-600 transition-colors shadow-md"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-0.5" aria-label={`${current.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      star <= current.rating ? "fill-teal text-teal" : "fill-lavender-600 text-lavender-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
