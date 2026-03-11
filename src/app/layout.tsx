import type { Metadata } from "next";
import "./globals.css";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import LoadingScreen from "@/components/LoadingScreen";
import { AuthProvider } from "@/components/AuthContext";

export const metadata: Metadata = {
  title: "SargamAI - AI-Powered Music Lyrics Generator",
  description: "Transform your ideas into meaningful music lyrics with AI. Create beautiful songs with our intelligent lyrics generator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
        <AuthProvider>
          <LoadingScreen />
          <NavbarWrapper />
          <main className="min-h-screen overflow-x-hidden min-w-0">
            <FooterWrapper>{children}</FooterWrapper>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
