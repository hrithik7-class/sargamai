"use client";

import { create } from "zustand";

interface PlayerState {
  /** The `src` URL of the currently playing track, or null if none is playing. */
  playingId: string | null;
  setPlaying: (id: string | null) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  playingId: null,
  setPlaying: (id) => set({ playingId: id }),
}));
