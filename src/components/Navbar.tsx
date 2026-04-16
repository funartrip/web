'use client'
import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
// 🌟 1. 核心升級：移除 useSearchParams，改用 useParams, usePathname, useRouter
import { useParams, usePathname, useRouter } from 'next/navigation'

function NavbarContent() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)

  // 🌟 2. 核心升級：直接從動態路由抓取語言代碼
  const params = useParams()
  const pathname = usePathname()
  const router = useRouter()
  
  // 安全地抓取 lang，並確保預設值為 zh_tw
  const lang = (params?.lang as string) || 'zh_tw'
  
  const isBlog = pathname?.includes('/blogs')
  const isLegal = pathname?.includes('/legal')

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
    if (isMobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { window.removeEventListener('scroll', handleScroll); document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  // 🌟 3. 核心升級：內部連結全部改為 `/${lang}/路徑` 的結構
  const navLinks = [
    { name: labels.about, href: `/${lang}/about` },
    { name: labels.tours, href: `/${lang}/tours` },
    { name: labels.portfolios, href: `/${lang}/portfolios` },
    ...(lang === 'zh_tw' || lang === 'zh_cn' ? [{ name: labels.blogs, href: `/${lang}/blogs` }] : []),
    { name: labels.contact, href: `/${lang}/contact` },
  ]

  const languages = [
    { name: '繁體中文', code: 'zh_tw' },
    { name: '简体中文', code: 'zh_cn' },
    { name: 'Français', code: 'fr' },
    { name: 'English', code: 'en' },
  ]

  // 🌟 4. 核心升級：語言切換邏輯
  const handleLangChange = (newLang: string) => {
    if (!pathname) return
    // pathname 會長這樣：/fr/tours/lyon
    // 分割後會變成 ['', 'fr', 'tours', 'lyon']
    const segments = pathname.split('/')
    
    // 將第一個有意義的片段（也就是語言代碼）換成使用者選的新語言
    segments[1] = newLang 
    
    // 重新組合並導航 (例如變成 /en/tours/lyon)
    router.push(segments.join('/'))
  }

  const navBgClass = isScrolled || isMobileMenuOpen|| isLegal
    ? (isBlog ? 'bg-[#223843] border-b border-[#F2E3C6]/10 py-4 shadow-sm' : 'bg-[#FDFBF5]/80 backdrop-blur-lg border-b border-[#EBE7D9]/50 py-4 shadow-sm')
    : 'bg-transparent py-6'

  const textColorClass = isScrolled || isMobileMenuOpen|| isLegal
    ? (isBlog ? 'text-[#F2E3C6]' : 'text-[#2C3522]')
    : 'text-white'
    
  const hoverColorClass = isBlog ? 'hover:text-[#D87348]' : 'hover:text-[#D4C376]'
  const borderColorClass = isScrolled || isMobileMenuOpen|| isLegal
    ? (isBlog ? 'border-[#F2E3C6]/30' : 'border-[#E2DECC]') : 'border-white/30'

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${navBgClass}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          
          {/* 首頁連結也必須套用動態路徑 */}
          <Link href={`/${lang}`} className="z-[70]" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex flex-col">
              <span className={`text-xl md:text-2xl font-extrabold tracking-tighter transition-colors ${textColorClass}`}>
                Fun ArTrip <span className={`font-medium ${isBlog ? 'text-[#D87348]' : 'text-[#D4C376]'}`}>楓藝</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={`text-base font-bold tracking-wide transition-colors ${textColorClass} ${hoverColorClass}`}>
                {link.name}
              </Link>
            ))}

            <div className="relative ml-4">
              <button onClick={() => setIsLangOpen(!isLangOpen)} className={`flex items-center gap-2 text-xs font-bold border px-3 py-1.5 rounded-full transition-all ${borderColorClass} ${textColorClass} ${isScrolled ? '' : 'hover:bg-white/10'}`}>
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

          <div className="flex items-center gap-4 md:hidden z-[70]">
            <button onClick={() => setIsLangOpen(!isLangOpen)} className={`text-[10px] font-bold border px-2 py-1 rounded-md ${borderColorClass} ${textColorClass}`}>
              {labels.langBtn}
            </button>
            <button className="p-2 outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <div className="w-6 relative h-5">
                <span className={`absolute left-0 block w-full h-0.5 transition-all duration-300 ${isScrolled || isMobileMenuOpen || isLegal ? (isBlog ? 'bg-[#F2E3C6]' : 'bg-[#2C3522]') : 'bg-white'} ${isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0'}`}></span>
                <span className={`absolute left-0 top-2 block w-full h-0.5 transition-all duration-300 ${isScrolled || isMobileMenuOpen || isLegal ? (isBlog ? 'bg-[#F2E3C6]' : 'bg-[#2C3522]') : 'bg-white'} ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute left-0 block w-full h-0.5 transition-all duration-300 ${isScrolled || isMobileMenuOpen || isLegal ? (isBlog ? 'bg-[#F2E3C6]' : 'bg-[#2C3522]') : 'bg-white'} ${isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 z-[50] transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-[#FDFBF5]/90 backdrop-blur-2xl"></div>
        <div className="relative h-full flex flex-col justify-center items-center p-6">
          <div className="flex flex-col items-center gap-8">
            {navLinks.map((link, index) => (
              <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)} style={{ transitionDelay: `${index * 50}ms` }} className={`text-3xl font-extrabold text-[#2C3522] tracking-tighter hover:text-[#D4C376] transition-all transform ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                {link.name}
              </Link>
            ))}
          </div>
          <div className={`mt-16 w-12 h-0.5 bg-[#D4C376] transition-all duration-1000 ${isMobileMenuOpen ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}></div>
        </div>
      </div>

      {isLangOpen && (
        <div className="fixed top-20 right-6 z-[80] bg-white rounded-2xl shadow-2xl p-4 border border-[#EBE7D9] md:hidden">
          <div className="flex flex-col gap-4">
            {languages.map((l) => (
              <button key={l.code} onClick={() => handleLangChange(l.code)} className="text-sm font-bold text-[#5C6B47] text-left px-2">
                {l.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-20 bg-transparent w-full fixed top-0 z-50"></div>}>
      <NavbarContent />
    </Suspense>
  )
}