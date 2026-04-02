// src/components/ClientLayout.tsx
'use client'

import Navbar from "@/components/Navbar";
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
// 🌟 引入 sanity client
import { client } from '@/sanity/lib/client';
// 🌟 引入 Icon，新增了 FaFacebookF (使用單純 F 的版本比較現代)
import { FaInstagram, FaLinkedinIn, FaFacebookF, FaEnvelope } from 'react-icons/fa';

// 🌟 Footer 內容組件
function FooterContent() {
  const searchParams = useSearchParams();
  const lang = searchParams.get('lang') || 'zh_tw';
  
  // 🌟 1. 建立存放精選路線的 State
  const [featuredTours, setFeaturedTours] = useState<any[]>([]);

  const ft: any = {
    zh_tw: {
      guideTitle: '法國官方持證導覽解說員 (Guide-conférencier)',
      services: '里昂城市解說 ｜ 巴黎・里昂博物館導讀',
      sitemap: '網站地圖', home: '首頁', about: '關於我', tours: '探索路線', portfolio: '合作專案', blog: '旅行誌', contact: '預約聯絡',
      featured: '精選路線', more: '更多冒險路線', legal: '法律與責任條款', mentions: "法律資訊", cgv: "一般銷售條款",
    },
    zh_cn: {
      guideTitle: '法国官方持证导览解说员 (Guide-conférencier)',
      services: '里昂城市解说 ｜ 巴黎・里昂博物馆导读',
      sitemap: '网站地图', home: '首页', about: '关于我', tours: '探索路线', portfolio: '合作专案', blog: '旅行志', contact: '预约联系',
      featured: '精选路线', more: '更多冒险路线', legal: '法律与责任条款', mentions: "法律信息", cgv: "一般销售条款",
    },
    fr: {
      guideTitle: "Guide-conférencier agréé par l'État français",
      services: 'Visites de Lyon | Conférences dans les musées de Paris et Lyon',
      sitemap: 'Plan du site', home: 'Accueil', about: 'À propos', tours: 'Explore Tours', portfolio: 'Projets', blog: 'Blog', contact: 'Contact',
      featured: 'Parcours phares', more: 'Plus de parcours', legal: 'Mentions Légales', mentions: "Mentions Légales", cgv: "Conditions Générales de Vente (CGV)",
    },
    en: {
      guideTitle: 'French State Licensed Tour Guide (Guide-conférencier)',
      services: 'Lyon City Tours | Museum Tours in Paris & Lyon',
      sitemap: 'Sitemap', home: 'Home', about: 'About Me', tours: 'Explore Tours', portfolio: 'Projects', blog: 'Blog', contact: 'Inquiry',
      featured: 'Featured Tours', more: 'More adventures', legal: 'Legal & Terms', mentions: "Legal Notice", cgv: "Terms & Conditions (CGV)",
    }
  };

  const t = ft[lang] || ft.zh_tw;

  // 🌟 2. useEffect 抓取 Sanity 資料
  useEffect(() => {
    const fetchFooterTours = async () => {
      const query = `*[_type == "tour" && isFeatured == true]{
        _id,
        title,
        slug
      }`;
      const data = await client.fetch(query);
      setFeaturedTours(data);
    };

    fetchFooterTours();
  }, []);

  return (
    <footer className="bg-[#EAE6D9] text-[#2C3522] pt-24 pb-12 px-6 border-t border-[#DCD7C8]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* 左側：品牌資訊 */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white px-6 py-3 inline-block rounded-xl shadow-sm font-bold border border-slate-100 text-sm">
              Fun ArTrip 楓藝
            </div>
            <div className="space-y-2">
              <h4 className="text-2xl font-extrabold tracking-tight">Fun ArTrip 楓藝</h4>
              <p className="text-sm font-bold text-[#5C6B47] leading-relaxed">
                {t.guideTitle} <br/>
                {t.services}
              </p>
            </div>
            <div className="text-[#8C9A76] font-bold text-[10px] tracking-[0.4em] uppercase">
              Art ╳ Culture ╳ Tour ╳ Life
            </div>
            
            {/* 🌟 修改： Icon 版本的外部連結 */}
            <div className="flex gap-4 items-center pt-2">
              <a 
                href="https://www.instagram.com/funartrip/" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Fun ArTrip Instagram"
                className="hover:text-[#D4C376] hover:scale-110 transition-all duration-300 p-2 -ml-2"
              >
                <FaInstagram className="size-[22px]" />
              </a>
              <a 
                href="https://www.facebook.com/funartrip" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Fun ArTrip Facebook"
                className="hover:text-[#D4C376] hover:scale-110 transition-all duration-300 p-2"
              >
                <FaFacebookF className="size-[20px]" /> {/* FB的F稍微小一點點，視覺上比較平衡 */}
              </a>
              <a 
                href="https://www.linkedin.com/in/feng-fang-lee" 
                target="_blank" 
                rel="noopener noreferrer"
                title="Fun ArTrip LinkedIn"
                className="hover:text-[#D4C376] hover:scale-110 transition-all duration-300 p-2"
              >
                <FaLinkedinIn className="size-[22px]" />
              </a>
              <a 
                href="mailto:contact@funartrip.com" 
                title="Contact Fun ArTrip via Email"
                className="hover:text-[#D4C376] hover:scale-110 transition-all duration-300 p-2"
              >
                <FaEnvelope className="size-[22px]" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* 網站地圖 */}
            <div>
              <h5 className="font-extrabold border-b-2 border-[#2C3522] inline-block mb-8 pb-1">{t.sitemap}</h5>
              <ul className="space-y-5 text-[20px] font-bold text-[#5C6B47]">
                <li><Link href={`/?lang=${lang}`}>{t.home}</Link></li>
                <li><Link href={`/about?lang=${lang}`}>{t.about}</Link></li>
                <li><Link href={`/tours?lang=${lang}#tours`}>{t.tours}</Link></li>
                <li><Link href={`/portfolios?lang=${lang}`}>{t.portfolio}</Link></li>
                <li><Link href={`/blog?lang=${lang}`}>{t.blog}</Link></li>
                <li><Link href={`/contact?lang=${lang}`}>{t.contact}</Link></li>
              </ul>
            </div>

            {/* 動態精選路線區 */}
            <div>
              <h5 className="font-extrabold border-b-2 border-[#2C3522] inline-block mb-8 pb-1">{t.featured}</h5>
              <ul className="space-y-5 text-base font-bold text-[#5C6B47]">
                {featuredTours.map((tour) => (
                  <li key={tour._id}>
                    <Link 
                      href={`/tours/${tour.slug.current}?lang=${lang}`}
                      className="hover:text-[#D4C376] transition-colors line-clamp-1"
                    >
                      {tour.title?.[lang] || tour.title?.['zh_tw']}
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link href={`/tours?lang=${lang}#tours`} className="text-xs text-[#8C3B3B] hover:opacity-70 transition-opacity">
                    {t.more} {'>>>'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* 法律資訊 */}
            <div>
              <h5 className="font-extrabold border-b-2 border-[#2C3522] inline-block mb-8 pb-1">{t.legal}</h5>
              <ul className="space-y-5 text-base font-bold text-[#5C6B47]">
                <li><Link href={`/legal/mentions-legales?lang=${lang}`}>{t.mentions}</Link></li>
                <li><Link href={`/legal/cgv?lang=${lang}`}>{t.cgv}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底層版權 */}
        <div className="border-t border-[#2C3522]/10 pt-10 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold tracking-widest text-[#8C9A76]">
          <p>Copyright © 2026 Fun ArTrip 楓藝. All rights reserved.</p>
          <p>Developed by <span className="text-[#2C3522]">Lee Feng-Fang</span> | Powered by <span className="text-[#2C3522]">Next.js & Sanity</span></p>
        </div>
      </div>
    </footer>
  );
}

// ClientLayout 主組件
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const [showTopBtn, setShowTopBtn] = useState(false);
  const isStudio = pathname.startsWith('/studio');

  useEffect(() => {
    if (isStudio) return; 
    const handleBtn = () => setShowTopBtn(window.scrollY > 400);
    window.addEventListener('scroll', handleBtn);
    return () => window.removeEventListener('scroll', handleBtn);
  }, [isStudio]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <Suspense fallback={<div className="h-20" />}>
        <Navbar />
      </Suspense>

      {children}

      {showTopBtn && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 bg-[#5C6B47]/30 backdrop-blur-md text-white w-12 h-12 rounded-full flex items-center justify-center border border-white/10 hover:bg-[#5C6B47] transition-all shadow-lg text-xl"
        >
          ↑
        </button>
      )}

      <Suspense fallback={<div className="h-40 bg-[#EAE6D9]" />}>
        <FooterContent />
      </Suspense>
    </>
  );
}