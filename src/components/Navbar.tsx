'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  const searchParams = useSearchParams()
  const lang = searchParams.get('lang') || 'zh_tw'
  
  // 🌟 取得當前路徑，判斷是否在部落格相關頁面
  const pathname = usePathname()
  const isBlog = pathname?.includes('/blog')
  const isLegal = pathname?.includes('/legal')

  // 🌟 核心字典
  const t: any = {
    zh_tw: { about: '關於我', tours: '探索路線', portfolios: '合作專案', blogs: '旅行誌', contact: '預約聯絡', langBtn: 'ZH' },
    zh_cn: { about: '关于我', tours: '探索路线', portfolios: '合作专案', blogs: '旅行志', contact: '预约联系', langBtn: 'CN' },
    fr: { about: 'À propos', tours: 'Explore Tours', portfolios: 'Projets', blogs: 'Blog', contact: 'Contact', langBtn: 'FR' },
    en: { about: 'About', tours: 'Explore Tours', portfolios: 'Projects', blogs: 'Blog', contact: 'Inquiry', langBtn: 'EN' }
  }

  const labels = t[lang] || t.zh_tw

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    
    // 鎖定滾動邏輯
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  // 🌟 修正點 1 & 2：加上 ... 展開符號，並把 dict 改為 labels
  const navLinks = [
    { name: labels.about, href: `/about?lang=${lang}` },
    { name: labels.tours, href: `/tours?lang=${lang}` },
    { name: labels.portfolios, href: `/portfolios?lang=${lang}` },
    ...(lang === 'zh_tw' || lang === 'zh_cn' ? [{ name: labels.blogs, href: `/blogs?lang=${lang}` }] : []),
    { name: labels.contact, href: `/contact?lang=${lang}` },
  ]

  const languages = [
    { name: '繁體中文', code: 'zh_tw' }, // 統一 code 為小寫底線，避免傳遞錯誤
    { name: '简体中文', code: 'zh_cn' },
    { name: 'Français', code: 'fr' },
    { name: 'English', code: 'en' },
  ]

  const handleLangChange = (code: string) => {
    window.location.href = `${window.location.pathname}?lang=${code}`
  }

  // 🌟 動態決定導覽列的背景色
  const navBgClass = isScrolled || isMobileMenuOpen|| isLegal
    ? (isBlog 
        ? 'bg-[#223843] border-b border-[#F2E3C6]/10 py-4 shadow-sm' 
        : 'bg-[#FDFBF5]/80 backdrop-blur-lg border-b border-[#EBE7D9]/50 py-4 shadow-sm'
      )
    : 'bg-transparent py-6'

  // 🌟 動態決定文字與圖標的顏色
  const textColorClass = isScrolled || isMobileMenuOpen|| isLegal
    ? (isBlog ? 'text-[#F2E3C6]' : 'text-[#2C3522]')
    : 'text-white'
    
  const hoverColorClass = isBlog ? 'hover:text-[#D87348]' : 'hover:text-[#D4C376]'
  
  const borderColorClass = isScrolled || isMobileMenuOpen|| isLegal
    ? (isBlog ? 'border-[#F2E3C6]/30' : 'border-[#E2DECC]')
    : 'border-white/30'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${navBgClass}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* Logo */}
          <Link href={`/?lang=${lang}`} className="z-[70]" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-extrabold tracking-tighter transition-colors ${textColorClass}`}>
                Fun ArTrip <span className={`font-medium ${isBlog ? 'text-[#D87348]' : 'text-[#D4C376]'}`}>楓藝</span>
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              // 🌟 修正點 3：使用 href 作為絕對不重複的 key
              <Link key={link.href} href={link.href} className={`text-base font-bold tracking-wide transition-colors ${textColorClass} ${hoverColorClass}`}>
                {link.name}
              </Link>
            ))}

            {/* 語言切換 (桌面版) */}
            <div className="relative ml-4">
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className={`flex items-center gap-2 text-xs font-bold border px-3 py-1.5 rounded-full transition-all ${borderColorClass} ${textColorClass} ${isScrolled ? '' : 'hover:bg-white/10'}`}
              >
                {labels.langBtn} <span className="text-[10px] opacity-60">▼</span>
              </button>
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-[#EBE7D9] rounded-xl shadow-xl p-2 min-w-[140px] animate-in fade-in slide-in-from-top-2">
                  {languages.map((l) => (
                    <button key={l.code} onClick={() => handleLangChange(l.code)} className="w-full text-left px-4 py-2.5 text-xs text-[#5C6B47] hover:bg-[#FDFBF5] hover:text-[#2C3522] rounded-lg font-bold transition-colors">
                      {l.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 漢堡按鈕 (Mobile Only) */}
          <div className="flex items-center gap-4 md:hidden z-[70]">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`text-[10px] font-bold border px-2 py-1 rounded-md ${borderColorClass} ${textColorClass}`}
            >
              {labels.langBtn}
            </button>

            <button 
              className="p-2 outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className="w-6 relative h-5">
                <span className={`absolute left-0 block w-full h-0.5 transition-all duration-300 ${isScrolled || isMobileMenuOpen || isLegal ? (isBlog ? 'bg-[#F2E3C6]' : 'bg-[#2C3522]') : 'bg-white'} ${isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0'}`}></span>
                <span className={`absolute left-0 top-2 block w-full h-0.5 transition-all duration-300 ${isScrolled || isMobileMenuOpen || isLegal ? (isBlog ? 'bg-[#F2E3C6]' : 'bg-[#2C3522]') : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute left-0 block w-full h-0.5 transition-all duration-300 ${isScrolled || isMobileMenuOpen || isLegal ? (isBlog ? 'bg-[#F2E3C6]' : 'bg-[#2C3522]') : 'bg-white'} ${isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* 行動版半透明全螢幕選單 */}
      <div className={`fixed inset-0 z-[50] transition-all duration-500 ease-in-out ${
        isMobileMenuOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-[#FDFBF5]/90 backdrop-blur-2xl"></div>
        
        <div className="relative h-full flex flex-col justify-center items-center p-6">
          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link, index) => (
              // 🌟 修正點 3：手機版的迴圈也要改成 link.href
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ transitionDelay: `${index * 50}ms` }}
                className={`text-3xl font-extrabold text-[#2C3522] tracking-tighter hover:text-[#D4C376] transition-all transform ${
                  isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className={`mt-16 w-12 h-0.5 bg-[#D4C376] transition-all duration-1000 ${
            isMobileMenuOpen ? 'w-24 opacity-100' : 'w-0 opacity-0'
          }`}></div>
        </div>
      </div>

      {/* 手機版語言下拉選單 */}
      {isLangOpen && (
        <div className="fixed top-20 right-6 z-[80] bg-white rounded-2xl shadow-2xl p-4 border border-[#EBE7D9] md:hidden">
          <div className="flex flex-col gap-4">
            {languages.map((l) => (
              <button 
                key={l.code} 
                onClick={() => handleLangChange(l.code)}
                className="text-sm font-bold text-[#5C6B47] text-left px-2"
              >
                {l.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}