import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // 🌟 多接收一個 lang 參數，如果沒傳預設為 zh_tw
    const { name, email, category, message, lang = 'zh_tw' } = body; 

    // =========================================================================
    // 🕊️ 準備多國語言字典
    // =========================================================================
    const templates: Record<string, any> = {
      zh_tw: {
        subject: `【Fun ArTrip 楓藝】您的訊息已順利送達 🕊️`,
        greeting: `Bonjour ${name},`,
        intro: `感謝您與 <strong>Fun ArTrip 楓藝</strong> 聯絡。我們已經收到您的電子信鴿囉！`,
        bodyText: `這封信是為了向您確認，您的訊息已安全抵達。我會親自閱讀您的內容，並在 <strong>1-2 個工作天內</strong> 盡快回覆您。`,
        backupTitle: `您的訊息備份：`,
        categoryLabel: `事由：`,
        messageLabel: `內容：`,
        outro: `期待很快能與您展開一場文化探險。`,
      },
      fr: {
        subject: `[Fun ArTrip] Votre message a bien été envoyé 🕊️`,
        greeting: `Bonjour ${name},`,
        intro: `Merci d'avoir contacté <strong>Fun ArTrip 楓藝</strong>. Nous avons bien reçu votre message !`,
        bodyText: `Cet e-mail est pour vous confirmer que votre message nous est bien parvenu. Je le lirai personnellement et vous répondrai dans un délai de <strong>1 à 2 jours ouvrés</strong>.`,
        backupTitle: `Copie de votre message :`,
        categoryLabel: `Sujet :`,
        messageLabel: `Message :`,
        outro: `Au plaisir de partager avec vous une aventure culturelle très bientôt.`,
      },
      en: {
        subject: `[Fun ArTrip] Your message has been successfully sent 🕊️`,
        greeting: `Hello ${name},`,
        intro: `Thank you for reaching out to <strong>Fun ArTrip</strong>. We have received your message!`,
        bodyText: `This email is to confirm that your message has safely arrived. I will personally read it and get back to you within <strong>1-2 business days</strong>.`,
        backupTitle: `Your message copy:`,
        categoryLabel: `Subject:`,
        messageLabel: `Message:`,
        outro: `Looking forward to embarking on a cultural adventure with you soon.`,
      }
    };

    // 根據傳進來的語言選擇內容 (防呆機制：如果傳來的語言找不到，就用英文)
    const t = templates[lang] || templates['en'];

    // =========================================================================
    // 🕊️ 任務一：寄信給「你」(這封你自己看的，保持中文就好)
    // =========================================================================
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: 'Fun ArTrip 網站通知 <contact@funartrip.com>', 
      to: ['contact@funartrip.com'], 
      subject: `[新聯絡訊息] ${category} - 來自 ${name}`,
      replyTo: email, 
      html: `
        <div style="font-family: sans-serif; color: #3D3B38; line-height: 1.6;">
          <h2 style="color: #767B39;">收到新的聯絡訊息！🕊️</h2>
          <p><strong>姓名：</strong> ${name}</p>
          <p><strong>信箱：</strong> ${email}</p>
          <p><strong>分類：</strong> ${category}</p>
          <p><strong>使用的語言介面：</strong> ${lang}</p>
          <p><strong>內容：</strong></p>
          <p style="white-space: pre-wrap; background: #FDFBF5; padding: 20px; border-radius: 12px; border: 1px solid #e0e0e0;">${message}</p>
        </div>
      `,
    });

    if (adminError) {
      console.error('通知管理員失敗:', adminError);
      return NextResponse.json({ error: adminError }, { status: 400 });
    }

    // =========================================================================
    // 🕊️ 任務二：寄送「多語版」自動確認信給客人
    // =========================================================================
    const { data: customerData, error: customerError } = await resend.emails.send({
      from: 'Feng Fang | Fun ArTrip <contact@funartrip.com>', 
      to: [email], 
      subject: t.subject,
      html: `
        <div style="font-family: 'serif', 'Playfair Display', sans-serif; color: #2C3522; line-height: 1.8; max-width: 600px; margin: 0 auto; background: #FDFBF5; padding: 40px; border-radius: 20px;">
          <h2 style="color: #767B39; font-style: italic;">${t.greeting}</h2>
          <p>${t.intro}</p>
          <p>${t.bodyText}</p>
          
          <div style="margin: 30px 0; padding: 20px; border-left: 3px solid #EAA624; background: rgba(234, 166, 36, 0.05);">
            <p style="font-size: 14px; margin: 0;"><strong>${t.backupTitle}</strong></p>
            <p style="font-size: 14px; color: #6A784D;">${t.categoryLabel} ${category}</p>
            <p style="font-size: 14px; color: #6A784D;">${t.messageLabel} ${message}</p>
          </div>

          <p style="font-size: 14px;">${t.outro}</p>
          <hr style="border: none; border-top: 1px solid rgba(44, 53, 34, 0.1); margin: 30px 0;" />
          <p style="font-size: 13px; color: #8C9A76;">
            <strong>Feng Fang LEE</strong><br/>
            Fondatrice | Fun ArTrip 楓藝
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, data: adminData });
  } catch (error) {
    console.error('API 嚴重錯誤:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}