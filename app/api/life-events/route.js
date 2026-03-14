import { getLifeEventsData } from "../../../lib/supabase/queries";

export async function GET() {
  const lifeEvents = await getLifeEventsData();
  return Response.json(lifeEvents);
}
