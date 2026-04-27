import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    // In dev, skip server-side image optimization to avoid SSL cert issues
    // with the rewrite proxy to api.xavierarbat.com
    unoptimized: isDev,
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
    // In production, proxy transparently (same origin, no CORS, clean URLs)
    // In dev, skip — redirects handle it instead to avoid Node.js SSL issues
    return isDev
      ? []
      : [
          {
            source: "/images/:path*",
            destination: "https://api.xavierarbat.com/uploads/:path*",
          },
        ];
  },
  async redirects() {
    // In dev, redirect to backend directly so the browser resolves SSL
    // (avoids Node.js server-side proxy hitting SELF_SIGNED_CERT_IN_CHAIN)
    return isDev
      ? [
          {
            source: "/images/:path*",
            destination: "https://api.xavierarbat.com/uploads/:path*",
            permanent: false,
          },
        ]
      : [];
  },
};

export default nextConfig;
