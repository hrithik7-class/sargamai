"use client";

import { Sparkles, ChevronRight } from "lucide-react";
import CreateMusicCard from "@/components/CreateMusicCard";

export default function GeneratePage() {
  return (
    <div className="min-h-full bg-[var(--page-bg)]">
      {/* Page header */}
      <div className="px-4 sm:px-6 lg:px-10 pt-8 pb-7 border-b border-lavender-600/40">
        <div className="max-w-[1140px] mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-teal/15 border border-teal/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-teal" />
            </div>
            <span className="text-xs font-semibold text-teal uppercase tracking-widest">AI Studio</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-xs text-neutral-400">Generate Lyrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-jet-black leading-tight">
            Generate Lyrics
          </h1>
          <p className="text-sm text-neutral-400 mt-1.5 max-w-md">
            Describe your idea in plain words — AI writes studio-quality lyrics in seconds.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-10 py-8 max-w-[1140px] mx-auto">
        <CreateMusicCard />
      </div>
    </div>
  );
}
