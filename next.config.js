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