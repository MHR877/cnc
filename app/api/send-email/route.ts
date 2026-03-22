import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email, fullName, token } = await req.json();

    if (!email || !token) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const downloadUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/download/${token}`;

    const mailOptions = {
      from: `"MegaCNC Library" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'رابط تحميل مكتبة MegaCNC الخاصة بك 📂',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #f59e0b; text-align: center;">شكراً لك على طلبك، ${fullName || 'عميلنا العزيز'}!</h2>
          <p>لقد تم تأكيد دفعتك بنجاح. يمكنك الآن الوصول إلى مكتبة MegaCNC الكاملة (+10,000 نموذج) عبر الرابط التالي:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" style="background-color: #f59e0b; color: #000; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 18px;">
              📂 الدخول إلى صفحة التحميل
            </a>
          </div>

          <p style="color: #ef4444; font-weight: bold;">⚠️ ملاحظة هامة:</p>
          <ul>
            <li>هذا الرابط سيبقى صالحاً لمدة <b>48 ساعة فقط</b> من وقت الشراء.</li>
            <li>الرابط محمي ومرتبط بجهازك وشبكتك الحالية لضمان الأمان.</li>
          </ul>

          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            إذا واجهت أي مشكلة، يرجى التواصل معنا عبر واتساب للمساعدة.<br>
            MegaCNC Team © 2026
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
