"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface LiquidGlassFilterProps {
  id?: string;
  width?: number;
  height?: number;
  radius?: number;
  intensity?: number;
  blur?: number;
}

/**
 * Generates a displacement map for liquid glass refraction effect.
 * Based on bezel-profile refraction: pixels near the rounded edge
 * are displaced outward, simulating light bending through curved glass.
 *
 * R channel = X displacement (128 = neutral)
 * G channel = Y displacement (128 = neutral)
 */
function generateDisplacementMap(
  width: number,
  height: number,
  radius: number,
  intensity: number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Distance from each edge
      const dx = Math.min(x, width - 1 - x);
      const dy = Math.min(y, height - 1 - y);

      // Distance to nearest corner for rounded rect
      const cx = x < radius ? radius - x : x > width - radius ? x - (width - radius) : 0;
      const cy = y < radius ? radius - y : y > height - radius ? y - (height - radius) : 0;

      let distFromEdge: number;
      let normalX = 0;
      let normalY = 0;

      if (cx > 0 && cy > 0) {
        // Near a corner - distance from the corner arc center
        const cornerDist = Math.sqrt(cx * cx + cy * cy);
        distFromEdge = radius - cornerDist;
        if (cornerDist > 0) {
          normalX = -cx / cornerDist;
          normalY = -cy / cornerDist;
        }
      } else if (dx < dy) {
        distFromEdge = dx;
        normalX = x < width / 2 ? -1 : 1;
      } else {
        distFromEdge = dy;
        normalY = y < height / 2 ? -1 : 1;
      }

      // Glass bezel region (where refraction happens)
      const bezelWidth = radius * 0.8;
      const clamped = Math.max(0, Math.min(1, distFromEdge / bezelWidth));

      // Convex bezel profile: peaks in the middle of the bezel
      // using smoothstep-like curve
      const t = clamped;
      const height2 = t * t * (3 - 2 * t); // smoothstep

      // Derivative gives the slope (how much to displace)
      const derivative = 6 * t * (1 - t);

      // Displacement magnitude based on derivative and intensity
      const magnitude = derivative * intensity * 12;

      // Apply displacement along the surface normal
      const dispX = normalX * magnitude;
      const dispY = normalY * magnitude;

      // Encode to RGBA: 128 = neutral, 0-127 = negative, 129-255 = positive
      data[idx] = Math.max(0, Math.min(255, Math.round(128 + dispX)));     // R = X
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + dispY))); // G = Y
      data[idx + 2] = 128;  // B = unused
      data[idx + 3] = 255;  // A = opaque
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

export default function LiquidGlassFilter({
  id = "liquidGlass",
  width = 400,
  height = 400,
  radius = 24,
  intensity = 1.0,
  blur = 0.5,
}: LiquidGlassFilterProps) {
  const [displacementMap, setDisplacementMap] = useState<string>("");
  const frameRef = useRef<number>(0);

  const regenerate = useCallback(() => {
    if (typeof window === "undefined") return;
    const map = generateDisplacementMap(width, height, radius, intensity);
    setDisplacementMap(map);
  }, [width, height, radius, intensity]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  // Max displacement in pixels (each channel can shift -128 to +127)
  const maxDisplacement = intensity * 12;

  return (
    <svg
      width={0}
      height={0}
      style={{ position: "absolute", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <defs>
        <filter
          id={id}
          colorInterpolationFilters="sRGB"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
        >
          {/* Load the displacement map */}
          {displacementMap && (
            <feImage
              href={displacementMap}
              x={0}
              y={0}
              width={width}
              height={height}
              result="displacement_map"
              preserveAspectRatio="none"
            />
          )}

          {/* Apply displacement for refraction */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="displacement_map"
            scale={maxDisplacement}
            xChannelSelector="R"
            yChannelSelector="G"
            result="refracted"
          />

          {/* Subtle blur to soften refraction edges */}
          <feGaussianBlur
            in="refracted"
            stdDeviation={blur}
            result="blurred"
          />

          {/* Specular highlight - bright edge glow */}
          <feSpecularLighting
            in="blurred"
            surfaceScale={3}
            specularConstant={0.8}
            specularExponent={30}
            lightingColor="white"
            result="specular"
          >
            <fePointLight x={width * 0.3} y={height * -0.3} z={200} />
          </feSpecularLighting>

          {/* Composite specular onto refracted image */}
          <feComposite
            in="specular"
            in2="blurred"
            operator="arithmetic"
            k1={0}
            k2={1}
            k3={0.15}
            k4={0}
          />
        </filter>

        {/* Simpler filter for fallback (blur + slight displacement) */}
        <filter
          id={`${id}-simple`}
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={12} result="blurred" />
          <feColorMatrix
            in="blurred"
            type="saturate"
            values="1.4"
            result="saturated"
          />
        </filter>
      </defs>
    </svg>
  );
}
