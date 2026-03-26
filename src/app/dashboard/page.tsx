"use client";

import CreateMusicCard from "@/components/CreateMusicCard";

export default function GeneratePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] mx-auto min-w-0 w-full">
      <h1 className="sr-only">Generate Lyrics</h1>
      <CreateMusicCard />
    </div>
  );
}
