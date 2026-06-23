export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    // Verify the secret matches to prevent unauthorized approvals
    if (!secret || secret !== process.env.ADMIN_APPROVE_SECRET) {
      return new Response(
        `<html><body style="font-family:sans-serif;background:#0A0F3C;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;">
            <div style="font-size:48px;margin-bottom:16px;">❌</div>
            <h2>Unauthorized</h2>
            <p style="color:rgba(255,255,255,0.5);">Invalid approval link.</p>
          </div>
        </body></html>`,
        { status: 401, headers: { "Content-Type": "text/html" } }
      );
    }

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return new Response("Missing environment variables", { status: 500 });
    }

    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Fetch user details first
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("full_name, email, has_paid")
      .eq("id", userId)
      .single();

    if (!profile) {
      return new Response(
        `<html><body style="font-family:sans-serif;background:#0A0F3C;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;">
            <div style="font-size:48px;margin-bottom:16px;">❌</div>
            <h2>User not found</h2>
          </div>
        </body></html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    // Already approved
    if (profile.has_paid) {
      return new Response(
        `<html><body style="font-family:sans-serif;background:#0A0F3C;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;max-width:400px;padding:32px;">
            <div style="font-size:48px;margin-bottom:16px;">✅</div>
            <h2 style="color:#22c55e;">Already Approved</h2>
            <p style="color:rgba(255,255,255,0.5);">${profile.full_name} (${profile.email}) already has access.</p>
          </div>
        </body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    // Approve the user
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        has_paid: true,
        payment_reference: "SELAR-EMAIL-APPROVED",
        paid_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      return new Response(
        `<html><body style="font-family:sans-serif;background:#0A0F3C;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;">
            <div style="font-size:48px;margin-bottom:16px;">❌</div>
            <h2>Error</h2>
            <p style="color:rgba(255,255,255,0.5);">${error.message}</p>
          </div>
        </body></html>`,
        { status: 500, headers: { "Content-Type": "text/html" } }
      );
    }

    // Success page
    return new Response(
      `<html>
        <head><title>User Approved - Hua</title></head>
        <body style="font-family:'Helvetica Neue',sans-serif;background:#0A0F3C;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
          <div style="text-align:center;max-width:440px;padding:32px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:20px;">
            <div style="font-size:56px;margin-bottom:16px;">🎉</div>
            <h1 style="color:#22c55e;font-size:24px;margin-bottom:8px;">Access Granted!</h1>
            <p style="color:rgba(255,255,255,0.7);margin-bottom:8px;font-size:15px;">
              <strong style="color:#fff;">${profile.full_name}</strong> has been approved.
            </p>
            <p style="color:rgba(255,255,255,0.5);font-size:14px;margin-bottom:24px;">
              ${profile.email} can now log in and access Hua.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://hua-app-crownacademy.vercel.app"}/admin" 
               style="display:inline-block;background:linear-gradient(135deg,#FFA500,#ff8c00);color:#000;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;font-size:14px;">
              View All Users →
            </a>
          </div>
        </body>
      </html>`,
      { status: 200, headers: { "Content-Type": "text/html" } }
    );

  } catch (err) {
    console.error("Approve error:", err);
    return new Response("Server error", { status: 500 });
  }
}
