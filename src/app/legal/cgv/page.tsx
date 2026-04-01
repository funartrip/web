'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import Link from 'next/link'

function CGVContent() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') || 'zh_tw').toLowerCase().replace('-', '_')
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // 🌟 只抓取 CGV 相關欄位
    client.fetch(`*[_type == "legalPage"][0]{
      "pageTitle": cgvTitle,
      "subtitle": cgvSubtitle,
      "content": cgvContent,
      _updatedAt
    }`).then(setData)
  }, [])

  if (!data) return <div className="h-screen flex items-center justify-center bg-[#FDFBF5] font-cursive text-xl">Loading CGV...</div>

  return (
    <main className="min-h-screen bg-[#FDFBF5] py-24 px-6 md:py-40">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-20 border-b border-[#2C3522]/10 pb-12">
          <Link href={`/?lang=${lang}`} className="text-[#8C3B3B] font-bold text-xs tracking-widest uppercase mb-8 block">← Back</Link>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C3522] mb-4">
            {data.pageTitle?.[lang]}
          </h1>
          <p className="text-[#6A784D] font-serif italic text-lg opacity-80">{data.subtitle?.[lang]}</p>
          <p className="text-[#8C9A76] text-[10px] uppercase tracking-widest mt-8">Updated: {new Date(data._updatedAt).toLocaleDateString()}</p>
        </motion.div>

        <article className="prose max-w-none">
          {/* 🌟 渲染後台填寫的四語銷售條款 */}
          {data.content?.[lang] && <PortableText value={data.content[lang]} />}
        </article>
      </div>
    </main>
  )
}

export default function CGVPage() { return <Suspense><CGVContent /></Suspense> }