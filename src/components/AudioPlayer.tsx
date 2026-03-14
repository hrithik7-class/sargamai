"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw, Download } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";

interface AudioPlayerProps {
  src: string;
  title: string;
  genre?: string;
  language?: string;
}

function fmt(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer({ src, title, genre, language }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const playingId = usePlayerStore((s) => s.playingId);
  const setPlaying = usePlayerStore((s) => s.setPlaying);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Pause this player when another track starts elsewhere
  useEffect(() => {
    if (playingId !== null && playingId !== src && isPlaying) {
      audioRef.current?.pause();
    }
  }, [playingId, src, isPlaying]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setPlaying(null);
    } else {
      setIsLoading(true);
      setPlaying(src);
      try {
        await audio.play();
      } catch {
        setError(true);
        setPlaying(null);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isPlaying, src, setPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const restart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `${title}.mp3`;
    a.click();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setPlaying(null);
    };
    const onError = () => setError(true);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, [setPlaying]);

  return (
    <div className="rounded-xl bg-lavender-800 border border-lavender-600 overflow-hidden">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="p-3 sm:p-4">
        {/* Top row: play button + info + time */}
        <div className="flex items-center gap-3 mb-3">
          <button
            type="button"
            onClick={togglePlay}
            disabled={error}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-teal text-white flex items-center justify-center hover:bg-teal-600 active:scale-95 transition-all disabled:opacity-40 shrink-0 shadow-md"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-jet-black truncate text-sm sm:text-base leading-tight">
              {title}
            </p>
            {(genre || language) && (
              <p className="text-[11px] sm:text-xs text-neutral-300 truncate mt-0.5">
                {[genre, language && language !== "auto" ? language.charAt(0).toUpperCase() + language.slice(1) : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>

          <span className="text-xs text-neutral-300 shrink-0 tabular-nums">
            {fmt(currentTime)} / {fmt(duration)}
          </span>
        </div>

        {/* Progress bar */}
        <div
          role="slider"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onClick={handleSeek}
          className="h-2 rounded-full bg-lavender-600 cursor-pointer relative group"
          onKeyDown={(e) => {
            const audio = audioRef.current;
            if (!audio) return;
            if (e.key === "ArrowRight") audio.currentTime = Math.min(duration, currentTime + 5);
            if (e.key === "ArrowLeft") audio.currentTime = Math.max(0, currentTime - 5);
          }}
        >
          <div
            className="h-full rounded-full bg-teal transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-teal border-2 border-white shadow opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Bottom: action buttons */}
        <div className="flex items-center gap-2 mt-2.5 justify-end">
          <button
            type="button"
            onClick={restart}
            aria-label="Restart"
            className="p-1.5 rounded-lg text-neutral-300 hover:text-jet-black hover:bg-lavender-600 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={download}
            aria-label="Download"
            className="p-1.5 rounded-lg text-neutral-300 hover:text-jet-black hover:bg-lavender-600 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1 text-center">
            Could not load audio. Try downloading instead.
          </p>
        )}
      </div>
    </div>
  );
}
