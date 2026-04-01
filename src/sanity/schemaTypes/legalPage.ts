const legalPage = {
  name: 'legalPage',
  title: '法律條款管理 (Mentions & CGV)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: '頁面標題', // 例如：楓藝 ArTrip 法律規範
      type: 'localeString',
    },
    // --- 法律資訊區塊 ---
    {
      name: 'mentionsHeroSubtitle',
      title: 'Mentions Légales 副標題',
      type: 'localeString',
      group: 'mentions', // 分組讓後台變整齊
    },
    {
      name: 'mentionsContent',
      title: 'Mentions Légales 內文 (長條文)',
      type: 'localeBlock',
      group: 'mentions',
    },
    // --- 銷售條款區塊 ---
    {
      name: 'cgvTitle',
      title: '頁面標題', // 例如：楓藝 ArTrip 法律規範
      type: 'localeString',
    },
    {
      name: 'cgvHeroSubtitle',
      title: 'CGV 副標題',
      type: 'localeString',
      group: 'cgv',
    },
    {
      name: 'cgvContent',
      title: 'CGV 內文 (長條文)',
      type: 'localeBlock',
      group: 'cgv',
    },
  ],
  // 🌟 加入分組功能，讓後台編輯器上方出現分頁籤
  groups: [
    { name: 'mentions', title: '法律資訊 (Mentions)' },
    { name: 'cgv', title: '銷售條款 (CGV)' },
  ],
}

export default legalPage