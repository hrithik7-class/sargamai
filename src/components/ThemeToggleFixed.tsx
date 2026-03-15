"use client";

import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

/** Renders the fixed top-right theme toggle only when NOT on dashboard (dashboard has its own in-header toggle). */
export default function ThemeToggleFixed() {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (isDashboard) return null;
  return (
    <div className="fixed top-4 right-4 z-[100] hidden md:block">
      <ThemeToggle />
    </div>
  );
}
