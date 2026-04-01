export const bookingTerms = {
  name: 'bookingTerms',
  title: 'Booking Policy (預約與取消政策)',
  type: 'document',
  // 💡 我們可以限制讓它變成「單一文件 (Singleton)」，後台只會出現一個，不能重複建立
  fields: [
    {
      name: 'name',
      title: '標題',
      type: 'string',
      initialValue: '全域預約須知設定',
      readOnly: true,
    },
    {
      name: 'process',
      title: '1. 預約流程',
      type: 'localeBlock', // 使用你現有的多語系富文本
    },
    {
      name: 'cancellation',
      title: '2. 改期／取消政策',
      type: 'localeBlock',
    },
    
    {
      name: 'reminders',
      title: '3. 博物館提醒',
      type: 'localeBlock',
    },
  ],
}