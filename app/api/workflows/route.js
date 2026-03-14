import { getWorkflowsData } from "../../../lib/supabase/queries";

export async function GET() {
  const workflows = await getWorkflowsData();
  return Response.json(workflows);
}
