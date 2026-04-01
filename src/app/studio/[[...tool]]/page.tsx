'use client'

import { NextStudio } from 'next-sanity/studio'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from '@/sanity/schemaTypes'
import { useEffect } from 'react'

const config = defineConfig({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
})

export default function StudioPage() {
  
  // 🌟 魔法防護罩：專門攔截 Sanity 內部的 HTML 標籤報錯
  useEffect(() => {
    // 記住原本的報錯功能
    const originalError = console.error;
    
    // 竄改報錯功能
    console.error = (...args) => {
      if (typeof args[0] === 'string' && (
        args[0].includes('cannot be a descendant of <p>') ||
        args[0].includes('cannot contain a nested <div>') ||
        args[0].includes('hydration error')
      )) {
        // 如果是這幾個討厭的錯誤，我們就當作沒看到，直接 return
        return; 
      }
      // 其他真正的錯誤，還是讓它正常顯示
      originalError.call(console, ...args);
    };

    // 離開這個後台頁面時，把報錯功能恢復正常
    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <div className="h-screen">
      <NextStudio config={config} />
    </div>
  )
}