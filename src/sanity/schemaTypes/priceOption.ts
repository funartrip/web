// src/sanity/schemaTypes/priceOption.ts
export const priceOption = {
  name: 'priceOption',
  title: 'Price Templates (報價與人數模板)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '模板名稱 (僅供後台辨識)',
      type: 'string',
      description: '例如：2026 巴黎羅浮宮 (1-6人) 或 里昂老城 (1-10人)'
    },
    // 🌟 全新加入：基礎涵蓋人數
    {
       name: 'baseCapacity',
       title: '基礎涵蓋人數 (Base Capacity)',
       type: 'number',
       description: '填入包含在基礎價內的人數限制（例如：填入 6，前台就會顯示 1-6 人）',
       initialValue: 6
    },
    {
       name: 'basePrice',
       title: '基礎報價 (Base Price - 歐元)',
       type: 'number',
       description: '上述基礎人數範圍內的總報價'
    },
    {
       name: 'extraPersonFee',
       title: '加人費 (Extra Person Fee - 歐元/每人)',
       type: 'number',
       description: '超過基礎人數後，每增加一人的費用 (若無則留空)'
    },
    {
      name: 'maxCapacity',
      title: '最大接待人數限制 (Max Capacity)',
      type: 'number',
      description: '例如：最多 10 人或 20 人 (若無限制則留空)'
    }
  ],
  preview: {
    select: {
      title: 'name',
      base: 'basePrice',
      cap: 'baseCapacity',
      extra: 'extraPersonFee'
    },
    prepare({ title, base, cap, extra }: any) {
      return {
        title: title || '未命名報價',
        subtitle: `1-${cap || '?'}人 €${base || 0} | 超過加收 €${extra || 0}`
      }
    }
  }
}