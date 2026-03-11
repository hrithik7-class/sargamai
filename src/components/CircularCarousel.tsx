"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface CarouselItem {
  id: number;
  image: string;
  title: string;
}

const carouselItems: CarouselItem[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", title: "Pop" },
  { id: 2, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop", title: "Rock" },
  { id: 3, image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", title: "Jazz" },
  { id: 4, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", title: "Electronic" },
  { id: 5, image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop", title: "Classical" },
  { id: 6, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", title: "Hip Hop" },
  { id: 7, image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop", title: "R&B" },
  { id: 8, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop", title: "Country" },
];

export default function CircularCarousel() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="relative w-[500px] h-[500px] flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Center decoration */}
      <div className="absolute w-32 h-32 rounded-full bg-teal flex items-center justify-center z-20 shadow-2xl">
        <div className="text-white text-center">
          <div className="text-3xl font-bold font-heading">S</div>
          <div className="text-xs opacity-80">SargamAI</div>
        </div>
      </div>

      {/* Rotating circle container */}
      <motion.div
        className="absolute w-full h-full"
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear",
          rotate: { duration: isHovered ? 8 : 20 }
        }}
        style={{ 
          animation: isHovered ? "spin 8s linear infinite" : "spin 20s linear infinite"
        }}
      >
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        
        {carouselItems.map((item, index) => {
          const angle = (index / carouselItems.length) * 2 * Math.PI;
          const radius = 180;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={item.id}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                x: x,
                y: y,
                marginLeft: "-70px",
                marginTop: "-70px",
              }}
              whileHover={{ scale: 1.2 }}
            >
              <div className="w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-neutral-500 shadow-2xl cursor-pointer">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-sm font-semibold text-jet-black bg-neutral-500/90 px-3 py-1 rounded-full shadow">
                  {item.title}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Outer ring decoration */}
      <div className="absolute w-[450px] h-[450px] rounded-full border-2 border-dashed border-teal-800/30" />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-teal-800/20" />
    </div>
  );
}
