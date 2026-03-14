"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuthStore, type AuthUser } from "@/store/useAuthStore";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user, accessToken, logout } = useAuthStore();

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, accessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
