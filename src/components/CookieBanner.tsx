'use client'

import { useState, useEffect } from 'react'
import Script from 'next/script'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    // 檢查瀏覽器是否存過同意紀錄
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

      {/* 🌟 介面設計：左下角精緻卡片 (梵谷蜜桃色) */}
      {showBanner && (
        <div className="fixed bottom-6 left-6 z-[9999] w-[340px] max-w-[90vw] bg-[#767B39] p-8 rounded-[24px] shadow-2xl border border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex flex-col gap-2">
            <h3 className="font-serif text-[#EAA624] text-xl font-bold italic">Cookie Settings</h3>
            <p className="text-[#FDFBF5] text-sm leading-relaxed opacity-90">
              We use cookies to enhance your experience and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies.
            </p>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <button 
              onClick={handleAccept}
              className="w-full bg-[#AADCF2] text-[#2C3522] py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#FDFBF5] transition-all duration-300"
            >
              Accept All
            </button>
            <button 
              onClick={handleDecline}
              className="w-full bg-[#F7BCB0] text-[#767B39] py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#FDFBF5] transition-all duration-300"
            >
              Decline
            </button>
          </div>

          <a 
            href="/legal/mentions-legales" 
            className="text-[#EAA624] text-[11px] text-center underline opacity-80 hover:opacity-100"
          >
            Privacy Policy & Legal Mentions
          </a>
        </div>
      )}
    </>
  )
}