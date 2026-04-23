'use client'

import { client, urlFor } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { notFound, useParams } from 'next/navigation'
// (記得加在原本的 next/navigation 引入裡)
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, use, useRef, Suspense } from 'react'

// --- 🌟 旗艦動畫與組件 ---

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

function TourDetailContent({
 paramsPromise,
}: {
  paramsPromise: Promise<{ slug: string, lang: string }>;
}) {
  
  const resolvedParams = use(paramsPromise);
  const lang = ((resolvedParams?.lang as string) || 'zh_tw').toLowerCase().replace('-', '_');

  const [tour, setTour] = useState<any>(null);
  const [bookingTerms, setBookingTerms] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true)
  
  // 1. 把原本的 selectedImage 換成這個索引控制
  const [currentImgIndex, setCurrentImgIndex] = useState<number | null>(null);
  const galleryImages = tour?.gallery || []; 

  // 2. 加入滾動箭頭所需的「控制手」
  const scrollRef = useRef<HTMLDivElement>(null);

  // 3. 加入滾動的功能函式
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  

  useEffect(() => {
    const query = `{
      "tour": *[_type == "tour" && slug.current == $slug][0] {
        ...,
        gallery,
        "priceTemplate": priceTemplate->{basePrice, extraPersonFee, maxCapacity}, // ✅ 換成跟資料庫拿這四個新法寶！
        "serviceType": serviceType->name,
        "suitableAudience": suitableAudience[]->name,
        "interest": interest[]->name,
        "duration": tourDuration->name,
        "routeSteps": routeSteps[]->{
          name,
          description
          }
      },
      "bookingTerms": *[_type == "bookingTerms"][0]
    }`;
    
    client.fetch(query, { slug: resolvedParams.slug }).then((res) => {
      setTour(res.tour);
      setBookingTerms(res.bookingTerms);
      
      // 🌟 修正 1：抓完資料後，一定要把載入狀態改成 false
      setIsLoading(false); 
    });
  }, [resolvedParams.slug]);

  const getLabel = (field: any, lang: string) => {
    if (!field) return ''; 
    if (typeof field === 'string') return field; 
    return field[lang] || field['zh_tw'] || Object.values(field).find(v => v) || '';
  };

  // 🌟 修正 2：先判斷 404。如果載入完了 (!isLoading) 且沒有資料 (!tour)
  if (!isLoading && !tour) {
    notFound() 
  }

  // 🌟 修正 3：最後才是 Loading 畫面。只要還在載入 (isLoading)，就顯示這個畫面
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF5] text-[#4C4E36] tracking-[0.3em] font-serif uppercase text-xs">
        Unveiling the Journey...
      </div>
    )
  }

 
  const dict: any = {
    zh_tw: { highlights: '導覽亮點', itinerary: '路線詳情', gallery: '旅途瞬間', practical: '預約須知', duration: '導覽解說時長', reserve: '立即諮詢預約', process: '01. 預約流程', cancel: '02. 改期與取消', reminders: '03. 博物館提醒', quote: '服務報價', overTen: '超過限制人數？歡迎與我聯繫諮詢細節。', extraPerson: '第7人起（含），每增加一人', maxCap: '最大接待人數', baseGroup: '1 至 6 人' },
    zh_cn: { highlights: '导览亮点', itinerary: '路线详情', gallery: '旅途瞬间', practical: '预约须知', duration: '解說时长', reserve: '立即咨询预约', process: '01. 预约流程', cancel: '02. 改期与取消', reminders: '03. 博物馆提醒', quote: '服务报价', overTen: '超过限制人数？欢迎与我联系咨询细节。', extraPerson: '第7人起（含），每增加一人', maxCap: '最大接待人数', baseGroup: '1 至 6 人' },
    fr: { highlights: 'Points Forts', itinerary: 'Itinéraire', gallery: 'Galerie', practical: 'Infos Pratiques', duration: 'Durée de la visite', reserve: 'Réserver & Contact', process: '01. Réservation', cancel: '02. Annulation', reminders: '03. Rappels Musée', quote: 'Tarifs', overTen: 'Plus de pers. ? Me contacter pour les détails.', extraPerson: 'Par personne supplémentaire', maxCap: 'Capacité maximale', baseGroup: 'De 1 à 6 personnes' },
    en: { highlights: 'Highlights', itinerary: 'Itinerary', gallery: 'Gallery', practical: 'Practicalities', duration: 'Duration for the visite', reserve: 'Reserve Now', process: '01. Booking', cancel: '02. Cancellation', reminders: '03. Museum Reminders', quote: 'Service Quote', overTen: 'More people? Get in touch to discuss.', extraPerson: 'Per extra person', maxCap: 'Max capacity', baseGroup: '1 to 6 people' },
  }
  const t = dict[lang] || dict.zh_tw;
  const priceTiers = tour.priceTemplate?.tiers || tour.priceData?.tiers;

 const tourComponents = {
    block: {
      normal: ({ children }: any) => (
        <motion.p {...scrollScaleReveal} className="mb-6 leading-normal text-base md:text-lg font-serif text-[#1A1A1A] text-justify opacity-90">
          {children}
        </motion.p>
      ),
      h2: ({ children }: any) => (
        <motion.h2 {...scrollScaleReveal} className="text-2xl md:text-3xl font-serif font-bold text-[#2C3522] mt-20 mb-10 pb-4 border-b border-dashed border-[#4C4E36]/30 tracking-widest uppercase">
          {children}
        </motion.h2>
      ),
      h3: ({ children }: any) => (
        <motion.h3 {...scrollScaleReveal} className="text-xl md:text-2xl font-serif font-bold text-[#2C3522] mt-12 mb-6 tracking-wide">
          {children}
        </motion.h3>
      ),
      h4: ({ children }: any) => (
        <motion.h4 {...scrollScaleReveal} className="text-lg font-bold font-serif text-[#4C4E36] mt-8 mb-4">
          {children}
        </motion.h4>
      ),
      h5: ({ children }: any) => (
        <motion.h5 {...scrollScaleReveal} className="text-base font-serif text-[#2C3522] mt-6 mb-3">
          {children}
        </motion.h5>
      ),
      h6: ({ children }: any) => (
        <motion.h6 {...scrollScaleReveal} className="text-base font-bold uppercase tracking-widest text-[#8C9A76] mt-6 leading-normal">
          {children}
        </motion.h6>
      ),
      blockquote: ({ children }: any) => (
        <motion.blockquote
          {...scrollScaleReveal}
          className="my-25 text-xl md:text-2xl font-bold italic text-[#4C4E36] text-center px-5 leading-normal"
        >
          “ {children} ”
        </motion.blockquote>
      ),
    },
    // 🌟 全新加入：控制整組清單的外框與上下間距
    list: {
      bullet: ({ children }: any) => (
        <ul className="mb-8 mt-2 flex flex-col space-y-3">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="mb-8 mt-2 flex flex-col space-y-3">{children}</ol>
      ),
    },
    // 🌟 修正：補上 font-serif，並微調單一項目的間距
    listItem: {
      bullet: ({ children }: any) => (
        <motion.li {...scrollScaleReveal} className="relative pl-6 text-[#1A1A1A] text-base md:text-lg list-none opacity-90 font-serif">
          <span className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full bg-[#8C3B3B]"></span>
          {children}
        </motion.li>
      ),
      number: ({ children }: any) => (
        <motion.li {...scrollScaleReveal} className="list-decimal ml-6 text-[#1A1A1A] text-base md:text-lg opacity-90 font-serif">
          {children}
        </motion.li>
      )
    },
    marks: {
      strong: ({ children }: any) => (
        <strong className="font-bold text-[#8C3B3B]">{children}</strong>
      ),
      em: ({ children }: any) => (
        <em className="italic font-serif text-[#5C6B47]">{children}</em>
      ),
      link: ({ children, value }: any) => {
        // 判斷是否為外部連結 (http開頭)，如果是就另開新分頁
        const isExternal = value?.href?.startsWith('http');
        return (
          <a
            href={value?.href}
            target={isExternal ? '_blank' : '_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-[#C85555] font-bold underline underline-offset-[6px] decoration-[#C85555]/30 hover:decoration-[#C85555] transition-colors duration-300"
          >
            {children}
          </a>
       );
      }
    }
   };

  return (
    <main className="min-h-screen bg-[#FDFBF5] selection:bg-[#8C3B3B]/10 overflow-x-hidden relative">
      
      {/* 🌟 1. 沉浸式首圖 */}
      <section 
        className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden" 
        
      >
        {tour.mainImage && (
          <Image src={urlFor(tour.mainImage).url()} alt="Cover" fill className="object-cover" priority unoptimized={true} />
        )}
        <div className="absolute inset-0 bg-black/5" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF5]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1.2 }}
            className="bg-white/5 rounded-[40px] inline-block px-16 py-16 
                        backdrop-blur-[6px]
                       border-none"
          >

            <span className="inline-block bg-[#8C3B3B] text-white px-6 py-1.5 rounded-full tracking-[0.4em] uppercase text-[10px] mb-8 font-bold shadow-xl">
              📍 {tour.locationTag === 'lyon' ? 'LYON 里昂' : 'PARIS 巴黎'}
            </span>
            <h1 className="text-5xl md:text-8xl font-extrabold mb-8 tracking-tighter text-white drop-shadow-2xl leading-normal">
              {getLabel(tour.title, lang)}
            </h1>
            <p className="text-white drop-shadow-lg text-lg md:text-2xl font-serif italic max-w-2xl mx-auto">
              {getLabel(tour.highlight, lang)}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🌟 2. 內容與側邊欄 (上層 Grid 佈局) */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 py-24">
        
        {/* 左側：內容區 */}
       {/* 左側：內容區 */}
        <div className="lg:col-span-8">
          
          {/* 🌟 1. 導覽路線：極簡單線軌道 (帶方向箭頭完美版) */}
          {tour.routeSteps && tour.routeSteps.length > 0 && (
            <section className="mb-16">
              <span className="text-[#8C3B3B] font-bold tracking-[0.5em] uppercase text-[20px] mb-6 block">
                {lang === 'fr' ? 'Le parcours' : lang === 'en' ? 'Route' : '導覽路線'}
              </span>
              
              {/* 橫向滑動容器 */}
              <div className="relative flex items-start overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 -mx-6 px-6 md:mx-0 md:px-0">
                
                {/* 🗑️ 已經將原本會斷掉的 absolute 貫穿長線刪除 */}

                {tour.routeSteps
                  .filter((step: any) => step !== null && step.name) // 保留防呆過濾
                  .map((step: any, idx: number, arr: any[]) => (
                  <motion.div 
                    key={idx}
                    {...scrollScaleReveal}
                    className="relative z-10 flex-shrink-0 w-36 md:w-48 snap-start flex flex-col items-center group cursor-default"
                  >
                    
                    {/* 🌟 全新設計：每個站點負責畫一條線連接到下一站 */}
                    {idx !== arr.length - 1 && (
                      <div className="absolute top-[13px] left-[50%] w-full flex items-center z-0 -translate-y-1/2">
                        {/* 實體延伸線 */}
                        <div className="h-[1px] bg-[#4C4E36]/30 flex-grow" />
                        {/* 優雅的 SVG 幾何小箭頭 */}
                        <svg className="w-3 h-3 text-[#4C4E36]/30 fill-current mr-6" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}

                    {/* 實體圓點 (加上 relative z-10 確保蓋在線條上方) */}
                    <div className="relative z-10 w-2.5 h-2.5 bg-[#4C4E36] rounded-full ring-[8px] ring-[#FDFBF5] group-hover:scale-125 group-hover:bg-[#8C3B3B] transition-all duration-300 mt-2 mb-6" />

                    {/* 站點名稱 */}
                    <h4 className="text-sm md:text-base font-serif font-bold text-[#2C3522] text-center px-2 leading-tight group-hover:text-[#8C3B3B] transition-colors">
                      {getLabel(step.name, lang)}
                    </h4>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* 🌟 2. 導覽亮點 (緊貼時間軸) */}
          <section className="mb-12">
            <span className="text-[#8C3B3B] font-bold tracking-[0.5em] uppercase text-[20px] mb-8 block">{t.highlights}</span>
            <PortableText value={getLabel(tour.summary, lang)} components={tourComponents} />
          </section>

          {/* 閱讀感連貫的虛線過渡 */}
          <div className="w-full border-b border-dashed border-[#4C4E36]/20 mb-12" />

          {/* 🌟 3. 路線詳情 */}
          <article>
            <span className="text-[#8C3B3B] font-bold tracking-[0.5em] uppercase text-[20px] mb-8 block">{t.itinerary}</span>
            <PortableText value={tour.content?.[lang] || []} components={tourComponents} />
          </article>
          
        </div> {/* ✅ 左側內容區結束 */}

       
        {/* 🌟 右側：資訊欄 */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-10">
            <motion.div {...scrollScaleReveal} className="bg-white p-10 rounded-[40px] shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-[#EBE7D9] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-[#4C4E36]" />
              
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#F4F1E1]">
                <span className="text-[20px] font-bold text-[#2C3522] tracking-widest uppercase bg-[#F4F1E1] px-4 py-2 rounded-full">
                  {getLabel(tour.serviceType, lang)}
                </span>
                <div className="flex gap-1.5">
                  {tour.language?.map((l: string) => (
                    <span key={l} className="text-[20px] font-bold border border-[#EBE7D9] px-2 py-1 rounded text-[#8C9A76] uppercase tracking-tighter">{l.slice(0,2)}</span>
                  ))}
                </div>
              </div>

              {/* 🌟 適合對象與興趣標籤 */}
              {(tour.suitableAudience?.length > 0 || tour.interest) && (
                <div className="mb-10 pb-6 border-b border-[#F4F1E1] space-y-5">
                  {/* 適合對象 */}
                  {tour.suitableAudience?.length > 0 && (
                    <div>
                      <span className="text-base font-serif italic text-[#2C3522] mb-2 block">
                        {lang === 'fr' ? 'Pour qui' : lang === 'en' ? 'Perfect for' : '適合對象'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {tour.suitableAudience.map((item: any, idx: number) => (
                          <span key={idx} className="bg-[#F8F6EF] text-[#4C4E36] px-3 py-1.5 rounded-full text-[15px] font-bold tracking-widest border border-[#EBE7D9] uppercase">
                            {getLabel(item, lang)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 🌟 興趣標籤  */}
                 {/* 🌟 修正點 2：檢查陣列長度並使用 .map() 渲染每一項 */}
                  {tour.interest && tour.interest.length > 0 && (
                    <div>
                      <span className="text-base font-serif italic text-[#2C3522] mb-2 block">
                        {lang === 'fr' ? 'Thèmes' : lang === 'en' ? 'Themes' : '特別推薦'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {tour.interest.map((item: any, idx: number) => (
                          <span 
                            key={idx} 
                            className="bg-transparent text-[#8C3B3B] px-3 py-1.5 rounded-full text-[15px] font-bold tracking-widest border border-[#EBE7D9] uppercase"
                          >
                            # {getLabel(item, lang)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                 </div>
               )}

              <div className="space-y-6 mb-12 text-[#1A1A1A]">
                 <div className="flex items-center justify-between py-2">
                  <span className="text-xl font-serif text-[#2C3522]">{t.duration}</span>
                  <span className="font-bold">{getLabel(tour.duration, lang)}</span>
                </div>
                <h3 className="text-xl font-bold text-[#2C3522] mb-4">{t.quote}</h3>
               
                {/* 🌟 渲染全新定價模式 */}
                {tour.priceTemplate?.basePrice ? (
                  <div className="flex flex-col gap-2">
                    {/* 基礎價 */}
                    <div className="flex justify-between items-center py-4 border-b border-[#F4F1E1]">
                      <span className="text-2xl opacity-80 font-bold">{t.baseGroup}</span>
                      <span className="text-[#2C3522] font-extrabold text-2xl">€{tour.priceTemplate.basePrice}</span>
                    </div>
                    
                    {/* 加人費 */}
                    {tour.priceTemplate.extraPersonFee ? (
                      <div className="flex justify-between items-center py-3 text-[#4C4E36]">
                        <span className="text-sm font-bold opacity-90">
                          + {t.extraPerson}
                        </span>
                        <span className="font-bold text-base">+€{tour.priceTemplate.extraPersonFee}</span>
                      </div>
                    ) : null}

                    {/* 最大人數限制 */}
                    {tour.priceTemplate.maxCapacity ? (
                      <div className="text-right text-base font-bold text-[#4C4E36] opacity-70 mt-1 tracking-wider">
                        {t.maxCap} : {tour.priceTemplate.maxCapacity} {lang === 'fr' ? 'pers.' : lang === 'en' ? 'pax' : '人'}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-base text-[#8C9A76] italic py-4">
                  報價建置中...
                  </div>
                )}
              </div>

              {/* 🌟 修正間距：加入 mb-8 撐開與按鈕的距離 */}
              <motion.p 
                {...scrollScaleReveal}
                 className="mt-8 mb-8 text-center text-base md:text-base italic text-[#4C4E36]/70 font-serif tracking-wide" >
                —— {t.overTen} ——
              </motion.p>

              <a href={`/${lang}/contact`}className="group relative block w-full text-center py-5 overflow-hidden rounded-full border border-[#C85555] text-[#1A1A1A] transition-all duration-700">
                <span className="relative z-10 font-bold tracking-[0.4em] text-[20px] uppercase group-hover:text-white">{t.reserve}</span>
                <div className="absolute inset-0 z-0 bg-[#C85555] translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0" />
              </a>
            </motion.div>

            {getLabel(tour.bonASavoir, lang) && (
              <motion.div {...scrollScaleReveal} className="bg-[#F4F1E1] p-8 rounded-[35px] text-[#8C3B3B] shadow-2xl relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">💡</div>
                <h4 className="font-bold tracking-[0.3em] text-[20px] uppercase mb-6 opacity-60">Bon à savoir</h4>
                <div className="text-base font-serif leading-relaxed opacity-90 text-[#4C4E36] prose-invert">
                  <PortableText value={getLabel(tour.bonASavoir, lang)} />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    
       {/* ✅ 右側側邊欄結束 */}
        
      {/* 🌟 滿版底層區塊：Gallery 相簿 & Booking Terms 預約須知 */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        
        
        {/* Gallery 相簿：全比例相容版 + 深色背景 + 導覽箭頭 */}
        {/* 🌟 旗艦版：全寬背景 + 內容限縮 (Contained Gallery) */}
        {tour.gallery && tour.gallery.length > 0 && (
          <>
            <CustomDivider />
            
            {/* 1. 最底層：全寬深色背景 */}
            <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-24 bg-[#4C4E36] overflow-hidden">
              
              {/* 2. 中間層：全寬氛圍柔光 */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[600px] bg-white/10 blur-[150px] pointer-events-none z-0" />
              
              {/* 3. 最上層：內容容器 (關鍵在 px-8 到 px-20) */}
              <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
                
                {/* 標題與箭頭 */}
                <div className="mb-12 flex justify-between items-end">
                  <div>
                    <span className="text-[#8C9A76] font-bold tracking-[0.5em] uppercase text-[20px] mb-4 block">
                      {t.gallery}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif italic text-[#EBE7D9] drop-shadow-lg">
                      Moments of the Journey
                    </h2>
                  </div>
                  
                  {/* 導覽箭頭 */}
                  <div className="hidden md:flex gap-4">
                    <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#2C3522] transition-all">‹</button>
                    <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#2C3522] transition-all">›</button>
                  </div>
                </div>

                {/* 4. 照片捲軸：移除任何負邊距 (-mx)，確保它被包在 px 內 */}
                <div 
                  ref={scrollRef}
                  className="flex overflow-x-auto gap-8 md:gap-12 pb-8 snap-x snap-mandatory scrollbar-hide"
                >
                  {tour.gallery.map((img: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      {...scrollScaleReveal}
                      // 這裡的 shadow 我幫你調整為「超大柔光」，配合深綠色背景
                      className="relative flex-shrink-0 h-[400px] md:h-[550px] w-auto min-w-[300px] rounded-[30px]  border border-white/10 cursor-zoom-in snap-center overflow-hidden group"
                      onClick={() => setCurrentImgIndex(idx)}
                    >
                      <img 
                        src={urlFor(img).url()} 
                        alt="Gallery" 
                        className="h-full w-auto object-cover md:object-contain bg-black/20 group-hover:scale-105 transition-transform duration-1000"
                      />
                    </motion.div>
                  ))}
                </div>

               <motion.div 
                  {...scrollScaleReveal}
                  className="max-w-4xl mx-auto px-6 pb-32 text-center" >
                     
                  <h3 className="font-serif text-4xl md:text-3xl text-white mb-10 italic">
                    {lang === 'fr' ? 'Chaque flânerie est une invitation à collectionner des souvenirs uniques. ?' : lang === 'en' ? 'Every stroll is an invitation to collect a unique memory within the ordinary.' : '每一次漫步，都是為了在日常中收藏一段獨有的記憶。'}
                  </h3>
                  <a href={`/${lang}/contact`} className="group relative inline-block w-full sm:w-auto px-16 py-5 overflow-hidden rounded-full border border-[#C85555] text-[#C85555] transition-all duration-700 shadow-sm hover:shadow-xl">
                    <span className="relative z-10 font-bold tracking-[0.4em] text-[20px] uppercase group-hover:text-[#4C4E36]">
                      {t.reserve}
                    </span>
                    <div className="absolute inset-0 z-0 bg-[#C85555] translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0" />
                  </a>
                </motion.div> 
               
              </div>

            </section>
          </>
        )}
       
        
        

        {/* Booking Terms 預約須知：滿版兩欄 + 獨立提醒卡片 */}
        {bookingTerms && (
          <>
          
            <section className="pt-12 pb-24">
              <span className="text-[#8C3B3B] font-bold tracking-[0.5em] uppercase text-[20px] mb-16 block">{t.practical}</span>
              
              {/* 🌟 上半部：預約流程與取消政策 (完美兩欄對齊) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16 mb-16">
                  <div>
                    <h3 className="font-serif text-[20px] font-bold text-[#2C3522] mb-8 border-b border-[#4C4E36]/10 pb-4">{t.process}</h3>
                    <div className="opacity-90">
                      <PortableText value={bookingTerms.process?.[lang] || []} components={tourComponents} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-[20px] font-bold text-[#2C3522] mb-8 border-b border-[#4C4E36]/10 pb-4">{t.cancel}</h3>
                    <div className="opacity-90">
                      <PortableText value={bookingTerms.cancellation?.[lang] || []} components={tourComponents} />
                    </div>
                  </div>
              </div>

              {/* 🌟 下半部：博物館提醒 (獨立滿版卡片設計) */}
              {bookingTerms.reminders && bookingTerms.reminders[lang] && (
                <motion.div 
                  {...scrollScaleReveal} 
                  className="bg-[#F8F6EF] p-8 md:p-12 rounded-[20px] border border-[#EBE7D9] relative overflow-hidden"
                >
                  {/* 卡片左側的法式裝飾線 */}
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-[#8C3B3B]/80" />
                  
                  <h3 className="font-serif text-[20px] font-bold text-[#8C3B3B] mb-6 flex items-center gap-3">
                    <span className="text-2xl opacity-80">💡</span> {t.reminders}
                  </h3>
                  <div className="opacity-90 text-[#4C4E36]">
                    <PortableText value={bookingTerms.reminders[lang]} components={tourComponents} />
                  </div>
                </motion.div>
              )}
            </section> 
              
                <motion.div 
                  {...scrollScaleReveal}
                  className="max-w-2xl mx-auto px-6 pb-32 text-center" >

                  
                  <h3 className="font-serif text-2xl md:text-3xl text-[#2C3522] mb-10 italic">
                    {lang === 'fr' ? 'Prêt pour l’aventure ?' : lang === 'en' ? 'Ready for the journey?' : '準備好開始這趟旅程了嗎？'}
                  </h3>
                  <a href={`/${lang}/contact`} className="group relative inline-block w-full sm:w-auto px-16 py-5 overflow-hidden rounded-full border border-[#C85555] text-[#1A1A1A] transition-all duration-700 shadow-sm hover:shadow-xl">
                    <span className="relative z-10 font-bold tracking-[0.4em] text-[20px] uppercase group-hover:text-white">
                      {t.reserve}
                    </span>
                    <div className="absolute inset-0 z-0 bg-[#C85555] translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0" />
                  </a>
                </motion.div>
             
          </>
        )}
      </div> 

      {/* 🌟 6. [最底層] 沉浸式電影感燈箱 (Cinema Lightbox) */}
      <AnimatePresence>
        {currentImgIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between py-10"
          >
            {/* 1. 頂部工具列 (關閉按鈕) */}
            <div className="absolute top-8 right-8 z-[110]">
              <button 
                onClick={() => setCurrentImgIndex(null)}
                className="text-white/50 hover:text-white text-4xl font-light transition-all hover:rotate-90"
              >
                ×
              </button>
            </div>

            {/* 2. 中央主圖區域 (含左右切換按鈕) */}
            <div className="relative w-full flex-grow flex items-center justify-center px-4 md:px-20">
              
              {/* 左切換 */}
              <button 
                className="hidden md:block absolute left-10 text-white/30 hover:text-white text-5xl transition-all"
                onClick={(e) => { e.stopPropagation(); setCurrentImgIndex((currentImgIndex - 1 + galleryImages.length) % galleryImages.length); }}
              >
                ‹
              </button>

              <motion.div 
                key={currentImgIndex} // 讓切換時有動畫
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="relative w-full h-full max-w-6xl"
                onClick={() => setCurrentImgIndex(null)} // 點擊主圖也可關閉
              >
                <Image 
                  src={urlFor(galleryImages[currentImgIndex]).url()} 
                  fill 
                  alt="Gallery Cinema" 
                  className="object-contain cursor-zoom-out" 
                  unoptimized={true} 
                />
              </motion.div>

              {/* 右切換 */}
              <button 
                className="hidden md:block absolute right-10 text-white/30 hover:text-white text-5xl transition-all"
                onClick={(e) => { e.stopPropagation(); setCurrentImgIndex((currentImgIndex + 1) % galleryImages.length); }}
              >
                ›
              </button>
            </div>

            {/* 3. 底部底片縮圖列 (Filmstrip) */}
            <div className="w-full max-w-4xl px-6 mt-6">
              <div className="flex justify-center gap-3 overflow-x-auto scrollbar-hide py-4">
                {galleryImages.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`relative flex-shrink-0 w-16 h-12 md:w-24 md:h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      idx === currentImgIndex 
                      ? 'ring-2 ring-[#8C3B3B] scale-110 opacity-100' 
                      : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <Image 
                      src={urlFor(img).url()} 
                      fill 
                      alt="Thumbnail" 
                      className="object-cover" 
                      unoptimized={true} 
                    />
                  </button>
                ))}
              </div>
              
              {/* 圖片計數器 */}
              <div className="text-center mt-2">
                <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase">
                  {currentImgIndex + 1} / {galleryImages.length}
                </span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
      

      

    </main>
  );
}
// 🌟 1. 讓老闆 (Page) 接住 Next.js 給的 params 和 searchParams
export default function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string, lang: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center text-[#202808] tracking-widest uppercase font-mono text-xs">Loading...</div>}>
      <TourDetailContent paramsPromise={params}  />
    </Suspense>
  )
}