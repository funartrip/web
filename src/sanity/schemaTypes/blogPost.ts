export const blogPost = {
  name: 'blogPost',
  title: 'Blog Posts (旅行日誌)',
  type: 'document',
  fields: [
    {
      name: 'nameBlog',
      title: 'Blog Name (Internal / 內部命名)',
      type: 'string',
      description: '僅供後台辨識使用，不會顯示在前台',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug (網址代碼)',
      type: 'slug',
      options: {
        source: 'nameBlog', 
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
    {
      name: 'publishStatus',
      title: '🚀 前台發布狀態 (Frontend Visibility)',
      type: 'string',
      options: {
        list: [
          { title: '🌱 僅儲存/後台隱藏 (Draft / Hidden)', value: 'draft' },
          { title: '✨ 正式公開發布 (Live / Published)', value: 'published' }
        ],
        layout: 'radio', // 變成直覺的單選大按鈕
      },
      initialValue: 'draft', // 預設一建立新文章就是隱藏狀態，安全第一！
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title (文章標題)',
      type: 'localeString', // 支援多語系標題
    },
    {
      name: 'summary',
      title: 'Summary (列表摘要)',
      type: 'localeString', // 用於前台列表的簡短介紹
    },
    {
      name: 'seoKeywords',
      title: '🔑 自由標籤與 SEO 關鍵字 (Hashtags & Keywords)',
      type: 'string',
      description: '請用「英文逗號」隔開每個標籤。這些標籤會同時變成 Google 的關鍵字，並顯示在文章標題下方。例如：日常, 里昂生活, 藝術策展',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail (封面圖)',
      type: 'image',
      options: { hotspot: true }, // 開啟熱點裁切，確保在 Safari/Chrome 顯示比例正確
    },
    {
      name: 'blogCategory', // 🌟 這是我們修正過、沒有橫線的正確名稱
      title: 'Blog Category (部落格分類 - 可多選)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
          // ⚠️ 注意：這裡的 filter 會過濾出分類中 type 為 blogcategory 的選項
          options: { filter: 'type == "blogcategory"' },
        }
      ],
    },
    {
      name: 'postContent',
      title: 'Post Content (文章內容)',
      type: 'localeBlock', // 支援多語系富文本
    },
    {
      name: 'images',
      title: 'Additional Images (其他插入圖片)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      description: '可以在這裡上傳文章會用到的額外圖片',
    },
  ],
  preview: {
    select: {
      title: 'title.zh_tw', // 後台列表中預設顯示繁體中文標題
      media: 'thumbnail',
    },
  },
}