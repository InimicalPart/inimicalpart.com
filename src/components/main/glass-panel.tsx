"use client";

import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  blur?: number;
  saturation?: number;
  style?: CSSProperties;
}

/**
 * Glass panel with liquid refraction effect.
 * Generates a per-element SVG displacement map for real refraction (Chrome).
 * Falls back to enhanced glassmorphism in other browsers.
 */
export default function GlassPanel({
  children,
  className = "",
  intensity = 0.6,
  blur = 16,
  saturation = 1.6,
  style,
}: GlassPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [filterId] = useState(
    () => `glass-${Math.random().toString(36).slice(2, 9)}`
  );
  const [displacementMap, setDisplacementMap] = useState<string>("");
  const [dims, setDims] = useState({ w: 400, h: 400 });
  const [supportsSVGFilter, setSupportsSVGFilter] = useState(false);

  // Check if browser supports SVG filters as backdrop-filter
  useEffect(() => {
    const el = document.createElement("div");
    el.style.backdropFilter = "url(#test)";
    setSupportsSVGFilter(el.style.backdropFilter.includes("url"));
  }, []);

  // Generate displacement map for this panel
  const generateMap = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const rect = panel.getBoundingClientRect();
    const w = Math.ceil(rect.width);
    const h = Math.ceil(rect.height);
    if (w < 1 || h < 1) return;

    setDims({ w, h });

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    const radius = 24;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;

        const dx = Math.min(x, w - 1 - x);
        const dy = Math.min(y, h - 1 - y);

        const cx = x < radius ? radius - x : x > w - radius ? x - (w - radius) : 0;
        const cy = y < radius ? radius - y : y > h - radius ? y - (h - radius) : 0;

        let distFromEdge: number;
        let nx = 0;
        let ny = 0;

        if (cx > 0 && cy > 0) {
          const cornerDist = Math.sqrt(cx * cx + cy * cy);
          distFromEdge = radius - cornerDist;
          if (cornerDist > 0) {
            nx = -cx / cornerDist;
            ny = -cy / cornerDist;
          }
        } else if (dx < dy) {
          distFromEdge = dx;
          nx = x < w / 2 ? -1 : 1;
        } else {
          distFromEdge = dy;
          ny = y < h / 2 ? -1 : 1;
        }

        const bezelWidth = radius * 0.8;
        const t = Math.max(0, Math.min(1, distFromEdge / bezelWidth));
        const derivative = 6 * t * (1 - t);
        const magnitude = derivative * intensity * 8;

        const dispX = nx * magnitude;
        const dispY = ny * magnitude;

        data[idx] = Math.max(0, Math.min(255, Math.round(128 + dispX)));
        data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + dispY)));
        data[idx + 2] = 128;
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setDisplacementMap(canvas.toDataURL());
  }, [intensity]);

  useEffect(() => {
    generateMap();

    const panel = panelRef.current;
    if (!panel) return;

    const observer = new ResizeObserver(generateMap);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [generateMap]);

  const maxDisplacement = intensity * 8;

  return (
    <>
      {/* Hidden SVG filter for this specific panel */}
      {supportsSVGFilter && displacementMap && (
        <svg
          width={0}
          height={0}
          style={{ position: "absolute", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <defs>
            <filter
              id={filterId}
              colorInterpolationFilters="sRGB"
              x="-5%"
              y="-5%"
              width="110%"
              height="110%"
            >
              <feImage
                href={displacementMap}
                x={0}
                y={0}
                width={dims.w}
                height={dims.h}
                result="displacement_map"
                preserveAspectRatio="none"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="displacement_map"
                scale={maxDisplacement}
                xChannelSelector="R"
                yChannelSelector="G"
                result="refracted"
              />
              <feGaussianBlur in="refracted" stdDeviation={0.3} />
            </filter>
          </defs>
        </svg>
      )}

      <div
        ref={panelRef}
        className={`glass-panel ${className}`}
        style={{
          ...style,
          backdropFilter: supportsSVGFilter
            ? `url(#${filterId}) blur(${blur}px) saturate(${saturation})`
            : `blur(${blur}px) saturate(${saturation})`,
          WebkitBackdropFilter: supportsSVGFilter
            ? `url(#${filterId}) blur(${blur}px) saturate(${saturation})`
            : `blur(${blur}px) saturate(${saturation})`,
          background: `
            linear-gradient(
              135deg,
              rgba(255, 255, 255, 0.12) 0%,
              rgba(255, 255, 255, 0.05) 50%,
              rgba(255, 255, 255, 0.02) 100%
            )
          `,
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: `
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            inset 0 -1px 0 rgba(0, 0, 0, 0.05),
            0 8px 32px rgba(0, 0, 0, 0.06)
          `,
        }}
      >
        {children}
      </div>
    </>
  );
}
