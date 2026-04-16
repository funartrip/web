'use client'

import { useState, useEffect, Suspense, use } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/sanity/lib/client'

// 🌟 彈跳動畫
const fadeUp = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.2 }, 
  transition: { type: "spring", stiffness: 40, damping: 20, duration: 1.5 }
}as const;

function HomeContent({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = use(params) // 拆開它
  const lang = (resolvedParams?.lang || 'zh_tw').toLowerCase().replace('-', '_')

  const [featuredTours, setFeaturedTours] = useState<any[]>([])
  const [latestPortfolios, setLatestPortfolios] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const query = `{
        "tours": *[_type == "tour" && isFeatured == true] | order(_updatedAt desc)[0...3] {
          ...,
          "serviceTypeName": serviceType->name
        },
        "portfolios": *[_type == "portfolio" && isFeatured == true] | order(dateProject desc)[0...3] {
          ...
        }
      }`
      const res = await client.fetch(query)
      setFeaturedTours(res.tours || [])
      setLatestPortfolios(res.portfolios || [])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  const getLabel = (field: any, l: string) => {
    if (!field) return ''
    if (typeof field === 'string') return field
    return field[l] || field[l.replace('_', '-')] || field['zh_tw'] || Object.values(field).find(v => v) || ''
  }

  // 🌟 完整多語系字典
  const dict: any = {
    zh_tw: { 
      heroCursive: 'Fun ArTrip',
      heroTitlePrefix: '您的下一趟',
      heroTitleSuffix: '探險，從這裡開始',
      heroTitleCursive: '文化',
      heroSub: '由法國國家認證導遊與文化推廣員帶領，將藝術、歷史與遺產轉化為您親身經歷的故事。',
      featured: '精選參觀路線',
      featuredSub: '為您挑選最經典的法式感官之旅',
      aboutTitle: ['解說員', <br key="br" />,'楓梵'],
      aboutDesc: '我是法國持證解說員，透過專業的導覽與解說，讓法國的歷史與文化不再是遙遠的年份，而是觸手可及的故事。',
      transitionPhrase: '是解說員，也是讓文化生活化的文化轉譯員。',
      projectTitle: '專案報告與文化轉譯',
      projectSub: '解說之外的幕後研究與藝術實踐',
      viewAllTours: '所有路線',
      learnMore: '關於更多',
      viewAllProjects: '瀏覽專案',
      reserve: '預約旅程',
      explore: '探索路線 →',
      cardBackDetails: '路線詳情',
      connect: '預約旅程'
    },
    zh_cn: { 
      heroCursive: 'Fun ArTrip',
      heroTitlePrefix: '您的下一趟',
      heroTitleSuffix: '探险，从这里开始',
      heroTitleCursive: '文化',
      heroSub: '由法国国家认证导游与文化推广员带领，将艺术、历史与遗产转化为您亲身经历的故事。',
      featured: '精选参观路线',
      featuredSub: '为您挑选最经典的法式感官之旅',
      aboutTitle: ['解说员', <br key="br" />, '枫梵'],
      aboutDesc: '我是法国持证解说员，透过专业的导览与解说，让法国的历史与文化不再是遥远的年份，而是触手可及的故事。',
      transitionPhrase: '是解说员，也是让文化生活化的文化转译员。',
      projectTitle: '专案报告与文化转译',
      projectSub: '解说之外的幕后研究与艺术实践',
      viewAllTours: '所有路线',
      learnMore: '关于更多',
      viewAllProjects: '浏览专案',
      reserve: '预约旅程',
      explore: '探索路线 →',
      cardBackDetails: '路线详情',
      connect: '预约旅程'
    },
    en: { 
      heroCursive: 'Fun ArTrip',
      heroTitlePrefix: 'Your Next',
      heroTitleSuffix: 'Adventure Starts Here',
      heroTitleCursive: 'Cultural',
      heroSub: 'Led by licensed Guide-Conférencière Lee Feng-Fang, turning art and history into stories you\'ve experienced.',
      featured: 'Curated Tours',
      featuredSub: 'Handpicked classic French sensory journeys for you',
      aboutTitle: ['Your Guide', <br key="br" />, 'Feng-Fang'],
      aboutDesc: 'I am a certified French tour guide. Through professional interpretation, let French history no longer be distant dates, but palpable stories.',
      transitionPhrase: 'More than a guide, a cultural interpreter bringing culture to life.',
      projectTitle: 'Projects & Mediation',
      projectSub: 'Research & artistic practice behind the scenes',
      viewAllTours: 'All Tours',
      learnMore: 'Learn More',
      viewAllProjects: 'All Projects',
      reserve: 'Book Now',
      explore: 'Explore →',
      cardBackDetails: 'Tour Details',
      connect: 'Book Now'
    },
    fr: { 
      heroCursive: 'Fun ArTrip',
      heroTitlePrefix: 'Votre Prochaine Aventure',
      heroTitleSuffix: 'Commence Ici',
      heroTitleCursive: 'Culturelle',
      heroSub: 'Animée par une Guide-Conférencière agréée, transformant l\'art et l\'histoire en histoires que vous avez vraiment vécues.',
      featured: 'Parcours Phares',
      featuredSub: 'Une sélection de voyages sensoriels français classiques pour vous',
      aboutTitle: ['Votre Guide' , <br key="br" />, 'Feng-Fang'],
      aboutDesc: 'Je suis une guide-conférencière certifiée en France. Grâce à une interprétation professionnelle, l\'histoire de France ne sera plus des dates lointaines, mais des récits palpables.',
      transitionPhrase: 'Plus qu\'un guide, un médiateur culturel qui donne vie à la culture.',
      projectTitle: 'Projets & Médiation',
      projectSub: 'Recherche & pratique artistique en coulisses',
      viewAllTours: 'Toutes les visites',
      learnMore: 'En savoir plus',
      viewAllProjects: 'Tous les projets',
      reserve: 'Réserver',
      explore: 'Explorer →',
      cardBackDetails: 'Détails du Parcours',
      connect: 'Réserver'
    }
  }
  const t = dict[lang] || dict.zh_tw

  if (isLoading) {
    return <div className="min-h-screen bg-[#FDFBF5] flex items-center justify-center text-[#202808] tracking-widest uppercase font-mono text-xs animate-pulse">Loading ArTrip...</div>
  }

  return (
    <main className="min-h-screen bg-[#FDFBF5] overflow-x-hidden selection:bg-[#EAA624]/30">
      

      {/* 🌟 1. 滿版頁首：保留你喜歡的沉浸式電影感 */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#202808]">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-bg.jpg" // 背景大圖
            fill alt="ArTrip Hero" 
            sizes="100vw"
            className="object-cover scale-105 opacity-80" priority 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#202808]/60 via-[#202808]/20 to-[#FDFBF5]" />
        </div>

        <div className="relative z-10 text-center px-6 mt-16 flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }} className="mb-8">
            <span className="text-[#EAA624] text-4xl md:text-5xl font-cursive drop-shadow-md">
              {t.heroCursive}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ scale: 0.85, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-8xl font-playfair font-black text-white tracking-tight leading-normal drop-shadow-lg mb-10 max-w-5xl"
          >
            {t.heroTitlePrefix} <span className="text-[#FDFBF5] font-playfair font-black italic">{t.heroTitleCursive}</span><br />
            {t.heroTitleSuffix}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-white/90 text-base md:text-xl font-serif max-w-xl leading-relaxed drop-shadow-md"
          >
            {t.heroSub}
          </motion.p>
        </div>
      </section>

      {/* 🌟 2. 精選參觀路線：完美區分手機版與電腦版的 UX 體驗 */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div {...fadeUp} className="flex flex-col md:flex-row items-end justify-between mb-20 border-b border-[#202808]/10 pb-6 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#202808] tracking-tight">
              {t.featured}
            </h2>
            <p className="text-[#6A784D] text-lg font-serif italic mt-4">{t.featuredSub}</p>
          </div>
          <Link href={`/${lang}/tours`} className="text-[#C85555] font-bold uppercase tracking-widest text-sm hover:text-[#202808] transition-colors whitespace-nowrap">
            {t.viewAllTours} →
          </Link>
        </motion.div>
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {featuredTours.map((tour, idx) => (
            <motion.div key={tour._id || idx} {...fadeUp} transition={{ ...fadeUp.transition, delay: idx * 0.15 }} className="w-full">
              
              {/* 📱【手機版專屬設計】：直覺的靜態卡片，不翻轉、無懸停特效 */}
              <Link href={`/${lang}/tours/${tour.slug?.current}`} className="block lg:hidden w-full bg-white rounded-2xl shadow-sm border border-[#202808]/5 overflow-hidden">
                <div className="relative aspect-[4/3] w-full">
                  {tour.mainImage ? (
                    <Image src={urlFor(tour.mainImage).url()} alt="Tour" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#EBE8E0]" />
                  )}
                  {tour.locationTag && (
                    <span className="absolute top-4 left-4 bg-[#FDFBF5]/90 backdrop-blur-sm text-[#202808] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      📍 {tour.locationTag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <span className="text-[#EAA624] text-[10px] font-bold uppercase tracking-widest block mb-2">
                    {getLabel(tour.serviceTypeName, lang)}
                  </span>
                  <h3 className="text-2xl font-playfair font-bold text-[#202808] mb-3 leading-snug">
                    {getLabel(tour.title, lang)}
                  </h3>
                  <p className="text-[#6A784D] text-sm font-serif line-clamp-2 leading-relaxed mb-4">
                    {getLabel(tour.subtitle, lang)}
                  </p>
                  <span className="text-[#C85555] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    {t.explore}
                  </span>
                </div>
              </Link>

              {/* 💻【電腦版專屬設計】：高級黑金質感的 3D 翻轉卡片 */}
              {/* 1. 最外層包裝：加上透視深度 perspective */}
             <div className="hidden lg:block group [perspective:1000px] w-full aspect-[3/4] relative">
                {/* 🌟 1. 翻轉容器：加上 [transform-style:preserve-3d] 與 [transform:rotateY(180deg)] */}
                <div className="relative w-full h-full [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] transition-transform duration-1000 ease-in-out cursor-pointer shadow-xl">
                  
                  {/* 🌟 2. 正面：加上 [backface-visibility:hidden] */}
                  <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#EBE8E0]">
                    {tour.mainImage && (
                      <Image src={urlFor(tour.mainImage).url()} alt="Tour" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                    )}
                    <div className="absolute inset-4 border border-white/30 pointer-events-none rounded-lg" />
                    
                    {tour.locationTag && (
                      <span className="absolute top-6 left-6 bg-[#202808]/80 backdrop-blur-md text-[#FDFBF5] text-[10px] font-mono uppercase tracking-widest px-3 py-1">
                        {tour.locationTag}
                      </span>
                    )}
                  </div>

                  {/* 🌟 3. 背面：加上 [transform:rotateY(180deg)] 與 [backface-visibility:hidden] */}
                  <div className="absolute inset-0 w-full h-full bg-[#202808] [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center items-center text-center p-8 border border-white/10 shadow-inner">
                      {/* 內圈優雅金線 */}
                      <div className="absolute inset-3 border border-[#EAA624]/20 pointer-events-none" />
                      
                      <span className="text-[#EAA624] text-[10px] font-mono uppercase tracking-widest block mb-4">
                        {getLabel(tour.serviceTypeName, lang)}
                      </span>
                      <h3 className="text-3xl font-playfair font-bold text-[#FDFBF5] leading-snug mb-6 line-clamp-3 px-4">
                        {getLabel(tour.title, lang)}
                      </h3>
                      <p className="text-[#FDFBF5]/60 text-sm font-serif line-clamp-3 leading-relaxed mb-10 px-2">
                        {getLabel(tour.subtitle, lang)}
                      </p>
                      
                      <Link href={`/${lang}/tours/${tour.slug?.current}`} className="relative group/btn overflow-hidden border border-[#EAA624] px-8 py-3">
                        <span className="relative z-10 text-[#EAA624] group-hover/btn:text-[#202808] font-bold uppercase tracking-widest text-xs transition-colors duration-300">
                          {t.explore}
                        </span>
                        <div className="absolute inset-0 bg-[#EAA624] translate-y-full transition-transform duration-300 group-hover/btn:translate-y-0" />
                      </Link>
                  </div>
                </div>
              </div>
             

            </motion.div>
            
          ))}
        </div>
        <motion.div {...fadeUp} className="mt-32 mb-8 max-w-4xl mx-auto text-center relative z-10">
          <div className="w-8 h-8 mx-auto mb-10 bg-[#EAA624] rotate-45 opacity-80" />
          
          <h2 className="text-2xl md:text-4xl font-playfair font-bold text-[#202808] mb-12">
            {lang === 'fr' ? 'Prêt pour l’aventure ?' : lang === 'en' ? 'Ready for the journey?' : '準備好開始這趟旅程了嗎？'}
          </h2>

          <Link href={`/${lang}/contact`} className="group relative inline-block overflow-hidden rounded-full border border-[#202808] text-[#202808] transition-all duration-700 shadow-sm hover:shadow-xl hover:border-[#C85555]">
            <div className="px-16 py-5 relative z-10 flex items-center justify-center">
              <span className="font-bold tracking-[0.4em] text-[20px] uppercase group-hover:text-white transition-colors duration-500">
                {t.connect}
              </span>
            </div>
            <div className="absolute inset-0 z-0 bg-[#C85555] translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0" />
          </Link>
        </motion.div>
      </section>

      {/* 🌟 3. 關於我：法式交疊排版 (French Editorial Overlap) */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-[#FDFBF5] to-[#EBE8E0]/40">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center relative z-10">
          
          {/* 左側：大型優雅相片 */}
          <motion.div {...fadeUp} className="w-full lg:w-3/5 relative z-10">
            <div className="relative aspect-[4/5] md:aspect-[16/11] w-full overflow-hidden shadow-2xl">
              <Image src="/profile.jpg" alt="Lee Feng-Fang" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            {/* 裝飾文字 */}
            <div className="absolute -bottom-6 -left-4 md:-left-12 text-[#EAA624] font-playfair font-black text-6xl md:text-8xl opacity-40 select-none pointer-events-none">
              GUIDE
            </div>
          </motion.div>

          {/* 右側：浮動的文字方塊 (重疊在相片上) */}
          <motion.div {...fadeUp} className="w-full lg:w-2/5 relative z-20 mt-[-10%] lg:mt-0 lg:-ml-24">
            <div className="bg-[#FDFBF5]/95 backdrop-blur-xl p-8 md:p-12 shadow-[0_20px_50px_rgba(32,40,8,0.08)] border border-white">
              <div className="w-12 h-[1px] bg-[#C85555] mb-8" />
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#202808] leading-tight mb-8">
                {t.aboutTitle}
              </h2>
              <p className="text-[#6A784D] font-serif text-lg leading-relaxed mb-10">
                {t.aboutDesc}
              </p>
              <Link href={`/${lang}/about`} className="inline-flex items-center gap-4 text-sm font-bold text-[#202808] tracking-widest uppercase group">
                <span className="pb-1 border-b border-[#202808] group-hover:text-[#C85555] group-hover:border-[#C85555] transition-colors">
                  {t.learnMore}
                </span>
                <span className="text-[#C85555] transform group-hover:translate-x-2 transition-transform">→</span>
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 🌟 4. 高潮轉折：經典深邃 */}
      <section className="w-full bg-[#202808] py-32 px-6 my-24 text-center">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto">
           <h2 className="text-xl md:text-3xl lg:text-6xl font-playfair font-bold text-[#FDFBF5] leading-snug tracking-wide italic">
             " {t.transitionPhrase} "
           </h2>
           <div className="w-16 h-[2px] bg-[#EAA624] mx-auto mt-12" />
        </motion.div>
      </section>

      {/* 🌟 5. 專案報告：解決手機 UX，僅在電腦版啟動黑白特效 */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <motion.div {...fadeUp} className="flex flex-col md:flex-row items-end justify-between mb-24 border-b border-[#202808]/10 pb-8 gap-4">
          <div>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-[#202808] tracking-tight">
              {t.projectTitle}
            </h2>
            <p className="text-[#6A784D] text-lg font-serif italic mt-4">{t.projectSub}</p>
          </div>
          <Link href={`/${lang}/portfolios`} className="text-[#C85555] font-bold uppercase tracking-widest text-sm hover:text-[#202808] transition-colors whitespace-nowrap">
            {t.viewAllProjects} →
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {latestPortfolios.map((project, idx) => (
            <motion.div 
              key={project._id || idx} 
              {...fadeUp} 
              transition={{ ...fadeUp.transition, delay: idx * 0.2 }}
              className={`group block ${idx === 1 ? 'md:-mt-16' : 'md:mt-8'}`}
            >
              <Link href={`/${lang}/portfolios/${project.slug?.current}`}className="block">
                <div className="p-4 md:p-5 border border-[#33432B]/10 bg-[#FDFBF5] lg:hover:border-[#202808] transition-all duration-500 group shadow-sm lg:hover:shadow-2xl lg:hover:scale-[1.02]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden mb-5">
                    {project.projectCover ? (
                      // 📱 UX 關鍵：使用 lg:grayscale 讓手機版預設就是彩色，不需點擊才能看見顏色！
                      <Image src={urlFor(project.projectCover).url()} alt="Project" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover lg:grayscale lg:group-hover:grayscale-0 transition-all duration-700 lg:group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-[#EBE8E0]" />
                    )}
                  </div>
                  <div className="text-center pb-2">
                    <span className="text-[10px] font-mono text-[#8C9A76] lg:group-hover:text-[#EAA624] uppercase tracking-widest block mb-2 transition-colors">
                       {getLabel(project.highlight, lang) || 'Study'}
                    </span>
                    <h3 className="text-xl font-playfair font-bold text-[#202808] line-clamp-2 leading-snug px-2">
                      {getLabel(project.displayTitle, lang)}
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🌟 6. 結尾：經典聯絡 (Classic CTA) */}
      <section className="bg-[#FDFBF5] py-40 px-6 border-t border-[#202808]/10 mt-10">
        <motion.div {...fadeUp} className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-8 h-8 mx-auto mb-10 bg-[#EAA624] rotate-45 opacity-80" />
          
          <h2 className="text-4xl md:text-6xl font-playfair font-bold text-[#202808] mb-12">
            {lang === 'fr' ? 'Hâte de vous accompagner pour explorer les secrets de notre patrimoine.' : lang === 'en' ? 'Looking forward to exploring the hidden details of our heritage with you.' : '期待與您一同漫步，發掘隱藏在遺產中的細節。'}
          </h2>

          <Link href={`/${lang}/contact`} className="group relative inline-block overflow-hidden rounded-full border border-[#202808] text-[#202808] transition-all duration-700 shadow-sm hover:shadow-xl hover:border-[#C85555]">
            <div className="px-16 py-5 relative z-10 flex items-center justify-center">
              <span className="font-bold tracking-[0.4em] text-[20px] uppercase group-hover:text-white transition-colors duration-500">
                {t.connect}
              </span>
            </div>
            <div className="absolute inset-0 z-0 bg-[#C85555] translate-y-full transition-transform duration-500 ease-[0.16, 1, 0.3, 1] group-hover:translate-y-0" />
          </Link>
        </motion.div>
      </section>

    </main>
  )
}
export default function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  return (
    <Suspense fallback={<div className="h-screen bg-[#FDFBF5] flex items-center justify-center text-[#202808] tracking-widest uppercase font-mono text-xs">Loading ArTrip...</div>}>
      {/* 🌟 將 params 確實傳遞下去 */}
      <HomeContent params={params} />
    </Suspense>
  )
}