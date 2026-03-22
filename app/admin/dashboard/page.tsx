"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { LayoutDashboard, Users, CreditCard, LogOut, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const [checkouts, setCheckouts] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{name: string, orders: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, lastMonth: 0 });
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      // Fetch Checkouts
      const { data } = await supabase
        .from("checkouts")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setCheckouts(data);
        
        const completed = data.filter((c: any) => c.status === "completed");
        setStats({
          totalRevenue: completed.reduce((acc: number, curr: any) => acc + Number(curr.amount || 0), 0),
          totalOrders: completed.length,
          lastMonth: completed.filter((c: any) => new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
        });

        // Prepare chart data (last 7 days)
        const baseDate = new Date();
        baseDate.setHours(0,0,0,0);
        const newChartData = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(baseDate.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
          const dateStr = d.toLocaleDateString();
          const count = data.filter((c: any) => 
            c.status === "completed" && new Date(c.created_at).toLocaleDateString() === dateStr
          ).length;
          return { name: dateStr, orders: count };
        });
        setChartData(newChartData);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };


  if (loading) return <div style={{ background: "#09111f", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>جاري التحميل...</div>;

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
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
        .stat-card {
          background: rgba(255,255,255,0.05);
          padding: 24px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .stat-card h3 { font-size: 14px; color: #94a3b8; margin-bottom: 8px; }
        .stat-card .val { font-size: 32px; font-weight: 900; color: #f59e0b; }
        .chart-box {
          background: rgba(255,255,255,0.03);
          padding: 24px;
          border-radius: 24px;
          margin-bottom: 40px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: right; padding: 12px; color: #94a3b8; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.1); }
        td { padding: 16px 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .status-pill {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        .status-completed { background: rgba(34,197,94,0.1); color: #22c55e; }
        .status-pending { background: rgba(245,158,11,0.1); color: #f59e0b; }
        .status-failed { background: rgba(239,68,68,0.1); color: #ef4444; }
      ` }} />
      
      <div className="sidebar">
        <h2 style={{ color: "#f59e0b", marginBottom: "40px", fontSize: "24px" }}>CNC Admin</h2>
        <a href="/admin/dashboard" className="nav-item active"><LayoutDashboard size={20} /> لوحة التحكم</a>
        <a href="/admin/checkouts" className="nav-item"><CreditCard size={20} /> جميع الطلبات</a>
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
            <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>أهلاً بك أدمن 👋</h1>
            <p style={{ color: "#94a3b8" }}>هذا ما يحدث في متجرك اليوم.</p>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <h3>إجمالي الإيرادات</h3>
              <TrendingUp size={16} color="#22c55e" />
            </div>
            <div className="val">${stats.totalRevenue.toFixed(2)}</div>
          </div>
          <div className="stat-card">
            <h3>إجمالي الطلبات</h3>
            <div className="val">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <h3>طلبات آخر 30 يوم</h3>
            <div className="val">{stats.lastMonth}</div>
          </div>
        </div>

        <div className="chart-box">
          <h3 style={{ marginBottom: "24px" }}>معدل المبيعات (آخر 7 أيام)</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ background: "#1e293b", border: "none", borderRadius: "8px" }}
                  itemStyle={{ color: "#f59e0b" }}
                />
                <Bar dataKey="orders" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-box" style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>
          <h3 style={{ marginBottom: "24px" }}>أحدث الطلبات</h3>
          <table>
            <thead>
              <tr>
                <th>العميل</th>
                <th>بيانات الاتصال</th>
                <th>المبلغ</th>
                <th>الحالة</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {checkouts.slice(0, 10).map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: "bold" }}>{c.full_name}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: "14px" }}>{c.email}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>{c.phone}</div>
                  </td>
                  <td>${c.amount}</td>
                  <td>
                    <span className={`status-pill status-${c.status}`}>
                      {c.status === "completed" ? "مكتمل" : c.status === "pending" ? "جاري" : "فاشل"}
                    </span>
                  </td>
                  <td style={{ fontSize: "12px", color: "#64748b" }}>
                    {new Date(c.created_at).toLocaleDateString()}
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
