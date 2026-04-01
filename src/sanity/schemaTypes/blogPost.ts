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