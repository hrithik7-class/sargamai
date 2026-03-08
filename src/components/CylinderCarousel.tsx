"use client";

import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  useTexture, 
  Text,
  Float,
  ContactShadows,
  Environment
} from "@react-three/drei";
import * as THREE from "three";

// Image data for carousel
const carouselImages = [
  { id: 1, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", genre: "Pop" },
  { id: 2, image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop", genre: "Rock" },
  { id: 3, image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop", genre: "Jazz" },
  { id: 4, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop", genre: "EDM" },
  { id: 5, image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop", genre: "Classical" },
  { id: 6, image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop", genre: "Hip Hop" },
  { id: 7, image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop", genre: "R&B" },
  { id: 8, image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop", genre: "Indie" },
];

// Constants for carousel geometry
const RADIUS = 5;
const CARD_WIDTH = 2.8;
const CARD_HEIGHT = 2.8;

// Single image card component
function ImageCard({ 
  data, 
  index, 
  total,
  isHovered,
  onHover 
}: { 
  data: typeof carouselImages[0]; 
  index: number; 
  total: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Load texture with memoization
  const texture = useTexture(data.image);
  texture.colorSpace = THREE.SRGBColorSpace;
  
  // Calculate position using polar coordinates
  const angle = (index / total) * Math.PI * 2;
  const x = RADIUS * Math.sin(angle);
  const z = RADIUS * Math.cos(angle);

  // Animate scale on hover
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  return (
    <group position={[x, 0, z]} rotation={[0, -angle + Math.PI, 0]}>
      <Float speed={2} rotationIntensity={0} floatIntensity={0}>
        <mesh
          ref={meshRef}
          onPointerEnter={() => onHover(index)}
          onPointerLeave={() => onHover(null)}
          castShadow
          receiveShadow
        >
          <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
          <meshStandardMaterial 
            map={texture}
            side={THREE.DoubleSide}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        
        {/* White border ring */}
        <mesh position={[0, 0, -0.01]} rotation={[0, 0, 0]}>
          <ringGeometry args={[1.42, 1.48, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
        
        {/* Genre text below card */}
        <Text
          position={[0, -1.2, 0.01]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="#000000"
          fontWeight="bold"
        >
          {data.genre.toUpperCase()}
        </Text>
      </Float>
    </group>
  );
}

// Horizontal text strip around the cylinder
function GenreTextStrip() {
  const genres = ["POP", "ROCK", "JAZZ", "EDM", "HIP HOP", "R&B", "CLASSICAL", "INDIE"];
  
  return (
    <group>
      {genres.map((genre, index) => {
        const angle = (index / genres.length) * Math.PI * 2;
        const x = (RADIUS - 0.3) * Math.sin(angle);
        const z = (RADIUS - 0.3) * Math.cos(angle);
        
        return (
          <group key={genre} position={[x, 0, z]} rotation={[0, -angle + Math.PI, 0]}>
            <Text
              fontSize={0.15}
              color="#000000"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {genre}
            </Text>
          </group>
        );
      })}
    </group>
  );
}

// Main carousel group
function CarouselGroup({ 
  hoveredIndex, 
  onHover 
}: { 
  hoveredIndex: number | null;
  onHover: (index: number | null) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previousPointer = useRef({ x: 0, y: 0 });

  // Auto-rotate when not hovered or dragging
  useFrame((state, delta) => {
    if (groupRef.current && !isDragging && hoveredIndex === null) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  // Manual drag rotation
  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && groupRef.current) {
      const deltaX = e.clientX - previousPointer.current.x;
      groupRef.current.rotation.y += deltaX * 0.01;
      previousPointer.current = { x: e.clientX, y: e.clientY };
    }
  };

  return (
    <group 
      ref={groupRef}
      onPointerDown={(e) => {
        setIsDragging(true);
        previousPointer.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => setIsDragging(false)}
      onPointerLeave={() => setIsDragging(false)}
      onPointerMove={handlePointerMove}
    >
      {carouselImages.map((data, index) => (
        <ImageCard
          key={data.id}
          data={data}
          index={index}
          total={carouselImages.length}
          isHovered={hoveredIndex === index}
          onHover={onHover}
        />
      ))}
      
      {/* White horizontal strip */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RADIUS - 0.3, 0.08, 16, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      {/* Genre text on the strip */}
      <GenreTextStrip />
    </group>
  );
}

// Main scene component
function Scene() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-5, 3, 5]} intensity={0.6} color="#1f7a8c" />
      <pointLight position={[5, -3, 5]} intensity={0.6} color="#2bacc5" />
      
      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Main carousel */}
      <CarouselGroup 
        hoveredIndex={hoveredIndex}
        onHover={setHoveredIndex}
      />

      {/* Soft shadows */}
      <ContactShadows 
        position={[0, -3, 0]} 
        opacity={0.5} 
        scale={20} 
        blur={2} 
        far={4}
      />
    </>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#1f7a8c" wireframe />
    </mesh>
  );
}

// Main export
export default function CylinderCarousel() {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 14], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
