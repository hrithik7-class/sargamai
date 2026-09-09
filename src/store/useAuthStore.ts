"use client";

import { create } from "zustand";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Called by AuthStoreSync whenever the NextAuth session changes. */
  setSession: (session: Session | null, status: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  setSession(session, status) {
    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";

    const sessionUser = session?.user;

    const user: AuthUser | null =
      isAuthenticated && sessionUser
        ? {
            id: sessionUser.id ?? "",
            email: sessionUser.email ?? "",
            name: sessionUser.name ?? "",
            isVerified: sessionUser.isVerified ?? false,
          }
        : null;

    const accessToken: string | null = session?.accessToken ?? null;

    set({ user, accessToken, isAuthenticated, isLoading });
  },

  async logout() {
    const { accessToken } = get();
    if (accessToken) {
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"}/api/auth/logout`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
      } catch {
        // Swallow — NextAuth signOut still proceeds
      }
    }
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    await signOut({ callbackUrl: "/" });
  },
}));
