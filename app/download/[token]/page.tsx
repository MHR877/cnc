"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function DownloadPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkoutData, setCheckoutData] = useState<any>(null);

  const getFingerprint = () => {
    if (typeof window === "undefined") return "";
    return btoa(`${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.language}`);
  };

  useEffect(() => {
    const verifyAccess = async () => {
      if (!token) return;

      // Get current IP
      const ipRes = await fetch("https://api.ipify.org?format=json").catch(() => null);
      const ipData = await ipRes?.json();
      const currentIp = ipData?.ip || "unknown";
      const currentFingerprint = getFingerprint();

      // Fetch checkout by token
      const { data, error } = await supabase
        .from("checkouts")
        .select("*")
        .eq("access_token", token)
        .single();

      if (error || !data) {
        setErrorMsg("رابط التحميل غير صحيح أو غير موجود.");
        setLoading(false);
        return;
      }

      // 1. Check Status
      if (data.status !== "completed") {
        setErrorMsg("عملية الدفع لم تكتمل بعد أو تم إلغاؤها.");
        setLoading(false);
        return;
      }

      // 2. Check Expiration (48 hours)
      const createdAt = new Date(data.created_at).getTime();
      const now = new Date().getTime();
      const diffHours = (now - createdAt) / (1000 * 60 * 60);

      if (diffHours > 48) {
        setErrorMsg("انتهت صلاحية رابط التحميل (أكثر من 48 ساعة).");
        setLoading(false);
        return;
      }

      // 3. Check IP & Fingerprint (Security)
      if (data.ip_address !== currentIp || data.fingerprint !== currentFingerprint) {
        // We'll allow it but maybe log it? The user asked for IP/Fingerprint security
        // In a real scenario, IP might change, but I'll stick to the request:
        setErrorMsg("عذراً، لا يمكنك الوصول للملفات من هذا الجهاز أو الشبكة (أمان إضافي).");
        setLoading(false);
        return;
      }

      setAuthorized(true);
      setCheckoutData(data);
      setLoading(false);

      // Log download
      await supabase.from("download_logs").insert({
        checkout_id: data.id,
        ip_address: currentIp,
        fingerprint: currentFingerprint
      });
    };

    verifyAccess();
  }, [token]);

  if (loading) return (
    <div style={{ background: "#09111f", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cairo), sans-serif" }}>
      جاري التحقق من صلاحية الوصول...
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09111f",
      color: "#fff",
      fontFamily: "var(--font-cairo), sans-serif",
      direction: "rtl",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .download-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 24px;
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        .success-icon { font-size: 64px; color: #f59e0b; margin-bottom: 24px; }
        .error-icon { font-size: 64px; color: #ef4444; margin-bottom: 24px; }
        h1 { font-size: 28px; margin-bottom: 16px; }
        p { color: #94a3b8; line-height: 1.6; margin-bottom: 32px; }
        .download-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 16px 32px;
          background: #f59e0b;
          color: #000;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 900;
          font-size: 18px;
          transition: transform 0.2s;
        }
        .download-btn:hover { transform: translateY(-2px); }
        .expiry-note { margin-top: 24px; font-size: 14px; color: #ef4444; opacity: 0.8; }
        .info-row { display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 12px 0; font-size: 14px; color: #cbd5e1; }
      ` }} />

      <div className="download-card">
        {authorized ? (
          <>
            <div className="success-icon">💎</div>
            <h1>مرحباً بك، {checkoutData.full_name}</h1>
            <p>تهانينا! يمكنك الآن تحميل مكتبة MegaCNC الكاملة. يرجى الضغط على الزر أدناه للبدء.</p>
            
            <div style={{ marginBottom: "32px", textAlign: "right" }}>
              <div className="info-row"><span>رقم الطلب:</span><span>{checkoutData.payment_id || checkoutData.id.slice(0,8)}</span></div>
              <div className="info-row"><span>البريد الإلكتروني:</span><span>{checkoutData.email}</span></div>
              <div className="info-row"><span>تاريخ الشراء:</span><span>{new Date(checkoutData.created_at).toLocaleDateString()}</span></div>
            </div>

            <a href="https://your-storage-link.com/library.zip" className="download-btn">
              📂 تحميل المكتبة الآن
            </a>

            <div className="expiry-note">
              ⚠️ هذا الرابط سينتهي مفعوله بعد 48 ساعة من وقت الشراء.
            </div>
          </>
        ) : (
          <>
            <div className="error-icon">🔒</div>
            <h1>عذراً، لا يمكن الوصول</h1>
            <p>{errorMsg}</p>
            <a href="/" style={{ color: "#f59e0b", textDecoration: "none" }}>العودة للرئيسية</a>
          </>
        )}
      </div>
    </div>
  );
}
