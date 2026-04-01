'use client'

import { client, urlFor } from '@/sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function AboutContent() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') || 'zh_tw').toLowerCase().replace('-', '_')

  const [data, setData] = useState<any>(null)
  
  useEffect(() => {
    client.fetch(`*[_type == "aboutPage"][0]`).then(setData)
  }, [])

  if (!data) return <div className="h-screen flex items-center justify-center bg-[#EBE8E0] text-[#4C4E36] tracking-widest font-serif uppercase text-xs">Loading Narrative...</div>

  const dict: any = {
    zh_tw: { contact: '與我聊聊您的旅程', expTitle: '經歷 ╳ 學歷', guide: '法國官方持證導覽解說員' },
    zh_cn: { contact: '与我聊聊您的旅程', expTitle: '经历 ╳ 学历', guide: '法国官方持证导览解说员' },
    fr: { contact: 'Discutons de votre voyage', expTitle: 'Parcours & Formation', guide: 'Guide-conférencier agréé' },
    en: { contact: 'Let\'s talk about your trip', expTitle: 'Experience & Education', guide: 'State-Licensed Guide' },
  }
  const t = dict[lang] || dict.zh_tw;

  // 🌟 核心動畫：捲動到位置時「由小變大」並「淡入」
  const scrollScaleReveal = {
    initial: { opacity: 0, scale: 0.85, y: 30 },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    viewport: { once: false, amount: 0.2 }, // ✅ 每次滑到都會有反應
    transition: { 
      type: "spring"as const, 
      stiffness: 50, 
      damping: 20,
      duration: 1.2 
    }
  }as const;

  // 🌟 故事區組件設定
  const storyComponents = {
    block: {
      normal: ({ children }: any) => (
        <motion.div
          {...scrollScaleReveal}
          className="mb-12 leading-relaxed text-base md:text-lg font-serif text-[#3D3B38]"
        >
          {children}
        </motion.div>
      ),
      blockquote: ({ children }: any) => (
        <motion.blockquote
          {...scrollScaleReveal}
          className="my-32 text-2xl md:text-4xl font-bold italic text-[#4C4E36] text-center px-6 leading-snug"
        >
          “ {children} ”
        </motion.blockquote>
      ),
    },
  }

  // 🌟 學經歷區組件 (無框版)
  const expComponents = {
    block: {
      blockquote: ({ children }: any) => (
        <motion.blockquote
          {...scrollScaleReveal}
          className="my-32 text-xl md:text-2xl font-bold italic text-[#4C4E36] text-center px-6 leading-normal"
        >
          “ {children} ”
        </motion.blockquote>
      ),
      h3: ({ children }: any) => (
        <motion.h3 
          {...scrollScaleReveal}
          className="text-xl md:text-2xl font-bold text-[#3D3B38] mt-20 mb-8 tracking-widest uppercase leading-normal"
        >
          {children}
        </motion.h3>
      ),
      h4: ({ children }: any) => (
        <motion.h4 {...scrollScaleReveal} className="text-base font-bold text-[#3D3B38] mt-10 mb-3 tracking-wide leading-normal">
          {children}
        </motion.h4>
      ),
      normal: ({ children }: any) => (
        <motion.p {...scrollScaleReveal} className="text-[#5C6B47]  text-base md:text-base mb-4 leading-normal">
          {children}
        </motion.p>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <motion.li 
          {...scrollScaleReveal}
          className="relative pl-6 text-[#3D3B38] text-base md:text-base mb-6 list-none leading-normal"
        >
          <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-[#8C3B3B]"></span>
          {children}
        </motion.li>
      )
    }
  }

  // 🌟 處理資料邏輯：分離純文字與語錄
  const allBio = data.bio?.[lang] || [];
  const proseBlocks = allBio.filter((b: any) => b.style !== 'blockquote');
  const quoteBlocks = allBio.filter((b: any) => b.style === 'blockquote');

  return (
    <main className="min-h-screen bg-[#EBE8E0] overflow-x-hidden selection:bg-[#4C4E36]/20">
      
      {/* 🌟 1. 頁首區 */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {data.profileImage && (
            <Image src={urlFor(data.profileImage).url()} fill alt="Feng-Fang" className="object-cover brightness-[0.85]" priority />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4C4E36]/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#EBE8E0]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.5 }}>
            
            {/* 🌟 關鍵修正：加上這個帶有 flex 的 div 容器 */}
            <div className="flex items-center gap-4 mb-6">
              {/* 1. 金色的線 */}
              <div className="w-10 h-[2px] bg-[#D4C376] shrink-0" /> 
              
              {/* 2. 文字 (注意：我拿掉了原有的 mb-6 和 block，改由外層容器統一控制) */}
              <span className="text-white/80 text-[18px] font-bold uppercase tracking-[0.5em] whitespace-nowrap">
                {t.guide}
              </span>
            </div>

            {/* 下方的標題與副標題保持不變 */}
            <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter mb-8 leading-normal font-serif">
              {data.title?.[lang]}
            </h1>
            <p className="text-white/90 text-lg md:text-2xl italic max-w-sm">
              {data.subtitle?.[lang]}
            </p>

          </motion.div>
        </div>
      </section>

      {/* 🌟 2. 故事與圖片穿插區 */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        
        {/* 段落 1: 左圖右文 (抓取純文字的前 4 段) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mb-40">
          <motion.div 
            {...scrollScaleReveal}
            className="lg:col-span-5 relative aspect-[3/4] rounded-[40px] overflow-hidden bg-[#DCD9CE] shadow-2xl border border-white/20"
          >
            <div className="absolute inset-0 flex items-center justify-center text-[#4C4E36] text-xs italic p-12 text-center opacity-50">
             <Image 
              src="/profit 1.jpg" 
              fill 
              alt="Cultural Detail" 
              className="brightness-100"
              sizes="(max-width: 1024px) 100vw, 40vw"
              unoptimized={true}
            />
            </div>
          </motion.div>
          <div className="lg:col-span-7">
            <PortableText value={proseBlocks.slice(0, 2)} components={storyComponents} />
            <div className="flex items-center justify-center gap-4 my-20">
              <div className="w-10 h-[1px] bg-[#4C4E36]/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#8C3B3B]" />
              <div className="w-10 h-[1px] bg-[#4C4E36]/20" />
            </div>
            <PortableText value={proseBlocks.slice(2, 4)} components={storyComponents} />
            <div className="flex items-center justify-center gap-4 my-20">
              <div className="w-10 h-[1px] bg-[#4C4E36]/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#8C3B3B]" />
              <div className="w-10 h-[1px] bg-[#4C4E36]/20" />
            </div>
          </div>
        </div>

        {/* 🌟 滿版大引言：獨立出現 */}
        {quoteBlocks.length > 0 && (
          <div className="mb-40">
             <PortableText value={[quoteBlocks[0]]} components={storyComponents} />
          </div>
        )}

        {/* 段落 2: 左文右圖 (抓取第 4 段之後的所有純文字) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center mb-40">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <PortableText value={proseBlocks.slice(4,7)} components={storyComponents} />
            <div className="flex items-center justify-center gap-4 my-20">
              <div className="w-10 h-[1px] bg-[#4C4E36]/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#8C3B3B]" />
              <div className="w-10 h-[1px] bg-[#4C4E36]/20" />
            </div>
            <PortableText value={proseBlocks.slice(7)} components={storyComponents} />
            <div className="flex items-center justify-center gap-4 my-20">
              <div className="w-10 h-[1px] bg-[#4C4E36]/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#8C3B3B]" />
              <div className="w-10 h-[1px] bg-[#4C4E36]/20" />
            </div>
          </div>
          <motion.div 
            {...scrollScaleReveal}
            className="lg:col-span-5 relative aspect-[3/4] rounded-[40px] overflow-hidden bg-[#DCD9CE] shadow-2xl border border-white/20 order-1 lg:order-2"
          >
            <div className="absolute inset-0 flex items-center justify-center text-[#4C4E36] text-base italic p-12 text-center opacity-50">
              <Image 
              src="/profit 2.jpg" 
              fill 
              alt="Cultural Detail" 
              className="brightness-100"
              sizes="(max-width: 1024px) 100vw, 40vw"
              unoptimized={true}
            />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🌟 3. 經歷學歷區 (徹底無框化 + 捲動放大動畫) */}
      <section className="py-40 px-6 bg-white border-t border-[#D5D2C8]">
        <div className="max-w-3xl mx-auto">
          
          <motion.div {...scrollScaleReveal} className="text-center mb-32">
            <span className="text-[#8C3B3B] font-bold tracking-[0.6em] uppercase text-[18px] mb-4 block">Archive</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#3D3B38]">{t.expTitle}</h2>
            <div className="w-12 h-1 bg-[#8C3B3B] mx-auto mt-8" />
          </motion.div>

          <div className="prose-none">
            {data.experience?.[lang] ? (
              <PortableText value={data.experience[lang]} components={expComponents} />
            ) : (
              <p className="text-center text-[#8C9A76] text-base">Waiting for narrative...</p>
            )}
          </div>
          
          <div className="mt-40 text-center">
            <Link 
              href={`/contact?lang=${lang}`}
              className="group relative inline-block px-16 py-6 overflow-hidden rounded-full border border-[#3D3B38] text-[#3D3B38] transition-all duration-500"
            >
              <span className="relative z-10 font-bold tracking-widest text-base uppercase transition-colors group-hover:text-white">{t.contact}</span>
              <div className="absolute inset-0 z-0 bg-[#767B39] translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

export default function AboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EBE8E0]" />}>
      <AboutContent />
    </Suspense>
  )
}