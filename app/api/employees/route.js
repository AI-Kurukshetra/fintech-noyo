import { getEmployeesData } from "../../../lib/supabase/queries";

export async function GET() {
  const employees = await getEmployeesData();
  return Response.json(employees);
}
