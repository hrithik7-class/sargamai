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

const demoLink = { name: "Try Demo", href: "/dashboard" };

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    // Only react to scroll events — do not read scrollY on mount so first load stays transparent
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (isDashboard) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : ""
      }`}
      style={scrolled ? undefined : { backgroundColor: "transparent" }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
        <div className="flex justify-between items-center h-14 sm:h-16 min-w-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-heading shrink-0 min-w-0">
            <span className="text-lg sm:text-2xl font-bold text-teal truncate">
              SargamAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    scrolled
                      ? isActive
                        ? "text-teal bg-lavender-200/30"
                        : "text-jet-black hover:text-teal hover:bg-lavender-200/20"
                      : isActive
                        ? "text-teal bg-transparent"
                        : "text-jet-black hover:text-teal bg-transparent hover:bg-transparent"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            {isAuthenticated && (
              <Link
                href={demoLink.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  scrolled
                    ? pathname === demoLink.href || pathname.startsWith(demoLink.href.split("#")[0])
                      ? "text-teal bg-lavender-200/30"
                      : "text-jet-black hover:text-teal hover:bg-lavender-200/20"
                    : pathname === demoLink.href || pathname.startsWith(demoLink.href.split("#")[0])
                      ? "text-teal bg-transparent"
                      : "text-jet-black hover:text-teal bg-transparent hover:bg-transparent"
                }`}
              >
                {demoLink.name}
              </Link>
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/get-started"
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                scrolled
                  ? "bg-jet-black text-white hover:bg-jet-black-400"
                  : "bg-transparent text-jet-black border-2 border-jet-black hover:bg-jet-black hover:text-white"
              }`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-jet-black"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-4 transition-all duration-300 ${
            scrolled
              ? "border-t border-lavender-600 bg-white"
              : "border-t border-white/20 bg-white/5 backdrop-blur-sm"
          }`}>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      scrolled
                        ? isActive
                          ? "text-teal bg-lavender-200/30"
                          : "text-jet-black hover:bg-lavender-200/20"
                        : isActive
                          ? "text-teal bg-white/20"
                          : "text-jet-black hover:bg-white/10"
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
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    scrolled
                      ? pathname === demoLink.href || pathname.startsWith(demoLink.href.split("#")[0])
                        ? "text-teal bg-lavender-200/30"
                        : "text-jet-black hover:bg-lavender-200/20"
                      : pathname === demoLink.href || pathname.startsWith(demoLink.href.split("#")[0])
                        ? "text-teal bg-white/20"
                        : "text-jet-black hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {demoLink.name}
                </Link>
              )}
              <Link
                href="/get-started"
                className="mt-2 px-5 py-3 rounded-lg bg-jet-black text-white text-sm font-semibold text-center hover:bg-jet-black-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
