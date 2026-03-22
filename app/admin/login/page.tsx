"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setError("فشل تسجيل الدخول. يرجى التحقق من البيانات.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#09111f",
      fontFamily: "var(--font-cairo), sans-serif",
      direction: "rtl",
      padding: "20px"
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .login-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 40px;
          border-radius: 20px;
          max-width: 400px;
          width: 100%;
          text-align: center;
        }
        h1 { color: #f59e0b; margin-bottom: 24px; }
        .form-group { margin-bottom: 20px; text-align: right; }
        label { display: block; margin-bottom: 8px; color: #94a3b8; }
        input {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(0,0,0,0.2);
          color: #fff;
        }
        button {
          width: 100%;
          padding: 14px;
          background: #f59e0b;
          color: #000;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        }
        .error { color: #ef4444; margin-top: 10px; font-size: 14px; }
      ` }} />
      <div className="login-card">
        <h1>لوحة التحكم</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "جاري التحميل..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
