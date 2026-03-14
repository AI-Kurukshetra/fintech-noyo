import { getReconciliationData } from "../../../lib/supabase/queries";

export async function GET() {
  const reconciliation = await getReconciliationData();
  return Response.json(reconciliation);
}
