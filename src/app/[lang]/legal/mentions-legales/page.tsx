'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import BackButton from '@/components/BackButton'

function MentionsContent() {
  const params = useParams()
  const lang = ((params?.lang as string) || 'zh_tw').toLowerCase().replace('-', '_')
  const [data, setData] = useState<any>(null)
  const backLabel = lang === 'fr' ? 'Retour' : lang === 'en' ? 'Go Back' : '返回上一頁';

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
        
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-20 border-b border-[#2C3522]/10 pb-12">
         <BackButton label={backLabel} />
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2C3522] mb-4">
            {data.pageTitle?.[lang] || "Mentions Légales"}
          </h1>
          <p className="text-[#6A784D] font-serif italic text-lg opacity-80">{data.subtitle?.[lang]}</p>
          <p className="text-[#8C9A76] text-[10px] uppercase tracking-widest mt-8">
            Updated: {new Date(data._updatedAt).toLocaleDateString()}
          </p>
        </motion.div>

        
        <article className="article-content">
          
          

          
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