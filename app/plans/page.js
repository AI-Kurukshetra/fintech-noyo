import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getPlansData } from "../../lib/supabase/queries";

export default async function PlansPage() {
  const { configurations, plans, recommendations } = await getPlansData();

  const carrierCount = new Set(plans.map((plan) => plan.carrier)).size;
  const categoryCount = new Set(plans.map((plan) => plan.category)).size;

  const metrics = [
    {
      label: "Benefit Plans",
      value: String(plans.length),
      delta: "Coverage catalog",
      detail: "Plans currently configured across medical, dental, and specialty lines.",
      tone: "metric-card-blue",
    },
    {
      label: "Configurations",
      value: String(configurations.length),
      delta: "Plan years",
      detail: "Employer-level plan designs, funding models, and publication state.",
      tone: "metric-card-green",
    },
    {
      label: "Carrier Lines",
      value: String(carrierCount),
      delta: "Connected carriers",
      detail: "Distinct carriers represented in configured benefit plans.",
      tone: "metric-card-gold",
    },
    {
      label: "Coverage Types",
      value: String(categoryCount),
      delta: "Benefit classes",
      detail: "Benefit categories tracked in the product and surfaced to enrollment flows.",
      tone: "metric-card-coral",
    },
  ];

  return (
    <AppShell
      title="Plans & Coverage"
      eyebrow="Benefits"
      description="Benefit plan administration, configuration state, coverage tiers, and recommendation support across employer groups."
    >
      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <Panel
        title="Benefit Plan Catalog"
        subtitle="Carrier, category, coverage level, and pricing across configured plans"
      >
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Carrier</th>
                <th>Plan</th>
                <th>Category</th>
                <th>Coverage</th>
                <th>Premium</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={`${plan.organization}-${plan.name}`}>
                  <td>{plan.organization}</td>
                  <td>{plan.carrier}</td>
                  <td>{plan.name}</td>
                  <td>{plan.category}</td>
                  <td>{plan.coverageLevel}</td>
                  <td>{plan.premium}</td>
                  <td>
                    <span className={`pill ${plan.tone}`}>{plan.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="two-column">
        <Panel
          title="Plan Configurations"
          subtitle="Funding strategy, plan-year state, and publication readiness"
        >
          <div className="stack-list compact">
            {configurations.map((config) => (
              <article
                className="list-card"
                key={`${config.organization}-${config.configuration}`}
              >
                <div>
                  <h3>{config.organization} - {config.configuration}</h3>
                  <p>{config.funding} - Plan year {config.planYear}</p>
                </div>
                <span className={`pill ${config.tone}`}>{config.status}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Decision Support Output"
          subtitle="Recommendation layer that informs plan choice and savings messaging"
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
