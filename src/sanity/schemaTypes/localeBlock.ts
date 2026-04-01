export const localeBlock = {
  title: 'Localized Block',
  name: 'localeBlock',
  type: 'object',
  fields: [
    { title: '繁體中文', name: 'zh_tw', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { title: '简体中文', name: 'zh_cn', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { title: 'Français (法文)', name: 'fr', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { title: 'English (英文)', name: 'en', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }
  ]
}