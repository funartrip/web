// schemaTypes/stop.ts
export const stop = {
  name: 'stop',
  title: 'Points of Interest (參觀站點圖書館)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Stop Name (站點名稱)',
      type: 'localeString', // 這裡統一管理四種語言
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'General Description (景點通用簡介)',
      type: 'localeString',
      description: '這個景點的通用介紹，會自動套用到所有包含此站點的路線中。',
    },
    {
      name: 'mainImage',
      title: 'Stop Image (景點照片)',
      type: 'image',
      options: { hotspot: true },
    }
  ],
  preview: {
    select: {
      title: 'name.zh_tw',
      subtitle: 'name.fr',
      media: 'mainImage'
    }
  }
}
