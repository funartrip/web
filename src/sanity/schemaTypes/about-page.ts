export default {
  name: 'aboutPage',
  title: '關於我頁面內容',
  type: 'document',
  fields: [
    { name: 'title', title: '主標題', type: 'localeString' },
    { name: 'subtitle', title: '副標題', type: 'localeString' },
    { 
      name: 'bio', 
      title: '個人詳細簡介 (豐富文本)', 
      type: 'localeBlockContent' // 👈 改用新的 Rich Text 類型
    },
    { name: 'profileImage', title: '形象照', type: 'image', options: { hotspot: true } },
    { 
        name: 'experience', title: '學歷經驗', 
        type: 'localeBlockContent' 
    },
  ]
}
