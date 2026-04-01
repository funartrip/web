export const priceOption = {
  name: 'priceOption',
  title: 'Price Templates (價格範本)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '範本名稱 (僅供內部辨識)',
      type: 'string',
      description: '例如：里昂標準報價 2024'
    },
    {
      name: 'tiers',
      title: '價格級距',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tier',
          fields: [
            // --- 人數描述 (四語) ---
            {
              name: 'groupSize',
              title: '人數描述',
              type: 'object',
              fields: [
                { name: 'zh_tw', title: '繁體中文', type: 'string' },
                { name: 'zh_cn', title: '簡體中文', type: 'string' },
                { name: 'en', title: 'English', type: 'string' },
                { name: 'fr', title: 'Français', type: 'string' },
              ]
            },
            // --- 價格 (數字不分語系) ---
            { 
              name: 'price', 
              type: 'number', 
              title: '整團費用 (€)',
              description: '輸入純數字即可'
            },
          ],
          // 讓後台預覽顯示得更漂亮
          preview: {
            select: {
              title: 'groupSize.zh_tw',
              subtitle: 'price'
            },
            prepare({ title, subtitle }) {
              return {
                title: title || '未填寫人數',
                subtitle: subtitle ? `€${subtitle}` : '未填寫價格'
              }
            }
          }
        }
      ]
    }
  ]
}