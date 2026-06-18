"use client";

import { useMemo } from "react";
import { useGoalStore } from "@/store/goalStore";
import type { GoalStatus, GoalWithSteps } from "@/types";

// ─── useGoals: all goals with optional filter ──────────────────────────────────
export function useGoals(statusFilter?: GoalStatus) {
  const goals = useGoalStore((s) => s.goals);
  return useMemo(() => {
    if (!statusFilter) return goals;
    return goals.filter((g) => g.status === statusFilter);
  }, [goals, statusFilter]);
}

// ─── useGoal: single goal by id ───────────────────────────────────────────────
export function useGoal(id: string): GoalWithSteps | undefined {
  return useGoalStore((s) => s.goals.find((g) => g.id === id));
}

// ─── useDashboardStats: aggregated numbers for the dashboard ──────────────────
export function useDashboardStats() {
  const goals = useGoalStore((s) => s.goals);

  return useMemo(() => {
    const active = goals.filter((g) => g.status === "active");
    const completed = goals.filter((g) => g.status === "completed");
    const avgProgress =
      active.length > 0
        ? Math.round(active.reduce((sum, g) => sum + g.progress, 0) / active.length)
        : 0;
    const totalSteps = goals.reduce((sum, g) => sum + g.totalSteps, 0);
    const completedSteps = goals.reduce((sum, g) => sum + g.completedSteps, 0);

    return { active, completed, avgProgress, totalSteps, completedSteps, all: goals };
  }, [goals]);
}

// ─── useGoalActions: bound action creators ────────────────────────────────────
export function useGoalActions() {
  const createGoal = useGoalStore((s) => s.createGoal);
  const updateGoal = useGoalStore((s) => s.updateGoal);
  const deleteGoal = useGoalStore((s) => s.deleteGoal);
  const createStep = useGoalStore((s) => s.createStep);
  const toggleStep = useGoalStore((s) => s.toggleStep);
  const updateStep = useGoalStore((s) => s.updateStep);
  const deleteStep = useGoalStore((s) => s.deleteStep);

  return { createGoal, updateGoal, deleteGoal, createStep, toggleStep, updateStep, deleteStep };
}
