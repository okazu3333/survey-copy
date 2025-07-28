import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  env: {
    PORT: process.env.PORT || "8080",
  },
};

export default nextConfig;
