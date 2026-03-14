import AppShell from "../../components/app-shell";
import Panel from "../../components/panel";
import { apiSample, webhookSample } from "../../lib/noyo-data";
import { getDeveloperPortalData } from "../../lib/supabase/queries";

export default async function DevelopersPage() {
  const { apiEndpointGroups, implementationModules, keyEntities } =
    await getDeveloperPortalData();

  const mockRoutes = [
    {
      path: "/api/health",
      summary: "Top-level status, overview metrics, and analytics metrics.",
    },
    {
      path: "/api/dashboard",
      summary: "Operational dashboard aggregation across queues, compliance, and billing.",
    },
    {
      path: "/api/organizations",
      summary: "Tenant setup, eligibility rules, and access model data.",
    },
    {
      path: "/api/employees",
      summary: "Employee roster, dependents, and decision-support recommendations.",
    },
    {
      path: "/api/plans",
      summary: "Benefit plans, plan configurations, and recommendation outputs.",
    },
    {
      path: "/api/life-events",
      summary: "Life-event case queue with communication templates and COBRA status.",
    },
    {
      path: "/api/carriers",
      summary: "Carrier connectivity, mapping backlog, rate limits, and file integrations.",
    },
    {
      path: "/api/enrollments",
      summary: "Enrollment workflow templates, queue items, rules, and webhook feed.",
    },
    {
      path: "/api/workflows",
      summary: "Workflow templates, active automation runs, and file-based orchestration.",
    },
    {
      path: "/api/reconciliation",
      summary: "Discrepancy monitoring, audit trail, and error logs.",
    },
    {
      path: "/api/reports",
      summary: "Compliance reporting deadlines and export jobs.",
    },
    {
      path: "/api/billing",
      summary: "Billing records and monetization model inputs.",
    },
    {
      path: "/api/settings",
      summary: "Webhook subscriptions, marketplace connections, and localization settings.",
    },
    {
      path: "/api/webhooks",
      summary: "Webhook event feed extracted from the enrollment module.",
    },
  ];

  return (
    <AppShell
      title="Developer Portal"
      eyebrow="Docs"
      description="Mock API docs for the operating system, covering key entity domains, endpoint groups, webhook contracts, and live route coverage."
    >
      <section className="two-column">
        <Panel title="Endpoint Groups" subtitle="Seeded endpoint families in the platform">
          <div className="bullet-cloud">
            {apiEndpointGroups.map((group) => (
              <span className="chip chip-code" key={group}>
                {group}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Core Entities" subtitle="Suggested object model for the platform">
          <div className="bullet-cloud">
            {keyEntities.map((entity) => (
              <span className="chip" key={entity}>
                {entity}
              </span>
            ))}
          </div>
        </Panel>
      </section>

      <section className="two-column">
        <Panel title="Enrollment API Sample" subtitle="GET /api/enrollments">
          <pre className="code-block">
            <code>{apiSample}</code>
          </pre>
        </Panel>

        <Panel title="Webhook Contract" subtitle="POST enrollment.updated">
          <pre className="code-block">
            <code>{webhookSample}</code>
          </pre>
        </Panel>
      </section>

      <Panel
        title="Implemented Product Routes"
        subtitle="Application routes that now map to concrete blueprint modules"
      >
        <div className="feature-grid">
          {implementationModules.map((module) => (
            <article className="feature-card" key={module.route}>
              <header>
                <span className="feature-index">{module.route}</span>
                <a className="pill pill-soft" href={module.route}>
                  Open
                </a>
              </header>
              <h3>{module.module}</h3>
              <p>{module.coverage}</p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel
        title="Working Mock Routes"
        subtitle="These handlers are implemented in the app and return Supabase-backed data when the schema is applied"
      >
        <div className="stack-list compact">
          {mockRoutes.map((route) => (
            <article className="list-card" key={route.path}>
              <div>
                <h3>{route.path}</h3>
                <p>{route.summary}</p>
              </div>
              <span className="pill pill-strong">GET</span>
            </article>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
