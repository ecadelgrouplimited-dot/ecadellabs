import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No standalone output — use npm start which loads VPS's own node_modules
  // (avoids platform-specific native binary issues from cross-platform rsync)

  productionBrowserSourceMaps: false,

  images: {
    minimumCacheTTL: 86400,
    deviceSizes:     [640, 1080, 1920],
    imageSizes:      [32, 64, 128],
    formats:         ["image/webp"],
  },

  async headers() {
    return [
      {
        source:  "/_next/static/:path*",
        headers: [{ key:"Cache-Control", value:"public, max-age=31536000, immutable" }],
      },
      {
        source:  "/logos/:file*",
        headers: [{ key:"Cache-Control", value:"public, max-age=604800, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
