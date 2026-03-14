import { getEnrollmentData } from "../../../lib/supabase/queries";

export async function GET() {
  const enrollments = await getEnrollmentData();
  return Response.json(enrollments);
}
