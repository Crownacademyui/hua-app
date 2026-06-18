"use client";

import Link from "next/link";
import { useGoals, useDashboardStats } from "@/hooks/useGoals";
import { useAuthStore } from "@/store/authStore";
import { useGoalStore } from "@/store/goalStore";
import { ProgressBar, Badge, EmptyState, Spinner } from "@/components/ui";
import { GoalCard } from "@/components/goals/GoalCard";
import { CreateGoalModal } from "@/components/goals/CreateGoalModal";
import { useState } from "react";

function StatCard({ label, value, sub, icon, color = "#FFA500", delta }: {
  label: string; value: string | number; sub?: string;
  icon: string; color?: string; delta?: number;
}) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>{label}</p>
          <h3 style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>{value}</h3>
          {sub && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{sub}</p>}
          {delta !== undefined && (
            <span style={{ fontSize: 12, color: delta >= 0 ? "#22c55e" : "#ef4444", marginTop: 4, display: "block" }}>
              {delta >= 0 ? "↑" : "↓"} {Math.abs(delta)}% this month
            </span>
          )}
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {icon.split(" M").map((d, i) => <path key={i} d={i === 0 ? d : "M" + d} />)}
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useGoalStore((s) => s.isLoading);
  const { active, completed, avgProgress } = useDashboardStats();
  const [showCreate, setShowCreate] = useState(false);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = user?.full_name?.split(" ")[0] ?? "there";

  if (isLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
            {greeting()}, {firstName} 👋
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            {active.length > 0
              ? `You have ${active.length} active goal${active.length > 1 ? "s" : ""}. Keep pushing!`
              : "No active goals yet. Create your first one!"}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)} style={{ padding: "11px 20px", fontSize: 14 }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          New Goal
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <StatCard label="Active Goals" value={active.length} icon="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" color="#FFA500" delta={20} />
        <StatCard label="Completed Goals" value={completed.length} icon="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z" color="#22c55e" delta={8} />
        <StatCard label="Avg Progress" value={`${avgProgress}%`} sub="across all goals" icon="M18 20V10 M12 20V4 M6 20v-6" color="#8b5cf6" />
        <StatCard label="Day Streak" value="7 🔥" sub="Keep it up!" icon="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" color="#f97316" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>

        {/* Active Goals */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17 }}>Active Goals</h3>
            <Link href="/goals" style={{ fontSize: 13, color: "#FFA500", fontWeight: 500, textDecoration: "none" }}>View all →</Link>
          </div>

          {active.length === 0 ? (
            <div className="card" style={{ padding: 24 }}>
              <EmptyState
                emoji="🎯"
                title="No active goals yet"
                subtitle="Create your first goal to start tracking your progress."
                action={
                  <button className="btn-primary" onClick={() => setShowCreate(true)} style={{ padding: "10px 20px", fontSize: 14 }}>
                    Create first goal
                  </button>
                }
              />
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {active.slice(0, 4).map((goal) => (
                <Link key={goal.id} href={`/goals/${goal.id}`} style={{ textDecoration: "none" }}>
                  <GoalCard goal={goal} />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Streak Card */}
          <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, rgba(255,165,0,0.08), rgba(2,6,111,0.3))", border: "1px solid rgba(255,165,0,0.2)", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🔥</div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>7-Day Streak!</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>You've checked in 7 days in a row. Keep the fire burning!</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,165,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>✓</div>
              ))}
            </div>
          </div>

          {/* Completed goals */}
          {completed.length > 0 && (
            <div className="card" style={{ padding: 18 }}>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Recently Completed</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {completed.slice(0, 3).map((goal) => (
                  <Link key={goal.id} href={`/goals/${goal.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, flex: 1, color: "rgba(255,255,255,0.7)" }}>{goal.title}</span>
                    <span style={{ fontSize: 11, color: "#22c55e" }}>✓</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick tip */}
          <div className="card" style={{ padding: 18, border: "1px solid rgba(139,92,246,0.2)", background: "rgba(139,92,246,0.05)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Tip of the day</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>Break your largest goal into weekly targets. Freelancers who do this are 3× more likely to hit their goals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateGoalModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
