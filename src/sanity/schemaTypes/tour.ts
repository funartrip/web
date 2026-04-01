export const tour = {
  name: 'tour',
  title: 'Tours (參觀路線)',
  type: 'document',
  fields: [
    {
      name: 'nameProject',
      title: 'Project Name (Internal / 內部命名)',
      type: 'string',
      description: '僅供後台辨識使用，例如：2024-Louvre-VIP-Tour',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Display Title (前台顯示標題)',
      type: 'localeString',
      description: '這是顯示在網站上給客人看的正式名稱',
    },
    {
      name: 'slug',
      title: 'Slug (網址代碼)',
      type: 'slug',
      options: {
        source: 'nameProject',
        maxLength: 96,
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .slice(0, 96),
      },
      validation: (Rule: any) => Rule.required().error('請點擊右側 Generate 產生網址代碼'),
    },
    // 在 tour.ts 和 portfolio.ts 的 fields 陣列中都加上這一段：
    {
      name: 'isFeatured',
      title: '✨ 顯示於首頁精選 (Featured on Home)',
      type: 'boolean',
      description: '打開此開關，這筆資料就會出現在首頁的三大精選版位中。',
      initialValue: false, // 預設是關閉的
    },
    {
      name: 'mainImage',
      title: 'Main Image (主視覺封面)',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle (卡片副標題)',
      type: 'localeString',
      description: '顯示在首頁卡片標題下方的一句話簡介，讓客人快速了解路線亮點',
    },
    {
      name: 'highlight',
      title: 'Highlight (專案亮點)',
      type: 'localeString',
    },
    {
      name: 'summary',
      title: 'Summary (簡短摘要)',
      description: '建議使用清單列出 3-5 個導覽重點',
      type: 'localeBlock',
    },
    {
      name: 'content',
      title: 'Content (詳細介紹內容)',
      type: 'localeBlock',
    },
    // 👇 已經幫你對換位置了：行前須知在前
    {
      name: 'bonASavoir',
      title: 'Bon à savoir (行前須知)',
      type: 'localeBlock',
      description: '例如：穿著舒適鞋子、集合地點說明等',
    },
    // 👇 參觀時長在後
    {
      name: 'duration',
      title: 'Duration (參觀時長)',
      type: 'localeString',
      description: '請填寫預計的導覽時間，例如：2.5 小時 / 2.5 Heures',
    },
    {
      name: 'locationTag',
      title: 'Location (地區)',
      type: 'string',
      options: {
        list: [
          { title: 'Lyon 里昂 ', value: 'lyon' },
          { title: 'Paris 巴黎 ', value: 'paris' },
        ],
        layout: 'radio', // 用單選鈕呈現
      },
    },
    {
  name: 'priceTemplate',
  title: 'Price Range (套用價格範本)',
  type: 'reference', // 變成一個引用
  to: [{ type: 'priceOption' }], // 指向我們剛才建立的價格範本
  description: '請選擇這條路線適用的報價單'
    },
    {
      name: 'priceNotes',
      title: 'Price Notes (價格備註)',
      type: 'localeBlock',
      description: '例如：巴黎行程需額外加收 TGV 車資等說明',
    },

    {
      name: 'suitableAudience',
      title: 'Suitable For (適合對象)',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{ type: 'category' }],
        options: {
          filter: 'type == "audience"', 
        }
      }],
    },
    {
      name: 'language',
      title: 'Languages (提供語言)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '中文', value: '中文' },
          { title: 'Français', value: 'Français' },
          { title: 'English', value: 'English' }
        ],
      },
    },
    {
      name: 'serviceType',
      title: 'Service Type (服務類型)',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        filter: 'type == "service-type"',
      },
    },
    {
      name: 'interest',
      title: 'Interest (興趣取向)',
      type: 'reference',
      to: [{ type: 'category' }],
      options: {
        filter: 'type == "interest"',
      },
    },
    {
      name: 'gallery',
      title: 'Gallery (活動圖集)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],

  preview: {
    select: {
      titleZh: 'title.zh_tw',
      titleFr: 'title.fr',
      name: 'nameProject',
      media: 'mainImage',
    },
    prepare(selection: any) {
      const { titleZh, titleFr, name, media } = selection
      return {
        title: titleZh || titleFr || name,
        subtitle: name,
        media: media,
      }
    },
  },
}