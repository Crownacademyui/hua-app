"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useGoal, useGoalActions } from "@/hooks/useGoals";
import { useGoalStore } from "@/store/goalStore";
import { StepList } from "@/components/goals/StepList";
import { ProgressBar, Badge, Tag, Spinner } from "@/components/ui";
import type { GoalStatus } from "@/types";

const STATUS_OPTIONS: { value: GoalStatus; label: string }[] = [
  { value: "active", label: "🟡 Active" },
  { value: "completed", label: "✅ Completed" },
  { value: "paused", label: "⏸ Paused" },
  { value: "archived", label: "📦 Archived" },
];

export default function GoalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const goal = useGoal(id);
  const isLoading = useGoalStore((s) => s.isLoading);
  const { updateGoal, deleteGoal } = useGoalActions();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editDeadline, setEditDeadline] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!goal) {
    if (isLoading) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
          <Spinner size={32} />
        </div>
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 16 }}>
        <div style={{ fontSize: 48 }}>🎯</div>
        <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#1a1a2e" }}>Goal not found</h3>
        <p style={{ fontSize: 14, color: "#6b7280" }}>This goal may have been deleted.</p>
        <Link href="/goals" className="btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Back to Goals</Link>
      </div>
    );
  }

  const priorityColor =
    goal.priority === "high" ? "#ef4444" :
    goal.priority === "medium" ? "#f97316" :
    "#6b7280";

  const deadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  function startEditing() {
    setEditTitle(goal!.title);
    setEditDesc(goal!.description);
    setEditDeadline(goal!.deadline ?? "");
    setIsEditing(true);
  }

  async function saveEdits() {
    setIsSaving(true);
    await updateGoal(id, {
      title: editTitle.trim() || goal!.title,
      description: editDesc,
      deadline: editDeadline || null,
    });
    setIsSaving(false);
    setIsEditing(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${goal!.title}"? This will also delete all steps. This cannot be undone.`)) return;
    setIsDeleting(true);
    await deleteGoal(id);
    router.push("/goals");
  }

  async function handleStatusChange(status: GoalStatus) {
    await updateGoal(id, { status });
  }

  const inputStyle = {
    background: "#fff",
    border: "1px solid rgba(255,165,0,0.4)",
    borderRadius: 10,
    color: "#1a1a2e",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    padding: "10px 12px",
    outline: "none",
    width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 860 }}>
      {/* Back nav */}
      <Link href="/goals" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#6b7280", textDecoration: "none", alignSelf: "flex-start" }}>
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: "rotate(180deg)" }}>
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        Back to Goals
      </Link>

      {/* Header card */}
      <div className="card" style={{ padding: 28, background: `linear-gradient(135deg, ${goal.color}12, rgba(2,6,111,0.04))`, border: `1px solid ${goal.color}30` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: goal.color }} />
              <Tag color={goal.color}>{goal.category}</Tag>
              <Badge color={priorityColor}>{goal.priority} priority</Badge>
              {/* Status selector */}
              <select
                value={goal.status}
                onChange={(e) => handleStatusChange(e.target.value as GoalStatus)}
                style={{ background: "#fff", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, color: "#1a1a2e", fontFamily: "'Poppins', sans-serif", fontSize: 12, padding: "3px 10px", cursor: "pointer", outline: "none" }}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {isEditing ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={{ ...inputStyle, fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }} />
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} style={{ ...inputStyle, resize: "vertical", minHeight: 60 }} rows={2} />
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <label style={{ fontSize: 12, color: "#6b7280", whiteSpace: "nowrap" }}>Deadline:</label>
                  <input type="date" value={editDeadline} onChange={(e) => setEditDeadline(e.target.value)} style={{ ...inputStyle, width: "auto" }} />
                </div>
              </div>
            ) : (
              <>
                <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, lineHeight: 1.3, color: "#1a1a2e" }}>{goal.title}</h1>
                {goal.description && (
                  <p style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.6 }}>{goal.description}</p>
                )}
              </>
            )}
          </div>

          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            {isEditing ? (
              <>
                <button onClick={saveEdits} className="btn-primary" disabled={isSaving} style={{ padding: "10px 16px", fontSize: 13 }}>
                  {isSaving ? <Spinner size={14} /> : "Save"}
                </button>
                <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: "10px 16px", fontSize: 13 }}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={startEditing} className="btn-secondary" style={{ padding: "10px 16px", fontSize: 13 }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  Edit
                </button>
                <button onClick={handleDelete} disabled={isDeleting}
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, color: "#ef4444", cursor: "pointer", padding: "10px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                  {isDeleting ? <Spinner size={14} /> : (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  )}
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "start" }}>

        {/* Steps */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, color: "#1a1a2e" }}>Steps & Milestones</h3>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{goal.completedSteps}/{goal.totalSteps} done</span>
          </div>
          <StepList goalId={goal.id} steps={goal.steps} />
        </div>

        {/* Meta sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Progress */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 16, color: "#1a1a2e" }}>Progress</h4>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 52, fontWeight: 800, color: goal.color, lineHeight: 1 }}>{goal.progress}%</div>
              <p style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>complete</p>
            </div>
            <ProgressBar value={goal.progress} color={goal.color} height={8} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>0%</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>100%</span>
            </div>
            {goal.progress === 100 && (
              <div style={{ textAlign: "center", marginTop: 12, fontSize: 22 }}>🏆 Goal complete!</div>
            )}
          </div>

          {/* Details */}
          <div className="card" style={{ padding: 20 }}>
            <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 14, color: "#1a1a2e" }}>Details</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Status", value: goal.status },
                { label: "Priority", value: goal.priority },
                { label: "Category", value: goal.category },
                { label: "Deadline", value: deadline ?? "None set" },
                { label: "Steps", value: `${goal.completedSteps} of ${goal.totalSteps}` },
              ].map((d) => (
                <div key={d.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{d.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize", color: "#1a1a2e" }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}