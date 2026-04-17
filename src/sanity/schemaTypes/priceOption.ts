// schemaTypes/priceOption.ts
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
    // 🗑️ 已經將原本的 baseGroupDesc 刪除，讓後台更乾淨！
    { 
      name: 'basePrice', 
      title: '1-6人 基礎整團費用 (€)', // 🌟 標題直接寫明是1-6人
      type: 'number', 
      description: '符合基礎人數（1至6人）的總收費，輸入純數字'
    },
    { 
      name: 'extraPersonFee', 
      title: '第7人起 額外加人費 (€ / 每人)',
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
  preview: {
    select: {
      title: 'name',
      base: 'basePrice',
      extra: 'extraPersonFee'
    },
    prepare({ title, base, extra }: any) {
      return {
        title: title || '未命名報價範本',
        subtitle: `1-6人: €${base || 0} | 每多一人: +€${extra || 0}`
      }
    }
  }
}