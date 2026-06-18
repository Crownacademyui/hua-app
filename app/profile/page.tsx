"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDashboardStats } from "@/hooks/useGoals";
import { Avatar, Badge, FormField } from "@/components/ui";
import * as db from "@/lib/db";

const ACHIEVEMENTS = [
  { emoji: "🔥", label: "7-Day Streak", unlocked: true },
  { emoji: "🏆", label: "First Goal Done", unlocked: true },
  { emoji: "🌟", label: "10 Goals Set", unlocked: false },
  { emoji: "💎", label: "30-Day Streak", unlocked: false },
  { emoji: "🚀", label: "Pro Achiever", unlocked: false },
  { emoji: "🌍", label: "Global Freelancer", unlocked: false },
];

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const { active, completed } = useDashboardStats();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    full_name: user?.full_name ?? "",
    role: user?.role ?? "",
    location: user?.location ?? "",
    phone: user?.phone ?? "",
    bio: user?.bio ?? "",
  });

  function setField(k: keyof typeof form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    await db.updateProfile(user.id, form);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const inputStyle = { padding: "10px 12px" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 700 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Profile</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Manage your account and preferences</p>
      </div>

      {saved && (
        <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#22c55e" }}>
          ✓ Profile saved successfully
        </div>
      )}

      {/* Profile header */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <Avatar name={user?.full_name ?? "U"} size={80} src={user?.avatar_url ?? undefined} />
            <button style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#FFA500", border: "2px solid #0A0F3C", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.full_name}</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "capitalize" }}>
              {user?.role} {user?.location ? `· ${user.location}` : ""}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Badge color="#FFA500">7-day streak 🔥</Badge>
              <Badge color="#22c55e">{completed.length} goals completed</Badge>
              <Badge color="#8b5cf6">{active.length} active goals</Badge>
            </div>
          </div>
          <button className="btn-secondary" onClick={() => { setEditing(!editing); setForm({ full_name: user?.full_name ?? "", role: user?.role ?? "", location: user?.location ?? "", phone: user?.phone ?? "", bio: user?.bio ?? "" }); }} style={{ padding: "10px 18px", fontSize: 13 }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <div className="card" style={{ padding: 24 }}>
        <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: 20 }}>Personal Information</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            { label: "Full name", key: "full_name" as const, value: user?.full_name ?? "" },
            { label: "Role / Title", key: "role" as const, value: user?.role ?? "" },
            { label: "Email", key: null, value: user?.email ?? "" },
            { label: "Phone", key: "phone" as const, value: user?.phone ?? "" },
            { label: "Location", key: "location" as const, value: user?.location ?? "" },
          ].map((f) => (
            <div key={f.label}>
              <FormField label={f.label}>
                {editing && f.key ? (
                  <input className="input-field" value={form[f.key]} onChange={(e) => setField(f.key!, e.target.value)} style={inputStyle} />
                ) : (
                  <p style={{ fontSize: 14, fontWeight: 500, padding: "2px 0", color: f.value ? "#fff" : "rgba(255,255,255,0.3)" }}>
                    {f.value || "Not set"}
                  </p>
                )}
              </FormField>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16 }}>
          <FormField label="Bio">
            {editing ? (
              <textarea className="input-field" value={form.bio} onChange={(e) => setField("bio", e.target.value)} style={{ padding: "10px 12px", resize: "vertical" }} rows={3} placeholder="Tell us about yourself…" />
            ) : (
              <p style={{ fontSize: 14, color: user?.bio ? "#fff" : "rgba(255,255,255,0.3)" }}>{user?.bio || "No bio yet"}</p>
            )}
          </FormField>
        </div>

        {editing && (
          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ padding: "12px 24px", fontSize: 14, borderRadius: 12, marginTop: 20 }}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        )}
      </div>

      {/* Achievements */}
      <div className="card" style={{ padding: 24 }}>
        <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: 16 }}>Achievements</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {ACHIEVEMENTS.map((a) => (
            <div key={a.label} className="card" style={{ padding: 14, textAlign: "center", opacity: a.unlocked ? 1 : 0.35, border: a.unlocked ? "1px solid rgba(255,165,0,0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{a.emoji}</div>
              <p style={{ fontSize: 11, fontWeight: 600, color: a.unlocked ? "#FFA500" : "rgba(255,255,255,0.4)" }}>{a.label}</p>
              {!a.unlocked && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>Locked</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="card" style={{ padding: 24, border: "1px solid rgba(239,68,68,0.2)" }}>
        <h4 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: 8, color: "#ef4444" }}>Danger Zone</h4>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 16 }}>These actions are irreversible.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ padding: "10px 18px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, color: "#ef4444", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
            Delete Account
          </button>
          <button style={{ padding: "10px 18px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
}
