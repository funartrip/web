'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'

function ToursLobbyContent() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') || 'zh_tw').toLowerCase().replace('-', '_')


  //頁尾動畫
  const scrollScaleReveal = {
  initial: { opacity: 0, scale: 0.95, y: 30 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: false, amount: 0.1 },
  transition: { type: "spring", stiffness: 50, damping: 25, duration: 1.2 }
}as const;
    const CustomDivider = () => (
  <motion.div 
    {...scrollScaleReveal}
    className="flex items-center justify-center gap-6 my-24 max-w-xl mx-auto"
  >
    
  </motion.div>
);


  // 資料狀態
  const [pageData, setPageData] = useState<any>(null)
  const [tours, setTours] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 篩選狀態
  const [activeLocation, setActiveLocation] = useState<string>('all')
  const [activeType, setActiveType] = useState<string>('all')

  useEffect(() => {
    const fetchData = async () => {
      const query = `{
        "pageData": *[_type == "tourPage"][0],
        "tours": *[_type == "tour"] {
          ...,
          "serviceTypeName": serviceType->name,
          "audienceNames": suitableAudience[]->name
        }
      }`
      const res = await client.fetch(query)
      setPageData(res.pageData)
      setTours(res.tours || [])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  // 語系轉換 Helper
  const getLabel = (field: any, l: string) => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[l] || field[l.replace('_', '-')] || field['zh_tw'] || Object.values(field).find(v => v) || ''
  }

  // 多語系字典 (介面文字)
  const dict: any = {
    zh_tw: { guide: '參觀路線', allLocation: '所有地點', allType: '所有類型', explore: '探索路線 →', empty: '目前沒有符合的路線', reserve: '立即諮詢預約' },
    zh_cn: { guide: '参观路线', allLocation: '所有地点', allType: '所有类型', explore: '探索路线 →', empty: '目前没有符合的路线', reserve: '立即咨询预约'},
    fr: { guide: 'Visites Guidées', allLocation: 'Tous les lieux', allType: 'Tous les types', explore: 'Explorer →', empty: 'Aucune visite trouvée', reserve: 'Réserver & Contact' },
    en: { guide: 'Guided Tours', allLocation: 'All Locations', allType: 'All Types', explore: 'Explore →', empty: 'No tours found', reserve: 'Reserve Now' }
  }
  const t = dict[lang] || dict.zh_tw

  // 提取所有不重複的「服務類型」供篩選列使用
  const availableTypes = Array.from(new Set(tours.map(tour => getLabel(tour.serviceTypeName, lang)).filter(Boolean)))

  // 執行篩選邏輯
  const filteredTours = tours.filter(tour => {
    const matchLocation = activeLocation === 'all' || tour.locationTag === activeLocation
    const matchType = activeType === 'all' || getLabel(tour.serviceTypeName, lang) === activeType
    return matchLocation && matchType
  })

  if (isLoading) {
    return <div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center text-[#33432B] tracking-[0.3em] font-serif uppercase text-xs">Loading Curations...</div>
  }

  return (
    // 🌿 背景使用奶油白 #FDFBF5，文字使用 Kombu Green #33432B
    <main className="min-h-screen bg-[#FDFBF5] overflow-x-hidden selection:bg-[#EAA624]/30 selection:text-[#202808] flex flex-col relative text-[#33432B]">
      
      {/* 🌟 統一材質疊加 (可選) */}
      <div className="fixed inset-0 -z-10 bg-[#FDFBF5]">
        <Image src="/bg-texture.jpg" alt="Texture" fill className="object-cover opacity-[0.05] pointer-events-none mix-blend-multiply" priority />
      </div>

      <Navbar />

      {/* 🌟 1. 電影感頁首區 (Hero Section) */}
      <section className="relative h-[80vh] min-h-[600px] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* 備註：因為 tourPage 裡沒有圖片欄位，這裡暫時放一張預設圖，你也可以去 CMS 加一個 coverImage 欄位 */}
          <Image 
            src="/tour-bg.jpg" // 替換成你的大廳背景圖
            fill alt="Tours Lobby" 
            className="object-cover brightness-[0.7]" priority 
          />
          {/* 漸層過渡：底部融合回 FDFBF5 奶油白 */}
          <div className="absolute inset-0 bg-[#2C3522]/70 z-10" />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF5]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 mt-20">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }}>
            
            <div className="flex items-center gap-4 mb-6">
              {/* 金色線條 (Glazed Apricot #EAA624) */}
              <div className="w-12 h-[2px] bg-[#EAA624] shrink-0" /> 
              <span className="text-[#FDFBF5]/90 text-[14px] md:text-[18px] font-bold uppercase tracking-[0.4em] whitespace-nowrap drop-shadow-md">
                {t.guide}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight mb-6 leading-[1.1] drop-shadow-lg">
              {getLabel(pageData?.title, lang) || 'Curated Tours'}
            </h1>
            <p className="text-[#FDFBF5]/90 text-lg md:text-2xl font-serif italic max-w-2xl drop-shadow-md leading-relaxed">
              {getLabel(pageData?.heroSubtitle, lang)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. 導覽路線介紹說明 (Narrative Intro) */}
      {pageData?.narrativeIntro && (
        <section className="relative z-10 max-w-4xl mx-auto px-6 -mt-10 mb-16 text-center">
           <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="bg-[#8DA249]/20 backdrop-blur-md p-8 md:p-12 rounded-2xl shadow-[0_20px_40px_rgba(32,40,8,0.05)]"
           >
            <div className="prose-lg text-[#6A784D] font-serif leading-relaxed mx-auto">
              <PortableText value={getLabel(pageData.narrativeIntro, lang)} />
            </div>
           </motion.div>
        </section>
      )}

      {/* 🌟 3. 搜尋與篩選列 (Filter Bar) */}
      <section className="max-w-7xl mx-auto px-6 mb-12 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#33432B]/10 pb-6">
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <span className="text-xs font-mono tracking-widest text-[#C85555] uppercase font-bold flex items-center mr-4">
              Filter By //
            </span>
            
            {/* 地點篩選 (Van Gogh Blue #AADCF2) */}
            <select 
              value={activeLocation} onChange={(e) => setActiveLocation(e.target.value)}
              className="bg-[#AADCF2]/20 border border-[#AADCF2] text-[#33432B] font-medium px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-[#AADCF2] transition-all cursor-pointer text-sm"
            >
              <option value="all">{t.allLocation}</option>
              <option value="paris">Paris 巴黎</option>
              <option value="lyon">Lyon 里昂</option>
            </select>

            {/* 類型篩選 (Light Melon #F7BCB0) */}
            <select 
              value={activeType} onChange={(e) => setActiveType(e.target.value)}
              className="bg-[#F7BCB0]/20 border border-[#F7BCB0] text-[#33432B] font-medium px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-[#F7BCB0] transition-all cursor-pointer text-sm"
            >
              <option value="all">{t.allType}</option>
              {availableTypes.map((type, idx) => (
                <option key={idx} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="text-sm font-serif text-[#6A784D] whitespace-nowrap w-full md:w-auto text-right">
            {filteredTours.length} {filteredTours.length > 1 ? 'Tours' : 'Tour'} Available
          </div>
        </div>
      </section>

      {/* 🌟 4. 路線卡片網格 (Tours Grid) */}
      <section className="max-w-7xl mx-auto px-6 mb-32 w-full flex-grow">
        {filteredTours.length === 0 ? (
          <div className="text-center py-20 text-[#6A784D] font-serif italic text-xl">
            {t.empty}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredTours.map((tour, idx) => (
                <motion.div 
                  key={tour._id || idx}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link href={`/tours/${tour.slug?.current}?lang=${lang}`} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_20px_40px_rgba(32,40,8,0.08)] transition-all duration-500 border border-[#33432B]/5">
                    
                    {/* 卡片圖片區 */}
                    <div className="relative h-64 w-full overflow-hidden">
                      {tour.mainImage ? (
                        <Image src={urlFor(tour.mainImage).url()} alt="Tour Image" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-[#EBE8E0]" />
                      )}
                      
                      {/* 絕對定位的標籤：地點 (Glazed Apricot) */}
                      {tour.locationTag && (
                        <div className="absolute top-4 left-4 bg-[#EAA624] text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                          {tour.locationTag}
                        </div>
                      )}
                    </div>

                    {/* 卡片內容區 */}
                    <div className="p-8 flex flex-col flex-grow">
                      {/* 類型與對象標籤 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tour.serviceTypeName && (
                          <span className="bg-[#6A784D]/10 text-[#6A784D] text-xs font-bold px-2.5 py-1 rounded-md">
                            {getLabel(tour.serviceTypeName, lang)}
                          </span>
                        )}
                        {tour.audienceNames && tour.audienceNames.length > 0 && (
                          <span className="bg-[#DEC59E]/30 text-[#33432B] text-xs font-medium px-2.5 py-1 rounded-md">
                            {getLabel(tour.audienceNames[0], lang)} {tour.audienceNames.length > 1 ? '+' : ''}
                          </span>
                        )}
                      </div>

                      {/* 標題與副標 */}
                      <h3 className="text-2xl font-serif font-bold text-[#202808] mb-3 line-clamp-2 group-hover:text-[#C85555] transition-colors">
                        {getLabel(tour.title, lang)}
                      </h3>
                      <p className="text-[#6A784D] text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                        {getLabel(tour.subtitle, lang)}
                      </p>

                      {/* 探索按鈕 */}
                      <div className="mt-auto pt-4 border-t border-[#33432B]/10 flex items-center justify-between">
                        <span className="text-[#C85555] font-serif font-bold text-sm tracking-wide group-hover:translate-x-2 transition-transform">
                          {t.explore}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-[#FDFBF5] border border-[#33432B]/10 flex items-center justify-center group-hover:bg-[#C85555] group-hover:border-[#C85555] transition-colors">
                          <span className="text-[#33432B] group-hover:text-white text-xs">↗</span>
                        </div>
                      </div>
                    </div>

                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 🌟 5. 一句話總結 (Closing Statement) */}
      {pageData?.closingStatement && (
        <section className="w-full bg-[#767B39]/80 py-20 px-6 mt-auto">
            <motion.div 
             {...scrollScaleReveal}
             className="max-w-4xl mx-auto px-6 pb-32 text-center"
            >
            
            <div className="w-8 h-8 mx-auto mb-8 bg-[#EAA624] rotate-45 opacity-80" />
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#FDFBF5] leading-relaxed italic mb-18">
              " {getLabel(pageData.closingStatement, lang)} "
            </h2>
          
            
            <div className="w-8 h-8 mx-auto mb-12 bg-[#EAA624] rotate-45 opacity-80" />
                <h3 className="font-serif text-2xl md:text-3xl text-[#FDFBF5] mb-10 italic">
                 {lang === 'fr' ? 'Prêt pour l’aventure ?' : lang === 'en' ? 'Ready for the journey?' : '準備好開始這趟旅程了嗎？'}
                </h3>
            <a href="mailto:funartrip@gmail.com" className="group relative inline-block w-full sm:w-auto px-16 py-5 overflow-hidden rounded-full border border-[#C85555] text-[#1A1A1A] transition-all duration-700 shadow-sm hover:shadow-xl">
                <span className="relative z-10 font-bold tracking-[0.4em] text-[20px] uppercase group-hover:text-white">
                 {t.reserve}
                </span>
            <div className="absolute inset-0 z-0 bg-[#C85555] translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0" />
            </a>
            </motion.div>

        </section>
      )}




    </main>
  )
}
export default function ToursLobbyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center text-[#202808] tracking-widest uppercase font-mono text-xs">Loading...</div>}>
      <ToursLobbyContent />
    </Suspense>
  )
}