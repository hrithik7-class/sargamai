"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useSession } from "next-auth/react";
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

type Step = "input" | "lyrics" | "generating" | "done";

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
  const { data: session } = useSession();
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
  const [copyrightResult, setCopyrightResult] = useState<CopyrightCheckResponse | null>(null);
  const [track, setTrack] = useState<Track | null>(null);

  const [lyricsLoading, setLyricsLoading] = useState(false);
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

  const startPoll = useCallback(
    (trackId: number) => {
      if (!accessToken) return;
      clearPoll();
      pollRef.current = setInterval(async () => {
        try {
          const updated = await fetchTrack(trackId, accessToken);
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
          // keep polling
        }
      }, 3000);
    },
    [accessToken],
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
      setStep("lyrics");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Lyrics generation failed. Check your API key.");
    } finally {
      setLyricsLoading(false);
    }
  };

  const handleCheckCopyright = async () => {
    if (!lyricsResult || !accessToken) return;
    setCopyrightLoading(true);
    try {
      const result = await checkCopyright(
        { lyrics: lyricsResult.lyrics, title: lyricsResult.title },
        accessToken,
      );
      setCopyrightResult(result);
    } catch {
      // Non-fatal — show nothing
    } finally {
      setCopyrightLoading(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!lyricsResult || !accessToken) return;
    setAudioLoading(true);
    setError(null);
    setStep("generating");
    try {
      const res = await generateAudio(
        {
          lyrics: lyricsResult.lyrics,
          title: lyricsResult.title,
          input_prompt: prompt,
          language,
          genre,
        },
        accessToken,
      );
      const initialTrack = await fetchTrack(res.track_id, accessToken);
      setTrack(initialTrack);
      if (initialTrack.status === "completed") {
        setStep("done");
        setAudioLoading(false);
      } else {
        startPoll(res.track_id);
      }
    } catch (e) {
      setAudioLoading(false);
      setStep("lyrics");
      setError(e instanceof ApiError ? e.message : "Failed to start audio generation.");
    }
  };

  const reset = () => {
    clearPoll();
    setStep("input");
    setPrompt("");
    setLyricsResult(null);
    setCopyrightResult(null);
    setTrack(null);
    setError(null);
    setAudioLoading(false);
  };

  const langLabel = LANGUAGES.find((l) => l.value === language)?.label ?? language;

  return (
    <div className="bg-neutral-500 rounded-xl sm:rounded-2xl border border-lavender-600 shadow-lg overflow-hidden mb-6 sm:mb-8 min-w-0">
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
        {/* ── STEP 1: Input ── */}
        {step === "input" && (
          <>
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-jet-black mb-1.5">
                Your rhymes, lyrics, or theme
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={"Enter rhyme words, a story idea, or partial lyrics…\n\nExample:\ndil dhadke tere naam se\nraat ko tere khwaab aate hain"}
                className="w-full min-w-0 h-32 sm:h-40 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-lavender-800 border border-lavender-600 text-jet-black text-xs sm:text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 min-w-0">
              {/* Language picker - portal so dropdown is not clipped by overflow */}
              <div className="relative">
                <button
                  ref={langTriggerRef}
                  type="button"
                  onClick={() => { setShowLangDropdown(!showLangDropdown); setShowGenreDropdown(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs sm:text-sm font-medium hover:bg-lavender-600 transition-colors"
                >
                  {langLabel}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLangDropdown ? "rotate-180" : ""}`} />
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
                            className={`w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-lavender-700 transition-colors ${language === l.value ? "text-teal font-medium bg-pale-sky-700" : "text-jet-black"}`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>
                    </>,
                    document.body
                  )}
              </div>

              {/* Genre picker - portal so dropdown is not clipped by overflow */}
              <div className="relative">
                <button
                  ref={genreTriggerRef}
                  type="button"
                  onClick={() => { setShowGenreDropdown(!showGenreDropdown); setShowLangDropdown(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs sm:text-sm font-medium hover:bg-lavender-600 transition-colors"
                >
                  {genre}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showGenreDropdown ? "rotate-180" : ""}`} />
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
                            className={`w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-lavender-700 transition-colors ${genre === g ? "text-teal font-medium bg-pale-sky-700" : "text-jet-black"}`}
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
              <button
                type="button"
                onClick={handleGenerateLyrics}
                disabled={lyricsLoading || !prompt.trim()}
                className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-teal text-white text-xs sm:text-sm font-semibold hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
              >
                {lyricsLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating lyrics…</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Lyrics</>
                )}
              </button>
            </div>

            {error && (
              <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </p>
            )}
          </>
        )}

        {/* ── STEP 2: Lyrics preview ── */}
        {step === "lyrics" && lyricsResult && (
          <>
            {/* Title + meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="font-semibold text-jet-black font-heading text-sm sm:text-base">
                  {lyricsResult.title}
                </h3>
                <p className="text-xs text-neutral-300">
                  {lyricsResult.genre} · {langLabel}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {copyrightResult && <CopyrightBadge result={copyrightResult} />}
                <button
                  type="button"
                  onClick={handleCheckCopyright}
                  disabled={copyrightLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-lavender-500 text-xs font-medium text-jet-black hover:bg-lavender-700 transition-colors disabled:opacity-50"
                >
                  {copyrightLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Shield className="w-3 h-3" />
                  )}
                  Check Copyright
                </button>
              </div>
            </div>

            {/* Lyrics scrollable box */}
            <div className="max-h-64 overflow-y-auto rounded-xl bg-lavender-800 border border-lavender-600 p-3 sm:p-4 mb-4 scrollbar-thin">
              <LyricsDisplay lyrics={lyricsResult.lyrics} />
            </div>

            {error && (
              <p className="mb-3 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
              </p>
            )}

            <div className="flex flex-wrap gap-2 justify-between">
              <button
                type="button"
                onClick={() => setStep("input")}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-lavender-500 text-xs sm:text-sm font-medium text-jet-black hover:bg-lavender-700 transition-colors"
              >
                Edit Input
              </button>
              <button
                type="button"
                onClick={handleGenerateAudio}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 rounded-xl bg-teal text-white text-xs sm:text-sm font-semibold hover:bg-teal-600 transition-colors"
              >
                <Music className="w-4 h-4" /> Generate Song
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}

        {/* ── STEP 3: Generating audio ── */}
        {step === "generating" && (
          <div className="flex flex-col items-center py-8 gap-4">
            {/* Animated wave bars */}
            <div className="flex items-end justify-center gap-1 h-12">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-gradient-to-t from-teal to-teal-700 rounded-full"
                  style={{
                    height: "8px",
                    animation: "sargamWave 0.9s ease-in-out infinite",
                    animationDelay: `${i * 0.06}s`,
                  }}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-jet-black">Composing your song…</p>
            <p className="text-xs text-neutral-300 text-center max-w-xs">
              MiniMax Music 2.5 is generating vocals and instruments. This usually takes 30–90 seconds.
            </p>
          </div>
        )}

        {/* ── STEP 4: Done ── */}
        {step === "done" && track && track.audio_url && (
          <>
            <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
              <div>
                <h3 className="font-semibold text-jet-black font-heading text-sm sm:text-base">
                  {track.title}
                </h3>
                <p className="text-xs text-neutral-300">
                  {track.genre} · {langLabel}
                  {track.copyright_safe !== null && (
                    <span className={`ml-2 font-medium ${track.copyright_safe ? "text-teal" : "text-teal-600"}`}>
                      {track.copyright_safe ? "· Copyright safe" : "· Possible match"}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <AudioPlayer
              src={audioSrc(track.audio_url)}
              title={track.title}
              genre={track.genre}
              language={track.language}
            />

            {/* Lyrics toggle */}
            {lyricsResult && (
              <details className="mt-3 group">
                <summary className="cursor-pointer text-xs font-medium text-teal hover:text-teal-600 select-none list-none flex items-center gap-1">
                  <ChevronRight className="w-3.5 h-3.5 group-open:rotate-90 transition-transform" />
                  View lyrics
                </summary>
                <div className="mt-2 max-h-48 overflow-y-auto rounded-xl bg-lavender-800 border border-lavender-600 p-3">
                  <LyricsDisplay lyrics={lyricsResult.lyrics} />
                </div>
              </details>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal text-white text-xs sm:text-sm font-semibold hover:bg-teal-600 transition-colors"
              >
                <Sparkles className="w-4 h-4" /> Create another
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes sargamWave {
          0%, 100% { height: 8px; }
          50% { height: 40px; }
        }
      `}</style>
    </div>
  );
}
