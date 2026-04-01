const blogPostPage = {
  name: 'blogPostPage',
  title: 'Blog Lobby (部落格大廳設定)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '大廳 Hero 標題',
      type: 'localeString',
    },
    {
      name: 'heroSubtitle',
      title: '大廳 Hero 副標題',
      type: 'localeString',
    },
    {
      name: 'narrativeIntro',
      title: '部落格引言',
      type: 'localeBlock',
    },
    {
      name: 'closingStatement',
      title: '一句話總結 (結語)',
      type: 'localeString'
    }
  ]
}

export default blogPostPage