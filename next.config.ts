import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const BACKEND_URL = isDev ? "http://localhost:8080" : "https://api.xavierarbat.com";

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
        protocol: isDev ? "http" : "https",
        hostname: isDev ? "localhost" : "api.xavierarbat.com",
        port: isDev ? "8080" : "",
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
            destination: `${BACKEND_URL}/uploads/:path*`,
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
            destination: `${BACKEND_URL}/uploads/:path*`,
            permanent: false,
          },
        ]
      : [];
  },
};

export default nextConfig;
