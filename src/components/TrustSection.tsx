"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Star, Play, ArrowRight } from "lucide-react";

// Generate random positions once
const particlePositions = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${5 + (i * 4.5)}%`,
  top: `${10 + (i * 4)}%`,
  delay: i * 0.2,
}));

export default function TrustSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Glow pulse
      gsap.to(".glow-pulse", {
        opacity: "random(0.3, 0.6)",
        scale: "random(0.95, 1.05)",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-jet-black-100">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-jet-black-200 via-jet-black-300 to-jet-black-100" />
      
      {/* Deep teal accent gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-teal-200/40 via-jet-black-300/50 to-jet-black-100 opacity-60" />
      
      {/* Animated glow orbs */}
      <div className="glow-pulse absolute top-1/4 left-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-[128px]" />
      <div className="glow-pulse absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-700/20 rounded-full blur-[128px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]" />
      
      {/* Floating particles */}
      {particlePositions.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + (particle.id * 0.2),
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Music wave lines */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-teal-600/20 to-transparent"
            animate={{
              scaleY: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Headline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] font-heading">
              No Creative Blocks.<br />
              <span className="bg-gradient-to-r from-teal-700 via-teal-400 to-teal-700 bg-[length:200%_auto] bg-clip-text text-transparent">
                Just Pure AI Music.
              </span>
            </h1>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Compose Smarter, Instantly
            </h2>
            
            <p className="text-pale-sky-500 text-lg mb-8 leading-relaxed max-w-lg">
              Join creators using AIMusic to generate studio-quality tracks in seconds — powered by advanced AI composition, smart genre blending, and real-time customization.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(31, 122, 140, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-teal to-teal-600 text-white font-semibold rounded-2xl flex items-center justify-center gap-2"
              >
                Start Creating Free
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                See How It Works
              </motion.button>
            </div>

            {/* Trust indicators with glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-flex flex-col gap-4"
            >
              {/* Avatars and trust text */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-jet-black-100 flex items-center justify-center text-white text-xs font-bold"
                      style={{
                        backgroundColor: ['#1f7a8c', '#2bacc5', '#59c5db', '#91d8e7', '#c8ecf3'][i],
                        zIndex: 5 - i
                      }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                    >
                      {String.fromCharCode(65 + i)}
                    </motion.div>
                  ))}
                </div>
                <span className="text-pale-sky-500 text-sm">Trusted by 10,000+ creators</span>
              </div>

              {/* Rating with glowing stars */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.2 }}
                    >
                      <Star
                        className="w-5 h-5 text-teal"
                        fill="currentColor"
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-white font-semibold">4.9/5</span>
                <span className="text-neutral-300 text-sm">rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-jet-black-100 to-transparent" />
    </section>
  );
}
