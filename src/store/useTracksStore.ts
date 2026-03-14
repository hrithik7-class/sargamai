"use client";

import { create } from "zustand";
import { fetchTracks, type Track } from "@/lib/api";

interface TracksState {
  tracks: Track[];
  loading: boolean;
  error: string | null;
  /** Fetch all tracks for the user; replaces the current list. */
  fetchTracks: (token: string) => Promise<void>;
  /** Remove a track by id from the local cache. */
  removeTrack: (id: number) => void;
  /** Insert or update a track in place (used by the polling loop). */
  upsertTrack: (track: Track) => void;
}

export const useTracksStore = create<TracksState>((set, get) => ({
  tracks: [],
  loading: false,
  error: null,

  async fetchTracks(token) {
    set({ loading: true, error: null });
    try {
      const res = await fetchTracks(token);
      set({ tracks: res.tracks, loading: false });
    } catch (err: any) {
      set({ error: err?.message ?? "Failed to load tracks", loading: false });
    }
  },

  removeTrack(id) {
    set((state) => ({ tracks: state.tracks.filter((t) => t.id !== id) }));
  },

  upsertTrack(track) {
    set((state) => {
      const idx = state.tracks.findIndex((t) => t.id === track.id);
      if (idx >= 0) {
        const updated = [...state.tracks];
        updated[idx] = track;
        return { tracks: updated };
      }
      return { tracks: [track, ...state.tracks] };
    });
  },
}));
