export default {
  name: 'localeText',
  title: 'Localized Text (多語系長文字)',
  type: 'object',
  fields: [
    {
      name: 'zh_tw',
      title: '繁體中文',
      type: 'text', // 注意：這裡用 text 才有換行功能，string 只有一行
      rows: 5       // 設定預設顯示高度
    },
    {
      name: 'zh_cn',
      title: '简体中文',
      type: 'text',
      rows: 5
    },
    {
      name: 'fr',
      title: 'Français',
      type: 'text',
      rows: 5
    },
    {
      name: 'en',
      title: 'English',
      type: 'text',
      rows: 5
    },
  ],
}