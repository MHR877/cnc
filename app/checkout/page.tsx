"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    paypal: any;
  }
}

export default function Checkout() {
  useEffect(() => {
    const initPayPal = () => {
      const win = window as any;
      if (win.paypal && win.paypal.HostedButtons) {
        const container = document.querySelector("#paypal-container-F9B3NNT4K8YHN");
        if (container && container.innerHTML === "") {
          win.paypal.HostedButtons({
            hostedButtonId: "F9B3NNT4K8YHN",
          }).render("#paypal-container-F9B3NNT4K8YHN");
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
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      textAlign: "center",
      direction: "rtl",
      fontFamily: "var(--font-cairo), system-ui, sans-serif",
      background: "linear-gradient(180deg, #09111f 0%, #0f172a 100%)",
      color: "#fff"
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .checkout-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 24px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
        }
        .logo {
          margin-bottom: 24px;
        }
        .logo img {
          height: 80px;
          width: auto;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 12px;
          color: #f59e0b;
        }
        p {
          color: #94a3b8;
          margin-bottom: 32px;
          line-height: 1.6;
        }
        .back-link {
          margin-top: 24px;
          color: #64748b;
          text-decoration: none;
          font-size: 14px;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: #94a3b8;
        }
      ` }} />

      <div className="checkout-card">
        <div className="logo">
          <img src="/megacnc_logo_4k.png" alt="MegaCNC Logo" />
        </div>
        <h1>إتمام عملية الشراء</h1>
        <p>أنت على وشك الحصول على مكتبة MegaCNC الكاملة (+10,000 نموذج). يرجى إتمام الدفع عبر PayPal أدناه.</p>
        
        <div id="paypal-container-F9B3NNT4K8YHN"></div>

        <a href="/" className="back-link">← العودة للرئيسية</a>
      </div>

      <Script
        src="https://www.paypal.com/sdk/js?client-id=BAAM-e55iDoQOdggojTqOpCsyUyTyC5inIt2r7L4YFsnVPybcjbWffSrWSnQOtbE8KWWIkDAFWHwtZjj3g&components=hosted-buttons&disable-funding=venmo&currency=USD"
        onLoad={() => {
          const event = new CustomEvent("paypal-loaded");
          window.dispatchEvent(event);
        }}
      />
    </div>
  );
}
