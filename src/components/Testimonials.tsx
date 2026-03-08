"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { Star, Quote, User, Music, Mic, Headphones, Play, ArrowRight, BadgeCheck, Crown } from "lucide-react";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Music Producer",
    company: "Studio 92 Productions",
    avatar: "SJ",
    rating: 5,
    comment: "Sargam has completely transformed our songwriting workflow. The AI generates studio-quality lyrics that actually make sense and sound professional. It's like having a world-class co-writer available 24/7.",
    icon: Music,
    color: "#1f7a8c",
    tier: "Pro"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Platinum Artist",
    company: "Independent",
    avatar: "MC",
    rating: 5,
    comment: "After using Sargam for 6 months, I've landed 3 record deals. The lyrics are incredibly meaningful and emotionally resonant. This is a game-changer for independent artists!",
    icon: Mic,
    color: "#2bacc5",
    tier: "Enterprise"
  },
  {
    id: 3,
    name: "Emily Davis",
    role: "Content Director",
    company: "Viral Hits Media",
    avatar: "ED",
    rating: 5,
    comment: "We create 50+ videos weekly and Sargam helps us generate unique lyrics in seconds. The quality is consistently outstanding and our engagement has increased by 340%.",
    icon: Headphones,
    color: "#5f74ba",
    tier: "Business"
  }
];

// Star rating
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-teal-700' : 'text-lavender-500'}`}
          fill={i < rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".testimonial-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      gsap.fromTo(".review-card",
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" }
      );

      gsap.fromTo(".testimonial-stat",
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.2)", delay: 0.3 }
      );
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-24 bg-neutral-500 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lavender-500 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lavender-500 to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-pale-sky-700/50 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-teal-900/50 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="testimonial-header text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender-700 text-jet-black-600 text-sm font-medium mb-6">
            <Star className="w-4 h-4 text-teal-700" fill="currentColor" />
            <span>Rated 4.9/5 from 10,000+ reviews</span>
          </div>
         
          <h2 className="text-4xl md:text-5xl font-bold text-jet-black mb-4 font-heading">
            Loved by{" "}
            <span className="text-teal">
              creative professionals
            </span>
          </h2>
         
          <p className="text-neutral-300 text-lg max-w-2xl mx-auto">
            See why leading music industry professionals trust Sargam for their creative workflow
          </p>
        </div>

        {/* Stats */}
        <div className="testimonial-header grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
          {[
            { value: "50K+", label: "Active Users" },
            { value: "4.9", label: "App Rating" },
            { value: "1M+", label: "Songs Generated" },
            { value: "98%", label: "Satisfaction" },
          ].map((stat, index) => (
            <div 
              key={index}
              className="testimonial-stat bg-lavender-700 rounded-2xl border border-lavender-600 p-6 text-center hover:border-teal-800 hover:shadow-md transition-all"
            >
              <div className="text-2xl font-bold text-jet-black">{stat.value}</div>
              <div className="text-sm text-neutral-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews - Clean SaaS Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="review-card group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="relative h-full bg-neutral-500 rounded-2xl border border-lavender-500 p-8 hover:shadow-xl hover:border-teal-800 transition-all duration-300">
                {/* Top section with icon and rating */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-lavender-600 to-lavender-700 flex items-center justify-center group-hover:from-pale-sky-700 group-hover:to-pale-sky-600 transition-all">
                    <Quote className="w-6 h-6 text-jet-black-600 group-hover:text-teal transition-colors" />
                  </div>
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Comment */}
                <p className="text-jet-black-600 leading-relaxed mb-8 text-sm">
                  {testimonial.comment}
                </p>

                {/* Author section */}
                <div className="flex items-center gap-4 pt-6 border-t border-lavender-600">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                    style={{ backgroundColor: testimonial.color }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-jet-black truncate">{testimonial.name}</span>
                      <BadgeCheck className="w-4 h-4 text-teal flex-shrink-0" />
                    </div>
                    <p className="text-neutral-300 text-sm truncate">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-lavender-700 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-6 bg-jet-black rounded-2xl p-2 pr-4 text-white overflow-hidden hover:bg-jet-black-400 transition-colors">
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-teal-700 border-2 border-jet-black flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="font-medium">Join 50,000+ creators today</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 bg-neutral-500 text-jet-black font-semibold rounded-xl text-sm hover:bg-lavender-700"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 inline-block ml-1" />
            </motion.button>
          </div>
        </motion.div>

        {/* Logo Cloud */}
        <div className="mt-16 pt-8 border-t border-lavender-600">
          <p className="text-center text-neutral-300 text-sm mb-8">Trusted by leading music companies worldwide</p>
          <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
            {["Warner", "Sony", "Universal", "Atlantic", "Capitol", "Def Jam"].map((company, i) => (
              <span key={i} className="text-xl font-bold text-neutral-300 hover:text-jet-black transition-colors tracking-wider">
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
