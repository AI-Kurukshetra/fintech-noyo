import { redirect } from "next/navigation";
import { createClient } from "../lib/supabase/server";
import {
  getSupabaseConfigMessage,
  hasPublicSupabaseEnv,
} from "../lib/supabase/env";

export default async function HomePage() {
  if (!hasPublicSupabaseEnv()) {
    redirect(`/login?message=${encodeURIComponent(getSupabaseConfigMessage())}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  redirect(user ? "/dashboard" : "/login");
}
