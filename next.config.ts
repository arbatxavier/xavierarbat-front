import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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
  async rewrites() {
    return [
      {
        source: "/images/:path*",
        destination: "https://api.xavierarbat.com/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
