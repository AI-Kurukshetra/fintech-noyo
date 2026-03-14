import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getDashboardData } from "../../lib/supabase/queries";

export default async function DashboardPage() {
  const {
    apiConnections,
    billingRecords,
    complianceReports,
    enrollmentCases,
    implementationModules,
    keyMetrics,
    lifeEvents,
    queueCards,
    reconciliation,
  } = await getDashboardData();

  return (
    <AppShell
      title="Operational Dashboard"
      eyebrow="Command Center"
      description="This view pulls together the working product areas behind the blueprint: enrollment operations, life events, reconciliation, carrier health, compliance, billing, and route-level module coverage."
    >
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">Working product surface</span>
          <h1>Run the benefits operating system from one control plane.</h1>
          <p>
            The dashboard is no longer a static feature collage. It summarizes
            the live modules in the app and links into the underlying
            operations for setup, eligibility, carriers, plans, life events,
            workflows, reconciliation, reporting, and billing.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href="/organizations">
              Open tenant setup
            </a>
            <a className="button-secondary" href="/workflows">
              Review workflows
            </a>
          </div>
        </div>
        <div className="hero-aside">
          <div className="spotlight-card">
            <span>Module coverage</span>
            <strong>{implementationModules.length} routes</strong>
            <p>Each route now corresponds to a concrete product area from the PDF.</p>
          </div>
          <div className="spotlight-card spotlight-card-alt">
            <span>Operational view</span>
            <strong>{enrollmentCases.length + lifeEvents.length} active cases</strong>
            <p>Enrollment and life-event queues are surfaced directly below.</p>
          </div>
        </div>
      </section>

      <section className="metric-grid">
        {keyMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="metric-grid">
        {queueCards.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="two-column">
        <Panel
          title="Enrollment Queue"
          subtitle="Open work across new hires, QLEs, and terminations"
        >
          <div className="stack-list compact">
            {enrollmentCases.map((item) => (
              <article className="list-card" key={`${item.employee}-${item.plan}`}>
                <div>
                  <h3>{item.employee} - {item.plan}</h3>
                  <p>{item.organization} - {item.workflow} - {item.carrier}</p>
                </div>
                <span className={`pill ${item.tone}`}>{item.status}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Life Event Queue"
          subtitle="Verification, COBRA, and dependent change activity"
        >
          <div className="stack-list compact">
            {lifeEvents.map((item) => (
              <article className="list-card" key={`${item.employee}-${item.eventType}`}>
                <div>
                  <h3>{item.employee} - {item.eventType}</h3>
                  <p>
                    {item.organization} - {item.verification} - Effective{" "}
                    {item.effectiveOn}
                  </p>
                </div>
                <span className={`pill ${item.tone}`}>{item.status}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="two-column">
        <Panel
          title="Carrier Health"
          subtitle="API connection and integration state across the carrier network"
        >
          <div className="stack-list compact">
            {apiConnections.map((connection) => (
              <article
                className="list-card"
                key={`${connection.carrier}-${connection.environment}`}
              >
                <div>
                  <h3>{connection.carrier} - {connection.environment}</h3>
                  <p>{connection.authMode} - {connection.fileSupport}</p>
                </div>
                <span className={`pill ${connection.tone}`}>
                  {connection.syncStatus}
                </span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Compliance Watch"
          subtitle="Reports, notices, and reporting obligations nearing action"
        >
          <div className="stack-list compact">
            {complianceReports.map((report) => (
              <article className="list-card" key={`${report.organization}-${report.report}`}>
                <div>
                  <h3>{report.organization} - {report.report}</h3>
                  <p>Due {report.dueDate}</p>
                </div>
                <span className={`pill ${report.tone}`}>{report.status}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <Panel
        title="Implemented Product Modules"
        subtitle="These routes now back the feature areas from the blueprint"
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

      <section className="two-column">
        <Panel
          title="Reconciliation Status"
          subtitle="Current discrepancy state by tenant and carrier"
        >
          <div className="stack-list compact">
            {reconciliation.map((item) => (
              <article className="list-card" key={`${item.organization}-${item.carrier}`}>
                <div>
                  <h3>{item.organization} - {item.carrier}</h3>
                  <p>{item.discrepancies} discrepancies - Last run {item.lastRun}</p>
                </div>
                <span className={`pill ${item.tone}`}>{item.status}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Billing Snapshot"
          subtitle="Revenue and customer billing state across active tenants"
        >
          <div className="stack-list compact">
            {billingRecords.map((item) => (
              <article className="list-card" key={`${item.organization}-${item.period}`}>
                <div>
                  <h3>{item.organization} - {item.amount}</h3>
                  <p>{item.period} - {item.model}</p>
                </div>
                <span className={`pill ${item.tone}`}>{item.status}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
