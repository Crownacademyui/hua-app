"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FormField, Spinner } from "@/components/ui";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    // Supabase automatically reads the reset token from the URL hash
    // and creates a temporary session for password reset
    supabase.auth.onAuthStateChange(function (event, session) {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
      }
    });

    // Also check if session already exists (in case event fired before listener attached)
    supabase.auth.getSession().then(function (result) {
      if (result.data.session) {
        setSessionReady(true);
      }
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!password || !confirmPassword) {
      setError("Please fill in both fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    const result = await supabase.auth.updateUser({ password: password });
    setIsLoading(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess(true);
      // Sign out so they have to log in fresh with new password
      await supabase.auth.signOut();
      setTimeout(function () {
        router.push("/auth/login");
      }, 2500);
    }
  }

  const inputStyle = { padding: "12px 14px" };

  if (success) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0F3C", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Password updated!</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0F3C", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #FFA500, #ff6b00)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 24, color: "#fff" }}>Set new password</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>Choose a strong new password for your account</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
          {!sessionReady ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <Spinner size={24} />
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 16 }}>Verifying your reset link...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error ? (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#ef4444" }}>
                  {error}
                </div>
              ) : null}

              <FormField label="New password">
                <div style={{ position: "relative" }}>
                  <input
                    className="input-field"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={function (e) { setPassword(e.target.value); }}
                    style={{ ...inputStyle, paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={function () { setShowPassword(!showPassword); }}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", display: "flex" }}
                  >
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0" /></svg>
                  </button>
                </div>
              </FormField>

              <FormField label="Confirm new password">
                <input
                  className="input-field"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={function (e) { setConfirmPassword(e.target.value); }}
                  style={inputStyle}
                />
              </FormField>

              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{ padding: "14px", fontSize: 15, width: "100%", justifyContent: "center", borderRadius: 12, marginTop: 4 }}
              >
                {isLoading ? <Spinner size={18} /> : "Update password"}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 20 }}>
          <Link href="/auth/login" style={{ color: "#FFA500", textDecoration: "none" }}>Back to login</Link>
        </p>
      </div>
    </div>
  );
}
