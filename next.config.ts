import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output — smaller bundle, faster startup, reduces what Turbopack traces
  output: "standalone",

  // Reduce memory pressure during build: disable source maps in production
  productionBrowserSourceMaps: false,

  // Increase timeout for image optimization on a low-resource VPS
  images: {
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
