import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getEmployeesData } from "../../lib/supabase/queries";

export default async function EmployeesPage() {
  const { demographicCoverage, dependents, employees, recommendations } =
    await getEmployeesData();

  return (
    <AppShell
      title="Employees & Dependents"
      eyebrow="People"
      description="Employee demographics, dependent management, sync quality, and recommendation support across tenant populations."
    >
      <section className="metric-grid">
        {demographicCoverage.map((metric) => (
          <MetricCard
            key={metric.title}
            label={metric.title}
            value={metric.value}
            delta="Coverage"
            detail={metric.description}
            tone="metric-card-blue"
          />
        ))}
      </section>

      <Panel
        title="Employee Roster"
        subtitle="Demographics, employment class, and coverage state"
      >
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Organization</th>
                <th>Class</th>
                <th>Coverage</th>
                <th>Status</th>
                <th>Sync</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((item) => (
                <tr key={`${item.organization}-${item.name}`}>
                  <td>{item.name}</td>
                  <td>{item.organization}</td>
                  <td>{item.className}</td>
                  <td>{item.coverage}</td>
                  <td>
                    <span className={`pill ${item.tone}`}>{item.status}</span>
                  </td>
                  <td>{item.syncState}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="two-column">
        <Panel
          title="Dependent Management"
          subtitle="Eligibility and coverage state for spouses and children"
        >
          <div className="stack-list compact">
            {dependents.map((item) => (
              <article className="list-card" key={`${item.employee}-${item.dependent}`}>
                <div>
                  <h3>{item.dependent} - {item.relationship}</h3>
                  <p>Employee: {item.employee} - {item.coverage}</p>
                </div>
                <span className={`pill ${item.tone}`}>{item.status}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Decision Support"
          subtitle="Recommendation engine outputs for coverage and cost optimization"
        >
          <div className="stack-list compact">
            {recommendations.map((item) => (
              <article className="list-card" key={`${item.employee}-${item.recommendation}`}>
                <div>
                  <h3>{item.employee}</h3>
                  <p>{item.recommendation} - Confidence {item.confidence}</p>
                </div>
                <span className="pill pill-strong">{item.savings}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
