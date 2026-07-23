"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/ui";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/goals": "My Goals",
  "/progress": "Progress",
  "/guide": "Guide",
  "/profile": "Profile",
};

interface TopBarProps {
  onToggleSidebar: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const title =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/goals/") ? "Goal Details" : "Hua");

  return (
    <header style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(10,15,60,0.8)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onToggleSidebar} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", padding: 6, borderRadius: 8 }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>

        {/* Logo — links to dashboard */}
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #FFA500, #ff6b00)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "var(--text)" }}>{title}</h2>
        </Link>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Notifications */}
        <NotificationsPanel />

        {/* User avatar */}
        <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <Avatar name={user?.full_name ?? "U"} size={36} src={user?.avatar_url ?? undefined} />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif", color: "#fff" }}>
              {user?.full_name ?? "User"}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "capitalize" }}>
              {user?.role ?? "Freelancer"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
