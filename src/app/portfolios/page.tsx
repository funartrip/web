'use client'

import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion' // 🌟 引入更多動畫庫
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { PortableText } from '@portabletext/react'
import { portfolio } from '@/sanity/schemaTypes/portfolio'

function PortfoliosContent() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') || 'zh_tw').toLowerCase().replace('-', '_')

  const [pageData, setPageData] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    Promise.all([
      client.fetch(`*[_type == "portfolioPage"][0]`),
      client.fetch(`*[_type == "portfolio"] | order(date desc) {
        _id, "slug": slug.current, displayTitle, subtitle, summary, highlight,
        "projectCover": projectCover.asset->url, date,
        "targetAudience": targetAudience[]->{ name }
      }`)
    ]).then(([page, list]) => {
      setPageData(page)
      setProjects(list)
      setLoading(false)
    })
  }, [])

const getLabel = (field: any, lang: string) => {
  if (!field) return null; 
  if (typeof field === 'string') return field; // 處理非多語系的純字串

  // 🌟 關鍵修正：相容橫線 zh-tw 與底線 zh_tw
  const currentLang = lang;
  const dashLang = lang.replace('_', '-'); 

  // 依序尋找內容，直到找到有資料的語言為止
  return field[currentLang] || 
         field[dashLang] || 
         field['zh_tw'] || 
         field['zh-tw'] || 
         field['en'] || 
         null;
};

  const t = (field: any) => {
    if (!field) return '';
    return field[lang] || field['zh_tw'] || field['en'] || field['zh_cn'] || '';
  };
  const sectionTitles: any = {
  zh_tw: '核心設計維度',
  zh_cn: '核心设计维度',
  en: 'Core Design Dimensions',
  fr: 'Dimensions de conception'
};
const localText: any = {
  // ... 其他已有的翻譯 ...
  previewMission: {
    zh_tw: '預覽任務',
    zh_cn: '预览任务',
    en: 'Preview Mission',
    fr: 'Aperçu de la mission'
  },
  fullExperience: {
    zh_tw: '進入完整計劃',
    zh_cn: '进入完整計劃',
    en: 'Enter Full Experience',
    fr: "Entrer dans le projet"
  },
  contact: { zh_tw: '與我聊聊您的想法', zh_cn: '与我聊聊您的想法', en: 'Let’s talk about your ideas',  fr: 'Parlons de vos idées' 
  },
  ctaQuestion: {
    zh_tw: '準備好建立獨一無二的文化體驗了嗎？',
    zh_cn: '准备好建立独一无二的文化体验了吗？',
    en: 'Ready to create a unique cultural experience?',
    fr: 'Prêt à créer une expérience culturelle unique ?'
  },
};

  // 🌟 新增：遊戲感的插畫對應 (後續可從 Sanity 抓取 iconName)
  const getIcon = (idx: number) => {
    const icons = ['💡', '🧩', '🎨', '🤝', '🏛️']; // 敘事、遊戲化、視覺、親子、活化
    return icons[idx] || '🎯';
  };

  // 🌟 核心動畫：更狂野的遊戲感浮現 (斜切視差)
  const gameReveal = {
    initial: { opacity: 0, x: -50, skewX: 10 },
    whileInView: { opacity: 1, x: 0, skewX: 0 },
    viewport: { once: false, amount: 0.1 },
    transition: { type: "spring" as const, stiffness: 40, damping: 15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  }as const;
  const scrollScaleReveal = {
    initial: { opacity: 0, scale: 0.85, y: 30 },
    whileInView: { opacity: 1, scale: 1, y: 0 },
    viewport: { once: false, amount: 0.2 },
    transition: { 
      type: "spring" as const, 
      stiffness: 50, 
      damping: 20,
      duration: 1.2 
    }
  }as const;
  const cardEntrance = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, 
    y: 0,
    transition: {
      delay: i * 0.1, // 完美的交錯感
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1], // 經典的介面流暢曲線 (Cubic Bezier)
    }
  })
}as const;

// 在 PortfoliosContent 內部頂部加入
const [selectedProject, setSelectedProject] = useState<any>(null);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#EBE8E0] text-[#4C4E36] font-mono tracking-[0.5em] uppercase text-xs">
      Curating EXPERIENCE_01...
    </div>
  )

  return (
    <main className="min-h-screen bg-[#FDFBF5] selection:bg-[#8C3B3B]/20">
      
      {/* 🌟 1. 遊戲開始 Hero (加入互動光影與背景視差) */}
      <section className="relative h-screen flex items-center overflow-hidden">
        
        {/* 背景大圖：加入 priority 優先載入，並加上緩慢縮放視差 */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" as const, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src="/portfolios-bg.jpeg" 
            fill 
            alt="Narrative World" 
            priority
            className="object-cover brightness-[0.65] contrast-[1.1]" 
            sizes="100vw"
          />
        </motion.div>

        {/* 層級一：品牌深綠色遮罩，增加遊戲神秘感 */}
        
        <div className="absolute inset-0 bg-[#2C3522]/70 z-10" />
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF5]" />
        
        
        {/* 層級二：頂部 Navbar */}
        <div className="absolute top-0 inset-x-0 z-50">
          <Navbar lang={lang} />
        </div>

        {/* 層級三：Hero 文字 (斜切並浮現) */}
        <div className="relative z-20 w-full max-w-screen-2xl mx-auto px-6 md:px-16 lg:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 50, skewY: -5 }} 
            animate={{ opacity: 1, y: 0, skewY: 0 }} 
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-6 mb-12">
              <span className="w-10 h-[3px] bg-[#D4C376]"></span>
              <span className="text-white/60 text-base md:text-base font-mono uppercase tracking-[0.6em] block drop-shadow-md">
                Selected Projects
              </span>
            </div>
            {/* 標題：更大氣、更粗獷，模仿遊戲 Logo 排版 */}
            <h1 className="text-5xl md:text-[100px] font-serif text-white tracking-tighter mb-12 leading-[0.85] drop-shadow-2xl">
              {t(pageData?.title) || 'Portfolio'}
            </h1>
            <p className="text-white/90 text-lg md:text-xl font-serif italic max-w-3xl leading-relaxed drop-shadow-lg">
              {t(pageData?.heroSubtitle)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. 五張專業定位卡片 (重點排版：進化為神秘技能卡) */}
      <section className="py-40 px-6 max-w-screen-2xl mx-auto">
        <motion.div {...cardEntrance} className="text-center mb-32 flex flex-col items-center">
          <span className="text-[#8C3B3B] font-mono text-base tracking-[0.6em] uppercase mb-4 animate-pulse">Design System</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#3D3B38] mb-8">
             {sectionTitles[lang] || sectionTitles.zh_tw}
          </h2>
          <div className="w-24 h-px bg-[#4C4E36]/30 mt-8" />
        </motion.div>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-40">
          {pageData?.coreAbilities?.map((ability: any, idx: number) => (
            <motion.div 
              key={idx}
              custom={idx} // 傳入索引做交錯動畫
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardEntrance}
              // 🌟 懸停動態：模仿「抽牌」感，加入輕微發光與位移
              whileHover={{ 
                y: -15, 
                transition: { duration: 0.3 } 
              }}
              
              className="relative p-8 md:p-10 flex flex-col group transition-all duration-500 cursor-default h-full min-h-[420px] will-change-transform"
            >
              {/* 🌟 這是「向四周淡出」的毛邊背景層 */}
              <div className="absolute inset-0 z-0 rounded-[32px] bg-[#767B39]/20
                /* 核心遮罩：控制淡出感 */
                
                /* 模糊邊緣：增加毛邊感 */
                blur-[2px]">
              </div>

              {/* 🌟 內容層：確保 z-10 壓在背景上 */}
              <div className="relative z-10">             
              </div>
              {/* 🌟 頂部：圖示區 (加入小跳動動畫) */}
              <div className="text-5xl mb-10 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                {getIcon(idx)}
              </div>
              
              {/* 🌟 中間：文字區 */}
              <div className="flex-1 flex flex-col">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-[#3D3B38] mb-6 leading-tight group-hover:text-[#8C3B3B] transition-colors">
                  {t(ability.abilityTitle)}
                </h3>
                <p className="text-[#5C6B47] text-sm md:text-base leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                  {t(ability.abilityDescription)}
                </p>
              </div>

              {/* 🌟 底部：遊戲等級標籤 (加入掃光效果) */}
              <div className="mt-10 pt-6 border-t border-[#4C4E36]/10 flex justify-between items-center">
                <span className="text-[#8C3B3B] font-mono font-bold tracking-widest text-[10px] uppercase">
                  Ability_v.{idx + 1}
                </span>
                {/* 懸停時出現的小箭頭，增加導引感 */}
                <span className="opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-[#8C3B3B]">
                  
                </span>
              </div>

              {/* 🌟 背景飾紋：加入一個淡淡的遊戲質感底紋 (選配) */}
              <div className="absolute inset-0 rounded-[32px] border-2 border-transparent group-hover:border-[#8C3B3B]/10 pointer-events-none transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

       
        
        {/* 結語區 (一句話結語，加大字體氣勢) */}
        <motion.div {...gameReveal} className="text-center max-w-4xl mx-auto mt-48">
           <p className="text-xl md:text-2xl font-serif font-bold italic text-[#4C4E36] leading-snug">
             {t(pageData?.closingStatement)} 
           </p>
        </motion.div>
      </section>
         <div className="flex items-center justify-center gap-4 py-12">
             <div className="w-16 h-[1px] bg-[#4C4E36]/20" />
             <div className="w-2.5 h-2.5 rounded-full bg-[#8C3B3B] shadow-[0_0_10px_rgba(140,59,59,0.3)]" />
             <div className="w-16 h-[1px] bg-[#4C4E36]/20" />
            </div>
     
     {/* 🌟 3. 作品檔案區 (橫向探索廊道) */}
      <section className="relative py-32 bg-[#FDFBF5] overflow-hidden">
        
        

        <div className="max-w-7xl mx-auto px-6 mb-20">
          <span className="text-[#8C3B3B] font-mono tracking-[0.4em] uppercase text-xs mb-4 block">Projet</span>
          {/* 替換成動態抓取（假設你把名稱加進了 sectionTitles 字典裡） */}
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#3D3B38]">
            {lang === 'fr' ? 'Explorations Narratives' : 
            lang === 'en' ? 'Narrative Quests' : 
            lang === 'zh_cn' ? '项目转译实践' : '專案轉譯實踐'}
          </h2>
        </div>

        {/* 🌟 橫向滾動容器：使用 snap-x 實現磁吸感 */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-8 px-[10vw] pb-20">
          {projects.map((project: any, index: number) => (
            <motion.div 
              key={project._id}
              {...scrollScaleReveal}
              transition={{ delay: index * 0.1 }}
              // 點擊後不直接跳轉，而是開啟預覽燈箱
              onClick={() => setSelectedProject(project)}
              className="flex-none w-[80vw] md:w-[450px] snap-center cursor-pointer group"
            >
              <div className="relative aspect-[4/5] rounded-[30px] overflow-hidden bg-[#DCD9CE] shadow-2xl transition-all duration-700 group-hover:-translate-y-4">
                {project.projectCover && (
                  <Image 
                    src={project.projectCover} 
                    alt={t(project.displayTitle)}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 450px"
                  />
                )}
                {/* 懸停裝飾層 */}
                <div className="absolute inset-0 bg-[#2C3522]/0 group-hover:bg-[#2C3522]/40 transition-colors duration-700 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 border border-white/50 text-white px-6 py-2 rounded-full font-mono text-xs tracking-widest uppercase transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {localText.previewMission[lang]}
                  </span>
                </div>
              </div>
              <div className="mt-8 px-2 text-center">
                <h3 className="text-xl font-serif font-bold text-[#3D3B38]">{t(project.displayTitle)}</h3>
                <p className="text-[#5C6B47] text-xs mt-2 uppercase tracking-widest">{project.date?.split('-')[0]}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 🌟 預覽燈箱 (AnimatePresence) */}
        {/* 🌟 預覽燈箱 - 強化手機版捲動與適配 */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-[#2C3522]/90 backdrop-blur-md"
              onClick={() => setSelectedProject(null)} 
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                // 🌟 關鍵修正：
                // 1. md:max-h-[90vh]：限制電腦版高度，避免太長
                // 2. max-h-[85vh]：限制手機版高度，預留上下邊距
                // 3. w-full max-w-7xl：維持寬幅設計
                className="bg-[#FDFBF5] w-full max-w-7xl max-h-[85vh] md:max-h-[90vh] rounded-[30px] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                onClick={(e) => e.stopPropagation()} 
              >
                
                {/* 左側圖片區 */}
                {/* 🌟 修正：md:h-auto 確保電腦版高度自適應；h-[250px] 讓手機版圖片不要佔太多空間 */}
                <div className="relative w-full md:w-[40%] h-[250px] md:h-auto flex-shrink-0">
                  <Image 
                    src={selectedProject.projectCover} 
                    alt={getLabel(selectedProject.displayTitle, lang)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </div>

                {/* 🌟 右側文字區：這是捲動的核心 */}
                {/* 🌟 修正：overflow-y-auto 讓內容過長時可以滑動；flex-1 佔滿剩餘空間 */}
                <div className="p-8 md:p-12 flex flex-col flex-1 overflow-y-auto custom-scrollbar">
                  
                  {/* 關閉按鈕 */}
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="self-end mb-4 text-[#8C3B3B] font-mono text-xs hover:scale-110 transition-transform duration-150 ease-in-out"
                  >
                    CLOSE [✕]
                  </button>

                  {/* 標題與年份 */}
                  <div className="mb-6">
                    <p className="text-[#8C3B3B] font-mono text-[10px] tracking-[0.4em] mb-2 block uppercase">
                      DEBRIEF_FILE / {selectedProject.date?.split('-')[0]}
                    </p>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#3D3B38] leading-tight">
                      {getLabel(selectedProject.displayTitle, lang)}
                    </h2>
                  </div>
                  
                  {/* Highlight 標籤 */}
                  {getLabel(selectedProject.highlight, lang) && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {String(getLabel(selectedProject.highlight, lang)).split(',').map((tag: string, i: number) => (
                        tag.trim() && (
                          <span key={i} className="px-3 py-1 bg-[#8C3B3B]/10 text-[#8C3B3B] text-[10px] font-bold rounded-full border border-[#8C3B3B]/20">
                            {tag.trim()}
                          </span>
                        )
                      ))}
                    </div>
                  )}

                  <div className="w-full h-px bg-[#4C4E36]/10 mb-8" />

                  {/* Summary 富文本 */}
                  <div className="flex-1">
                    <div className="text-[#5C6B47] text-base md:text-lg leading-relaxed font-serif space-y-4">
                      <PortableText value={getLabel(selectedProject.summary, lang)} />
                    </div>
                  </div>
                
                  {/* 底部按鈕 - 🌟 修正：手機版建議加上 mb-4 避免貼底 */}
                  <div className="mt-12 pt-8 border-t border-[#4C4E36]/10 mb-4 md:mb-0">
                    <Link 
                      href={`/portfolios/${selectedProject.slug}?lang=${lang}`}
                      className="flex items-center justify-center w-full py-5 bg-[#3D3B38] text-white rounded-full font-bold tracking-[0.3em] uppercase text-sm hover:bg-[#8C3B3B] transition-all"
                    >
                      {localText.fullExperience[lang]}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </section>
      
      

      {/* 🌟 4. 結尾：按鈕也變得分量十足 */}
      <section className="py-48 text-center bg-[#FDFBF5]">
        <motion.div {...gameReveal}>
          <h3 className="font-serif text-2xl md:text-3xl text-[#2C3522] mb-10 italic">
             {localText.ctaQuestion[lang]}
          </h3>
          <Link 
            href={`/contact?lang=${lang}`}
            className="group relative inline-block px-24 py-8 overflow-hidden rounded-full border border-[#3D3B38] text-[#3D3B38] shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-[#8C3B3B]"
          >
            <span className="relative z-10 font-bold tracking-[0.3em] text-base uppercase transition-colors duration-500 group-hover:text-white">
               {localText.contact[lang]}
            </span>
            {/* 深綠色填充動畫 (從左到右) */}
            <div className="absolute inset-0 z-0 bg-[#3D3B38] -translate-x-full transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:translate-x-0" />
          </Link>
        </motion.div>
      </section>

    </main>
  )
}

export default function PortfoliosPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#EBE8E0]" />}>
      <PortfoliosContent />
    </Suspense>
  )
}