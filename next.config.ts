import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xavierarbat.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "api.xavierarbat.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
