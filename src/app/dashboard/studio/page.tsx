"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  Mic2,
  Music2,
  Upload,
  Play,
  Volume2,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";

const MUSIC_STYLES = [
  { id: "r&b", label: "R&B", desc: "Smooth grooves and soul" },
  { id: "bass", label: "Bass", desc: "Deep low-end focus" },
  { id: "pop", label: "Pop", desc: "Catchy and bright" },
  { id: "acoustic", label: "Acoustic", desc: "Organic and warm" },
  { id: "electronic", label: "Electronic", desc: "Synths and beats" },
  { id: "hiphop", label: "Hip-hop", desc: "Beats and flow" },
  { id: "jazz", label: "Jazz", desc: "Swing and improv" },
  { id: "bollywood", label: "Bollywood", desc: "Cinematic and lush" },
];

export default function StudioPage() {
  const [voiceLevel, setVoiceLevel] = useState(80);
  const [musicLevel, setMusicLevel] = useState(70);
  const [selectedStyle, setSelectedStyle] = useState(MUSIC_STYLES[0]);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [musicSource, setMusicSource] = useState<"generate" | "upload" | null>(null);
  const [isMixing, setIsMixing] = useState(false);
  const [mixedDone, setMixedDone] = useState(false);

  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("audio/")) setVoiceFile(f);
  };

  const handleMix = () => {
    setIsMixing(true);
    setMixedDone(false);
    setTimeout(() => {
      setIsMixing(false);
      setMixedDone(true);
    }, 2000);
  };

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1000px] mx-auto min-w-0">
      <div className="mb-6 sm:mb-8 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal/15 flex items-center justify-center">
          <SlidersHorizontal className="w-5 h-5 text-teal" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-jet-black font-heading leading-tight">
            Studio
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            Mix your singing with music — R&B, bass, and more. Use your voice and AI music to create your own track.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Voice track */}
        <section className="rounded-xl border border-lavender-600 bg-neutral-500/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-lavender-600 flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-teal" />
            <span className="font-semibold text-jet-black">Your voice (singing)</span>
          </div>
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
            <div className="flex-1 flex flex-col gap-2">
              <p className="text-sm text-neutral-300">Upload or record your vocals to sing over the music.</p>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lavender-700 text-jet-black text-sm font-medium cursor-pointer hover:bg-lavender-600 transition-colors">
                  <Upload className="w-4 h-4" />
                  Upload vocal
                  <input
                    type="file"
                    accept="audio/*"
                    className="sr-only"
                    onChange={handleVoiceUpload}
                  />
                </label>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-teal/20 text-teal text-sm font-medium hover:bg-teal/30 transition-colors"
                  aria-label="Record vocal"
                >
                  <Mic2 className="w-4 h-4" />
                  Record
                </button>
              </div>
              {voiceFile && (
                <p className="text-xs text-teal">
                  Added: {voiceFile.name}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Volume2 className="w-5 h-5 text-neutral-400" aria-hidden />
              <input
                type="range"
                min={0}
                max={100}
                value={voiceLevel}
                onChange={(e) => setVoiceLevel(Number(e.target.value))}
                className="w-24 h-2 rounded-full appearance-none bg-lavender-600 accent-teal"
              />
              <span className="text-xs text-neutral-400 w-8">{voiceLevel}%</span>
            </div>
          </div>
        </section>

        {/* Music track */}
        <section className="rounded-xl border border-lavender-600 bg-neutral-500/50 overflow-hidden">
          <div className="px-4 py-3 border-b border-lavender-600 flex items-center gap-2">
            <Music2 className="w-5 h-5 text-teal" />
            <span className="font-semibold text-jet-black">Music</span>
          </div>
          <div className="p-4 sm:p-6 flex flex-col gap-4">
            <p className="text-sm text-neutral-300">Choose a style and add AI-generated or your own music to mix with your voice.</p>

            {/* Style selector */}
            <div className="flex flex-wrap gap-2">
              {MUSIC_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedStyle.id === style.id
                      ? "bg-teal text-white"
                      : "bg-lavender-700 text-jet-black hover:bg-lavender-600"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-400">{selectedStyle.desc}</p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setMusicSource("generate")}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  musicSource === "generate"
                    ? "bg-teal text-white"
                    : "bg-lavender-700 text-jet-black hover:bg-lavender-600"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Generate {selectedStyle.label} music
              </button>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-lavender-700 text-jet-black text-sm font-medium cursor-pointer hover:bg-lavender-600 transition-colors">
                <Upload className="w-4 h-4" />
                Upload track
                <input
                  type="file"
                  accept="audio/*"
                  className="sr-only"
                  onChange={() => setMusicSource("upload")}
                />
              </label>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-neutral-400" aria-hidden />
              <input
                type="range"
                min={0}
                max={100}
                value={musicLevel}
                onChange={(e) => setMusicLevel(Number(e.target.value))}
                className="w-24 h-2 rounded-full appearance-none bg-lavender-600 accent-teal"
              />
              <span className="text-xs text-neutral-400 w-8">{musicLevel}%</span>
            </div>
          </div>
        </section>

        {/* Mix CTA */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between rounded-xl border border-lavender-600 bg-lavender-700/30 p-4 sm:p-6">
          <div>
            <h2 className="font-semibold text-jet-black mb-1">Create your track</h2>
            <p className="text-sm text-neutral-300">
              Blend your voice and music into one track, or use AI music as backing for your singing.
            </p>
          </div>
          <button
            type="button"
            onClick={handleMix}
            disabled={isMixing}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-teal text-white font-semibold hover:bg-teal-600 transition-colors disabled:opacity-70 shrink-0"
          >
            {isMixing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mixing…
              </>
            ) : mixedDone ? (
              "Mix again"
            ) : (
              <>
                <Play className="w-5 h-5" />
                Mix & create
              </>
            )}
          </button>
        </div>

        {mixedDone && (
          <div className="rounded-xl border border-teal/30 bg-teal/10 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center">
              <Music2 className="w-5 h-5 text-teal" />
            </div>
            <div>
              <p className="font-medium text-jet-black">Your mix is ready</p>
              <p className="text-sm text-neutral-300">Save or export from Library when backend is connected.</p>
            </div>
            <Link
              href="/dashboard/library"
              className="ml-auto text-sm font-medium text-teal hover:text-teal-600 transition-colors"
            >
              Open Library →
            </Link>
          </div>
        )}

        <p className="text-xs text-neutral-400">
          Studio mixes are saved to your Library. Connect your microphone to record; upload WAV or MP3 for best quality.
        </p>
      </div>
    </div>
  );
}
