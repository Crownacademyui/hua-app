"use client";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "../AuthShell";
import { useAuthStore } from "@/store/authStore";
import { FormField, Spinner } from "@/components/ui";

const ROLES = [
  { value: "freelancer", label: "🎨 Freelancer" },
  { value: "founder", label: "🚀 Founder" },
  { value: "creator", label: "✍️ Creator" },
  { value: "student", label: "📚 Student" },
];

export default function SignupPage() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function validate() {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!email.trim()) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    if (password && password.length < 8) errs.password = "Password must be at least 8 characters";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
    const { error: authError } = await signUp(email, password, fullName, role);

if (authError) {
  setIsLoading(false);
  setError(authError);
} else {
  // Get user ID from Supabase to include in notification
  const { data: { user } } = await supabase.auth.getUser();
  
  // Send notification email to you
  await fetch("/api/admin/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: fullName,
      email: email,
      userId: user?.id ?? "",
    }),
  });

  setIsLoading(false);
  router.push("/payment");
}

  const inputStyle = { padding: "12px 14px" };

  return (
    <AuthShell>
      <div style={{ width: "100%", maxWidth: 420 }} className="fade-in">
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Create your account</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 28, fontSize: 15 }}>Start setting goals that actually happen</p>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#ef4444" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <FormField label="First name" error={fieldErrors.firstName} required>
              <input className="input-field" placeholder="Amara" value={firstName} onChange={(e) => setFirstName(e.target.value)} style={inputStyle} />
            </FormField>
            <FormField label="Last name">
              <input className="input-field" placeholder="Osei" value={lastName} onChange={(e) => setLastName(e.target.value)} style={inputStyle} />
            </FormField>
          </div>

          <FormField label="Email address" error={fieldErrors.email} required>
            <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </FormField>

          <FormField label="Password" error={fieldErrors.password} required>
            <input className="input-field" type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
          </FormField>

          <FormField label="I am a…">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {ROLES.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  style={{
                    padding: "10px", borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: "pointer", textAlign: "center", transition: "all 0.2s",
                    background: role === opt.value ? "rgba(255,165,0,0.15)" : "rgba(255,255,255,0.04)",
                    border: role === opt.value ? "1px solid rgba(255,165,0,0.5)" : "1px solid rgba(255,255,255,0.08)",
                    color: role === opt.value ? "#FFA500" : "rgba(255,255,255,0.5)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </FormField>

          <button type="submit" className="btn-primary" disabled={isLoading} style={{ padding: "14px", fontSize: 15, width: "100%", justifyContent: "center", borderRadius: 12, marginTop: 4 }}>
            {isLoading ? <Spinner size={18} /> : "Create my account →"}
          </button>

          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.5 }}>
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>

          <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#FFA500", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </form>
      </div>
    </AuthShell>
  );
}