"use client";

import { create } from "zustand";
import type { AuthStore, Profile } from "@/types";
import * as db from "@/lib/db";

const IS_DEMO = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "your_supabase_project_url";

const DEMO_PROFILE: Profile = {
  id: "demo-user-local",
  full_name: "Amara Osei",
  email: "amara@example.com",
  avatar_url: null,
  role: "freelancer",
  location: "Accra, Ghana",
  phone: "+233 50 123 4567",
  bio: "Freelance UI/UX Designer building digital products for global clients.",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,

  fetchProfile: async () => {
    if (IS_DEMO) {
      set({ user: DEMO_PROFILE });
      return;
    }
    const userId = await db.getCurrentUserId();
    if (!userId) return;
    const profile = await db.fetchProfile(userId);
    if (profile) set({ user: profile });
  },

  signIn: async (email, password) => {
    if (IS_DEMO) {
      set({ user: DEMO_PROFILE });
      return { error: null };
    }
    const { error } = await db.signIn(email, password);
    if (!error) {
      const userId = await db.getCurrentUserId();
      if (userId) {
        const profile = await db.fetchProfile(userId);
        if (profile) set({ user: profile });
      }
    }
    return { error };
  },

  signUp: async (email, password, name, role) => {
    if (IS_DEMO) {
      set({ user: { ...DEMO_PROFILE, full_name: name, email, role } });
      return { error: null };
    }
    const { error } = await db.signUp(email, password, name, role);
    return { error };
  },

  signOut: async () => {
    if (!IS_DEMO) await db.signOut();
    set({ user: null });
  },
}));
