import { redirect } from "next/navigation";
import {
  getSupabaseConfigMessage,
  hasPublicSupabaseEnv,
} from "../../lib/supabase/env";
import { createClient } from "../../lib/supabase/server";
import { signInAction, signUpAction } from "./actions";

export const metadata = {
  title: "Login | Noyo OS MVP",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const configMessage = hasPublicSupabaseEnv() ? null : getSupabaseConfigMessage();
  const message = params?.message || configMessage;

  if (hasPublicSupabaseEnv()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-intro">
          <span className="eyebrow">Supabase Auth</span>
          <h1>Sign in to the benefits operating system.</h1>
          <p>
            Email and password auth is wired with Supabase. After you apply the
            SQL files, the app reads seeded platform data from your project.
          </p>
        </div>

        {message ? <p className="message-box">{message}</p> : null}

        <div className="auth-grid">
          <form className="auth-form" action={signInAction}>
            <h2>Sign In</h2>
            <label>
              <span>Email</span>
              <input className="input" name="email" type="email" required />
            </label>
            <label>
              <span>Password</span>
              <input
                className="input"
                name="password"
                type="password"
                minLength={6}
                required
              />
            </label>
            <button className="button-primary" type="submit">
              Sign in
            </button>
          </form>

          <form className="auth-form" action={signUpAction}>
            <h2>Create Account</h2>
            <label>
              <span>Email</span>
              <input className="input" name="email" type="email" required />
            </label>
            <label>
              <span>Password</span>
              <input
                className="input"
                name="password"
                type="password"
                minLength={6}
                required
              />
            </label>
            <button className="button-secondary" type="submit">
              Create account
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
