"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

/** Renders Navbar on all routes except /get-started */
export default function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname === "/get-started") return null;
  return <Navbar />;
}
