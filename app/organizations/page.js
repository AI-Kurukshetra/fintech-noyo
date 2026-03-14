import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getOrganizationsData } from "../../lib/supabase/queries";

export default async function OrganizationsPage() {
  const { accessRoles, eligibilityRules, organizations, setupTracks } =
    await getOrganizationsData();

  const metrics = [
    {
      label: "Tenants",
      value: String(organizations.length),
      delta: "Multi-tenant",
      detail: "Organizations isolated under shared carrier and workflow infrastructure.",
      tone: "metric-card-blue",
    },
    {
      label: "Setup Tracks",
      value: String(setupTracks.length),
      delta: "Onboarding",
      detail: "Carrier onboarding, eligibility setup, and environment readiness.",
      tone: "metric-card-green",
    },
    {
      label: "Eligibility Rules",
      value: String(eligibilityRules.length),
      delta: "Configured",
      detail: "Rules enforcing plan access, classes, and coverage timing.",
      tone: "metric-card-gold",
    },
    {
      label: "Access Roles",
      value: String(accessRoles.length),
      delta: "Scoped",
      detail: "Role patterns for owner, operations, and support access.",
      tone: "metric-card-coral",
    },
  ];

  return (
    <AppShell
      title="Organizations"
      eyebrow="Tenancy"
      description="Tenant setup, group onboarding, eligibility rule configuration, and access control for the multi-tenant platform."
    >
      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="two-column">
        <Panel title="Tenant Portfolio" subtitle="Active organizations on the platform">
          <div className="stack-list">
            {organizations.map((tenant) => (
              <article className="tenant-card" key={tenant.name}>
                <div>
                  <h3>{tenant.name}</h3>
                  <p>
                    {tenant.employees} employees - {tenant.carriers} carriers -{" "}
                    {tenant.segment}
                  </p>
                </div>
                <div className="tenant-stats">
                  <span className={`pill ${tenant.statusTone}`}>{tenant.status}</span>
                  <strong>{tenant.successRate}</strong>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Group Setup Progress"
          subtitle="Carrier, webhook, plan, and onboarding readiness per tenant"
        >
          <div className="stack-list compact">
            {setupTracks.map((track) => (
              <article className="list-card" key={`${track.organization}-${track.owner}`}>
                <div>
                  <h3>{track.organization} - {track.owner}</h3>
                  <p>{track.milestone}</p>
                </div>
                <span className={`pill ${track.tone}`}>{track.status}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="two-column">
        <Panel
          title="Eligibility Rules"
          subtitle="Coverage timing, dependent rules, and plan class logic"
        >
          <div className="stack-list compact">
            {eligibilityRules.map((rule) => (
              <article className="list-card" key={`${rule.organization}-${rule.name}`}>
                <div>
                  <h3>{rule.organization} - {rule.name}</h3>
                  <p>{rule.appliesTo} - {rule.logic}</p>
                </div>
                <span className={`pill ${rule.tone}`}>{rule.status}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Access Model"
          subtitle="Role-based control of tenant operations and sensitive configuration"
        >
          <div className="stack-list compact">
            {accessRoles.map((role) => (
              <article className="list-card" key={role.role}>
                <div>
                  <h3>{role.role}</h3>
                  <p>{role.access}</p>
                </div>
                <span className="pill pill-soft">{role.scope}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
