import { createClient } from "@supabase/supabase-js";

// ─── Environment Variables ────────────────────────────────────────────────────
// Add these to your .env.local file:
//   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
//   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Singleton browser client ─────────────────────────────────────────────────
let clientInstance: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return clientInstance;
}

export const supabase = getSupabaseClient();
