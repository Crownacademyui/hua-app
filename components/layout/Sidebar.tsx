"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useGoalStore } from "@/store/goalStore";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
  { href: "/goals", label: "Goals", icon: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" },
  { href: "/progress", label: "Progress", icon: "M18 20V10 M12 20V4 M6 20v-6" },
  { href: "/guide", label: "Guide", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" },
  { href: "/profile", label: "Profile", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
] as const;

interface SidebarProps {
  collapsed: boolean;
}

export function Sidebar({ collapsed }: SidebarProps) {
  const pathname = usePathname();
  const signOut = useAuthStore((s) => s.signOut);
  const goals = useGoalStore((s) => s.goals);
  const activeCount = goals.filter((g) => g.status === "active").length;
  const completedCount = goals.filter((g) => g.status === "completed").length;
  const totalGoals = goals.length;

  // Placeholder streak logic until real daily check-in tracking is built
  const streakDays = totalGoals > 0 ? 7 : 0;

  return (
    <aside style={{ width: collapsed ? 64 : 240, flexShrink: 0, height: "100vh", position: "fixed", left: 0, top: 0, display: "flex", flexDirection: "column", borderRight: "1px solid rgba(255,255,255,0.08)", transition: "width 0.3s ease", zIndex: 100, overflow: "hidden", background: "linear-gradient(180deg, rgba(2,6,111,0.6) 0%, rgba(10,15,60,0.95) 100%)", backdropFilter: "blur(20px)" }}>

      {/* Logo — links to dashboard */}
      <Link href="/dashboard" style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12, minHeight: 72, textDecoration: "none" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #FFA500, #ff6b00)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
          </svg>
        </div>
        {!collapsed && <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: "-0.5px", color: "#fff" }}>Hua</span>}
      </Link>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} title={collapsed ? item.label : ""}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, fontSize: 14, fontWeight: 500, color: isActive ? "#FFA500" : "rgba(255,255,255,0.5)", background: isActive ? "rgba(255,165,0,0.1)" : "transparent", textDecoration: "none", transition: "all 0.2s" }}>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={isActive ? "#FFA500" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                {item.icon.split(" M").map((d, i) => <path key={i} d={i === 0 ? d : "M" + d} />)}
              </svg>
              {!collapsed && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.href === "/goals" && activeCount > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,165,0,0.2)", color: "#FFA500", borderRadius: 100, padding: "1px 7px" }}>
                      {activeCount}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {!collapsed && (
          <div style={{ padding: "12px 14px", background: streakDays > 0 ? "rgba(255,165,0,0.08)" : "rgba(255,255,255,0.04)", borderRadius: 12, marginBottom: 8, border: streakDays > 0 ? "1px solid rgba(255,165,0,0.15)" : "1px solid rgba(255,255,255,0.08)" }}>
            {streakDays > 0 ? (
              <>
                <p style={{ fontSize: 11, color: "#FFA500", fontWeight: 600, marginBottom: 2 }}>🔥 {streakDays}-day streak!</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Keep going, you're on fire</p>
              </>
            ) : (
              <>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 2 }}>👋 No streak yet</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Create a goal to get started</p>
              </>
            )}
          </div>
        )}
        <button onClick={signOut} title={collapsed ? "Log out" : ""}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 10, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s", background: "none", border: "none", width: "100%", textAlign: "left" }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}