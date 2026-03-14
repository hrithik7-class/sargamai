"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Music,
  Sparkles,
  Library,
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  Bell,
  Headphones,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const sidebarNav = [
  { href: "/dashboard", icon: Sparkles, label: "Generate Lyrics", exact: true },
  { href: "/dashboard/library", icon: Library, label: "My Library" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/overview", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/releases", icon: Package, label: "Releases", badge: "New" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen bg-lavender-800 flex overflow-x-hidden min-w-0">
      {/* ═══ TOP BAR ════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-neutral-500 border-b border-lavender-600 z-50 flex items-center px-3 sm:px-4 lg:px-6 min-w-0">
        <div className="flex items-center gap-2 sm:gap-6 w-full max-w-[1600px] mx-auto min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal flex items-center justify-center">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-xl font-bold text-jet-black font-heading hidden sm:inline">
              SargamAI
            </span>
          </Link>

          {/* Breadcrumb / page title area */}
          <div className="flex-1 mx-2 sm:mx-4 min-w-0">
            <p className="text-sm font-medium text-neutral-300 truncate hidden sm:block">
              {pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/")
                ? "Settings"
                : sidebarNav.find((n) => isActive(n.href, n.exact))?.label ?? "Dashboard"}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              className="p-1.5 sm:p-2 rounded-lg text-jet-black hover:bg-lavender-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <ThemeToggle />
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal flex items-center justify-center text-white text-xs sm:text-sm font-semibold shrink-0">
              {session?.user?.name?.slice(0, 2).toUpperCase() ?? "ME"}
            </div>
          </div>
        </div>
      </header>

      {/* ═══ SIDEBAR ════════════════════════════════════════════════════ */}
      <aside className="fixed left-0 top-14 sm:top-16 bottom-0 w-56 bg-neutral-500 border-r border-lavender-600 hidden lg:flex flex-col z-40">
        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          {sidebarNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(item.href, item.exact)
                  ? "bg-lavender-700 text-jet-black"
                  : "text-neutral-300 hover:bg-lavender-700 hover:text-jet-black"
              }`}
            >
              <item.icon className="w-5 h-5 shrink-0 text-teal" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-teal text-white">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Quick stats */}
        <div className="p-3 border-t border-lavender-600 space-y-2">
          {[
            { label: "Workspace", value: session?.user?.name?.split(" ")[0] ?? "User", icon: Music },
            { label: "Plan", value: "Free", icon: Headphones },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-lavender-700/80"
            >
              <span className="text-xs text-neutral-300">{stat.label}</span>
              <span className="text-xs font-semibold text-jet-black flex items-center gap-1.5 truncate max-w-[80px]">
                <stat.icon className="w-3.5 h-3.5 text-teal shrink-0" />
                <span className="truncate">{stat.value}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-lavender-600">
          <Link
            href="/dashboard/settings"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/")
                ? "bg-lavender-700 text-jet-black"
                : "text-neutral-300 hover:bg-lavender-700 hover:text-jet-black"
            }`}
          >
            <Settings className="w-5 h-5 shrink-0 text-teal" />
            Settings
          </Link>
        </div>
      </aside>

      {/* ═══ PAGE CONTENT ═══════════════════════════════════════════════ */}
      <div className="flex-1 pt-14 sm:pt-16 lg:pl-56 min-h-screen overflow-x-hidden min-w-0">
        {children}
      </div>
    </div>
  );
}
