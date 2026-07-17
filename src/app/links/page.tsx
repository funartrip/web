'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { FaLine, FaWhatsapp, FaWeixin, FaInstagram, FaEnvelope, FaGlobe, FaCopy, FaCheck, FaHome } from 'react-icons/fa'

export default function LinktreePage() {
  const params = useParams()
  const lang = ((params?.lang as string) || 'zh_tw').toLowerCase().replace('-', '_')
  
  // 複製成功狀態提示 State
  const [emailCopied, setEmailCopied] = useState(false)
  const [wechatCopied, setWechatCopied] = useState(false)

  // =========================================================================
  // ⚙️ 核心聯絡資訊設定區
  // =========================================================================
  const emailAddress = "contact@funartrip.com"
  const wechatId = "funartrip"           
  const lineUrl = "https://line.me/ti/p/9WZq8VqBPR" 
  const whatsappNumber = "33718520491" 

  // 一鍵「純複製」信箱函數
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(emailAddress).then(() => {
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    })
  }

  // 一鍵複製微信 ID 函數
  const handleCopyWechat = (e: React.MouseEvent) => {
    e.preventDefault()
    navigator.clipboard.writeText(wechatId).then(() => {
      setWechatCopied(true)
      setTimeout(() => setWechatCopied(false), 2500)
    })
  }

  // 📱 頂部 3 大核心直達通道
  const crystalLinks = [
    {
      label: '我的官方網站 ╳ Site Officiel',
      url: `/${lang}`,
      icon: <FaGlobe className="text-xl text-[#EAA624]" />
    },
    {
      label: '官方 LINE 帳號連結',
      url: lineUrl,
      icon: <FaLine className="text-2xl text-[#06C755]" />
    },
    {
      label: 'WhatsApp 即時諮詢',
      url: `https://wa.me/${whatsappNumber}`,
      icon: <FaWhatsapp className="text-2xl text-[#25D366]" />
    }
  ]

  return (
    <main className="relative min-h-screen text-[#2C3522] font-sans overflow-x-hidden flex flex-col items-center justify-start px-4 py-12 selection:bg-[#EAA624]/20">
      
      {/* 🔮 黑魔法網頁防線：強行隱藏全站通用 Navbar 與 全站 Footer */}
      <style>{`
        nav.fixed, footer { display: none !important; }
      `}</style>

      {/* 🌿 背景圖層 */}
      <div className="fixed inset-0 -z-20 w-full h-full">
        <Image src="/bg-link.jpeg" alt="Background" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#FDFBF5]/60" /> 
      </div>

      {/* 🌿 頂部行動專屬首頁欄 */}
      <div className="w-full max-w-md flex flex-row items-center justify-between mb-10 pb-4 border-b border-[#2C3522]/10">
        <div className="flex flex-row items-center gap-3 text-left">
          <div className="relative w-12 h-14 shrink-0">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-lg font-serif font-black tracking-tight text-[#223843] leading-none">
              Fun ArTrip <span className="font-sans font-medium text-[#EAA624]">楓藝</span>
            </span>
            <span className="text-[10px] font-sans font-normal text-[#5C6B47] tracking-wider mt-1 leading-none">
              Studio de Visites Guidées • Art & Culture
            </span>
          </div>
        </div>

        {/* 右側：小房子回首頁 */}
        <Link 
          href={`/${lang}`} 
          className="flex flex-col items-center gap-0.5 text-[#223843] hover:text-[#8C3B3B] active:scale-90 transition-all shrink-0 group px-2 py-1"
          title="返回官網首頁"
        >
          <FaHome className="text-xl group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-sans font-bold tracking-wider opacity-85">回首頁</span>
        </Link>
      </div>

      {/* 🌿 個人形象與雙語職稱金字塔區 */}
      <div className="w-full max-w-md flex flex-col items-center text-center">
        
        {/* 大頭照 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, type: 'spring' }}
          className="relative w-28 h-28 rounded-full overflow-hidden shadow-[0_8px_20px_rgba(44,53,34,0.1)] mb-6 shrink-0"
        >
          <Image src="/profile.png" alt="李楓梵 Lee, Feng-Fang" fill className="object-cover" priority />
        </motion.div>

        {/* 姓名與官方持證雙語職稱 */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[#223843] mb-3"
        >
          李楓梵 <span className="text-xl font-bold font-sans text-[#2C3522]/80 ml-1">Lee, Feng-Fang E.I.</span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-col gap-1 text-sm font-sans font-bold text-[#8C3B3B] tracking-wide mb-10 text-center"
        >
          <span>法國官方持證導覽解說員</span>
          <span className="text-xs font-serif font-medium text-[#5C6B47] italic">Guide-Conférencière Agréée</span>
        </motion.div>

        {/* 📱 「黃金字體層級」水晶玻璃傳送門按鈕清單 */}
        <div className="w-full space-y-4 px-1 flex-1">
          
          {/* 1. 官網、LINE、WhatsApp 水晶按鈕 */}
          {crystalLinks.map((link, idx) => (
            <motion.a
              key={idx} href={link.url} target={link.url.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + idx * 0.05 }}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.35)' }} whileTap={{ scale: 0.98 }}
              className="w-full py-5 px-6 rounded-2xl font-sans font-black text-base md:text-lg tracking-wider flex flex-row items-center justify-between bg-white/20 text-[#223843] border border-white/40 shadow-[0_4px_24px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl transition-all duration-300 transform"
            >
              <div className="flex items-center gap-4 text-left">
                {link.icon}
                <span>{link.label}</span>
              </div>
              <span className="text-sm opacity-40 font-mono text-[#223843]">❯</span>
            </motion.a>
          ))}

          {/* 2. 微信複製大按鈕 (官方綠圖標) */}
          <motion.button
            onClick={handleCopyWechat}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + crystalLinks.length * 0.05 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.35)' }} whileTap={{ scale: 0.98 }}
            className="w-full py-5 px-6 rounded-2xl font-sans font-black text-base md:text-lg tracking-wider flex flex-row items-center justify-between bg-white/20 text-[#223843] border border-white/40 shadow-[0_4px_24px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl transition-all duration-300 cursor-pointer text-left"
          >
            <div className="flex items-center gap-4 text-left">
              <FaWeixin className="text-2xl text-[#07C160]" />
              <div className="flex flex-col">
                <span>加我的 WeChat 微信</span>
                <span className="text-sm text-[#2C3522] font-semibold mt-1">
                  {wechatCopied ? "✓ 微訊號 ID 已成功複製！" : `帳號：${wechatId} (點擊自動複製)`}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center shrink-0 w-6 h-6 ml-2 text-[#223843]">
              <AnimatePresence mode="wait">
                {wechatCopied ? (
                  <motion.div key="w-check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <FaCheck className="text-base text-green-600" />
                  </motion.div>
                ) : (
                  <motion.div key="w-copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <FaCopy className="text-base opacity-40 hover:opacity-80" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {/* 3. Instagram ╳ 影像生活水晶大按鈕 (秋楓紅圖標) */}
          <motion.a
            href="https://www.instagram.com/funartrip/" target="_blank" rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.35)' }} whileTap={{ scale: 0.98 }}
            className="w-full py-5 px-6 rounded-2xl font-sans font-black text-base md:text-lg tracking-wider flex flex-row items-center justify-between bg-white/20 text-[#223843] border border-white/40 shadow-[0_4px_24px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 text-left">
              <FaInstagram className="text-2xl text-[#8C3B3B]" />
              <span>Instagram ╳ 影像生活</span>
            </div>
            <span className="text-sm opacity-40 font-mono text-[#223843]">❯</span>
          </motion.a>

          {/* 4. 智慧型聯絡信箱水晶大按鈕（🌟 完美修正：左括號精準強制換行） */}
          <motion.button
            onClick={handleCopyEmail}
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.35)' }} whileTap={{ scale: 0.98 }}
            className="w-full py-5 px-6 rounded-2xl font-sans font-black text-base md:text-lg tracking-wider flex flex-row items-center justify-between bg-white/20 text-[#223843] border border-white/40 shadow-[0_4px_24px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4 text-left">
              <FaCopy className="text-2xl text-[#8C3B3B]" /> 
              <div className="flex flex-col text-left">
                <span className="text-[#223843]">複製電子信箱 ╳ Copy Email</span>
                <span className="text-sm text-[#2C3522] font-semibold mt-1 leading-normal">
                  {emailCopied ? (
                    "✓ 信箱已成功複製！ ╳ Copied successfully!"
                  ) : (
                    // 🌟 核心修正：利用 JSX Fragment 強迫在括號位置乾淨換行
                    <>
                      {emailAddress}
                    
                    
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center shrink-0 w-6 h-6 ml-2 text-[#223843]">
              <AnimatePresence mode="wait">
                {emailCopied ? (
                  <motion.div key="e-check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-green-600">
                    <FaCheck className="text-base" />
                  </motion.div>
                ) : (
                  <motion.div key="e-copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <FaCopy className="text-base opacity-40 hover:opacity-80" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {/* 5. 網頁直接寫信直達按鈕（🌟 完美修正：微調縮小字級、加強深色對比度、強制不換行） */}
          <motion.a
            href="/en/contact" 
            target="_blank" 
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.35)' }} whileTap={{ scale: 0.98 }}
            className="w-full py-5 px-6 rounded-2xl font-sans font-black text-base md:text-lg tracking-wider flex flex-row items-center justify-between bg-white/20 text-[#223843] border border-white/40 shadow-[0_4px_24px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl transition-all duration-300 transform"
          >
            <div className="flex items-center gap-4 text-left">
              <FaEnvelope className="text-2xl text-[#8C3B3B]" /> 
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-[#223843]">網頁直接聯絡 ╳ Contact Me Online</span>
                {/* 🌟 核心修正：改為 text-xs（縮小字級）、text-[#2C3522]（顏色加深）、whitespace-nowrap（絕不折行） */}
                <span className="text-xs text-[#2C3522] font-semibold mt-1 whitespace-nowrap tracking-tight">
                  填寫預約表格直接發信 ╳ Go to reservation form
                </span>
              </div>
            </div>
            <span className="text-sm opacity-40 font-mono text-[#223843]">❯</span>
          </motion.a>

        </div>

        {/* 🌿 6. 全新改進：高訂版水晶地錨頁尾（讓網頁滑到底部時充滿高雅的設計儀式感） */}
        <div className="w-full max-w-md mt-16 pt-8 border-t border-[#2C3522]/10 flex flex-col items-center gap-3.5 text-center">
          <div className="text-[10px] font-bold tracking-[0.4em] uppercase text-[#8C9A76]">
            Art ╳ Culture ╳ Tour ╳ Life
          </div>
          <p className="text-[9px] font-semibold tracking-widest text-[#2C3522] opacity-50 uppercase font-sans">
            © 2026 Fun ArTrip 楓藝. All rights reserved.
          </p>
        </div>

      </div>
    </main>
  )
}