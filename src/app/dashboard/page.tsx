"use client";

import Link from "next/link";
import {
  Music,
  Search,
  Plus,
  Bell,
  LayoutDashboard,
  Sparkles,
  Library,
  Send,
  BarChart3,
  Package,
  Settings,
  Headphones,
  DollarSign,
  Globe,
  Play,
  MoreHorizontal,
  Lock,
  FileEdit,
  Upload,
} from "lucide-react";
import CreateMusicCard from "@/components/CreateMusicCard";

const sidebarNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", active: true },
  { href: "#", icon: Sparkles, label: "Generate Lyrics", active: false },
  { href: "#", icon: Library, label: "My Library", badge: 24, active: false },
  { href: "#", icon: Send, label: "Publishing", active: false },
  { href: "#", icon: BarChart3, label: "Analytics", active: false },
  { href: "#", icon: Package, label: "Releases", badge: "New", active: false },
];

const quickStats = [
  { label: "Total Tracks", value: "24", icon: Music },
  { label: "Monthly Plays", value: "12.5K", icon: Headphones },
  { label: "Revenue", value: "$234", icon: DollarSign },
];

const recentTracks = [
  { title: "Sunset Dreams", meta: "Electronic · 3:24 · 2 days ago", status: "Published", plays: "1,547" },
  { title: "Urban Nights", meta: "Hip-Hop · 2:45 · 5 days ago", status: "Published", plays: "892" },
  { title: "Morning Coffee", meta: "Jazz · 4:12 · 1 day ago", status: "Draft", plays: "0" },
];

const platformPerformance = [
  { name: "Spotify", change: "+12%", value: "8,234", width: 72 },
  { name: "Apple Music", change: "+8%", value: "2,145", width: 54 },
  { name: "YouTube", change: "+15%", value: "1,543", width: 48 },
  { name: "Others", change: "+3%", value: "621", width: 28 },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-lavender-800 flex overflow-x-hidden min-w-0">
      {/* ========== TOP BAR ========== */}
      <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-neutral-500 border-b border-lavender-600 z-50 flex items-center px-3 sm:px-4 lg:px-6 min-w-0">
        <div className="flex items-center gap-2 sm:gap-6 w-full max-w-[1600px] mx-auto min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal flex items-center justify-center">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-xl font-bold text-jet-black font-heading hidden sm:inline">SargamAI</span>
          </Link>

          <div className="flex-1 max-w-xl mx-2 sm:mx-4 hidden md:block min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
              <input
                type="search"
                placeholder="Search tracks, artists, or genres..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-sm placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-jet-black text-white text-xs sm:text-sm font-semibold hover:bg-jet-black-400 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Generate Lyrics</span>
            </Link>
            <span className="text-xs sm:text-sm font-medium text-jet-black hidden lg:inline">Pro Plan</span>
            <button type="button" className="p-1.5 sm:p-2 rounded-lg text-jet-black hover:bg-lavender-700 transition-colors" aria-label="Notifications">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal flex items-center justify-center text-white text-xs sm:text-sm font-semibold shrink-0">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* ========== SIDEBAR ========== */}
      <aside className="fixed left-0 top-16 bottom-0 w-56 bg-neutral-500 border-r border-lavender-600 hidden lg:flex flex-col z-40">
        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          {sidebarNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active ? "bg-lavender-700 text-jet-black" : "text-neutral-300 hover:bg-lavender-700 hover:text-jet-black"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0 text-teal" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded ${
                    item.badge === "New"
                      ? "bg-teal text-white"
                      : "bg-lavender-600 text-jet-black"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-lavender-600 space-y-2">
          {quickStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-lavender-700/80">
              <span className="text-xs text-neutral-300">{stat.label}</span>
              <span className="text-sm font-semibold text-jet-black flex items-center gap-1.5">
                <stat.icon className="w-3.5 h-3.5 text-teal" />
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-lavender-600">
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:bg-lavender-700 hover:text-jet-black transition-colors"
          >
            <Settings className="w-5 h-5 shrink-0 text-teal" />
            Settings
          </button>
        </div>
      </aside>

      {/* ========== MAIN CONTENT ========== */}
      <main className="flex-1 pt-14 sm:pt-16 lg:pl-56 min-h-screen overflow-x-hidden min-w-0">
        <div className="p-3 sm:p-6 lg:p-8 max-w-[1400px] mx-auto min-w-0">
          {/* Welcome + actions */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-jet-black font-heading mb-1">Welcome back, John</h1>
            <p className="text-neutral-300 text-xs sm:text-sm mb-3 sm:mb-4">Here&apos;s what&apos;s happening with your music today.</p>
          </div>

          {/* Create music from lyrics (Suno-style) */}
          <CreateMusicCard />

          <div className="mb-4 sm:mb-6">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-jet-black text-white text-xs sm:text-sm font-semibold hover:bg-jet-black-400 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Generate New Track
              </Link>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-lavender-700 border border-lavender-600 text-jet-black text-xs sm:text-sm font-semibold hover:bg-lavender-600 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Publish Track
              </button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 min-w-0">
            {[
              { label: "Total Tracks", value: "24", trend: "+3 this week", icon: Music },
              { label: "Total Plays", value: "12.5K", trend: "+18% from last month", icon: Headphones },
              { label: "Revenue", value: "$234.12", trend: "+25% this month", icon: DollarSign },
              { label: "Global Reach", value: "47", sub: "Countries", icon: Globe },
            ].map((card) => (
              <div
                key={card.label}
                className="bg-neutral-500 rounded-lg sm:rounded-xl border border-lavender-600 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow min-w-0"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-neutral-300 text-xs sm:text-sm font-medium truncate">{card.label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-jet-black mt-0.5 font-heading truncate">
                      {card.value}
                      {card.sub && <span className="text-sm sm:text-base font-normal text-neutral-300"> {card.sub}</span>}
                    </p>
                    {card.trend && <p className="text-teal text-[10px] sm:text-xs font-medium mt-1 truncate">{card.trend}</p>}
                  </div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-pale-sky-700 flex items-center justify-center shrink-0">
                    <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-teal" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Tracks + Platform Performance */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 min-w-0">
            <div className="xl:col-span-2 bg-neutral-500 rounded-lg sm:rounded-xl border border-lavender-600 shadow-sm overflow-hidden min-w-0">
              <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-lavender-600 flex items-center justify-between gap-2 min-w-0">
                <h2 className="font-semibold text-jet-black font-heading text-sm sm:text-base truncate">Recent Tracks</h2>
                <Link href="#" className="text-xs sm:text-sm font-medium text-teal hover:underline shrink-0">View All</Link>
              </div>
              <div className="divide-y divide-lavender-600">
                {recentTracks.map((track) => (
                  <div
                    key={track.title}
                    className="px-3 sm:px-5 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:bg-lavender-800/50 transition-colors min-w-0"
                  >
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                      <button type="button" className="p-1.5 sm:p-2 rounded-full bg-lavender-700 text-jet-black hover:bg-teal hover:text-white transition-colors shrink-0">
                        <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-jet-black truncate text-sm sm:text-base">{track.title}</p>
                        <p className="text-[10px] sm:text-xs text-neutral-300 truncate">{track.meta}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 shrink-0 pl-7 sm:pl-0">
                      <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-300">
                        {track.status === "Published" ? <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <FileEdit className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                        {track.status}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-jet-black w-10 sm:w-12 text-right">{track.plays}</span>
                      <button type="button" className="p-1 rounded text-neutral-300 hover:text-jet-black hover:bg-lavender-700">
                        <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-500 rounded-lg sm:rounded-xl border border-lavender-600 shadow-sm overflow-hidden min-w-0">
              <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-lavender-600">
                <h2 className="font-semibold text-jet-black font-heading text-sm sm:text-base">Platform Performance</h2>
              </div>
              <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                {platformPerformance.map((platform) => (
                  <div key={platform.name}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-medium text-jet-black">{platform.name}</span>
                      <span className="text-neutral-300">
                        <span className="text-teal font-medium">{platform.change}</span> {platform.value}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-lavender-700 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-jet-black transition-all"
                        style={{ width: `${platform.width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
