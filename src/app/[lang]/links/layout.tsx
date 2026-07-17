// src/app/[lang]/links/layout.tsx
import { headers } from 'next/headers'
import { Metadata } from 'next'

// 🌟 改用動態產生器：根據客人的通訊軟體，自動發送最適合的著名名片格式！
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers()
  const userAgent = (headersList.get('user-agent') || '').toLowerCase()

  // 🕵️‍♂️ 偵測是否為 LINE (linespider) 或 微信 (micromessenger) 等強迫正方形的亞洲平台
  const isSquarePlatform = userAgent.includes('line') || userAgent.includes('micromessenger')

  if (isSquarePlatform) {
    // 🟢 【LINE / 微信 專屬通道】投其所好，直接給它最完美的 1:1 純方形名片！
    return {
      title: '楓梵 Feng-Fang ╳ Business Card',
      description: 'Fun ArTrip 楓藝 Art & Culture Interpretation Atelier',
      openGraph: {
        title: '楓梵 Feng-Fang ╳ Business Card',
        description: 'Fun ArTrip 楓藝 Art & Culture Interpretation Atelier',
        url: 'https://www.funartrip.com/links',
        siteName: 'Fun ArTrip 楓藝',
        type: 'website',
        images: [
          {
            url: 'https://www.funartrip.com/og-image.jpg', // 方形圖
            width: 600,
            height: 600,
          },
        ],
      },
      twitter: {
        card: 'summary', // 鎖定方形排版
        title: '楓梵 Feng-Fang ╳ Business Card',
        description: 'Fun ArTrip 楓藝 Art & Culture Interpretation Atelier',
        images: ['https://www.funartrip.com/og-image.jpg'],
      },
    }
  }

  // 🔵 【WhatsApp / FB / 歐美平台 預設通道】大氣放行，展現滿版大圖的精品風範！
  return {
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
          url: 'https://www.funartrip.com/og-links.jpg', // 橫式大圖
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image', // 強制開啟橫式大圖模式
      title: '楓梵 Feng-Fang ╳ Business Card',
      description: 'Fun ArTrip 楓藝 Art & Culture Interpretation Atelier',
      images: ['https://www.funartrip.com/og-links.jpg'],
    },
  }
}

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}