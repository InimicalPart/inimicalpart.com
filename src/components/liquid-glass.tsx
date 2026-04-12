"use client"

import { useEffect, useState, useMemo, type ReactNode, type CSSProperties } from "react"

/** Lens profile types for refraction simulation */
export type LensType = "convex" | "concave" | "lip"

interface LiquidGlassProps {
  children: ReactNode
  /** Lens type: convex magnifies, concave minifies, lip has a raised edge */
  lens?: LensType
  /** Strength of the displacement effect (0 = off). Default: 6 */
  intensity?: number
  /** Additional backdrop-filter blur in px. Default: 12 */
  blur?: number
  /** Border radius in px. Default: inherits or 16 */
  radius?: number
  /** Extra class names */
  className?: string
  /** Inline styles */
  style?: CSSProperties
}

// ─── displacement-map generator ────────────────────────────────────────────

function generateDisplacementMap(
  size: number,
  radius: number,
  lens: LensType
): string {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  const imgData = ctx.createImageData(size, size)
  const data = imgData.data

  const cx = size / 2
  const cy = size / 2

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const normDist = Math.min(dist / radius, 1)

      let magnitude = 0
      if (dist <= radius && dist > 0) {
        switch (lens) {
          case "convex":
            // magnify: displacement grows toward edge
            magnitude = normDist * normDist
            break
          case "concave":
            // minify: displacement strongest near centre
            magnitude = 1 - normDist * normDist
            break
          case "lip":
            // raised rim: displacement peaks at ~70 % of radius
            magnitude = Math.sin(normDist * Math.PI) * (1 - normDist * 0.5)
            break
        }
      }

      if (dist > 0 && dist <= radius) {
        const angle = Math.atan2(dy, dx)
        // vectors point inward (toward centre) for magnification
        const r = Math.round((-Math.cos(angle) * magnitude + 1) * 127.5)
        const g = Math.round((-Math.sin(angle) * magnitude + 1) * 127.5)
        data[idx] = Math.min(255, Math.max(0, r))
        data[idx + 1] = Math.min(255, Math.max(0, g))
        data[idx + 2] = 128
        data[idx + 3] = 255
      } else {
        // outside the lens: neutral (no displacement)
        data[idx] = 128
        data[idx + 1] = 128
        data[idx + 2] = 128
        data[idx + 3] = 255
      }
    }
  }

  ctx.putImageData(imgData, 0, 0)
  return canvas.toDataURL()
}

// ─── component ─────────────────────────────────────────────────────────────

let filterCounter = 0

export default function LiquidGlass({
  children,
  lens = "convex",
  intensity = 6,
  blur = 12,
  radius = 16,
  className = "",
  style = {},
}: LiquidGlassProps) {
  const filterId = useMemo(
    () => `liquid-glass-${++filterCounter}`,
    []
  )
  const [mapUrl, setMapUrl] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined" || intensity <= 0) return

    const size = 256
    const mapRadius = size / 2
    const url = generateDisplacementMap(size, mapRadius, lens)
    setMapUrl(url)
  }, [lens, intensity])

  return (
    <>
      {/* Hidden SVG filter definition */}
      {mapUrl && (
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <defs>
            <filter
              id={filterId}
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
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
                scale={intensity}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      {/* The glass element */}
      <div
        className={className}
        style={{
          ...style,
          backdropFilter: `blur(${blur}px) saturate(1.8)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(1.8)`,
          filter: mapUrl && intensity > 0 ? `url(#${filterId})` : undefined,
          borderRadius: radius,
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
        }}
      >
        {children}
      </div>
    </>
  )
}

// ─── light-weight helpers (no displacement, just glassmorphism) ────────────

export function GlassContainer({
  children,
  className = "",
  style = {},
  blur = 12,
  radius = 16,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  blur?: number
  radius?: number
}) {
  return (
    <div
      className={className}
      style={{
        ...style,
        backdropFilter: `blur(${blur}px) saturate(1.8)`,
        WebkitBackdropFilter: `blur(${blur}px) saturate(1.8)`,
        borderRadius: radius,
        border: "1px solid rgba(255,255,255,0.18)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)",
      }}
    >
      {children}
    </div>
  )
}
