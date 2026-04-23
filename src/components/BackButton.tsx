'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({ label = 'Retour / 返回' }: { label?: string }) {
  const router = useRouter()

  return (
    <button 
      onClick={() => router.back()} 
      className="group flex items-center gap-3 text-[#8C3B3B] hover:text-[#C85555] transition-colors font-serif italic mb-10 text-lg cursor-pointer bg-transparent border-none p-0"
    >
      <span className="group-hover:-translate-x-1 transition-transform duration-300">
        ←
      </span>
      <span className="border-b border-transparent group-hover:border-[#C85555]/30 pb-0.5">
        {label}
      </span>
    </button>
  )
}