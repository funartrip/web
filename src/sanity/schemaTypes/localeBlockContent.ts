export default {
  name: 'localeBlockContent',
  title: 'Localized Block Content (多語系豐富文本)',
  type: 'object',
  fields: [
    {
      name: 'zh_tw',
      title: '繁體中文',
      type: 'array',
      of: [{ type: 'block' }] // 這行就是開啟 Rich Text 編輯器的關鍵
    },
    {
      name: 'zh_cn',
      title: '简体中文',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'fr',
      title: 'Français',
      type: 'array',
      of: [{ type: 'block' }]
    },
    {
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }]
    },
  ],
}
