'use client'

import { useState, useEffect, Suspense } from 'react'
import Script from 'next/script'
import { useParams } from 'next/navigation' // 🌟 蟲蟲 1 修復：引入抓參數的工具

function CookieBannerContent() {
  const [showBanner, setShowBanner] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)
  
  // 抓取目前的語言
  const params = useParams();
  const lang = (params?.lang as string) || 'en';
 

  // 建立四語翻譯字典
  const cookieTexts: any = {
    zh_tw: {
      title: '隱私與 Cookie',
      desc: <>我們僅使用 Cookie 來匿名分析網站流量並改善內容，<b className="text-white">絕不使用任何商業廣告追蹤</b>。點擊「接受」即表示您同意這項單純的分析。</>,
      accept: '接受全部',
      decline: '拒絕',
      policy: '隱私權與法律政策'
    },
    zh_cn: {
      title: '隐私与 Cookie',
      desc: <>我们仅使用 Cookie 来匿名分析网站流量并改善内容，<b className="text-white">绝不使用任何商业广告追踪</b>。点击“接受”即表示您同意这项单纯的分析。</>,
      accept: '接受全部',
      decline: '拒绝',
      policy: '隐私与法律政策'
    },
    fr: {
      title: 'Confidentialité & Cookies',
      desc: <>Nous utilisons des cookies uniquement pour analyser anonymement le trafic et améliorer notre contenu. <b className="text-white">Aucun cookie publicitaire n'est utilisé.</b> En cliquant sur « Accepter », vous consentez à cette simple analyse.</>,
      accept: 'Accepter tout',
      decline: 'Refuser',
      policy: 'Politique de Confidentialité'
    },
    en: {
      title: 'Privacy & Cookies',
      desc: <>We use cookies solely to analyze website traffic anonymously and improve our content. <b className="text-white">We do not use any advertising or commercial tracking cookies.</b> By clicking "Accept", you consent to this simple analysis.</>,
      accept: 'Accept All',
      decline: 'Decline',
      policy: 'Privacy Policy & Legal Mentions'
    }
  };

  const t = cookieTexts[lang] || cookieTexts.en;

  useEffect(() => {
    const consent = localStorage.getItem('funartrip-cookie-consent')
    if (consent === null) {
      setShowBanner(true)
    } else if (consent === 'true') {
      setHasConsent(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('funartrip-cookie-consent', 'true')
    setHasConsent(true)
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('funartrip-cookie-consent', 'false')
    setShowBanner(false)
  }

  if (!showBanner && !hasConsent) return null

  return (
    <>
      {/* 🌟 法律核心：只有點了同意，GA4 才會載入 */}
      {hasConsent && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-MG8CT41JTT"
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MG8CT41JTT');
            `}
          </Script>
        </>
      )}

      {/* 🌟 介面設計：左下角精緻卡片 */}
      {showBanner && (
        <div className="fixed bottom-6 left-6 z-[9999] w-[340px] max-w-[90vw] bg-[#767B39] p-8 rounded-[24px] shadow-2xl border border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex flex-col gap-2">
            {/* 🌟 蟲蟲 3 修復：套用多語變數 */}
            <h3 className="font-serif text-[#EAA624] text-xl font-bold italic">{t.title}</h3>
            <p className="text-[#FDFBF5] text-sm leading-relaxed opacity-90">
              {t.desc}
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <button 
              onClick={handleAccept}
              className="w-full bg-[#AADCF2] text-[#2C3522] py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#FDFBF5] transition-all duration-300"
            >
              {t.accept}
            </button>
            <button 
              onClick={handleDecline}
              className="w-full bg-[#F7BCB0] text-[#767B39] py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#FDFBF5] transition-all duration-300"
            >
              {t.decline}
            </button>
          </div>

          <a 
            href={`/${lang}/legal/mentions-legales`} // 順便幫連結加上語言標籤
            className="text-[#EAA624] text-[11px] text-center underline opacity-80 hover:opacity-100"
          >
            {t.policy}
          </a>
        </div>
      )}
    </>
  )
}

// 🌟 蟲蟲 2 修復：用 Suspense 保護起來
export default function CookieBanner() {
  return (
    <Suspense fallback={null}>
      <CookieBannerContent />
    </Suspense>
  )
}