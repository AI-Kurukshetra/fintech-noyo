import { getOrganizationsData } from "../../../lib/supabase/queries";

export async function GET() {
  const organizations = await getOrganizationsData();
  return Response.json(organizations);
}
