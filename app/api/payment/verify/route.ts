import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // Guard: skip if env vars not set
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ success: false, error: "Missing environment variables" }, { status: 500 });
  }

  try {
    const { reference, userId } = await req.json();

    if (!reference || !userId) {
      return NextResponse.json({ success: false, error: "Missing reference or userId" }, { status: 400 });
    }

    // Verify with Paystack
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data?.status !== "success") {
      return NextResponse.json({ success: false, error: "Payment not successful" }, { status: 400 });
    }

    const amountPaid = paystackData.data.amount / 100;

    // Dynamically import supabase to avoid build-time errors
    const { createClient } = await import("@supabase/supabase-js");

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        has_paid: true,
        payment_reference: reference,
        amount_paid: amountPaid,
        paid_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (error) {
      console.error("DB update error:", error.message);
      return NextResponse.json({ success: false, error: "Could not update payment status" }, { status: 500 });
    }

    return NextResponse.json({ success: true, amount: amountPaid });

  } catch (err) {
    console.error("Payment verify error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}