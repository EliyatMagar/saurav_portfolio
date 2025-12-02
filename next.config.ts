// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Empty turbopack config to silence the error
  turbopack: {},
  
  // Basic optimizations
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  
  // Remove invalid experimental.turbo if you have it
  experimental: {
    // Add only valid experimental features
    // serverActions: true,
    // typedRoutes: true,
  },
};

export default nextConfig;