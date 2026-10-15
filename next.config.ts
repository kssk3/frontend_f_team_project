import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 학습용 mock 배너 이미지(Lorem Picsum seed URL) 허용
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/seed/**",
        search: "",
      },
    ],
  },
  turbopack: {
    rules: {
      // *.module.css is excluded so Turbopack keeps treating it as a CSS Module
      "*.css": {
        condition: { not: { path: "*.module.css" } },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
