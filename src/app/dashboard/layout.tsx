"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import {
  Music,
  Sparkles,
  SlidersHorizontal,
  Library,
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  Bell,
  Headphones,
  Music2,
  X,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useIntro } from "@/components/IntroContext";
import { FloatingDock } from "@/components/ui/floating-dock";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const sidebarNav = [
  { href: "/dashboard", icon: Sparkles, label: "Generate Lyrics", exact: true },
  { href: "/dashboard/studio", icon: SlidersHorizontal, label: "Studio" },
  { href: "/dashboard/library", icon: Library, label: "My Library" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/overview", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/releases", icon: Package, label: "Releases", badge: "New" },
];

// Replace with API fetch later; shape is ready for real notifications
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Track ready",
    message: "Your generated track \"Summer Vibes\" is ready to play.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "Studio mix saved",
    message: "Your voice + music mix has been saved to Library.",
    time: "1 hour ago",
    read: true,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isIntroVisible } = useIntro();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  if (isIntroVisible) {
    return (
      <div className="min-h-screen bg-lavender-800 flex overflow-x-hidden min-w-0">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lavender-800 flex overflow-x-hidden min-w-0">
      {/* ═══ TOP BAR ════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 h-14 min-[400px]:h-16 sm:h-[4.25rem] bg-neutral-500/95 backdrop-blur-md border-b border-lavender-600 shadow-lg shadow-black/5 z-50 flex items-center pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-4 lg:px-6 min-w-0">
        <div className="flex items-center gap-2 sm:gap-6 w-full max-w-[1600px] mx-auto min-w-0">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="SargamAI Home">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal flex items-center justify-center shrink-0">
              <Music className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-base sm:text-xl font-bold text-jet-black font-heading hidden sm:inline">
              SargamAI
            </span>
          </Link>

          {/* Breadcrumb / page title area */}
          <div className="flex-1 mx-2 sm:mx-4 min-w-0 overflow-hidden">
            <p className="text-sm font-medium text-neutral-300 truncate hidden sm:block">
              {pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/")
                ? "Settings"
                : sidebarNav.find((n) => isActive(n.href, n.exact))?.label ?? "Dashboard"}
            </p>
          </div>

          <div className="flex items-center gap-2 min-[400px]:gap-3 sm:gap-5 shrink-0">
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotificationsOpen((o) => !o)}
                className="relative flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg border border-lavender-600 bg-lavender-700 text-jet-black hover:bg-lavender-600 active:bg-lavender-600 transition-colors hover:border-teal/40"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-teal text-white text-[10px] font-bold flex items-center justify-center border-2 border-neutral-500 shadow-sm">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-1 w-[min(320px,calc(100vw-2rem))] sm:w-[360px] max-h-[min(400px,70vh)] overflow-hidden rounded-xl border border-lavender-600 bg-neutral-500 shadow-xl z-50 flex flex-col">
                  <div className="px-4 py-3 border-b border-lavender-600 flex items-center justify-between shrink-0">
                    <span className="font-semibold text-jet-black">Notifications</span>
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-jet-black hover:bg-lavender-700"
                      aria-label="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1 min-h-0">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-jet-black">No notifications yet</p>
                        <p className="text-xs text-neutral-400 mt-1">We’ll show updates here when they come.</p>
                      </div>
                    ) : (
                      <ul className="divide-y divide-lavender-600">
                        {notifications.map((n) => (
                          <li
                            key={n.id}
                            className={`px-4 py-3 hover:bg-lavender-700/50 transition-colors cursor-pointer ${!n.read ? "bg-teal/5" : ""}`}
                            onClick={() => markAsRead(n.id)}
                          >
                            <div className="flex gap-3">
                              <div className="w-8 h-8 rounded-lg bg-teal/20 flex items-center justify-center shrink-0">
                                <Music2 className="w-4 h-4 text-teal" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-jet-black">{n.title}</p>
                                <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">{n.message}</p>
                                <p className="text-xs text-neutral-500 mt-1">{n.time}</p>
                              </div>
                              {!n.read && (
                                <span className="shrink-0 w-2 h-2 rounded-full bg-teal mt-2" aria-hidden />
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center min-w-[44px] min-h-[44px] shrink-0" aria-label="Theme">
              <ThemeToggle className="scale-[0.85] min-[360px]:scale-90 min-[400px]:scale-100 sm:scale-100" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal flex items-center justify-center text-white text-sm font-bold shrink-0">
                {session?.user?.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <span className="text-sm font-medium text-jet-black truncate max-w-[70px] min-[400px]:max-w-[120px] sm:max-w-[180px]">
                {session?.user?.name ?? "User"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ═══ SIDEBAR ════════════════════════════════════════════════════ */}
      <aside className="fixed left-0 top-14 min-[400px]:top-16 sm:top-[4.25rem] bottom-0 w-56 bg-neutral-500 border-r border-lavender-600 hidden lg:flex flex-col z-40">
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
            <CardSpotlight
              key={stat.label}
              color="#00d4ff"
              className="!p-0 !border-0 overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-lavender-700/80">
                <span className="text-xs text-neutral-300">{stat.label}</span>
                <span className="text-xs font-semibold text-jet-black flex items-center gap-1.5 truncate max-w-[80px]">
                  <stat.icon className="w-3.5 h-3.5 text-teal shrink-0" />
                  <span className="truncate">{stat.value}</span>
                </span>
              </div>
            </CardSpotlight>
          ))}
        </div>

        {/* Upgrade plan — only gradient (CTA) */}
        <div className="p-3 border-t border-lavender-600">
          <div className="rounded-xl bg-gradient-to-b from-teal/15 to-lavender-700/50 border border-lavender-600 p-3">
            <p className="text-xs text-neutral-300 mb-1">Upgrade your plan</p>
            <Link href="/pricing" className="inline-flex items-center justify-center w-full py-2 rounded-full bg-teal text-white text-xs font-semibold hover:bg-teal-600 transition-colors">
              See plans
            </Link>
          </div>
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

      {/* ═══ FLOATING DOCK (Mobile) ═══════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <FloatingDock
            mobileOnly
            items={sidebarNav.map((item) => ({
              title: item.label,
              icon: <item.icon className="h-5 w-5" />,
              href: item.href,
            })).concat([
              { title: "Settings", icon: <Settings className="h-5 w-5" />, href: "/dashboard/settings" },
            ])}
          />
      </div>

      {/* ═══ PAGE CONTENT ═══════════════════════════════════════════════ */}
      <div className="flex-1 pt-14 min-[400px]:pt-16 sm:pt-[4.25rem] lg:pl-56 min-h-screen overflow-x-hidden min-w-0 pb-28 lg:pb-0">
        {children}
      </div>
    </div>
  );
}
