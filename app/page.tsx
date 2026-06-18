import { redirect } from "next/navigation";

// Root "/" redirects to the landing page.
// In production with Supabase auth middleware, this would check
// the session and redirect to /dashboard if authenticated.
export default function RootPage() {
  redirect("/landing");
}
