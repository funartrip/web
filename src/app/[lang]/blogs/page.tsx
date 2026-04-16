'use client'

import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
// 🌟 正確引入外部 Navbar 組件
import Navbar from '@/components/Navbar'

// 🌟 精準的 Query 語法
const query = `{
  "lobby": *[_type == "blogPostPage"][0],
  "posts": *[_type == "blogPost"] | order(_createdAt desc) {
    title,
    summary,
    "slug": slug.current,
    "thumbnail": thumbnail.asset->url,
    blogCategory[]->{ name, _id } 
  },
  "category": *[_type == "category" && type == "blogcategory"] {
    name,
    _id
  }
}`

const blogComponents = {
  block: {
    normal: ({ children }: any) => (
      // 🌟 保留你修改的顏色：#F7F8E8 和 font-serif
      <p className="text-[#F7F8E8] leading-relaxed mb-6 text-xl tracking-wide text-justify opacity-90 font-serif">
        {children}
      </p>
    ),
  },
}

function BlogContent() {
  const params = useParams()
  const lang = ((params?.lang as string) || 'zh_tw').toLowerCase().replace('-', '_')
  
  const [data, setData] = useState<{ lobby: any; posts: any[]; category: any[] } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    client.fetch(query).then(setData)
  }, [])

  const getLabel = (field: any, l: string) => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[l] || field['zh_tw'] || ''
  }

  // 🌟 保留你的多語系字典
  const t: any = {
    zh_tw: { allLogs: '全部紀錄', noRecords: '此分類目前沒有紀錄...' },
    zh_cn: { allLogs: '全部纪录', noRecords: '此分类目前没有纪录...' },
    fr: { allLogs: 'Tous les articles', noRecords: 'Aucun article trouvé dans cette catégorie...' },
    en: { allLogs: 'All Logs', noRecords: 'No records found in this category...' }
  }
  const dict = t[lang] || t.zh_tw

  // 載入中畫面
  if (!data) {
    return (
      <div className="min-h-screen bg-[#223843] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#D87348] border-t-transparent rounded-full" 
          />
          <p className="text-[#F2E3C6] font-mono tracking-[0.3em] text-sm uppercase">Loading Archive</p>
        </div>
      </div>
    )
  }

  // 防呆機制
  const safePosts = data.posts || []
  const safeCategory = data.category || []

  // 過濾邏輯
  const displayedPosts = selectedCategory === 'all' 
    ? safePosts 
    : safePosts.filter((post) => post.blogCategory?.some((cat: any) => cat._id === selectedCategory))

  return (
    <main className="min-h-screen bg-[#223843] text-[#F2E3C6] font-sans selection:bg-[#D87348] selection:text-[#223843]">
      
      {/* 🌟 使用外部引入的 Navbar，不要在這裡重寫 HTML */}
      <Navbar />

      {/* 🌿 Hero 區塊：大圖結合復古漸層與延遲動畫 */}
      <section className="relative w-full h-[75vh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image src="/blog-bg.JPG" alt="Blog Background" fill className="object-cover object-top brightness-[0.7]" priority />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#223843] via-[#223843]/60 to-transparent" />
        
        <div className="relative z-10 text-center px-6 mt-20">
          <div>
            <motion.span 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-[#D87348] font-mono tracking-[0.4em] uppercase text-xs font-bold block mb-6 bg-[#223843]/50 backdrop-blur-md py-2 px-6 rounded-full inline-block border border-[#D87348]/30 shadow-lg"
            >
              Journal // Exploration
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="text-5xl md:text-7xl font-serif font-bold text-[#F2E3C6] mb-6 tracking-wide drop-shadow-xl leading-normal"
            >
              {getLabel(data.lobby?.title, lang) || '旅行日誌'}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              // 🌟 保留你修改的顏色：#AADCF2
              className="text-[#AADCF2] text-xl font-serif italic max-w-2xl mx-auto tracking-wide"
            >
              {getLabel(data.lobby?.heroSubtitle, lang)}
            </motion.p>
          </div>
        </div>
      </section>

      {/* 🌿 互動區塊：引言與過濾器 */}
      <section className="relative bg-[#223843] px-6 pt-16 pb-8 ">
        <div className="max-w-5xl mx-auto">
          {data.lobby?.narrativeIntro && (
            <motion.div 
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1, ease: "easeOut" }}
              className="text-center mb-20 max-w-3xl mx-auto"
            >
              <PortableText value={getLabel(data.lobby.narrativeIntro, lang)} components={blogComponents} />
              
              {/* 🌿 復古菱形分割線 */}
              <motion.div 
                initial={{ opacity: 0, scaleX: 0.5 }} 
                whileInView={{ opacity: 1, scaleX: 1 }} 
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }} 
                className="flex justify-center items-center gap-4 mx-auto mt-12"
              >
                {/* 左側線條 */}
                <div className="w-16 md:w-24 h-[1px] bg-[#D87348]/60" />
                {/* 中間的橘色菱形 (正方形轉 45 度) */}
                <div className="w-2.5 h-2.5 bg-[#D87348] rotate-45 shadow-[0_0_8px_rgba(216,115,72,0.6)]" />
                {/* 右側線條 */}
                <div className="w-16 md:w-24 h-[1px] bg-[#D87348]/60" />
              </motion.div>
            </motion.div>
          )}

          <div className="flex flex-wrap justify-center gap-3 md:gap-5">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedCategory('all')}
              className={`px-8 py-3 rounded-full font-serif font-bold tracking-widest text-sm transition-all duration-300 border-2 ${
                selectedCategory === 'all'
                  ? 'bg-[#D87348] text-[#223843] border-[#D87348] shadow-[0_0_20px_rgba(216,115,72,0.3)]'
                  : 'bg-transparent text-[#F2E3C6] border-[#F2E3C6]/20 hover:border-[#D87348]'
              }`}
            >
              {dict.allLogs}
            </motion.button>
            
            {safeCategory.map((cat: any, index: number) => (
              <motion.button
                key={cat._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedCategory(cat._id)}
                className={`px-8 py-3 rounded-full font-serif font-bold tracking-widest text-sm transition-all duration-300 border-2 ${
                  selectedCategory === cat._id
                    ? 'bg-[#819A78] text-[#223843] border-[#819A78] shadow-[0_0_20px_rgba(129,154,120,0.3)]'
                    : 'bg-transparent text-[#F2E3C6] border-[#F2E3C6]/20 hover:border-[#819A78]'
                }`}
              >
                {getLabel(cat.name, lang)}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 🌿 卡片區塊：3D 懸浮天空藍卡片 */}
      <section className="bg-[#223843] px-6 pb-32 min-h-[50vh]">
        <div className="max-w-7xl mx-auto pt-16">
          {displayedPosts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-[#819A78] font-mono tracking-widest">
              {dict.noRecords}
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {displayedPosts.map((post) => (
                  <motion.div
                    key={post.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.4 }}
                    // 🌟 保留你修改的 3D 立體效果
                    whileHover={{ y: -12 }} 
                    className="group relative flex flex-col bg-[#AADCF2] rounded-2xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.3),_inset_0_4px_6px_rgba(255,255,255,0.7)] hover:shadow-[0_25px_40px_rgba(216,115,72,0.25),_inset_0_4px_10px_rgba(255,255,255,0.9)] transition-shadow duration-300"
                  >
                    <Link href={`/${lang}/blogs/${post.slug}`} className="flex flex-col h-full">
                      {/* 縮圖 */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image src={post.thumbnail || '/placeholder.jpg'} alt="cover" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-[#223843]/10 group-hover:bg-transparent transition-colors duration-500" />
                      </div>

                      {/* 文字區塊 */}
                      <div className="flex flex-col flex-1 p-8">
                        <div className="flex flex-wrap gap-2 mb-5">
                          {(post.blogCategory || []).map((cat: any, idx: number) => (
                            <span 
                              key={idx} 
                              className="px-3 py-1 bg-[#223843] text-[#AADCF2] rounded-full text-[10px] font-mono font-bold tracking-[0.2em] uppercase shadow-sm"
                            >
                              {getLabel(cat.name, lang)}
                            </span>
                          ))}
                        </div>

                        <h2 className="text-2xl font-serif font-bold text-[#223843] mb-4 group-hover:text-[#D87348] transition-colors line-clamp-2 leading-snug">
                          {getLabel(post.title, lang)}
                        </h2>

                        <p className="text-[#223843]/70 text-sm leading-relaxed line-clamp-3 font-medium">
                          {getLabel(post.summary, lang)}
                        </p>

                        <div className="mt-auto pt-8 flex items-center justify-between">
                          <div className="h-[2px] w-12 bg-[#223843]/20 group-hover:w-20 group-hover:bg-[#D87348] transition-all duration-500" />
                          <span className="text-[#D87348] font-mono text-xs tracking-widest font-bold group-hover:-translate-x-2 transition-transform">
                            READ MORE
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
      
      {/* 🌿 結語區塊 */}
      {data.lobby?.closingStatement && (
        <section className="bg-[#223843] py-24 text-center px-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-2xl font-serif text-[#819A78] italic opacity-80 flex items-center justify-center gap-6"
          >
            <span className="w-8 h-[1px] bg-[#D87348]/50 block" />
            {getLabel(data.lobby.closingStatement, lang)}
            <span className="w-8 h-[1px] bg-[#D87348]/50 block" />
          </motion.h2> 
        </section>
      )}
    </main>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#223843]" />}>
      <BlogContent />
    </Suspense>
  )
}