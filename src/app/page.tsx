"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import FeatureCard from "@/components/FeatureCard";
import DashboardPreview from "@/components/DashboardPreview";
import HowItWorks from "@/components/HowItWorks";
import CompanyTicker from "@/components/CompanyTicker";
import Testimonials from "@/components/Testimonials";
import { Zap, Settings, RefreshCw, ArrowRight, Play, ChevronRight, Music, MessageSquare, Sparkles, CheckCircle } from "lucide-react";

const rotatingWords = ["lyrics", "music", "singing", "composing", "playing"];

export default function HomePage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const userHasUnmutedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Pause video when hero scrolls out of view, play when back in view
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) {
          video.pause();
          video.muted = true;
        } else {
          video.play().catch(() => {});
          if (userHasUnmutedRef.current) video.muted = false;
        }
      },
      { threshold: 0.25, rootMargin: "0px" }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Enable video audio on first user interaction (browsers block autoplay with sound)
  useEffect(() => {
    const enableVideoAudio = () => {
      const video = videoRef.current;
      if (video) {
        userHasUnmutedRef.current = true;
        video.muted = false;
        video.play().catch(() => {});
      }
      document.removeEventListener("click", enableVideoAudio);
      document.removeEventListener("touchstart", enableVideoAudio);
      document.removeEventListener("keydown", enableVideoAudio);
    };
    document.addEventListener("click", enableVideoAudio, { once: true });
    document.addEventListener("touchstart", enableVideoAudio, { once: true });
    document.addEventListener("keydown", enableVideoAudio, { once: true });
    return () => {
      document.removeEventListener("click", enableVideoAudio);
      document.removeEventListener("touchstart", enableVideoAudio);
      document.removeEventListener("keydown", enableVideoAudio);
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden min-w-0">
      {/* Hero Section - video fills viewport on mobile, no white gap */}
      <section
        ref={heroRef}
        className="relative min-h-screen min-h-[100dvh] flex items-center overflow-hidden pt-20 pb-24"
      >
        {/* Full-viewport video layer - dark fallback, video covers full area on mobile */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-lavender-900" aria-hidden="true">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 object-cover w-[max(100vw,100vh)] h-[max(100vw,100vh)] min-w-[max(100vw,100vh)] min-h-[max(100vw,100vh)]"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Floating musical symbols - fill left/right corners, do not affect text */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Left side */}
          {[
            { char: "♪", top: "18%", left: "8%", size: "text-2xl", delay: 0 },
            { char: "♫", top: "35%", left: "4%", size: "text-xl", delay: 0.4 },
            { char: "♭", top: "55%", left: "10%", size: "text-3xl", delay: 0.8 },
            { char: "♯", top: "72%", left: "6%", size: "text-xl", delay: 0.2 },
            { char: "♪", top: "85%", left: "12%", size: "text-lg", delay: 0.6 },
            { char: "♬", top: "42%", left: "2%", size: "text-lg", delay: 1 },
          ].map((item, i) => (
            <motion.span
              key={`left-${i}`}
              className={`absolute text-teal/20 font-serif ${item.size}`}
              style={{ top: item.top, left: item.left }}
              animate={{ y: [0, -12, 0], opacity: [0.15, 0.3, 0.15] }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              {item.char}
            </motion.span>
          ))}
          {/* Right side */}
          {[
            { char: "♯", top: "22%", right: "8%", size: "text-xl", delay: 0.3 },
            { char: "♫", top: "38%", right: "5%", size: "text-2xl", delay: 0.7 },
            { char: "♪", top: "58%", right: "10%", size: "text-3xl", delay: 0.1 },
            { char: "♭", top: "75%", right: "6%", size: "text-xl", delay: 0.5 },
            { char: "♬", top: "88%", right: "11%", size: "text-lg", delay: 0.9 },
            { char: "♪", top: "48%", right: "3%", size: "text-lg", delay: 0.2 },
          ].map((item, i) => (
            <motion.span
              key={`right-${i}`}
              className={`absolute text-teal/20 font-serif ${item.size}`}
              style={{ top: item.top, right: item.right }}
              animate={{ y: [0, 10, 0], opacity: [0.2, 0.35, 0.2] }}
              transition={{
                duration: 3.5 + i * 0.6,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              {item.char}
            </motion.span>
          ))}
        </div>

        {/* Hero content - centered, clear hierarchy, SaaS-style alignment */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-w-0"
        >
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-8 sm:py-12">
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center">
              {/* Badge - compact, clear */}
              <motion.div variants={itemVariants} className="mb-5 sm:mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-teal-200/90 border border-teal-400/80 text-teal text-xs sm:text-sm font-semibold shadow-sm backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-600 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal" />
                  </span>
                  AI-Powered Lyrics Generator
                </div>
              </motion.div>

              {/* Main Heading - balanced line breaks, comfortable reading width */}
              <motion.div variants={itemVariants} className="w-full mb-5 sm:mb-6">
                <h1 className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] sm:leading-[1.12] text-jet-black font-heading tracking-tight">
                  <span className="block text-teal">Transform Your Ideas</span>
                  <span className="block mt-1 sm:mt-1.5 text-jet-black">
                    Into{" "}
                    <span className="relative inline-flex justify-center min-w-[140px] sm:min-w-[200px] pb-1 text-teal">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentWordIndex}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.3 }}
                          className="inline-block"
                        >
                          {rotatingWords[currentWordIndex]}
                        </motion.span>
                      </AnimatePresence>
                      <motion.span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.25, duration: 0.3 }}
                      />
                    </span>
                  </span>
                </h1>
              </motion.div>

              {/* Subheading - optimal line length, relaxed leading */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg lg:text-xl text-jet-black-600 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed sm:leading-loose"
              >
                Describe your mood, story, or feeling in plain words.{" "}
                <span className="text-teal font-semibold">SargamAI</span> crafts meaningful
                lyrics that touch hearts.
              </motion.p>

              {/* CTA Buttons - clear primary/secondary hierarchy */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto mb-10 sm:mb-12">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link
                    href="/get-started"
                    className="group relative w-full sm:w-auto inline-flex justify-center items-center px-6 sm:px-10 py-4 sm:py-5 rounded-2xl bg-teal text-white font-bold text-base sm:text-lg shadow-lg shadow-teal-800/30 overflow-hidden gap-2 hover:bg-teal-600 transition-colors"
                  >
                    <span className="relative flex items-center gap-2">
                      Start Creating Free
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link
                    href="/logic"
                    className="group w-full sm:w-auto inline-flex justify-center items-center px-6 sm:px-10 py-4 sm:py-5 rounded-2xl bg-neutral-500 border-2 border-pale-sky-400 text-teal font-bold text-base sm:text-lg hover:border-teal hover:shadow-lg transition-all duration-300 gap-2"
                  >
                    <span className="w-8 h-8 rounded-full bg-teal flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </span>
                    Try Demo
                  </Link>
                </motion.div>
              </motion.div>

              {/* Stats - social proof, clear separation from CTAs */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-3 gap-6 sm:gap-10 max-w-md mx-auto pt-2 border-t border-lavender-600/50"
              >
                {[
                  { value: "50K+", label: "Songs Created" },
                  { value: "100+", label: "Genres" },
                  { value: "4.9", label: "User Rating" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl sm:text-4xl font-bold text-teal tabular-nums">{stat.value}</div>
                    <div className="text-neutral-300 text-xs sm:text-sm mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-teal-800 flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-teal" />
          </motion.div>
        </motion.div>

        {/* Company Ticker - Inside Hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <CompanyTicker />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 sm:py-36 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-500 via-pale-sky-900 to-neutral-500" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 50% 30%, var(--color-teal) 1px, transparent 1px)", backgroundSize: "24px 24px" }} aria-hidden />
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2" aria-hidden />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-teal-700/10 rounded-full blur-3xl translate-x-1/3" aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-12 sm:mb-20"
          >
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="inline-block px-3 py-1.5 rounded-full bg-teal-900/20 border border-teal-800/40 text-teal text-xs font-semibold uppercase tracking-wider mb-4"
            >
              Why SargamAI
            </motion.span>
            <h2 className="text-2xl sm:text-4xl min-[400px]:text-3xl font-bold mb-4 sm:mb-5 text-jet-black font-heading">
              <span className="text-teal">Powerful Features</span>
            </h2>
            <p className="text-jet-black-600 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need to create professional lyrics that resonate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 min-w-0">
            <FeatureCard
              title="Instant Generation"
              description="Get unique, meaningful lyrics in seconds. Just describe your idea and watch the magic happen."
              icon={Zap}
              gradient="from-teal to-teal-700"
              chart={true}
              chartData={[
                { label: 'Jan', value: 30 },
                { label: 'Feb', value: 45 },
                { label: 'Mar', value: 60 },
                { label: 'Apr', value: 55 },
                { label: 'May', value: 80 },
                { label: 'Jun', value: 95 },
              ]}
              delay={0}
            />
            <FeatureCard
              title="50+ Genres"
              description="From pop to rock, hip-hop to country. Every genre has its unique voice and style."
              icon={Music}
              gradient="from-teal-600 to-teal"
              chart={true}
              chartData={[
                { label: 'Jan', value: 40 },
                { label: 'Feb', value: 55 },
                { label: 'Mar', value: 70 },
                { label: 'Apr', value: 65 },
                { label: 'May', value: 85 },
                { label: 'Jun', value: 90 },
              ]}
              delay={0.1}
            />
            <FeatureCard
              title="Smart Editing"
              description="Refine and customize your lyrics with simple prompts. Make it truly yours with AI assistance."
              icon={Settings}
              gradient="from-teal-500 to-teal-600"
              chart={true}
              chartData={[
                { label: 'Jan', value: 35 },
                { label: 'Feb', value: 50 },
                { label: 'Mar', value: 65 },
                { label: 'Apr', value: 75 },
                { label: 'May', value: 70 },
                { label: 'Jun', value: 85 },
              ]}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <DashboardPreview />

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials Section */}
      <Testimonials />
      
    </div>
  );
}
