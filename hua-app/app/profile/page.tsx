"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDashboardStats } from "@/hooks/useGoals";
import { Avatar, Badge, FormField, Spinner } from "@/components/ui";
import { supabase } from "@/lib/supabase";
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
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const { active, completed } = useDashboardStats();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // ─── Avatar Upload ────────────────────────────────────────────────────────
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate
    if (!file.type.startsWith("image/")) {
      setAvatarError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Image must be under 5MB.");
      return;
    }

    setUploadingAvatar(true);
    setAvatarError("");

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `avatars/${user.id}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Save to profile
      await db.updateProfile(user.id, { avatar_url: publicUrl });

      // Refresh user in store
      await fetchProfile();
    } catch (err: any) {
      setAvatarError(err.message ?? "Upload failed. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  // ─── Save Profile ─────────────────────────────────────────────────────────
  async function handleSave() {
    if (!user) return;
    setSaving(true);
    await db.updateProfile(user.id, form as Record<string, unknown>);
    await fetchProfile();
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

      {/* Profile header card */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>

          {/* Avatar with upload */}
          <div style={{ position: "relative" }}>
            {uploadingAvatar ? (
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,165,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Spinner size={24} />
              </div>
            ) : (
              <Avatar name={user?.full_name ?? "U"} size={80} src={user?.avatar_url ?? undefined} />
            )}

            {/* Upload button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              title="Upload profile picture"
              style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#FFA500", border: "2px solid #0A0F3C", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }}
            >
              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.full_name}</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "capitalize" }}>
              {user?.role}{user?.location ? ` · ${user.location}` : ""}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Badge color="#FFA500">7-day streak 🔥</Badge>
              <Badge color="#22c55e">{completed.length} goals completed</Badge>
              <Badge color="#8b5cf6">{active.length} active goals</Badge>
            </div>
            {avatarError && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>{avatarError}</p>}
            {!avatarError && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>Click the upload button on your photo to change it. Max 5MB.</p>}
          </div>

          <button
            className="btn-secondary"
            onClick={() => { setEditing(!editing); setForm({ full_name: user?.full_name ?? "", role: user?.role ?? "", location: user?.location ?? "", phone: user?.phone ?? "", bio: user?.bio ?? "" }); }}
            style={{ padding: "10px 18px", fontSize: 13 }}
          >
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
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
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
