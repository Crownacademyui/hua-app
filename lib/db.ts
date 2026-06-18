import { supabase } from "./supabase";
import type {
  Goal,
  GoalWithSteps,
  Step,
  CreateGoalInput,
  CreateStepInput,
  UpdateStepInput,
  Profile,
} from "@/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeProgress(steps: Step[]): number {
  if (steps.length === 0) return 0;
  const done = steps.filter((s) => s.is_completed).length;
  return Math.round((done / steps.length) * 100);
}

function attachSteps(goal: Goal, steps: Step[]): GoalWithSteps {
  const goalSteps = steps.filter((s) => s.goal_id === goal.id);
  return {
    ...goal,
    steps: goalSteps.sort((a, b) => a.order_index - b.order_index),
    progress: computeProgress(goalSteps),
    completedSteps: goalSteps.filter((s) => s.is_completed).length,
    totalSteps: goalSteps.length,
  };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data?.user ?? null, error: error?.message ?? null };
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  role: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
    },
  });
  return { user: data?.user ?? null, error: error?.message ?? null };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("fetchProfile error:", error.message);
    return null;
  }
  return data as Profile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  return { error: error?.message ?? null };
}

// ─── Goals ────────────────────────────────────────────────────────────────────

export async function fetchGoals(userId: string): Promise<GoalWithSteps[]> {
  // Fetch goals and their steps in two parallel queries for efficiency
  const [goalsRes, stepsRes] = await Promise.all([
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("steps").select("*").eq("user_id", userId),
  ]);

  if (goalsRes.error) {
    console.error("fetchGoals error:", goalsRes.error.message);
    return [];
  }

  const goals = (goalsRes.data ?? []) as Goal[];
  const steps = (stepsRes.data ?? []) as Step[];

  return goals.map((goal) => attachSteps(goal, steps));
}

export async function fetchGoalById(
  goalId: string
): Promise<GoalWithSteps | null> {
  const [goalRes, stepsRes] = await Promise.all([
    supabase.from("goals").select("*").eq("id", goalId).single(),
    supabase.from("steps").select("*").eq("goal_id", goalId).order("order_index"),
  ]);

  if (goalRes.error || !goalRes.data) return null;

  const goal = goalRes.data as Goal;
  const steps = (stepsRes.data ?? []) as Step[];

  return attachSteps(goal, steps);
}

export async function createGoal(
  userId: string,
  input: CreateGoalInput
): Promise<GoalWithSteps | null> {
  const { data, error } = await supabase
    .from("goals")
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error("createGoal error:", error.message);
    return null;
  }

  return attachSteps(data as Goal, []);
}

export async function updateGoal(
  goalId: string,
  updates: Partial<Goal>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("goals")
    .update(updates as Record<string, unknown>)
    .eq("id", goalId);

  return { error: error?.message ?? null };
}

export async function deleteGoal(goalId: string): Promise<{ error: string | null }> {
  // Steps are cascade-deleted via FK
  const { error } = await supabase.from("goals").delete().eq("id", goalId);
  return { error: error?.message ?? null };
}

// ─── Steps ────────────────────────────────────────────────────────────────────

export async function createStep(
  userId: string,
  input: CreateStepInput
): Promise<Step | null> {
  const { data, error } = await supabase
    .from("steps")
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) {
    console.error("createStep error:", error.message);
    return null;
  }

  return data as Step;
}

export async function toggleStep(
  stepId: string,
  currentValue: boolean
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("steps")
    .update({ is_completed: !currentValue })
    .eq("id", stepId);

  return { error: error?.message ?? null };
}

export async function updateStep(
  input: UpdateStepInput
): Promise<{ error: string | null }> {
  const { id, ...updates } = input;
  const { error } = await supabase.from("steps").update(updates as Record<string, unknown>).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteStep(stepId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("steps").delete().eq("id", stepId);
  return { error: error?.message ?? null };
}
