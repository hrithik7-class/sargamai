"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useTracksStore } from "@/store/useTracksStore";
import {
  Package,
  Music,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Globe,
  Link2,
  Check,
  UploadCloud,
  Lock,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import {
  publishTrack,
  unpublishTrack,
  audioSrc,
  type Track,
} from "@/lib/api";

// ── Genre → gradient ──────────────────────────────────────────────────────
const GENRE_GRADIENTS: Record<string, string> = {
  bollywood: "from-purple-600 to-pink-500",
  rock: "from-slate-700 to-red-600",
  pop: "from-teal-500 to-blue-500",
  classical: "from-teal-400 to-teal-600",
  jazz: "from-indigo-700 to-violet-500",
  hiphop: "from-zinc-700 to-orange-500",
  "hip-hop": "from-zinc-700 to-orange-500",
  folk: "from-green-700 to-emerald-400",
  edm: "from-cyan-500 to-fuchsia-500",
  rb: "from-rose-700 to-pink-400",
  "r&b": "from-rose-700 to-pink-400",
  default: "from-teal-600 to-indigo-600",
};
const genreGradient = (genre: string) =>
  GENRE_GRADIENTS[genre.toLowerCase().trim()] ?? GENRE_GRADIENTS.default;

// ── Release card ──────────────────────────────────────────────────────────
function ReleaseCard({
  track,
  accessToken,
  onUpdate,
}: {
  track: Track;
  accessToken: string;
  onUpdate: (updated: Track) => void;
}) {
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPublished = !!track.published_at;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/play/${track.id}`
      : `/play/${track.id}`;

  const handlePublishToggle = async () => {
    setPublishing(true);
    try {
      const updated = isPublished
        ? await unpublishTrack(track.id, accessToken)
        : await publishTrack(track.id, accessToken);
      onUpdate(updated);
    } catch {
      // silently keep current state
    } finally {
      setPublishing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-neutral-500 rounded-xl border border-lavender-600 overflow-hidden shadow-sm flex flex-col">
      {/* Cover art */}
      <div className={`h-32 bg-gradient-to-br ${genreGradient(track.genre)} relative flex items-end p-3`}>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Published badge */}
        {isPublished && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold bg-teal text-white rounded-full px-2 py-0.5">
            <Globe className="w-3 h-3" /> Published
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-base leading-tight truncate drop-shadow">
            {track.title}
          </p>
          <p className="text-white/70 text-xs truncate mt-0.5">
            {track.genre} · {track.language}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-3 flex-1">
        {/* Meta */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-neutral-300">
          <span>
            {new Date(track.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          {track.copyright_safe !== null && track.copyright_safe !== undefined && (
            track.copyright_safe ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal bg-teal/10 border border-teal/20 rounded-full px-2 py-0.5">
                <ShieldCheck className="w-3 h-3" /> Safe
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal bg-teal/10 border border-teal-600/50 rounded-full px-2 py-0.5">
                <ShieldAlert className="w-3 h-3" /> Review
              </span>
            )
          )}
        </div>

        {/* Published info / share link */}
        {isPublished && (
          <div className="flex items-center gap-2 rounded-lg bg-teal/10 border border-teal/20 px-3 py-2">
            <Link2 className="w-3.5 h-3.5 text-teal shrink-0" />
            <span className="text-xs text-teal truncate flex-1 font-mono">{shareUrl}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 text-xs font-medium text-teal hover:text-teal-600 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Link2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}

        {/* Audio player */}
        {track.audio_url && (
          <AudioPlayer
            src={audioSrc(track.audio_url)}
            title={track.title}
            genre={track.genre}
            language={track.language}
          />
        )}

        {/* Publish / Unpublish button */}
        <button
          type="button"
          onClick={handlePublishToggle}
          disabled={publishing}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
            isPublished
              ? "bg-lavender-700 text-jet-black hover:bg-lavender-600"
              : "bg-teal text-white hover:bg-teal-600"
          }`}
        >
          {publishing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPublished ? (
            <Lock className="w-4 h-4" />
          ) : (
            <UploadCloud className="w-4 h-4" />
          )}
          {publishing ? "Updating…" : isPublished ? "Unpublish" : "Publish"}
        </button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function ReleasesPage() {
  const { accessToken } = useAuthStore();
  const { tracks, loading, error, fetchTracks, upsertTrack } = useTracksStore();

  useEffect(() => {
    if (accessToken) fetchTracks(accessToken);
  }, [accessToken, fetchTracks]);

  const handleUpdate = (updated: Track) => upsertTrack(updated);

  const completedTracks = tracks.filter((t) => t.status === "completed");
  const publishedTracks = completedTracks.filter((t) => !!t.published_at);
  const unpublishedTracks = completedTracks.filter((t) => !t.published_at);
  const inProgressTracks = tracks.filter(
    (t) => t.status === "generating_audio" || t.status === "pending",
  );

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-w-0">
      {/* Page header */}
      <div className="mb-5 sm:mb-7 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal/15 flex items-center justify-center">
            <Package className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-jet-black font-heading leading-tight">
              Releases
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300">
              Publish your completed tracks and share them with a link.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => accessToken && fetchTracks(accessToken)}
          disabled={loading}
          className="p-2 rounded-lg text-neutral-300 hover:text-jet-black hover:bg-lavender-700 transition-colors disabled:opacity-50"
          aria-label="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-5 sm:mb-6">
        {[
          { label: "Completed Tracks", value: completedTracks.length, color: "text-teal" },
          { label: "Published", value: publishedTracks.length, color: "text-green-600" },
          { label: "Unpublished", value: unpublishedTracks.length, color: "text-neutral-300" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-lavender-600 bg-neutral-500 px-3 sm:px-4 py-2.5 sm:py-3">
            <p className={`text-xl sm:text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-[11px] sm:text-xs text-neutral-300 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800 px-3 py-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
          <button type="button" onClick={() => accessToken && fetchTracks(accessToken)} className="ml-auto text-xs font-medium text-red-400 underline">Retry</button>
        </div>
      )}

      {loading && tracks.length === 0 ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-teal animate-spin" />
        </div>
      ) : completedTracks.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal/20 to-teal-600/20 flex items-center justify-center">
            <UploadCloud className="w-10 h-10 text-teal" />
          </div>
          <div>
            <p className="font-semibold text-jet-black text-lg font-heading">No completed tracks yet</p>
            <p className="text-sm text-neutral-300 max-w-xs mt-1">
              Generate a song first, then come back here to publish it.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-600 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4" /> Generate a Track
          </Link>
        </div>
      ) : (
        <div className="space-y-8">

          {/* ── Published tracks ────────────────────────────────── */}
          {publishedTracks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-teal" />
                <h2 className="text-base font-semibold text-jet-black font-heading">
                  Published ({publishedTracks.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {publishedTracks.map((track) =>
                  accessToken ? (
                    <ReleaseCard
                      key={track.id}
                      track={track}
                      accessToken={accessToken}
                      onUpdate={handleUpdate}
                    />
                  ) : null,
                )}
              </div>
            </section>
          )}

          {/* ── Ready to publish ──────────────────────────────── */}
          {unpublishedTracks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-teal" />
                <h2 className="text-base font-semibold text-jet-black font-heading">
                  Ready to Publish ({unpublishedTracks.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {unpublishedTracks.map((track) =>
                  accessToken ? (
                    <ReleaseCard
                      key={track.id}
                      track={track}
                      accessToken={accessToken}
                      onUpdate={handleUpdate}
                    />
                  ) : null,
                )}
              </div>
            </section>
          )}

          {/* ── In Progress ──────────────────────────────────── */}
          {inProgressTracks.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Loader2 className="w-4 h-4 text-teal animate-spin" />
                <h2 className="text-base font-semibold text-jet-black font-heading">
                  In Progress ({inProgressTracks.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {inProgressTracks.map((track) => (
                  <div key={track.id} className="bg-neutral-500 rounded-xl border border-lavender-600 p-4 flex items-center gap-3 opacity-60">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${genreGradient(track.genre)} flex items-center justify-center shrink-0`}>
                      <Music className="w-4 h-4 text-white/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-jet-black truncate text-sm">{track.title}</p>
                      <p className="text-[11px] text-neutral-300 truncate">{track.genre} · {track.language}</p>
                    </div>
                    <span className="text-xs font-medium text-teal bg-teal/10 border border-teal-600/50 rounded-full px-2 py-0.5 shrink-0">
                      Generating…
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
