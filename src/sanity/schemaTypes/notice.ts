// src/sanity/schemaTypes/notice.ts
export const notice = {
  name: 'notice',
  title: 'Notice Library (須知與備註圖書館)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '內部命名 (Internal Name)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    // 🌟 新增分類：區分這條資訊的用途
    {
      name: 'category',
      title: '類別 (Category)',
      type: 'string',
      options: {
        list: [
          { title: '一般須知 (Bon à savoir)', value: 'general' },
          { title: '價格備註 (Price Notes)', value: 'price' }
        ],
        layout: 'radio'
      },
      initialValue: 'general'
    },
    {
      name: 'content',
      title: '詳細內容',
      type: 'localeBlock',
    }
  ],
  preview: {
    select: { title: 'name', cat: 'category' },
    prepare({ title, cat }: any) {
      return {
        title: title,
        subtitle: cat === 'price' ? '💰 價格備註模塊' : '💡 一般須知模塊'
      }
    }
  }
}