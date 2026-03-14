import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getReportsData } from "../../lib/supabase/queries";

export default async function ReportsPage() {
  const { complianceReports, exportJobs } = await getReportsData();

  const dueSoonCount = complianceReports.filter((report) => /due/i.test(report.status)).length;
  const exportDestinations = new Set(exportJobs.map((job) => job.destination)).size;

  const metrics = [
    {
      label: "Compliance Reports",
      value: String(complianceReports.length),
      delta: "Tracked",
      detail: "Scheduled compliance outputs and notice obligations currently surfaced in the app.",
      tone: "metric-card-blue",
    },
    {
      label: "Due Soon",
      value: String(dueSoonCount),
      delta: "Time-sensitive",
      detail: "Reporting items whose current state indicates near-term action is required.",
      tone: "metric-card-gold",
    },
    {
      label: "Export Jobs",
      value: String(exportJobs.length),
      delta: "Delivery queue",
      detail: "Operational export jobs across archive, partner, finance, and reporting destinations.",
      tone: "metric-card-green",
    },
    {
      label: "Destinations",
      value: String(exportDestinations),
      delta: "Output channels",
      detail: "Unique delivery destinations configured for report and data export output.",
      tone: "metric-card-coral",
    },
  ];

  return (
    <AppShell
      title="Reports & Compliance"
      eyebrow="Governance"
      description="Compliance tracking, reporting deadlines, and operational data exports across tenant organizations."
    >
      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <Panel
        title="Compliance Calendar"
        subtitle="Current obligations, due dates, and execution state by organization"
      >
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Report</th>
                <th>Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complianceReports.map((report) => (
                <tr key={`${report.organization}-${report.report}`}>
                  <td>{report.organization}</td>
                  <td>{report.report}</td>
                  <td>{report.dueDate}</td>
                  <td>
                    <span className={`pill ${report.tone}`}>{report.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="two-column">
        <Panel
          title="Export Jobs"
          subtitle="Operational report and data-export jobs with destination state"
        >
          <div className="stack-list compact">
            {exportJobs.map((job) => (
              <article className="list-card" key={`${job.organization}-${job.destination}`}>
                <div>
                  <h3>{job.organization}</h3>
                  <p>{job.format} - {job.destination}</p>
                </div>
                <span className={`pill ${job.tone}`}>{job.status}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Due-Soon Watchlist"
          subtitle="Reports currently nearest to action or execution"
        >
          <div className="stack-list compact">
            {complianceReports.map((report) => (
              <article className="list-card" key={`${report.report}-${report.status}`}>
                <div>
                  <h3>{report.report}</h3>
                  <p>{report.organization} - Due {report.dueDate}</p>
                </div>
                <span className={`pill ${report.tone}`}>{report.status}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
