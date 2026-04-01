export const category = {
  name: 'category',
  title: 'Categories (分類標籤)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'localeString', // 多語系物件
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'type',
      title: 'Category Type',
      type: 'string',
      options: {
        list: [
          { title: 'Service Type (服務類型)', value: 'service-type' },
          { title: 'Target Audience (適合對象)', value: 'audience' },
          { title: 'Interest (興趣取向)', value: 'interest' },
          { title: 'Blog Category (部落格分類)', value: 'blogcategory' },

      
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'name.zh_tw', // 後台列表預設顯示繁中
      subtitle: 'type',
    },
  },
}