"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Loader2,
  Music,
  ChevronDown,
  Shield,
  ShieldAlert,
  AlertCircle,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Button as StatefulButton } from "@/components/ui/stateful-button";
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

const GENRES = [
  "Pop", "Rock", "Hip-Hop", "R&B", "Jazz", "Electronic",
  "Bollywood", "Classical", "Folk", "Indie", "Punjabi", "Country",
];

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi (हिंदी)" },
  { value: "hinglish", label: "Hinglish" },
  { value: "punjabi", label: "Punjabi (ਪੰਜਾਬੀ)" },
  { value: "auto", label: "Auto-detect" },
];

const STORAGE_KEY = "sargam-create-music-draft";

type Step = "input" | "lyrics" | "generating" | "done";

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
  } catch {
    return null;
  }
}

function saveDraft(prompt: string, genre: string, language: string, lyricsResult: LyricsGenerateResponse | null) {
  if (typeof window === "undefined" || !lyricsResult) return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ prompt, genre, language, lyricsResult })
    );
  } catch {
    /* ignore */
  }
}

function clearDraft() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function SectionTag({ tag }: { tag: string }) {
  return (
    <span className="inline-block text-[10px] font-semibold text-teal uppercase tracking-wider bg-teal/10 border border-teal/20 rounded px-1.5 py-0.5 mb-0.5">
      {tag}
    </span>
  );
}

/** Render lyrics with highlighted section tags */
function LyricsDisplay({ lyrics }: { lyrics: string }) {
  const lines = lyrics.split("\n");
  return (
    <div className="space-y-0.5 text-xs sm:text-sm font-mono leading-relaxed text-jet-black">
      {lines.map((line, i) => {
        const tagMatch = line.trim().match(/^\[(.+)\]$/);
        if (tagMatch) {
          return (
            <div key={i} className="pt-2 first:pt-0">
              <SectionTag tag={tagMatch[1]} />
            </div>
          );
        }
        return (
          <p key={i} className={line.trim() === "" ? "h-2" : ""}>
            {line || "\u00A0"}
          </p>
        );
      })}
    </div>
  );
}

/** Streaming lyrics display - reveals text progressively */
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
    if (displayedLength >= fullLen) {
      setDone(true);
      onComplete?.();
      return;
    }
    const timer = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = Math.min(prev + speed, fullLen);
        return next;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [displayedLength, fullLen, speed, onComplete]);

  const displayed = lyrics.slice(0, displayedLength);
  return (
    <>
      <LyricsDisplay lyrics={displayed} />
      {!done && (
        <span className="inline-block w-2 h-4 ml-0.5 bg-teal animate-pulse align-baseline" />
      )}
    </>
  );
}

function CopyrightBadge({ result }: { result: CopyrightCheckResponse }) {
  if (result.note) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-neutral-300">
        <AlertCircle className="w-3 h-3" /> Check unavailable
      </span>
    );
  }
  if (result.safe) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-0.5">
        <Shield className="w-3 h-3" /> Copyright safe ({result.score.toFixed(0)}% match)
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal bg-teal/10 border border-teal-600/50 rounded-full px-2.5 py-0.5">
      <ShieldAlert className="w-3 h-3" /> Potential match ({result.score.toFixed(0)}% similar)
    </span>
  );
}

export default function CreateMusicCard() {
  const { data: session, update: updateSession } = useSession();
  const accessToken = (session as any)?.accessToken as string | undefined;

  const [step, setStep] = useState<Step>("input");
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [language, setLanguage] = useState("english");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const langTriggerRef = useRef<HTMLButtonElement>(null);
  const genreTriggerRef = useRef<HTMLButtonElement>(null);
  const [langDropdownRect, setLangDropdownRect] = useState<{ top: number; left: number } | null>(null);
  const [genreDropdownRect, setGenreDropdownRect] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (showLangDropdown && langTriggerRef.current) {
      const r = langTriggerRef.current.getBoundingClientRect();
      setLangDropdownRect({ top: r.bottom + 4, left: r.left });
    } else {
      setLangDropdownRect(null);
    }
  }, [showLangDropdown]);
  useEffect(() => {
    if (showGenreDropdown && genreTriggerRef.current) {
      const r = genreTriggerRef.current.getBoundingClientRect();
      setGenreDropdownRect({ top: r.bottom + 4, left: r.left });
    } else {
      setGenreDropdownRect(null);
    }
  }, [showGenreDropdown]);

  const [lyricsResult, setLyricsResult] = useState<LyricsGenerateResponse | null>(null);
  const [streamingComplete, setStreamingComplete] = useState(false);
  const [copyrightResult, setCopyrightResult] = useState<CopyrightCheckResponse | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

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
  const [audioLoading, setAudioLoading] = useState(false);
  const [copyrightLoading, setCopyrightLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPoll = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  useEffect(() => () => clearPoll(), []);

  const accessTokenRef = useRef(accessToken);
  accessTokenRef.current = accessToken;

  const startPoll = useCallback(
    (trackId: number, token?: string) => {
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
            if (updated.status === "failed") {
              setError(updated.error_message ?? "Audio generation failed. Please try again.");
            }
          }
        } catch {
          // keep polling; token may refresh via session
        }
      }, 3000);
    },
    [],
  );

  const handleGenerateLyrics = async () => {
    if (!prompt.trim()) return;
    if (!accessToken) {
      setError("You must be signed in to generate lyrics.");
      return;
    }
    setLyricsLoading(true);
    setError(null);
    setCopyrightResult(null);
    setTrack(null);
    try {
      const result = await generateLyrics(
        { input_prompt: prompt, language, genre },
        accessToken,
      );
      setLyricsResult(result);
      setStreamingComplete(false);
      setStep("lyrics");
      setCopyrightResult(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        try {
          const refreshed = await updateSession();
          const newToken = (refreshed as { accessToken?: string })?.accessToken;
          if (newToken) {
            const result = await generateLyrics(
              { input_prompt: prompt, language, genre },
              newToken,
            );
            setLyricsResult(result);
            setStreamingComplete(false);
            setStep("lyrics");
            setCopyrightResult(null);
            return;
          }
        } catch {
          /* fall through to error */
        }
        setError("Session expired. Please sign in again.");
      } else {
        setError(e instanceof ApiError ? e.message : "Lyrics generation failed. Please try again.");
      }
      throw e;
    } finally {
      setLyricsLoading(false);
    }
  };

  const handleCheckCopyright = async () => {
    if (!lyricsResult || !accessToken) return;
    setCopyrightLoading(true);
    setError(null);
    try {
      const result = await checkCopyright(
        { lyrics: lyricsResult.lyrics, title: lyricsResult.title },
        accessToken,
      );
      setCopyrightResult(result);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        try {
          const refreshed = await updateSession();
          const newToken = (refreshed as any)?.accessToken;
          if (newToken) {
            const result = await checkCopyright(
              { lyrics: lyricsResult.lyrics, title: lyricsResult.title },
              newToken,
            );
            setCopyrightResult(result);
            return;
          }
        } catch {
          /* fall through to error */
        }
        setCopyrightResult(null);
        setError("Session expired. Please sign in again.");
      } else {
        setCopyrightResult(null);
        setError(e instanceof ApiError ? e.message : "Copyright check failed. Please try again.");
      }
    } finally {
      setCopyrightLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!lyricsResult || !accessToken) return;
    setAudioLoading(true);
    setError(null);
    setStep("generating");
    const doGenerate = async (t: string) => {
      const res = await generateAudio(
        {
          lyrics: lyricsResult.lyrics,
          title: lyricsResult.title,
          input_prompt: prompt,
          language,
          genre,
        },
        t,
      );
      const initialTrack = await fetchTrack(res.track_id, t);
      return { res, initialTrack };
    };
    try {
      const { res, initialTrack } = await doGenerate(accessToken);
      setTrack(initialTrack);
      if (initialTrack.status === "completed") {
        setStep("done");
        setAudioLoading(false);
      } else {
        startPoll(res.track_id);
      }
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        try {
          const refreshed = await updateSession();
          const newToken = (refreshed as { accessToken?: string })?.accessToken;
          if (newToken) {
            const { res, initialTrack } = await doGenerate(newToken);
            setTrack(initialTrack);
            if (initialTrack.status === "completed") {
              setStep("done");
              setAudioLoading(false);
            } else {
              startPoll(res.track_id, newToken);
            }
            return;
          }
        } catch {
          /* fall through to error */
        }
        setAudioLoading(false);
        setStep("lyrics");
        setError("Session expired. Please sign in again.");
      } else {
        setAudioLoading(false);
        setStep("lyrics");
        setError(e instanceof ApiError ? e.message : "Failed to start audio generation.");
      }
      throw e;
    }
  };

  const reset = () => {
    clearPoll();
    clearDraft();
    setStep("input");
    setPrompt("");
    setLyricsResult(null);
    setCopyrightResult(null);
    setTrack(null);
    setError(null);
    setAudioLoading(false);
    setStreamingComplete(false);
  };

  const hasLyrics = !!lyricsResult;
  const showSplitLayout = hasLyrics || step === "generating" || step === "done";

  const langLabel = LANGUAGES.find((l) => l.value === language)?.label ?? language;

  return (
    <CardSpotlight color="#00d4ff" className="mb-6 sm:mb-8 min-w-0 !border-lavender-600">
    <div className="bg-neutral-500 rounded-xl sm:rounded-2xl overflow-hidden min-w-0">
      {/* Header */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-lavender-600 flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal flex items-center justify-center shrink-0">
          <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-jet-black font-heading text-sm sm:text-base truncate">
            Create music from lyrics
          </h2>
          <p className="text-[10px] sm:text-xs text-neutral-300 truncate">
            Enter rhymes or ideas — AI generates lyrics and synthesizes a full song
          </p>
        </div>
        {step !== "input" && (
          <button
            type="button"
            onClick={reset}
            className="shrink-0 flex items-center gap-1 text-xs text-neutral-300 hover:text-jet-black transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
          </button>
        )}
      </div>

      <div className="p-3 sm:p-6 min-w-0">
        <AnimatePresence mode="wait">
          {/* ── Single column: Input only ── */}
          {!showSplitLayout && step === "input" && (
            <motion.div
              key="input-only"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col lg:flex-row gap-4 lg:gap-6 mb-4 min-w-0"
            >
              <div className="flex-1 min-w-0">
                <label className="block text-xs sm:text-sm font-medium text-jet-black mb-1.5">
                  Your rhymes, lyrics, or theme
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={"Enter rhyme words, a story idea, or partial lyrics…\n\nExample:\ndil dhadke tere naam se\nraat ko tere khwaab aate hain"}
                  className="w-full min-w-0 h-36 sm:h-44 lg:h-52 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-dashed border-lavender-600 bg-lavender-800/50 text-jet-black text-xs sm:text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal focus:border-solid focus:border-2 resize-none transition-colors"
                />
              </div>
              <div className="lg:w-48 xl:w-52 flex flex-row lg:flex-col gap-2 sm:gap-3 shrink-0">
                {/* Language picker */}
                <div className="relative flex-1 lg:flex-none">
                  <label className="block text-[10px] sm:text-xs text-neutral-400 mb-1 lg:mb-1.5">Language</label>
                  <button
                    ref={langTriggerRef}
                    type="button"
                    onClick={() => { setShowLangDropdown(!showLangDropdown); setShowGenreDropdown(false); }}
                    className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs sm:text-sm font-medium hover:bg-lavender-600 transition-colors"
                  >
                    <span className="truncate">{langLabel}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
                  </button>
                {showLangDropdown && typeof document !== "undefined" && langDropdownRect &&
                  createPortal(
                    <>
                      <div className="fixed inset-0 z-[100]" aria-hidden onClick={() => setShowLangDropdown(false)} />
                      <div
                        className="fixed z-[101] w-44 py-1 rounded-lg bg-neutral-500 border border-lavender-600 shadow-xl"
                        style={{ top: langDropdownRect.top, left: langDropdownRect.left }}
                      >
                        {LANGUAGES.map((l) => (
                          <button
                            key={l.value}
                            type="button"
                            onClick={() => { setLanguage(l.value); setShowLangDropdown(false); }}
                            className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors ${language === l.value ? "text-jet-black font-medium bg-teal/15" : "text-jet-black hover:bg-lavender-700"}`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </>,
                    document.body
                  )}
                </div>

                {/* Genre picker */}
                <div className="relative flex-1 lg:flex-none">
                  <label className="block text-[10px] sm:text-xs text-neutral-400 mb-1 lg:mb-1.5">Genre</label>
                  <button
                    ref={genreTriggerRef}
                    type="button"
                    onClick={() => { setShowGenreDropdown(!showGenreDropdown); setShowLangDropdown(false); }}
                    className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs sm:text-sm font-medium hover:bg-lavender-600 transition-colors"
                  >
                    <span className="truncate">{genre}</span>
                    <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${showGenreDropdown ? "rotate-180" : ""}`} />
                  </button>
                {showGenreDropdown && typeof document !== "undefined" && genreDropdownRect &&
                  createPortal(
                    <>
                      <div className="fixed inset-0 z-[100]" aria-hidden onClick={() => setShowGenreDropdown(false)} />
                      <div
                        className="fixed z-[101] w-36 py-1 rounded-lg bg-neutral-500 border border-lavender-600 shadow-xl max-h-52 overflow-y-auto"
                        style={{ top: genreDropdownRect.top, left: genreDropdownRect.left }}
                      >
                        {GENRES.map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => { setGenre(g); setShowGenreDropdown(false); }}
                            className={`w-full px-3 py-2 text-left text-xs sm:text-sm transition-colors ${genre === g ? "text-jet-black font-medium bg-teal/15" : "text-jet-black hover:bg-lavender-700"}`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </>,
                    document.body
                  )}
                </div>

                {/* Generate Lyrics button */}
                <div className="lg:mt-2">
                  <StatefulButton
                    type="button"
                    onClick={async () => { await handleGenerateLyrics(); }}
                    disabled={lyricsLoading || !prompt.trim()}
                    className="!min-w-0 !w-full !rounded-lg text-xs sm:text-sm"
                  >
                    Generate Lyrics
                  </StatefulButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Split layout: Two separate cards, full viewport height ── */}
          {showSplitLayout && (
            <motion.div
              key="split"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-w-0 min-h-[600px] sm:min-h-[680px] lg:min-h-0 lg:h-[400px]"
            >
              {/* Left: Prompt card — separate card */}
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="flex flex-col min-w-0 h-full"
              >
                <div className="h-full flex flex-col rounded-2xl border-2 border-lavender-600 bg-neutral-500 shadow-lg overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-lavender-600 shrink-0">
                    <h3 className="font-semibold text-jet-black font-heading text-sm sm:text-base">
                      Your prompt
                    </h3>
                    <p className="text-xs text-neutral-300 mt-0.5">Edit and regenerate lyrics</p>
                  </div>
                  <div className="flex-1 flex flex-col min-h-0 p-4 sm:p-5">
                    <label className="block text-xs sm:text-sm font-medium text-jet-black mb-1.5 shrink-0">
                      Rhymes, lyrics, or theme
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter rhyme words, a story idea…"
                      className="h-[110px] w-full min-w-0 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border-2 border-lavender-600 bg-lavender-800/50 text-jet-black text-xs sm:text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
                    />
                    <div className="flex flex-row gap-2 mt-3">
                      <div className="relative flex-1">
                        <label className="block text-[10px] text-neutral-400 mb-1">Language</label>
                        <button
                          ref={langTriggerRef}
                          type="button"
                          onClick={() => { setShowLangDropdown(!showLangDropdown); setShowGenreDropdown(false); }}
                          className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs font-medium hover:bg-lavender-600"
                        >
                          <span className="truncate">{langLabel}</span>
                          <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showLangDropdown && typeof document !== "undefined" && langDropdownRect &&
                          createPortal(
                            <>
                              <div className="fixed inset-0 z-[100]" aria-hidden onClick={() => setShowLangDropdown(false)} />
                              <div className="fixed z-[101] w-44 py-1 rounded-lg bg-neutral-500 border border-lavender-600 shadow-xl" style={{ top: langDropdownRect.top, left: langDropdownRect.left }}>
                                {LANGUAGES.map((l) => (
                                  <button key={l.value} type="button" onClick={() => { setLanguage(l.value); setShowLangDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs transition-colors ${language === l.value ? "text-jet-black font-medium bg-teal/15" : "text-jet-black hover:bg-lavender-700"}`}>{l.label}</button>
                                ))}
                              </div>
                            </>,
                            document.body
                          )}
                      </div>
                      <div className="relative flex-1">
                        <label className="block text-[10px] text-neutral-400 mb-1">Genre</label>
                        <button
                          ref={genreTriggerRef}
                          type="button"
                          onClick={() => { setShowGenreDropdown(!showGenreDropdown); setShowLangDropdown(false); }}
                          className="w-full flex items-center justify-between gap-1.5 px-3 py-2 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs font-medium hover:bg-lavender-600"
                        >
                          <span className="truncate">{genre}</span>
                          <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform ${showGenreDropdown ? "rotate-180" : ""}`} />
                        </button>
                        {showGenreDropdown && typeof document !== "undefined" && genreDropdownRect &&
                          createPortal(
                            <>
                              <div className="fixed inset-0 z-[100]" aria-hidden onClick={() => setShowGenreDropdown(false)} />
                              <div className="fixed z-[101] w-36 py-1 rounded-lg bg-neutral-500 border border-lavender-600 shadow-xl max-h-52 overflow-y-auto" style={{ top: genreDropdownRect.top, left: genreDropdownRect.left }}>
                                {GENRES.map((g) => (
                                  <button key={g} type="button" onClick={() => { setGenre(g); setShowGenreDropdown(false); }} className={`w-full px-3 py-2 text-left text-xs transition-colors ${genre === g ? "text-jet-black font-medium bg-teal/15" : "text-jet-black hover:bg-lavender-700"}`}>{g}</button>
                                ))}
                              </div>
                            </>,
                            document.body
                          )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <StatefulButton type="button" onClick={async () => { await handleGenerateLyrics(); }} disabled={lyricsLoading || !prompt.trim()} className="!min-w-0 flex-1 !rounded-lg text-xs">
                        {lyricsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Regenerate Lyrics"}
                      </StatefulButton>
                      <button type="button" onClick={() => { setStep("input"); setLyricsResult(null); setStreamingComplete(false); }} className="px-3 py-2 rounded-lg border border-lavender-600 text-xs font-medium text-jet-black hover:bg-lavender-700">
                        Edit Input
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: Lyrics card — separate card */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col min-w-0 min-h-0 h-full"
              >
                {step === "lyrics" && lyricsResult && (
                  <div className="h-full flex flex-col rounded-2xl border-2 border-lavender-600 bg-neutral-500 shadow-lg overflow-hidden min-h-0">
                    <div className="p-4 sm:p-5 border-b border-lavender-600 shrink-0 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-jet-black font-heading text-sm sm:text-base">{lyricsResult.title}</h3>
                        <p className="text-xs text-neutral-300">{lyricsResult.genre} · {langLabel}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {copyrightResult && <CopyrightBadge result={copyrightResult} />}
                        <button
                          type="button"
                          onClick={() => handleCheckCopyright()}
                          disabled={copyrightLoading}
                          className="inline-flex min-w-0 items-center gap-2 whitespace-nowrap rounded-lg border border-lavender-600 bg-transparent px-3 py-2 text-xs font-medium text-jet-black transition-colors hover:bg-lavender-700 disabled:opacity-70"
                        >
                          {copyrightLoading ? (
                            <Loader2 className="w-3 h-3 shrink-0 animate-spin" />
                          ) : (
                            <Shield className="w-3 h-3 shrink-0" />
                          )}
                          Check
                        </button>
                      </div>
                    </div>
                    <div className="flex-1 flex flex-col min-h-0 p-4 sm:p-5">
                      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden rounded-lg bg-lavender-800/50 border border-lavender-600 p-3 sm:p-4">
                        <StreamingLyricsDisplay lyrics={lyricsResult.lyrics} onComplete={() => setStreamingComplete(true)} speed={14} />
                      </div>
                      <StatefulButton type="button" onClick={async () => { await handleGenerateAudio(); }} className="mt-4 shrink-0 !min-w-0 !rounded-lg !py-2 !px-4 text-xs sm:text-sm w-full">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap">
                          <Music className="w-3.5 h-3.5 shrink-0" />
                          Generate Song
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        </span>
                      </StatefulButton>
                    </div>
                  </div>
                )}
                {step === "generating" && (
                  <div className="h-full flex flex-col rounded-2xl border-2 border-lavender-600 bg-neutral-500 shadow-lg overflow-hidden">
                    <div className="flex-1 flex flex-col items-center justify-center py-12 gap-4">
                      <div className="flex items-end justify-center gap-1 h-12">
                        {Array.from({ length: 16 }).map((_, i) => (
                          <div key={i} className="w-1.5 bg-gradient-to-t from-teal to-teal-700 rounded-full" style={{ height: "8px", animation: "sargamWave 0.9s ease-in-out infinite", animationDelay: `${i * 0.06}s` }} />
                        ))}
                      </div>
                      <p className="text-sm font-medium text-jet-black">Composing your song…</p>
                      <p className="text-xs text-neutral-300 text-center max-w-xs">MiniMax Music 2.5 is generating vocals. Usually 30–90 seconds.</p>
                    </div>
                  </div>
                )}
                {step === "done" && track && track.audio_url && lyricsResult && (
                  <div className="h-full flex flex-col rounded-2xl border-2 border-lavender-600 bg-neutral-500 shadow-lg overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-lavender-600 shrink-0">
                      <h3 className="font-semibold text-jet-black font-heading text-sm">{track.title}</h3>
                      <p className="text-xs text-neutral-300">{track.genre} · {langLabel}</p>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
                      <AudioPlayer src={audioSrc(track.audio_url)} title={track.title} genre={track.genre} language={track.language} />
                      <details className="mt-3 group">
                        <summary className="cursor-pointer text-xs font-medium text-teal hover:text-teal-600 select-none list-none flex items-center gap-1">
                          <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" /> View lyrics
                        </summary>
                        <div className="mt-2 max-h-48 overflow-y-auto rounded-lg bg-lavender-700/50 border border-lavender-600 p-3">
                          <LyricsDisplay lyrics={lyricsResult.lyrics} />
                        </div>
                      </details>
                      <button type="button" onClick={reset} className="mt-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-teal text-white text-xs font-semibold hover:bg-teal-600 w-full">
                        <Sparkles className="w-4 h-4" /> Create another
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
          </p>
        )}
      </div>

      <style>{`
        @keyframes sargamWave {
          0%, 100% { height: 8px; }
          50% { height: 40px; }
        }
      `}</style>
    </div>
    </CardSpotlight>
  );
}
