"use client";

import { useState, useRef } from "react";
import { useGoalActions } from "@/hooks/useGoals";
import { Spinner } from "@/components/ui";
import type { Step } from "@/types";

interface StepListProps {
  goalId: string;
  steps: Step[];
}

export function StepList({ goalId, steps }: StepListProps) {
  const { createStep, toggleStep, deleteStep, updateStep } = useGoalActions();
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [addingStep, setAddingStep] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAddingStep(true);
    await createStep({
      goal_id: goalId,
      title: newTitle.trim(),
      order_index: steps.length,
    });
    setNewTitle("");
    setAddingStep(false);
    setIsAdding(false);
  }

  async function handleToggle(step: Step) {
    setTogglingId(step.id);
    await toggleStep(step.id, goalId);
    setTogglingId(null);
  }

  async function handleDelete(stepId: string) {
    await deleteStep(stepId, goalId);
  }

  async function handleEditSave(step: Step) {
    if (editTitle.trim() && editTitle !== step.title) {
      await updateStep({ id: step.id, title: editTitle.trim() });
    }
    setEditingId(null);
    setEditTitle("");
  }

  const sorted = [...steps].sort((a, b) => a.order_index - b.order_index);

  return (
    <div>
      {/* Steps list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sorted.map((step) => (
          <div
            key={step.id}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px",
              borderRadius: 10, cursor: "default",
              background: step.is_completed ? "rgba(34,197,94,0.05)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${step.is_completed ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.07)"}`,
              transition: "all 0.2s",
            }}
          >
            {/* Checkbox */}
            <button
              onClick={() => handleToggle(step)}
              disabled={togglingId === step.id}
              style={{
                width: 22, height: 22, borderRadius: "50%",
                border: `2px solid ${step.is_completed ? "#22c55e" : "rgba(255,255,255,0.2)"}`,
                background: step.is_completed ? "#22c55e" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, cursor: "pointer", transition: "all 0.2s",
                padding: 0,
              }}
            >
              {togglingId === step.id ? (
                <div style={{ width: 10, height: 10, border: "1.5px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              ) : step.is_completed ? (
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : null}
            </button>

            {/* Title (editable) */}
            {editingId === step.id ? (
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onBlur={() => handleEditSave(step)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditSave(step);
                  if (e.key === "Escape") { setEditingId(null); }
                }}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,165,0,0.4)",
                  borderRadius: 6, color: "#fff", fontFamily: "'Poppins', sans-serif", fontSize: 14,
                  padding: "4px 8px", outline: "none",
                }}
              />
            ) : (
              <span
                onDoubleClick={() => { setEditingId(step.id); setEditTitle(step.title); }}
                style={{
                  flex: 1, fontSize: 14,
                  color: step.is_completed ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.9)",
                  textDecoration: step.is_completed ? "line-through" : "none",
                  transition: "all 0.2s", cursor: "default",
                }}
                title="Double-click to edit"
              >
                {step.title}
              </span>
            )}

            {/* Delete */}
            <button
              onClick={() => handleDelete(step.id)}
              style={{
                background: "none", border: "none", color: "rgba(255,255,255,0.2)",
                cursor: "pointer", display: "flex", padding: 4, borderRadius: 6,
                opacity: 0, transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {steps.length === 0 && !isAdding && (
        <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
          No steps yet. Add your first step below.
        </div>
      )}

      {/* Add step form */}
      {isAdding ? (
        <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <input
            ref={inputRef}
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Step title…"
            onKeyDown={(e) => { if (e.key === "Escape") setIsAdding(false); }}
            style={{
              flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,165,0,0.4)",
              borderRadius: 10, color: "#fff", fontFamily: "'Poppins', sans-serif", fontSize: 14,
              padding: "10px 14px", outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={addingStep || !newTitle.trim()}
            className="btn-primary"
            style={{ padding: "10px 16px", fontSize: 13, borderRadius: 10, whiteSpace: "nowrap" }}
          >
            {addingStep ? <Spinner size={14} /> : "Add"}
          </button>
          <button type="button" onClick={() => { setIsAdding(false); setNewTitle(""); }}
            className="btn-secondary" style={{ padding: "10px 16px", fontSize: 13, borderRadius: 10 }}>
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => { setIsAdding(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          className="btn-secondary"
          style={{ marginTop: 12, padding: "10px 16px", fontSize: 13, borderRadius: 10, width: "100%" }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add step
        </button>
      )}

      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
        Tip: Double-click any step to rename it
      </p>
    </div>
  );
}
