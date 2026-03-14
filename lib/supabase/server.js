import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import {
  getSupabaseAnonKey,
  getSupabaseConfigMessage,
  getSupabaseUrl,
  hasPublicSupabaseEnv,
} from "./env";

export async function createClient() {
  if (!hasPublicSupabaseEnv()) {
    throw new Error(getSupabaseConfigMessage());
  }

  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Cookie writes from Server Components are ignored.
        }
      },
    },
  });
}
