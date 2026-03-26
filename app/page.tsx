"use client";

import { useEffect, useState } from "react";


export default function Home() {
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    // Countdown Logic
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    targetDate.setHours(targetDate.getHours() + 14);
    targetDate.setMinutes(targetDate.getMinutes() + 37);
    targetDate.setSeconds(targetDate.getSeconds() + 22);

    const pad = (num: number) => String(num).padStart(2, "0");

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance <= 0) {
        setCountdown({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountdown({
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    // Intersection Observer for Reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root{
          --bg:#0b1120;
          --bg-soft:#121b30;
          --panel:#16233a;
          --panel-2:#1d2d49;
          --line:#30425f;
          --text:#f8fafc;
          --muted:#cbd5e1;
          --gold:#f59e0b;
          --gold-soft:#fbbf24;
          --accent:#ff6a00;
          --accent-2:#ff9a00;
          --green:#22c55e;
          --red:#ef4444;
          --shadow:0 24px 60px rgba(0,0,0,.28);
          --radius:24px;
          --radius-sm:18px;
          --max:2020px;
        }

        *{box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{
          margin:0;
          padding-top:72px;
          font-family:var(--font-cairo),system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
          background:
            radial-gradient(circle at top right, rgba(245,158,11,.12), transparent 22%),
            radial-gradient(circle at top left, rgba(255,106,0,.10), transparent 18%),
            linear-gradient(180deg, #09111f 0%, #0f172a 38%, #111b31 100%);
          color:var(--text);
          line-height:1.75;
        }

        a{color:inherit;text-decoration:none}
        img{max-width:100%;display:block}
        .container{width:min(calc(100% - 32px),var(--max));margin-inline:auto}
        .section{padding:88px 0;position:relative}
        .section-title{
          text-align:center;
          margin:0 0 14px;
          font-size:clamp(30px,3vw,48px);
          line-height:1.2;
          font-weight:900;
          color:#fff;
        }
        .section-title .gold{color:var(--gold)}
        .section-sub{
          max-width:780px;
          margin:0 auto 42px;
          text-align:center;
          color:var(--muted);
          font-size:18px;
        }

        /* Top Offer Banner */
        .top-offer-banner{
          position:fixed;
          top:0;
          left:0;
          right:0;
          z-index:1200;
          background:linear-gradient(90deg,#16a34a 0%, #22c55e 35%, #dc2626 100%);
          color:#fff;
          box-shadow:0 10px 30px rgba(0,0,0,.22);
          border-bottom:1px solid rgba(255,255,255,.15);
        }
        .top-offer-banner .banner-inner{
          width:min(calc(100% - 24px),var(--max));
          margin-inline:auto;
          min-height:60px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:14px;
          padding:10px 0;
        }
        .top-offer-banner .banner-text{
          display:flex;
          align-items:center;
          gap:12px;
        }
        .top-offer-banner .flag{
          width:42px;
          height:42px;
          border-radius:14px;
          display:grid;
          place-items:center;
          background:rgba(255,255,255,.18);
          border:1px solid rgba(255,255,255,.22);
          font-size:22px;
          flex:0 0 42px;
        }
        .top-offer-banner .banner-copy strong{
          display:block;
          font-size:17px;
          font-weight:900;
          line-height:1.2;
        }
        .top-offer-banner .banner-copy span{
          display:block;
          font-size:13px;
          font-weight:700;
          opacity:.96;
          line-height:1.4;
        }
        .top-offer-banner .banner-btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          min-height:42px;
          padding:0 18px;
          border-radius:999px;
          background:#fff;
          color:#166534;
          font-weight:900;
          font-size:14px;
          white-space:nowrap;
          box-shadow:0 8px 20px rgba(0,0,0,.15);
          transition:.25s ease;
        }
        .top-offer-banner .banner-btn:hover{
          transform:translateY(-1px);
        }

        .hero{
          padding:28px 0 88px;
          position:relative;
          overflow:hidden;
        }
        .hero:before,
        .hero:after{
          content:"";
          position:absolute;
          width:360px;
          height:360px;
          filter:blur(25px);
          opacity:.18;
          z-index:0;
          border-radius:50%;
        }
        .hero:before{top:-110px;right:-100px;background:var(--gold)}
        .hero:after{bottom:-120px;left:-120px;background:var(--accent)}

        .topbar{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:16px;
          padding:10px 0 26px;
          position:relative;
          z-index:2;
        }
        .logo{
          display:flex;
          align-items:center;
          gap:14px;
          font-weight:900;
          font-size:21px;
        }
        .logo img{height:350px;width:auto;object-fit:contain}
        .logo-badge{
          width:46px;height:46px;border-radius:15px;
          display:grid;place-items:center;
          background:linear-gradient(135deg,var(--accent),var(--accent-2));
          box-shadow:0 12px 30px rgba(255,106,0,.35);
          font-weight:900;
        }
        .topbar-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
        .mini-pill{
          padding:10px 16px;
          border-radius:999px;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.10);
          color:#e8eef8;
          font-size:14px;
          font-weight:800;
        }

        .hero-grid{
          display:grid;
          grid-template-columns:1.02fr .98fr;
          gap:34px;
          align-items:center;
          position:relative;
          z-index:2;
        }
        .eyebrow{
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:10px 16px;
          border-radius:999px;
          border:1px solid rgba(245,158,11,.25);
          background:rgba(245,158,11,.08);
          color:#ffe4a6;
          font-weight:800;
          margin-bottom:18px;
        }
        .hero h1{
          margin:0 0 16px;
          font-size:clamp(36px,5vw,66px);
          line-height:1.12;
          font-weight:900;
          letter-spacing:-.02em;
        }
        .hero h1 .accent{color:var(--gold-soft)}
        .hero p{
          margin:0 0 24px;
          color:var(--muted);
          font-size:20px;
          max-width:720px;
        }
        .hero-list{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:12px 18px;
          margin:0 0 28px;
          padding:0;
          list-style:none;
        }
        .hero-list li{
          display:flex;
          align-items:flex-start;
          gap:10px;
          color:#e7edf7;
          font-weight:700;
        }
        .check{
          flex:0 0 26px;
          width:26px;height:26px;border-radius:50%;
          display:grid;place-items:center;
          background:rgba(34,197,94,.16);
          color:var(--green);
          border:1px solid rgba(34,197,94,.25);
          font-size:14px;
          margin-top:2px;
        }
        .hero-actions{
          display:flex;
          flex-wrap:wrap;
          gap:14px;
          margin-bottom:18px;
        }
        .btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:10px;
          min-height:58px;
          padding:0 28px;
          border-radius:16px;
          font-weight:800;
          font-size:18px;
          transition:.25s ease;
          cursor:pointer;
          border:none;
        }
        .btn-primary{
          color:white;
          background:linear-gradient(90deg,var(--accent),var(--accent-2));
          box-shadow:0 16px 36px rgba(255,106,0,.32);
        }
        .btn-primary:hover{transform:translateY(-2px);box-shadow:0 20px 40px rgba(255,106,0,.42)}
        .btn-secondary{
          color:var(--text);
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.12);
          backdrop-filter:blur(8px);
        }
        .btn-secondary:hover{transform:translateY(-2px);background:rgba(255,255,255,.08)}

        .trust-row{
          display:flex;
          flex-wrap:wrap;
          gap:14px 18px;
          color:#dce4ee;
          font-size:15px;
          font-weight:700;
          margin-bottom:20px;
        }
        .trust-row span{display:flex;align-items:center;gap:8px;opacity:.95}

        .offer-strip{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:12px;
          margin-top:16px;
        }
        .offer-chip{
          padding:14px 16px;
          border-radius:18px;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.1);
          color:#eef4fb;
          font-weight:800;
          text-align:center;
          font-size:15px;
        }

        .hero-card{
          position:relative;
          background:linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03));
          border:1px solid rgba(255,255,255,.10);
          border-radius:30px;
          padding:20px;
          box-shadow:var(--shadow);
          backdrop-filter:blur(12px);
          overflow:hidden;
        }
        .hero-card:before{
          content:"";
          position:absolute;inset:0;
          background:radial-gradient(circle at top right, rgba(255,255,255,.14), transparent 30%);
          pointer-events:none;
        }

        .preview-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        .preview-tile{
          aspect-ratio:1/1;
          border-radius:18px;
          padding:14px;
          display:flex;
          align-items:flex-end;
          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;
          border:1px solid rgba(255,255,255,.12);
          box-shadow:inset 0 1px 0 rgba(255,255,255,.12);
          position:relative;
          overflow:hidden;
        }
        .preview-tile:before{
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.45)),
            radial-gradient(circle at top right, rgba(255,255,255,.22), transparent 32%);
        }
        .preview-tile strong{
          position:relative;
          z-index:1;
          background:rgba(15,23,42,.72);
          border:1px solid rgba(255,255,255,.10);
          padding:8px 12px;
          border-radius:999px;
          font-size:14px;
        }

        .stats-float{
          position:absolute;
          left:-18px;
          bottom:22px;
          background:#fff;
          color:#0f172a;
          border-radius:20px;
          padding:16px 18px;
          box-shadow:0 22px 44px rgba(0,0,0,.22);
          width:min(260px,82%);
        }
        .stats-float b{display:block;font-size:30px;line-height:1;color:#111827;margin-bottom:6px}
        .stats-float span{color:#475569;font-weight:800;font-size:14px}

        .price-box{
          margin-top:18px;
          padding:18px;
          border-radius:24px;
          background:linear-gradient(180deg, rgba(255,154,0,.12), rgba(255,255,255,.05));
          border:1px solid rgba(255,154,0,.22);
          display:grid;
          grid-template-columns:1fr auto;
          gap:14px;
          align-items:center;
        }
        .price-box small{display:block;color:#fde7b1;font-weight:800;margin-bottom:6px}
        .price-box h3{margin:0;font-size:24px;line-height:1.4}
        .price-tag{text-align:center}
        .price-old{display:block;color:#94a3b8;text-decoration:line-through;font-weight:800}
        .price-new{display:block;font-size:42px;line-height:1;color:var(--gold-soft);font-weight:900}
        .price-note{display:block;color:#e6edf8;font-size:14px;font-weight:700;margin-top:6px}

        .proof-row{
          display:grid;
          grid-template-columns:repeat(4,1fr);
          gap:16px;
          margin-top:32px;
        }
        .proof-card,
        .problem-wrap,
        .solution-wrap,
        .cta-box,
        .faq-wrap,
        .audience-wrap,
        .testimonial-wrap,
        .guarantee-wrap,
        .comparison-wrap,
        .bonus-wrap,
        .countdown-wrap{
          background:linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.025));
          border:1px solid rgba(255,255,255,.08);
          border-radius:30px;
          box-shadow:var(--shadow);
        }
        .proof-card{
          padding:20px;
          text-align:center;
        }
        .proof-card strong{display:block;font-size:30px;color:var(--gold-soft);margin-bottom:6px}
        .proof-card span{color:var(--muted);font-weight:700;font-size:14px}

        .problem-wrap,.solution-wrap,.testimonial-wrap,.guarantee-wrap,.comparison-wrap,.bonus-wrap,.audience-wrap,.faq-wrap,.countdown-wrap{padding:30px}
        .problem-grid,
        .benefits-grid,
        .library-grid,
        .audience-grid,
        .value-grid,
        .testimonial-grid,
        .bonus-grid,
        .guarantee-grid,
        .comparison-grid{
          display:grid;
          gap:18px;
        }
        .problem-grid,.value-grid,.bonus-grid{grid-template-columns:repeat(3,1fr)}
        .benefits-grid,.library-grid{grid-template-columns:repeat(4,1fr)}
        .audience-grid,.testimonial-grid,.guarantee-grid,.comparison-grid{grid-template-columns:repeat(2,1fr)}

        .problem-card,
        .benefit-card,
        .library-card,
        .audience-card,
        .value-card,
        .testimonial-card,
        .bonus-card,
        .guarantee-card,
        .comparison-card{
          background:linear-gradient(180deg,var(--panel),var(--panel-2));
          border:1px solid var(--line);
          border-radius:22px;
          padding:24px;
          transition:.25s ease;
        }
        .problem-card:hover,
        .benefit-card:hover,
        .library-card:hover,
        .audience-card:hover,
        .value-card:hover,
        .testimonial-card:hover,
        .bonus-card:hover,
        .guarantee-card:hover,
        .comparison-card:hover{transform:translateY(-4px)}

        .problem-card .icon,
        .benefit-card .icon,
        .value-card .icon,
        .audience-card .icon,
        .bonus-card .icon,
        .guarantee-card .icon,
        .comparison-card .icon{
          width:54px;height:54px;border-radius:16px;
          display:grid;place-items:center;
          font-size:22px;font-weight:900;
          margin-bottom:14px;
        }
        .problem-card .icon{background:rgba(239,68,68,.12);color:var(--red);border:1px solid rgba(239,68,68,.18)}
        .benefit-card .icon,
        .value-card .icon,
        .audience-card .icon,
        .bonus-card .icon,
        .guarantee-card .icon,
        .comparison-card .icon{background:rgba(245,158,11,.12);color:var(--gold);border:1px solid rgba(245,158,11,.18)}

        .problem-card h3,
        .benefit-card h3,
        .library-card h3,
        .audience-card h3,
        .value-card h3,
        .testimonial-card h3,
        .bonus-card h3,
        .guarantee-card h3,
        .comparison-card h3{margin:0 0 8px;font-size:22px}
        .problem-card p,
        .benefit-card p,
        .library-card p,
        .audience-card p,
        .value-card p,
        .testimonial-card p,
        .bonus-card p,
        .guarantee-card p,
        .comparison-card p{margin:0;color:var(--muted);font-size:16px}

        .highlight-bar{
          margin-top:20px;
          padding:18px 22px;
          border-radius:20px;
          border:1px solid rgba(245,158,11,.16);
          background:rgba(245,158,11,.08);
          text-align:center;
          font-size:20px;
          font-weight:800;
        }
        .highlight-bar .gold{color:var(--gold-soft)}

        .benefit-card ul,
        .bonus-card ul,
        .comparison-card ul{margin:12px 0 0;padding:0;list-style:none;display:grid;gap:8px}
        .benefit-card li,
        .bonus-card li,
        .comparison-card li{color:#ecf2fa;font-weight:700;font-size:15px}

        .library-card{
          min-height:230px;
          display:flex;
          flex-direction:column;
          justify-content:flex-end;
          position:relative;
          overflow:hidden;
          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;
          border:1px solid var(--line);
          border-radius:22px;
          padding:24px;
        }
        .library-card:before{
          content:"";
          position:absolute;
          inset:0;
          background:
            linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.58)),
            radial-gradient(circle at top right, rgba(255,255,255,.16), transparent 30%);
        }
        .library-card h3,.library-card p,.library-card .tag{position:relative;z-index:1}
        .tag{
          position:absolute;
          top:14px;right:14px;z-index:1;
          padding:8px 12px;
          border-radius:999px;
          background:rgba(15,23,42,.68);
          border:1px solid rgba(255,255,255,.12);
          font-size:13px;
          font-weight:800;
        }

        .testimonial-card .stars{font-size:20px;margin-bottom:10px}
        .testimonial-card .name{display:block;margin-top:12px;color:#fff;font-weight:900}
        .testimonial-card .role{display:block;color:#aab7ca;font-size:14px;font-weight:700}

        .comparison-card.good{border-color:rgba(34,197,94,.25)}
        .comparison-card.bad{border-color:rgba(239,68,68,.25)}

        .countdown-wrap{
          display:grid;
          grid-template-columns:1.1fr .9fr;
          gap:24px;
          align-items:center;
          background:
            radial-gradient(circle at top center, rgba(255,154,0,.12), transparent 30%),
            linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.025));
        }
        .countdown-boxes{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
        .time-box{
          text-align:center;
          padding:18px 12px;
          border-radius:20px;
          background:linear-gradient(180deg,var(--panel),var(--panel-2));
          border:1px solid var(--line);
        }
        .time-box strong{display:block;font-size:30px;color:var(--gold-soft);line-height:1;margin-bottom:8px}
        .time-box span{color:var(--muted);font-weight:800;font-size:13px}

        .cta-box{
          padding:44px;
          text-align:center;
          background:
            radial-gradient(circle at top center, rgba(255,154,0,.12), transparent 30%),
            linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.025));
        }
        .cta-box h2{margin:0 0 12px;font-size:clamp(30px,3vw,48px);line-height:1.2}
        .cta-box p{max-width:760px;margin:0 auto 24px;color:var(--muted);font-size:18px}
        .cta-note{margin-top:16px;color:#dfe7f0;font-weight:700;font-size:15px}
        .cta-guarantee{
          margin-top:18px;
          display:inline-flex;
          align-items:center;
          gap:10px;
          padding:12px 18px;
          border-radius:999px;
          background:rgba(34,197,94,.12);
          border:1px solid rgba(34,197,94,.22);
          color:#ddffe9;
          font-weight:800;
        }

        .faq-list{display:grid;gap:16px}
        .faq-item{
          background:linear-gradient(180deg,var(--panel),var(--panel-2));
          border:1px solid var(--line);
          border-radius:20px;
          padding:20px 22px;
        }
        .faq-item h3{margin:0 0 8px;font-size:20px}
        .faq-item p{margin:0;color:var(--muted)}

        .footer{padding:30px 0 50px;text-align:center;color:#94a3b8;font-weight:700}

        .reveal{
          opacity:0;
          transform:translateY(24px);
          transition:opacity .7s ease, transform .7s ease;
        }
        .reveal.in-view{
          opacity:1;
          transform:translateY(0);
        }

        .floating-whatsapp{
          position:fixed;
          left:18px;
          bottom:18px;
          z-index:1000;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:2px;
          min-width:88px;
          min-height:88px;
          padding:12px;
          border-radius:999px;
          background:linear-gradient(135deg,#16a34a,#22c55e);
          color:#fff;
          box-shadow:0 18px 38px rgba(34,197,94,.35);
          border:1px solid rgba(255,255,255,.18);
          font-weight:900;
          animation:floatPulse 2.2s ease-in-out infinite;
        }
        .floating-whatsapp span{font-size:13px;line-height:1}
        .floating-whatsapp strong{font-size:15px;line-height:1.1}

        @keyframes floatPulse{
          0%,100%{transform:translateY(0) scale(1)}
          50%{transform:translateY(-6px) scale(1.02)}
        }

        @media (max-width: 1100px){
          .hero-grid,
          .benefits-grid,
          .library-grid,
          .proof-row,
          .problem-grid,
          .value-grid,
          .bonus-grid,
          .audience-grid,
          .testimonial-grid,
          .guarantee-grid,
          .comparison-grid,
          .countdown-wrap{grid-template-columns:repeat(2,1fr)}
          .countdown-wrap{display:grid}
        }

        @media (max-width: 860px){
          body{padding-top:86px}
          .top-offer-banner .banner-inner{
            min-height:auto;
            padding:10px 0;
            flex-direction:column;
            align-items:stretch;
          }
          .top-offer-banner .banner-text{
            width:100%;
            justify-content:flex-start;
          }
          .top-offer-banner .banner-btn{
            width:100%;
          }
          .topbar,
          .hero-grid,
          .problem-grid,
          .benefits-grid,
          .library-grid,
          .audience-grid,
          .value-grid,
          .testimonial-grid,
          .bonus-grid,
          .guarantee-grid,
          .comparison-grid,
          .proof-row,
          .offer-strip,
          .countdown-wrap,
          .countdown-boxes{grid-template-columns:1fr}
          .topbar{flex-direction:column;align-items:flex-start}
          .hero-list{grid-template-columns:1fr}
          .hero-actions{flex-direction:column}
          .btn{width:100%}
          .stats-float{position:static;width:100%;margin-top:14px}
          .hero-card{padding:16px}
          .section{padding:68px 0}
          .cta-box{padding:28px 20px}
          .price-box{grid-template-columns:1fr}
        }
      ` }} />

      <a className="top-offer-banner" href="https://wa.me/213655808898" aria-label="عرض خاص للجزائريين اطلب عبر واتساب">
        <div className="banner-inner">
          <div className="banner-text">
            <div className="flag">🇩🇿</div>
            <div className="banner-copy">
              <strong>عرض خاص للجزائريين</strong>
              <span>اطلب مكتبة MegaCNC الآن مباشرة عبر واتساب</span>
            </div>
          </div>
          <span className="banner-btn">اطلب الآن</span>
        </div>
      </a>

      <header className="hero">
        <div className="container">
          <div className="topbar">
            <div className="logo">
              <img src="/megacnc_logo_4k.png" alt="MegaCNC Logo" />
            </div>
            <div className="topbar-actions">
              <span className="mini-pill">⚡ تحميل فوري</span>
              <span className="mini-pill">🗂️ ملفات منظمة</span>
              <a className="btn btn-secondary" href="#cta">اطلب الآن</a>
            </div>
          </div>

          <div className="hero-grid">
            <div>
              <div className="eyebrow">🔥 عرض قوي لأصحاب الورش والمصممين ومحترفي الديكور</div>
              <h1>حوّل كل طلب عميل إلى <span className="accent">فرصة بيع أسرع</span><br />بفضل مكتبة تضم أكثر من <span className="accent">10000 نموذج CNC</span> جاهز</h1>
              <p>
                بدل ما تضيع ساعات في البحث أو إعادة التصميم من الصفر، ستحصل على مكتبة مرتبة وجاهزة للاستخدام تساعدك على عرض خيارات أقوى، إقناع العميل أسرع، وبدء التنفيذ فورًا.
              </p>

              <ul className="hero-list">
                <li><span className="check">✓</span><span>نماذج للأبواب والزخارف والمرايا والديكور الجدارى و 3D Relief</span></li>
                <li><span className="check">✓</span><span>مكتبة منظمة تسهّل الوصول السريع للملف المناسب</span></li>
                <li><span className="check">✓</span><span>توفير كبير في وقت التحضير والتجهيز لكل مشروع</span></li>
                <li><span className="check">✓</span><span>تعزيز قيمة عرضك أمام العميل وزيادة فرص إغلاق الصفقة</span></li>
              </ul>

              <div className="hero-actions">
                <a className="btn btn-primary" href="#cta">🚀 احصل على المكتبة الآن</a>
                <a className="btn btn-secondary" href="#library">شاهد ما داخل المكتبة</a>
              </div>

              <div className="trust-row">
                <span>🎯 مناسبة للاستخدام العملي</span>
                <span>💎 تنوع احترافي كبير</span>
                <span>🧠 تساعدك على الإقناع أسرع</span>
                <span>⏱️ تختصر وقت التحضير</span>
              </div>

              <div className="offer-strip">
                <div className="offer-chip">+10000 نموذج احترافي</div>
                <div className="offer-chip">فئات مطلوبة تجاريًا</div>
                <div className="offer-chip">جاهزة للتحميل الفوري</div>
              </div>
            </div>

            <div>
              <div className="hero-card">
                <div className="preview-grid">
                  <div className="preview-tile" style={{ backgroundImage: "url('/cnc desings .jpeg')" }}>
                    <strong>تصاميم متنوعة</strong>
                  </div>
                  <div className="preview-tile" style={{ backgroundImage: "url('/images/laser cut screen designs.jpeg')" }}>
                    <strong>شاشات قص ليزر</strong>
                  </div>
                  <div className="preview-tile" style={{ backgroundImage: "url('/images/lasercutcathouse.jpeg')" }}>
                    <strong>بيوت قطط خشبية</strong>
                  </div>
                  <div className="preview-tile" style={{ backgroundImage: "url('/images/3333333.png')" }}>
                    <strong>أسقف معلقة</strong>
                  </div>
                </div>
                <div className="stats-float">
                  <b>+10000 تصميم</b>
                  <span>جاهز لتوسيع خياراتك، تسريع الإنتاج، وتقوية عرضك أمام العميل</span>
                </div>
              </div>

              <div className="price-box">
                <div>
                  <small>عرض خاص لفترة محدودة</small>
                  <h3>احصل على المكتبة الكاملة الآن بسعر إطلاق قوي</h3>
                </div>
                <div className="price-tag">
                  <span className="price-old">$99</span>
                  <span className="price-new">$59.99</span>
                  <span className="price-note">دفع مرة واحدة فقط</span>
                </div>
                <div style={{ gridColumn: "span 2", marginTop: "10px" }}>
                  <a className="btn btn-primary" style={{ width: "100%" }} href="/checkout">ابدأ عملية الشراء الآن</a>
                </div>
              </div>
            </div>
          </div>

          <div className="proof-row">
            <div className="proof-card"><strong>10000+</strong><span>نموذج جاهز</span></div>
            <div className="proof-card"><strong>6+</strong><span>فئات رئيسية</span></div>
            <div className="proof-card"><strong>أسرع</strong><span>في بدء المشروع</span></div>
            <div className="proof-card"><strong>أقوى</strong><span>في عرض الخيارات</span></div>
          </div>
        </div>
      </header>

      <section className="section reveal" id="problems">
        <div className="container">
          <h2 className="section-title">لماذا يخسر الكثير من أصحاب الورش <span className="gold">صفقات كان يمكن كسبها؟</span></h2>
          <p className="section-sub">المشكلة ليست في التنفيذ فقط، بل في الوقت الضائع قبل البدء، وضعف الخيارات أثناء عرض العمل على العميل.</p>
          <div className="problem-wrap">
            <div className="problem-grid">
              <div className="problem-card">
                <div className="icon">✕</div>
                <h3>بحث طويل ومتعب</h3>
                <p>تقضي ساعات في إيجاد تصميم مناسب بدل تجهيز العرض والبدء في التنفيذ.</p>
              </div>
              <div className="problem-card">
                <div className="icon">✕</div>
                <h3>ملفات غير منظمة</h3>
                <p>وجود تصاميم متفرقة أو عشوائية يجعل الوصول للمطلوب بطيئًا ومربكًا أمام العميل.</p>
              </div>
              <div className="problem-card">
                <div className="icon">✕</div>
                <h3>خيارات قليلة تقلل الإقناع</h3>
                <p>كلما كانت اختياراتك محدودة، أصبح عرضك أضعف وفرص إغلاق الصفقة أقل.</p>
              </div>
            </div>
            <div className="highlight-bar">الحل: <span className="gold">مكتبة جاهزة ومنظمة</span> تمنحك سرعة في التحضير وقوة أكبر في البيع</div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="benefits">
        <div className="container">
          <h2 className="section-title">ماذا ستحصل عليه فعليًا من <span className="gold">هذه المكتبة؟</span></h2>
          <p className="section-sub">الهدف ليس مجرد ملفات كثيرة، بل نظام عملي يختصر وقتك ويزيد قيمة عرضك ويعطيك مرونة أكبر في المشاريع.</p>
          <div className="solution-wrap">
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="icon">⏱️</div>
                <h3>توفير ساعات من العمل</h3>
                <p>ابدأ أسرع في كل مشروع بدل إضاعة الوقت في جمع الأفكار والبحث الطويل.</p>
                <ul>
                  <li>✓ وصول أسرع للتصميم</li>
                  <li>✓ تقليل وقت التحضير</li>
                </ul>
              </div>
              <div className="benefit-card">
                <div className="icon">🗂️</div>
                <h3>تنظيم احترافي</h3>
                <p>تصنيفات واضحة تسهّل عليك عرض الخيارات المناسبة حسب نوع المشروع.</p>
                <ul>
                  <li>✓ تصفح سهل وسريع</li>
                  <li>✓ ملفات مرتبة بوضوح</li>
                </ul>
              </div>
              <div className="benefit-card">
                <div className="icon">🎨</div>
                <h3>تنوع يخدم المبيعات</h3>
                <p>وجود خيارات أكثر أمام العميل يزيد من احتمالية اتخاذ القرار بشكل أسرع.</p>
                <ul>
                  <li>✓ أبواب وزخارف ومرايا</li>
                  <li>✓ عناصر ديكور متعددة</li>
                </ul>
              </div>
              <div className="benefit-card">
                <div className="icon">💰</div>
                <h3>رفع قيمة المشروع</h3>
                <p>الملفات الأقوى بصريًا تساعدك على تقديم شغل يبدو أفخم وأكثر احترافية.</p>
                <ul>
                  <li>✓ انطباع أقوى</li>
                  <li>✓ فرص تسعير أفضل</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="comparison">
        <div className="container">
          <h2 className="section-title">الفرق بين العمل <span className="gold">بدون مكتبة</span> والعمل معها</h2>
          <div className="comparison-wrap">
            <div className="comparison-grid">
              <div className="comparison-card bad">
                <div className="icon">✕</div>
                <h3>بدون المكتبة</h3>
                <p>وقت أكبر في البحث، خيارات أقل، بطء في تجهيز العرض، وقرارات أبطأ من العميل.</p>
                <ul>
                  <li>• تبدأ من الصفر كثيرًا</li>
                  <li>• ملفات متفرقة وغير جاهزة</li>
                  <li>• صعوبة في عرض خيارات جذابة بسرعة</li>
                </ul>
              </div>
              <div className="comparison-card good">
                <div className="icon">✓</div>
                <h3>مع مكتبة MegaCNC</h3>
                <p>تجهيز أسرع، عرض أقوى، تنوع أكبر، وإمكانية أفضل لإغلاق الصفقات وزيادة الإنتاجية.</p>
                <ul>
                  <li>• مكتبة كبيرة وجاهزة</li>
                  <li>• تنظيم واضح للوصول السريع</li>
                  <li>• خيارات تساعدك على البيع أسرع</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="library">
        <div className="container">
          <h2 className="section-title">ماذا ستجد <span className="gold">داخل المكتبة؟</span></h2>
          <p className="section-sub">كل فئة تم اختيارها لأنها مطلوبة فعليًا وتساعدك على خدمة مشاريع أكثر بمظهر تجاري أقوى.</p>
          <div className="library-grid">
            <a href="https://drive.google.com/drive/folders/1DRS83z8WKOjznd8JbOR9PwhHox2mOC-U?usp=sharing" target="_blank" className="library-card" style={{ backgroundImage: "url('/images/door.jpg')", textDecoration: 'none', display: 'block' }}>
              <span className="tag">الأكثر طلبًا</span>
              <h3>زخارف خشبية</h3>
              <p>نقوش كلاسيكية وفاخرة مناسبة للأثاث والديكور الراقي.</p>
            </a>
            <a href="https://drive.google.com/drive/folders/1DRS83z8WKOjznd8JbOR9PwhHox2mOC-U?usp=sharing" target="_blank" className="library-card" style={{ backgroundImage: "url('/images/door.jpg')", textDecoration: 'none', display: 'block' }}>
              <span className="tag">جاهز للعرض</span>
              <h3>تصاميم أبواب</h3>
              <p>عناصر زخرفية غنية تمنحك خيارات أقوى أمام العميل.</p>
            </a>
            <a href="https://drive.google.com/drive/folders/1DRS83z8WKOjznd8JbOR9PwhHox2mOC-U?usp=sharing" target="_blank" className="library-card" style={{ backgroundImage: "url('/images/door.jpg')", textDecoration: 'none', display: 'block' }}>
              <span className="tag">ديكور فاخر</span>
              <h3>إطارات مرايا</h3>
              <p>تصاميم تضيف قيمة بصرية عالية لمشاريع الديكور الداخلي.</p>
            </a>
            <a href="https://drive.google.com/drive/folders/1DRS83z8WKOjznd8JbOR9PwhHox2mOC-U?usp=sharing" target="_blank" className="library-card" style={{ backgroundImage: "url('/images/door.jpg')", textDecoration: 'none', display: 'block' }}>
              <span className="tag">مظهر قوي</span>
              <h3>أسقف معلقة</h3>
              <p>عناصر بارزة تمنح المشروع عمقًا بصريًا وفخامة أكبر.</p>
            </a>
            <a href="https://drive.google.com/drive/folders/1DRS83z8WKOjznd8JbOR9PwhHox2mOC-U?usp=sharing" target="_blank" className="library-card" style={{ backgroundImage: "url('/images/door.jpg')", textDecoration: 'none', display: 'block' }}>
              <span className="tag">للمساحات الراقية</span>
              <h3>لوحات دائرية</h3>
              <p>نقوش زخرفية ترفع قيمة العرض في مشاريع الجدران والواجهات الداخلية.</p>
            </a>
            <a href="https://drive.google.com/drive/folders/1DRS83z8WKOjznd8JbOR9PwhHox2mOC-U?usp=sharing" target="_blank" className="library-card" style={{ backgroundImage: "url('/images/door.jpg')", textDecoration: 'none', display: 'block' }}>
              <span className="tag">كلاسيكي فاخر</span>
              <h3>ديكورات جدارية</h3>
              <p>تفاصيل مناسبة للمجالس والصالات والمشاريع التي تحتاج فخامة واضحة.</p>
            </a>
            <a href="https://drive.google.com/drive/folders/1DRS83z8WKOjznd8JbOR9PwhHox2mOC-U?usp=sharing" target="_blank" className="library-card" style={{ backgroundImage: "url('/images/door.jpg')", textDecoration: 'none', display: 'block' }}>
              <span className="tag">مرونة أعلى</span>
              <h3>عناصر زخرفية</h3>
              <p>تفاصيل متعددة قابلة للاستخدام في أكثر من نوع مشروع.</p>
            </a>
            <a href="https://drive.google.com/drive/folders/1DRS83z8WKOjznd8JbOR9PwhHox2mOC-U?usp=sharing" target="_blank" className="library-card" style={{ backgroundImage: "url('/images/door.jpg')", textDecoration: 'none', display: 'block' }}>
              <span className="tag">قيمة تجارية</span>
              <h3>تنوع يخدم المبيعات</h3>
              <p>كلما زادت خياراتك أمام العميل، زادت فرص الإقناع وإغلاق الصفقة.</p>
            </a>
          
          </div>
        </div>
      </section>

      <section className="section reveal" id="bonus">
        <div className="container">
          <h2 className="section-title">مزايا إضافية تجعل العرض <span className="gold">أقوى في البيع</span></h2>
          <div className="bonus-wrap">
            <div className="bonus-grid">
              <div className="bonus-card">
                <div className="icon">🎁</div>
                <h3>مكتبة جاهزة مباشرة</h3>
                <p>لا تحتاج إلى تجميع يدوي أو بحث طويل. تدخل وتبدأ في التصفح مباشرة.</p>
              </div>
              <div className="bonus-card">
                <div className="icon">⚡</div>
                <h3>تحميل فوري</h3>
                <p>بعد الشراء تحصل على الوصول فورًا بدون انتظار أو خطوات معقدة.</p>
              </div>
              <div className="bonus-card">
                <div className="icon">📈</div>
                <h3>مناسبة للتوسّع</h3>
                <p>كلما زادت مشاريعك وطلبات عملائك، ستظل لديك مكتبة تغطي احتياجات أكبر.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="audience">
        <div className="container">
          <h2 className="section-title">هذه المكتبة مناسبة لك إذا كنت <span className="gold">تريد العمل بذكاء</span></h2>
          <p className="section-sub">تم تصميم العرض ليخاطب من يريد تقليل الوقت، تحسين العرض، ورفع سرعة الإنجاز والمبيعات.</p>
          <div className="audience-wrap">
            <div className="audience-grid">
              <div className="audience-card">
                <div className="icon">🏭</div>
                <h3>صاحب ورشة CNC</h3>
                <p>تريد تسريع دورة العمل وتقليل الوقت الضائع في البحث أو التصميم المتكرر.</p>
              </div>
              <div className="audience-card">
                <div className="icon">🧠</div>
                <h3>مصمم أو منفذ مشاريع</h3>
                <p>تبحث عن مكتبة جاهزة تمنحك تنوعًا أكبر بدل إعادة العمل من البداية كل مرة.</p>
              </div>
              <div className="audience-card">
                <div className="icon">🪵</div>
                <h3>متخصص في الديكور الخشبي</h3>
                <p>تحتاج زخارف وموديلات تضيف قيمة بصرية واضحة للمشروع النهائي.</p>
              </div>
              <div className="audience-card">
                <div className="icon">💼</div>
                <h3>تريد إقناع العميل أسرع</h3>
                <p>كلما زادت النماذج الجاهزة أمامك، أصبح عرضك أقوى وفرص البيع أعلى.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="testimonials">
        <div className="container">
          <h2 className="section-title">ماذا يقول من يهتمون بـ <span className="gold">السرعة والجودة؟</span></h2>
          <div className="testimonial-wrap">
            <div className="testimonial-grid">
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <h3>وفّرت علي وقتًا كبيرًا</h3>
                <p>بدل ما أبدأ من الصفر في كل مرة، أصبحت أجهز عرض العميل أسرع وأدخل التنفيذ بثقة أكبر.</p>
                <span className="name">أحمد</span>
                <span className="role">صاحب ورشة CNC</span>
              </div>
              <div className="testimonial-card">
                <div className="stars">★★★★★</div>
                <h3>التنظيم ممتاز جدًا</h3>
                <p>أكثر شيء أعجبني هو سهولة الوصول للتصميم المناسب بسرعة، وهذا اختصر علينا وقتًا فعليًا داخل الورشة.</p>
                <span className="name">محمد</span>
                <span className="role">منفذ ديكور خشبي</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="value">
        <div className="container">
          <h2 className="section-title">كيف تساعدك هذه المكتبة على <span className="gold">زيادة الأرباح؟</span></h2>
          <p className="section-sub">القيمة ليست فقط في عدد الملفات، بل في الوقت الذي توفره، والسرعة التي تضيفها، والانطباع الأقوى الذي تصنعه أمام العميل.</p>
          <div className="problem-wrap">
            <div className="value-grid">
              <div className="value-card">
                <div className="icon">1</div>
                <h3>تحضير أسرع</h3>
                <p>ابدأ المشروع بسرعة بدل استنزاف الوقت في جمع الأفكار والبحث الطويل.</p>
              </div>
              <div className="value-card">
                <div className="icon">2</div>
                <h3>خيارات أكثر</h3>
                <p>امنح العميل نماذج أكثر تنوعًا وادفعه لاتخاذ القرار بشكل أسرع.</p>
              </div>
              <div className="value-card">
                <div className="icon">3</div>
                <h3>عدد مشاريع أكبر</h3>
                <p>كل وقت يتم توفيره يعني قدرة أكبر على استقبال وتنفيذ أعمال إضافية.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="guarantee">
        <div className="container">
          <h2 className="section-title">إزالة التردد قبل الشراء <span className="gold">تزيد التحويل</span></h2>
          <div className="guarantee-wrap">
            <div className="guarantee-grid">
              <div className="guarantee-card">
                <div className="icon">🔒</div>
                <h3>وصول مباشر بعد الدفع</h3>
                <p>اجعل العميل يفهم بوضوح أنه سيحصل على المكتبة مباشرة بعد إتمام الطلب.</p>
              </div>
              <div className="guarantee-card">
                <div className="icon">✅</div>
                <h3>عرض واضح وقيمة واضحة</h3>
                <p>كل نقطة في الصفحة الآن تربط بين المنتج والنتيجة العملية: وقت أقل، عرض أقوى، ومشاريع أكثر.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="offer">
        <div className="container">
          <div className="countdown-wrap">
            <div>
              <h2 style={{ margin: "0 0 10px", fontSize: "clamp(30px,3vw,44px)" }}>عرض الإطلاق لن يدوم طويلًا</h2>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "18px" }}>استخدم هذا القسم لخلق إحساس بالإلحاح. ويمكنك لاحقًا ربط العداد بجافاسكربت حقيقي أو تغييره يدويًا.</p>
              <div className="hero-actions" style={{ marginTop: "20px", marginBottom: 0 }}>
                <a className="btn btn-primary" href="#cta">احجز السعر الحالي الآن</a>
                <a className="btn btn-secondary" href="#faq">لدي سؤال قبل الشراء</a>
              </div>
            </div>
            <div className="countdown-boxes">
              <div className="time-box"><strong data-time="days">{countdown.days}</strong><span>يوم</span></div>
              <div className="time-box"><strong data-time="hours">{countdown.hours}</strong><span>ساعة</span></div>
              <div className="time-box"><strong data-time="minutes">{countdown.minutes}</strong><span>دقيقة</span></div>
              <div className="time-box"><strong data-time="seconds">{countdown.seconds}</strong><span>ثانية</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="cta">
        <div className="container">
          <div className="cta-box">
            <h2>ابدأ الآن وامنح نفسك أفضلية واضحة في كل مشروع جديد</h2>
            <p>إذا كنت تريد تقليل وقت التحضير، زيادة الخيارات أمام العميل، وتحسين جودة العرض والمظهر الاحترافي، فهذه المكتبة صممت لهذا الهدف بالضبط.</p>
            <div className="hero-actions" style={{ justifyContent: "center", marginBottom: 0 }}>
              <a className="btn btn-primary" href="/checkout">📂 اطلب المكتبة الآن</a>
              <a className="btn btn-secondary" href="#library">عرض محتويات المكتبة</a>
            </div>
            <div className="cta-guarantee">✅ تحميل فوري بعد الطلب — 🗂️ تنظيم واضح — 💎 تنوع احترافي</div>
            <div className="cta-note">مهم: استبدل رابط واتساب أو رابط الشراء الحالي برابطك الحقيقي قبل النشر</div>
          </div>
        </div>
      </section>

      <section className="section reveal" id="faq">
        <div className="container">
          <h2 className="section-title">الأسئلة <span className="gold">الشائعة</span></h2>
          <div className="faq-wrap">
            <div className="faq-list">
              <div className="faq-item">
                <h3>ماذا سأحصل عليه بعد الشراء؟</h3>
                <p>الوصول إلى مكتبة تضم أكثر من 10000 نموذج CNC منظم بطريقة تسهّل الوصول السريع للتصميم المناسب.</p>
              </div>
              <div className="faq-item">
                <h3>هل المكتبة مناسبة لأصحاب الورش؟</h3>
                <p>نعم، وهي مناسبة جدًا لمن يريد تقليل وقت التحضير وتسريع الإنجاز ورفع عدد الخيارات أمام العميل.</p>
              </div>
              <div className="faq-item">
                <h3>هل تصلح لمشاريع متعددة؟</h3>
                <p>نعم، لأنها تحتوي على فئات متنوعة مثل الزخارف، الأبواب، المرايا، اللوحات، والديكور الجدارى.</p>
              </div>
              <div className="faq-item">
                <h3>هل أحتاج خبرة كبيرة للاستفادة منها؟</h3>
                <p>كلما كانت لديك خبرة في العمل على مشاريع CNC ستستفيد بشكل أسرع، لكن المكتبة نفسها مصممة لتسهيل الوصول للملفات وتنظيمها بشكل واضح.</p>
              </div>
              <div className="faq-item">
                <h3>كيف أستخدم الصفحة بشكل أفضل لزيادة المبيعات؟</h3>
                <p>استبدل الشهادات الحالية بشهادات حقيقية، وأضف صورًا حقيقية من داخل المكتبة، واربط زر الشراء بواتساب أو منصة دفع فعلية.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        جميع الحقوق محفوظة © MegaCNC Library
      </footer>

      <a className="floating-whatsapp" href="https://wa.me/213655808898" aria-label="تواصل عبر واتساب">
        <span>واتساب</span>
        <strong>واتساب المساعدة</strong>
      </a>
    </>
  );
}
