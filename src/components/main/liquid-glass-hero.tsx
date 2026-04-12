"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Decorative liquid glass orb for the hero section.
 * Uses SVG displacement mapping to create a floating convex lens
 * to create a floating convex lens that distorts the page content behind it.
 */
export default function LiquidGlassHero() {
  const [mapUrl, setMapUrl] = useState<string | null>(null)
  const [filterReady, setFilterReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const size = 256
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")!
    const imgData = ctx.createImageData(size, size)
    const data = imgData.data

    const cx = size / 2
    const cy = size / 2
    const radius = size / 2

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4
        const dx = x - cx
        const dy = y - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const normDist = Math.min(dist / radius, 1)

        let magnitude = 0
        if (dist <= radius && dist > 0) {
          // convex lens: displacement grows toward edge (magnification)
          magnitude = normDist * normDist * 0.8
        }

        if (dist > 0 && dist <= radius) {
          const angle = Math.atan2(dy, dx)
          // vectors point inward for magnification effect
          const r = Math.round((-Math.cos(angle) * magnitude + 1) * 127.5)
          const g = Math.round((-Math.sin(angle) * magnitude + 1) * 127.5)
          data[idx] = Math.min(255, Math.max(0, r))
          data[idx + 1] = Math.min(255, Math.max(0, g))
          data[idx + 2] = 128
          data[idx + 3] = 255
        } else {
          // outside: neutral (no displacement)
          data[idx] = 128
          data[idx + 1] = 128
          data[idx + 2] = 128
          data[idx + 3] = 255
        }
      }
    }

    ctx.putImageData(imgData, 0, 0)
    setMapUrl(canvas.toDataURL())
    setFilterReady(true)
  }, [])

  return (
    <>
      {/* Hidden SVG filter for the glass orb */}
      {filterReady && mapUrl && (
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <defs>
            <filter
              id="hero-liquid-glass-filter"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={mapUrl}
                x="0"
                y="0"
                width="256"
                height="256"
                result="displacement_map"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="displacement_map"
                scale={18}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Radial gradient mask for the orb edge fade */}
            <radialGradient id="hero-orb-mask" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="75%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      )}

      {/* The floating glass orb */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "5%",
          right: "-8%",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          overflow: "hidden",
          filter:
            filterReady && mapUrl
              ? "url(#hero-liquid-glass-filter)"
              : undefined,
          backdropFilter: "blur(4px) saturate(1.5)",
          WebkitBackdropFilter: "blur(4px) saturate(1.5)",
          background: "rgba(255,255,255,0.03)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.1), 0 20px 60px rgba(0,0,0,0.15), inset 0 -20px 40px rgba(255,255,255,0.05)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.7,
        }}
      />

      {/* Second smaller orb - top left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "25%",
          left: "-5%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          overflow: "hidden",
          filter:
            filterReady && mapUrl
              ? "url(#hero-liquid-glass-filter)"
              : undefined,
          backdropFilter: "blur(3px) saturate(1.3)",
          WebkitBackdropFilter: "blur(3px) saturate(1.3)",
          background: "rgba(255,255,255,0.02)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.08), 0 12px 40px rgba(0,0,0,0.1), inset 0 -12px 30px rgba(255,255,255,0.04)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.5,
        }}
      />
    </>
  )
}
