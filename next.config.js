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
}

module.exports = nextConfig