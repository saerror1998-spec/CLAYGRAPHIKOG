import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // There is an unrelated lockfile in the parent directory; keep tracing
  // rooted in this project so the workspace root is never misdetected.
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        source: "/services/brand-identity",
        destination: "/services/strategy-identity",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
