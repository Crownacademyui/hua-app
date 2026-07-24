"use client";

import Link from "next/link";
import { useDashboardStats } from "@/hooks/useGoals";
import { useAuthStore } from "@/store/authStore";
import { useGoalStore } from "@/store/goalStore";
import { EmptyState, Spinner } from "@/components/ui";
import { GoalCard } from "@/components/goals/GoalCard";
import { CreateGoalModal } from "@/components/goals/CreateGoalModal";
import { useState } from "react";

const TIPS_OF_THE_DAY = [
  "Break your largest goal into weekly targets. Freelancers who do this are 3× more likely to hit their goals.",
  "Send that invoice today, not next week. Cash flow waits for no one.",
  "Your rate isn't just for today's work — it's for every hour you spent learning the skill. Charge accordingly.",
  "One client isn't a business plan. Keep at least one lead warm even when you're fully booked.",
  "Progress you can't see is progress you'll forget. Log a win today, even a small one.",
  "Undercharging doesn't win loyalty — it just trains clients to expect less from you.",
  "A goal without a deadline is just a wish. Set one, even a rough one.",
  "Save before you spend. Even ₦2,000 a week adds up faster than you think.",
  "Done today beats perfect someday. Ship the draft, refine it later.",
  "Your network is your net worth. Reach out to one past client this week.",
  "Consistency beats intensity. Ten minutes daily on a goal outperforms one long push a month.",
  "Raise your rates before you're overwhelmed, not after you're burnt out.",
  "Write your invoice terms clearly upfront — it saves the awkward chase later.",
  "Rest is part of the work. A tired freelancer makes expensive mistakes.",
  "Track where your hours actually go for one week. It'll surprise you.",
  "Every 'no' from a client is data, not a verdict on your worth.",
  "Automate the boring stuff — reminders, invoices, follow-ups — so you can focus on the craft.",
  "A portfolio piece done well brings more clients than ten cold pitches.",
  "Set a goal you're a little scared of. Comfortable goals rarely stretch you.",
  "Celebrate the milestone before you rush to the next one. You earned it.",
];

function getTipOfTheDay(): string {
  const startOfYear = new Date(new Date().getFullYear(), 0, 0);
  const diff = Date.now() - startOfYear.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return TIPS_OF_THE_DAY[dayOfYear % TIPS_OF_THE_DAY.length];
}

function StatCard({ label, value, sub, icon, color = "#FFA500" }: {
  label: string; value: string | number; sub?: string;
  icon: string; color?: string;
}) {
  return (
    <div className="card" style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 8, fontWeight: 500, letterSpacing: "0.3px" }}>{label}</p>
          <h3 style={{ fontSize: 28, fontWeight: 800, lineHeight: 1, color: "#1a1a2e", fontFamily: "'Space Grotesk', sans-serif" }}>{value}</h3>
          {sub && <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{sub}</p>}
        </div>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

  const totalGoals = active.length + completed.length;
  const streakDays = totalGoals > 0 ? 7 : 0;
  const tipOfTheDay = getTipOfTheDay();

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
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: "#1a1a2e" }}>
            {greeting()}, {firstName} 👋
          </h2>
          <p style={{ fontSize: 14, color: "#6b7280" }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14 }}>
        <StatCard label="Active Goals" value={active.length} icon="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" color="#FFA500" />
        <StatCard label="Completed Goals" value={completed.length} icon="M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M18 2H6v7a6 6 0 0 0 12 0V2z" color="#16a34a" />
        <StatCard label="Avg Progress" value={`${avgProgress}%`} sub="across all goals" icon="M18 20V10 M12 20V4 M6 20v-6" color="#6366f1" />
        <StatCard label="Day Streak" value={streakDays > 0 ? `${streakDays} 🔥` : "0"} sub={streakDays > 0 ? "Keep it up!" : "Create a goal to start"} icon="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" color="#f97316" />
      </div>

      {/* Main Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>

        {/* Active Goals */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>Active Goals</h3>
            <Link href="/goals" style={{ fontSize: 13, color: "#FFA500", fontWeight: 600, textDecoration: "none" }}>View all →</Link>
          </div>

          {active.length === 0 ? (
            <div className="card" style={{ padding: 32 }}>
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

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Streak Card */}
          {streakDays > 0 ? (
            <div className="card" style={{ padding: 20, background: "linear-gradient(135deg, #fff8ed, #fff3d6)", border: "1px solid rgba(255,165,0,0.2)", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 6 }}>🔥</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: "#1a1a2e" }}>{streakDays}-Day Streak!</h3>
              <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 14, lineHeight: 1.5 }}>You've checked in {streakDays} days in a row. Keep going!</p>
              <div style={{ display: "flex", justifyContent: "center", gap: 5 }}>
                {Array.from({ length: streakDays }).map((_, i) => (
                  <div key={i} style={{ width: 26, height: 26, borderRadius: 7, background: "#FFA500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#000", fontWeight: 700 }}>✓</div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 20, textAlign: "center", background: "#fff8ed", border: "1px solid rgba(255,165,0,0.15)" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>👋</div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: "#1a1a2e" }}>No streak yet</h3>
              <p style={{ fontSize: 12, color: "#6b7280" }}>Create your first goal to start building a streak!</p>
            </div>
          )}

          {/* Completed goals */}
          {completed.length > 0 && (
            <div className="card" style={{ padding: 18 }}>
              <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 12, color: "#1a1a2e" }}>Recently Completed</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {completed.slice(0, 3).map((goal) => (
                  <Link key={goal.id} href={`/goals/${goal.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, flex: 1, color: "#374151" }}>{goal.title}</span>
                    <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}>✓</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tip of the day */}
          <div className="card" style={{ padding: 18, background: "#f5f3ff", border: "1px solid rgba(99,102,241,0.15)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#1a1a2e" }}>Tip of the day</p>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{tipOfTheDay}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <CreateGoalModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}