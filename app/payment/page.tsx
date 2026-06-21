"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const SELAR_LINK_FULL = "https://selar.com/835wz73l3p";
const SELAR_LINK_STUDENT = "https://selar.com/52x2342270";

const LAUNCH_PRICE = 5000;
const STUDENT_PRICE = 3000;
const COUPON_CODE = "HUASTUDENT";

export default function PaymentPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  const price = appliedCoupon ? STUDENT_PRICE : LAUNCH_PRICE;
  const savings = LAUNCH_PRICE - STUDENT_PRICE;
  const selarLink = appliedCoupon ? SELAR_LINK_STUDENT : SELAR_LINK_FULL;

  function applyCoupon() {
    if (coupon.trim().toUpperCase() === COUPON_CODE) {
      setAppliedCoupon(true);
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code. Try again.");
      setAppliedCoupon(false);
    }
  }

  function removeCoupon() {
    setAppliedCoupon(false);
    setCoupon("");
    setCouponError("");
  }

  function goToSelar() {
    window.open(selarLink, "_blank");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0A0F3C", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #FFA500, #ff6b00)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 28, color: "#fff" }}>Hua</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Goal Setting for African Freelancers</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 8 }}>
            Get lifetime access 🔥
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 28, lineHeight: 1.6 }}>
            Pay once and use Hua forever. No monthly fees, no subscriptions.
          </p>

          {/* What you get */}
          <div style={{ marginBottom: 24 }}>
            {[
              "Unlimited goals & steps",
              "Progress tracking & streaks",
              "Email reminders & notifications",
              "Freelancer business guides",
              "All future updates included",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,165,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#FFA500" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Coupon */}
          {!appliedCoupon ? (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6, display: "block" }}>Have a coupon code?</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                  placeholder="Enter code"
                  style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: `1px solid ${couponError ? "#ef4444" : "rgba(255,255,255,0.08)"}`, borderRadius: 10, color: "#fff", fontSize: 14, padding: "10px 14px", outline: "none" }}
                  onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                />
                <button onClick={applyCoupon} style={{ padding: "10px 16px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  Apply
                </button>
              </div>
              {couponError && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 6 }}>{couponError}</p>}
            </div>
          ) : (
            <div style={{ marginBottom: 20, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 13, color: "#22c55e", fontWeight: 600 }}>✓ Student discount applied!</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>You save ₦{savings.toLocaleString()}</p>
              </div>
              <button onClick={removeCoupon} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 12 }}>Remove</button>
            </div>
          )}

          {/* Price */}
          <div style={{ background: "rgba(255,165,0,0.06)", border: "1px solid rgba(255,165,0,0.15)", borderRadius: 12, padding: "16px 20px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Total (one-time)</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 32, color: "#FFA500" }}>
                  ₦{price.toLocaleString()}
                </span>
                {appliedCoupon && (
                  <span style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", textDecoration: "line-through" }}>
                    ₦{LAUNCH_PRICE.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
            <span style={{ fontSize: 11, background: "rgba(255,165,0,0.15)", color: "#FFA500", padding: "4px 10px", borderRadius: 100, fontWeight: 600 }}>
              LIFETIME
            </span>
          </div>

          {/* Pay button */}
          <button
            onClick={goToSelar}
            style={{ width: "100%", padding: "16px", background: "linear-gradient(135deg, #FFA500, #ff8c00)", border: "none", borderRadius: 12, color: "#000", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            🔒 Pay ₦{price.toLocaleString()} on Selar
          </button>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "12px 16px", marginTop: 16 }}>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
              <strong style={{ color: "#FFA500" }}>How it works:</strong> Click the button above to pay securely on Selar. After payment, your account will be activated within a few hours. Use the <strong>same email</strong> you signed up with on Hua.
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 16, lineHeight: 1.5 }}>
            Secured by Selar. Accepts cards, bank transfer & USSD.
          </p>
        </div>

        {/* Already paid */}
        <p style={{ textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 20 }}>
          Already paid?{" "}
          <button onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", color: "#FFA500", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
            Go to dashboard →
          </button>
        </p>
      </div>
    </div>
  );
}