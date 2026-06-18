"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "../AuthShell";
import { useAuthStore } from "@/store/authStore";
import { FormField, Spinner } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);

  const [email, setEmail] = useState("amara@example.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }

    setIsLoading(true);
    setError(null);
    const { error: authError } = await signIn(email, password);
    setIsLoading(false);

    if (authError) {
      setError(authError);
    } else {
      router.push("/dashboard");
    }
  }

  const inputStyle = { padding: "12px 14px 12px 40px" };

  return (
    <AuthShell>
      <div style={{ width: "100%", maxWidth: 400 }} className="fade-in">
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Welcome back 👋</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 32, fontSize: 15 }}>Sign in to continue your journey</p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#ef4444" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FormField label="Email address">
            <div style={{ position: "relative" }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6" />
              </svg>
              <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
            </div>
          </FormField>

          <FormField label="Password">
            <div style={{ position: "relative" }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                <path d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input className="input-field" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ ...inputStyle, paddingRight: 40 }} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" /></svg>
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
              <button type="button" style={{ background: "none", border: "none", fontSize: 13, color: "#FFA500", cursor: "pointer" }}>Forgot password?</button>
            </div>
          </FormField>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: "14px", fontSize: 15, width: "100%", justifyContent: "center", borderRadius: 12, marginTop: 4 }}>
            {isLoading ? <Spinner size={18} /> : "Sign in to Hua"}
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Don't have an account?{" "}
            <Link href="/auth/signup" style={{ color: "#FFA500", fontWeight: 600, textDecoration: "none" }}>Sign up free</Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}
