"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";

const GUIDES = [
  { emoji: "🎯", title: "Setting SMART Goals as a Freelancer", category: "Goal Setting", read: "5 min", featured: true, desc: "Learn the SMART framework and how to apply it to your freelance career, from landing clients to pricing your services.", body: "As an African freelancer, your journey is unique. You face local market challenges while competing on a global stage. The key is to leverage what makes you distinct.\n\nStart by defining clear, measurable outcomes for each goal. Instead of 'get more clients,' aim for 'land 3 new UI/UX clients at $800+ per project by June 30.' This specificity transforms vague ambitions into actionable targets.\n\nBreak each goal into weekly milestones and review your progress every Sunday. Consistency beats intensity — 30 minutes of focused work daily compounds dramatically over 90 days." },
  { emoji: "💰", title: "Building Financial Stability on Variable Income", category: "Finance", read: "8 min", featured: true, desc: "A practical guide to budgeting, saving, and investing when your income isn't predictable.", body: "Variable income is the freelancer's greatest challenge. Without a regular paycheck, budgeting requires a different approach. Start by calculating your 'minimum viable income' — the least you need to cover essential expenses.\n\nFrom every payment, immediately allocate:\n• 50% to operating expenses and personal needs\n• 20% to taxes (set aside, don't touch)\n• 20% to savings and emergency fund\n• 10% to reinvestment in skills and tools\n\nBuilding a 3-month emergency fund is your first financial goal. Everything else follows." },
  { emoji: "🚀", title: "How to Land Your First 5 International Clients", category: "Growth", read: "10 min", featured: false, desc: "Step-by-step guide to positioning yourself for global freelance work from Africa.", body: "The global freelance market is wide open for African talent. Platforms like Toptal, Upwork, and direct LinkedIn outreach are your starting points.\n\nPosition yourself as a specialist, not a generalist. 'I design SaaS dashboards for B2B startups' will always outperform 'I do all kinds of design.'\n\nBuild a portfolio that speaks the language of international clients: clear case studies, measurable results, and professional presentation." },
  { emoji: "📊", title: "Tracking Your Progress Without Burning Out", category: "Productivity", read: "4 min", featured: false, desc: "Accountability strategies that keep you motivated without overwhelming yourself.", body: "Progress tracking is powerful, but it can also create anxiety if done wrong. The key is to measure leading indicators, not just outcomes.\n\nInstead of only tracking 'revenue earned,' also track 'proposals sent,' 'discovery calls booked,' and 'portfolio pieces completed.' These are the actions that lead to outcomes.\n\nWeekly reviews (not daily obsessing) are the sweet spot. Every Sunday: review the week, adjust your plan, set next week's top 3 priorities." },
  { emoji: "🌍", title: "Pricing Your Services for African & Global Markets", category: "Business", read: "7 min", featured: false, desc: "How to price confidently while competing internationally and locally.", body: "Pricing is the #1 skill most freelancers neglect. Many African freelancers underprice themselves to compete internationally, but this creates a race to the bottom.\n\nInstead, price on value delivered, not hours worked. A logo that generates ₦10M for a client is worth far more than ₦50,000 regardless of how long it took.\n\nResearch international rate benchmarks on platforms like Glassdoor, Levels.fyi, and freelance communities. Aim for the middle 50% of global rates as your starting point." },
  { emoji: "🤝", title: "Building a Personal Brand on LinkedIn", category: "Marketing", read: "6 min", featured: false, desc: "Strategies for African freelancers to stand out and attract inbound opportunities.", body: "LinkedIn is the highest-ROI platform for B2B freelancers. But most people use it wrong — they broadcast instead of engage.\n\nPost consistently (3x/week minimum) about your craft, your process, and your client results. Share insights, not just updates.\n\nComment meaningfully on posts in your niche. 10 thoughtful comments a day will build your network faster than 10 new connection requests." },
];

const CATEGORIES = ["All", "Goal Setting", "Finance", "Growth", "Productivity", "Business", "Marketing"];

export default function GuidePage() {
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState<typeof GUIDES[0] | null>(null);

  const filtered = GUIDES.filter((g) => cat === "All" || g.category === cat);
  const featured = filtered.filter((g) => g.featured);
  const rest = filtered.filter((g) => !g.featured);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Freelancer's Guide</h2>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Expert resources tailored for African freelancers and founders</p>
      </div>

      {/* Category pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            style={{
              padding: "7px 16px", borderRadius: 100, fontSize: 13, fontWeight: 500,
              cursor: "pointer", border: "1px solid", transition: "all 0.2s",
              background: cat === c ? "rgba(255,165,0,0.15)" : "rgba(255,255,255,0.04)",
              borderColor: cat === c ? "rgba(255,165,0,0.5)" : "rgba(255,255,255,0.08)",
              color: cat === c ? "#FFA500" : "rgba(255,255,255,0.5)",
            }}>
            {c}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
          {featured.map((g) => (
            <div key={g.title} className="card" onClick={() => setActive(g)}
              style={{ padding: 24, cursor: "pointer", background: "linear-gradient(135deg, rgba(255,165,0,0.06), rgba(2,6,111,0.2))", border: "1px solid rgba(255,165,0,0.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600, background: "rgba(255,165,0,0.1)", color: "#FFA500" }}>{g.category}</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 100, background: "rgba(255,165,0,0.2)", color: "#FFA500" }}>Featured</span>
              </div>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{g.emoji}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{g.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: 14 }}>{g.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>📖 {g.read} read</span>
                <span style={{ fontSize: 13, color: "#FFA500", fontWeight: 600 }}>Read →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rest */}
      {rest.length > 0 && (
        <div>
          <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>More Guides</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {rest.map((g) => (
              <div key={g.title} className="card" onClick={() => setActive(g)}
                style={{ padding: 18, cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 28, flexShrink: 0 }}>{g.emoji}</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{g.title}</h4>
                  <div style={{ display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>{g.category}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>📖 {g.read}</span>
                  </div>
                </div>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reading modal */}
      <Modal open={!!active} onClose={() => setActive(null)} maxWidth={620}>
        {active && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, fontWeight: 600, background: "rgba(255,165,0,0.1)", color: "#FFA500" }}>{active.category}</span>
              <button onClick={() => setActive(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex" }}>
                <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div style={{ fontSize: 40, marginBottom: 16 }}>{active.emoji}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>{active.title}</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 20, fontSize: 14 }}>{active.desc}</p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
              {active.body.split("\n\n").map((para, i) => (
                <p key={i} style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.8, fontSize: 14, marginBottom: 16, whiteSpace: "pre-line" }}>{para}</p>
              ))}
            </div>
            <button className="btn-primary" onClick={() => setActive(null)} style={{ padding: "12px 24px", fontSize: 14, marginTop: 8, borderRadius: 12 }}>
              Close guide
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
