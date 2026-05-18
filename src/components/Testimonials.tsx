"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  image: string;
  comment: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Music Producer",
    company: "Studio 92 Productions",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    comment:
      "SargamAI has completely transformed our songwriting workflow. The AI generates studio-quality lyrics that actually make sense and sound professional. Like having a world-class co-writer available 24/7.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Platinum Artist",
    company: "Independent",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    comment:
      "After using SargamAI for 6 months, I've landed 3 record deals. The lyrics are incredibly meaningful and emotionally resonant. A genuine game-changer for independent artists.",
    rating: 5,
  },
  {
    id: 3,
    name: "Priya Sharma",
    role: "Music Director",
    company: "Bollywood Studios",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    comment:
      "SargamAI delivers lyrics that feel authentic and versatile across genres. Our team uses it daily for cross-genre projects. The quality consistency is what sets it apart.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.14, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Testimonials() {
  return (
    <section className="relative z-10 py-24 sm:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--page-bg)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-teal) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] -translate-y-1/4 translate-x-1/4 pointer-events-none"
        style={{ background: "rgba(0,212,255,0.04)" }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 sm:mb-24"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold uppercase tracking-widest mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
            Testimonials
          </motion.span>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-jet-black leading-[1.1] tracking-tight mb-5">
            Loved by creators<br />
            <span className="text-teal">worldwide.</span>
          </h2>

          <p className="text-jet-black-600 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            From bedroom producers to platinum artists — SargamAI is the unfair advantage.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-lavender-600/30 hover:border-teal/20 bg-gradient-to-br from-lavender-800 to-lavender-700 p-7 sm:p-8 flex flex-col gap-5 hover:shadow-[0_0_50px_rgba(0,212,255,0.06)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal/4 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div
                className="absolute top-5 right-6 text-7xl font-serif leading-none select-none pointer-events-none group-hover:opacity-20 opacity-10 transition-opacity duration-500 text-teal"
                aria-hidden
              >
                &ldquo;
              </div>

              <div className="flex items-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-teal text-teal" strokeWidth={0} />
                ))}
              </div>

              <p className="text-jet-black-600 text-sm sm:text-base leading-relaxed flex-1 relative">
                {t.comment}
              </p>

              <div className="flex items-center gap-3 pt-5 border-t border-lavender-600/30 group-hover:border-teal/10 transition-colors duration-500">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-lavender-600/40 group-hover:border-teal/30 transition-colors duration-300 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-jet-black text-sm truncate">{t.name}</p>
                  <p className="text-jet-black-600 text-xs truncate">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { value: "50K+", label: "Songs created" },
            { value: "4.9 / 5", label: "Average rating" },
            { value: "98%", label: "Would recommend" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl sm:text-4xl font-bold font-heading text-jet-black tabular-nums">
                {item.value}
              </span>
              <span className="text-jet-black-600 text-sm">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
