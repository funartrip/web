'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function ContactPage() {
  const searchParams = useSearchParams()
  const lang = (searchParams.get('lang') || 'zh_tw').toLowerCase().replace('-', '_')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const t: any = {
    zh_tw: {
      tag: 'Contact // ArTrip',
      title: '🕊️ 發送電鴿',
      subtitle: '請選擇您的需求並填寫這份探索申請單。無論是行程規劃、合作提案，或是單純的交流，我都非常期待收到您的訊息。',
      promise: '我會在信鴿抵達後的 1-2 個工作天內回覆您。',
      name: '您的姓名',
      email: '聯絡信箱',
      category: '事由分類',
      message: '詳細內容',
      selectCat: '請選擇事由...',
      categories: {
        tour: '預約解說',
        collab: '商量合作',
        plan: '行程規劃',
        custom: '訂製參觀解說',
        other: '其他'
      },
      submit: '寄出 →',
      submitting: '信鴿飛翔中...',
      successTitle: '信鴿已成功抵達',
      successMsg: '請留意您的信箱，系統已自動發送一封確認信給您。我會盡快與您聯繫！',
      sendAnother: '要發送別的電子信鴿嗎？',
    },
    zh_cn: {
      tag: 'Contact // ArTrip',
      title: '🕊️ 发送电鸽',
      subtitle: '请选择您的需求并填写这份探索申请单。无论是行程规划、合作提案，或是单纯的交流，我都非常期待收到您的飞鸽传书。',
      promise: '我会在信鸽抵达后的 1-2 个工作天内回复您。',
      name: '您的姓名',
      email: '联系邮箱',
      category: '事由分类',
      message: '详细内容',
      selectCat: '请选择事由...',
      categories: {
        tour: '预约解说',
        collab: '商量合作',
        plan: '行程规划',
        custom: '定制参观解说',
        other: '其他'
      },
      submit: '寄出 →',
      submitting: '信鸽飞翔中...',
      successTitle: '信鸽已成功抵达',
      successMsg: '请留意您的邮箱，系统已自动发送一封确认信给您。我会尽快与您联系！',
      sendAnother: '要发送别的电子信鸽吗？',
    },
    fr: {
      tag: 'Contact // ArTrip',
      title: '📧 Envoyer un télégramme',
      subtitle: 'Veuillez sélectionner votre besoin et remplir ce formulaire. Que ce soit pour une visite, une collaboration ou un simple échange, j\'ai hâte de vous lire.',
      promise: 'Je vous répondrai sous 1 à 2 jours ouvrables.',
      name: 'Votre Nom',
      email: 'Adresse E-mail',
      category: 'Sujet',
      message: 'Votre Message',
      selectCat: 'Sélectionnez un sujet...',
      categories: {
        tour: 'Réserver une visite',
        collab: 'Collaboration',
        plan: 'Planification',
        custom: 'Visite sur mesure',
        other: 'Autre'
      },
      submit: 'Envoyer →',
      submitting: 'Envoi en cours...',
      successTitle: 'Message envoyé avec succès',
      successMsg: 'Un e-mail de confirmation vous a été envoyé. Je vous contacterai très bientôt !',
      sendAnother: 'Envoyer un autre message',
    },
    en: {
      tag: 'Contact // ArTrip',
      title: '📧 Send a Telegram',
      subtitle: 'Please select your inquiry type and fill out this form. Whether it\'s for a tour, collaboration, or just to say hi, I look forward to hearing from you.',
      promise: 'I will get back to you within 1-2 business days.',
      name: 'Your Name',
      email: 'Email Address',
      category: 'Inquiry Type',
      message: 'Your Message',
      selectCat: 'Select a subject...',
      categories: {
        tour: 'Book a Tour',
        collab: 'Business Inquiry',
        plan: 'Itinerary Planning',
        custom: 'Custom Tour',
        other: 'Other'
      },
      submit: 'Send Message →',
      submitting: 'Transmitting...',
      successTitle: 'Message Sent Successfully',
      successMsg: 'A confirmation email has been sent to your inbox. I will be in touch shortly!',
      sendAnother: 'Send another message',
    }
  }

  const dict = t[lang] || t.zh_tw

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

 
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 呼叫我們剛剛建立的信鴿發射台 API
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', category: '', message: '' }) // 清空表單
      } else {
        setSubmitStatus('error')
        alert('信鴿迷路了！請稍後再試。')
      }
    } catch (error) {
      console.error('API 錯誤:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  
  return (
    <main className="relative min-h-screen font-sans selection:bg-[#8C3B3B] selection:text-[#FDFBF5] flex flex-col">
      
      {/* 🌟 統一風格背景圖層 (固定在底層) */}
      <div className="fixed inset-0 -z-10 bg-[#FDFBF5]">
        <Image 
          src="/contact-bg.jpg" // 替換成你的背景圖片名稱
          alt="Background Texture"
          fill
          className="object-cover opacity-[0.30] pointer-events-none mix-blend-multiply" 
          priority
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF5]" />
      </div>

      <Navbar />

      {/* 🌟 表單主內容區塊 (flex-1 讓它佔滿剩餘空間，確保 Footer 自然出現在下方) */}
      <section className="relative z-10 flex-1 pt-32 pb-32 px-6 flex items-center justify-center">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* 左側：引言區塊 */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 pt-4 lg:sticky lg:top-40"
          >
            <span className="text-[#8C3B3B] font-mono tracking-[0.4em] uppercase text-xs font-bold block mb-6">
              {dict.tag}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#3D3B38] leading-tight mb-8">
              {dict.title}
            </h1>
            <p className="text-[#5C6B47] text-lg leading-relaxed mb-6 font-serif">
              {dict.subtitle}
            </p>
            <p className="text-[#8C3B3B] text-base font-bold tracking-wide">
              ✓ {dict.promise}
            </p>

            <div className="flex justify-center items-center gap-4 mx-auto mt-12 mb-12">
              <div className="w-16 md:w-24 h-[1px] bg-[#223843]" />
              <div className="w-2 h-2 bg-[#D87348] rotate-45" />
              <div className="w-16 md:w-24 h-[1px] bg-[#223843]" />
            </div>

            
          </motion.div>

          {/* 右側：實體紙張表單區塊 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 bg-white/95 backdrop-blur-sm p-8 md:p-14 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-[#3D3B38]/5"
          >
            {submitStatus === 'success' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 rounded-full bg-[#5C6B47]/10 flex items-center justify-center mb-8">
                  <span className="text-[#5C6B47] text-3xl">✓</span>
                </div>
                <h3 className="text-3xl font-serif font-bold text-[#3D3B38] mb-4">{dict.successTitle}</h3>
                <p className="text-[#5C6B47] leading-relaxed text-lg max-w-sm">{dict.successMsg}</p>
                <button 
                  onClick={() => setSubmitStatus('idle')} 
                  className="mt-10 text-[#8C3B3B] font-bold border-b-2 border-[#8C3B3B]/30 hover:border-[#8C3B3B] pb-1 transition-colors tracking-widest uppercase text-sm"
                >
                  {dict.sendAnother}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-[#8C3B3B] font-bold uppercase mb-2">
                      {dict.name} <span className="text-[#C85555]">*</span>
                    </label>
                    <input 
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      className="w-full bg-transparent border-b border-[#3D3B38]/20 focus:border-[#8C3B3B] text-[#3D3B38] text-lg py-3 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-widest text-[#8C3B3B] font-bold uppercase mb-2">
                      {dict.email} <span className="text-[#C85555]">*</span>
                    </label>
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      className="w-full bg-transparent border-b border-[#3D3B38]/20 focus:border-[#8C3B3B] text-[#3D3B38] text-lg py-3 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-widest text-[#8C3B3B] font-bold uppercase mb-3">
                    {dict.category} <span className="text-[#C85555]">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      name="category" required value={formData.category} onChange={handleChange}
                      className="w-full bg-[#FDFBF5]/50 border border-[#3D3B38]/10 focus:border-[#8C3B3B] text-[#3D3B38] text-lg px-5 py-4 rounded-xl outline-none transition-all cursor-pointer appearance-none shadow-sm"
                    >
                      <option value="" disabled className="text-[#3D3B38]/40">{dict.selectCat}</option>
                      <option value="tour">{dict.categories.tour}</option>
                      <option value="collab">{dict.categories.collab}</option>
                      <option value="plan">{dict.categories.plan}</option>
                      <option value="custom">{dict.categories.custom}</option>
                      <option value="other">{dict.categories.other}</option>
                    </select>
                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#3D3B38]/40 pointer-events-none text-xs">▼</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-widest text-[#8C3B3B] font-bold uppercase mb-3">
                    {dict.message} <span className="text-[#C85555]">*</span>
                  </label>
                  <textarea 
                    name="message" required rows={5} value={formData.message} onChange={handleChange}
                    className="w-full bg-[#FDFBF5]/50 rounded-xl border border-[#3D3B38]/10 focus:border-[#8C3B3B] text-[#3D3B38] text-lg p-5 outline-none transition-all resize-none shadow-sm leading-relaxed"
                  />
                </div>

                <button 
                  type="submit" disabled={isSubmitting}
                  className="mt-4 px-10 py-5 bg-[#3D3B38] text-[#FDFBF5] rounded-full font-serif font-bold tracking-widest hover:bg-[#8C3B3B] hover:shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting ? dict.submitting : dict.submit}
                </button>

              </form>
            )}
          </motion.div>

        </div>
      </section>

    </main>
  )
}