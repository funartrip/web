// src/app/[lang]/links/layout.tsx
import { Metadata } from 'next'

// 🌟 專為通訊軟體（LINE, WeChat, WhatsApp）打造的頂級名片網籤
export const metadata: Metadata = {
  title: '李楓梵 Lee, Feng-Fang | Fun ArTrip 楓藝',
  description: '法國官方持證導覽解說員 Guide-Conférencière Agréée. 藝術 ╳ 文化 ╳ 導覽 ╳ 生活',
  
  // 核心 Open Graph 設定
  openGraph: {
    title: '李楓梵 Lee, Feng-Fang ╳ 數位名片',
    description: '點擊進入 Fun ArTrip 楓藝高訂品牌傳送門，直接與我聯絡。',
    url: 'https://www.funartrip.com/links',
    siteName: 'Fun ArTrip 楓藝',
    type: 'website',
    images: [
      {
        // 🌟 這裡精準指向你剛剛放入 public 的 1200x630 名片圖檔
        url: 'https://www.funartrip.com/og-links.jpg',
        width: 1200,
        height: 630,
        alt: 'Fun ArTrip 楓藝 - 李楓梵 數位名片',
      },
    ],
  },
  
  // 針對 Twitter / iOS 系統的預覽卡片優化
  twitter: {
    card: 'summary_large_image',
    title: '李楓梵 Lee, Feng-Fang | Fun ArTrip 楓藝',
    description: '點擊進入 Fun ArTrip 楓藝高訂品牌傳送門，直接與我聯絡。',
    images: ['https://www.funartrip.com/og-links.jpg'],
  },
}

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}