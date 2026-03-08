"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { MessageSquare, Sparkles, CheckCircle, ArrowRight, Lightbulb, Wand2, Zap } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Describe",
    subtitle: "Your Vision",
    desc: "Tell us your idea, feeling, or story in plain words. Our AI understands natural language and captures your emotion.",
    icon: Lightbulb,
    color: "from-jet-black-600 to-teal",
    accentColor: "#056c92"
  },
  {
    number: "02",
    title: "Generate",
    subtitle: "Magic Happens",
    desc: "AI creates unique, meaningful lyrics in seconds. Experience the power of advanced neural networks.",
    icon: Wand2,
    color: "from-teal to-teal-700",
    accentColor: "#2bacc5"
  },
  {
    number: "03",
    title: "Perfect",
    subtitle: "Your Masterpiece",
    desc: "Edit, refine, and export your masterpiece. Make it truly yours with smart editing tools.",
    icon: Zap,
    color: "from-teal-600 to-teal",
    accentColor: "#59c5db"
  }
];

const animatedWords = ["Describe", "Generate", "Perfect"];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<HTMLSpanElement[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate each word in the heading
      textRefs.current.forEach((word, i) => {
        if (!word) return;
        
        gsap.fromTo(word, 
          { 
            opacity: 0, 
            y: 30,
            rotationX: -90
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            delay: i * 0.15,
            ease: "back.out(1.7)"
          }
        );
      });

      // Animate the connecting line
      gsap.fromTo(lineRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.5,
          delay: 0.8,
          ease: "power2.inOut"
        }
      );

      // Floating animation for the whole section
      gsap.to(".how-it-works-float", {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      });

    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-40 bg-neutral-500 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-pale-sky-600/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-teal-900/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pale-sky-800 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Animated Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 text-blue-700 text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Simple Process</span>
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="block text-gray-600 text-3xl sm:text-4xl mb-4">How It Works</span>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {animatedWords.map((word, index) => (
                <span
                  key={index}
                  ref={(el) => { if (el) textRefs.current[index] = el }}
                  className="bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent inline-block"
                  style={{ perspective: "1000px" }}
                >
                  {word}
                </span>
              ))}
            </div>
          </h2>
          
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Three simple steps to transform your ideas into beautiful lyrics
          </p>

          {/* Animated Connecting Line */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <div ref={lineRef} className="w-32 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 rounded-full origin-left" />
          </div>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 via-blue-500 to-purple-500 -translate-y-1/2 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-blue-500 to-purple-500 animate-pulse opacity-50" />
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  delay: index * 0.2,
                  duration: 0.6,
                  ease: "easeOut"
                }}
                className="relative group"
              >
                {/* Card */}
                <div className="how-it-works-float bg-neutral-500 rounded-3xl p-8 shadow-lg border border-lavender-600 hover:shadow-2xl transition-all duration-500 h-full relative overflow-hidden">
                  {/* Background Glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${step.accentColor}15 0%, transparent 50%)`
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon Container */}
                    <div className="relative mb-8">
                      <div className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <step.icon className="w-10 h-10" />
                      </div>
                      
                      {/* Number Badge */}
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-neutral-500 rounded-full shadow-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-jet-black">{step.number}</span>
                      </div>

                      {/* Floating particles effect */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`} />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-4">
                      <h3 className="text-2xl font-bold text-jet-black mb-1 font-heading">{step.title}</h3>
                      <p className="text-sm font-medium" style={{ color: step.accentColor }}>{step.subtitle}</p>
                    </div>

                    {/* Description */}
                    <p className="text-neutral-300 text-center leading-relaxed">
                      {step.desc}
                    </p>

                    {/* Arrow Connector (hidden on last item) */}
                    {index < 2 && (
                      <div className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-20">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-lg group-hover:translate-x-2 transition-transform duration-300`}>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Indicator */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 + 0.3 }}
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                >
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${step.color} shadow-lg`} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-lavender-700 border border-lavender-500">
            <CheckCircle className="w-5 h-5 text-teal" />
            <span className="text-jet-black font-medium">No credit card required • Start free trial</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
