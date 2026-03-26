"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Music,
  Sparkles,
  SlidersHorizontal,
  Library,
  BarChart3,
  Package,
  Headphones,
  ShieldCheck,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useTracksStore } from "@/store/useTracksStore";
import type { Track } from "@/lib/api";
import { CardSpotlight } from "@/components/ui/card-spotlight";

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

export default function OverviewPage() {
  const { user, accessToken } = useAuthStore();
  const { tracks, loading, error, fetchTracks } = useTracksStore();

  const userName = user?.name?.split(" ")[0] ?? "there";

  useEffect(() => {
    if (accessToken) fetchTracks(accessToken);
  }, [accessToken, fetchTracks]);

  const completedCount = tracks.filter((t) => t.status === "completed").length;
  const inProgressCount = tracks.filter(
    (t) => t.status === "generating_audio" || t.status === "pending",
  ).length;
  const safeCount = tracks.filter((t) => t.copyright_safe === true).length;
  const recentTracks = tracks.slice(0, 4);

  const quickActions = [
    { href: "/dashboard", icon: Sparkles, label: "Generate a Track", desc: "Turn rhymes into full AI-sung music" },
    { href: "/dashboard/studio", icon: SlidersHorizontal, label: "Studio", desc: "Mix your voice with music — R&B, bass, and more" },
    { href: "/dashboard/library", icon: Library, label: "My Library", desc: "Browse, play, and download your tracks" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics", desc: "Insights on your generation activity" },
    { href: "/dashboard/releases", icon: Package, label: "Releases", desc: "Publish your completed tracks" },
  ];

  return (
    <div className="p-3 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-w-0">
      {/* Welcome */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-jet-black font-heading mb-1">
          Welcome back, {userName}
        </h1>
        <p className="text-neutral-300 text-sm">
          Your AI music studio — generate, store, and publish original tracks.
        </p>
      </div>

      {/* KPI stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "Total Tracks", value: tracks.length, icon: Music, color: "text-teal" },
          { label: "Ready to Play", value: completedCount, icon: Headphones, color: "text-green-500" },
          { label: "In Progress", value: inProgressCount, icon: Loader2, color: "text-teal" },
          { label: "Copyright Safe", value: safeCount, icon: ShieldCheck, color: "text-teal" },
        ].map((card) => (
          <CardSpotlight key={card.label} color="#00d4ff">
            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-neutral-300 text-xs sm:text-sm font-medium truncate">{card.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-jet-black mt-0.5 font-heading">
                    {loading ? "—" : card.value}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-lavender-700 flex items-center justify-center shrink-0">
                  <card.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${card.color}`} />
                </div>
              </div>
            </div>
          </CardSpotlight>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-jet-black font-heading mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action) => (
            <CardSpotlight key={action.href} color="#00d4ff">
              <Link
                href={action.href}
                className="group flex items-start gap-3 p-4 rounded-xl bg-neutral-500 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-lavender-700 flex items-center justify-center shrink-0">
                  <action.icon className="w-4 h-4 text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-jet-black text-sm">{action.label}</p>
                  <p className="text-xs text-neutral-300 mt-0.5 leading-snug">{action.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-teal group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
              </Link>
            </CardSpotlight>
          ))}
        </div>
      </div>

      {/* Recent Tracks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-jet-black font-heading">
            Recent Tracks
          </h2>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => accessToken && fetchTracks(accessToken)}
              disabled={loading}
              className="flex items-center gap-1 text-xs font-medium text-teal hover:text-teal-600 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link href="/dashboard/library" className="text-xs font-medium text-teal hover:text-teal-600 transition-colors">
              View all →
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-800 px-3 py-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {loading && tracks.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-teal animate-spin" />
          </div>
        ) : recentTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-3 rounded-xl border-2 border-dotted border-lavender-600 bg-neutral-500/30">
            <Music className="w-10 h-10 text-neutral-400" />
            <div>
              <p className="font-medium text-jet-black">No tracks yet</p>
              <p className="text-sm text-neutral-300 mt-0.5 max-w-xs">
                Head to Generate Lyrics to create your first AI song.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal text-white text-sm font-semibold hover:bg-teal-600 transition-colors border-0"
            >
              <Sparkles className="w-4 h-4" /> Generate Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 py-6 rounded-xl border-2 border-dotted border-lavender-600 bg-neutral-500/30 hover:bg-neutral-500/50 hover:border-teal/40 transition-colors"
            >
              <span className="text-neutral-400 text-xl">+</span>
              <span className="text-sm font-medium text-neutral-400">Create another track</span>
            </Link>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4">
            {recentTracks.map((track) => (
              <CardSpotlight key={track.id} color="#00d4ff">
                <div className="p-3 sm:p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal flex items-center justify-center shrink-0">
                    <Music className="w-4 h-4 text-white" />
                  </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-jet-black truncate text-sm">{track.title}</p>
                  <p className="text-[11px] text-neutral-300 truncate">
                    {track.genre} · {track.language}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-300 bg-lavender-700 border border-lavender-600 rounded-full px-2 py-0.5 shrink-0">
                  {statusIcon(track.status)} {statusLabel(track.status)}
                </span>
                </div>
              </CardSpotlight>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
