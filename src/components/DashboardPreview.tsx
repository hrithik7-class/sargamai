"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { 
  Music, 
  Sparkles, 
  Wand2, 
  Copy, 
  Download, 
  RefreshCw, 
  Heart, 
  Share2,
  ChevronRight,
  Layers,
  Palette,
  Mic,
  Volume2,
  Clock,
  TrendingUp,
  Users,
  Play
} from "lucide-react";

const typingTexts = [
  "AI-Powered Lyrics Generator",
  "Write Beautiful Songs in Seconds",
  "Your Creative Music Partner",
  "Transform Ideas Into Music"
];

const dashboardStats = [
  { label: "Total Songs", value: "1,247", icon: Music, change: "+12%" },
  { label: "Active Users", value: "3,892", icon: Users, change: "+8%" },
  { label: "Plays", value: "45.2K", icon: Play, change: "+23%" },
];

const recentSongs = [
  { title: "Midnight Dreams", genre: "Pop", plays: "2.3K", date: "2 hours ago" },
  { title: "Ocean Waves", genre: "Lo-Fi", plays: "1.8K", date: "5 hours ago" },
  { title: "City Lights", genre: "R&B", plays: "3.1K", date: "1 day ago" },
];

export default function DashboardPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  // Typing effect
  useEffect(() => {
    const text = typingTexts[currentTextIndex];
    let index = 0;

    const typeInterval = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
          setIsTyping(true);
        }, 2000);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [currentTextIndex]);

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current || !dashboardRef.current) return;

    const ctx = gsap.context(() => {
      // Dashboard entrance animation
      gsap.fromTo(dashboardRef.current, 
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
      );

      // Floating elements animation
      gsap.to(".dashboard-float", {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3
      });

      // Stats cards animation
      gsap.fromTo(".stat-card",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.5 }
      );

      // Recent songs animation
      gsap.fromTo(".song-card",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, delay: 0.7 }
      );

      // Quick actions animation
      gsap.fromTo(".quick-action",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, delay: 0.9 }
      );

      // Button hover effects
      gsap.to(".generate-btn", {
        boxShadow: "0 0 30px rgba(31, 122, 140, 0.5)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, containerRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 py-16 sm:py-32 bg-gradient-to-b from-lavender-800 to-neutral-500 overflow-hidden min-w-0">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-teal-800/20 rounded-full blur-3xl" />
      </div>

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-teal/20 border border-teal-600 text-teal text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>See SargamAI in Action</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-jet-black font-heading">
            <span className="text-teal">
              Your Creative Dashboard
            </span>
          </h2>
          <p className="text-jet-black-600 text-sm sm:text-lg max-w-2xl mx-auto">
            Experience the power of AI-driven lyrics generation with our intuitive dashboard
          </p>
        </motion.div>

        {/* Dynamic Typing Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-neutral-500 border border-lavender-500 shadow-sm max-w-[calc(100vw-1.5rem)] min-w-0">
            <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-teal shrink-0" />
            <span className="text-sm sm:text-xl font-medium text-jet-black truncate min-w-0">
              {displayText}
              <span className="inline-block w-0.5 h-4 sm:h-6 bg-teal ml-1 animate-pulse shrink-0" />
            </span>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <div ref={dashboardRef} className="relative">
          {/* Main Dashboard Card */}
          <div
            className="bg-neutral-500 rounded-2xl sm:rounded-3xl shadow-2xl border border-lavender-500 overflow-hidden min-w-0"
          >
            {/* Dashboard Header */}
            <motion.div
              className="bg-gradient-to-r from-jet-black to-teal px-4 sm:px-8 py-4 sm:py-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                    <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold text-lg sm:text-xl truncate">SargamAI Studio</h3>
                    <p className="text-white/80 text-xs sm:text-sm">AI Lyrics Generator</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/20 backdrop-blur text-white text-xs sm:text-sm">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="truncate">Last used: 2 min ago</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Dashboard Body */}
            <div className="p-4 sm:p-8 min-w-0">
              <div className="grid lg:grid-cols-3 gap-4 sm:gap-8 min-w-0">
                {/* Main Generator Panel */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0">
                  {/* Prompt Input */}
                  <div className="bg-lavender-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-lavender-600 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal flex items-center justify-center shrink-0">
                        <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h4 className="font-semibold text-jet-black text-sm sm:text-base">Create New Lyrics</h4>
                    </div>
                    <textarea
                      className="w-full min-w-0 h-24 sm:h-32 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-lavender-500 bg-neutral-500 focus:ring-2 focus:ring-teal focus:border-transparent resize-none text-jet-black text-xs sm:text-base placeholder-neutral-300"
                      placeholder="Describe your song idea... e.g., 'A heartbreak song about losing someone you love, with pop influence and emotional lyrics'"
                    />
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-3 sm:mt-4 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                        <select className="flex-1 min-w-0 max-w-[140px] sm:max-w-none px-3 py-2 rounded-lg border border-lavender-500 bg-neutral-500 text-jet-black text-xs sm:text-sm focus:ring-2 focus:ring-teal">
                          <option>Pop</option>
                          <option>Rock</option>
                          <option>R&B</option>
                          <option>Hip-Hop</option>
                          <option>Country</option>
                        </select>
                        <select className="flex-1 min-w-0 max-w-[140px] sm:max-w-none px-3 py-2 rounded-lg border border-lavender-500 bg-neutral-500 text-jet-black text-xs sm:text-sm focus:ring-2 focus:ring-teal">
                          <option>Happy</option>
                          <option>Sad</option>
                          <option>Energetic</option>
                          <option>Romantic</option>
                        </select>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="generate-btn w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-teal text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-800/30"
                      >
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Generate Lyrics
                      </motion.button>
                    </div>
                  </div>

                  {/* Generated Lyrics Preview */}
                  <div className="bg-gradient-to-br from-lavender-600 to-lavender-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-teal-600/50 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-3 sm:mb-4 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-jet-black text-sm sm:text-base">Generated Lyrics</h4>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-neutral-500 border border-lavender-500 text-jet-black-600 hover:text-teal hover:border-teal-800 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-neutral-500 border border-lavender-500 text-jet-black-600 hover:text-teal hover:border-teal-800 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-neutral-500 border border-lavender-500 text-jet-black-600 hover:text-red-500 hover:border-red-300 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 rounded-lg bg-neutral-500 border border-lavender-500 text-jet-black-600 hover:text-teal hover:border-teal-800 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                    <div className="bg-neutral-500 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-lavender-600 min-w-0">
                      <p className="text-jet-black-600 leading-relaxed text-xs sm:text-base">
                        [Verse 1]<br/>
                        In the darkness of the night,<br/>
                        I see your face in the moonlight,<br/>
                        Every memory we shared,<br/>
                        Now it&apos;s just me who cared...
                      </p>
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-lavender-600 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-teal/20 border border-teal-600/50 text-teal text-[10px] sm:text-xs font-medium">Pop</span>
                          <span className="px-2.5 py-1 rounded-full bg-teal-900 text-teal-700 text-[10px] sm:text-xs font-medium">Romantic</span>
                        </div>
                        <button className="text-teal text-xs sm:text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all w-full sm:w-auto justify-center sm:justify-start">
                          View Full Lyrics <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar Stats */}
                <motion.div 
                  className="space-y-4 sm:space-y-6 min-w-0"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  {/* Quick Stats */}
                  <div className="grid gap-3 sm:gap-4 min-w-0">
                    {dashboardStats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className="stat-card bg-lavender-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-lavender-600 hover:shadow-md transition-shadow cursor-pointer min-w-0"
                        whileHover={{ scale: 1.02, backgroundColor: "#1e293b" }}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.4 }}
                      >
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal flex items-center justify-center shrink-0">
                              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-neutral-300 text-xs sm:text-sm truncate">{stat.label}</p>
                              <p className="text-jet-black font-bold text-lg sm:text-xl truncate">{stat.value}</p>
                            </div>
                          </div>
                          <span className="text-green-600 text-xs sm:text-sm font-medium flex items-center gap-1 shrink-0">
                            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {stat.change}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Songs */}
                  <div className="bg-lavender-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-lavender-600 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                      <h4 className="font-semibold text-jet-black text-sm sm:text-base">Recent Creations</h4>
                      <button className="text-teal text-xs sm:text-sm font-medium shrink-0">View All</button>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      {recentSongs.map((song, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-neutral-500 border border-lavender-600 hover:border-teal-800 cursor-pointer transition-colors min-w-0"
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-teal/20 border border-teal-600/50 flex items-center justify-center shrink-0">
                              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-teal" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-jet-black text-xs sm:text-sm truncate">{song.title}</p>
                              <p className="text-neutral-300 text-[10px] sm:text-xs truncate">{song.genre} • {song.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-neutral-300 text-[10px] sm:text-xs shrink-0">
                            <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {song.plays}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-gradient-to-br from-jet-black to-teal rounded-xl sm:rounded-2xl p-4 sm:p-5 text-white min-w-0">
                    <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {[
                        { icon: Layers, label: "New Project" },
                        { icon: Palette, label: "Templates" },
                        { icon: Mic, label: "Record" },
                        { icon: Volume2, label: "Export" },
                      ].map((action, index) => (
                        <motion.button
                          key={index}
                          className="flex flex-col items-center gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur hover:bg-white/30 transition-colors min-w-0"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <action.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                          <span className="text-[10px] sm:text-xs font-medium text-center">{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div 
            className="dashboard-float absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-14 h-14 sm:w-20 sm:h-20 bg-teal rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center"
          >
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </motion.div>
          <motion.div 
            className="dashboard-float absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-12 h-12 sm:w-16 sm:h-16 bg-teal-600 rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center"
            style={{ animationDelay: "0.5s" }}
          >
            <Music className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12 min-w-0"
        >
          {[
            { title: "Smart Generation", desc: "AI-powered lyrics that match your vision", icon: Sparkles },
            { title: "50+ Genres", desc: "From pop to classical, we cover it all", icon: Music },
            { title: "Easy Export", desc: "Download in multiple formats", icon: Download },
            { title: "Collaboration", desc: "Work with your team in real-time", icon: Users },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-4 sm:p-6 min-w-0"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 rounded-xl sm:rounded-2xl bg-teal/20 border border-teal-600/50 flex items-center justify-center">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-teal" />
              </div>
              <h5 className="font-semibold text-jet-black mb-1.5 sm:mb-2 font-heading text-sm sm:text-base">{feature.title}</h5>
              <p className="text-neutral-300 text-xs sm:text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
