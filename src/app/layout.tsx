import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import LoadingScreen from "@/components/LoadingScreen";
import ThemeToggleFixed from "@/components/ThemeToggleFixed";
import { ThemeTransitionProvider } from "@/components/ThemeTransitionContext";
import { AuthProvider } from "@/components/AuthContext";
import { IntroProvider } from "@/components/IntroContext";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import AuthStoreSync from "@/components/AuthStoreSync";

export const metadata: Metadata = {
  title: "SargamAI - AI-Powered Music Lyrics Generator",
  description: "Transform your ideas into meaningful music lyrics with AI. Create beautiful songs with our intelligent lyrics generator.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={true} storageKey="sargam-theme">
          <ThemeTransitionProvider>
          <SessionProviderWrapper>
          <AuthStoreSync />
          <AuthProvider>
            <IntroProvider>
              <LoadingScreen />
              <NavbarWrapper />
              <ThemeToggleFixed />
              <main className="min-h-screen overflow-x-hidden min-w-0">
                <FooterWrapper>{children}</FooterWrapper>
              </main>
            </IntroProvider>
          </AuthProvider>
          </SessionProviderWrapper>
          </ThemeTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
