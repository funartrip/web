// src/lib/utils.ts

/**
 * 萬用多語系標籤轉換器
 * 優先序：所選語言 -> 繁中 (預設) -> 英文 -> 隨便一個有值的值
 */
export const getLabel = (field: any, lang: string) => {
  if (!field) return '';
  
  // 如果 field 直接是字串，直接回傳
  if (typeof field === 'string') return field;
  
  // 如果是 Sanity 的多語系物件 (localeString)
  return (
    field[lang] || 
    field['zh_tw'] || 
    field['en'] || 
    (field && Object.values(field).find(v => typeof v === 'string')) || 
    ''
  );
};