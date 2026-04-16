export const priceOption = {
  name: 'priceOption',
  title: 'Price Templates (價格範本)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '範本名稱 (僅供內部辨識)',
      type: 'string',
      description: '例如：2026 里昂半日遊標準報價 (1-6人基礎價 + 加人費)'
    },
    {
      name: 'baseGroupDesc',
      title: '基礎人數描述 (前台顯示文字)',
      type: 'object',
      fields: [
        { name: 'zh_tw', title: '繁體中文', type: 'string', initialValue: '1至6人' },
        { name: 'zh_cn', title: '簡體中文', type: 'string', initialValue: '1至6人' },
        { name: 'en', title: 'English', type: 'string', initialValue: '1 to 6 people' },
        { name: 'fr', title: 'Français', type: 'string', initialValue: '1 à 6 personnes' },
      ],
      description: '例如：1-6人，這會顯示在網站上'
    },
    { 
      name: 'basePrice', 
      title: '基礎整團費用 (€)',
      type: 'number', 
      description: '符合基礎人數（1-6人）的總收費，輸入純數字'
    },
    { 
      name: 'extraPersonFee', 
      title: '額外增加人頭費 (€ / 每人)',
      type: 'number', 
      description: '第7人起，每增加一名旅客需額外加收的費用，輸入純數字'
    },
    {
      name: 'maxCapacity',
      title: '一團最大接待人數上限 (選填)',
      type: 'number',
      description: '例如最多只接 10 人。這可以方便未來前端做表單人數限制'
    }
  ],
  // 🌟 讓你在後台列表能一眼看清楚這個範本的計價方式
  preview: {
    select: {
      title: 'name',
      base: 'basePrice',
      extra: 'extraPersonFee'
    },
    prepare({ title, base, extra }: any) {
      return {
        title: title || '未命名報價範本',
        subtitle: `基礎價: €${base || 0} | 每多一人: +€${extra || 0}`
      }
    }
  }
}