// src/app/not-found.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation' // 🌟 引入用來抓取語系的 Hook

function NotFoundContent() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') || 'zh_tw').toLowerCase().replace('-', '_')

  // 🌟 404 專屬多語系字典
  const t: any = {
    zh_tw: {
      tag: 'Error // Signal Lost',
      title: '這份檔案似乎不存在...',
      desc: '你所尋找的旅行日誌或頁面，可能已經被移除了，或是網址拼寫有誤。別擔心，探險中迷路是常有的事。',
      back: '← 返回安全營地 (首頁)'
    },
    zh_cn: {
      tag: 'Error // Signal Lost',
      title: '这份档案似乎不存在...',
      desc: '你所寻找的旅行日志或页面，可能已经被移除了，或是网址拼写有误。别担心，探险中迷路是常有的事。',
      back: '← 返回安全营地 (首页)'
    },
    fr: {
      tag: 'Erreur // Signal Perdu',
      title: 'Ce document semble introuvable...',
      desc: "Le journal de voyage ou la page que vous cherchez a peut-être été supprimé, ou l'URL est incorrecte. Pas d'inquiétude, se perdre fait partie de l'exploration.",
      back: '← Retour au camp de base (Accueil)'
    },
    en: {
      tag: 'Error // Signal Lost',
      title: 'This file seems to be missing...',
      desc: "The travel log or page you are looking for may have been removed, or the URL is incorrect. Don't worry, getting lost is part of the exploration.",
      back: '← Back to Base Camp (Home)'
    }
  }

  const dict = t[lang] || t.zh_tw

  return (
    <main className="min-h-screen bg-[#223843] flex flex-col font-sans selection:bg-[#D87348] selection:text-[#F2E3C6] overflow-hidden">
      {/* 🌟 Navbar 自動套用當前語系 */}
      <Navbar lang={lang} />

      {/* 🌟 404 視覺主體 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative z-10 pt-20">
        
        {/* 背景裝飾大字 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute text-[20vw] font-serif font-black text-[#F2E3C6]/5 select-none pointer-events-none"
        >
          404
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10"
        >
          <div className="w-16 h-16 border-4 border-[#D87348] border-t-transparent rounded-full animate-spin mx-auto mb-8" />
          
          <span className="text-[#AADCF2] font-mono tracking-[0.4em] uppercase text-xs font-bold block mb-4 border border-[#AADCF2]/30 bg-[#AADCF2]/10 px-4 py-1.5 rounded-full inline-block">
            {dict.tag}
          </span>
          
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#F2E3C6] mb-6 drop-shadow-lg">
            {dict.title}
          </h1>
          
          <p className="text-[#819A78] text-lg font-serif italic max-w-md mx-auto leading-relaxed mb-12">
            {dict.desc}
          </p>

          {/* 🌟 返回按鈕：點擊後依然保留當前的語系參數 */}
          <Link href={`/?lang=${lang}`}>
            <motion.button 
              whileHover={{ y: -5 }} 
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-[#D87348] text-[#223843] rounded-full font-serif font-bold tracking-widest shadow-[0_10px_20px_rgba(0,0,0,0.2),_inset_0_2px_5px_rgba(255,255,255,0.4)] hover:shadow-[0_15px_25px_rgba(216,115,72,0.4)] transition-all flex items-center justify-center mx-auto gap-3"
            >
              {dict.back}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#223843]" />}>
      <NotFoundContent />
    </Suspense>
  )
}