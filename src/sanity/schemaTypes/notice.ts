// src/sanity/schemaTypes/notice.ts
export const notice = {
  name: 'notice',
  title: 'Notices (注意事項圖書館)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: '內部命名 (Internal Name)',
      type: 'string',
      description: '僅供後台辨識使用，例如：博物館安檢規定、戶外徒步建議',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: '須知內容 (Content)',
      type: 'localeBlock', // 🌟 套用你的四語富文本
      description: '請在此輸入完整的注意事項內容',
    }
  ],
  preview: {
    select: {
      title: 'name',
    },
    prepare({ title }: any) {
      return {
        title: title,
        subtitle: '💡 Bon à savoir 模組'
      }
    }
  }
}