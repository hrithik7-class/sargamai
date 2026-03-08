"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MusicElements3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    elements: THREE.Group;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 0.8, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    // Create musical elements group
    const elements = new THREE.Group();
    scene.add(elements);

    // Musical note shapes
    const createMusicalElement = (type: "note" | "circle" | "sphere", color: number, x: number, y: number, scale: number) => {
      let geometry;
      
      if (type === "note") {
        // Create a torus (circular musical note shape)
        geometry = new THREE.TorusGeometry(0.3, 0.08, 16, 32);
      } else if (type === "circle") {
        // Create a ring
        geometry = new THREE.TorusGeometry(0.25, 0.05, 16, 64);
      } else {
        // Create a sphere
        geometry = new THREE.SphereGeometry(0.2, 32, 32);
      }

      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 100,
        transparent: true,
        opacity: 0.9,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, 0);
      mesh.scale.setScalar(scale);
      
      // Add random rotation properties
      (mesh as any).rotationSpeed = {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      };
      
      (mesh as any).floatSpeed = Math.random() * 0.01 + 0.005;
      (mesh as any).floatOffset = Math.random() * Math.PI * 2;
      (mesh as any).originalY = y;
      
      return mesh;
    };

    // Create multiple musical elements
    const colors = [0x2563eb, 0x3b82f6, 0x06b6d4, 0x0ea5e9, 0x60a5fa];
    
    // Add torus shapes (musical note rings)
    for (let i = 0; i < 8; i++) {
      const color = colors[i % colors.length];
      const x = (Math.random() - 0.5) * 4;
      const y = (Math.random() - 0.5) * 4;
      const scale = Math.random() * 0.5 + 0.3;
      elements.add(createMusicalElement("note", color, x, y, scale));
    }

    // Add circular rings
    for (let i = 0; i < 6; i++) {
      const color = colors[(i + 2) % colors.length];
      const x = (Math.random() - 0.5) * 3 + 1.5;
      const y = (Math.random() - 0.5) * 3;
      const scale = Math.random() * 0.4 + 0.2;
      elements.add(createMusicalElement("circle", color, x, y, scale));
    }

    // Add spheres
    for (let i = 0; i < 4; i++) {
      const color = colors[(i + 1) % colors.length];
      const x = (Math.random() - 0.5) * 3 + 1;
      const y = (Math.random() - 0.5) * 3;
      const scale = Math.random() * 0.3 + 0.2;
      elements.add(createMusicalElement("sphere", color, x, y, scale));
    }

    // Store scene reference
    sceneRef.current = {
      scene,
      camera,
      renderer,
      elements,
      animationId: 0,
    };

    // Animation loop
    const animate = () => {
      const ref = sceneRef.current;
      if (!ref) return;

      ref.animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // Rotate and float each element
      ref.elements.children.forEach((child: any) => {
        if (child.rotationSpeed) {
          child.rotation.x += child.rotationSpeed.x;
          child.rotation.y += child.rotationSpeed.y;
          child.rotation.z += child.rotationSpeed.z;
        }
        
        if (child.floatSpeed !== undefined) {
          child.position.y = child.originalY + Math.sin(time * 2 + child.floatOffset) * 0.3;
        }
      });

      // Slowly rotate the entire group
      ref.elements.rotation.y = Math.sin(time * 0.3) * 0.2;
      ref.elements.rotation.x = Math.cos(time * 0.2) * 0.1;

      ref.renderer.render(ref.scene, ref.camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      sceneRef.current.camera.aspect = width / height;
      sceneRef.current.camera.updateProjectionMatrix();
      sceneRef.current.renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        sceneRef.current.renderer.dispose();
        if (containerRef.current) {
          containerRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ maxWidth: "500px", right: 0 }}
    />
  );
}
