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
      description: '例如：2026 巴黎羅浮宮常規價、同業夥伴 B2B 專用、阿爾卑斯鐵道客製化'
    },
    // 🌟 全新升級：從開關變成多元模式下拉選單
    {
      name: 'displayMode',
      title: '顯示模式 (Display Mode)',
      type: 'string',
      options: {
        list: [
          { title: '🔓 公開報價 (一般零售模式)', value: 'public' },
          { title: '🔒 不公開 - B2B 專業同業/旅行社專用', value: 'b2b' },
          { title: '🚂 不公開 - 鐵道客製旅程專用 (時長未定)', value: 'railway-custom' }
        ],
        layout: 'dropdown', 
      },
      initialValue: 'public'
    },
    {
       name: 'baseCapacity',
       title: '基礎涵蓋人數 (Base Capacity)',
       type: 'number',
       initialValue: 6
    },
    {
       name: 'basePrice',
       title: '基礎報價 (Base Price - 歐元)',
       type: 'number',
       description: '若選擇不公開模式，此處金額在前台會被自動隱藏。'
    },
    {
       name: 'extraPersonFee',
       title: '加人費 (Extra Person Fee - 歐元/每人)',
       type: 'number',
    },
    {
      name: 'maxCapacity',
      title: '最大接待人數限制 (Max Capacity)',
      type: 'number',
    }
  ],
  preview: {
    select: {
      title: 'name',
      base: 'basePrice',
      cap: 'baseCapacity',
      mode: 'displayMode' // 🌟 抓取模式
    },
    prepare({ title, base, cap, mode }: any) {
      const modeMap: Record<string, string> = {
        'public': `1-${cap || '?'}人 €${base || 0}`,
        'b2b': '🔒 B2B 同業隱藏模式',
        'railway-custom': '🚂 鐵道客製隱藏模式'
      };
      return {
        title: title || '未命名報價',
        subtitle: modeMap[mode] || '未設定模式'
      }
    }
  }
}