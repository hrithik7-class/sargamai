"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Invisible bridge component.
 * Reads the NextAuth session and pushes it into the Zustand auth store
 * whenever the session status changes.
 * Place this inside <SessionProviderWrapper> in layout.tsx.
 */
export default function AuthStoreSync() {
  const { data: session, status } = useSession();
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    setSession(session, status);
  }, [session, status, setSession]);

  return null;
}
