import { redirect } from "next/navigation";
import {
  getSupabaseConfigMessage,
  hasPublicSupabaseEnv,
} from "../lib/supabase/env";
import { createClient } from "../lib/supabase/server";
import Sidebar from "./sidebar";

export default async function AppShell({
  title,
  eyebrow,
  description,
  children,
  protectedView = true,
}) {
  if (!hasPublicSupabaseEnv()) {
    if (protectedView) {
      redirect(`/login?message=${encodeURIComponent(getSupabaseConfigMessage())}`);
    }

    return (
      <div className="layout-frame">
        <Sidebar userEmail={null} />
        <main className="main-column">
          <header className="page-header">
            <div>
              <span className="eyebrow">{eyebrow}</span>
              <h1>{title}</h1>
            </div>
            <div className="header-side">
              <p>{description}</p>
            </div>
          </header>
          <div className="page-content">{children}</div>
        </main>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (protectedView && !user) {
    redirect("/login");
  }

  return (
    <div className="layout-frame">
      <Sidebar userEmail={user?.email ?? null} />
      <main className="main-column">
        <header className="page-header">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
          </div>

          <div className="header-side">
            <p>{description}</p>
            {user ? (
              <div className="session-card">
                <div>
                  <span className="eyebrow">Session</span>
                  <strong>{user.email}</strong>
                </div>
                <form action="/auth/signout" method="post">
                  <button className="button-quiet" type="submit">
                    Sign out
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        </header>
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
}
