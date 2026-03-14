"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { User, Bell, Palette, LogOut, Shield } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-jet-black font-heading mb-2">Settings</h1>
      <p className="text-neutral-300 text-sm mb-8">Manage your account and preferences.</p>

      {/* Profile */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-jet-black flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-teal" />
          Profile
        </h2>
        <div className="rounded-xl border border-lavender-600 bg-neutral-500/50 p-4 space-y-3">
          <div>
            <label className="text-xs text-neutral-400">Name</label>
            <p className="text-jet-black font-medium">{session?.user?.name ?? "—"}</p>
          </div>
          <div>
            <label className="text-xs text-neutral-400">Email</label>
            <p className="text-jet-black font-medium">{session?.user?.email ?? "—"}</p>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-jet-black flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-teal" />
          Appearance
        </h2>
        <div className="rounded-xl border border-lavender-600 bg-neutral-500/50 p-4">
          <p className="text-sm text-neutral-300">
            Use the theme toggle (sun/moon icon) in the top-right of the screen to switch between dark and light mode.
          </p>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-jet-black flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-teal" />
          Notifications
        </h2>
        <div className="rounded-xl border border-lavender-600 bg-neutral-500/50 p-4">
          <p className="text-sm text-neutral-300">Notification preferences will be available here soon.</p>
        </div>
      </section>

      {/* Account */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-jet-black flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-teal" />
          Account
        </h2>
        <div className="rounded-xl border border-lavender-600 bg-neutral-500/50 p-4">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-jet-black bg-lavender-700 hover:bg-lavender-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
