import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// 初始化 Resend，它會自動抓取 .env.local 裡的 RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, category, message } = body;

    // =========================================================================
    // 🕊️ 任務一：寄信給「你」(通知有新客戶聯絡)
    // =========================================================================
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'Fun ArTrip 電子信鴿 🕊️ <onboarding@resend.dev>', 
      to: ['funartrip@gmail.com'], // 你的專屬接收信箱
      subject: `[新電鴿抵達] 事由：${category} - 來自 ${name}`,
      html: `
        <div style="font-family: sans-serif; color: #3D3B38; line-height: 1.6;">
          <h2 style="color: #8C3B3B;">收到新的聯絡訊息！🕊️</h2>
          <p><strong>姓名：</strong> ${name}</p>
          <p><strong>信箱：</strong> ${email}</p>
          <p><strong>分類：</strong> ${category}</p>
          <p><strong>內容：</strong></p>
          <p style="white-space: pre-wrap; background: #FDFBF5; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">${message}</p>
        </div>
      `,
    });

    if (adminError) {
      console.error('寄給管理員失敗:', adminError);
      return NextResponse.json({ error: adminError }, { status: 400 });
    }

    // =========================================================================
    // 🕊️ 任務二：寄送自動確認信給「客人」
    // ⚠️ 注意：在你擁有專屬網域（如 @funartrip.com）並在 Resend 驗證通過之前，
    // 這段寄給「非註冊信箱」的代碼會報錯，所以我先用 // 把它變成註解。
    // 等你有專屬網址後，把這段每一行前面的 // 刪掉就能用了。
    // =========================================================================
    
    // const { data: customerData, error: customerError } = await resend.emails.send({
    //   from: 'Fun ArTrip 🕊️ <hello@funartrip.com>', // 未來換成你的專屬信箱
    //   to: [email], // 動態抓取客人填寫的信箱
    //   subject: `【Fun ArTrip】您的電子信鴿已順利抵達！`,
    //   html: `
    //     <div style="font-family: sans-serif; color: #3D3B38; line-height: 1.6; max-width: 600px; margin: 0 auto;">
    //       <h2 style="color: #8C3B3B;">親愛的 ${name}，您好：</h2>
    //       <p>這裡是 Fun ArTrip 的自動回覆系統。我們已經收到您派來的電子信鴿囉！🕊️</p>
    //       <p>這封信是為了向您確認，您的訊息已安全抵達我們的檔案室。我會親自閱讀您的內容，並在 <strong>1-2 個工作天內</strong> 盡快回覆您。</p>
    //       <br/>
    //       <p style="font-size: 14px; color: #5C6B47;">以下是您發送的備份內容：<br/>
    //       【事由】${category}<br/>
    //       【內容】${message}</p>
    //       <br/>
    //       <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
    //       <p style="font-size: 14px; color: #888;">祝您有美好的一天！<br/>Fun ArTrip 團隊 敬上</p>
    //     </div>
    //   `,
    // });

    return NextResponse.json({ success: true, data: adminData });
  } catch (error) {
    console.error('API 嚴重錯誤:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}