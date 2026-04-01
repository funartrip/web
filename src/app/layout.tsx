import type { Metadata } from 'next'
import "./globals.css";
// 引入我們做好的客戶端包裹器
import ClientLayout from "@/components/ClientLayout"; 
import Script from 'next/script'

// 🌟 1. 設定 SEO 元資料
export const metadata: Metadata = {
  title: {
    template: '%s | Fun ArTrip 楓藝',
    default: 'Fun ArTrip 楓藝 | 您的下一趟文化探險',
  },
  description: '由法國國家認證導遊與文化推廣員楓芳帶領，提供巴黎與里昂的專屬城市漫步與博物館導覽，將藝術、歷史與遺產轉化為您親身經歷的故事。',
  keywords: ['法國導遊', '巴黎導覽', '里昂導覽', '博物館解說', '文化轉譯', 'Fun ArTrip', '法國旅遊', '羅浮宮解說'],
  openGraph: {
    title: 'Fun ArTrip 楓藝 | 法國深度文化導覽',
    description: '您的下一趟文化探險，從這裡開始。由持證解說員楓梵帶您深入體驗法式藝術與歷史。',
    url: 'https://web-psi-seven-35.vercel.app', // 🌟 之後買了網域記得回來改這裡
    siteName: 'Fun ArTrip 楓藝',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fun ArTrip 楓藝',
      },
    ],
    locale: 'zh_TW',
    type: 'website',
  },
}

// 🌟 2. 唯一的 RootLayout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW" className="scroll-smooth">
      <body className="antialiased bg-[#FDFBF5]">
        {/* 用 ClientLayout 把網站內容包起來，確保動畫流暢 */}
        <ClientLayout>
          {children}
        </ClientLayout>

        {/* --- 🍋 檸檬塔 (Tarteaucitron) 開始 --- */}
        
        <Script 
          src="/tarteaucitron/tarteaucitron.js" 
          strategy="beforeInteractive" 
        />

        {/* 2. 初始化 */}
        <Script id="tarteaucitron-init">
          {`
            // 強制抓取本地的資源路徑
            var tarteaucitronCustomPath = '/tarteaucitron/'; 

            tarteaucitron.init({
              "privacyUrl": "/legal", 
              "hashtag": "#tarteaucitron", 
              "cookieName": "funartrip_cookies",
              "orientation": "bottom", 
              "showAlertSmall": false, 
              "cookieslist": false, 
              "adblocker": false,
              "DenyAllCta" : true,
              "AcceptAllCta" : true,
              "highPrivacy": true,
              "handleBrowserLang": true,
              "placeholder": true
            });

            tarteaucitron.user.gtagUa = 'G-MG8CT41JTT';
            (tarteaucitron.job = tarteaucitron.job || []).push('gtag');
          `}
        </Script>
      </body>
    </html>
  );
}