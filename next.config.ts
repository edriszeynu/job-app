// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "6mb",
    },
  },
  async redirects() {
    return [
      { source: "/signin", destination: "/auth/signin", permanent: true },
      { source: "/register", destination: "/auth/register", permanent: true },
      { source: "/login", destination: "/auth/signin", permanent: true },
    ];
  },
};

export default nextConfig;