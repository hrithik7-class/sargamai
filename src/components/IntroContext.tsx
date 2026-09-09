"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export const INTRO_SEEN_KEY = "sargam-intro-seen";

type IntroContextValue = {
  isIntroVisible: boolean;
  setIntroVisible: (visible: boolean) => void;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [isIntroVisible, setIntroVisible] = useState(() => {
    if (typeof window === "undefined") return true;
    return !localStorage.getItem(INTRO_SEEN_KEY);
  });
  const setter = useCallback((visible: boolean) => setIntroVisible(visible), []);

  return (
    <IntroContext.Provider value={{ isIntroVisible, setIntroVisible: setter }}>
      {children}
    </IntroContext.Provider>
  );
}

export function setIntroSeen() {
  if (typeof window !== "undefined") {
    localStorage.setItem(INTRO_SEEN_KEY, "1");
  }
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used within IntroProvider");
  return ctx;
}
