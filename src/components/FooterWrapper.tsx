"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function FooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard");
  const isGetStarted = pathname === "/get-started";
  const isPricing = pathname === "/pricing";

  if (isDashboard || isGetStarted || isPricing) {
    return <>{children}</>;
  }
  
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
