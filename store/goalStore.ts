"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
import type { GoalStore, GoalWithSteps, CreateGoalInput, CreateStepInput, UpdateStepInput } from "@/types";
import * as db from "@/lib/db";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO_USER_ID = "demo-user-local";

// ─── Local storage helpers (used in demo/offline mode) ────────────────────────

function loadFromStorage(): GoalWithSteps[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("hua_goals");
    return raw ? JSON.parse(raw) : getDefaultGoals();
  } catch {
    return getDefaultGoals();
  }
}

function saveToStorage(goals: GoalWithSteps[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("hua_goals", JSON.stringify(goals));
  } catch {}
}

function computeProgress(steps: { is_completed: boolean }[]): number {
  if (!steps.length) return 0;
  return Math.round((steps.filter((s) => s.is_completed).length / steps.length) * 100);
}

function getDefaultGoals(): GoalWithSteps[] {
  const now = new Date().toISOString();
  const makeStep = (goalId: string, title: string, done: boolean, idx: number) => ({
    id: uuidv4(), goal_id: goalId, user_id: DEMO_USER_ID,
    title, is_completed: done, order_index: idx, created_at: now, updated_at: now,
  });

  const g1Id = uuidv4();
  const g1Steps = [
    makeStep(g1Id, "Research competitors and positioning", true, 0),
    makeStep(g1Id, "Design portfolio layout in Figma", true, 1),
    makeStep(g1Id, "Build responsive HTML/CSS structure", true, 2),
    makeStep(g1Id, "Add case studies and work samples", true, 3),
    makeStep(g1Id, "Set up custom domain and hosting", false, 4),
    makeStep(g1Id, "Launch and share with network", false, 5),
  ];

  const g2Id = uuidv4();
  const g2Steps = [
    makeStep(g2Id, "Calculate monthly expenses baseline", true, 0),
    makeStep(g2Id, "Open dedicated savings account", true, 1),
    makeStep(g2Id, "Set up automatic transfer (10%)", false, 2),
    makeStep(g2Id, "Reach first ₦100,000 milestone", false, 3),
    makeStep(g2Id, "Reach final ₦500,000 target", false, 4),
  ];

  const g3Id = uuidv4();
  const g3Steps = [
    makeStep(g3Id, "Complete UX foundations module", true, 0),
    makeStep(g3Id, "Finish Figma advanced techniques", true, 1),
    makeStep(g3Id, "Complete design systems chapter", true, 2),
    makeStep(g3Id, "Build a capstone project", true, 3),
    makeStep(g3Id, "Get certificate and add to portfolio", false, 4),
  ];

  const g4Id = uuidv4();
  const g4Steps = [
    makeStep(g4Id, "Define ideal client profile", true, 0),
    makeStep(g4Id, "Build outreach list (50 prospects)", false, 1),
    makeStep(g4Id, "Send first 20 proposals", false, 2),
    makeStep(g4Id, "Follow up sequence", false, 3),
  ];

  const make = (id: string, title: string, desc: string, category: string, priority: string, color: string, deadline: string, status: string, steps: ReturnType<typeof makeStep>[]) => ({
    id, user_id: DEMO_USER_ID, title, description: desc,
    category: category as any, priority: priority as any,
    status: status as any, color, deadline, created_at: now, updated_at: now,
    steps,
    progress: computeProgress(steps),
    completedSteps: steps.filter(s => s.is_completed).length,
    totalSteps: steps.length,
  });

  return [
    make(g1Id, "Launch Freelance Portfolio Site", "Build and launch a professional portfolio to attract high-value clients.", "Business", "high", "#FFA500", "2025-04-15", "active", g1Steps),
    make(g2Id, "Save ₦500,000 Emergency Fund", "Build a 3-month financial safety net for business stability.", "Finance", "high", "#22c55e", "2025-06-30", "active", g2Steps),
    make(g3Id, "Complete UI/UX Design Course", "Finish the advanced Figma and design systems course on Coursera.", "Learning", "medium", "#8b5cf6", "2025-03-30", "active", g3Steps),
    make(g4Id, "Get 10 Paying Clients", "Scale client base to achieve consistent monthly revenue.", "Business", "high", "#06b6d4", "2025-07-01", "active", g4Steps),
  ];
}

// ─── Store Definition ─────────────────────────────────────────────────────────

const IS_DEMO = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url";

export const useGoalStore = create<GoalStore>()(
  immer((set, get) => ({
    goals: [],
    isLoading: false,
    error: null,

    // ── Fetch ──────────────────────────────────────────────────────────────────
    fetchGoals: async () => {
      set((s) => { s.isLoading = true; s.error = null; });

      if (IS_DEMO) {
        // Use localStorage in demo mode
        await new Promise((r) => setTimeout(r, 300)); // simulate latency
        set((s) => { s.goals = loadFromStorage(); s.isLoading = false; });
        return;
      }

      const userId = await db.getCurrentUserId();
      if (!userId) { set((s) => { s.isLoading = false; }); return; }

      const goals = await db.fetchGoals(userId);
      set((s) => { s.goals = goals; s.isLoading = false; });
    },

    // ── Create Goal ───────────────────────────────────────────────────────────
    createGoal: async (input: CreateGoalInput) => {
      const now = new Date().toISOString();

      if (IS_DEMO) {
        const newGoal: GoalWithSteps = {
          id: uuidv4(), user_id: DEMO_USER_ID, ...input,
          status: "active", steps: [], progress: 0,
          completedSteps: 0, totalSteps: 0,
          created_at: now, updated_at: now,
        };
        set((s) => { s.goals.unshift(newGoal); });
        saveToStorage(get().goals);
        return newGoal;
      }

      const userId = await db.getCurrentUserId();
      if (!userId) return null;
      const goal = await db.createGoal(userId, input);
      if (goal) set((s) => { s.goals.unshift(goal); });
      return goal;
    },

    // ── Update Goal ───────────────────────────────────────────────────────────
    updateGoal: async (id, updates) => {
      // Optimistic update
      set((s) => {
        const goal = s.goals.find((g) => g.id === id);
        if (goal) Object.assign(goal, updates);
      });

      if (IS_DEMO) { saveToStorage(get().goals); return; }
      await db.updateGoal(id, updates);
    },

    // ── Delete Goal ───────────────────────────────────────────────────────────
    deleteGoal: async (id) => {
      set((s) => { s.goals = s.goals.filter((g) => g.id !== id); });

      if (IS_DEMO) { saveToStorage(get().goals); return; }
      await db.deleteGoal(id);
    },

    // ── Create Step ───────────────────────────────────────────────────────────
    createStep: async (input: CreateStepInput) => {
      const now = new Date().toISOString();

      if (IS_DEMO) {
        const newStep = {
          id: uuidv4(), user_id: DEMO_USER_ID,
          is_completed: false, created_at: now, updated_at: now, ...input,
        };
        set((s) => {
          const goal = s.goals.find((g) => g.id === input.goal_id);
          if (goal) {
            goal.steps.push(newStep);
            goal.totalSteps = goal.steps.length;
            goal.progress = computeProgress(goal.steps);
          }
        });
        saveToStorage(get().goals);
        return newStep;
      }

      const userId = await db.getCurrentUserId();
      if (!userId) return null;
      const step = await db.createStep(userId, input);
      if (step) {
        set((s) => {
          const goal = s.goals.find((g) => g.id === input.goal_id);
          if (goal) {
            goal.steps.push(step);
            goal.totalSteps = goal.steps.length;
            goal.progress = computeProgress(goal.steps);
          }
        });
      }
      return step;
    },

    // ── Toggle Step ───────────────────────────────────────────────────────────
    toggleStep: async (stepId, goalId) => {
      // Optimistic update
      set((s) => {
        const goal = s.goals.find((g) => g.id === goalId);
        if (!goal) return;
        const step = goal.steps.find((s) => s.id === stepId);
        if (!step) return;
        step.is_completed = !step.is_completed;
        goal.completedSteps = goal.steps.filter((s) => s.is_completed).length;
        goal.progress = computeProgress(goal.steps);
        // Auto-complete goal if all steps done
        if (goal.progress === 100 && goal.status === "active") {
          goal.status = "completed";
        } else if (goal.progress < 100 && goal.status === "completed") {
          goal.status = "active";
        }
      });

      if (IS_DEMO) { saveToStorage(get().goals); return; }

      const goal = get().goals.find((g) => g.id === goalId);
      const step = goal?.steps.find((s) => s.id === stepId);
      if (!step) return;
      // We already toggled optimistically, pass the NEW value
      await db.toggleStep(stepId, !step.is_completed);
      if (goal) await db.updateGoal(goalId, { status: goal.status });
    },

    // ── Update Step ───────────────────────────────────────────────────────────
    updateStep: async (input: UpdateStepInput) => {
      set((s) => {
        for (const goal of s.goals) {
          const step = goal.steps.find((st) => st.id === input.id);
          if (step) { Object.assign(step, input); break; }
        }
      });

      if (IS_DEMO) { saveToStorage(get().goals); return; }
      await db.updateStep(input);
    },

    // ── Delete Step ───────────────────────────────────────────────────────────
    deleteStep: async (stepId, goalId) => {
      set((s) => {
        const goal = s.goals.find((g) => g.id === goalId);
        if (!goal) return;
        goal.steps = goal.steps.filter((s) => s.id !== stepId);
        goal.totalSteps = goal.steps.length;
        goal.completedSteps = goal.steps.filter((s) => s.is_completed).length;
        goal.progress = computeProgress(goal.steps);
      });

      if (IS_DEMO) { saveToStorage(get().goals); return; }
      await db.deleteStep(stepId);
    },

    // ── Helper ────────────────────────────────────────────────────────────────
    getGoalById: (id) => get().goals.find((g) => g.id === id),
  }))
);
