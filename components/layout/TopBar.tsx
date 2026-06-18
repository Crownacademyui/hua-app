"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { Avatar } from "@/components/ui";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/goals": "My Goals",
  "/goals/new": "New Goal",
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
    <header
      style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(10,15,60,0.8)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={onToggleSidebar}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", padding: 6, borderRadius: 8 }}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h2 style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h2>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Notification bell */}
        <button style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "rgba(255,255,255,0.5)", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#FFA500", border: "1.5px solid rgba(10,15,60,1)" }} />
        </button>

        {/* User avatar */}
        <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
          <Avatar name={user?.full_name ?? "U"} size={36} src={user?.avatar_url ?? undefined} />
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
              {user?.full_name ?? "User"}
            </p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "capitalize" }}>
              {user?.role ?? "Freelancer"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
