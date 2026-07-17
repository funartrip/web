// src/app/[lang]/links/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '李楓梵 Lee, Feng-Fang | Fun ArTrip 楓藝',
  description: '法國官方持證導覽解說員 Guide-Conférencière',
  
  openGraph: {
    title: '楓梵 Feng-Fang ╳ Business Card',
    description: 'Fun ArTrip 楓藝 Art & Culture Interpretation Atelier',
    url: 'https://www.funartrip.com/links',
    siteName: 'Fun ArTrip 楓藝',
    type: 'website',
    images: [
      {
        // 🌟 1200x630 橫式大圖
        url: 'https://www.funartrip.com/og-links.jpg',
        width: 1200,
        height: 630,
        alt: 'Fun ArTrip 楓藝 - 楓梵 Feng-Fang ╳ Business Card',
      },
    ],
  },
  
  twitter: {
    // 🌟 核心關鍵：這個 summary_large_image 參數，會強迫 LINE 和各大社群平台「必須使用滿版大圖」來顯示！
    card: 'summary_large_image', 
    title: '楓梵 Feng-Fang ╳ Business Card',
    description: ' Fun ArTrip 楓藝 Art & Culture Interpretation Atelier',
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