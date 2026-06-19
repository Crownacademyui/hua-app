import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Guard: skip if env vars not set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Missing environment variables" }, { status: 500 });
  }

  // Verify this is called by Vercel cron (security)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { createClient } = await import("@supabase/supabase-js");

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const todayStr = today.toISOString().split("T")[0];
  const sevenDaysStr = sevenDaysFromNow.toISOString().split("T")[0];

  const { data: goals, error } = await supabaseAdmin
    .from("goals")
    .select("*, profiles(full_name, email)")
    .eq("status", "active")
    .gte("deadline", todayStr)
    .lte("deadline", sevenDaysStr);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;

  for (const goal of goals ?? []) {
    const profile = (goal as any).profiles;
    if (!profile?.email) continue;

    const deadline = new Date(goal.deadline).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });

    const html = `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #0A0F3C; color: #fff; padding: 40px; border-radius: 16px;">
        <h2 style="color: #FFA500;">⏰ Goal deadline in 7 days!</h2>
        <p>Hi ${profile.full_name}, your goal <strong>"${goal.title}"</strong> is due on <strong style="color: #FFA500;">${deadline}</strong>.</p>
        <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0 0 8px; color: rgba(255,255,255,0.5); font-size: 13px;">Progress</p>
          <div style="background: rgba(255,255,255,0.08); border-radius: 100px; height: 8px;">
            <div style="width: ${goal.progress ?? 0}%; height: 8px; border-radius: 100px; background: #FFA500;"></div>
          </div>
          <p style="margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.5);">${goal.progress ?? 0}% complete</p>
        </div>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/goals/${goal.id}"
           style="display: block; text-align: center; background: #FFA500; color: #000; font-weight: 700; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-size: 15px;">
          View Goal →
        </a>
        <p style="font-size: 12px; color: rgba(255,255,255,0.3); text-align: center; margin-top: 24px;">
          You're receiving this because you have an active goal on Hua.
        </p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Hua App <crownstudios44@gmail.com>",
        to: profile.email,
        subject: `⏰ "${goal.title}" is due in 7 days`,
        html,
      }),
    });

    if (res.ok) sent++;
  }

  return NextResponse.json({ success: true, emailsSent: sent });
}