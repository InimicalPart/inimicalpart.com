"use client"

import { useEffect, useState } from "react"

/**
 * Decorative liquid glass orbs that float in the background.
 * Uses SVG displacement mapping to create a convex lens refraction effect.
 * Drop into any page layout for ambient glass decoration.
 */
export default function GlassOrbs() {
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
          magnitude = normDist * normDist * 0.8
        }

        if (dist > 0 && dist <= radius) {
          const angle = Math.atan2(dy, dx)
          const r = Math.round((-Math.cos(angle) * magnitude + 1) * 127.5)
          const g = Math.round((-Math.sin(angle) * magnitude + 1) * 127.5)
          data[idx] = Math.min(255, Math.max(0, r))
          data[idx + 1] = Math.min(255, Math.max(0, g))
          data[idx + 2] = 128
          data[idx + 3] = 255
        } else {
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

  const orbStyle = (size: string, top: string, side: string, offset: string, opacity: number, blur: string) => ({
    position: "absolute" as const,
    [side]: offset,
    top,
    width: size,
    height: size,
    borderRadius: "50%",
    overflow: "hidden" as const,
    filter:
      filterReady && mapUrl
        ? "url(#glass-orbs-filter)"
        : undefined,
    backdropFilter: `blur(${blur}) saturate(1.5)`,
    WebkitBackdropFilter: `blur(${blur}) saturate(1.5)`,
    background: "rgba(255,255,255,0.02)",
    boxShadow:
      "0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(0,0,0,0.12), inset 0 -15px 30px rgba(255,255,255,0.04)",
    pointerEvents: "none" as const,
    zIndex: 0,
    opacity,
  })

  return (
    <>
      {filterReady && mapUrl && (
        <svg
          width="0"
          height="0"
          style={{ position: "absolute", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <defs>
            <filter
              id="glass-orbs-filter"
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
          </defs>
        </svg>
      )}

      <div aria-hidden="true" style={orbStyle("200px", "5%", "right", "-8%", 0.7, "4px")} />
      <div aria-hidden="true" style={orbStyle("110px", "30%", "left", "-4%", 0.45, "3px")} />
      <div aria-hidden="true" style={orbStyle("140px", "65%", "right", "-5%", 0.35, "3px")} />
    </>
  )
}
