import { getAnalyticsData, getOverviewData } from "../../../lib/supabase/queries";

export async function GET() {
  const overview = await getOverviewData();
  const analytics = await getAnalyticsData();

  return Response.json({
    status: "ok",
    scope: "noyo-os-supabase",
    overview,
    analytics,
  });
}
