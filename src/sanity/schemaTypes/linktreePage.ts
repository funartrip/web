// src/sanity/schemaTypes/linktreePage.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'linktreePage',
  title: '🔗 行動智慧連結頁 (Linktree)',
  type: 'document',
  fields: [
    defineField({
      name: 'profileImage',
      title: '頭像 / 品牌標誌 (Square Image)',
      type: 'image',
      options: { hotspot: true },
      description: '建議上傳正方形去背 Logo 或個人精美形象照'
    }),
    defineField({
      name: 'title',
      title: '主標題 (名稱)',
      type: 'localeString',
    }),
    defineField({
      name: 'subtitle',
      title: '副標題 (簡介引言)',
      type: 'localeString',
    }),
    defineField({
      name: 'links',
      title: '📱 手機按鈕連結清單',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'linkItem',
          title: '連結項目',
          fields: [
            { name: 'label', title: '按鈕顯示文字', type: 'localeString' },
            { name: 'url', title: '點擊跳轉網址 (URL)', type: 'string', description: '例如：https://line.me/... 或 /zh_tw/tours' },
            {
              name: 'styleType',
              title: '按鈕跳色樣式',
              type: 'string',
              options: {
                list: [
                  { title: '品牌經典墨綠 (沉穩)', value: 'green' },
                  { title: '活力復古暖橘 (極度跳色！)', value: 'orange' },
                  { title: '質感陶土紅 (亮眼)', value: 'terracotta' },
                  { title: '法式高雅金邊框 (精緻)', value: 'outline-gold' }
                ]
              },
              initialValue: 'green'
            }
          ],
          preview: {
            select: {
              title: 'label.zh_tw',
              subtitle: 'url'
            }
          }
        }
      ]
    })
  ]
})