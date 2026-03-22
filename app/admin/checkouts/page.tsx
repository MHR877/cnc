"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, CreditCard, LogOut, Search, Mail, ExternalLink 
} from 'lucide-react';

export default function AdminCheckouts() {
  const [checkouts, setCheckouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const { data } = await supabase
        .from("checkouts")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setCheckouts(data);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const filteredCheckouts = checkouts.filter(c => {
    const matchesSearch = c.full_name.toLowerCase().includes(search.toLowerCase()) || 
                         c.email.toLowerCase().includes(search.toLowerCase()) ||
                         (c.payment_id && c.payment_id.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div style={{ background: "#09111f", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cairo), sans-serif" }}>جاري التحميل...</div>;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#09111f",
      color: "#fff",
      fontFamily: "var(--font-cairo), sans-serif",
      direction: "rtl",
      display: "flex"
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar {
          width: 260px;
          background: rgba(255,255,255,0.03);
          border-left: 1px solid rgba(255,255,255,0.1);
          padding: 30px 20px;
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          height: 100vh;
        }
        .main-content { flex: 1; padding: 40px; }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #94a3b8;
          text-decoration: none;
          margin-bottom: 8px;
          transition: 0.2s;
        }
        .nav-item.active { background: #f59e0b; color: #000; }
        .nav-item:hover:not(.active) { background: rgba(255,255,255,0.05); color: #fff; }
        
        .controls {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .search-input {
          flex: 1;
          min-width: 300px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 40px 12px 16px;
          border-radius: 12px;
          color: #fff;
          font-family: inherit;
        }
        .select-filter {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 16px;
          border-radius: 12px;
          color: #fff;
          font-family: inherit;
        }
        
        .table-container {
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.05);
          overflow: hidden;
        }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: right; padding: 16px; color: #94a3b8; font-size: 14px; background: rgba(0,0,0,0.2); }
        td { padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 15px; }
        
        .status-pill {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-completed { background: rgba(34,197,94,0.1); color: #22c55e; }
        .status-pending { background: rgba(245,158,11,0.1); color: #f59e0b; }
        .status-failed { background: rgba(239,68,68,0.1); color: #ef4444; }
        .status-cancelled { background: rgba(148,163,184,0.1); color: #94a3b8; }
        
        .action-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,.1);
          padding: 8px;
          border-radius: 8px;
          color: #94a3b8;
          cursor: pointer;
          transition: 0.2s;
        }
        .action-btn:hover { background: rgba(255,255,255,.1); color: #fff; }
      ` }} />

      <div className="sidebar">
        <h2 style={{ color: "#f59e0b", marginBottom: "40px", fontSize: "24px" }}>CNC Admin</h2>
        <a href="/admin/dashboard" className="nav-item"><LayoutDashboard size={20} /> لوحة التحكم</a>
        <a href="/admin/checkouts" className="nav-item active"><CreditCard size={20} /> جميع الطلبات</a>
        <a href="/admin/clients" className="nav-item"><Users size={20} /> العملاء</a>
        <div style={{ marginTop: "auto" }}>
          <button onClick={handleLogout} className="nav-item" style={{ background: "transparent", border: "none", width: "100%", cursor: "pointer" }}>
            <LogOut size={20} /> تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="main-content">
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>سجل الطلبات</h1>
            <p style={{ color: "#94a3b8" }}>إجمالي {filteredCheckouts.length} طلب مطابق للفلاتر.</p>
          </div>
        </header>

        <div className="controls">
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", right: "14px", top: "14px", color: "#64748b" }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="البحث بالاسم، البريد، أو رقم الدفع..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">جميع الحالات</option>
            <option value="completed">مكتمل</option>
            <option value="pending">جاري</option>
            <option value="failed">فاشل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>العميل</th>
                <th>رقم الدفع (PayPal)</th>
                <th>المبلغ</th>
                <th>الحالة</th>
                <th>IP / الجهاز</th>
                <th>التاريخ</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheckouts.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: "bold" }}>{c.full_name}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{c.email} • {c.phone}</div>
                  </td>
                  <td style={{ fontSize: "13px", fontFamily: "monospace" }}>
                    {c.payment_id || <span style={{ color: "#64748b" }}>N/A</span>}
                  </td>
                  <td style={{ fontWeight: "bold" }}>${c.amount}</td>
                  <td>
                    <span className={`status-pill status-${c.status}`}>
                      {c.status === "completed" ? "مكتمل" : c.status === "pending" ? "جاري" : c.status === "cancelled" ? "ملغي" : "فاشل"}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: "12px" }}>{c.ip_address}</div>
                    <div style={{ fontSize: "10px", color: "#64748b", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>{c.fingerprint}</div>
                  </td>
                  <td style={{ fontSize: "13px", color: "#94a3b8" }}>
                    {new Date(c.created_at).toLocaleString('ar-EG')}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button className="action-btn" title="إعادة إرسال البريد" onClick={() => {
                        fetch("/api/send-email", {
                          method: "POST",
                          body: JSON.stringify({ email: c.email, fullName: c.full_name, token: c.access_token })
                        });
                        alert("تمت محاولة إعادة إرسال البريد");
                      }}>
                        <Mail size={16} />
                      </button>
                      <a href={`/download/${c.access_token}`} className="action-btn" target="_blank" title="رابط التحميل">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
