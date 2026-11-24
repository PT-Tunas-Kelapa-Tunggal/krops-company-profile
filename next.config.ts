import type { NextConfig } from "next";

/**
 * Caching. Every URL the page emits for /assets/* and /css/* carries
 * ?v=<content hash> (src/lib/assets.ts), so a changed file always gets a new
 * URL. Versioned requests are cached for a year; anything requested without
 * a version (old links, manual visits) revalidates every time (cheap 304).
 */
const YEAR = "public, max-age=31536000, immutable";
const REVALIDATE = "public, no-cache";

const nextConfig: NextConfig = {
  // Self-contained server build (used by the Dockerfile; Vercel ignores it).
  output: "standalone",
  devIndicators: false,
  async headers() {
    return [
      { source: "/:dir(assets|css)/:path*", headers: [{ key: "Cache-Control", value: REVALIDATE }] },
      // Listed last so it overrides the rule above.
      {
        source: "/:dir(assets|css)/:path*",
        has: [{ type: "query", key: "v" }],
        headers: [{ key: "Cache-Control", value: YEAR }],
      },
    ];
  },
};

export default nextConfig;
