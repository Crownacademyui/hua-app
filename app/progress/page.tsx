"use client";

import { useDashboardStats, useGoals } from "@/hooks/useGoals";
import { useGoalStore } from "@/store/goalStore";
import { ProgressBar, Spinner } from "@/components/ui";

const WEEKS = ["Jan W3", "Jan W4", "Feb W1", "Feb W2", "Feb W3", "Feb W4", "Mar W1"];
const CHART_DATA = [40, 52, 47, 65, 71, 68, 80];

export default function ProgressPage() {
  const { active, completed, avgProgress, totalSteps, completedSteps, all } = useDashboardStats();
  const isLoading = useGoalStore((s) => s.isLoading);

  if (isLoading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}><Spinner size={32} /></div>;
  }

  const maxVal = Math.max(...CHART_DATA);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Progress Overview</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Your weekly goal completion and momentum</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
        {[
          { label: "Avg Completion", value: `${avgProgress}%`, color: "#FFA500" },
          { label: "Goals Completed", value: completed.length, color: "#22c55e" },
          { label: "Total Steps Done", value: completedSteps, color: "#8b5cf6" },
          { label: "Active Goals", value: active.length, color: "#f97316" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: 20 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: s.color, fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Weekly Completion Rate</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 160, paddingBottom: 28 }}>
          {CHART_DATA.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{v}%</span>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div style={{
                  width: "100%",
                  borderRadius: "8px 8px 0 0",
                  background: `linear-gradient(180deg, #FFA500, #ff6b00)`,
                  height: `${(v / maxVal) * 100}%`,
                  minHeight: 4,
                  opacity: i === CHART_DATA.length - 1 ? 1 : 0.6,
                  transition: "height 0.6s ease",
                }} />
              </div>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", transform: "rotate(-30deg)", transformOrigin: "center", whiteSpace: "nowrap", marginTop: 4 }}>{WEEKS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Per-goal breakdown */}
      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Goal Progress Breakdown</h3>
        {all.length === 0 ? (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "32px 0" }}>No goals yet. Create your first goal to track progress.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {all.map((goal) => {
              const deadline = goal.deadline
                ? new Date(goal.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                : "No deadline";
              return (
                <div key={goal.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: goal.color }} />
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{goal.title}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{deadline}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: goal.color, minWidth: 40, textAlign: "right" }}>{goal.progress}%</span>
                    </div>
                  </div>
                  <ProgressBar value={goal.progress} color={goal.color} height={6} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{goal.completedSteps}/{goal.totalSteps} steps done</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "capitalize" }}>{goal.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
