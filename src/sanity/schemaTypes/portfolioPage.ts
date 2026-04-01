import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'portfolioPage',
  title: 'Portfollui Lobby (作品集大廳設定)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '大廳 Hero 標題',
      type: 'localeString',
      description: '顯示在頁首大圖上的標題 (如：Project Portfolio)'
    }),
    defineField({
      name: 'heroSubtitle',
      title: '大廳 Hero 副標題',
      type: 'localeString',
      description: '顯示在標題下的四語副標題'
    }),
    defineField({
      name: 'narrativeIntro',
      title: '工作哲學引言',
      type: 'localeBlock',
      description: '作品列表前的詳細文字介紹（長篇敘事區）'
    }),
    // 🌟 重點：定義 5 張專業能力卡片的資料結構
    defineField({
      name: 'coreAbilities',
      title: '五大核心專業維度 (卡片區)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'abilityTitle', title: '維度名稱', type: 'localeString' },
            { name: 'abilityDescription', title: '維度描述', type: 'localeString' },
            { name: 'iconName', title: '圖示代碼/編號', type: 'string', description: '後續用於對應特定的插畫或圖示' }
          ],
          preview: {
            select: { title: 'abilityTitle.zh_tw' }
          }
        }
      ],
      validation: Rule => Rule.max(5).warning('建議維持在 5 個核心維度以符合排版美感')
    }),
    defineField({
      name: 'closingStatement',
      title: '一句話總結 (結語)',
      type: 'localeString'
    })
  ]
})