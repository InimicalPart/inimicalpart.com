import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  devIndicators: false,
  reactStrictMode: false,
  distDir: "build",
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", "inimicalpart.com", "*.inimicalpart.com", "inimi.dev", "*.inimi.dev"],
    }
  },
  poweredByHeader: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
      },
    ]
  },
};

export default nextConfig;
