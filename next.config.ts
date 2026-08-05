import type { NextConfig } from "next";

/**
 * TICKET P5-01 — legacy Wix redirect map.
 * Every legacy URL from the Phase 0 inventory gets an entry here.
 * Rule: no published URL ever changes without a 301. Zero chains.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy Wix site had only Home, Blog, and Contact. /contact maps 1:1 and
      // "/" stays home, so only the blog needs a 301 (until a real blog ships).
      // This also catches the three old Wix demo blog posts.
      { source: "/blog", destination: "/", permanent: true },
      { source: "/blog/:slug*", destination: "/", permanent: true },
    ];
  },
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
