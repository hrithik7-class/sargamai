"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Music2,
  ArrowRight,
  ChevronRight,
  Lock,
  Mic2,
} from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import { audioSrc } from "@/lib/api";

const GENRES = [
  "Pop", "Rock", "Hip-Hop", "R&B", "Jazz", "Electronic",
  "Bollywood", "Classical", "Folk", "Indie", "Punjabi", "Country",
];

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "hinglish", label: "Hinglish" },
  { value: "punjabi", label: "Punjabi" },
  { value: "auto", label: "Auto" },
];

const DEMO_USED_KEY = "sargam-demo-used";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface DemoResult {
  title: string;
  lyrics: string;
  language: string;
  genre: string;
  audio_url: string;
}

type Phase = "form" | "generating" | "done" | "locked";

function SectionDivider({ tag }: { tag: string }) {
  return (
    <div className="flex items-center gap-4 my-5 first:mt-0">
      <div className="flex-1 h-px bg-lavender-600/40" />
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal shrink-0 px-1">
        {tag}
      </span>
      <div className="flex-1 h-px bg-lavender-600/40" />
    </div>
  );
}

function LyricsDisplay({ lyrics }: { lyrics: string }) {
  return (
    <div className="select-text">
      {lyrics.split("\n").map((line, i) => {
        const tagMatch = line.trim().match(/^\[(.+)\]$/);
        if (tagMatch) return <SectionDivider key={i} tag={tagMatch[1]} />;
        if (line.trim() === "") return <div key={i} className="h-4" />;
        return (
          <p key={i} className="text-[15px] text-jet-black leading-[1.9] tracking-[0.01em]">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function TryDemoPage() {
  const [phase, setPhase] = useState<Phase>("form");
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [language, setLanguage] = useState("english");
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(DEMO_USED_KEY) === "1") setPhase("locked");
    } catch { /* localStorage unavailable — treat as fresh */ }
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setPhase("generating");
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/demo/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input_prompt: prompt, language, genre }),
      });

      if (res.status === 429) {
        setPhase("locked");
        try { localStorage.setItem(DEMO_USED_KEY, "1"); } catch { /* ignore */ }
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Generation failed (HTTP ${res.status})`);
      }

      const data: DemoResult = await res.json();
      setResult(data);
      setPhase("done");
      try { localStorage.setItem(DEMO_USED_KEY, "1"); } catch { /* ignore */ }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setPhase("form");
    }
  };

  return (
    <div className="min-h-screen min-h-dvh bg-[var(--page-bg)] pt-[calc(5rem+env(safe-area-inset-top,0px))] pb-16 px-4 sm:px-6">
      <div className="max-w-[720px] mx-auto">
        {/* Header — mirrors dashboard's generate page header style */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-teal/15 border border-teal/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-teal" />
            </div>
            <span className="text-xs font-semibold text-teal uppercase tracking-widest">Free Demo</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-400">One song, on us</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-jet-black leading-tight">
            Try SargamAI free
          </h1>
          <p className="text-sm text-neutral-400 mt-1.5 max-w-md">
            Describe your idea — get one real AI-generated song with singing, no account needed.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {phase === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl bg-neutral-500/50 border border-lavender-600/40 p-5 sm:p-7"
            >
              <label className="block text-sm font-medium text-jet-black mb-2">
                What&apos;s your song about?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. a heartfelt song about missing home during the monsoon"
                rows={4}
                className="w-full rounded-xl bg-lavender-700/50 border border-lavender-600 px-4 py-3 text-sm text-jet-black placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal resize-none"
              />

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full rounded-lg bg-lavender-700/50 border border-lavender-600 px-3 py-2.5 text-sm text-jet-black focus:outline-none focus:ring-2 focus:ring-teal/50"
                  >
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1.5">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-lg bg-lavender-700/50 border border-lavender-600 px-3 py-2.5 text-sm text-jet-black focus:outline-none focus:ring-2 focus:ring-teal/50"
                  >
                    {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-danger-ink bg-danger-soft border border-danger-line rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-teal text-white font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Mic2 className="w-5 h-5" />
                Generate my song
              </button>
              <p className="text-xs text-neutral-400 mt-3 text-center">
                One free generation per visitor. Full access needs a free account.
              </p>
            </motion.div>
          )}

          {phase === "generating" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-neutral-500/50 border border-lavender-600/40 p-10 flex flex-col items-center justify-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-teal/15 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-teal animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-jet-black">Writing lyrics and recording vocals…</p>
                <p className="text-sm text-neutral-400 mt-1">This can take up to a minute. Hang tight.</p>
              </div>
            </motion.div>
          )}

          {phase === "done" && result && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="rounded-2xl bg-neutral-500/50 border border-lavender-600/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-lavender-600 flex items-center gap-2">
                  <Music2 className="w-5 h-5 text-teal" />
                  <span className="font-semibold text-jet-black">{result.title}</span>
                </div>
                <div className="p-5">
                  <AudioPlayer src={audioSrc(result.audio_url)} title={result.title} genre={result.genre} language={result.language} />
                </div>
                <div className="px-5 pb-5 max-h-64 overflow-y-auto">
                  <LyricsDisplay lyrics={result.lyrics} />
                </div>
              </div>

              <div className="rounded-2xl bg-teal/10 border border-teal/20 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div>
                  <p className="font-semibold text-jet-black">Loved it? That was your one free song.</p>
                  <p className="text-sm text-neutral-300 mt-0.5">Sign up free to create unlimited songs and save them to your library.</p>
                </div>
                <Link
                  href="/get-started"
                  className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal text-white font-semibold hover:bg-teal-600 transition-colors whitespace-nowrap"
                >
                  Create free account
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}

          {phase === "locked" && (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-neutral-500/50 border border-lavender-600/40 p-8 sm:p-10 flex flex-col items-center text-center gap-4"
            >
              <div className="w-14 h-14 rounded-full bg-teal/15 flex items-center justify-center">
                <Lock className="w-6 h-6 text-teal" />
              </div>
              <div>
                <p className="font-semibold text-jet-black text-lg">You've used your free demo</p>
                <p className="text-sm text-neutral-400 mt-1 max-w-sm">
                  Sign in or create a free account to keep generating songs — with your own library, unlimited genres, and more.
                </p>
              </div>
              <Link
                href="/get-started"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal text-white font-semibold hover:bg-teal-600 transition-colors"
              >
                Sign in / Sign up
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
