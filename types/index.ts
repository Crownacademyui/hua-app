// ─── Database Types (mirrors Supabase schema) ─────────────────────────────────

export type GoalStatus = "active" | "completed" | "paused" | "archived";
export type GoalPriority = "high" | "medium" | "low";
export type GoalCategory =
  | "Business"
  | "Finance"
  | "Learning"
  | "Content"
  | "Marketing"
  | "Health"
  | "Other";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  status: GoalStatus;
  color: string;
  deadline: string | null; // ISO date string
  created_at: string;
  updated_at: string;
}

export interface Step {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  role: string;
  location: string | null;
  phone: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Computed / UI Types ──────────────────────────────────────────────────────

export interface GoalWithSteps extends Goal {
  steps: Step[];
  progress: number; // 0–100 computed from steps
  completedSteps: number;
  totalSteps: number;
}

// ─── Form Types ───────────────────────────────────────────────────────────────

export interface CreateGoalInput {
  title: string;
  description: string;
  category: GoalCategory;
  priority: GoalPriority;
  color: string;
  deadline: string | null;
}

export interface CreateStepInput {
  goal_id: string;
  title: string;
  order_index: number;
}

export interface UpdateStepInput {
  id: string;
  is_completed?: boolean;
  title?: string;
  order_index?: number;
}

// ─── Store Types ──────────────────────────────────────────────────────────────

export interface GoalStore {
  goals: GoalWithSteps[];
  isLoading: boolean;
  error: string | null;

  // Goal CRUD
  fetchGoals: () => Promise<void>;
  createGoal: (input: CreateGoalInput) => Promise<GoalWithSteps | null>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  // Step CRUD
  createStep: (input: CreateStepInput) => Promise<Step | null>;
  toggleStep: (stepId: string, goalId: string) => Promise<void>;
  updateStep: (input: UpdateStepInput) => Promise<void>;
  deleteStep: (stepId: string, goalId: string) => Promise<void>;

  // Helpers
  getGoalById: (id: string) => GoalWithSteps | undefined;
}

export interface AuthStore {
  user: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string, role: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}
