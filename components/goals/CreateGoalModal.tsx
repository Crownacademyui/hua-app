"use client";

import { useState } from "react";
import { Modal, FormField } from "@/components/ui";
import { useGoalActions } from "@/hooks/useGoals";
import type { CreateGoalInput, GoalCategory, GoalPriority } from "@/types";

const CATEGORIES: GoalCategory[] = [
  "Business", "Finance", "Learning", "Content", "Marketing", "Health", "Other",
];

const GOAL_COLORS = [
  "#FFA500", "#22c55e", "#8b5cf6", "#06b6d4",
  "#f43f5e", "#f97316", "#3b82f6", "#ec4899",
];

interface CreateGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (goalId: string) => void;
}

export function CreateGoalModal({ open, onClose, onSuccess }: CreateGoalModalProps) {
  const { createGoal } = useGoalActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CreateGoalInput>({
    title: "",
    description: "",
    category: "Business",
    priority: "medium",
    color: "#FFA500",
    deadline: null,
  });

  function set(key: keyof CreateGoalInput, value: string | null) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Goal title is required";
    if (form.title.length > 120) errs.title = "Title must be under 120 characters";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setIsSubmitting(true);
    const goal = await createGoal(form);
    setIsSubmitting(false);

    if (goal) {
      setForm({ title: "", description: "", category: "Business", priority: "medium", color: "#FFA500", deadline: null });
      onClose();
      onSuccess?.(goal.id);
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    color: "#fff",
    fontFamily: "'Poppins', sans-serif",
    fontSize: 14,
    width: "100%",
    padding: "12px 14px",
    outline: "none",
    transition: "all 0.2s",
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Goal" maxWidth={520}>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        <FormField label="Goal title" error={errors.title} required>
          <input
            className="input-field"
            style={inputStyle}
            placeholder="e.g. Land 5 new clients this quarter"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            maxLength={120}
          />
        </FormField>

        <FormField label="Description">
          <textarea
            className="input-field"
            style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
            placeholder="What does success look like? What's your motivation?"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={3}
          />
        </FormField>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <FormField label="Category">
            <select
              className="input-field"
              style={inputStyle}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>

          <FormField label="Priority">
            <select
              className="input-field"
              style={inputStyle}
              value={form.priority}
              onChange={(e) => set("priority", e.target.value as GoalPriority)}
            >
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </FormField>
        </div>

        <FormField label="Deadline">
          <input
            className="input-field"
            style={inputStyle}
            type="date"
            value={form.deadline ?? ""}
            onChange={(e) => set("deadline", e.target.value || null)}
            min={new Date().toISOString().split("T")[0]}
          />
        </FormField>

        {/* Color picker */}
        <FormField label="Goal color">
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {GOAL_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => set("color", c)}
                style={{
                  width: 32, height: 32, borderRadius: "50%", background: c, border: "none",
                  cursor: "pointer", flexShrink: 0,
                  outline: form.color === c ? `3px solid white` : "none",
                  outlineOffset: 2,
                  transform: form.color === c ? "scale(1.15)" : "scale(1)",
                  transition: "all 0.15s",
                }}
              />
            ))}
          </div>
        </FormField>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{ padding: "14px", fontSize: 15, width: "100%", justifyContent: "center", borderRadius: 12, marginTop: 4, opacity: isSubmitting ? 0.7 : 1 }}
        >
          {isSubmitting ? "Creating…" : "Create Goal →"}
        </button>
      </form>
    </Modal>
  );
}
