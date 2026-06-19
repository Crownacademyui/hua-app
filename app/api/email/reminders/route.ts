export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({ message: "Email reminders endpoint ready" });
}