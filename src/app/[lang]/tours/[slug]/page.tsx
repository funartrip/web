'use client'

import { client, urlFor } from '@/sanity/lib/client'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { notFound, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, use, useRef, Suspense } from 'react'

// --- 🌟 旗艦動畫與組件 ---

const scrollScaleReveal = {
  initial: { opacity: 0, scale: 0.95, y: 30 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: false, amount: 0.1 },
  transition: { type: "spring", stiffness: 50, damping: 25, duration: 1.2 }
} as const;

const CustomDivider = () => (
  <motion.div 
    {...scrollScaleReveal}
    className="flex items-center justify-center gap-6 my-24 max-w-xl mx-auto"
  />
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
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentImgIndex, setCurrentImgIndex] = useState<number | null>(null);
  const galleryImages = tour?.gallery || []; 

  const scrollRef = useRef<HTMLDivElement>(null);

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
        "priceTemplate": priceTemplate->{baseCapacity, basePrice, extraPersonFee, maxCapacity, displayMode},
        "serviceType": serviceType->name,
        "suitableAudience": suitableAudience[]->name,
        "interest": interest[]->name,
        "duration": tourDuration->name,
        "notices": notices[]->{
          name,
          content
        },
        "priceNotes": priceNotes[]->{name, content},
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
      setIsLoading(false); 
    });
  }, [resolvedParams.slug]);

  const getLabel = (field: any, lang: string) => {
    if (!field) return ''; 
    if (typeof field === 'string') return field; 
    return field[lang] || field['zh_tw'] || Object.values(field).find(v => v) || '';
  };

  if (!isLoading && !tour) {
    notFound(); 
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#FDFBF5] text-[#4C4E36] tracking-[0.3em] font-serif uppercase text-xs">
        Unveiling the Journey...
      </div>
    );
  }

  const dict: any = {
    zh_tw: { highlights: '導覽亮點', itinerary: '詳細內容與行程', gallery: '旅途瞬間', practical: '預約須知', duration: '解說時長', reserve: '立即諮詢預約', process: '01. 預約流程', cancel: '02. 改期與取消', reminders: '03. 博物館提醒', quote: '服務報價', overTen: '超過限制人數？歡迎與我聯繫諮詢細節。', extraPerson: '超過基礎人數，每增加一人', maxCap: '最大接待人數', priceOnRequest: '費用請諮詢 (Tarif sur demande)', privateQuoteDesc: '此行程專為同業同盟夥伴、旅行社或客製化商務團體設計。費率不對外公開，歡迎點擊下方按鈕索取同業專屬合作報價。', railwayQuoteDesc: '此行程為高端客製化鐵道旅程。費用將依據最終規劃之半日遊或一日遊路線、火車艙等與特殊體驗彈性調整，歡迎點擊下方按鈕與我聯繫，共同規劃您的專屬鐵道足跡。' },
    zh_cn: { highlights: '导览亮点', itinerary: '详细内容与行程', gallery: '旅途瞬间', practical: '预约须知', duration: '解说时长', reserve: '立即咨询预约', process: '01. 预约流程', cancel: '02. 改期与取消', reminders: '03. 博物馆提醒', quote: '服务报价', overTen: '超过限制人数？欢迎与我联系咨询细节。', extraPerson: '超过基础人数，每增加一人', maxCap: '最大接待人数', priceOnRequest: '费用请咨询 (Tarif sur demande)', privateQuoteDesc: '此行程专为同业同盟伙伴、旅行社或客製化商务团体设计。费率不对外公开，欢迎点击下方按钮索取同业专属合作报价。', railwayQuoteDesc: '此行程为高端客製化铁道旅程。费用将依据最终规划之半日游或一日游路线、火车舱等与特殊体验弹性調整，欢迎点击下方按钮與我联系，共同规划您的专属铁道足迹。' },
    fr: { highlights: 'Points Forts', itinerary: 'Détails & Programme', gallery: 'Galerie', practical: 'Infos Pratiques', duration: 'Durée de la visite', reserve: 'Réserver & Contact', process: '01. Réservation', cancel: '02. Annulation', reminders: '03. Rappels Musée', quote: 'Tarifs', overTen: 'Plus de pers. ? Me contacter pour les détails.', extraPerson: 'Par personne supplémentaire', maxCap: 'Capacité maximale', priceOnRequest: 'Tarif sur demande', privateQuoteDesc: 'Ce parcours est optimisé pour les agences de voyages et partenaires professionnels. Les tarifs sont confidentiels. Veuillez nous contacter pour obtenir un devis personnalisé.', railwayQuoteDesc: 'Ce voyage ferroviaire est entièrement sur mesure. Le tarif varie selon la formule choisie (demi-journée ou journée complète), les classes de train et les prestations. Contactez-nous pour co-créer votre itinéraire.' },
    en: { highlights: 'Highlights', itinerary: 'Details & Itinerary', gallery: 'Gallery', practical: 'Practicalities', duration:'Duration', reserve: 'Reserve Now', process: '01. Booking', cancel: '02. Cancellation', reminders:'03. Museum Reminders', quote: 'Service Quote', overTen: 'More people? Get in touch to discuss.', extraPerson:('Per extra person'), maxCap:'Max capacity', priceOnRequest: 'Rate on request', privateQuoteDesc: 'This tour is specially tailored for travel agencies and corporate partners. Rates are highly confidential. Please contact us below to receive our exclusive B2B tariff sheet.', railwayQuoteDesc: 'This premium rail journey is fully tailor-made. Rates depend entirely on your final preference (half-day or full-day excursion), train cabin classes, and curated experiences. Please get in touch to discuss your bespoke itinerary.' },
  };
  const t = dict[lang] || dict.zh_tw;

 // [富文本渲染樣式區 (Component Styles)]
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
    list: {
      bullet: ({ children }: any) => (
        <ul className="mb-8 mt-2 flex flex-col space-y-3">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="mb-8 mt-2 flex flex-col space-y-3">{children}</ol>
      ),
    },
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

  // 🌟 注意事項 (Bon à savoir) 專屬的富文本樣式包
  // 🌟 重新設計：無障礙高對比度注意事項 (Notice) 富文本樣式包
  const noticeComponents = {
    block: {
      normal: ({ children }: any) => (
        /* 🌟 核心優化：移除 opacity-90，字體改為 font-sans 並放大到 text-base md:text-lg，顏色鎖定最深綠 */
        <p className="mb-4 leading-relaxed text-base md:text-lg font-sans text-brand-green text-justify">
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="mb-6 mt-2 flex flex-col space-y-3">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="mb-6 mt-2 flex flex-col space-y-3">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        /* 🌟 核心優化：加深列表字體與清除透明度 */
        <li className="relative pl-6 text-brand-green text-base md:text-lg list-none font-sans text-justify">
          {/* 加深清單小圓點為顯眼的引導紅 */}
          <span className="absolute left-0 top-[10px] w-1.5 h-1.5 rounded-full bg-brand-red"></span>
          {children}
        </li>
      ),
      number: ({ children }: any) => (
        <li className="list-decimal ml-6 text-brand-green text-base md:text-lg font-sans text-justify">
          {children}
        </li>
      )
    },
    marks: {
      strong: ({ children }: any) => (
        /* 🌟 核心優化：強烈建議對強烈字元（如交通費用）給予高對比的磚紅微光底襯，讓重點一目了然 */
        <strong className="font-bold text-brand-red bg-brand-red/5 px-1.5 py-0.5 rounded">{children}</strong>
      ),
      em: ({ children }: any) => (
        <em className="italic text-brand-green font-bold">{children}</em>
      )
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF5] selection:bg-[#8C3B3B]/10 overflow-x-hidden relative">
      
      {/* 🌟 1. 沉浸式首圖 */}
      <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
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
            className="bg-white/5 rounded-[40px] inline-block px-16 py-16 backdrop-blur-[6px] border-none"
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
        
        {/* 🌟 修正點 2：完美撈回並補齊遺失的左側內容區 (lg:col-span-8) */}
        <div className="lg:col-span-8">
          
          {/* A. 導覽路線 */}
          {tour.routeSteps && tour.routeSteps.length > 0 && (
            <section className="mb-16">
              <span className="text-[#8C3B3B] font-bold tracking-[0.5em] uppercase text-[20px] mb-6 block">
                {lang === 'fr' ? 'Le parcours' : lang === 'en' ? 'Route' : '導覽路線'}
              </span>
              
              <div className="relative flex items-start overflow-x-auto snap-x snap-mandatory scrollbar-hide py-4 -mx-6 px-6 md:mx-0 md:px-0">
                {tour.routeSteps
                  .filter((step: any) => step !== null && step.name)
                  .map((step: any, idx: number, arr: any[]) => (
                  <motion.div 
                    key={idx}
                    {...scrollScaleReveal}
                    className="relative z-10 flex-shrink-0 w-36 md:w-48 snap-start flex flex-col items-center group cursor-default"
                  >
                    {idx !== arr.length - 1 && (
                      <div className="absolute top-[13px] left-[50%] w-full flex items-center z-0 -translate-y-1/2">
                        <div className="h-[1px] bg-[#4C4E36]/30 flex-grow" />
                        <svg className="w-3 h-3 text-[#4C4E36]/30 fill-current mr-6" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    <div className="relative z-10 w-2.5 h-2.5 bg-[#4C4E36] rounded-full ring-[8px] ring-[#FDFBF5] group-hover:scale-125 group-hover:bg-[#8C3B3B] transition-all duration-300 mt-2 mb-6" />
                    <h4 className="text-sm md:text-base font-serif font-bold text-[#2C3522] text-center px-2 leading-tight group-hover:text-[#8C3B3B] transition-colors">
                      {getLabel(step.name, lang)}
                    </h4>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* B. 導覽亮點 */}
          <section className="mb-12">
            <span className="text-[#8C3B3B] font-bold tracking-[0.5em] uppercase text-[20px] mb-8 block">{t.highlights}</span>
            <PortableText value={getLabel(tour.summary, lang)} components={tourComponents} />
          </section>

          <div className="w-full border-b border-dashed border-[#4C4E36]/20 mb-12" />

          {/* C. 路線詳情 */}
          <article>
            <span className="text-[#8C3B3B] font-bold tracking-[0.5em] uppercase text-[20px] mb-8 block">{t.itinerary}</span>
            <PortableText value={tour.content?.[lang] || []} components={tourComponents} />
          </article>
          
        </div>

        {/* 🌟 右側：無障礙友善（大字體、高對比、排版大優化）精緻資訊欄 */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            <motion.div 
              {...scrollScaleReveal} 
              className="bg-white p-8 md:p-10 rounded-card-xl shadow-[0_20px_60px_-20px_rgba(44,53,34,0.08)] border border-brand-gray relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-green" />
              
              <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-5 border-b border-brand-gray/60">
                <span className="text-base font-sans font-bold tracking-wider text-brand-green bg-brand-gray/60 px-4 py-2 rounded-card-sm uppercase">
                  {getLabel(tour.serviceType, lang)}
                </span>
                <div className="flex flex-wrap gap-2">
                  {tour.language?.map((l: string) => {
                    const displayLang = l === '中文' ? '中文 Mandarin' : l;
                    return (
                      <span 
                        key={l} 
                        className="text-sm font-sans font-bold border border-brand-gray-dark text-brand-green uppercase tracking-wide px-3 py-1.5 rounded-card-sm bg-brand-cream"
                      >
                        {displayLang}
                      </span>
                    );
                  })}
                </div>
              </div>

              {(tour.suitableAudience?.length > 0 || tour.interest) && (
                <div className="mb-8 pb-6 border-b border-brand-gray/60 space-y-8">
                  {/* 適合對象 */}
                  {tour.suitableAudience?.length > 0 && (
                    <div>
                      <span className="text-xl font-sans font-bold tracking-wide text-brand-green block mb-4">
                        // {lang === 'fr' ? 'Pour qui' : lang === 'en' ? 'Perfect for' : '適合對象'}
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {tour.suitableAudience.map((item: any, idx: number) => (
                          <span key={idx} className="bg-brand-cream text-brand-green px-4 py-2.5 rounded-full text-base font-sans font-bold tracking-wide border border-brand-gray-dark shadow-sm">
                            {getLabel(item, lang)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 特別推薦 */}
                  {tour.interest && tour.interest.length > 0 && (
                    <div>
                      <span className="text-xl font-sans font-bold tracking-wide text-brand-green block mb-4">
                        // {lang === 'fr' ? 'Thèmes' : lang === 'en' ? 'Themes' : '特別推薦'}
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {tour.interest.map((item: any, idx: number) => (
                          <span 
                            key={idx} 
                            className="bg-brand-red/5 text-brand-red px-4 py-2.5 rounded-full text-base font-sans font-bold tracking-wide border border-brand-red/20 shadow-sm"
                          >
                            # {getLabel(item, lang)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-8 mb-8 text-brand-green">
                {/* 導覽解說時長 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1 border-b border-dashed border-brand-gray-dark pb-5">
                  <span className="text-xl font-sans font-bold text-brand-green tracking-wide">// {t.duration}</span>
                  <span className="text-lg font-sans font-bold text-brand-green bg-brand-gray/50 px-4 py-2 rounded-card-md border border-brand-gray">
                    {getLabel(tour.duration, lang)}
                  </span>
                </div>

                {/* 服務報價 */}
                <div>
                  <span className="text-xl font-sans font-bold text-brand-green tracking-wide block mb-4">
                    // {t.quote}
                  </span>
               
                  <div className="space-y-4">
                    {tour.priceTemplate?.displayMode === 'b2b' ? (
                      <div className="space-y-3">
                        <div className="text-2xl font-serif font-bold text-brand-red tracking-wide">
                          {t.priceOnRequest}
                        </div>
                        <p className="text-base font-sans text-brand-green bg-brand-cream p-5 rounded-card-md border border-brand-gray-dark leading-relaxed text-justify">
                          {t.privateQuoteDesc}
                        </p>
                      </div>
                    ) : tour.priceTemplate?.displayMode === 'railway-custom' ? (
                      <div className="space-y-3">
                        <div className="text-2xl font-serif font-bold text-brand-red tracking-wide">
                          {t.priceOnRequest}
                        </div>
                        <p className="text-base font-sans text-brand-green bg-brand-cream p-5 rounded-card-md border border-brand-gray-dark leading-relaxed text-justify">
                          {t.railwayQuoteDesc}
                        </p>
                      </div>
                    ) : tour.priceTemplate?.basePrice ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center py-2 border-b border-brand-gray/40">
                          <span className="text-xl font-bold font-serif text-brand-green">
                            1 - {tour.priceTemplate.baseCapacity || 6} {lang === 'fr' ? 'pers.' : lang === 'en' ? 'people' : '人'}
                          </span>
                          <span className="text-brand-green font-extrabold text-3xl">€{tour.priceTemplate.basePrice}</span>
                        </div>
                        {tour.priceTemplate.extraPersonFee ? (
                          <div className="flex justify-between items-center py-1 text-brand-green text-base font-bold">
                            <span>+ {t.extraPerson}</span>
                            <span className="text-lg text-brand-red">+€{tour.priceTemplate.extraPersonFee}</span>
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <div className="text-sm text-brand-gray-dark font-bold italic py-2">
                        報價建置中...
                      </div>
                    )}

                    {/* 最大人數限制解耦顯示 */}
                    {tour.priceTemplate?.maxCapacity && (
                      <div className="text-left text-base font-sans font-bold text-brand-red mt-2 tracking-wide bg-brand-red/5 px-4 py-2 rounded-card-sm inline-block">
                        {t.maxCap} : {tour.priceTemplate.maxCapacity} {lang === 'fr' ? 'pers.' : lang === 'en' ? 'pax' : '人'}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <motion.p 
                {...scrollScaleReveal}
                className="mt-8 mb-8 text-center text-sm font-bold text-brand-olive font-serif tracking-wide block"
              >
                —— {t.overTen} ——
              </motion.p>

              <a 
                href={`/${lang}/contact`}
                className="group relative block w-full text-center py-5 bg-brand-terracotta hover:bg-brand-red text-white rounded-full font-sans font-bold tracking-[0.2em] text-lg transition-all duration-300 shadow-md hover:shadow-xl active:scale-95"
              >
                {t.reserve}
              </a>
            </motion.div>

            {/* 💡 底部精選 bon à savoir */}
            {tour.notices && tour.notices.length > 0 && (
              <motion.div {...scrollScaleReveal} className="bg-[#F4F1E1] p-8 rounded-card-xl text-brand-red shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] border border-brand-gray relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">💡</div>
                <h4 className="font-bold tracking-[0.3em] text-[18px] uppercase mb-6 opacity-60">Bon à savoir</h4>
                <div className="text-base font-serif leading-relaxed text-brand-olive space-y-6">
                  {tour.notices.map((notice: any, idx: number) => (
                    <div key={idx}>
                      <PortableText value={getLabel(notice.content, lang)} components={noticeComponents} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
        
      {/* 🌟 滿版底層區塊：Gallery 相簿 & Booking Terms 預約須知 */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        
        {/* Gallery 相簿 */}
        {tour.gallery && tour.gallery.length > 0 && (
          <>
            <CustomDivider />
            <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-24 bg-[#4C4E36] overflow-hidden">
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[600px] bg-white/10 blur-[150px] pointer-events-none z-0" />
              <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:px-20">
                <div className="mb-12 flex justify-between items-end">
                  <div>
                    <span className="text-[#8C9A76] font-bold tracking-[0.5em] uppercase text-[20px] mb-4 block">
                      {t.gallery}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif italic text-[#EBE7D9] drop-shadow-lg">
                      Moments of the Journey
                    </h2>
                  </div>
                  <div className="hidden md:flex gap-4">
                    <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#2C3522] transition-all">‹</button>
                    <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#2C3522] transition-all">›</button>
                  </div>
                </div>

                <div 
                  ref={scrollRef}
                  className="flex overflow-x-auto gap-8 md:gap-12 pb-8 snap-x snap-mandatory scrollbar-hide"
                >
                  {tour.gallery.map((img: any, idx: number) => (
                    <motion.div 
                      key={idx}
                      {...scrollScaleReveal}
                      className="relative flex-shrink-0 h-[400px] md:h-[550px] w-auto min-w-[300px] rounded-[30px] border border-white/10 cursor-zoom-in snap-center overflow-hidden group"
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
       
        {/* Booking Terms 預約須知 */}
        {bookingTerms && (
          <>
            <section className="pt-12 pb-24">
              <span className="text-[#8C3B3B] font-bold tracking-[0.5em] uppercase text-[20px] mb-16 block">{t.practical}</span>
              
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

              {/* 價格與行程提醒重要須知模組 */}
              {tour.priceNotes && tour.priceNotes.length > 0 && (
                <motion.div 
                  {...scrollScaleReveal} 
                  className="bg-[#F8F6EF] p-8 md:p-12 rounded-[20px] border border-[#EBE7D9] relative overflow-hidden"
                >
                  <div className="absolute left-0 top-0 w-1.5 h-full bg-[#8C3B3B]/80" />
                  
                  <h3 className="font-serif text-[20px] font-bold text-[#8C3B3B] mb-6 flex items-center gap-3">
                    <span className="text-2xl opacity-80">💡</span> 
                    {lang === 'fr' ? 'Notes importantes & Rappels' : lang === 'en' ? 'Important Notes & Reminders' : '行程重要須知與提醒'}
                  </h3>
                  
                  <div className="text-brand-green space-y-6">
                    {tour.priceNotes.map((note: any, idx: number) => (
                      <div key={idx} className={idx > 0 ? "pt-6 border-t border-[#EBE7D9]/60" : ""}>
                        <PortableText value={getLabel(note.content, lang)} components={noticeComponents} />
                      </div>
                    ))}
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
            <div className="absolute top-8 right-8 z-[110]">
              <button 
                onClick={() => setCurrentImgIndex(null)}
                className="text-white/50 hover:text-white text-4xl font-light transition-all hover:rotate-90"
              >
                ×
              </button>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center px-4 md:px-20">
              <button 
                className="hidden md:block absolute left-10 text-white/30 hover:text-white text-5xl transition-all"
                onClick={(e) => { e.stopPropagation(); setCurrentImgIndex((currentImgIndex - 1 + galleryImages.length) % galleryImages.length); }}
              >
                ‹
              </button>

              <motion.div 
                key={currentImgIndex} 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="relative w-full h-full max-w-6xl"
                onClick={() => setCurrentImgIndex(null)}
              >
                <Image 
                  src={urlFor(galleryImages[currentImgIndex]).url()} 
                  fill 
                  alt="Gallery Cinema" 
                  className="object-contain cursor-zoom-out" 
                  unoptimized={true} 
                />
              </motion.div>

              <button 
                className="hidden md:block absolute right-10 text-white/30 hover:text-white text-5xl transition-all"
                onClick={(e) => { e.stopPropagation(); setCurrentImgIndex((currentImgIndex + 1) % galleryImages.length); }}
              >
                ›
              </button>
            </div>

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

export default function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string, lang: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center text-[#202808] tracking-widest uppercase font-mono text-xs">Loading...</div>}>
      <TourDetailContent paramsPromise={params} />
    </Suspense>
  )
}