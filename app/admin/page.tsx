"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const db = supabase as any;

const ADMIN_PASSWORD = "huaadmin2025";

interface PendingUser {
  id: string;
  email: string;
  full_name: string;
  has_paid: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authenticated) {
      fetchUsers();
    }
  }, [authenticated]);

  async function fetchUsers() {
    setLoading(true);
    const result = await db
      .from("profiles")
      .select("id, email, full_name, has_paid, created_at")
      .order("created_at", { ascending: false });

    if (!result.error && result.data) {
      setUsers(result.data as PendingUser[]);
    }
    setLoading(false);
  }

  async function approveUser(userId: string, email: string) {
    const result = await db
      .from("profiles")
      .update({
        has_paid: true,
        payment_reference: "SELAR-MANUAL",
        paid_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (!result.error) {
      setMessage("Approved: " + email);
      fetchUsers();
      setTimeout(function () {
        setMessage("");
      }, 3000);
    } else {
      setMessage("Error: " + result.error.message);
    }
  }

  async function revokeUser(userId: string, email: string) {
    const confirmed = confirm("Revoke access for " + email + "?");
    if (!confirmed) {
      return;
    }
    const result = await db
      .from("profiles")
      .update({ has_paid: false })
      .eq("id", userId);

    if (!result.error) {
      setMessage("Access revoked for " + email);
      fetchUsers();
      setTimeout(function () {
        setMessage("");
      }, 3000);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Wrong password");
    }
  }

  const filteredUsers = users.filter(function (u) {
    return u.email.toLowerCase().includes(searchEmail.toLowerCase());
  });

  const pendingCount = users.filter(function (u) {
    return !u.has_paid;
  }).length;

  const paidCount = users.filter(function (u) {
    return u.has_paid;
  }).length;

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#0A0F3C", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        <form onSubmit={handleLogin} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 32, width: 320 }}>
          <h1 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Hua Admin</h1>
          <input
            type="password"
            placeholder="Admin password"
            value={passwordInput}
            onChange={function (e) { setPasswordInput(e.target.value); }}
            autoFocus
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", marginBottom: 12, outline: "none" }}
          />
          <button type="submit" style={{ width: "100%", padding: "10px", background: "#FFA500", border: "none", borderRadius: 10, color: "#000", fontWeight: 700, cursor: "pointer" }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0F3C", padding: 32, fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Hua Admin - User Payments</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 24, fontSize: 14 }}>
          Approve users who paid via Selar. Search their email, click Approve.
        </p>

        {message ? (
          <div style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "10px 16px", marginBottom: 16, color: "#22c55e", fontSize: 13 }}>
            {message}
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, flex: 1 }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Pending Payment</p>
            <p style={{ color: "#FFA500", fontSize: 24, fontWeight: 700 }}>{pendingCount}</p>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, flex: 1 }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Paid Users</p>
            <p style={{ color: "#22c55e", fontSize: 24, fontWeight: 700 }}>{paidCount}</p>
          </div>
        </div>

        <input
          placeholder="Search by email..."
          value={searchEmail}
          onChange={function (e) { setSearchEmail(e.target.value); }}
          style={{ width: "100%", padding: "12px 16px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", marginBottom: 16, outline: "none" }}
        />

        {loading ? (
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredUsers.map(function (u) {
              return (
                <div key={u.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{u.full_name}</p>
                    <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{u.email}</p>
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                      Joined {new Date(u.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 100,
                      background: u.has_paid ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                      color: u.has_paid ? "#22c55e" : "#ef4444",
                    }}>
                      {u.has_paid ? "Paid" : "Unpaid"}
                    </span>
                    {!u.has_paid ? (
                      <button
                        onClick={function () { approveUser(u.id, u.email); }}
                        style={{ padding: "8px 16px", background: "#22c55e", border: "none", borderRadius: 8, color: "#000", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                      >
                        Approve
                      </button>
                    ) : (
                      <button
                        onClick={function () { revokeUser(u.id, u.email); }}
                        style={{ padding: "8px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, color: "#ef4444", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredUsers.length === 0 ? (
              <p style={{ color: "rgba(255,255,255,0.3)", textAlign: "center", padding: 40 }}>No users found.</p>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}