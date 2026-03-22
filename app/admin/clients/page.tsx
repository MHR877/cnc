"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, CreditCard, LogOut, Search, Mail, Phone, ShoppingBag 
} from 'lucide-react';

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (data) {
        // Group by email to get unique clients
        const clientGroups: Record<string, any> = {};
        data.forEach(c => {
          if (!clientGroups[c.email]) {
            clientGroups[c.email] = {
              email: c.email,
              full_name: c.full_name,
              phone: c.phone,
              total_orders: 0,
              total_spend: 0,
              last_purchase: c.created_at
            };
          }
          clientGroups[c.email].total_orders += 1;
          clientGroups[c.email].total_spend += Number(c.amount || 0);
        });
        setClients(Object.values(clientGroups));
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const filteredClients = clients.filter(c => 
    c.full_name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

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
        }
        .search-input {
          flex: 1;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 40px 12px 16px;
          border-radius: 12px;
          color: #fff;
          font-family: inherit;
        }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
        .client-card {
          background: rgba(255,255,255,0.03);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.05);
          padding: 24px;
          transition: transform 0.2s;
        }
        .client-card:hover { transform: translateY(-4px); border-color: rgba(245,158,11,0.2); }
        .avatar {
          width: 50px; height: 50px; border-radius: 14px;
          background: #f59e0b; color: #000;
          display: grid; place-items: center;
          font-weight: 900; font-size: 20px;
          margin-bottom: 16px;
        }
        .client-name { font-size: 18px; font-weight: bold; margin-bottom: 4px; }
        .client-email { font-size: 14px; color: #94a3b8; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
        .stats-row { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; margin-top: 16px; }
        .stat-item { text-align: center; }
        .stat-label { font-size: 11px; color: #64748b; margin-bottom: 4px; text-transform: uppercase; }
        .stat-val { font-size: 15px; font-weight: bold; color: #f8fafc; }
        .val-gold { color: #f59e0b; }
      ` }} />

      <div className="sidebar">
        <h2 style={{ color: "#f59e0b", marginBottom: "40px", fontSize: "24px" }}>CNC Admin</h2>
        <a href="/admin/dashboard" className="nav-item"><LayoutDashboard size={20} /> لوحة التحكم</a>
        <a href="/admin/checkouts" className="nav-item"><CreditCard size={20} /> جميع الطلبات</a>
        <a href="/admin/clients" className="nav-item active"><Users size={20} /> العملاء</a>
        <div style={{ marginTop: "auto" }}>
          <button onClick={handleLogout} className="nav-item" style={{ background: "transparent", border: "none", width: "100%", cursor: "pointer" }}>
            <LogOut size={20} /> تسجيل الخروج
          </button>
        </div>
      </div>

      <div className="main-content">
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "40px" }}>
          <div>
            <h1 style={{ fontSize: "28px", marginBottom: "4px" }}>إدارة العملاء</h1>
            <p style={{ color: "#94a3b8" }}>لديك {clients.length} عميل مميز قاموا بالشراء.</p>
          </div>
        </header>

        <div className="controls">
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={18} style={{ position: "absolute", right: "14px", top: "14px", color: "#64748b" }} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="البحث بالاسم، البريد، أو الهاتف..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid">
          {filteredClients.map((client, i) => (
            <div key={i} className="client-card">
              <div className="avatar">{client.full_name.charAt(0)}</div>
              <div className="client-name">{client.full_name}</div>
              <div className="client-email"><Mail size={14} /> {client.email}</div>
              {client.phone && <div className="client-email"><Phone size={14} /> {client.phone}</div>}
              
              <div className="stats-row">
                <div className="stat-item">
                  <div className="stat-label">إجمالي الطلبات</div>
                  <div className="stat-val"><ShoppingBag size={12} style={{ marginLeft: "4px" }} /> {client.total_orders}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">المبلغ المدفوع</div>
                  <div className="stat-val val-gold">${client.total_spend.toFixed(2)}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">آخر شراء</div>
                  <div className="stat-val" style={{ fontSize: "12px" }}>{new Date(client.last_purchase).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
