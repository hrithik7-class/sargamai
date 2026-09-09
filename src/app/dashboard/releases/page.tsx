"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  ImagePlus,
  Youtube,
  X,
  Copy,
  Download,
  ExternalLink,
} from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import {
  publishTrack,
  unpublishTrack,
  generateCover,
  audioSrc,
  type Track,
} from "@/lib/api";

// Spotify SVG icon
function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

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

function Field({
  label,
  value,
  id,
  multiline,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  id: string;
  multiline?: boolean;
  copied: string | null;
  onCopy: (text: string, key: string) => void;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{label}</span>
        <button
          type="button"
          onClick={() => onCopy(value, id)}
          className="flex items-center gap-1 text-xs text-teal hover:text-teal-600 transition-colors"
        >
          {copied === id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          {copied === id ? "Copied!" : "Copy"}
        </button>
      </div>
      {multiline ? (
        <pre className="text-xs text-jet-black bg-lavender-800/60 border border-lavender-600/40 rounded-lg p-3 whitespace-pre-wrap font-sans leading-relaxed max-h-36 overflow-y-auto">
          {value}
        </pre>
      ) : (
        <div className="text-sm text-jet-black bg-lavender-800/60 border border-lavender-600/40 rounded-lg px-3 py-2">
          {value}
        </div>
      )}
    </div>
  );
}

// ── Distribute Modal ──────────────────────────────────────────────────────
function DistributeModal({
  track,
  platform,
  onClose,
}: {
  track: Track;
  platform: "youtube" | "spotify";
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const youtubeDescription = `🎵 ${track.title}
Genre: ${track.genre} | Language: ${track.language}
Generated with SargamAI — AI-powered music creation.

${track.generated_lyrics ? `Lyrics:\n${track.generated_lyrics.slice(0, 400)}${track.generated_lyrics.length > 400 ? "…" : ""}` : ""}

#${track.genre.replace(/\s/g, "")} #AIMusic #SargamAI #${track.language} #IndieMusic`;

  const youtubeTags = `${track.genre}, AI Music, SargamAI, ${track.language}, ${track.title}, indie music, original song`;

  const spotifyMetadata = `Title: ${track.title}
Artist: Your Artist Name
Genre: ${track.genre}
Language: ${track.language}
Label: Self-Released`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[var(--page-bg)] rounded-2xl border border-lavender-600/40 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`px-5 py-4 flex items-center gap-3 ${platform === "youtube" ? "bg-red-600/10 border-b border-red-600/20" : "bg-green-600/10 border-b border-green-600/20"}`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${platform === "youtube" ? "bg-red-600/20" : "bg-green-600/20"}`}>
            {platform === "youtube"
              ? <Youtube className="w-5 h-5 text-red-500" />
              : <SpotifyIcon className="w-5 h-5 text-green-500" />}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-jet-black text-base font-heading">
              {platform === "youtube" ? "Upload to YouTube" : "Distribute on Spotify"}
            </h3>
            <p className="text-xs text-neutral-400">
              {platform === "youtube"
                ? "Copy the metadata below, then upload on YouTube Studio"
                : "Use a distributor to get on Spotify — metadata is ready"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-lavender-700 transition-colors">
            <X className="w-4 h-4 text-neutral-400" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto max-h-[70vh]">
          {platform === "youtube" ? (
            <>
              <Field label="Title" value={track.title} id="yt-title" copied={copied} onCopy={copy} />
              <Field label="Description" value={youtubeDescription} id="yt-desc" multiline copied={copied} onCopy={copy} />
              <Field label="Tags" value={youtubeTags} id="yt-tags" copied={copied} onCopy={copy} />
              {track.cover_image_url && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">Thumbnail</span>
                  <div className="flex items-center gap-3">
                    <Image src={track.cover_image_url} alt="cover" width={64} height={64} className="rounded-lg object-cover w-16 h-16" />
                    <a
                      href={track.cover_image_url}
                      download={`${track.title}-cover.webp`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-teal hover:text-teal-600 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Thumbnail
                    </a>
                  </div>
                </div>
              )}
              <a
                href="https://studio.youtube.com/channel/upload"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Open YouTube Studio
              </a>
            </>
          ) : (
            <>
              <Field label="Track Metadata" value={spotifyMetadata} id="sp-meta" multiline copied={copied} onCopy={copy} />
              <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                Spotify doesn&apos;t allow direct artist uploads. Use a music distributor to get your track on Spotify for free or a small fee.
              </p>
              <div className="space-y-2.5 mb-4">
                {[
                  { name: "DistroKid", desc: "Unlimited uploads · $22/year", url: "https://distrokid.com", color: "bg-purple-600/10 border-purple-600/30 text-purple-400" },
                  { name: "TuneCore", desc: "Pay per release · Free trial", url: "https://www.tunecore.com", color: "bg-blue-600/10 border-blue-600/30 text-blue-400" },
                  { name: "RouteNote", desc: "Free tier available · Revenue share", url: "https://routenote.com", color: "bg-green-600/10 border-green-600/30 text-green-400" },
                ].map((d) => (
                  <a
                    key={d.name}
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border ${d.color} hover:opacity-80 transition-opacity`}
                  >
                    <div>
                      <p className="font-semibold text-sm text-jet-black">{d.name}</p>
                      <p className="text-xs text-neutral-400">{d.desc}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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
  const [generatingCover, setGeneratingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [distributeModal, setDistributeModal] = useState<"youtube" | "spotify" | null>(null);

  const isPublished = !!track.published_at;
  const gradient = genreGradient(track.genre);

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

  const handleGenerateCover = async () => {
    setGeneratingCover(true);
    setCoverError(null);
    try {
      const updated = await generateCover(track.id, accessToken);
      onUpdate(updated);
    } catch (e: unknown) {
      setCoverError(e instanceof Error ? e.message : "Cover generation failed");
    } finally {
      setGeneratingCover(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      {distributeModal && (
        <DistributeModal
          track={track}
          platform={distributeModal}
          onClose={() => setDistributeModal(null)}
        />
      )}

      <CardSpotlight color="#00d4ff">
        <div className="bg-neutral-500 rounded-xl overflow-hidden shadow-sm flex flex-col">
          {/* Cover art */}
          <div className={`h-36 relative flex items-end p-3 bg-gradient-to-br ${gradient}`}>
            {track.cover_image_url && (
              <Image
                src={track.cover_image_url}
                alt={track.title}
                fill
                className="object-cover"
                sizes="400px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {isPublished && (
              <span className="absolute top-2 left-2 inline-flex items-center gap-1 text-[10px] font-bold bg-teal text-white rounded-full px-2 py-0.5 z-10">
                <Globe className="w-3 h-3" /> Published
              </span>
            )}
            <div className="relative z-10 flex-1 min-w-0">
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

            {/* Published share link */}
            {isPublished && (
              <div className="flex items-center gap-2 rounded-lg bg-teal/10 border border-teal/20 px-3 py-2">
                <Link2 className="w-3.5 h-3.5 text-teal shrink-0" />
                <span className="text-xs text-teal truncate flex-1 font-mono">{shareUrl}</span>
                <button type="button" onClick={handleCopy} className="shrink-0 text-xs font-medium text-teal hover:text-teal-600 transition-colors">
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

            {/* Generate Cover button */}
            <button
              type="button"
              onClick={handleGenerateCover}
              disabled={generatingCover}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium border border-lavender-600/60 text-neutral-300 hover:text-jet-black hover:bg-lavender-700 transition-colors disabled:opacity-50"
            >
              {generatingCover
                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Cover…</>
                : <><ImagePlus className="w-3.5 h-3.5" /> {track.cover_image_url ? "Regenerate Cover" : "Generate Cover Art"}</>
              }
            </button>
            {coverError && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" /> {coverError}
              </p>
            )}

            {/* Distribute buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDistributeModal("youtube")}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600/20 transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" /> YouTube
              </button>
              <button
                type="button"
                onClick={() => setDistributeModal("spotify")}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-green-600/10 border border-green-600/30 text-green-400 hover:bg-green-600/20 transition-colors"
              >
                <SpotifyIcon className="w-3.5 h-3.5" /> Spotify
              </button>
            </div>

            {/* Publish / Unpublish */}
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
      </CardSpotlight>
    </>
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
              Publish tracks, generate cover art, and distribute to YouTube & Spotify.
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
          <CardSpotlight key={s.label} color="#00d4ff">
            <div className="rounded-xl bg-neutral-500 px-3 sm:px-4 py-2.5 sm:py-3">
              <p className={`text-xl sm:text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
              <p className="text-[11px] sm:text-xs text-neutral-300 mt-0.5">{s.label}</p>
            </div>
          </CardSpotlight>
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
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4 rounded-xl border-2 border-dotted border-lavender-600 bg-neutral-500/30">
          <div className="w-20 h-20 rounded-3xl bg-lavender-700 flex items-center justify-center">
            <UploadCloud className="w-10 h-10 text-teal" />
          </div>
          <div>
            <p className="font-semibold text-jet-black text-lg font-heading">No completed tracks yet</p>
            <p className="text-sm text-neutral-300 max-w-xs mt-1">
              Generate a song first, then come back here to publish and distribute it.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal text-white text-sm font-semibold hover:bg-teal-600 transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Generate a Track
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
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
                    <ReleaseCard key={track.id} track={track} accessToken={accessToken} onUpdate={handleUpdate} />
                  ) : null,
                )}
              </div>
            </section>
          )}

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
                    <ReleaseCard key={track.id} track={track} accessToken={accessToken} onUpdate={handleUpdate} />
                  ) : null,
                )}
              </div>
            </section>
          )}

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
                  <CardSpotlight key={track.id} color="#00d4ff">
                    <div className="bg-neutral-500 rounded-xl p-4 flex items-center gap-3 opacity-60">
                      <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center shrink-0">
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
                  </CardSpotlight>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
