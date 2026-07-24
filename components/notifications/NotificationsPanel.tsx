"use client";

import { useState, useEffect, useRef } from "react";
import { useGoalStore } from "@/store/goalStore";

interface Notification {
  id: string;
  type: "goal_complete" | "streak" | "deadline" | "admin";
  title: string;
  message: string;
  time: string;
  read: boolean;
  emoji: string;
}

function getNotificationsFromGoals(goals: any[]): Notification[] {
  const notifications: Notification[] = [];
  const now = new Date();

  notifications.push({
    id: "admin-welcome",
    type: "admin",
    title: "Welcome to Hua! 🔥",
    message: "Start by creating your first goal. Break it into steps and track your progress daily.",
    time: "From the Hua team",
    read: false,
    emoji: "📢",
  });

  const completedGoals = goals.filter((g) => g.status === "completed");
  for (const goal of completedGoals.slice(0, 3)) {
    notifications.push({
      id: `complete-${goal.id}`,
      type: "goal_complete",
      title: "Goal completed! 🏆",
      message: `You completed "${goal.title}". Amazing work!`,
      time: "Recent",
      read: false,
      emoji: "🏆",
    });
  }

  const activeGoals = goals.filter((g) => g.status === "active" && g.deadline);
  for (const goal of activeGoals) {
    const deadline = new Date(goal.deadline);
    const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7 && daysLeft > 0) {
      notifications.push({
        id: `deadline-${goal.id}`,
        type: "deadline",
        title: "Deadline approaching ⏰",
        message: `"${goal.title}" is due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`,
        time: `${daysLeft} days left`,
        read: false,
        emoji: "⏰",
      });
    }
  }

  const totalGoals = goals.length;
  const streakDays = totalGoals > 0 ? 7 : 0;

  if (streakDays > 0) {
    notifications.push({
      id: "streak-active",
      type: "streak",
      title: `${streakDays}-day streak! 🔥`,
      message: `You've been active for ${streakDays} days in a row. Keep the momentum going!`,
      time: "Today",
      read: false,
      emoji: "🔥",
    });
  }

  return notifications;
}

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const goals = useGoalStore((s) => s.goals);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(getNotificationsFromGoals(goals));
  }, [goals]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeColor = {
    goal_complete: "#16a34a",
    streak: "#f97316",
    deadline: "#ef4444",
    admin: "#c2790a",
  };

  return (
    <div ref={panelRef} style={{ position: "relative" }}>
      {/* Backdrop overlay on mobile to dim background */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 290 }}
        />
      )}

      {/* Bell button */}
      <button
        onClick={() => { setOpen(!open); if (!open) markAllRead(); }}
        style={{ background: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, color: "#6b7280", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "all 0.2s" }}
      >
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#FFA500", border: "2px solid #FCFCFA", fontSize: 10, fontWeight: 700, color: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 70,
            right: 12,
            left: 12,
            maxWidth: 380,
            marginLeft: "auto",
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            zIndex: 300,
            overflow: "hidden",
            animation: "fadeIn 0.2s ease",
            maxHeight: "calc(100vh - 100px)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: "#1a1a2e" }}>
              Notifications
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {notifications.some((n) => n.read === false) ? (
                <button onClick={markAllRead} style={{ background: "none", border: "none", fontSize: 12, color: "#c2790a", cursor: "pointer", fontWeight: 500 }}>
                  Mark all read
                </button>
              ) : (
                <span style={{ fontSize: 12, color: "#9ca3af" }}>All caught up</span>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", display: "flex", padding: 0 }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔔</div>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: "#1a1a2e", marginBottom: 6 }}>No notifications yet</p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>We'll notify you about goal deadlines, completions and streaks.</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div key={n.id} style={{ padding: "14px 20px", borderBottom: i < notifications.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", background: n.read ? "transparent" : "rgba(255,165,0,0.05)", transition: "background 0.2s", display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${typeColor[n.type]}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                    {n.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", margin: 0 }}>{n.title}</p>
                      {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#FFA500", flexShrink: 0, marginTop: 3 }} />}
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", margin: "3px 0", lineHeight: 1.4 }}>{n.message}</p>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{n.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}