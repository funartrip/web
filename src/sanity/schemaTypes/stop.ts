// schemaTypes/stop.ts
export const stop = {
  name: 'stop',
  title: 'Points of Interest (參觀站點圖書館)',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Stop Name (站點名稱)',
      type: 'localeString', 
      validation: (Rule: any) => Rule.required(),
    },
    // 🌟 全新加入：區域分類下拉選單
    {
      name: 'district',
      title: 'District / Region (所在區域)',
      type: 'string',
      description: '幫助在後台分類站點，方便規劃路線時快速尋找與過濾。',
      options: {
        list: [
          { title: 'Vieux Lyon (里昂老城) 五區', value: 'vieux-lyon' },
          { title: 'Presquîle (里昂半島) 一區、二區', value: 'presquile' },
          { title: 'Croix-Rousse (紅十字山) 一區、四區', value: 'croix-rousse' },
          { title: 'Colline de la Fourvière (富維耶山)', value: 'fourviere' },
          { title: 'Confluence (匯流區) 二區', value: 'confluence' },
          { title: 'Tête d\'or, Brotteaux (金頭公園) 三區、六區', value: 'brotteaux' },
          { title: 'Paris (巴黎)', value: 'paris' },
          { title: 'Other (其他地區)', value: 'other' }
        ],
        layout: 'dropdown' // 讓後台用下拉選單顯示，節省空間
      }
    },
    {
      name: 'description',
      title: 'General Description (景點通用簡介 - 選填)',
      type: 'localeString',
      description: '這個景點的通用介紹，會自動套用到所有包含此站點的路線中。',
    },
    {
      name: 'mainImage',
      title: 'Stop Image (景點照片 - 選填)',
      type: 'image',
      options: { hotspot: true },
    }
  ],
  preview: {
    select: {
      titleZh: 'name.zh_tw',
      titleFr: 'name.fr',
      district: 'district', // 🌟 把區域資訊抓進預覽中
      media: 'mainImage'
    },
    prepare(selection: any) {
      const { titleZh, titleFr, district, media } = selection;
      
      // 🌟 將資料庫的 value 轉換成後台顯示的精美標籤
      const districtMap: Record<string, string> = {
        'vieux-lyon': '📍 Vieux Lyon (里昂老城) 五區',
        'presquile': '📍 Presquîle (里昂半島) 一區、二區',
        'croix-rousse': '📍 Croix-Rousse (紅十字山) 一區、四區',
        'fourviere': '📍 Colline de la Fourvière (富維耶山)',
        'confluence': '📍 Confluence (匯流區) 二區',
        'brotteaux': '📍 Tête d\'or, Brotteaux (金頭公園) 三區、六區',
        'paris': '📍 Paris (巴黎)',
        'other': '📍 Other (其他地區)'
      };

      const subtitle = district ? districtMap[district] : '📍 未分類站點';

      return {
        title: titleZh || titleFr || '未命名站點',
        subtitle: subtitle, // 🌟 顯示在副標題
        media: media
      }
    }
  }
}