"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Text, OrbitControls, useTexture } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

export default function Carousel3D() {
  const group = useRef<THREE.Group>(null);
  const images = [
    "/images/pop.jpg",
    "/images/rock.jpg",
    "/images/jazz.jpg",
    "/images/hiphop.jpg",
    "/images/edm.jpg",
    "/images/rnb.jpg",
    "/images/classical.jpg",
    "/images/indie.jpg"
  ];

  const textures = useTexture(images);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <Canvas camera={{ position: [0, 3, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Suspense fallback={null}>
        <group ref={group}>
          {textures.map((texture, i) => {
            const angle = (i / textures.length) * Math.PI * 2;
            const x = Math.sin(angle) * 5;
            const z = Math.cos(angle) * 5;
            return (
              <mesh
                key={i}
                position={[x, 0, z]}
                rotation={[0, angle, 0]}
              >
                <planeGeometry args={[3, 4]} />
                <meshBasicMaterial map={texture} />
              </mesh>
            );
          })}

          {/* White strip with text */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[5.2, 5.2, 0.2, 64]} />
            <meshBasicMaterial color="white" />
            <Text
              fontSize={0.4}
              color="black"
              position={[0, 0.15, 0]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              POP • ROCK • JAZZ • HIP HOP • EDM • R&B • CLASSICAL
            </Text>
          </mesh>
        </group>
      </Suspense>

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}