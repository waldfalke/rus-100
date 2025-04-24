/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Temporarily disable ignoring build errors to surface potential type issues
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
  // The custom webpack config below caused the build failure and is removed.
  // It was originally added possibly to address a WasmHash issue.
}

export default nextConfig
