// src/app/[lang]/links/page.tsx
'use client'

import { client, urlFor } from '@/sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'

// 撈取 Linktree 的專屬強大 GROQ 查詢
const query = `*[_type == "linktreePage"][0] {
  title,
  subtitle,
  profileImage,
  links[] {
    label,
    url,
    styleType
  }
}`

function LinktreeContent() {
  const params = useParams()
  const lang = ((params?.lang as string) || 'zh_tw').toLowerCase().replace('-', '_')
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    client.fetch(query).then((res) => {
      setData(res)
      setIsLoading(false)
    })
  }, [])

  const getLabel = (field: any, l: string) => {
    if (!field) return ''
    if (typeof field === 'string') return field
    const dashLang = l.replace('_', '-')
    return field[l] || field[dashLang] || field['zh_tw'] || Object.values(field).find(v => v) || ''
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#D87348] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // 如果後台還沒建立任何資料，給予高雅的提示
  if (!data) {
    return (
      <div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center text-[#2C3522] font-serif p-6 text-center">
        <p>請先前往 Sanity 後台建立「行動智慧連結頁 (Linktree)」的內容。建立後即可在此顯示！</p>
      </div>
    )
  }

  return (
    // 🌟 全站大底色：溫潤的奶油紙張白 (#FDFBF5)
    <main className="min-h-screen bg-[#FDFBF5] text-[#2C3522] font-sans px-4 py-16 flex flex-col items-center selection:bg-[#EAA624]/20">
      
      {/* 頂部精緻導回官網小鈕 */}
      <div className="w-full max-w-md flex justify-end mb-4">
        <Link href={`/${lang}`} className="text-xs font-bold tracking-widest text-[#5C6B47] hover:text-[#C85555] transition-colors uppercase border border-[#5C6B47]/20 px-3 py-1.5 rounded-full bg-white/50 backdrop-blur-sm shadow-sm">
          {lang.startsWith('zh') ? '🏠 返回官網' : '╳ Visit Website'}
        </Link>
      </div>

      {/* 📱 核心手機卡片容器（在桌機會自動內縮置中，在手機會完美滿版流暢呈現） */}
      <div className="w-full max-w-md flex flex-col items-center text-center">
        
        {/* 1. 大尺寸圓角品牌標誌 / 個人頭像 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="relative w-24 h-24 md:w-28 md:h-28 bg-white p-2 rounded-3xl shadow-md border border-slate-200/60 mb-6 shrink-0"
        >
          <Image 
            src={data.profileImage ? urlFor(data.profileImage).url() : '/logo.png'} 
            alt="Brand Avatar" 
            fill 
            className="object-contain p-1.5"
            priority
          />
        </motion.div>

        {/* 2. 主標題名稱 */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-serif font-black tracking-tight text-[#2C3522] mb-3"
        >
          {getLabel(data.title, lang) || 'Fun ArTrip 楓藝'}
        </motion.h1>

        {/* 3. 簡介小字 */}
        <motion.p 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-sm font-sans font-medium text-[#5C6B47] tracking-wide leading-relaxed max-w-sm mb-12 px-4 opacity-90"
        >
          {getLabel(data.subtitle, lang)}
        </motion.p>

        {/* 4. 📱 按鈕連結清單（支援後台跳色、滑鼠懸浮 3D 放大效果） */}
        <div className="w-full space-y-4 px-2">
          {(data.links || []).map((item: any, idx: number) => {
            
            // 🎨 樣式矩陣演算法：自動匹配後台選取的按鈕色彩調色盤
            let btnClass = ""
            if (item.styleType === 'orange') {
              btnClass = "bg-[#D87348] text-[#223843] border border-[#D87348] shadow-[0_5px_15px_rgba(216,115,72,0.2)]"
            } else if (item.styleType === 'terracotta') {
              btnClass = "bg-[#C85555] text-white border border-[#C85555] shadow-[0_5px_15px_rgba(200,85,85,0.2)]"
            } else if (item.styleType === 'outline-gold') {
              btnClass = "bg-white text-[#2C3522] border-2 border-[#EAA624] shadow-sm hover:bg-[#FDFBF5]"
            } else {
              // 預設經典墨綠 (green)
              btnClass = "bg-[#2C3522] text-[#FDFBF5] border border-[#2C3522] shadow-[0_5px_15px_rgba(44,53,34,0.15)]"
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.08, type: 'spring', stiffness: 60 }}
              >
                <a 
                  href={item.url}
                  target={item.url?.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className={`w-full py-4 px-6 rounded-2xl font-sans font-bold tracking-wider text-base flex items-center justify-center transition-all duration-300 transform active:scale-[0.97] hover:scale-[1.02] cursor-pointer text-center ${btnClass}`}
                >
                  {getLabel(item.label, lang)}
                </a>
              </motion.div>
            )
          })}
        </div>

        {/* 🌿 底部小法式優雅裝飾 */}
        <footer className="mt-20 text-[10px] font-bold tracking-[0.4em] uppercase text-[#8C9A76]">
          Art ╳ Culture ╳ Tour ╳ Life
        </footer>

      </div>
    </main>
  )
}

export default function LinktreePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF5]" />}>
      <LinktreeContent />
    </Suspense>
  )
}