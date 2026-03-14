import { getEnrollmentData } from "../../../lib/supabase/queries";

export async function GET() {
  const { webhookEvents } = await getEnrollmentData();
  return Response.json({ webhookEvents });
}
