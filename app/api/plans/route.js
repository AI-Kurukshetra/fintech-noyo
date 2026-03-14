import { getPlansData } from "../../../lib/supabase/queries";

export async function GET() {
  const plans = await getPlansData();
  return Response.json(plans);
}
