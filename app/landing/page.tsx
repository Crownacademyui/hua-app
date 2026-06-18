"use client";

import Link from "next/link";

const FEATURES = [
  { icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z", title: "Goal Setting", desc: "Set SMART goals with deadlines, milestones, and priority levels designed for freelancers." },
  { icon: "M18 20V10 M12 20V4 M6 20v-6", title: "Progress Tracking", desc: "Visual dashboards and weekly insights to keep you on course and motivated." },
  { icon: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z", title: "Accountability Streaks", desc: "Daily check-ins and streak tracking that keep your momentum alive." },
  { icon: "M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z", title: "Milestone Rewards", desc: "Celebrate wins with badges and achievements that fuel your journey." },
  { icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z", title: "Business Guides", desc: "Curated guides on freelancing, finance, and growth for African markets." },
  { icon: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2", title: "Client & Project Tools", desc: "Link goals to client work, projects, and revenue targets seamlessly." },
];

export default function LandingPage() {
  return (
    <div className="hero-gradient" style={{ minHeight: "100vh" }}>
      <div className="noise-overlay" />

      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, background: "rgba(10,15,60,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #FFA500, #ff6b00)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22 }}>Hua</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/auth/login" className="btn-secondary" style={{ padding: "10px 20px", fontSize: 14 }}>Log in</Link>
          <Link href="/auth/signup" className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px 60px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,165,0,0.1)", border: "1px solid rgba(255,165,0,0.25)", borderRadius: 100, padding: "6px 16px", marginBottom: 32 }}>
          <div className="glow-dot" />
          <span style={{ fontSize: 13, color: "#FFA500", fontWeight: 500 }}>Built for African Freelancers & Founders</span>
        </div>

        <h1 style={{ fontSize: "clamp(40px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24, letterSpacing: "-2px" }}>
          Set goals that<br />
          <span style={{ background: "linear-gradient(135deg, #FFA500, #ff6b00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            actually get done.
          </span>
        </h1>

        <p style={{ fontSize: "clamp(16px, 2vw, 18px)", color: "rgba(255,255,255,0.7)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Hua helps freelancers and small business owners across Africa track goals, build accountability habits, and grow with clarity.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/auth/signup" className="btn-primary" style={{ padding: "14px 28px", fontSize: 15, borderRadius: 14 }}>
            Start for free
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
          <Link href="/dashboard" className="btn-secondary" style={{ padding: "14px 28px", fontSize: 15, borderRadius: 14 }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" /></svg>
            View demo
          </Link>
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, marginTop: 48, flexWrap: "wrap" }}>
          {["2,400+ users", "94% hit goals", "7-day avg streak"].map((text) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFA500" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 48px 80px" }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, textAlign: "center", marginBottom: 8, letterSpacing: "-1px" }}>Everything you need to thrive</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", marginBottom: 48 }}>Built with the African hustle in mind</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card" style={{ padding: 24 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,165,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon.split(" M").map((d, i) => <path key={i} d={i === 0 ? d : "M" + d} />)}
                </svg>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 48px 80px", textAlign: "center" }}>
        <div className="card" style={{ padding: 48, background: "linear-gradient(135deg, rgba(2,6,111,0.8), rgba(255,165,0,0.08))", border: "1px solid rgba(255,165,0,0.2)" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🔥</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Ready to start achieving?</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 28, fontSize: 15 }}>Join thousands of African freelancers building toward their goals every day.</p>
          <Link href="/auth/signup" className="btn-primary" style={{ padding: "14px 32px", fontSize: 15, borderRadius: 14 }}>
            Create free account
          </Link>
        </div>
      </div>
    </div>
  );
}
