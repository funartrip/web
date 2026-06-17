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
      description: '例如：2026 巴黎羅浮宮 (1-6人) 或 同業同盟夥伴專用 (不公開費用)'
    },
    // 🌟 全新加入：不公開費用開關
    {
      name: 'isPrivate',
      title: '🔒 不公開費用 (專業客戶 / 旅行社同業專用)',
      type: 'boolean',
      description: '開啟後，前台該路線將隱藏具體歐元數字，改為顯示「費用請諮詢 (Tarif sur demande)」，非常適合 B2B 合作。',
      initialValue: false
    },
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
       description: '非公開費用模板時此處可隨便填寫（前台不會顯示），但建議仍填個數字供自己內部參考。'
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
      extra: 'extraPersonFee',
      isPrivate: 'isPrivate' // 🌟 抓取隱私狀態
    },
    prepare({ title, base, cap, extra, isPrivate }: any) {
      return {
        title: title || '未命名報價',
        // 🌟 如果開啟隱私，後台清單會打上鎖頭圖籤
        subtitle: isPrivate 
          ? '🔒 專業同業模式 (前台已隱藏歐元報價)' 
          : `1-${cap || '?'}人 €${base || 0} | 超過加收 €${extra || 0}`
      }
    }
  }
}