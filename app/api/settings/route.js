import { getSettingsData } from "../../../lib/supabase/queries";

export async function GET() {
  const settings = await getSettingsData();
  return Response.json(settings);
}
