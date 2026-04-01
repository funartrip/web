import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 第一位室友：圖片設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**', // 允許 sanity cdn 下的所有路徑
      },
    ],
  }, // ⚠️ 注意這個逗號！代表 images 房間到此結束

  // 第二位室友：手機連線通行證 (放在 images 的外面！)
  allowedDevOrigins: ['192.168.1.32'],
};

export default nextConfig;