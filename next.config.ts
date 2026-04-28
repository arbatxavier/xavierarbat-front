import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Prioritize Env Var (Coolify/Production), then Local Dev, then Production Fallback
const BACKEND_URL = process.env.NEXT_PUBLIC_API_ROOT || (isDev ? "http://localhost:8080" : "https://api.xavierarbat.com");

// Extract protocol, hostname and port for remotePatterns
const url = new URL(BACKEND_URL);
const protocol = url.protocol.replace(":", "") as "http" | "https";
const hostname = url.hostname;
const port = url.port;

const nextConfig: NextConfig = {
  images: {
    // In dev, skip server-side image optimization to avoid SSL cert issues
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xavierarbat.com",
        pathname: "/images/**",
      },
      {
        protocol: protocol,
        hostname: hostname,
        port: port,
        pathname: "/**",
      },
      // Keep production fallback pattern just in case
      {
        protocol: "https",
        hostname: "api.xavierarbat.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    // In production, proxy transparently (same origin, no CORS, clean URLs)
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
