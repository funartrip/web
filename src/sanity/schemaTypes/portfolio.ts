export const portfolio = {
  name: 'portfolio',
  title: 'Portfolios (作品集)',
  type: 'document',
  fields: [
    // --- 1. 基本資訊區 ---
    {
      name: 'nameProject',
      title: 'Project Name (Internal / 內部命名)',
      type: 'string',
      description: '僅供後台辨識使用，例如：2025 聖保羅德旺斯冒險計畫',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'displayTitle',
      title: 'Display Title (顯示名稱)',
      type: 'localeString', 
    },
    {
      name: 'slug',
      title: 'Slug (網址代碼)',
      type: 'slug',
      options: {
        source: 'nameProject', // ✅ 這裡必須跟上面的 name 一模一樣
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
      name: 'subtitle',
      title: 'Subtitle (專案副標題)',
      type: 'localeString',
    },
    {
      name: 'projectCover',
      title: 'Project Cover (專案封面)',
      type: 'image',
      options: { hotspot: true },
    },

    // --- 2. 核心規格區 ---
    {
      name: 'date',
      title: 'Date (專案日期)',
      type: 'date',
    },
    {
      name: 'duration',
      title: 'Duration (預估遊玩時長)',
      type: 'string', 
    },
    {
      name: 'type',
      title: 'Project Types (專案類型 - 可多選)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
        }
      ],
    },
    {
      name: 'targetAudience',
      title: 'Target Audience (適合對象 - 可多選)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'category' }],
          options: { filter: 'type == "audience"' },
        }
      ],
    },
    {
      name: 'highlight',
      title: 'Highlight (專案亮點標籤)',
      type: 'localeString',
    },

    // --- 3. 內容詳情區 ---
    {
      name: 'summary',
      title: 'Summary (核心要點摘要)',
      type: 'localeBlock',
    },
    {
      name: 'content',
      title: 'Content (專案詳情敘述)',
      type: 'localeBlock',
    },

    // --- 4. 合作與職能區 ---
    {
      name: 'partnerOrganisations',
      title: 'Partner Organisations (合作機構)',
      type: 'localeString',
      rows: 3,
    },
    {
      name: 'roleDetails',
      title: 'Role & Functions (我的角色與具體職能)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'functionName', title: '職能名稱', type: 'localeString' },
            { name: 'functionDesc', title: '具體描述', type: 'localeString' },
          ]
        }
      ]
    },

    // --- 5. 專案附錄 (小表格區) ---
    {
      name: 'projectAppendix',
      title: 'Project Appendix (專案附錄/技術規格)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: '項目類型', type: 'localeString' },
            { name: 'value', title: '具體內容', type: 'localeString' },
          ]
        }
      ]
    },

    {
      name: 'gallery',
      title: 'Gallery (專案圖集)',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],
  preview: {
    select: {
      title: 'nameProject',
      subtitle: 'date',
      media: 'projectCover',
    },
  },
}