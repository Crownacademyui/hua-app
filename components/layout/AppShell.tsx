"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuthStore } from "@/store/authStore";
import { useGoalStore } from "@/store/goalStore";
import { Spinner } from "@/components/ui";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const user = useAuthStore((s) => s.user);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const fetchGoals = useGoalStore((s) => s.fetchGoals);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      await fetchProfile();
      await fetchGoals();
      setHydrated(true);
    }
    init();
  }, [fetchProfile, fetchGoals]);

  // In a real Supabase app, redirect unauthenticated users.
  // In demo mode, fetchProfile always populates the user.
  useEffect(() => {
    if (hydrated && !user) {
      router.push("/auth/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0A0F3C" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #FFA500, #ff6b00)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
            </svg>
          </div>
          <Spinner size={24} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar collapsed={collapsed} />
      <div style={{ flex: 1, marginLeft: collapsed ? 64 : 240, transition: "margin-left 0.3s ease", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <TopBar onToggleSidebar={() => setCollapsed((c) => !c)} />
        <main style={{ flex: 1, padding: 24, maxWidth: 1200, width: "100%", animationName: "slideUp", animationDuration: "0.4s", animationFillMode: "forwards" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
