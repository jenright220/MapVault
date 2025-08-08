/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/mapvault',
  assetPrefix: '/mapvault',
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Ensure static files are served correctly
  trailingSlash: false,
  // Configure headers for static files
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  // Configure image optimization
  images: {
    remotePatterns: [],
    domains: [],
    unoptimized: false, // Keep optimization but configure properly
    loader: 'default',
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
}

module.exports = nextConfig