import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const hasPublicApiBase = !!process.env.NEXT_PUBLIC_API_BASE_URL;

const nextConfig: NextConfig = {
  transpilePackages: [],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { externalDir: true },
  async rewrites() {
    // Only proxy to localhost API in development when a public base isn't set
    if (!isProd && !hasPublicApiBase) {
      return [
        {
          source: "/api/:path*",
          destination: "http://localhost:5000/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
