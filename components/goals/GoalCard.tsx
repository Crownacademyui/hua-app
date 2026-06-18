"use client";

import { useState } from "react";
import { ProgressBar, Badge, Tag } from "@/components/ui";
import { useGoalActions } from "@/hooks/useGoals";
import type { GoalWithSteps } from "@/types";

interface GoalCardProps {
  goal: GoalWithSteps;
  onClick?: () => void;
  compact?: boolean;
}

export function GoalCard({ goal, onClick, compact = false }: GoalCardProps) {
  const { deleteGoal, updateGoal } = useGoalActions();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm(`Delete "${goal.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    await deleteGoal(goal.id);
  }

  async function handleComplete(e: React.MouseEvent) {
    e.stopPropagation();
    await updateGoal(goal.id, {
      status: goal.status === "completed" ? "active" : "completed",
    });
  }

  const priorityColor =
    goal.priority === "high" ? "#ef4444" :
    goal.priority === "medium" ? "#f97316" :
    "#6b7280";

  const deadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  const isOverdue = goal.deadline && new Date(goal.deadline) < new Date() && goal.status !== "completed";

  return (
    <div
      className="card"
      onClick={onClick}
      style={{ padding: compact ? 16 : 20, cursor: onClick ? "pointer" : "default", opacity: deleting ? 0.5 : 1, transition: "opacity 0.2s" }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: goal.color, flexShrink: 0 }} />
          <Tag color={goal.color}>{goal.category}</Tag>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Badge color={priorityColor}>{goal.priority}</Badge>
          {!compact && (
            <>
              <button onClick={handleComplete} title={goal.status === "completed" ? "Mark active" : "Mark complete"}
                style={{ background: "none", border: "none", cursor: "pointer", color: goal.status === "completed" ? "#22c55e" : "rgba(255,255,255,0.3)", padding: 4, borderRadius: 6, display: "flex", transition: "color 0.15s" }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </button>
              <button onClick={handleDelete}
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", padding: 4, borderRadius: 6, display: "flex", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: compact ? 14 : 15, fontWeight: 700, marginBottom: compact ? 6 : 8, lineHeight: 1.3 }}>{goal.title}</h3>

      {!compact && goal.description && (
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {goal.description}
        </p>
      )}

      {/* Progress */}
      <div style={{ marginBottom: compact ? 8 : 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>
            {goal.completedSteps}/{goal.totalSteps} steps
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: goal.color }}>
            {goal.progress}%
          </span>
        </div>
        <ProgressBar value={goal.progress} color={goal.color} height={5} />
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {deadline ? (
          <span style={{ fontSize: 12, color: isOverdue ? "#ef4444" : "rgba(255,255,255,0.4)" }}>
            {isOverdue ? "⚠ " : ""}Due {deadline}
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>No deadline</span>
        )}
        {goal.status === "completed" && (
          <span style={{ fontSize: 12, color: "#22c55e", fontWeight: 600 }}>✓ Completed</span>
        )}
      </div>
    </div>
  );
}
