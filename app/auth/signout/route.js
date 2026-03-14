import { NextResponse } from "next/server";
import { hasPublicSupabaseEnv } from "../../../lib/supabase/env";
import { createClient } from "../../../lib/supabase/server";

export async function POST(request) {
  if (hasPublicSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}
