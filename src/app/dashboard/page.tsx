"use client";

import { Sparkles } from "lucide-react";
import CreateMusicCard from "@/components/CreateMusicCard";

export default function GeneratePage() {
  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1000px] mx-auto min-w-0">
      <div className="mb-5 sm:mb-7 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal/15 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-teal" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-jet-black font-heading leading-tight">
            Generate Lyrics
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300">
            Paste rhyme words or partial lines — the AI writes the full song and sings it.
          </p>
        </div>
      </div>

      <CreateMusicCard />
    </div>
  );
}
