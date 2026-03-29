import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // KOPIS 공연 포스터 이미지
      { protocol: "https", hostname: "www.kopis.or.kr" },
      { protocol: "http", hostname: "www.kopis.or.kr" },
    ],
  },
};

export default nextConfig;
