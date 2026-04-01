'use client'

import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import { notFound, useParams, useSearchParams } from 'next/navigation' // 🌟 加入 notFound
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, use } from 'react'
import { PortableText } from '@portabletext/react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

// 🌟 全域多語系文字字典
const localText: any = {
  dashboard: {
    duration: { zh_tw: '活動時長', zh_cn: '活动时长', en: 'Duration', fr: 'Durée' },
    type: { zh_tw: '專案類型', zh_cn: '项目类型', en: 'Project Type', fr: 'Type de projet' },
    audience: { zh_tw: '目標受眾', zh_cn: '目标受众', en: 'Target Audience', fr: 'Public cible' },
    location: { zh_tw: '合作機構', zh_cn: '合作机构', en: 'Partner', fr: 'Partenaire' },
  },
  sectionTitles: {
    roles: { zh_tw: '角色 & 任務', zh_cn: '角色 & 任务', en: 'Roles & Functions', fr: 'Rôles & Fonctions' },
    advantages: { zh_tw: '專案附錄', zh_cn: '专案附录', en: 'Project Appendix', fr: 'Annexe du projet' },
    gallery: { zh_tw: '活動紀錄', zh_cn: '活动纪录', en: 'Project Gallery', fr: 'Galerie du projet' }
  },
  contact: { 
    zh_tw: '與我聊聊您的想法 →', zh_cn: '与我聊聊您的想法 →', en: 'Let’s talk about your ideas →', fr: 'Parlons de vos idées →' 
  },
};

// 🌟 富文本樣式
const portfolioComponents = {
  block: {
    h2: ({ children }: any) => <h2 className="text-3xl font-serif font-bold text-[#3D3B38] mt-16 mb-8 border-b pb-4 border-[#3D3B38]/10">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-2xl font-bold text-[#8C3B3B] mt-10 mb-6 font-serif">{children}</h3>,
    normal: ({ children }: any) => <p className="text-[#5C6B47] leading-relaxed mb-6 text-lg tracking-wide">{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 space-y-3 mb-8 text-[#5C6B47] marker:text-[#D4C376] text-lg">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 space-y-3 mb-8 text-[#5C6B47] marker:text-[#8C3B3B] font-serif text-lg">{children}</ol>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-[#8C3B3B]">{children}</strong>,
    link: ({ value, children }: any) => (
      <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-[#8C3B3B] border-b border-[#8C3B3B]/30 hover:border-[#8C3B3B] transition-colors pb-1">
        {children}
      </a>
    ),
  },
}

export default function PortfolioDetailPage({ params: paramsPromise }: any) {
  const params: any = use(paramsPromise)
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') || 'zh_tw').toLowerCase().replace('-', '_')

  const [project, setProject] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true) // 🌟 確保有 Loading 狀態判斷 404
  const [selectedImgIndex, setSelectedImgIndex] = useState<number | null>(null)

  useEffect(() => {
    const query = `*[_type == "portfolio" && slug.current == $slug][0] {
      ...,
      "projectCover": projectCover.asset->url,
      "gallery": gallery[].asset->url,
      targetAudience[]->{ name },
      type[]->{ name },
      projectAppendix[] { label, value },
      roleDetails[] { functionName, functionDesc },
      partnerOrganisations,
      duration
    }`

    client.fetch(query, { slug: params.slug }).then((data) => {
      setProject(data)
      setIsLoading(false) // 🌟 資料抓完後關閉 Loading
    })
  }, [params.slug])

  const getLabel = (field: any, l: string) => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[l] || field[l.replace('_', '-')] || field['zh_tw'] || Object.values(field).find(v => v) || ''
  }

  // 🌟 404 迷航防護網
  if (!isLoading && !project) {
    notFound()
  }

  // 🌟 Loading 畫面
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF5] text-[#5C6B47] tracking-[0.3em] font-serif uppercase text-xs">
        Loading Project...
      </div>
    )
  }

  const getText = (path: string) => {
    const keys = path.split('.')
    let result = localText
    for (const key of keys) {
      if (result[key]) result = result[key]
      else return ''
    }
    return result[lang] || result['zh_tw'] || ''
  }

  // 共用動畫設定
  const scrollScaleReveal = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  }



  return (
    <main className="min-h-screen bg-[#FDFBF5] pb-32">
      <Navbar lang={lang} />

      {/* 🌟 Section 1: Hero 視覺 (維持 Tours 大氣感) */}
      <section className="relative h-[85vh] flex items-end overflow-hidden">
        <Image 
          src={project.projectCover} 
          alt="Cover" 
          fill 
          className="object-cover brightness-75 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF5]" />
        
        <div className="relative z-20 max-w-7xl mx-auto w-full px-6 pb-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="text-[#D4C376] font-mono tracking-[0.4em] uppercase text-base mb-4 block animate-pulse">
              Mission_Archive // {project.date?.split('-')[0]}
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 leading-tight transition-colors">
              {getLabel(project.displayTitle, lang)}
            </h1>
            <p className="text-white text-xl md:text-2xl font-serif italic max-w-5xl">
              {getLabel(project.subtitle, lang)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 Section 2: 多語系任務參數儀表板 (活潑且做滿四語言標籤) */}
      {/* 🌟 Section 2: 優化後的任務參數儀表板 */}
      {/* 🌟 Section 2: 懸浮「任務儀表板」- 深色版本與抬升動畫 */}
      <section className="relative z-10 -mt-10 max-w-7xl mx-auto px-6">
        <motion.div 
          // 🌟 增加「懸浮窗」動畫：滑鼠碰到時會微微升起並發光
          whileHover={{ 
            y: -10, 
            boxShadow: "0 30px 60px -12px rgba(26, 34, 20, 0.3)" 
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          // 🌟 修改點：
          // 1. bg-white -> bg-[#2C3522] (深墨綠) 或 bg-[#1A2214]
          // 2. border 改成深色邊框，增加質感
          className="bg-[#6A784D] rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl 
            grid grid-cols-1 md:grid-cols-12 gap-y-8 md:gap-x-4 cursor-default"
        >
          
          {/* 1. Duration - 縮小比例，文字改為金色與紙張白 */}
          <div className="md:col-span-2">
            <span className="text-base font-mono text-[#D4C376] uppercase tracking-[0.2em] block mb-2 opacity-70">
              {localText.dashboard.duration[lang]}
            </span>
            <p className="text-lg font-bold text-[#FDFBF5]">{getLabel(project.duration, lang) || 'Flexible'}</p>
          </div>

          {/* 2. Type - 分配空間，處理換行 */}
          <div className="md:col-span-4 md:border-l md:border-white/10 md:pl-6">
            <span className="text-base font-mono text-[#D4C376] uppercase tracking-[0.2em] block mb-2 opacity-70">
              {localText.dashboard.type[lang]}
            </span>
            <p className="text-lg font-bold text-[#FDFBF5] leading-tight whitespace-pre-line">
              {project.type?.map((t: any) => getLabel(t.name, lang)).join(' / \n')}
            </p>
          </div>

          {/* 3. Audience */}
          <div className="md:col-span-3 md:border-l md:border-white/10 md:pl-6">
            <span className="text-base font-mono text-[#D4C376] uppercase tracking-[0.2em] block mb-2 opacity-70">
              {localText.dashboard.audience[lang]}
            </span>
            <p className="text-lg font-bold text-[#FDFBF5] leading-tight">
              {project.targetAudience?.map((a: any) => getLabel(a.name, lang)).join(', ')}
            </p>
          </div>

          {/* 4. Location */}
          <div className="md:col-span-3 md:border-l md:border-white/10 md:pl-6">
            <span className="text-base font-mono text-[#D4C376] uppercase tracking-[0.2em] block mb-2 opacity-70">
              {localText.dashboard.location[lang]}
            </span>
            <p className="text-lg font-bold text-[#FDFBF5] leading-tight">
              {getLabel(project.partnerOrganisations, lang)}
            </p>
          </div>

          {/* 🌟 底部裝飾條：增加控制台的感覺 */}
          <div className="md:col-span-12 mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#8C3B3B] animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4C376] animate-pulse [animation-delay:0.2s]" />
            </div>
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Translation_Active // Narrative_Flow</span>
          </div>
        </motion.div>
      </section>
      

      {/* 🌟 Section 3: 核心摘要 (左右裝飾線版本) */}
      <section className="py-32 max-w-4xl mx-auto px-6">
        <motion.div {...scrollScaleReveal}>
          {/* 修改點：
            1. border-l-4 -> border-x-4 (開啟左右邊框)
            2. pl-10 -> px-10 或 px-12 (左右內距對稱)
            3. 建議加上 text-center 讓文字在兩條線中間顯得更莊重
          */}
          <div className="prose prose-lg max-w-none text-[#3D3B38] italic font-serif leading-relaxed 
            border-x-4 border-[#D4C376] px-10 md:px-16 text-center">
            
            <PortableText 
              value={getLabel(project.summary, lang)} 
              components={portfolioComponents} 
            />
            
          </div>
        </motion.div>
      </section>

      {/* 🌟 整合型結構：左側懸浮媒體庫 + 右側連續內容區 (S4 + S5 + S6) */}
      <section className="relative max-w-7xl mx-auto px-6 py-20">
        
        {/* 🎯 頂部紅點分隔線 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4 z-20">
          <div className="w-16 h-[1px] bg-[#4C4E36]/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#8C3B3B] shadow-sm" />
          <div className="w-16 h-[1px] bg-[#4C4E36]/20" />
        </div>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
          
          {/* ========================================================== */}
          {/* 🌟 左側：懸浮媒體檔案夾 (生命週期：S4 -> S6) */}
          {/* ========================================================== */}
          {/* 🌟 1. 左側：懸浮「檔案抽屜」媒體庫 */}
          <aside className="w-full md:w-[250px] lg:w-[300px] flex-shrink-0 z-40">
            <div className="md:sticky md:top-32 h-fit">
              
              {/* 🌟 毛玻璃深色底座 - 無邊框，模糊處理 */}
              <div className="relative p-6 rounded-[2rem] bg-[#767B39]/40 backdrop-blur-xl overflow-visible">
                
                {/* 標題裝飾 */}
                <div className="mb-10 text-center">
                  <span className="text-[#8C3B3B] font-mono text-base tracking-[0.3em] uppercase opacity-60">
                    Archive_Photo
                  </span>
                </div>

                {/* 🌟 檔案抽屜排列：透過負邊距實作遮疊 */}
                <div className="flex flex-col -space-y-20 pb-20"> 
                  {project.gallery?.map((url: string, i: number) => (
                    <motion.div 
                      key={url} 
                      // 🌟 觸發「抽出」動畫
                      whileHover={{ 
                        y: -40,       // 向上抽出
                        scale: 1.15,  // 放大
                        rotate: i % 2 === 0 ? 2 : -2, // 輕微歪斜，更有手感
                        zIndex: 50    // 確保在最上面
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="relative w-full rounded-xl overflow-hidden shadow-2xl cursor-pointer border border-white/10"
                      onClick={() => setSelectedImgIndex(i)}
                      style={{ zIndex: i }} // 初始層級由上往下疊
                    >
                      <Image 
                        src={url} 
                        alt="Archive File" 
                        width={300}
                        height={400} 
                        className="w-full h-auto relative object-contain brightness-90 hover:brightness-110 transition-all"
                        sizes="300px"
                      />
                      {/* 檔案編號小標籤 */}
                      <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded text-[8px] font-mono text-white/70">
                        IMG_0{i+1}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <p className="text-[9px] font-mono text-[#D4C376]/40 text-center animate-bounce">
                  [ SCROLL_TO_BROWSE ]
                </p>
              </div>
            </div>
          </aside>
          

          {/* ========================================================== */}
          {/* 🌟 右側：主內容區 (垂直堆疊 S4, S5, S6) */}
          {/* ========================================================== */}
          <div className="flex-1 space-y-32">
            
            {/* 🟢 Section 4: 專案優勢 (調整為 2 欄排版) */}
            {project.projectAppendix && (
              <div id="advantages">
                <div className="mb-12">
                  <span className="text-[#8C3B3B] font-mono tracking-[0.4em] uppercase text-base mb-2 block">Advantage</span>
                  <h2 className="text-4xl font-serif font-bold text-[#3D3B38]">{localText.sectionTitles.advantages[lang]}</h2>
                </div>
                {/* 因為右側變窄，這裡改成 grid-cols-2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.projectAppendix.map((item: any, i: number) => (
                    <motion.div key={i} {...scrollScaleReveal} className="p-8 rounded-2xl bg-[#6A784D] text-[#FDFBF5] hover:bg-[#8C3B3B] transition-all duration-500 shadow-md group">
                      <span className="text-[#D4C376] font-mono text-base block mb-4 uppercase tracking-tighter">
                        {getLabel(item.label, lang)} // 0{i+1}
                      </span>
                      <p className="text-base leading-relaxed font-serif text-justify">
                        {getLabel(item.value, lang)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
              <div className="flex items-center justify-center gap-4 py-12">
                  <div className="w-16 h-[1px] bg-[#4C4E36]/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8C3B3B] shadow-[0_0_10px_rgba(140,59,59,0.3)]" />
                  <div className="w-16 h-[1px] bg-[#4C4E36]/20" />
                </div>
            {/* 🔵 Section 5: 角色職能 (調整為緊湊排版) */}
            {project.roleDetails && (
              <div id="roles">
                
                <div className="mb-12">
                  <span className="text-[#D4C376] font-mono tracking-[0.4em] uppercase text-base mb-2 block">Functions</span>
                  <h2 className="text-4xl font-serif font-bold text-[#3D3B38]">{localText.sectionTitles.roles[lang]}</h2>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {project.roleDetails.map((role: any, idx: number) => (
                    <motion.div key={idx} {...scrollScaleReveal} className="bg-[#FDF9EE] p-8 rounded-2xl border border-[#8C3B3B] flex flex-col md:flex-row md:items-start gap-6 group hover:shadow-lg transition-all">
                      <span className="text-[#8C3B3B] font-mono text-[10px] pt-1">_R0{idx+1}</span>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-[#3D3B38] mb-3 group-hover:text-[#8C3B3B] transition-colors">{getLabel(role.functionName, lang)}</h4>
                        <p className="text-[#5C6B47] text-base leading-relaxed">{getLabel(role.functionDesc, lang)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
              <div className="flex items-center justify-center gap-4 py-12">
                  <div className="w-16 h-[1px] bg-[#4C4E36]/20" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8C3B3B] shadow-[0_0_10px_rgba(140,59,59,0.3)]" />
                  <div className="w-16 h-[1px] bg-[#4C4E36]/20" />
                </div>
            {/* 🟠 Section 6: 詳情內文 (檔案夾質感) */}
            {project.content && (
              <div id="content" className="bg-[#F5F2EA] p-8 md:p-12 rounded-2xl shadow-inner border border-[#D5D2C8]/30">
                <motion.div {...scrollScaleReveal}>
                  <PortableText value={getLabel(project.content, lang)} components={portfolioComponents} />
                </motion.div>
              </div>
            )}
            
            {/* 🌟 底部聯絡按鈕區 */}
            <div className="mt-40 text-center">
              <Link 
                href={`/contact?lang=${lang}`}
                // 🌟 使用 Pine Tree 深綠 (#202808) 邊框
                className="group relative inline-block px-16 py-6 overflow-hidden rounded-full 
                          border border-[#8C3B3B] text-[#202808] transition-all duration-500"
              >
                {/* 🌟 文字改為呼叫 localText 並設定滑鼠滑過變奶油白 (#FDFBF5) */}
                <span className="relative z-10 font-bold tracking-[0.2em] text-base uppercase transition-colors group-hover:text-[#FDFBF5]">
                  {localText.contact[lang]}
                </span>
                
                {/* 🌟 懸浮時由下往上冒出的深綠色背景層 */}
                <div className="absolute inset-0 z-0 bg-[#8C3B3B] translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0" />
              </Link>
            </div>

          </div>
         </div> 

      </section>

      
      
      {/* 🌟  [最底層] 沉浸式電影感燈箱 (修正佈局與縮圖比例) */}
      {/* 🌟 6. [最底層] 沉浸式電影感燈箱 - 變數大一統修正版 */}
      <AnimatePresence>
        {/* 1. 確保 index 不是 null 且資料存在 */}
        {selectedImgIndex !== null && project.gallery && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col items-center overflow-hidden h-screen w-screen"
          >
            {/* 頂部工具列 (關閉按鈕) */}
            <div className="absolute top-8 right-8 z-[110]">
              <button 
                onClick={() => setSelectedImgIndex(null)}
                className="text-white/40 hover:text-white text-5xl font-light transition-all hover:rotate-90 p-4"
              >
                ×
              </button>
            </div>

            {/* 中央主圖區域 */}
            <div className="relative w-full flex-1 min-h-0 flex items-center justify-center px-4 md:px-20 mt-16">
              
              {/* 左切換按鈕 */}
              <button 
                className="hidden md:block absolute left-10 z-[105] text-white/20 hover:text-white text-6xl transition-all p-4"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  // 🌟 修正點：統一使用 project.gallery 並確保索引正確循環
                  setSelectedImgIndex((selectedImgIndex - 1 + project.gallery.length) % project.gallery.length); 
                }}
              >
                ‹
              </button>

              <motion.div 
                key={selectedImgIndex}
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-full flex items-center justify-center"
                onClick={() => setSelectedImgIndex(null)}
              >
                {/* 🌟 修正點：使用 project.gallery[selectedImgIndex] */}
                <img 
                  src={project.gallery[selectedImgIndex]} 
                  alt="Gallery Cinema" 
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm cursor-zoom-out" 
                />
              </motion.div>

              {/* 右切換按鈕 */}
              <button 
                className="hidden md:block absolute right-10 z-[105] text-white/20 hover:text-white text-6xl transition-all p-4"
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setSelectedImgIndex((selectedImgIndex + 1) % project.gallery.length); 
                }}
              >
                ›
              </button>
            </div>

            {/* 底部底片縮圖列 (核心修正：統一變數名與排版) */}
            <div className="w-full max-w-6xl px-6 pb-12 flex-shrink-0">
              <div className="flex justify-center items-center gap-4 overflow-x-auto no-scrollbar py-2 h-20 md:h-24">
                {project.gallery.map((url: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImgIndex(i)} // 🌟 修正點：統一用 setSelectedImgIndex
                    className={`relative h-full w-auto flex-shrink-0 rounded-md overflow-hidden transition-all duration-300 border-2 ${
                      i === selectedImgIndex // 🌟 修正點：統一用 selectedImgIndex
                      ? 'border-[#D4C376] scale-110 z-10 shadow-lg' 
                      : 'border-transparent opacity-30 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={url} 
                      className="h-full w-auto object-contain bg-white/5" 
                      alt={`Thumbnail ${i}`}
                    />
                  </button>
                ))}
              </div>
              
              {/* 圖片計數器 */}
              <div className="text-center mt-4">
                <span className="text-white/20 text-[10px] tracking-[0.4em] uppercase font-mono">
                  {selectedImgIndex + 1} // {project.gallery.length}
                </span>
              </div>
            </div>

          </motion.div> 
        )}
      </AnimatePresence>
      
            
    </main>
  )
}