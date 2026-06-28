export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { name, email, userId } = await request.json();

    if (!name || !email || !userId) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://hua-app-crownacademy.vercel.app";
    const resendKey = process.env.RESEND_API_KEY;

    if (!resendKey) {
      return Response.json({ error: "Missing Resend API key" }, { status: 500 });
    }

    // One-click approve URL — hits the approve API directly
    const approveUrl = `${appUrl}/api/admin/approve?userId=${userId}&secret=${process.env.ADMIN_APPROVE_SECRET}`;

    const html = `
      <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 560px; margin: 0 auto; background: #0A0F3C; color: #ffffff; border-radius: 16px; overflow: hidden;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #FFA500, #ff6b00); padding: 32px; text-align: center;">
          <div style="font-size: 36px; margin-bottom: 8px;">🔥</div>
          <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #000;">New Hua User!</h1>
          <p style="margin: 6px 0 0; font-size: 14px; color: rgba(0,0,0,0.7);">Someone just signed up and is waiting for access</p>
        </div>

        <!-- Body -->
        <div style="padding: 32px;">
          <p style="font-size: 15px; color: rgba(255,255,255,0.8); margin-bottom: 24px;">
            Hi Tino, a new user just created an account on Hua. Once they pay on Selar, click the approve button below to grant them access.
          </p>

          <!-- User details -->
          <div style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 28px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: rgba(255,255,255,0.5); width: 100px;">Name</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #fff;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: rgba(255,255,255,0.5);">Email</td>
                <td style="padding: 8px 0; font-size: 14px; font-weight: 600; color: #FFA500;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 13px; color: rgba(255,255,255,0.5);">Signed up</td>
                <td style="padding: 8px 0; font-size: 14px; color: rgba(255,255,255,0.7);">${new Date().toLocaleString("en-GB", { dateStyle: "full", timeStyle: "short" })}</td>
              </tr>
            </table>
          </div>

          <!-- Approve button -->
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${approveUrl}" 
               style="display: inline-block; background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; font-weight: 700; font-size: 16px; padding: 16px 40px; border-radius: 12px; text-decoration: none;">
              ✓ Approve ${name} Now
            </a>
          </div>

          <p style="font-size: 12px; color: rgba(255,255,255,0.3); text-align: center; margin-bottom: 16px;">
            Only click Approve after you confirm they've paid on Selar.<br/>
            Or manage all users at <a href="${appUrl}/admin" style="color: #FFA500;">your admin page</a>.
          </p>
        </div>

        <!-- Footer -->
        <div style="padding: 16px 32px; border-top: 1px solid rgba(255,255,255,0.08); text-align: center;">
          <p style="font-size: 11px; color: rgba(255,255,255,0.25); margin: 0;">
            Hua App · Goal Setting for African Freelancers
          </p>
        </div>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from: "Hua App <crownstudios44@gmail.com>",
        to: "crownstudios44@gmail.com",
        subject: `🔥 New signup: ${name} is waiting for access`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", err);
      return Response.json({ error: "Failed to send email" }, { status: 500 });
    }

    return Response.json({ success: true });

  } catch (err) {
    console.error("Notify error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
