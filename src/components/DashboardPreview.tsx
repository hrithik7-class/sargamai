"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion, AnimatePresence, useInView,
  useMotionValue, useTransform, animate,
} from "framer-motion";
import {
  Music, Sparkles, Wand2, Copy, Download, Heart,
  TrendingUp, Users, Play, Zap, Check, Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

/* ─── constants ──────────────────────────────────────── */

const LYRICS_LINES = [
  { tag: true,  text: "[Verse 1]" },
  { tag: false, text: "In the silence of the dawn," },
  { tag: false, text: "Where the broken pieces fall," },
  { tag: false, text: "I've been searching for the light," },
  { tag: false, text: "That was hidden in it all." },
  { tag: true,  text: "[Chorus]" },
  { tag: false, text: "We were made for something more," },
  { tag: false, text: "Than the echoes at the door," },
  { tag: false, text: "Let the music carry us," },
  { tag: false, text: "To the shore we've waited for." },
  { tag: true,  text: "[Bridge]" },
  { tag: false, text: "Hold on, hold on to the fire," },
  { tag: false, text: "We're climbing up from the wire," },
];

const STATS = [
  { label: "Songs Created", value: 50000, suffix: "+", icon: Music,    trend: "+12%" },
  { label: "Active Users",  value: 12000, suffix: "+", icon: Users,    trend: "+8%"  },
  { label: "Genres",        value: 100,   suffix: "+", icon: Star,     trend: "New"  },
  { label: "Avg Gen Time",  value: 3,     suffix: "s", icon: Zap,      trend: "Fast" },
];

const ACTIVITY = [
  { title: "Midnight Dreams", genre: "Pop",   plays: "2.3K", time: "2m ago",  live: true  },
  { title: "Ocean Waves",     genre: "Lo-Fi", plays: "1.8K", time: "14m ago", live: false },
  { title: "City Lights",     genre: "R&B",   plays: "3.1K", time: "1h ago",  live: false },
  { title: "Neon Pulse",      genre: "EDM",   plays: "4.0K", time: "3h ago",  live: false },
];

/* ─── Count-up ───────────────────────────────────────── */

function AnimatedNumber({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);
  const display = useTransform(count, (v) =>
    to >= 1000 ? `${(v / 1000).toFixed(v < to ? 1 : 0)}K` : Math.round(v).toString()
  );
  useEffect(() => {
    if (!inView) return;
    const c = animate(count, to, { duration: 1.6, ease: "easeOut" });
    return c.stop;
  }, [inView, to, count]);
  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{display}</motion.span>{suffix}
    </span>
  );
}

/* ─── Waveform ───────────────────────────────────────── */

function Waveform({ active }: { active: boolean }) {
  const heights = [4, 7, 11, 8, 14, 9, 12, 6, 13, 8, 5, 9, 11, 7, 4];
  return (
    <div className="flex items-center gap-[2.5px]" style={{ height: 24 }}>
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full bg-teal"
          animate={
            active
              ? { scaleY: [0.3, h / 8, 0.3], opacity: [0.4, 1, 0.4] }
              : { scaleY: 0.25, opacity: 0.25 }
          }
          transition={{
            duration: 0.7 + i * 0.04,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
          style={{ height: `${h * 1.6}px`, transformOrigin: "center" }}
        />
      ))}
    </div>
  );
}

/* ─── Streaming lyrics ───────────────────────────────── */

function LyricsStream({ playing }: { playing: boolean }) {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    if (!playing) { setVisible(0); return; }
    setVisible(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= LYRICS_LINES.length) clearInterval(id);
    }, 280);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="font-mono text-sm leading-7 space-y-0.5">
      <AnimatePresence>
        {LYRICS_LINES.slice(0, visible).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.22 }}
            className="flex items-baseline gap-3"
          >
            <span className="text-lavender-600/40 text-[10px] w-4 text-right shrink-0 select-none">
              {i + 1}
            </span>
            <span className={line.tag ? "text-teal font-semibold" : "text-jet-black-600"}>
              {line.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
      {playing && visible < LYRICS_LINES.length && (
        <div className="flex items-baseline gap-3">
          <span className="w-4 shrink-0" />
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-teal rounded-sm"
          />
        </div>
      )}
    </div>
  );
}

/* ─── Window dots ────────────────────────────────────── */

function WindowDots() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────── */

export default function DashboardPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("generate");

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => {
      setProgress(0);
      setPlaying(false);
      const id = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(id); setPlaying(true); return 100; }
          return p + 2.5;
        });
      }, 32);
      return () => clearInterval(id);
    }, 500);
    return () => clearTimeout(t);
  }, [inView]);

  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 1800); };

  return (
    <section ref={sectionRef} className="relative z-10 py-24 sm:py-40 overflow-hidden">

      {/* ── background ── */}
      <div className="absolute inset-0 bg-[var(--page-bg)]" />
      <div
        className="absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, var(--color-teal) 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
        aria-hidden
      />
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] -translate-y-1/3 pointer-events-none" style={{ background: "rgba(0,212,255,0.05)" }} aria-hidden />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] translate-y-1/3 pointer-events-none" style={{ background: "rgba(0,212,255,0.04)" }} aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── header ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 sm:mb-20 max-w-2xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal/10 border border-teal/20 text-teal text-xs font-semibold uppercase tracking-widest mb-5"
          >
            <Sparkles className="w-3 h-3" strokeWidth={1.5} />
            Product Demo
          </motion.span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading text-jet-black leading-[1.1] tracking-tight mb-5">
            Watch AI craft<br />
            <span className="text-teal">your next hit.</span>
          </h2>
          <p className="text-jet-black-600 text-base sm:text-lg leading-relaxed">
            One prompt. Three seconds. Studio-ready lyrics — live.
          </p>
        </motion.div>

        {/* ── two-column grid — equal 50/50, same height ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">

          {/* ════════════════ LEFT — app window ════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col h-full"
          >
            {/* Browser/app chrome */}
            <div className="flex flex-col h-full rounded-2xl sm:rounded-3xl border border-lavender-600/30 bg-gradient-to-br from-lavender-800 to-lavender-700 overflow-hidden">

              {/* Title bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-lavender-600/30 bg-lavender-900/60 shrink-0">
                <WindowDots />
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-teal/10 border border-teal/20 flex items-center justify-center">
                    <Music className="w-3 h-3 text-teal" strokeWidth={1.5} />
                  </div>
                  <span className="text-[13px] text-jet-black-600 font-medium">sargam-studio</span>
                  <Badge className="bg-teal/10 text-teal border-teal/20 border text-[10px] px-2 py-0 ml-1">
                    {progress < 100 ? "Generating…" : "Done"}
                  </Badge>
                </div>
                <Waveform active={playing} />
              </div>

              {/* Tab bar */}
              <div className="px-5 pt-3 pb-0 border-b border-lavender-600/20 shrink-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-transparent h-auto p-0 gap-0 rounded-none w-full justify-start">
                    {[
                      { value: "generate", label: "Generate", icon: Wand2 },
                      { value: "edit",     label: "Edit",     icon: Music },
                      { value: "export",   label: "Export",   icon: Download },
                    ].map(({ value, label, icon: Icon }) => (
                      <TabsTrigger
                        key={value}
                        value={value}
                        className="relative px-4 py-2.5 text-xs font-medium rounded-none border-0 bg-transparent
                                   text-jet-black-600 data-[state=active]:text-teal data-[state=active]:bg-transparent
                                   data-[state=active]:shadow-none hover:text-jet-black transition-colors
                                   after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px]
                                   after:rounded-full after:bg-teal after:opacity-0
                                   data-[state=active]:after:opacity-100"
                      >
                        <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                        {label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* ── Generate tab ── */}
                  <TabsContent value="generate" className="mt-0">
                    <div className="flex flex-col" style={{ height: 460 }}>

                      {/* Prompt row */}
                      <div className="px-5 py-4 border-b border-lavender-600/20 shrink-0">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-teal flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-lavender-900 text-[11px] font-bold">U</span>
                          </div>
                          <p className="text-jet-black-600 text-sm leading-relaxed">
                            A hopeful love song about finding light after a dark season.
                            Uplifting chorus, emotionally raw verse, 4/4 time, Pop.
                          </p>
                        </div>
                      </div>

                      {/* Progress row */}
                      <div className="px-5 py-3 shrink-0 border-b border-lavender-600/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-2 text-[11px] text-jet-black-600">
                            <motion.span
                              animate={progress < 100 ? { opacity: [1, 0.3] } : { opacity: 1 }}
                              transition={{ duration: 0.7, repeat: progress < 100 ? Infinity : 0 }}
                              className="w-1.5 h-1.5 rounded-full bg-teal"
                            />
                            {progress < 100 ? `Generating lyrics… ${progress}%` : "Generation complete"}
                          </span>
                          {progress === 100 && (
                            <span className="flex items-center gap-1 text-[11px] text-teal font-medium">
                              <Check className="w-3 h-3" /> Done
                            </span>
                          )}
                        </div>
                        <Progress value={progress} className="h-1 bg-lavender-600/30" />
                      </div>

                      {/* Lyrics scroll area */}
                      <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none">
                        <LyricsStream playing={playing} />
                      </div>

                      {/* Action footer */}
                      <div className="px-5 py-3 border-t border-lavender-600/20 flex items-center justify-between shrink-0 bg-lavender-900/30">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-teal/10 text-teal border-teal/20 border text-[11px]">Pop</Badge>
                          <Badge variant="outline" className="border-lavender-600/40 text-jet-black-600 text-[11px]">Hopeful</Badge>
                          <Badge variant="outline" className="border-lavender-600/40 text-jet-black-600 text-[11px]">4/4</Badge>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {[
                            { icon: copied ? Check : Copy, action: handleCopy, color: copied ? "text-teal" : "" },
                            { icon: Download, action: () => {}, color: "" },
                            { icon: Heart,    action: () => {}, color: "hover:text-red-400" },
                          ].map(({ icon: Icon, action, color }, i) => (
                            <motion.button
                              key={i}
                              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                              onClick={action}
                              className={`w-8 h-8 rounded-lg bg-lavender-600/20 border border-lavender-600/20 flex items-center justify-center text-jet-black-600 hover:text-teal hover:border-teal/20 transition-colors ${color}`}
                            >
                              <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* ── Edit tab ── */}
                  <TabsContent value="edit" className="mt-0">
                    <div className="flex flex-col px-5 py-5 gap-3" style={{ height: 460 }}>
                      <p className="text-jet-black-600 text-sm">Refine with natural language prompts</p>
                      {[
                        { text: "Make the chorus more uplifting and anthemic", done: true  },
                        { text: "Add a bridge with a key change in the third verse", done: true  },
                        { text: "Make verse 2 more introspective and personal",  done: false },
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.09 }}
                          className="flex items-center gap-3 p-3.5 rounded-xl bg-lavender-900/50 border border-lavender-600/20"
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-teal/20" : "border border-lavender-600/50"}`}>
                            {item.done && <Check className="w-3 h-3 text-teal" />}
                          </div>
                          <p className={`text-sm flex-1 ${item.done ? "text-jet-black-600" : "text-jet-black"}`}>{item.text}</p>
                          <Badge className={`text-[10px] shrink-0 ${item.done ? "bg-teal/10 text-teal border border-teal/20" : "bg-lavender-600/20 text-jet-black-600 border border-lavender-600/30"}`}>
                            {item.done ? "done" : "pending"}
                          </Badge>
                        </motion.div>
                      ))}
                      <div className="flex gap-2 mt-auto">
                        <input
                          readOnly
                          placeholder="Describe a refinement…"
                          className="flex-1 px-3.5 py-2.5 rounded-xl bg-lavender-900/50 border border-lavender-600/20 text-jet-black text-sm placeholder-jet-black-600 focus:outline-none"
                        />
                        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          className="px-5 py-2.5 rounded-xl bg-teal text-lavender-900 text-sm font-semibold shrink-0">
                          Apply
                        </motion.button>
                      </div>
                    </div>
                  </TabsContent>

                  {/* ── Export tab ── */}
                  <TabsContent value="export" className="mt-0">
                    <div className="flex flex-col px-5 py-5 gap-3" style={{ height: 460 }}>
                      <p className="text-jet-black-600 text-sm">Export your lyrics</p>
                      {[
                        { format: "PDF Document", ext: ".pdf", desc: "Print-ready layout",          icon: Download },
                        { format: "Plain Text",   ext: ".txt", desc: "Clean copy for your DAW",     icon: Copy     },
                        { format: "Markdown",     ext: ".md",  desc: "For Notion, Obsidian & more", icon: Sparkles },
                      ].map((item, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.07 }}
                          whileHover={{ scale: 1.015 }}
                          whileTap={{ scale: 0.985 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-lavender-900/50 border border-lavender-600/20 hover:border-teal/20 hover:bg-lavender-900/70 transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/15 flex items-center justify-center shrink-0">
                            <item.icon className="w-5 h-5 text-teal" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-jet-black text-sm font-medium">{item.format}</p>
                            <p className="text-jet-black-600 text-xs mt-0.5">{item.desc}</p>
                          </div>
                          <Badge variant="outline" className="border-lavender-600/30 text-jet-black-600 text-[10px] shrink-0">{item.ext}</Badge>
                        </motion.button>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>

          {/* ════════════════ RIGHT — stats + activity ════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4 h-full"
          >

            {/* Prompt summary card */}
            <Card className="border-lavender-600/30 bg-gradient-to-br from-lavender-800 to-lavender-700 shadow-none gap-0 shrink-0">
              <CardHeader className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm text-jet-black font-semibold">Your Prompt</CardTitle>
                  <Badge className="bg-teal/10 text-teal border-teal/20 border text-[10px]">Active</Badge>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-jet-black-600 text-sm leading-relaxed mb-4">
                  "A hopeful love song about finding light after a dark season…"
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {["Pop", "Hopeful", "4/4 time", "Verse + Chorus"].map((tag) => (
                    <Badge key={tag} variant="outline" className="border-lavender-600/40 text-jet-black-600 text-[11px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats 2×2 */}
            <div className="grid grid-cols-2 gap-3 shrink-0">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + i * 0.07 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="border-lavender-600/30 bg-gradient-to-br from-lavender-800 to-lavender-700 shadow-none gap-0 py-0">
                    <CardContent className="px-4 py-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-teal/10 border border-teal/15 flex items-center justify-center">
                          <s.icon className="w-4 h-4 text-teal" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] text-teal font-medium bg-teal/10 px-1.5 py-0.5 rounded-md">
                          {s.trend}
                        </span>
                      </div>
                      <p className="text-2xl font-bold font-heading text-jet-black leading-none mb-1">
                        <AnimatedNumber to={s.value} suffix={s.suffix} />
                      </p>
                      <p className="text-[11px] text-jet-black-600">{s.label}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Activity feed — flex-1 fills remaining height */}
            <motion.div
              className="flex-1 min-h-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="border-lavender-600/30 bg-gradient-to-br from-lavender-800 to-lavender-700 shadow-none gap-0 h-full flex flex-col">
                <CardHeader className="px-5 pt-4 pb-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-jet-black">Recent Activity</CardTitle>
                    <div className="flex items-center gap-1.5">
                      <motion.span
                        animate={{ opacity: [1, 0.25] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-teal"
                      />
                      <span className="text-[11px] text-teal font-medium">Live</span>
                    </div>
                  </div>
                </CardHeader>

                <Separator className="bg-lavender-600/25 shrink-0" />

                <CardContent className="px-5 pt-3 pb-4 flex-1 space-y-1 overflow-y-auto">
                  {ACTIVITY.map((song, i) => (
                    <motion.div
                      key={song.title}
                      initial={{ opacity: 0, x: 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 + i * 0.06 }}
                      className="group flex items-center gap-3 py-2.5 rounded-xl px-2 hover:bg-lavender-600/15 transition-colors cursor-default"
                    >
                      {/* Icon with live ring */}
                      <div className="relative shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-teal/10 border border-teal/15 flex items-center justify-center">
                          <Music className="w-4 h-4 text-teal" strokeWidth={1.5} />
                        </div>
                        {song.live && (
                          <>
                            <motion.span
                              animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                              transition={{ duration: 1.3, repeat: Infinity }}
                              className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal"
                            />
                            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-teal" />
                          </>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-jet-black text-sm font-medium truncate group-hover:text-teal transition-colors">
                          {song.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge className="bg-teal/8 text-teal border border-teal/15 text-[10px] px-1.5 py-0">
                            {song.genre}
                          </Badge>
                          <span className="text-[11px] text-jet-black-600">{song.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-jet-black-600 text-xs shrink-0">
                        <Play className="w-3 h-3" strokeWidth={1.5} />
                        {song.plays}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>

                <Separator className="bg-lavender-600/25 shrink-0" />

                <CardContent className="px-5 py-3 shrink-0">
                  <div className="flex items-center justify-between text-[11px] text-jet-black-600">
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="w-3 h-3 text-teal" />
                      +23% plays this week
                    </span>
                    <button className="text-teal hover:underline font-medium">View all</button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
