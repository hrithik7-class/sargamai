"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useIntro, setIntroSeen, INTRO_SEEN_KEY } from "@/components/IntroContext";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { setIntroVisible } = useIntro();
  const forceIntro = searchParams.get("intro") === "1";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!forceIntro && localStorage.getItem(INTRO_SEEN_KEY)) {
      setIsLoading(false);
      setIntroVisible(false);
      return;
    }
    if (pathname.startsWith("/dashboard") && !forceIntro) {
      setIntroSeen();
      setIsLoading(false);
      setIntroVisible(false);
      return;
    }
    const timer = setTimeout(() => {
      if (!forceIntro) setIntroSeen();
      setIsLoading(false);
      setIntroVisible(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [setIntroVisible, pathname, forceIntro]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-jet-black via-jet-black-400 to-teal flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Party GIF Background */}
          <motion.div 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img 
              src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZm0yaHN4azgzNmIyOXBsaXtlMHFqNHJsY3EzbGo5OTYxem81aHZycCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YZeGY5rwvW4U0/giphy.gif"
              alt="Party music"
              className="w-full h-full object-cover opacity-40"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-jet-black/80 via-jet-black-400/70 to-teal/80" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Musical Wave Animation */}
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative mb-6"
            >
              {/* Center wave */}
              <div className="flex items-end justify-center gap-1 h-20 w-40">
                {[...Array(28)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 bg-teal rounded-full"
                    initial={{ height: 10 }}
                    animate={{ 
                      height: [10, 60, 35, 70, 15, 50, 10],
                    }}
                    transition={{ 
                      duration: 1.8, 
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: i * 0.025,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Brand Name without S */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center mb-3"
            >
              <h1 className="text-5xl font-bold text-white mb-1 tracking-widest font-heading">SARGAM</h1>
            </motion.div>

            {/* Description with animation */}
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <p className="text-teal-800 text-sm mb-1">AI-Powered Music Generator</p>
              <p className="text-teal-800/70 text-xs">Create • Compose • Celebrate</p>
            </motion.div>

            {/* Loading dots */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-1 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-1.5 h-1.5 bg-teal rounded-full"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ 
                    duration: 0.4, 
                    repeat: Infinity, 
                    delay: i * 0.15 
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* Progress bar */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.5, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-700 via-teal to-teal-700 origin-left"
          />

          {/* Version */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-3 text-xs text-teal-800"
          >
            v1.0
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
