"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useTracksStore } from "@/store/useTracksStore";
import {
  Music,
  Search,
  Headphones,
  Trash2,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List,
  ChevronDown,
  ChevronUp,
  FileDown,
  Download,
  Filter,
  Sparkles,
  Library,
} from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import { deleteTrack, audioSrc, type Track } from "@/lib/api";
import { downloadLyricsPdf } from "@/lib/pdf";

// ── Genre → gradient mapping ──────────────────────────────────────────────
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

function genreGradient(genre: string) {
  const key = genre.toLowerCase().trim();
  return GENRE_GRADIENTS[key] ?? GENRE_GRADIENTS.default;
}

function statusIcon(status: Track["status"]) {
  switch (status) {
    case "completed": return <CheckCircle2 className="w-3.5 h-3.5 text-teal" />;
    case "failed": return <XCircle className="w-3.5 h-3.5 text-red-400" />;
    case "generating_audio":
    case "pending": return <Loader2 className="w-3.5 h-3.5 text-teal animate-spin" />;
    default: return <Clock className="w-3.5 h-3.5 text-neutral-300" />;
  }
}

function statusLabel(status: Track["status"]) {
  switch (status) {
    case "completed": return "Ready";
    case "failed": return "Failed";
    case "generating_audio": return "Generating…";
    case "pending": return "Queued";
    default: return status;
  }
}

function statusColor(status: Track["status"]) {
  switch (status) {
    case "completed": return "text-teal bg-teal/10 border-teal/20";
    case "failed": return "text-red-400 bg-red-400/10 border-red-400/20";
    default: return "text-teal bg-teal/10 border-teal-600/50";
  }
}

function LyricsPanel({ lyrics }: { lyrics: string }) {
  const segments = useMemo(() => {
    const result: { tag: string | null; lines: string[] }[] = [];
    let currentTag: string | null = null;
    let currentLines: string[] = [];
    for (const line of lyrics.split("\n")) {
      const m = line.match(/^\[(.+?)\]$/);
      if (m) {
        if (currentLines.length > 0 || currentTag !== null) {
          result.push({ tag: currentTag, lines: currentLines });
        }
        currentTag = m[1];
        currentLines = [];
      } else {
        currentLines.push(line);
      }
    }
    if (currentLines.length > 0 || currentTag !== null) {
      result.push({ tag: currentTag, lines: currentLines });
    }
    return result;
  }, [lyrics]);

  return (
    <div className="space-y-4">
      {segments.map((seg, i) => (
        <div key={i}>
          {seg.tag && (
            <span className="inline-block text-[10px] font-bold tracking-widest uppercase text-teal border border-teal/30 bg-teal/10 rounded px-2 py-0.5 mb-1.5">
              {seg.tag}
            </span>
          )}
          <div className="space-y-0.5">
            {seg.lines.map((line, j) =>
              line.trim() === "" ? (
                <div key={j} className="h-2" />
              ) : (
                <p key={j} className="text-sm leading-relaxed text-jet-black/80">{line}</p>
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function GridCard({
  track, onDelete, accessToken,
}: { track: Track; onDelete: (id: number) => void; accessToken: string }) {
  const [deleting, setDeleting] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${track.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteTrack(track.id, accessToken);
      onDelete(track.id);
    } catch {
      setDeleting(false);
    }
  };

  const handlePdf = async () => {
    if (!track.generated_lyrics) return;
    setPdfLoading(true);
    try { await downloadLyricsPdf(track); } finally { setPdfLoading(false); }
  };

  return (
    <div className="bg-neutral-500 rounded-xl border border-lavender-600 overflow-hidden shadow-sm flex flex-col">
      <div className={`h-28 bg-gradient-to-br ${genreGradient(track.genre)} flex items-end p-3 relative`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-base leading-tight truncate drop-shadow">{track.title}</p>
          <p className="text-white/70 text-xs truncate mt-0.5">{track.genre} · {track.language}</p>
        </div>
        <span className={`absolute top-2 right-2 inline-flex items-center gap-1 text-[10px] font-semibold border rounded-full px-2 py-0.5 ${statusColor(track.status)}`}>
          {statusIcon(track.status)} {statusLabel(track.status)}
        </span>
      </div>

      <div className="p-3 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-neutral-300">
            {new Date(track.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
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

        {track.status === "completed" && track.audio_url ? (
          <AudioPlayer src={audioSrc(track.audio_url)} title={track.title} genre={track.genre} language={track.language} />
        ) : track.status === "failed" ? (
          <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800 px-3 py-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-xs text-red-400 truncate">{track.error_message ?? "Audio generation failed"}</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-lg bg-lavender-800 border border-lavender-600 px-3 py-2.5">
            <Loader2 className="w-4 h-4 text-teal animate-spin shrink-0" />
            <p className="text-xs text-neutral-300">Generating audio…</p>
          </div>
        )}

        <div className="flex items-center gap-1.5 border-t border-lavender-600 pt-2.5 mt-auto">
          {track.status === "completed" && track.audio_url && (
            <a href={audioSrc(track.audio_url)} download={`${track.title}.mp3`} className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-teal transition-colors px-2 py-1.5 rounded-lg hover:bg-lavender-700">
              <Download className="w-3.5 h-3.5" /> MP3
            </a>
          )}
          {track.generated_lyrics && (
            <button type="button" onClick={handlePdf} disabled={pdfLoading} className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-teal transition-colors px-2 py-1.5 rounded-lg hover:bg-lavender-700 disabled:opacity-50">
              {pdfLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />} PDF
            </button>
          )}
          {track.generated_lyrics && (
            <button type="button" onClick={() => setLyricsOpen((o) => !o)} className="flex items-center gap-1 text-xs font-medium text-neutral-300 hover:text-jet-black transition-colors px-2 py-1.5 rounded-lg hover:bg-lavender-700 ml-auto">
              {lyricsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {lyricsOpen ? "Hide" : "Lyrics"}
            </button>
          )}
          <button type="button" onClick={handleDelete} disabled={deleting} aria-label="Delete track" className={`p-1.5 rounded-lg text-neutral-300 hover:text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-40 ${track.generated_lyrics ? "" : "ml-auto"}`}>
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {lyricsOpen && track.generated_lyrics && (
          <div className="border-t border-lavender-600 pt-3 max-h-64 overflow-y-auto">
            <LyricsPanel lyrics={track.generated_lyrics} />
          </div>
        )}
      </div>
    </div>
  );
}

function ListRow({
  track, onDelete, accessToken,
}: { track: Track; onDelete: (id: number) => void; accessToken: string }) {
  const [deleting, setDeleting] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${track.title}"?`)) return;
    setDeleting(true);
    try {
      await deleteTrack(track.id, accessToken);
      onDelete(track.id);
    } catch {
      setDeleting(false);
    }
  };

  const handlePdf = async () => {
    if (!track.generated_lyrics) return;
    setPdfLoading(true);
    try { await downloadLyricsPdf(track); } finally { setPdfLoading(false); }
  };

  return (
    <div className="bg-neutral-500 rounded-xl border border-lavender-600 overflow-hidden">
      <div className="flex items-center gap-3 sm:gap-4 px-4 py-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${genreGradient(track.genre)} flex items-center justify-center shrink-0`}>
          <Music className="w-4 h-4 text-white/80" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-jet-black truncate text-sm">{track.title}</p>
          <p className="text-[11px] text-neutral-300 truncate">
            {track.genre} · {track.language} · {new Date(track.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
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
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold border rounded-full px-2 py-0.5 ${statusColor(track.status)}`}>
            {statusIcon(track.status)} {statusLabel(track.status)}
          </span>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {track.status === "completed" && track.audio_url && (
            <a href={audioSrc(track.audio_url)} download={`${track.title}.mp3`} aria-label="Download MP3" className="p-1.5 rounded-lg text-neutral-300 hover:text-teal hover:bg-lavender-700 transition-colors">
              <Download className="w-4 h-4" />
            </a>
          )}
          {track.generated_lyrics && (
            <button type="button" onClick={handlePdf} disabled={pdfLoading} aria-label="Download PDF" className="p-1.5 rounded-lg text-neutral-300 hover:text-teal hover:bg-lavender-700 transition-colors disabled:opacity-50">
              {pdfLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            </button>
          )}
          {track.generated_lyrics && (
            <button type="button" onClick={() => setLyricsOpen((o) => !o)} aria-label="Toggle lyrics" className="p-1.5 rounded-lg text-neutral-300 hover:text-jet-black hover:bg-lavender-700 transition-colors">
              {lyricsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button type="button" onClick={handleDelete} disabled={deleting} aria-label="Delete" className="p-1.5 rounded-lg text-neutral-300 hover:text-red-400 hover:bg-red-950/40 transition-colors disabled:opacity-40">
            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {track.status === "completed" && track.audio_url && (
        <div className="px-4 pb-3">
          <AudioPlayer src={audioSrc(track.audio_url)} title={track.title} genre={track.genre} language={track.language} />
        </div>
      )}

      {lyricsOpen && track.generated_lyrics && (
        <div className="px-4 pb-4 border-t border-lavender-600 pt-3 max-h-64 overflow-y-auto">
          <LyricsPanel lyrics={track.generated_lyrics} />
        </div>
      )}
    </div>
  );
}

type StatusFilter = "all" | "completed" | "generating_audio" | "failed" | "pending";
type ViewMode = "grid" | "list";

export default function LibraryPage() {
  const { accessToken, user } = useAuthStore();
  const { tracks, loading, error, fetchTracks, removeTrack } = useTracksStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [langFilter, setLangFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [view, setView] = useState<ViewMode>("grid");

  useEffect(() => {
    if (accessToken) fetchTracks(accessToken);
  }, [accessToken, fetchTracks]);

  const handleDeleteTrack = async (id: number) => {
    if (!accessToken) return;
    removeTrack(id);
  };

  const allLanguages = useMemo(
    () => ["all", ...Array.from(new Set(tracks.map((t) => t.language).filter(Boolean)))],
    [tracks],
  );
  const allGenres = useMemo(
    () => ["all", ...Array.from(new Set(tracks.map((t) => t.genre).filter(Boolean)))],
    [tracks],
  );

  const filtered = useMemo(() => {
    return tracks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (langFilter !== "all" && t.language !== langFilter) return false;
      if (genreFilter !== "all" && t.genre !== genreFilter) return false;
      return true;
    });
  }, [tracks, search, statusFilter, langFilter, genreFilter]);

  const completedCount = tracks.filter((t) => t.status === "completed").length;
  const inProgressCount = tracks.filter((t) => t.status === "generating_audio" || t.status === "pending").length;
  const userName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-w-0">

      {/* Page header */}
      <div className="mb-5 sm:mb-7 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal/15 flex items-center justify-center">
            <Library className="w-5 h-5 text-teal" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-jet-black font-heading leading-tight">My Library</h1>
            <p className="text-xs sm:text-sm text-neutral-300">Hey {userName}, here are all your generated tracks.</p>
          </div>
        </div>
        <button type="button" onClick={() => accessToken && fetchTracks(accessToken)} disabled={loading} className="p-2 rounded-lg text-neutral-300 hover:text-jet-black hover:bg-lavender-700 transition-colors disabled:opacity-50" aria-label="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-5 sm:mb-6">
        {[
          { label: "Total Tracks", value: tracks.length, color: "text-teal" },
          { label: "Ready to Play", value: completedCount, color: "text-green-600" },
          { label: "In Progress", value: inProgressCount, color: "text-teal" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-lavender-600 bg-neutral-500 px-3 sm:px-4 py-2.5 sm:py-3">
            <p className={`text-xl sm:text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-[11px] sm:text-xs text-neutral-300 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter + view toggle bar */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter className="w-4 h-4 text-neutral-300 shrink-0" />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-300" />
          <input
            type="search"
            placeholder="Search tracks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 pr-3 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-teal/30 w-36 sm:w-48"
          />
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="h-8 px-2.5 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs focus:outline-none focus:ring-2 focus:ring-teal/30">
          <option value="all">All Status</option>
          <option value="completed">Ready</option>
          <option value="generating_audio">Generating</option>
          <option value="pending">Queued</option>
          <option value="failed">Failed</option>
        </select>

        <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)} className="h-8 px-2.5 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs focus:outline-none focus:ring-2 focus:ring-teal/30">
          {allLanguages.map((l) => <option key={l} value={l}>{l === "all" ? "All Languages" : l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
        </select>

        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)} className="h-8 px-2.5 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs focus:outline-none focus:ring-2 focus:ring-teal/30">
          {allGenres.map((g) => <option key={g} value={g}>{g === "all" ? "All Genres" : g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
        </select>

        <div className="flex-1" />
        {!loading && <span className="text-xs text-neutral-300">{filtered.length} of {tracks.length} tracks</span>}

        <div className="flex items-center gap-0.5 bg-lavender-700 border border-lavender-600 rounded-lg p-0.5">
          <button type="button" onClick={() => setView("grid")} className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-lavender-600 shadow text-teal" : "text-neutral-300 hover:text-jet-black"}`} aria-label="Grid view">
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => setView("list")} className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-lavender-600 shadow text-teal" : "text-neutral-300 hover:text-jet-black"}`} aria-label="List view">
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800 px-3 py-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <p className="text-xs text-red-400">{error}</p>
          <button type="button" onClick={() => accessToken && fetchTracks(accessToken)} className="ml-auto text-xs font-medium text-red-400 underline">Retry</button>
        </div>
      )}

      {loading && tracks.length === 0 ? (
        <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 text-teal animate-spin" /></div>
      ) : tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal/20 to-indigo-500/20 flex items-center justify-center">
            <Music className="w-10 h-10 text-teal" />
          </div>
          <div>
            <p className="font-semibold text-jet-black text-lg font-heading">Your library is empty</p>
            <p className="text-sm text-neutral-300 max-w-xs mt-1">Head to Generate Lyrics, paste some rhymes, and create your first song.</p>
          </div>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal text-white text-sm font-semibold hover:bg-teal-600 transition-colors shadow-sm">
            <Sparkles className="w-4 h-4" /> Generate your first track
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <Search className="w-10 h-10 text-neutral-300" />
          <p className="font-medium text-jet-black">No tracks match your filters</p>
          <button type="button" onClick={() => { setSearch(""); setStatusFilter("all"); setLangFilter("all"); setGenreFilter("all"); }} className="text-sm text-teal underline">Clear filters</button>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((track) => accessToken ? <GridCard key={track.id} track={track} onDelete={handleDeleteTrack} accessToken={accessToken} /> : null)}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((track) => accessToken ? <ListRow key={track.id} track={track} onDelete={handleDeleteTrack} accessToken={accessToken} /> : null)}
        </div>
      )}
    </div>
  );
}
