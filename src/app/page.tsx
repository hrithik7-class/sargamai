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
        <div className="absolute inset-0 z-0 overflow-hidden bg-jet-black" aria-hidden="true">
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

        {/* Hero content - sits in flow */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full min-w-0"
        >
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center max-w-3xl mx-auto w-full">
            <div className="w-full flex flex-col items-center">
              {/* Badge */}
              <motion.div variants={itemVariants} className="mb-2 flex justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-full bg-pale-sky-700 border border-pale-sky-400 text-teal text-xs sm:text-sm font-semibold shadow-sm max-w-[calc(100vw-1.5rem)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
                  </span>
                  AI-Powered Lyrics Generator
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div variants={itemVariants} className="text-center w-full min-w-0">
                <h1 className="text-2xl min-[400px]:text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-jet-black font-heading text-center">
                  <span className="text-teal">
                    Transform Your Ideas
                  </span>
                  <br />
                  <span className="text-jet-black">
                    Into{" "}
                    <span className="relative inline-flex min-w-[120px] sm:min-w-[180px] pb-1">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentWordIndex}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.3 }}
                          className="text-teal"
                        >
                          {rotatingWords[currentWordIndex]}
                        </motion.span>
                      </AnimatePresence>
                      <motion.span
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-teal"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      />
                    </span>
                  </span>
                </h1>
              </motion.div>

              {/* Subheading */}
              <motion.p variants={itemVariants} className="text-base sm:text-xl text-jet-black-600 max-w-xl mx-auto mb-6 sm:mb-10 leading-relaxed text-center px-1 min-w-0">
                Describe your mood, story, or feeling in plain words. 
                <span className="text-teal font-semibold"> SargamAI</span> crafts 
                meaningful lyrics that touch hearts.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-6 sm:mb-10 w-full max-w-[min(100%,320px)] sm:max-w-none">
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

              {/* Stats */}
              <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 sm:gap-8 max-w-md mx-auto">
                {[
                  { value: "50K+", label: "Songs Created" },
                  { value: "100+", label: "Genres" },
                  { value: "4.9", label: "User Rating" },
                ].map((stat, index) => (
                  <div key={index} className="text-center min-w-0">
                    <div className="text-2xl sm:text-4xl font-bold text-teal truncate">{stat.value}</div>
                    <div className="text-neutral-300 text-xs sm:text-sm truncate">{stat.label}</div>
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
      <section id="features" className="relative z-10 py-16 sm:py-32 bg-gradient-to-b from-neutral-500 via-pale-sky-900 to-neutral-500 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl min-[400px]:text-3xl font-bold mb-3 sm:mb-4 text-jet-black font-heading">
              <span className="text-teal">
                Powerful Features
              </span>
            </h2>
            <p className="text-jet-black-600 text-sm sm:text-lg max-w-2xl mx-auto">
              Everything you need to create professional lyrics that resonate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-8 min-w-0">
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
