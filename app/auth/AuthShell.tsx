"use client";

import Link from "next/link";

const CHECKS = [
  "Set & track SMART goals",
  "Daily accountability check-ins",
  "Visual progress insights",
  "Built for African freelancers",
];

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell-wrapper" style={{ minHeight: "100vh", display: "flex" }}>
      <div className="noise-overlay" />

      {/* Left panel */}
      <div className="auth-left-panel" style={{ flex: "0 0 480px", background: "linear-gradient(160deg, #02066F 0%, #0A0F3C 60%, rgba(255,165,0,0.05) 100%)", display: "flex", flexDirection: "column", padding: "32px 40px", borderRight: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: -100, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,165,0,0.08) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(2,6,111,0.4) 0%, transparent 70%)" }} />

        {/* Logo */}
        <Link href="/landing" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit", marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #FFA500, #ff6b00)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
            </svg>
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff" }}>Hua</span>
        </Link>

        {/* Body */}
        <div style={{ marginBottom: "auto", marginTop: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 16, lineHeight: 1.3, color: "#fff" }}>
            Your goals deserve a real shot.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, fontSize: 15 }}>
            Track progress, stay accountable, and build the career or business you've always wanted — one goal at a time.
          </p>
          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 14 }}>
            {CHECKS.map((text) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,165,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 32 }}>
          {[
            { value: "100%", label: "African-built" },
            { value: "₦0", label: "Hidden fees" },
            { value: "∞", label: "Lifetime access" },
          ].map((s) => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: "12px 8px", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, color: "#FFA500", marginBottom: 2 }}>{s.value}</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="auth-right-panel" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
        {children}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-shell-wrapper {
            flex-direction: column !important;
          }
          .auth-left-panel {
            flex: none !important;
            width: 100% !important;
            padding: 28px 24px !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .auth-right-panel {
            padding: 32px 20px !important;
            flex: none !important;
          }
        }
        @media (max-width: 600px) {
          .auth-left-panel h2 {
            font-size: 22px !important;
          }
          .auth-left-panel > div:nth-child(3) {
            display: none;
          }
          .auth-right-panel {
            padding: 24px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}