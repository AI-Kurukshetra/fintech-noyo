import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getReconciliationData } from "../../lib/supabase/queries";

export default async function ReconciliationPage() {
  const { auditTrail, errors, reconciliation } = await getReconciliationData();

  const discrepancyCount = reconciliation.reduce(
    (total, item) => total + Number(item.discrepancies || 0),
    0,
  );
  const openErrors = errors.filter((error) => !/resolved/i.test(error.resolution)).length;

  const metrics = [
    {
      label: "Carrier Checks",
      value: String(reconciliation.length),
      delta: "Monitored",
      detail: "Tenant-carrier combinations currently tracked for data parity and status alignment.",
      tone: "metric-card-blue",
    },
    {
      label: "Discrepancies",
      value: String(discrepancyCount),
      delta: "Needs review",
      detail: "Enrollment mismatches or sync gaps requiring operational attention.",
      tone: "metric-card-coral",
    },
    {
      label: "Audit Events",
      value: String(auditTrail.length),
      delta: "Recorded",
      detail: "Recent actions captured for traceability across admin and automation activity.",
      tone: "metric-card-green",
    },
    {
      label: "Open Errors",
      value: String(openErrors),
      delta: "Investigating",
      detail: "Exceptions not yet fully resolved inside the reconciliation and delivery pipeline.",
      tone: "metric-card-gold",
    },
  ];

  return (
    <AppShell
      title="Reconciliation & Audit"
      eyebrow="Controls"
      description="Carrier parity checks, discrepancy monitoring, audit logging, and error-handling workflows."
    >
      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <Panel
        title="Reconciliation Runs"
        subtitle="Latest discrepancy status by organization and carrier"
      >
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Carrier</th>
                <th>Discrepancies</th>
                <th>Last Run</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reconciliation.map((item) => (
                <tr key={`${item.organization}-${item.carrier}`}>
                  <td>{item.organization}</td>
                  <td>{item.carrier}</td>
                  <td>{item.discrepancies}</td>
                  <td>{item.lastRun}</td>
                  <td>
                    <span className={`pill ${item.tone}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="two-column">
        <Panel
          title="Audit Trail"
          subtitle="Recent admin and automation actions captured for traceability"
        >
          <div className="stack-list compact">
            {auditTrail.map((entry) => (
              <article className="list-card" key={`${entry.actor}-${entry.timestamp}`}>
                <div>
                  <h3>{entry.actor}</h3>
                  <p>{entry.action} - {entry.entity}</p>
                </div>
                <span className="pill pill-soft">{entry.timestamp}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Error Log"
          subtitle="Exception handling status across mapping, carrier, and delivery subsystems"
        >
          <div className="stack-list compact">
            {errors.map((error) => (
              <article className="list-card" key={`${error.source}-${error.message}`}>
                <div>
                  <h3>{error.source}</h3>
                  <p>{error.message} - {error.resolution}</p>
                </div>
                <span className={`pill ${error.tone}`}>{error.severity}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
