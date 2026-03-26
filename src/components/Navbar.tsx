"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Delay scroll check on mobile so viewport can settle — prevents false "scrolled" on load
  useEffect(() => {
    let ready = false;
    const settleTimer = setTimeout(() => {
      ready = true;
      setScrolled(window.scrollY > 16);
    }, 250);

    const handleScroll = () => {
      if (ready) setScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (isDashboard) return null;

  const scrolledClasses =
    "bg-neutral-500/95 backdrop-blur-md border-b border-lavender-600/80 shadow-sm";
  const notScrolledClasses = "!bg-transparent !backdrop-blur-none border-b border-transparent";
  const baseStyle = !scrolled
    ? { background: "transparent", backgroundColor: "transparent", borderColor: "transparent", boxShadow: "none" }
    : undefined;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top,0px)] ${scrolled ? scrolledClasses : notScrolledClasses}`}
      style={baseStyle}
    >
      <div className="max-w-6xl mx-auto pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-6 lg:px-8">
        <div className="flex items-center h-14 min-[400px]:h-16 sm:h-[4.25rem]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 min-w-0 font-heading md:mr-8"
            aria-label="SargamAI Home"
          >
            <span className="text-lg min-[360px]:text-xl sm:text-2xl font-bold text-jet-black">
              Sargam<span className="text-teal">AI</span>
            </span>
          </Link>

          {/* Desktop: center nav links */}
          <nav className="hidden md:flex items-center justify-center flex-1 gap-0.5" aria-label="Main">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-teal"
                      : "text-jet-black/70 hover:text-jet-black"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop: right side — CTA + Theme toggle */}
          <div className="hidden md:flex items-center gap-3 sm:gap-4 lg:gap-5 ml-auto shrink-0">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-teal hover:bg-teal-600 shadow-md shadow-teal-100/10 hover:shadow-teal-100/20 transition-all duration-200"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/get-started"
                  className="text-sm font-medium transition-colors text-jet-black/70 hover:text-jet-black"
                >
                  Sign in
                </Link>
                <Link
                  href="/get-started"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-teal hover:bg-teal-600 shadow-md shadow-teal-100/10 hover:shadow-teal-100/20 transition-all duration-200"
                >
                  Get started
                </Link>
              </>
            )}
            <div className="flex items-center justify-center shrink-0" aria-label="Theme">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile: toggle + hamburger — 44px min tap targets, proper spacing */}
          <div className="md:hidden flex items-center gap-2 min-[400px]:gap-3 ml-auto">
            <div className="flex items-center justify-center min-w-[44px] min-h-[44px] shrink-0">
              <ThemeToggle className="scale-[0.85] min-[360px]:scale-90 min-[400px]:scale-100" />
            </div>
            <button
              type="button"
              className="flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg text-jet-black hover:bg-lavender-700/50 active:bg-lavender-700 transition-colors shrink-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu — smooth open/close with Framer Motion */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="md:hidden overflow-hidden border-t border-lavender-600 bg-neutral-500/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] max-h-[calc(100dvh-4rem)] overflow-y-auto"
            >
              <nav className="py-4 px-3 sm:px-4 flex flex-col gap-0.5" aria-label="Mobile">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-3.5 min-h-[44px] flex items-center rounded-lg text-sm font-medium transition-colors active:bg-lavender-600 ${
                      isActive ? "text-teal bg-teal/10" : "text-jet-black hover:bg-lavender-700"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="mt-3 pt-3 border-t border-lavender-600 flex flex-col gap-2">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="px-4 py-3.5 min-h-[44px] flex items-center justify-center rounded-full text-sm font-semibold text-white bg-teal hover:bg-teal-600 active:bg-teal-700 text-center shadow-md shadow-teal-100/10 transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/get-started"
                      className="px-4 py-3.5 min-h-[44px] flex items-center justify-center rounded-lg text-sm font-medium text-jet-black hover:bg-lavender-700 active:bg-lavender-600 transition-colors text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/get-started"
                      className="px-4 py-3.5 min-h-[44px] flex items-center justify-center rounded-full text-sm font-semibold text-white bg-teal hover:bg-teal-600 active:bg-teal-700 text-center shadow-md shadow-teal-100/10 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
