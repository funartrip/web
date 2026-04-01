import { createClient } from 'next-sanity'
// 🌟 修正：從使用預設匯入改為「具名匯入」，以消除過時警告
import { createImageUrlBuilder } from '@sanity/image-url'

// 1. 初始化連線客戶端
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-28', 
  useCdn: false, 
})

// 2. 設定圖片網址產生器
// 🌟 修正：直接使用從套件匯入的具名函式
const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}