require('next-ws/server').verifyPatch();
module.exports = {
  reactStrictMode: false,
  distDir: "build",
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost", "inimicalpart.com", "*.inimicalpart.com"],
    },
    instrumentationHook: true,
  },
  poweredByHeader: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/v1/auth/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
      },
    ]
  }
}