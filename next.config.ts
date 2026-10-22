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
      {
        // 상품 사진(DB product_images.image_url) — Unsplash 무료 사진만 (유료 plus.unsplash.com 제외)
        // 크기·자르기 쿼리(?w=900&h=1200&fit=crop&q=80)가 붙으므로 search 는 제한하지 않는다
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-*",
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
