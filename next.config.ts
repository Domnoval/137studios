import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Temporarily ignore ESLint during builds for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type check during build
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
