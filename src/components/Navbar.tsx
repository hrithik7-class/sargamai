"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent border-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-heading">
            <span className="text-2xl font-bold text-teal">
              Sargam
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
                    isActive
                      ? "text-teal bg-white/20"
                      : "text-jet-black hover:text-teal hover:bg-white/10"
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
                  pathname === demoLink.href || pathname.startsWith(demoLink.href.split("#")[0])
                    ? "text-teal bg-white/20"
                    : "text-jet-black hover:text-teal hover:bg-white/10"
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
              className="px-5 py-2.5 rounded-lg bg-jet-black text-white text-sm font-semibold hover:bg-jet-black-400 transition-colors"
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
          <div className="md:hidden py-4 border-t border-white/20 bg-white/5 backdrop-blur-sm">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href.split("#")[0]));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
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
                    pathname === demoLink.href || pathname.startsWith(demoLink.href.split("#")[0])
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
