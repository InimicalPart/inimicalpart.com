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
        source: '/api/v1/age/img.png',
        destination: '/api/v1/age/img',
      },
      {
        source: '/v1/age/img.png',
        destination: '/v1/age/img',
      },
    ]
  }
}