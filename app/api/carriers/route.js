import { getCarrierData } from "../../../lib/supabase/queries";

export async function GET() {
  const carriers = await getCarrierData();
  return Response.json(carriers);
}
