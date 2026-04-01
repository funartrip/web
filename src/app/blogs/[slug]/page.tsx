'use client'

import { client } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion' // 🌟 確保引入 AnimatePresence
import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'

// 獲取單篇文章與分類的 GROQ Query
const query = `*[_type == "blogPost" && slug.current == $slug][0] {
  title,
  summary,
  "thumbnail": thumbnail.asset->url,
  blogCategory[]->{ name, _id },
  postContent,
  "images": images[].asset->url,
  _createdAt
}`

// 富文本樣式 (保留你修改的顏色：#F7F8E8 和 font-serif)
// 🌟 完整的富文本樣式 (已加回活潑的清單樣式！)
// 🌟 實體紙張版專用：深色墨水富文本樣式
const portableTextComponents = {
  block: {
    normal: ({ children }: any) => (
      // 🌟 內文改為深復古藍 (#223843)，拿掉 text-justify 讓左邊對齊更順暢
      <p className="text-[#223843] leading-relaxed mb-6 text-xl tracking-wide opacity-90 font-serif">
        {children}
      </p>
    ),
    h2: ({ children }: any) => (
      // 🌟 大標題改為深藍色，配上復古橙裝飾線
      <h2 className="text-3xl font-bold text-[#223843] mt-12 mb-6 font-serif border-l-4 border-[#D87348] pl-4">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      // 🌟 小標題改為深草綠色
      <h3 className="text-2xl font-bold text-[#2C3522] mt-8 mb-4 font-serif">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      // 🌟 引用區塊：保留紙張上的微光感，字體改為深色
      <blockquote className="bg-[#223843]/5 border-l-4 border-[#819A78] p-6 my-8 italic text-[#223843]/80 font-serif text-xl rounded-r-lg">
        "{children}"
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      // 🌟 清單文字改為深色，點點保留復古橙色
      <ul className="list-disc ml-8 mb-8 space-y-3 text-xl font-serif text-[#223843] opacity-90 marker:text-[#D87348]">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      // 🌟 數字清單改為深色，數字加粗
      <ol className="list-decimal ml-8 mb-8 space-y-3 text-xl font-serif text-[#223843] opacity-90 marker:text-[#223843] marker:font-bold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="pl-2 leading-relaxed tracking-wide">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="pl-2 leading-relaxed tracking-wide">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-[#D87348]">{children}</strong>,
    link: ({ value, children }: any) => (
      // 🌟 連結改為復古橙色帶底線，Hover 時加深，適合淺色紙張
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-[#D87348] font-bold border-b-2 border-[#D87348]/30 hover:border-[#D87348] transition-colors pb-1">
        {children}
      </a>
    ),
  },
}

export default function BlogPostPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug
  const lang = (searchParams.get('lang') || 'zh_tw').toLowerCase().replace('-', '_')

  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // 🌟 新增：控制 Lightbox 預覽的狀態
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null)

  // 多語系字典 (內頁專用)
  const t: any = {
    zh_tw: { back: '← 返回旅行檔案室', gallery: '影像紀錄', date: '發布於' },
    zh_cn: { back: '← 返回旅行档案室', gallery: '影像纪录', date: '发布于' },
    fr: { back: '← Retour aux archives', gallery: 'Galerie', date: 'Publié le' },
    en: { back: '← Back to Archives', gallery: 'Gallery', date: 'Published on' }
  }
  const dict = t[lang] || t.zh_tw

  useEffect(() => {
    if (slug) {
      client.fetch(query, { slug }).then((data) => {
        setPost(data)
        setIsLoading(false)
      })
    }
  }, [slug])

  const getLabel = (field: any, l: string) => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[l] || field['zh_tw'] || Object.values(field).find(v => v) || ''
  }
  // 如果找不到該語言，就自動退回顯示 zh_tw (繁體中文)


  // 格式化日期
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(lang === 'zh_tw' ? 'zh-TW' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#223843] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-12 h-12 border-4 border-[#D87348] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#223843] flex flex-col items-center justify-center text-[#F2E3C6]">
        <h1 className="text-2xl font-serif mb-4">找不到這份檔案...</h1>
        <Link href={`/blogs?lang=${lang}`} className="text-[#D87348] hover:underline">{dict.back}</Link>
      </div>
    )
  }
  
  return (
    <main className="min-h-screen bg-[#223843] font-sans selection:bg-[#D87348] selection:text-[#F2E3C6] pb-32">
      <Navbar lang={lang} />

      {/* 🌿 頂部封面區 (Hero) */}
      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image 
          src={post.thumbnail || '/blog-bg.JPG'} 
          alt="Post Cover" 
          fill 
          className="object-cover object-center brightness-[0.75]" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#223843] via-[#223843]/40 to-transparent" />
      </section>

      {/* 🌿 實體紙張閱讀區塊 */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <motion.article 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          // 實體紙張感
          className="bg-[#F2E3C6] rounded-t-3xl rounded-b-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-8 md:p-16"
        >
          {/* 標題與標籤資訊區 */}
          <header className="text-center mb-12">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {post.blogCategory?.map((cat: any, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-[#223843] text-[#AADCF2] rounded-full text-[10px] font-mono font-bold tracking-[0.2em] uppercase shadow-sm">
                  {getLabel(cat.name, lang)}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#223843] leading-normal mb-6">
              {getLabel(post.title, lang)}
            </h1>

            <p className="text-[#819A78] font-mono text-sm tracking-widest font-bold">
              {dict.date} // {formatDate(post._createdAt)}
            </p>

            {/* 復古菱形分割線 (深色版) */}
            <div className="flex justify-center items-center gap-4 mx-auto mt-12 mb-12">
              <div className="w-16 md:w-24 h-[1px] bg-[#223843]/20" />
              <div className="w-2 h-2 bg-[#D87348] rotate-45" />
              <div className="w-16 md:w-24 h-[1px] bg-[#223843]/20" />
            </div>
          </header>

          {/* 富文本內文區 */}
          <div className="prose-lg max-w-none">
            {post.postContent ? (
              <PortableText value={getLabel(post.postContent, lang)} components={portableTextComponents} />
            ) : (
              <p className="text-center text-[#223843]/50 italic">內容正在撰寫中...</p>
            )}
          </div>
        </motion.article>
      </section>

      {/* 🌿 底部影像畫廊 (🌟 修改：活潑排版 + 自動編號 + 點擊預覽) */}
      {post.images && post.images.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 mt-32">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-3xl font-serif font-bold text-[#F2E3C6]">{dict.gallery}</h3>
            <div className="flex-1 h-[1px] bg-[#F2E3C6]/20" />
          </div>

          {/* 🌟 活潑排版：使用 CSS Columns 瀑布流，並調整 space-y */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8 mt-16">
            {post.images.map((imgUrl: string, idx: number) => {
              // 🌟 自動生成照片編號 (img.01, img.02...)
              const displayNumber = String(idx + 1).padStart(2, '0');
              
              // 🌟 活潑排版：根據 Index 分配不同的長寬比，造成參差感
              const aspectRatioClass = 
                idx % 5 === 0 ? 'aspect-[3/4]' : // 直式
                idx % 3 === 0 ? 'aspect-[16/9]' : // 橫式
                'aspect-square'; // 正方形

              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}
                  // 🌟 3D 懸浮效果 + 🌟 點擊開啟預覽 (`cursor-zoom-in`)
                  whileHover={{ y: -10 }}
                  className={`relative group break-inside-avoid ${aspectRatioClass} bg-[#F2E3C6] p-3 rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.3)] cursor-pointer overflow-hidden transition-all duration-300`}
                  onClick={() => setSelectedImgIndex(idx)} // 🌟 點擊設定 Index，開啟 Lightbox
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image src={imgUrl} alt={`Gallery Image ${idx + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    
                    {/* 🌟 自動寫上照片編號 (img.01) */}
                    <div className="absolute top-3 left-3 z-10 bg-[#223843]/70 backdrop-blur-sm px-3 py-1 rounded-full border border-[#AADCF2]/30">
                      <span className="text-[#AADCF2] font-mono text-[10px] tracking-widest uppercase font-bold">
                        img.{displayNumber}
                      </span>
                    </div>
                    
                    {/* Hover 時的遮罩 */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* 🌿 返回按鈕 */}
      <div className="max-w-4xl mx-auto px-6 mt-24 flex justify-center">
        <Link href={`/blogs?lang=${lang}`}>
          <motion.button 
            whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-[#AADCF2] text-[#223843] rounded-full font-serif font-bold tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.2),_inset_0_2px_5px_rgba(255,255,255,0.8)] hover:shadow-[0_15px_25px_rgba(216,115,72,0.3)] transition-all flex items-center gap-3"
          >
            {dict.back}
          </motion.button>
        </Link>
      </div>

      {/* 🌟 影像預覽畫面 (完全整合你提供的編碼) */}
      <AnimatePresence>
        {/* 1. 確保 index 不是 null 且資料存在 (🌟 修改資料來源為 post.images) */}
        {selectedImgIndex !== null && post.images && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            // 🌟 點擊背景關閉
            onClick={() => setSelectedImgIndex(null)}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col items-center overflow-hidden h-screen w-screen cursor-default"
          >
            {/* 頂部工具列 (關閉按鈕) */}
            <div className="absolute top-8 right-8 z-[110]">
              <button 
                onClick={() => setSelectedImgIndex(null)}
                className="text-white/40 hover:text-white text-5xl font-light transition-all hover:rotate-90 p-4 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* 中央主圖區域 */}
            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center px-4 md:px-20 mt-16">
              
              {/* 左切換按鈕 */}
              <button 
                className="hidden md:block absolute left-10 z-[105] text-white/20 hover:text-white text-6xl transition-all p-4 cursor-pointer"
                onClick={(e) => { 
                  e.stopPropagation(); // 🌟 防止觸發背景關閉
                  // 🌟 資料來源修改為 post.images
                  setSelectedImgIndex((selectedImgIndex - 1 + post.images.length) % post.images.length); 
                }}
              >
                ‹
              </button>

              <motion.div 
                key={selectedImgIndex}
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-full flex items-center justify-center"
                // 🌟 點擊圖片本身也關閉
                onClick={() => setSelectedImgIndex(null)}
              >
                {/* 🌟 資料來源修改為 post.images[selectedImgIndex] */}
                <Image 
                  src={post.images[selectedImgIndex]} 
                  alt="Gallery Cinema" 
                  fill
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" 
                />
              </motion.div>

              {/* 右切換按鈕 */}
              <button 
                className="hidden md:block absolute right-10 z-[105] text-white/20 hover:text-white text-6xl transition-all p-4 cursor-pointer"
                onClick={(e) => { 
                  e.stopPropagation(); // 🌟 防止觸發背景關閉
                  // 🌟 資料來源修改為 post.images
                  setSelectedImgIndex((selectedImgIndex + 1) % post.images.length); 
                }}
              >
                ›
              </button>
            </div>

            {/* 底部底片縮圖列 (核心修正：統一變數名與排版) */}
            <div className="w-full max-w-6xl px-6 pb-12 flex-shrink-0 z-[110]" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-center items-center gap-4 overflow-x-auto no-scrollbar py-2 h-20 md:h-24">
                {/* 🌟 資料來源修改為 post.images */}
                {post.images.map((url: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImgIndex(i)} // 🌟 修正點：統一用 setSelectedImgIndex
                    // 🌟 使用金色 (#D4C376) 作為選中狀態
                    className={`relative h-full aspect-[4/3] flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 border-2 cursor-pointer ${
                      i === selectedImgIndex // 🌟 修正點：統一用 selectedImgIndex
                      ? 'border-[#D4C376] scale-110 z-10 shadow-lg' 
                      : 'border-transparent opacity-30 hover:opacity-100'
                    }`}
                  >
                    <Image 
                      src={url} 
                      fill
                      className="object-cover bg-white/5" 
                      alt={`Thumbnail ${i}`}
                    />
                  </button>
                ))}
              </div>
              
              {/* 圖片計數器 */}
              <div className="text-center mt-6">
                <span className="text-white/20 text-[10px] tracking-[0.4em] uppercase font-mono">
                  {/* 🌟 資料來源修改為 post.images */}
                  {selectedImgIndex + 1} // {post.images.length}
                </span>
              </div>
            </div>

          </motion.div> 
        )}
      </AnimatePresence>
    </main>
  );
}