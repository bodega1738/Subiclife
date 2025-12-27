/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = 'cheap-module-source-map';
    }
    return config;
  },
  async headers() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/(.*)',
            headers: [
              {
                key: 'Content-Security-Policy',
                value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: data:; style-src 'self' 'unsafe-inline' data:; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' blob: data:"
              }
            ]
          }
        ]
      : [] // No custom headers for production
  }
}

export default nextConfig
