import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Disable source maps in production — saves memory + CPU
  productionBrowserSourceMaps: false,

  // Image optimisation: cache aggressively, fewer size variants = fewer sharp calls
  images: {
    minimumCacheTTL:  86400,             // Cache optimised images for 24 hours
    deviceSizes:      [640, 1080, 1920], // 3 sizes instead of 8 (fewer CPU spikes)
    imageSizes:       [32, 64, 128],     // 3 sizes instead of 8
    formats:          ["image/webp"],    // Only generate webp (skip avif — CPU-heavy)
  },

  // HTTP cache headers for static assets served by standalone server
  async headers() {
    return [
      {
        // Static assets: cache for 1 year in browser
        source:  "/_next/static/:path*",
        headers: [{ key:"Cache-Control", value:"public, max-age=31536000, immutable" }],
      },
      {
        // Logo + icon files: cache for 1 week
        source:  "/logos/:file*",
        headers: [{ key:"Cache-Control", value:"public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
