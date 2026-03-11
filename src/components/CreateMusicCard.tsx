"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Loader2, Play, Pause, Music, ChevronDown } from "lucide-react";

const genres = [
  "Pop",
  "Rock",
  "Hip-Hop",
  "R&B",
  "Jazz",
  "Electronic",
  "Country",
  "Folk",
  "Indie",
  "Classical",
];

type GeneratedTrack = {
  id: string;
  title: string;
  genre: string;
  duration: string;
  lyricsPreview: string;
};

export default function CreateMusicCard() {
  const [lyrics, setLyrics] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<GeneratedTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleGenerate = () => {
    if (!lyrics.trim()) return;
    setIsGenerating(true);
    setGeneratedTrack(null);
    // Simulate AI generation (replace with real API later)
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedTrack({
        id: `track-${Date.now()}`,
        title: "Generated Track",
        genre,
        duration: "3:24",
        lyricsPreview: lyrics.slice(0, 80) + (lyrics.length > 80 ? "..." : ""),
      });
      setProgress(0);
    }, 3000);
  };

  const togglePlay = () => {
    if (!generatedTrack) return;
    setIsPlaying((p) => !p);
  };

  useEffect(() => {
    if (!isPlaying || !generatedTrack) {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      return;
    }
    progressInterval.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (progressInterval.current) clearInterval(progressInterval.current);
          setIsPlaying(false);
          return 0;
        }
        return p + 0.5;
      });
    }, 100);
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, [isPlaying, generatedTrack]);

  return (
    <div className="bg-neutral-500 rounded-xl sm:rounded-2xl border border-lavender-600 shadow-lg overflow-hidden mb-6 sm:mb-8 min-w-0">
      {/* Header */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-lavender-600 flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-teal flex items-center justify-center shrink-0">
          <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-jet-black font-heading text-sm sm:text-base truncate">Create music from lyrics</h2>
          <p className="text-[10px] sm:text-xs text-neutral-300 truncate">Enter your lyrics or rhymes — AI will generate and play the track</p>
        </div>
      </div>

      <div className="p-3 sm:p-6 min-w-0">
        {/* Lyrics / Rhymes input */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-medium text-jet-black mb-1.5 sm:mb-2">Lyrics or rhymes</label>
          <textarea
            value={lyrics}
            onChange={(e) => setLyrics(e.target.value)}
            placeholder="Paste your lyrics or write rhymes here...

Example:
Walking through the city lights
Everything feels so right
With you beside me through the night..."
            className="w-full min-w-0 h-32 sm:h-40 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-lavender-800 border border-lavender-600 text-jet-black text-xs sm:text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Genre + Generate */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6 min-w-0">
          <div className="relative flex-1 sm:flex-initial">
            <button
              type="button"
              onClick={() => setShowGenreDropdown(!showGenreDropdown)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs sm:text-sm font-medium hover:bg-lavender-600 transition-colors"
            >
              {genre}
              <ChevronDown className={`w-4 h-4 transition-transform ${showGenreDropdown ? "rotate-180" : ""}`} />
            </button>
            {showGenreDropdown && (
              <>
                <div className="fixed inset-0 z-10" aria-hidden onClick={() => setShowGenreDropdown(false)} />
                <div className="absolute top-full left-0 mt-1 w-full min-w-[140px] max-w-[200px] py-1 rounded-lg bg-neutral-500 border border-lavender-600 shadow-xl z-20 max-h-48 overflow-y-auto">
                  {genres.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGenre(g);
                        setShowGenreDropdown(false);
                      }}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-lavender-700 transition-colors ${
                        genre === g ? "bg-pale-sky-700 text-teal font-medium" : "text-jet-black"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !lyrics.trim()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-jet-black text-white text-xs sm:text-sm font-semibold hover:bg-jet-black-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating music...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate & play
              </>
            )}
          </button>
        </div>

        {/* Generated track + player */}
        {generatedTrack && (
          <div className="rounded-lg sm:rounded-xl bg-lavender-800 border border-lavender-600 overflow-hidden min-w-0">
            <div className="p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 min-w-0">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-teal text-white flex items-center justify-center hover:bg-teal-600 transition-colors shrink-0 shadow-lg flex-shrink-0"
                >
                  {isPlaying ? <Pause className="w-6 h-6 sm:w-7 sm:h-7" /> : <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-0.5" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-jet-black truncate text-sm sm:text-base">{generatedTrack.title}</p>
                  <p className="text-[10px] sm:text-xs text-neutral-300">
                    {generatedTrack.genre} · {generatedTrack.duration}
                  </p>
                  {generatedTrack.lyricsPreview && (
                    <p className="text-[10px] sm:text-xs text-neutral-300 mt-0.5 truncate">{generatedTrack.lyricsPreview}</p>
                  )}
                </div>
              </div>
              <span className="text-xs sm:text-sm text-neutral-300 shrink-0 text-right">
                {Math.floor((progress / 100) * 204 / 60)}:{(Math.floor((progress / 100) * 204 % 60)).toString().padStart(2, "0")} / {generatedTrack.duration}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 bg-lavender-700">
              <div
                className="h-full bg-teal transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
