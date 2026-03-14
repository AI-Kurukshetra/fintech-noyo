"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  {
    label: "Operations",
    items: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/organizations", label: "Organizations" },
      { href: "/employees", label: "Employees" },
      { href: "/plans", label: "Plans" },
      { href: "/enrollments", label: "Enrollments" },
      { href: "/life-events", label: "Life Events" },
      { href: "/workflows", label: "Workflows" },
    ],
  },
  {
    label: "Network",
    items: [
      { href: "/carriers", label: "Carriers" },
      { href: "/reconciliation", label: "Reconciliation" },
      { href: "/reports", label: "Reports" },
      { href: "/billing", label: "Billing" },
      { href: "/settings", label: "Settings" },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/analytics", label: "Analytics" },
      { href: "/developers", label: "Developers" },
    ],
  },
];

export default function Sidebar({ userEmail }) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <span className="brand-kicker">Noyo OS</span>
          <h2>Benefits data control plane</h2>
          <p>Blueprint-driven prototype in Next.js with Supabase auth and data.</p>
        </div>

        <nav className="sidebar-nav">
          {navGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              <span className="nav-section-label">{group.label}</span>
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={active ? "nav-link nav-link-active" : "nav-link"}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-stack">
        {userEmail ? (
          <div className="sidebar-user">
            <span className="eyebrow">Signed In</span>
            <strong>{userEmail}</strong>
          </div>
        ) : null}

        <div className="sidebar-note">
          <span className="eyebrow">Blueprint pull-through</span>
          <p>
            Tenant setup, plans, life events, workflows, reconciliation,
            reporting, billing, and integration settings now have dedicated
            routes in the app.
          </p>
        </div>
      </div>
    </aside>
  );
}
