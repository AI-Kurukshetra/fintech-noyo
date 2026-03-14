"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

function getField(formData, key) {
  return String(formData.get(key) ?? "").trim();
}

export async function signInAction(formData) {
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signUpAction(formData) {
  const email = getField(formData, "email");
  const password = getField(formData, "password");
  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`);
  }

  redirect(
    "/login?message=Account%20created.%20Check%20your%20email%20for%20the%20confirmation%20link%20if%20confirmation%20is%20enabled.",
  );
}
