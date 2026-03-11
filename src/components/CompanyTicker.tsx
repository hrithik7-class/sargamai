"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FaSpotify, FaApple, FaYoutube, FaSoundcloud, FaAmazon, FaPaypal, FaStripe, FaSquare, FaMusic } from "react-icons/fa";
import { SiTidal, SiRazorpay } from "react-icons/si";

// Music and Payment companies with real icons
const companies = [
  // Music companies
  { name: "Spotify", icon: FaSpotify, color: "#1DB954" },
  { name: "Apple Music", icon: FaApple, color: "#FA243C" },
  { name: "YouTube", icon: FaYoutube, color: "#FF0000" },
  { name: "SoundCloud", icon: FaSoundcloud, color: "#FF5500" },
  { name: "Tidal", icon: SiTidal, color: "#000000" },
  { name: "Amazon", icon: FaAmazon, color: "#FF9900" },
  { name: "Warner", icon: FaMusic, color: "#000000" },
  // Payment companies
  { name: "Razorpay", icon: SiRazorpay, color: "#3399CC" },
  { name: "Stripe", icon: FaStripe, color: "#635BFF" },
  { name: "PayPal", icon: FaPaypal, color: "#003087" },
  { name: "Square", icon: FaSquare, color: "#006AFF" },
];

export default function CompanyTicker() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tickerRef.current) return;

    const ticker = tickerRef.current;
    const scrollWidth = ticker.scrollWidth;
    
    gsap.to(ticker, {
      x: -(scrollWidth / 2),
      duration: 25,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % (scrollWidth / 2))
      }
    });

    return () => {
      gsap.killTweensOf(ticker);
    };
  }, []);

  return (
    <div className="w-full bg-neutral-500 border-t border-lavender-600 overflow-hidden min-w-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 min-w-0">
        {/* Title */}
        <div className="text-center mb-4 sm:mb-6">
          <p className="text-neutral-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
            Trusted by Leading Platforms
          </p>
        </div>

        {/* Ticker Container */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden min-w-0"
        >
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-neutral-500 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-neutral-500 to-transparent z-10" />

          {/* Moving Ticker */}
          <div 
            ref={tickerRef}
            className="flex items-center gap-4 sm:gap-8"
          >
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-lavender-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-lavender-600 transition-colors cursor-pointer"
              >
                <company.icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" style={{ color: company.color }} />
                <span className="text-jet-black font-medium text-xs sm:text-sm whitespace-nowrap">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
