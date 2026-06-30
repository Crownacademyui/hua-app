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
      <nav className="landing-nav" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 48px", borderBottom: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 100, background: "rgba(10,15,60,0.8)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #FFA500, #ff6b00)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff" }}>Hua</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/auth/login" className="btn-secondary" style={{ padding: "9px 16px", fontSize: 13 }}>Log in</Link>
          <Link href="/auth/signup" className="btn-primary" style={{ padding: "9px 16px", fontSize: 13 }}>Sign up</Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="landing-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 48px 50px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,165,0,0.1)", border: "1px solid rgba(255,165,0,0.25)", borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
          <div className="glow-dot" />
          <span style={{ fontSize: 12, color: "#FFA500", fontWeight: 500 }}>Built for African Freelancers & Founders</span>
        </div>

        <h1 style={{ fontSize: "clamp(32px, 7vw, 68px)", fontWeight: 800, lineHeight: 1.15, marginBottom: 20, letterSpacing: "-1.5px", color: "#fff" }}>
          Set goals that<br />
          <span style={{ background: "linear-gradient(135deg, #FFA500, #ff6b00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            actually get done.
          </span>
        </h1>

        <p style={{ fontSize: "clamp(14px, 2.5vw, 18px)", color: "rgba(255,255,255,0.7)", maxWidth: 560, margin: "0 auto 32px", lineHeight: 1.7, padding: "0 8px" }}>
          Hua helps freelancers and small business owners across Africa track goals, build accountability habits, and grow with clarity.
        </p>

        <Link href="/auth/signup" className="btn-primary" style={{ padding: "14px 32px", fontSize: 15, borderRadius: 14, display: "inline-flex", alignItems: "center", gap: 8 }}>
          Sign up now →
        </Link>
      </div>

      {/* Features */}
      <div className="landing-section" style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 48px 64px" }}>
        <h2 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 700, textAlign: "center", marginBottom: 8, letterSpacing: "-1px", color: "#fff" }}>Everything you need to thrive</h2>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", marginBottom: 40, fontSize: 14 }}>Built with the African hustle in mind</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="card" style={{ padding: 22 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,165,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {f.icon.split(" M").map((d, i) => <path key={i} d={i === 0 ? d : "M" + d} />)}
                </svg>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 7, color: "#fff" }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing highlight */}
      <div className="landing-section" style={{ maxWidth: 700, margin: "0 auto", padding: "0 48px 50px" }}>
        <div className="pricing-card card" style={{ padding: 36, textAlign: "center", background: "rgba(255,165,0,0.04)", border: "1px solid rgba(255,165,0,0.15)" }}>
          <h2 style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 700, marginBottom: 8, color: "#fff" }}>Simple, one-time pricing</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 22, fontSize: 13 }}>Pay once. Use Hua forever. No subscriptions, no hidden fees.</p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 8vw, 48px)", color: "#FFA500" }}>₦5,000</span>
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>one-time</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300, margin: "0 auto 24px" }}>
            {["Unlimited goals & steps", "Progress tracking & streaks", "Email reminders", "Freelancer business guides", "All future updates included"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(255,165,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
          <Link href="/auth/signup" className="btn-primary" style={{ padding: "13px 32px", fontSize: 14, borderRadius: 14, display: "inline-flex" }}>
            Sign up now →
          </Link>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 12 }}>Students get ₦3,000 with coupon code at checkout</p>
        </div>
      </div>

      {/* CTA */}
      <div className="landing-section" style={{ maxWidth: 600, margin: "0 auto", padding: "0 48px 64px", textAlign: "center" }}>
        <div className="card" style={{ padding: 36, background: "linear-gradient(135deg, rgba(2,6,111,0.8), rgba(255,165,0,0.08))", border: "1px solid rgba(255,165,0,0.2)" }}>
          <div style={{ fontSize: 32, marginBottom: 14 }}>🔥</div>
          <h2 style={{ fontSize: "clamp(20px, 5vw, 28px)", fontWeight: 700, marginBottom: 10, color: "#fff" }}>Ready to start achieving?</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24, fontSize: 13 }}>Join African freelancers building toward their goals every day.</p>
          <Link href="/auth/signup" className="btn-primary" style={{ padding: "13px 28px", fontSize: 14, borderRadius: 14, display: "inline-flex" }}>
            Sign up now
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .landing-nav {
            padding: 16px 20px !important;
          }
          .landing-section {
            padding-left: 20px !important;
            padding-right: 20px !important;
          }
          .pricing-card {
            padding: 28px 20px !important;
          }
        }
        @media (max-width: 420px) {
          .landing-nav span {
            font-size: 18px !important;
          }
          .landing-section {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}