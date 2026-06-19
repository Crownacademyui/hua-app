import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// This route is called by a cron job (set up in vercel.json)
// It checks for goals due in 7 days and sends reminder emails

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Hua App <crownstudios44@gmail.com>",
      to,
      subject,
      html,
    }),
  });
  return res.ok;
}

export async function GET(req: NextRequest) {
  // Verify this is called by Vercel cron (security)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const todayStr = today.toISOString().split("T")[0];
  const sevenDaysStr = sevenDaysFromNow.toISOString().split("T")[0];

  // Find goals with deadlines 7 days away
  const { data: goals, error } = await supabaseAdmin
    .from("goals")
    .select("*, profiles(full_name, email)")
    .eq("status", "active")
    .gte("deadline", todayStr)
    .lte("deadline", sevenDaysStr);

  if (error) {
    console.error("Cron error:", error.message);
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
      <div style="font-family: 'Poppins', sans-serif; max-width: 560px; margin: 0 auto; background: #0A0F3C; color: #fff; padding: 40px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, #FFA500, #ff6b00); display: inline-flex; align-items: center; justify-content: center; font-size: 24px;">🔥</div>
          <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 24px; margin: 12px 0 4px; color: #fff;">Hua</h1>
        </div>
        
        <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #FFA500;">⏰ Goal deadline in 7 days!</h2>
        <p style="color: rgba(255,255,255,0.7); line-height: 1.6; margin-bottom: 20px;">
          Hi ${profile.full_name}, your goal <strong style="color: #fff;">"${goal.title}"</strong> is due on <strong style="color: #FFA500;">${deadline}</strong>.
        </p>
        
        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 13px; color: rgba(255,255,255,0.5);">Progress</p>
          <div style="background: rgba(255,255,255,0.08); border-radius: 100px; height: 8px; margin-bottom: 6px;">
            <div style="width: ${goal.progress ?? 0}%; height: 8px; border-radius: 100px; background: linear-gradient(90deg, #FFA500, #ff8c00);"></div>
          </div>
          <p style="margin: 0; font-size: 13px; color: rgba(255,255,255,0.5);">${goal.progress ?? 0}% complete</p>
        </div>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/goals/${goal.id}" 
           style="display: block; text-align: center; background: linear-gradient(135deg, #FFA500, #ff8c00); color: #000; font-weight: 700; padding: 14px 24px; border-radius: 12px; text-decoration: none; font-size: 15px; margin-bottom: 24px;">
          View Goal & Update Progress →
        </a>
        
        <p style="font-size: 12px; color: rgba(255,255,255,0.3); text-align: center; line-height: 1.5;">
          You're receiving this because you have an active goal on Hua.<br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" style="color: rgba(255,165,0,0.6);">Manage notifications</a>
        </p>
      </div>
    `;

    const ok = await sendEmail(profile.email, `⏰ "${goal.title}" is due in 7 days`, html);
    if (ok) sent++;
  }

  return NextResponse.json({ success: true, emailsSent: sent });
}
