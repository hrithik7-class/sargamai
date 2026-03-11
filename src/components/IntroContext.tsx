"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type IntroContextValue = {
  isIntroVisible: boolean;
  setIntroVisible: (visible: boolean) => void;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [isIntroVisible, setIntroVisible] = useState(true);
  const setter = useCallback((visible: boolean) => setIntroVisible(visible), []);
  return (
    <IntroContext.Provider value={{ isIntroVisible, setIntroVisible: setter }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used within IntroProvider");
  return ctx;
}
