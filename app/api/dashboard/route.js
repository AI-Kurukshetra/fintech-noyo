import { getDashboardData } from "../../../lib/supabase/queries";

export async function GET() {
  const dashboard = await getDashboardData();
  return Response.json(dashboard);
}
