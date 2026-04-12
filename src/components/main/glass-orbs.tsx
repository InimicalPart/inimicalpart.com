"use client";

import { useEffect, useRef } from "react";

/**
 * Floating glass orbs that create depth and visual interest.
 * Uses CSS glassmorphism with specular highlights to
 * simulate refractive glass spheres.
 */
export default function GlassOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const orbs = container.querySelectorAll(".glass-orb");
    let frame: number;
    let t = 0;

    const animate = () => {
      t += 0.003;
      orbs.forEach((orb, i) => {
        const el = orb as HTMLElement;
        const speed = 0.5 + i * 0.15;
        const amplitude = 15 + i * 5;
        const offsetX = Math.sin(t * speed + i * 1.2) * amplitude;
        const offsetY = Math.cos(t * speed * 0.7 + i * 0.8) * amplitude * 0.6;
        el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Large orb - top left */}
      <div
        className="glass-orb absolute -left-20 -top-16 h-64 w-64 rounded-full sm:h-80 sm:w-80"
        style={{
          background: `
            radial-gradient(circle at 30% 30%,
              rgba(255, 255, 255, 0.25) 0%,
              rgba(255, 255, 255, 0.08) 40%,
              rgba(255, 255, 255, 0.02) 70%,
              transparent 100%
            )
          `,
          backdropFilter: "blur(40px) saturate(1.8)",
          WebkitBackdropFilter: "blur(40px) saturate(1.8)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05),
            0 8px 32px rgba(0, 0, 0, 0.08)
          `,
        }}
      />

      {/* Medium orb - right side */}
      <div
        className="glass-orb absolute -right-16 top-1/4 h-48 w-48 rounded-full sm:h-56 sm:w-56"
        style={{
          background: `
            radial-gradient(circle at 35% 35%,
              rgba(99, 102, 241, 0.15) 0%,
              rgba(99, 102, 241, 0.05) 50%,
              transparent 100%
            ),
            radial-gradient(circle at 30% 30%,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              transparent 100%
            )
          `,
          backdropFilter: "blur(35px) saturate(1.6)",
          WebkitBackdropFilter: "blur(35px) saturate(1.6)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.25),
            0 8px 24px rgba(99, 102, 241, 0.1)
          `,
        }}
      />

      {/* Small orb - bottom */}
      <div
        className="glass-orb absolute bottom-20 left-1/3 h-32 w-32 rounded-full sm:h-40 sm:w-40"
        style={{
          background: `
            radial-gradient(circle at 30% 30%,
              rgba(16, 185, 129, 0.15) 0%,
              rgba(16, 185, 129, 0.04) 50%,
              transparent 100%
            ),
            radial-gradient(circle at 25% 25%,
              rgba(255, 255, 255, 0.2) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              transparent 100%
            )
          `,
          backdropFilter: "blur(30px) saturate(1.5)",
          WebkitBackdropFilter: "blur(30px) saturate(1.5)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 6px 20px rgba(16, 185, 129, 0.08)
          `,
        }}
      />

      {/* Tiny accent orb */}
      <div
        className="glass-orb absolute -bottom-8 right-1/4 h-24 w-24 rounded-full"
        style={{
          background: `
            radial-gradient(circle at 35% 35%,
              rgba(14, 165, 233, 0.18) 0%,
              rgba(14, 165, 233, 0.04) 60%,
              transparent 100%
            )
          `,
          backdropFilter: "blur(25px) saturate(1.4)",
          WebkitBackdropFilter: "blur(25px) saturate(1.4)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 4px 16px rgba(14, 165, 233, 0.08)
          `,
        }}
      />
    </div>
  );
}
