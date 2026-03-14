import { getReportsData } from "../../../lib/supabase/queries";

export async function GET() {
  const reports = await getReportsData();
  return Response.json(reports);
}
