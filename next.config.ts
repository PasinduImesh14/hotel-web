import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    qualities: [90], // Add any custom qualities used in your Image components
  },
};

export default nextConfig;
