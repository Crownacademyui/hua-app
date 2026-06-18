"use client";

import { useState } from "react";
import Link from "next/link";
import { useGoalStore } from "@/store/goalStore";
import { GoalCard } from "@/components/goals/GoalCard";
import { CreateGoalModal } from "@/components/goals/CreateGoalModal";
import { EmptyState, Spinner } from "@/components/ui";
import type { GoalStatus, GoalPriority } from "@/types";

type FilterValue = "all" | GoalStatus | GoalPriority;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All Goals" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "high", label: "High Priority" },
  { value: "paused", label: "Paused" },
];

export default function GoalsPage() {
  const goals = useGoalStore((s) => s.goals);
  const isLoading = useGoalStore((s) => s.isLoading);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const filtered = goals.filter((g) => {
    const matchFilter =
      filter === "all" ||
      g.status === filter ||
      g.priority === filter;

    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      g.title.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

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
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>My Goals</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
            {goals.length} total · {goals.filter((g) => g.status === "active").length} active · {goals.filter((g) => g.status === "completed").length} completed
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)} style={{ padding: "11px 20px", fontSize: 14 }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
          New Goal
        </button>
      </div>

      {/* Search + Filters */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            className="input-field"
            placeholder="Search goals…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "10px 14px 10px 36px" }}
          />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                cursor: "pointer", transition: "all 0.2s", border: "1px solid",
                background: filter === f.value ? "rgba(255,165,0,0.15)" : "rgba(255,255,255,0.04)",
                borderColor: filter === f.value ? "rgba(255,165,0,0.5)" : "rgba(255,255,255,0.08)",
                color: filter === f.value ? "#FFA500" : "rgba(255,255,255,0.5)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Goals Grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 24 }}>
          <EmptyState
            emoji={search ? "🔍" : "🎯"}
            title={search ? "No goals match your search" : "No goals here yet"}
            subtitle={search ? `Try a different search term.` : "Create your first goal and start tracking progress."}
            action={
              !search ? (
                <button className="btn-primary" onClick={() => setShowCreate(true)} style={{ padding: "10px 20px", fontSize: 14 }}>
                  Create first goal
                </button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map((goal) => (
            <Link key={goal.id} href={`/goals/${goal.id}`} style={{ textDecoration: "none" }}>
              <GoalCard goal={goal} />
            </Link>
          ))}
        </div>
      )}

      <CreateGoalModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
