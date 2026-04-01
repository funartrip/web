'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function MentionsContent() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') || 'zh_tw').toLowerCase().replace('-', '_')
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // 🌟 抓取 Mentions 相關欄位
    client.fetch(`*[_type == "legalPage"][0]{
      "pageTitle": title,
      "subtitle": mentionsSubtitle,
      "content": mentionsContent,
      _updatedAt
    }`).then(setData)
  }, [])

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF5] font-serif text-xl text-[#2C3522]">Loading Mentions...</div>

  return (
    <main className="min-h-screen bg-[#FDFBF5] py-24 px-6 md:py-40">
      {/* 🌟 限制文章最大寬度並置中 */}
      <div className="max-w-3xl mx-auto">
        
        {/* ========================================= */}
        /* 1. 頁首區塊：返回按鈕與主標題 */
        {/* ========================================= */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-20 border-b border-[#2C3522]/10 pb-12">
          <Link href={`/?lang=${lang}`} className="text-[#8C3B3B] font-bold text-xs tracking-widest uppercase mb-8 inline-block hover:opacity-70 transition-opacity">
            ← Back
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C3522] mb-4">
            {data.pageTitle?.[lang] || "Mentions Légales"}
          </h1>
          <p className="text-[#6A784D] font-serif italic text-lg opacity-80">{data.subtitle?.[lang]}</p>
          <p className="text-[#8C9A76] text-[10px] uppercase tracking-widest mt-8">
            Updated: {new Date(data._updatedAt).toLocaleDateString()}
          </p>
        </motion.div>

        {/* ========================================= */}
        /* 2. 內文區塊：套用專屬的 article-content 魔法 */
        {/* ========================================= */}
        {/* 🌟 將 article-content 加在這裡！ */}
        <article className="article-content">
          
          {/* --- A. 這是你手動打在程式碼裡的條文 --- */}
          <h1>Politique de confidentialité</h1>
          
          <h2>1. Responsable de traitement</h2>
          <p>
            Le responsable de traitement est : Fun ArTrip 楓藝 — LEE Feng Fang. E.I. <br />
            Contact : <a href="mailto:funartrip@gmail.com">funartrip@gmail.com</a>
          </p>

          <h2>2. Données collectées</h2>
          <p>Lorsque vous utilisez le formulaire de contact, nous pouvons collecter :</p>
          <ul>
            <li>nom/prénom</li>
            <li>adresse e-mail</li>
            <li>contenu du message</li>
          </ul>

          {/* --- B. 這是從 Sanity 後台抓出來的條文 --- */}
          {/* 🌟 最棒的是，Sanity 產生的 h1, h2, ul 也會自動套用 article-content 的美麗樣式！ */}
          {data.content?.[lang] && <PortableText value={data.content[lang]} />}
          
        </article>
      </div>
    </main>
  )
}

export default function MentionsPage() { 
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF5]" />}>
      <MentionsContent />
    </Suspense>
  )
}