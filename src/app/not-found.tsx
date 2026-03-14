import Link from "next/link";
import { Music } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-lavender-900 flex flex-col">
      {/* Top bar: logo left */}
      <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-jet-black font-heading">
            Sargam<span className="text-teal">AI</span>
          </span>
        </Link>
      </header>

      {/* Centered content: message, link, 404 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-jet-black-200 text-base sm:text-lg mb-2">
          Oops no concert on this stage...
        </p>
        <p className="text-jet-black-300 text-sm sm:text-base mb-12">
          Return to{" "}
          <Link href="/" className="text-teal underline underline-offset-2 hover:text-teal-600 transition-colors">
            Home Page
          </Link>
        </p>
        <p
          className="text-jet-black font-heading font-bold text-[8rem] sm:text-[10rem] lg:text-[12rem] leading-none tracking-tighter text-teal/90 drop-shadow-[0_0_40px_rgba(0,212,255,0.15)]"
          aria-hidden
        >
          404
        </p>
      </main>

      {/* Subtle bottom gradient */}
      <div className="h-32 bg-gradient-to-t from-lavender-900 to-transparent pointer-events-none" aria-hidden />
    </div>
  );
}
