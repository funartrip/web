// src/app/[lang]/links/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '李楓梵 Lee, Feng-Fang | Fun ArTrip 楓藝',
  description: '法國官方持證導覽解說員 Guide-Conférencière Agréée.',
  
  openGraph: {
    title: '李楓梵 ╳ 數位名片',
    description: '點擊進入 Fun ArTrip 楓藝高訂品牌傳送門，直接與我聯絡。',
    url: 'https://www.funartrip.com/links',
    siteName: 'Fun ArTrip 楓藝',
    type: 'website',
    images: [
      {
        // 🌟 1200x630 橫式大圖
        url: 'https://www.funartrip.com/og-links.jpg',
        width: 1200,
        height: 630,
        alt: 'Fun ArTrip 楓藝 - 李楓梵 數位名片',
      },
    ],
  },
  
  twitter: {
    // 🌟 核心關鍵：這個 summary_large_image 參數，會強迫 LINE 和各大社群平台「必須使用滿版大圖」來顯示！
    card: 'summary_large_image', 
    title: '李楓梵 ╳ 數位名片',
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