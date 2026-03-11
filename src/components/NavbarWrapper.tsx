"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useIntro } from "@/components/IntroContext";

/** Renders Navbar on all routes except /get-started, and hidden during intro */
export default function NavbarWrapper() {
  const pathname = usePathname();
  const { isIntroVisible } = useIntro();
  if (pathname === "/get-started" || isIntroVisible) return null;
  return <Navbar />;
}
