"use client";

import { useEffect, useRef } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      radius: number;
      color: string;
      velocity: { x: number; y: number };
      alpha: number;
    }> = [];

    const colors = [
      "#00d4ff", // electric blue
      "#38e0ff", // blue hover
      "#94a3b8", // muted slate
      "#66e6ff", // light blue
      "#99eeff", // pale blue
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = Math.floor((canvas.width * canvas.height) / 15000);

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2 + 1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius,
          color: colors[Math.floor(Math.random() * colors.length)],
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
          },
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();

        // Draw connections
        particles.slice(index + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = (1 - distance / 120) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Update position
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        // Bounce off walls
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.velocity.x *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.velocity.y *= -1;
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(drawParticles);
    };

    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "linear-gradient(to bottom right, #0a0f1a, #111827, #1e293b)" }}
    />
  );
}
