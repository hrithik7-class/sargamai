"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/components/AuthContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/pricing" },
];

const demoLink = { name: "Demo", href: "/dashboard" };

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (isDashboard) return null;

  const navBg = scrolled
    ? "bg-neutral-500/95 backdrop-blur-md border-b border-lavender-600/80 shadow-sm"
    : "!bg-transparent border-b border-transparent";

  // Force transparent background when not scrolled (fixes mobile blue/teal tint)
  const transparentStyle = !scrolled
    ? {
        background: "transparent",
        backgroundColor: "transparent",
        borderColor: "transparent",
      }
    : undefined;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      style={transparentStyle}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-[4.25rem]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 font-heading md:mr-8"
            aria-label="SargamAI Home"
          >
            <span className="text-xl sm:text-2xl font-bold text-jet-black">
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
            {isAuthenticated && (
              <Link
                href={demoLink.href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 text-jet-black/70 hover:text-jet-black"
              >
                {demoLink.name}
              </Link>
            )}
          </nav>

          {/* Desktop: right side — Sign in + CTA */}
          <div className="hidden md:flex items-center gap-3 ml-auto shrink-0">
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
          </div>

          {/* Mobile: menu button */}
          <button
            type="button"
            className="md:hidden p-2.5 rounded-lg text-jet-black hover:bg-lavender-700/50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div
            className="md:hidden overflow-hidden border-t border-lavender-600 bg-neutral-500/95 backdrop-blur-md transition-all duration-300"
          >
            <nav className="py-4 px-2 flex flex-col gap-0.5" aria-label="Mobile">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive ? "text-teal bg-teal/10" : "text-jet-black hover:bg-lavender-700"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              {isAuthenticated && (
                <Link
                  href={demoLink.href}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-jet-black hover:bg-lavender-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {demoLink.name}
                </Link>
              )}
              <div className="mt-3 pt-3 border-t border-lavender-600 flex flex-col gap-2">
                <Link
                  href="/get-started"
                  className="px-4 py-3 rounded-lg text-sm font-medium text-jet-black hover:bg-lavender-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/get-started"
                  className="px-4 py-3.5 rounded-full text-sm font-semibold text-white bg-teal hover:bg-teal-600 text-center shadow-md shadow-teal-100/10 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
