import { NextResponse } from "next/server";
import {
  getSupabaseConfigMessage,
  hasPublicSupabaseEnv,
} from "../../../lib/supabase/env";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (!hasPublicSupabaseEnv()) {
    return NextResponse.redirect(
      new URL(
        `/login?message=${encodeURIComponent(getSupabaseConfigMessage())}`,
        requestUrl.origin,
      ),
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL(
          `/login?message=${encodeURIComponent(error.message)}`,
          requestUrl.origin,
        ),
      );
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
