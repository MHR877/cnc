"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";
import Link from "next/link";

interface FileItem {
  name: string;
  type: "directory" | "file";
  size: number;
  path: string;
}

interface CheckoutData {
  id: string;
  full_name: string;
  email: string;
  payment_id?: string;
  created_at: string;
  status: string;
}

export default function DownloadPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);

  const [currentDir, setCurrentDir] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [fetchingFiles, setFetchingFiles] = useState(false);

  const getFingerprint = () => {
    if (typeof window === "undefined") return "";
    return btoa(`${navigator.userAgent}-${screen.width}x${screen.height}-${navigator.language}`);
  };

  useEffect(() => {
    const verifyAccess = async () => {
      if (!token) return;

      // Development Fake Token Bypass
      if (process.env.NODE_ENV === "development" && token === "test-token") {
        setAuthorized(true);
        setCheckoutData({
          id: "test-checkout-123",
          payment_id: "PAY-TEST-TOKEN",
          full_name: "مستخدم المطورين",
          email: "test@domain.com",
          created_at: new Date().toISOString(),
          status: "completed"
        });
        setLoading(false);
        return;
      }

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

      if (diffHours > 72) {
        setErrorMsg("انتهت صلاحية رابط التحميل (أكثر من 72 ساعة).");
        setLoading(false);
        return;
      }

      // 3. Check IP & Fingerprint (Security)
      if (data.ip_address !== currentIp || data.fingerprint !== currentFingerprint) {
        setErrorMsg("عذراً، لا يمكنك الوصول للملفات من هذا الجهاز أو الشبكة (أمان إضافي).");
        setLoading(false);
        return;
      }

      setAuthorized(true);
      setCheckoutData(data as CheckoutData);
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

  // Fetch files when authorized or when current directory changes
  useEffect(() => {
    if (!authorized) return;
    const fetchFiles = async () => {
      setFetchingFiles(true);
      try {
        const res = await fetch(`/api/files?dir=${encodeURIComponent(currentDir)}`);
        const data = await res.json();
        if (data.files) setFiles(data.files);
      } catch (err) {
        console.error("Failed to fetch files", err);
      } finally {
        setFetchingFiles(false);
      }
    };
    fetchFiles();
  }, [authorized, currentDir]);

  const handleNavigate = (path: string) => setCurrentDir(path);
  const handleNavigateUp = () => {
    if (!currentDir) return;
    const parts = currentDir.split("/");
    parts.pop();
    setCurrentDir(parts.join("/"));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024, sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Group files by base name for visual images
  const { directories, groupedFiles } = useMemo(() => {
    const dirs: FileItem[] = [];
    const groups: Record<string, { baseName: string, items: FileItem[], thumbnail: string | null }> = {};
    
    files.forEach(file => {
      if (file.type === "directory") {
        dirs.push(file);
        return;
      }
      
      const lastDot = file.name.lastIndexOf('.');
      const hasExt = lastDot !== -1;
      const baseName = hasExt ? file.name.substring(0, lastDot) : file.name;
      const ext = hasExt ? file.name.substring(lastDot + 1).toLowerCase() : "";

      if (!groups[baseName]) {
        groups[baseName] = { baseName, items: [], thumbnail: null };
      }
      
      groups[baseName].items.push(file);
      
      // Look for a corresponding image file to act as the thumbnail
      if (['jpg', 'jpeg', 'png', 'svg', 'gif', 'webp'].includes(ext)) {
        groups[baseName].thumbnail = `/files/${file.path}`;
      }
    });

    return { directories: dirs, groupedFiles: Object.values(groups) };
  }, [files]);

  if (loading) return (
    <div style={{ background: "#060b14", color: "#fff", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cairo), sans-serif" }}>
      جاري التحقق من صلاحية الوصول...
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060b14",
      color: "#fff",
      fontFamily: "var(--font-cairo), sans-serif",
      direction: "rtl",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      padding: "20px 0"
    }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .download-card {
          background: rgba(255,255,255,0.01);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 40px;
          border-radius: 32px;
          max-width: 1300px;
          width: 95%;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
          backdrop-filter: blur(20px);
        }
        .header-content { text-align: center; margin-bottom: 40px; }
        .success-icon { font-size: 64px; color: #f59e0b; margin-bottom: 24px; filter: drop-shadow(0 0 15px rgba(245,158,11,0.3)); }
        .error-icon { font-size: 64px; color: #ef4444; margin-bottom: 24px; }
        h1 { font-size: 32px; margin-bottom: 16px; font-weight: 900; background: linear-gradient(135deg, #fff 0%, #cbd5e1 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        p { color: #94a3b8; line-height: 1.6; max-width: 600px; margin: 0 auto 32px; font-size: 17px; }
        .expiry-note { margin-top: 48px; font-size: 15px; color: #ef4444; opacity: 0.9; text-align: center; font-weight: 700; }
        .info-panel { 
          display: grid; 
          grid-template-columns: repeat(3, 1fr); 
          gap: 20px; 
          margin-bottom: 48px;
          background: rgba(255,255,255,0.03);
          padding: 24px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .info-box { text-align: right; }
        .info-label { color: #64748b; font-size: 13px; font-weight: 800; display: block; margin-bottom: 4px; text-transform: uppercase; }
        .info-val { color: #cbd5e1; font-size: 15px; font-weight: 700; }
        
        /* Explorer UI */
        .file-explorer { background: rgba(0,0,0,0.4); border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
        .explorer-header { 
          background: rgba(255,255,255,0.02); 
          padding: 24px; 
          display: flex; 
          align-items: center; 
          gap: 16px; 
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .path-crumb { flex: 1; font-family: monospace; color: #f59e0b; font-size: 14px; direction: ltr; text-align: right; opacity: 0.8; }
        .back-btn { 
          background: #f59e0b; 
          color: #000; 
          border: none; 
          border-radius: 10px; 
          padding: 8px 18px; 
          cursor: pointer; 
          font-weight: 900;
          transition: 0.2s;
        }
        .back-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
        
        /* Directory List */
        .dir-row { 
          display: flex; 
          align-items: center; 
          padding: 16px 24px; 
          border-bottom: 1px solid rgba(255,255,255,0.04); 
          transition: background 0.2s; 
          cursor: pointer; 
          text-decoration: none; 
          color: white; 
        }
        .dir-row:hover { background: rgba(245,158,11,0.05); }
        .dir-icon { font-size: 24px; margin-left: 20px; }
        .dir-name { font-weight: 700; font-size: 16px; flex: 1; }
        .dir-arrow { color: #f59e0b; font-weight: 900; }

        /* Visual Gallery */
        .design-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
          padding: 32px;
        }
        .design-card {
           background: rgba(255,255,255,0.02);
           border: 1px solid rgba(255,255,255,0.06);
           border-radius: 20px;
           overflow: hidden;
           display: flex;
           flex-direction: column;
           transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .design-card:hover { 
          transform: translateY(-8px); 
          border-color: rgba(245,158,11,0.4); 
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          background: rgba(255,255,255,0.04);
        }
        .design-thumb {
          height: 220px;
          background-color: #000;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 56px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }
        .preview-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%);
        }
        .card-content { padding: 20px; }
        .design-title { display: block; font-weight: 800; font-size: 16px; margin-bottom: 16px; color: #fff; line-height: 1.4; }
        .formats-list { display: flex; flex-direction: column; gap: 8px; }
        .dl-link {
          background: rgba(255,255,255,0.05);
          color: #cbd5e1;
          text-decoration: none;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          padding: 12px 16px;
          border-radius: 12px;
          transition: 0.2s;
          border: 1px solid rgba(255,255,255,0.04);
          font-weight: 700;
        }
        .dl-link:hover { 
          background: #f59e0b; 
          color: #000; 
          border-color: #f59e0b; 
          transform: scale(1.02);
        }
        .ext-badge { font-family: monospace; font-size: 11px; padding: 2px 6px; background: rgba(255,255,255,0.1); border-radius: 4px; }
      ` }} />

      <div className="download-card">
        {authorized && checkoutData ? (
          <>
            <div className="header-content">
              <div className="success-icon">💎</div>
              <h1>مرحباً بك مجدداً، {checkoutData.full_name.split(' ')[0]}</h1>
              <p>مكتبة MegaCNC الكاملة تحت تصرفك الآن. ابدأ بتصفح المجلدات وتحميل التصاميم التي تحتاجها لمشاريعك.</p>
              
              <div className="info-panel">
                <div className="info-box"><span className="info-label">رقم الطلب</span><span className="info-val">#{checkoutData.payment_id || checkoutData.id.slice(0,8)}</span></div>
                <div className="info-box"><span className="info-label">البريد الإلكتروني</span><span className="info-val">{checkoutData.email}</span></div>
                <div className="info-box"><span className="info-label">تاريخ الشراء</span><span className="info-val">{new Date(checkoutData.created_at).toLocaleDateString("ar-EG")}</span></div>
              </div>
            </div>

            <div className="file-explorer">
              <div className="explorer-header">
                {currentDir !== "" && (
                  <button onClick={handleNavigateUp} className="back-btn">
                    رجوع
                  </button>
                )}
                <div className="path-crumb">/ {currentDir || "ROOT"}</div>
              </div>
              
              <div style={{ minHeight: "300px" }}>
                {fetchingFiles ? (
                  <div style={{ padding: "64px", textAlign: "center", color: "#64748b" }}>
                    <div style={{ fontSize: "32px", marginBottom: "16px" }}>🔄</div>
                    جاري جلب الملفات...
                  </div>
                ) : files.length === 0 ? (
                  <div style={{ padding: "64px", textAlign: "center", color: "#64748b" }}>
                     لا توجد ملفات في هذا المجلد
                  </div>
                ) : (
                  <>
                    {/* Folders Section */}
                    {directories.map((dir, idx) => (
                      <div key={dir.path || idx} className="dir-row" onClick={() => handleNavigate(dir.path)}>
                        <div className="dir-icon">📁</div>
                        <div className="dir-name">{dir.name}</div>
                        <div className="dir-arrow">←</div>
                      </div>
                    ))}

                    {/* Designs Gallery Grid */}
                    {groupedFiles.length > 0 && (
                      <div className="design-grid">
                        {groupedFiles.map((group, idx) => (
                          <div key={idx} className="design-card">
                            <div className="design-thumb" style={{ 
                              backgroundImage: group.thumbnail ? `url('${group.thumbnail}')` : "none" 
                            }}>
                              {!group.thumbnail && "📐"}
                              <div className="preview-overlay"></div>
                            </div>
                            
                            <div className="card-content">
                              <span className="design-title">{group.baseName}</span>
                              <div className="formats-list">
                                {group.items.map((item, idj) => {
                                  const nameParts = item.name.split('.');
                                  const ext = nameParts.length > 1 ? nameParts.pop()?.toUpperCase() : "FILE";
                                  return (
                                    <a key={idj} href={`/files/${item.path}`} download className="dl-link" target="_blank" rel="noreferrer">
                                      <span>تحميل التصميم ({formatSize(item.size)})</span>
                                      <span className="ext-badge">{ext}</span>
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="expiry-note">
              ⚠️ تنبيه: هذا الرابط مخصص للاستخدام الشخصي فقط وسينتهي مفعوله بعد 72 ساعة من وقت الشراء.
            </div>
          </>
        ) : (
          <div className="header-content">
            <div className="error-icon">🔒</div>
            <h1>عذراً، الوصول غير مسموح</h1>
            <p>{errorMsg}</p>
            <Link href="/" style={{ color: "#f59e0b", textDecoration: "none", fontWeight: "900", fontSize: "18px" }}>العودة للرئيسية</Link>
          </div>
        )}
      </div>
    </div>
  );
}
