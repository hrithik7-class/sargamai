"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Music,
  Music2,
  Shield,
  ShieldAlert,
  AlertCircle,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
  ArrowRight,
  Tag,
  Languages,
  FileText,
  Download,
  Mic2,
} from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import {
  generateLyrics,
  generateAudio,
  checkCopyright,
  fetchTrack,
  audioSrc,
  type Track,
  type LyricsGenerateResponse,
  type CopyrightCheckResponse,
  ApiError,
} from "@/lib/api";
import { downloadLyricsPdf } from "@/lib/pdf";

/* ─── constants ─────────────────────────────────────────── */

const GENRES = [
  "Pop", "Rock", "Hip-Hop", "R&B", "Jazz", "Electronic",
  "Bollywood", "Classical", "Folk", "Indie", "Punjabi", "Country",
];

const LANGUAGES = [
  { value: "english",  label: "English" },
  { value: "hindi",    label: "Hindi" },
  { value: "hinglish", label: "Hinglish" },
  { value: "punjabi",  label: "Punjabi" },
  { value: "auto",     label: "Auto" },
];

const STORAGE_KEY = "sargam-create-music-draft";
type Step = "input" | "lyrics" | "generating" | "done";

/* ─── draft helpers ─────────────────────────────────────── */

function loadDraft(): { prompt: string; genre: string; language: string; lyricsResult: LyricsGenerateResponse } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.lyricsResult?.lyrics || !parsed?.lyricsResult?.title) return null;
    return {
      prompt: String(parsed.prompt ?? ""),
      genre: String(parsed.genre ?? "Pop"),
      language: String(parsed.language ?? "english"),
      lyricsResult: parsed.lyricsResult,
    };
  } catch { return null; }
}

function saveDraft(prompt: string, genre: string, language: string, lyricsResult: LyricsGenerateResponse | null) {
  if (typeof window === "undefined" || !lyricsResult) return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ prompt, genre, language, lyricsResult })); } catch { /* */ }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* */ }
}

/* ─── lyrics display ────────────────────────────────────── */

function SectionDivider({ tag }: { tag: string }) {
  return (
    <div className="flex items-center gap-4 my-7 first:mt-2">
      <div className="flex-1 h-px bg-lavender-600/40" />
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal shrink-0 px-1">
        {tag}
      </span>
      <div className="flex-1 h-px bg-lavender-600/40" />
    </div>
  );
}

function LyricsDisplay({ lyrics }: { lyrics: string }) {
  const lines = lyrics.split("\n");

  return (
    <div className="select-text">
      {lines.map((line, i) => {
        const tagMatch = line.trim().match(/^\[(.+)\]$/);
        if (tagMatch) return <SectionDivider key={i} tag={tagMatch[1]} />;
        if (line.trim() === "") return <div key={i} className="h-4" />;
        return (
          <p
            key={i}
            className="text-[15px] text-jet-black leading-[1.9] tracking-[0.01em]"
          >
            {line}
          </p>
        );
      })}
    </div>
  );
}

function StreamingLyricsDisplay({
  lyrics,
  onComplete,
  speed = 12,
}: {
  lyrics: string;
  onComplete?: () => void;
  speed?: number;
}) {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [done, setDone] = useState(false);
  const fullLen = lyrics.length;

  useEffect(() => {
    if (displayedLength >= fullLen) { setDone(true); onComplete?.(); return; }
    const timer = setInterval(() => {
      setDisplayedLength((prev) => Math.min(prev + speed, fullLen));
    }, 20);
    return () => clearInterval(timer);
  }, [displayedLength, fullLen, speed, onComplete]);

  return (
    <>
      <LyricsDisplay lyrics={lyrics.slice(0, displayedLength)} />
      {!done && (
        <span className="inline-block w-0.5 h-5 ml-0.5 bg-teal animate-pulse align-middle" />
      )}
    </>
  );
}

/* ─── small components ──────────────────────────────────── */

function CopyrightBadge({ result }: { result: CopyrightCheckResponse }) {
  if (result.note)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
        <AlertCircle className="w-3 h-3" /> Unavailable
      </span>
    );
  if (result.safe)
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-1">
        <Shield className="w-3 h-3" /> Safe ({result.score.toFixed(0)}%)
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-2.5 py-1">
      <ShieldAlert className="w-3 h-3" /> Review ({result.score.toFixed(0)}%)
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-lavender-600/60 text-xs font-medium text-neutral-400 hover:text-jet-black hover:bg-lavender-700 transition-all duration-200"
    >
      {copied ? (
        <><Check className="w-3 h-3 text-teal" /> Copied!</>
      ) : (
        <><Copy className="w-3 h-3" /> Copy</>
      )}
    </button>
  );
}

/* ─── step breadcrumb ───────────────────────────────────── */

const STEPS = ["Describe", "Review Lyrics", "Generate Song"] as const;

function StepBreadcrumb({ step }: { step: Step }) {
  const activeIndex = step === "input" ? 0 : step === "lyrics" ? 1 : 2;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              i < activeIndex
                ? "bg-teal/15 text-teal border border-teal/20"
                : i === activeIndex
                ? "bg-teal text-white shadow-sm"
                : "bg-lavender-700/60 text-neutral-500 border border-lavender-600/40"
            }`}
          >
            {i < activeIndex && <Check className="w-3 h-3" />}
            {label}
          </div>
          {i < STEPS.length - 1 && (
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── main component ────────────────────────────────────── */

export default function CreateMusicCard() {
  const { data: session, update: updateSession } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  const [step, setStep] = useState<Step>("input");
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [language, setLanguage] = useState("english");

  const [lyricsResult, setLyricsResult] = useState<LyricsGenerateResponse | null>(null);
  const [streamingComplete, setStreamingComplete] = useState(false);
  const [copyrightResult, setCopyrightResult] = useState<CopyrightCheckResponse | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [copyrightLoading, setCopyrightLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUnavailable, setAudioUnavailable] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const accessTokenRef = useRef(accessToken);
  accessTokenRef.current = accessToken;

  const clearPoll = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  };

  useEffect(() => () => clearPoll(), []);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setPrompt(draft.prompt);
      setGenre(draft.genre);
      setLanguage(draft.language);
      setLyricsResult(draft.lyricsResult);
      setStreamingComplete(true);
      setStep("lyrics");
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated || !lyricsResult) return;
    saveDraft(prompt, genre, language, lyricsResult);
  }, [hasHydrated, prompt, genre, language, lyricsResult]);

  const startPoll = useCallback((trackId: number, token?: string) => {
    const t = token ?? accessTokenRef.current;
    if (!t) return;
    clearPoll();
    pollRef.current = setInterval(async () => {
      try {
        const updated = await fetchTrack(trackId, accessTokenRef.current ?? t);
        setTrack(updated);
        if (updated.status === "completed" || updated.status === "failed") {
          clearPoll();
          setAudioLoading(false);
          setStep(updated.status === "completed" ? "done" : "lyrics");
          if (updated.status === "failed")
            setError(updated.error_message ?? "Audio generation failed. Please try again.");
        }
      } catch { /* keep polling */ }
    }, 3000);
  }, []);

  const handleGenerateLyrics = async () => {
    if (!prompt.trim()) return;
    if (!accessToken) { setError("You must be signed in to generate lyrics."); return; }
    setLyricsLoading(true);
    setError(null);
    setCopyrightResult(null);
    setTrack(null);
    try {
      const result = await generateLyrics({ input_prompt: prompt, language, genre }, accessToken);
      setLyricsResult(result);
      setStreamingComplete(false);
      setStep("lyrics");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        try {
          const refreshed = await updateSession();
          const newToken = (refreshed as any)?.accessToken;
          if (newToken) {
            const result = await generateLyrics({ input_prompt: prompt, language, genre }, newToken);
            setLyricsResult(result); setStreamingComplete(false); setStep("lyrics"); return;
          }
        } catch { /* fall through */ }
        setError("Session expired. Please sign in again.");
      } else {
        setError(e instanceof ApiError ? e.message : "Lyrics generation failed. Please try again.");
      }
      throw e;
    } finally { setLyricsLoading(false); }
  };

  const handleCheckCopyright = async () => {
    if (!lyricsResult || !accessToken) return;
    setCopyrightLoading(true);
    setError(null);
    try {
      const result = await checkCopyright({ lyrics: lyricsResult.lyrics, title: lyricsResult.title }, accessToken);
      setCopyrightResult(result);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        try {
          const refreshed = await updateSession();
          const newToken = (refreshed as any)?.accessToken;
          if (newToken) {
            const result = await checkCopyright({ lyrics: lyricsResult.lyrics, title: lyricsResult.title }, newToken);
            setCopyrightResult(result); return;
          }
        } catch { /* fall through */ }
        setError("Session expired. Please sign in again.");
      } else {
        setError(e instanceof ApiError ? e.message : "Copyright check failed.");
      }
    } finally { setCopyrightLoading(false); }
  };

  const handleGenerateAudio = async () => {
    if (!lyricsResult || !accessToken) return;
    setAudioLoading(true);
    setError(null);
    setStep("generating");
    const doGenerate = async (t: string) => {
      const res = await generateAudio(
        { lyrics: lyricsResult.lyrics, title: lyricsResult.title, input_prompt: prompt, language, genre },
        t,
      );
      const initialTrack = await fetchTrack(res.track_id, t);
      return { res, initialTrack };
    };
    try {
      const { res, initialTrack } = await doGenerate(accessToken);
      setTrack(initialTrack);
      if (initialTrack.status === "completed") { setStep("done"); setAudioLoading(false); }
      else startPoll(res.track_id);
    } catch (e) {
      setAudioLoading(false);
      setStep("lyrics");
      if (e instanceof ApiError && e.status === 401) {
        try {
          const refreshed = await updateSession();
          const newToken = (refreshed as any)?.accessToken;
          if (newToken) {
            setStep("generating");
            setAudioLoading(true);
            const { res, initialTrack } = await doGenerate(newToken);
            setTrack(initialTrack);
            if (initialTrack.status === "completed") { setStep("done"); setAudioLoading(false); }
            else startPoll(res.track_id, newToken);
            return;
          }
        } catch { /* fall through */ }
        setError("Session expired. Please sign in again.");
      } else if (e instanceof ApiError && e.status === 402) {
        setAudioUnavailable(true);
      } else {
        const msg = e instanceof ApiError ? e.message : String(e);
        if (msg.toLowerCase().includes("insufficient") || msg.toLowerCase().includes("credit") || msg.toLowerCase().includes("billing")) {
          setAudioUnavailable(true);
        } else {
          setError(msg || "Failed to start audio generation.");
        }
      }
    }
  };

  const reset = () => {
    clearPoll(); clearDraft();
    setStep("input"); setPrompt(""); setLyricsResult(null);
    setCopyrightResult(null); setTrack(null); setError(null);
    setAudioLoading(false); setStreamingComplete(false); setAudioUnavailable(false);
  };

  const hasLyrics = !!lyricsResult;
  const showSplitLayout = hasLyrics || step === "generating" || step === "done";
  const langLabel = LANGUAGES.find((l) => l.value === language)?.label ?? language;

  /* ── render ──────────────────────────────────────────── */
  return (
    <div className="min-w-0">

      {/* Step breadcrumbs */}
      <AnimatePresence>
        {showSplitLayout && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between gap-4 mb-7 flex-wrap"
          >
            <StepBreadcrumb step={step} />
            <button
              type="button"
              onClick={reset}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-teal transition-colors px-3 py-1.5 rounded-lg hover:bg-teal/10 border border-transparent hover:border-teal/20"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Start over
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* ══ INPUT phase ══════════════════════════════════════ */}
        {!showSplitLayout && step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl mx-auto"
          >
            {/* Textarea */}
            <div className="mb-7">
              <label className="block text-sm font-semibold text-jet-black mb-2.5">
                What's your song about?
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={"Share a mood, story, or feeling…\n\nExamples:\n• Heartbreak under city lights\n• dil dhadke tere naam se, raat ko tere khwaab aate hain\n• A summer road trip with old friends"}
                  className="w-full h-48 sm:h-56 px-5 py-4 rounded-2xl border border-lavender-600/60 bg-lavender-800/50 text-jet-black text-sm placeholder-neutral-300 focus:outline-none focus:border-teal/50 focus:ring-4 focus:ring-teal/10 focus:bg-lavender-800/70 resize-none transition-all duration-200 leading-relaxed"
                />
                <div className="absolute bottom-3.5 right-4 text-[10px] text-neutral-500 tabular-nums pointer-events-none">
                  {prompt.length}
                </div>
              </div>
            </div>

            {/* Genre pills */}
            <div className="mb-7">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Genre</p>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <motion.button
                    key={g}
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setGenre(g)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                      genre === g
                        ? "bg-teal text-white border-teal shadow-[0_4px_18px_rgba(0,212,255,0.3)]"
                        : "bg-lavender-800/40 border-lavender-600/60 text-neutral-300 hover:border-teal/40 hover:text-jet-black hover:bg-lavender-700/60"
                    }`}
                  >
                    {g}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Language segmented */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-3">Language</p>
              <div className="inline-flex flex-wrap gap-1 p-1.5 rounded-xl bg-lavender-800/60 border border-lavender-600/60">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    onClick={() => setLanguage(l.value)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      language === l.value
                        ? "bg-teal text-white shadow-sm"
                        : "text-neutral-400 hover:text-jet-black hover:bg-lavender-700/80"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 12px 40px rgba(0,212,255,0.3)" }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={handleGenerateLyrics}
              disabled={lyricsLoading || !prompt.trim()}
              className="w-full py-4 rounded-2xl bg-teal text-white font-bold text-base flex items-center justify-center gap-3 hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_32px_rgba(0,212,255,0.2)] disabled:shadow-none"
            >
              {lyricsLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating lyrics…</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Generate Lyrics <ArrowRight className="w-5 h-5" /></>
              )}
            </motion.button>

            <p className="text-center text-xs text-neutral-500 mt-3.5">
              AI-powered · Under 3 seconds · 50+ genres supported
            </p>
          </motion.div>
        )}

        {/* ══ SPLIT layout ═════════════════════════════════════ */}
        {showSplitLayout && (
          <motion.div
            key="split"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5"
          >
            {/* ── Left sidebar ──────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              <div className="flex-1 flex flex-col rounded-2xl border border-lavender-600/40 bg-lavender-800/25 overflow-hidden">
                {/* Sidebar header */}
                <div className="px-4 py-3.5 border-b border-lavender-600/30 flex items-center gap-2 shrink-0">
                  <Mic2 className="w-3.5 h-3.5 text-teal" />
                  <span className="text-xs font-semibold text-jet-black flex-1 uppercase tracking-wide">Your Prompt</span>
                  <button
                    type="button"
                    onClick={() => { setStep("input"); setLyricsResult(null); setStreamingComplete(false); }}
                    className="text-xs text-neutral-400 hover:text-teal transition-colors"
                  >
                    Edit
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col gap-4 min-h-0">
                  {/* Prompt text */}
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-1 min-h-[100px] w-full bg-transparent text-jet-black text-sm leading-relaxed resize-none focus:outline-none placeholder-neutral-300"
                    placeholder="Enter your idea…"
                  />

                  {/* Genre + Language chips */}
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-lavender-600/25">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal/10 border border-teal/20 text-teal text-[11px] font-semibold">
                      <Tag className="w-2.5 h-2.5" /> {genre}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-lavender-700/80 border border-lavender-600/50 text-neutral-300 text-[11px] font-medium">
                      <Languages className="w-2.5 h-2.5" /> {langLabel}
                    </span>
                  </div>

                  {/* Regenerate */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleGenerateLyrics}
                    disabled={lyricsLoading || !prompt.trim()}
                    className="w-full py-2 rounded-xl border border-teal/30 bg-teal/5 text-teal text-xs font-semibold flex items-center justify-center gap-2 hover:bg-teal/10 transition-colors disabled:opacity-50"
                  >
                    {lyricsLoading
                      ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Regenerating…</>
                      : <><RefreshCw className="w-3.5 h-3.5" /> Regenerate</>
                    }
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* ── Right: lyrics / generating / done ─────────── */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >

              {/* LYRICS */}
              {step === "lyrics" && lyricsResult && (
                <div className="flex flex-col rounded-2xl border border-lavender-600/40 bg-[var(--page-bg)] overflow-hidden shadow-sm" style={{ height: "calc(100vh - 180px)" }}>

                  {/* — Lyrics panel top bar — */}
                  <div className="px-6 py-4 border-b border-lavender-600/30 shrink-0 flex items-start gap-4">
                    {/* Song icon + title */}
                    <div className="w-10 h-10 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center shrink-0 mt-0.5">
                      <Music2 className="w-5 h-5 text-teal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold font-heading text-jet-black leading-tight truncate">
                        {lyricsResult.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-xs text-neutral-400">{lyricsResult.genre}</span>
                        <span className="text-neutral-600 text-xs">·</span>
                        <span className="text-xs text-neutral-400">{langLabel}</span>
                        {copyrightResult && (
                          <>
                            <span className="text-neutral-600 text-xs">·</span>
                            <CopyrightBadge result={copyrightResult} />
                          </>
                        )}
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                      <button
                        type="button"
                        onClick={handleCheckCopyright}
                        disabled={copyrightLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-lavender-600/60 text-xs font-medium text-neutral-400 hover:text-jet-black hover:bg-lavender-700 transition-all disabled:opacity-60"
                      >
                        {copyrightLoading
                          ? <Loader2 className="w-3 h-3 animate-spin" />
                          : <Shield className="w-3 h-3" />}
                        Check
                      </button>
                      <CopyButton text={lyricsResult.lyrics} />
                    </div>
                  </div>

                  {/* — Lyrics scroll area — */}
                  <div className="flex-1 overflow-y-auto px-8 py-6 sm:px-10 sm:py-8">
                    <StreamingLyricsDisplay
                      lyrics={lyricsResult.lyrics}
                      onComplete={() => setStreamingComplete(true)}
                      speed={16}
                    />
                  </div>

                  {/* — Generate song footer — */}
                  <div className="px-6 py-4 border-t border-lavender-600/30 shrink-0 bg-lavender-800/20">
                    {error && (
                      <p className="mb-3 text-xs text-red-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                      </p>
                    )}
                    {audioUnavailable ? (
                      <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertCircle className="w-4 h-4 text-amber-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-jet-black mb-0.5">Insufficient credits</p>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                              Your music provider has run out of credits. Add $5 to{" "}
                              <a href="https://replicate.com/account/billing" target="_blank" rel="noopener noreferrer" className="text-teal underline underline-offset-2">
                                Replicate billing
                              </a>{" "}
                              to generate songs — enough for 100+ tracks.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAudioUnavailable(false)}
                          className="mt-3 w-full py-2.5 rounded-lg border border-lavender-600/60 text-xs font-medium text-neutral-400 hover:text-jet-black hover:bg-lavender-700 transition-colors"
                        >
                          Try again anyway
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.005, boxShadow: "0 8px 30px rgba(0,212,255,0.25)" }}
                        whileTap={{ scale: 0.995 }}
                        type="button"
                        onClick={handleGenerateAudio}
                        className="w-full py-3.5 rounded-xl bg-teal text-white font-bold text-sm flex items-center justify-center gap-2.5 hover:bg-teal-600 transition-colors shadow-[0_4px_24px_rgba(0,212,255,0.18)]"
                      >
                        <Music className="w-4 h-4" />
                        Generate Full Song
                        <ChevronRight className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
              )}

              {/* GENERATING */}
              {step === "generating" && (
                <div
                  className="flex flex-col rounded-2xl border border-lavender-600/40 bg-[var(--page-bg)] overflow-hidden"
                  style={{ height: "calc(100vh - 180px)" }}
                >
                  <div className="flex-1 flex flex-col items-center justify-center py-16 gap-8 px-6">
                    {/* Waveform */}
                    <div className="relative">
                      <div className="flex items-end justify-center gap-[3px] h-20">
                        {Array.from({ length: 24 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 rounded-full"
                            style={{
                              background: `linear-gradient(to top, #00d4ff, rgba(0,212,255,0.25))`,
                              height: "8px",
                              animation: "sargamWave 0.9s ease-in-out infinite",
                              animationDelay: `${i * 0.05}s`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-12 blur-2xl bg-teal/20 rounded-full pointer-events-none" />
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-xl font-bold font-heading text-jet-black">Composing your song…</p>
                      <p className="text-sm text-neutral-400 max-w-xs leading-relaxed">
                        AI is synthesizing vocals and music. Usually takes 30–90 seconds.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-teal/50 animate-pulse" style={{ animationDelay: `${i * 0.25}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* DONE */}
              {step === "done" && track && track.audio_url && lyricsResult && (
                <div
                  className="flex flex-col rounded-2xl border border-teal/25 bg-[var(--page-bg)] overflow-hidden shadow-[0_0_60px_rgba(0,212,255,0.07)]"
                  style={{ height: "calc(100vh - 180px)" }}
                >
                  <div className="px-6 py-4 border-b border-lavender-600/30 flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-teal/15 border border-teal/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-teal uppercase tracking-widest block">Ready to play</span>
                      <h3 className="font-bold text-jet-black font-heading truncate">{track.title}</h3>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {track.generated_lyrics && (
                        <button
                          type="button"
                          onClick={() => downloadLyricsPdf(track)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-lavender-600/60 text-xs font-medium text-neutral-400 hover:text-jet-black hover:bg-lavender-700 transition-all"
                        >
                          <Download className="w-3 h-3" /> PDF
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={reset}
                        className="flex items-center gap-1.5 text-xs font-semibold text-teal hover:text-teal-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal/10"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Create new
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-6">
                    <AudioPlayer
                      src={audioSrc(track.audio_url)}
                      title={track.title}
                      genre={track.genre}
                      language={track.language}
                    />

                    <details className="group">
                      <summary className="cursor-pointer text-xs font-bold text-teal hover:text-teal-600 select-none list-none flex items-center gap-1.5 py-1 uppercase tracking-wide">
                        <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
                        View Lyrics
                      </summary>
                      <div className="mt-4 rounded-xl bg-lavender-800/30 border border-lavender-600/30 px-8 py-6 max-h-72 overflow-y-auto">
                        <LyricsDisplay lyrics={lyricsResult.lyrics} />
                      </div>
                    </details>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>

      <style>{`
        @keyframes sargamWave {
          0%, 100% { height: 8px; }
          50% { height: 46px; }
        }
      `}</style>
    </div>
  );
}
