"use client";

import { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { supabase } from "@/lib/supabase";

declare global {
  interface Window {
    paypal: any;
  }
}

export default function Checkout() {
  const isDev = process.env.NODE_ENV !== "production";
  
  // Use Sandbox in development, Live in production
  // We fall back to Sandbox keys if Live ones are missing to avoid breaking the UI
  const clientId = (isDev || !process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID)
    ? (process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_CLIENT_ID || "BAAM-e55iDoQOdggojTqOpCsyUyTyC5inIt2r7L4YFsnVPybcjbWffSrWSnQOtbE8KWWIkDAFWHwtZjj3g")
    : process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID;

  const buttonId = (isDev || !process.env.NEXT_PUBLIC_PAYPAL_LIVE_BUTTON_ID)
    ? (process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_BUTTON_ID || "F9B3NNT4K8YHN")
    : process.env.NEXT_PUBLIC_PAYPAL_LIVE_BUTTON_ID;

  useEffect(() => {
    console.log(`MegaCNC: PayPal is running in ${isDev ? "SANDBOX" : "LIVE"} mode.`);
  }, [isDev]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: ""
  });
  const [status, setStatus] = useState<"idle" | "pending" | "processing" | "success" | "error">("idle");
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  const getFingerprint = () => {
    if (typeof window === "undefined") return "";
    return btoa(`${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.language}`);
  };

  const startCheckout = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    setStatus("pending");

    // Get IP (simple way)
    const ipRes = await fetch("https://api.ipify.org?format=json").catch(() => null);
    const ipData = await ipRes?.json();

    const { data, error } = await supabase
      .from("checkouts")
      .insert({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        status: "pending",
        ip_address: ipData?.ip || "unknown",
        fingerprint: getFingerprint(),
        amount: 59.99
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      setStatus("error");
      return;
    }

    setCheckoutId(data.id);
    setStatus("processing");
  };

  useEffect(() => {
    if (status !== "processing" || !checkoutId) return;

    const initPayPal = () => {
      const win = window as any;

      if (win.paypal && win.paypal.HostedButtons) {
        if (paypalContainerRef.current && paypalContainerRef.current.innerHTML === "") {
          win.paypal.HostedButtons({
            hostedButtonId: buttonId,
            onApprove: async (data: any) => {
              const { data: updatedData } = await supabase
                .from("checkouts")
                .update({ 
                  status: "completed", 
                  payment_id: data.orderID,
                  fingerprint: getFingerprint() // Re-capture to lock the paying device
                })
                .eq("id", checkoutId)
                .select()
                .single();
              
              if (updatedData) {
                console.log("Payment completed and device fingerprint locked.");
                // Send email via our API
                fetch("/api/send-email", {
                  method: "POST",
                  body: JSON.stringify({
                    email: updatedData.email,
                    fullName: updatedData.full_name,
                    token: updatedData.access_token
                  })
                }).catch(err => console.error("Email API error:", err));
              }

              setStatus("success");
            },
            onCancel: async () => {
              await supabase
                .from("checkouts")
                .update({ status: "cancelled" })
                .eq("id", checkoutId);
              setStatus("idle");
            },
            onError: async (err: any) => {
              console.error("PayPal Error:", err);
              await supabase
                .from("checkouts")
                .update({ status: "failed" })
                .eq("id", checkoutId);
              setStatus("error");
            }
          }).render(`#paypal-container-${buttonId}`);
        }
      }
    };

    if ((window as any).paypal) {
      initPayPal();
    }

    const handleInit = () => initPayPal();
    window.addEventListener("paypal-loaded", handleInit);

    return () => {
      window.removeEventListener("paypal-loaded", handleInit);
    };
  }, [status, checkoutId, buttonId]);

  if (status === "success") {
    return (
      <div className="checkout-container success">
        <style dangerouslySetInnerHTML={{ __html: `
          .checkout-container {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            text-align: center;
            direction: rtl;
            font-family: var(--font-cairo), system-ui, sans-serif;
            background: #09111f;
            color: #fff;
          }
          .card {
            background: rgba(255,255,255,0.05);
            padding: 40px;
            border-radius: 24px;
            max-width: 500px;
            width: 100%;
            border: 1px solid #22c55e;
          }
          h1 { color: #22c55e; margin-bottom: 16px; }
          .btn-home {
            display: inline-block;
            margin-top: 24px;
            padding: 12px 24px;
            background: #22c55e;
            color: #fff;
            border-radius: 12px;
            text-decoration: none;
            font-weight: bold;
          }
        ` }} />
        <div className="card">
          <h1>تم الدفع بنجاح! 🎉</h1>
          <p>شكراً لك {formData.fullName}. لقد تم تأكيد طلبك.</p>
          <p>سيتم إرسال رابط تحميل المكتبة إلى بريدك الإلكتروني ({formData.email}) خلال دقائق.</p>
          <p style={{ marginTop: "20px", fontSize: "14px", color: "#94a3b8" }}>الرابط سيكون صالحاً لمدة 72 ساعة فقط.</p>
          <a href="/" className="btn-home">العودة للرئيسية</a>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .checkout-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          text-align: center;
          direction: rtl;
          font-family: var(--font-cairo), system-ui, sans-serif;
          background: linear-gradient(180deg, #09111f 0%, #0f172a 100%);
          color: #fff;
        }
        .checkout-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 24px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .logo img { height: 80px; width: auto; margin-bottom: 24px; }
        h1 { font-size: 28px; margin-bottom: 12px; color: #f59e0b; }
        p { color: #94a3b8; margin-bottom: 32px; line-height: 1.6; }
        .form-group { margin-bottom: 20px; text-align: right; }
        label { display: block; margin-bottom: 8px; font-size: 14px; color: #cbd5e1; }
        input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #fff;
          font-family: inherit;
          transition: border-color 0.2s;
        }
        input:focus { outline: none; border-color: #f59e0b; }
        .btn-start {
          width: 100%;
          padding: 14px;
          background: #f59e0b;
          color: #000;
          border: none;
          border-radius: 12px;
          font-weight: 900;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
        }
        .btn-start:hover { transform: translateY(-2px); background: #fbbf24; }
        .btn-start:disabled { opacity: 0.5; cursor: not-allowed; }
        #paypal-container-${buttonId} { margin-top: 20px; min-height: 150px; }
        .error-msg { color: #ef4444; margin-top: 12px; font-size: 14px; }
      ` }} />

      <div className="checkout-card">
        <div className="logo">
          <img src="/megacnc_logo_4k.png" alt="MegaCNC Logo" />
        </div>
        <h1>إتمام عملية الشراء</h1>
        <p>يرجى إدخال معلوماتك للمتابعة إلى الدفع الآمن.</p>

        {status === "idle" || status === "pending" || status === "error" ? (
          <>
            <div className="form-group">
              <label>الاسم الكامل</label>
              <input 
                type="text" 
                placeholder="أدخل اسمك الكامل" 
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>البريد الإلكتروني</label>
              <input 
                type="email" 
                placeholder="example@mail.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>رقم الهاتف</label>
              <input 
                type="tel" 
                placeholder="06XXXXXXXX" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            
            <button 
              className="btn-start" 
              onClick={startCheckout}
              disabled={status === "pending"}
            >
              {status === "pending" ? "جاري المعالجة..." : "المتابعة للدفع"}
            </button>
            {status === "error" && <div className="error-msg">حدث خطأ، يرجى المحاولة مرة أخرى.</div>}
          </>
        ) : (
          <div>
            <p>تم حفظ معلوماتك. يرجى إتمام الدفع عبر PayPal أدناه:</p>
            <div id={`paypal-container-${buttonId}`} ref={paypalContainerRef}></div>
            <button onClick={() => setStatus("idle")} style={{ background: "transparent", border: "none", color: "#64748b", cursor: "pointer", marginTop: "10px" }}>تعديل المعلومات</button>
          </div>
        )}

        <div style={{ marginTop: "32px" }}>
          <a href="/" style={{ color: "#64748b", textDecoration: "none", fontSize: "14px" }}>← العودة للرئيسية</a>
        </div>
      </div>

      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${clientId}&components=hosted-buttons&disable-funding=venmo&currency=USD`}
        onLoad={() => {
          const event = new CustomEvent("paypal-loaded");
          window.dispatchEvent(event);
        }}
      />
    </div>
  );
}
