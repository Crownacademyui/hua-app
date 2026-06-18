"use client";

import React from "react";

// ─── ProgressBar ──────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ value, color = "#FFA500", height = 6 }: ProgressBarProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.08)",
        borderRadius: 100,
        overflow: "hidden",
        height,
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          borderRadius: 100,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          transition: "width 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode;
  color?: string;
}

export function Badge({ children, color = "#FFA500" }: BadgeProps) {
  return (
    <span
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 100,
        letterSpacing: "0.4px",
        background: `${color}20`,
        color,
      }}
    >
      {children}
    </span>
  );
}

// ─── Tag ──────────────────────────────────────────────────────────────────────
interface TagProps {
  children: React.ReactNode;
  color?: string;
}

export function Tag({ children, color = "#FFA500" }: TagProps) {
  return (
    <span
      style={{
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 6,
        fontWeight: 600,
        fontFamily: "'Space Grotesk', sans-serif",
        background: `${color}15`,
        color,
      }}
    >
      {children}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
interface AvatarProps {
  name?: string;
  size?: number;
  src?: string;
}

export function Avatar({ name = "U", size = 36, src }: AvatarProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: src ? "transparent" : "linear-gradient(135deg, #FFA500, #02066F)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 700,
        fontFamily: "'Space Grotesk', sans-serif",
        flexShrink: 0,
        overflow: "hidden",
        border: "2px solid rgba(255,165,0,0.3)",
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        name[0]?.toUpperCase()
      )}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: `2px solid rgba(255,165,0,0.2)`,
        borderTopColor: "#FFA500",
        borderRadius: "50%",
        animation: "spin 0.7s linear infinite",
      }}
    />
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function EmptyState({ emoji = "🎯", title, subtitle, action }: EmptyStateProps) {
  return (
    <div style={{ textAlign: "center", padding: "48px 24px" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</div>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24, maxWidth: 320, margin: "0 auto 24px" }}>
          {subtitle}
        </p>
      )}
      {action}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export function Modal({ open, onClose, title, children, maxWidth = 480 }: ModalProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 200, backdropFilter: "blur(10px)", padding: 24,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="card fade-in"
        style={{ width: "100%", maxWidth, padding: 32, maxHeight: "90vh", overflowY: "auto" }}
      >
        {title && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{title}</h3>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", padding: 4, borderRadius: 6 }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────
interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({ label, error, children, required }: FormFieldProps) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: "rgba(255,255,255,0.8)" }}>
        {label}{required && <span style={{ color: "#FFA500", marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {error && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{error}</p>}
    </div>
  );
}
