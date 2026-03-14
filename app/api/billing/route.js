import { getBillingData } from "../../../lib/supabase/queries";

export async function GET() {
  const billing = await getBillingData();
  return Response.json(billing);
}
