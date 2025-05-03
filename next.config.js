/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["localhost", "placeholder.com", "via.placeholder.com"],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add this configuration to disable static generation for authenticated pages
  exportPathMap: async (defaultPathMap, { dev, dir, outDir, distDir, buildId }) => ({
    ...defaultPathMap,
    "/dashboard": { page: "/dashboard", _isDynamicRoute: true },
    "/profile": { page: "/profile", _isDynamicRoute: true },
    "/upload": { page: "/upload", _isDynamicRoute: true },
    "/settings": { page: "/settings", _isDynamicRoute: true },
  }),
}

module.exports = nextConfig
