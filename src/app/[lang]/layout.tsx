import type { Metadata } from 'next'
import "@/app/globals.css"; // 🌟 使用 @ 代表 src 目錄
// 引入我們做好的客戶端包裹器
import ClientLayout from "@/components/ClientLayout"; 
// 🌟 引入我們剛寫好的 CookieBanner 組件
import CookieBanner from "@/components/CookieBanner"; 

// 🌟 1. 核心升級：將靜態的 metadata 改為動態生成的 generateMetadata
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = (resolvedParams?.lang || 'zh_tw').toLowerCase().replace('-', '_');

  // 🌟 建立一個簡單的多語系字典給 SEO 用 (你可以後續自由修改文案)
  const seoDict: any = {
    zh_tw: {
      title: 'Fun ArTrip 楓藝 | 您的下一趟文化探險',
      desc: '由法國國家認證導遊與文化推廣員楓芳帶領，提供巴黎與里昂的專屬城市漫步與博物館導覽，將藝術、歷史與遺產轉化為您親身經歷的故事。'
    },
    zh_cn: {
      title: 'Fun ArTrip 枫艺 | 您的下一趟文化探险',
      desc: '由法国国家认证导游与文化推广员枫芳带领，提供巴黎与里昂的专属城市漫步与博物馆导览，将艺术、历史与遗产转化为您亲身经历的故事。'
    },
    en: {
      title: 'Fun ArTrip | Your Next Cultural Adventure',
      desc: 'Exclusive city walks and museum tours in Paris and Lyon led by a State-Licensed Guide. Transforming art, history, and heritage into your personal story.'
    },
    fr: {
      title: 'Fun ArTrip | Votre Prochaine Aventure Culturelle',
      desc: 'Visites exclusives de Paris et Lyon par un Guide-Conférencier agréé. Transformant l\'art, l\'histoire et le patrimoine en votre propre histoire.'
    }
  };

  const seo = seoDict[lang] || seoDict.zh_tw;

  // 動態決定 OpenGraph 的語系代碼
  const ogLocale = lang === 'zh_tw' ? 'zh_TW' : lang === 'zh_cn' ? 'zh_CN' : lang === 'fr' ? 'fr_FR' : 'en_US';

  return {
    metadataBase: new URL('https://funartrip.com'),
    title: {
      template: '%s | Fun ArTrip',
      default: seo.title,
    },
    description: seo.desc,
    keywords: ['法國導遊', '巴黎導覽', '里昂導覽', '博物館解說', '文化轉譯', 'Fun ArTrip', '法國旅遊', '羅浮宮解說', 'Guide Conférencier', 'Paris Tour', 'Lyon Tour'],
    openGraph: {
      title: seo.title,
      description: seo.desc,
      url: 'https://funartrip.com',
      siteName: 'Fun ArTrip 楓藝',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Fun ArTrip',
        },
      ],
      locale: ogLocale,
      type: 'website',
    },
  }
}

// 🌟 2. 核心升級：讓 RootLayout 接收 params，動態切換 HTML 語言
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;
  
  // 將 zh_tw 轉換成標準的 BCP-47 語言碼 (如 zh-TW) 給 HTML 標籤使用
  const htmlLang = (resolvedParams?.lang || 'zh-tw').replace('_', '-');

  return (
    <html lang={htmlLang} className="scroll-smooth">
      <body className="antialiased bg-[#FDFBF5]">
        <ClientLayout>
          {children}
          {/* 🌟 這樣它就找得到 Cookie 橫幅了 */}
          <CookieBanner />
        </ClientLayout>
      </body>
    </html>
  );
}