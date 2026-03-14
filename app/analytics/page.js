import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getAnalyticsData } from "../../lib/supabase/queries";

export default async function AnalyticsPage() {
  const { analyticsMetrics, costLevers, goToMarketNotes, performanceSeries } =
    await getAnalyticsData();

  return (
    <AppShell
      title="Analytics & Growth"
      eyebrow="Signals"
      description="Enrollment success, carrier coverage, time-to-value, and commercial metrics aligned to the blueprint's KPIs and loaded from Supabase."
    >
      <section className="metric-grid">
        {analyticsMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="two-column">
        <Panel
          title="Performance Trend"
          subtitle="Seeded trend series across enrollment reliability and carrier throughput"
        >
          <div className="chart-grid">
            {performanceSeries.map((point) => (
              <div className="bar-group" key={point.label}>
                <span className="bar-label">{point.label}</span>
                <div className="bar-stack">
                  <span
                    className="bar bar-primary"
                    style={{ height: `${point.success}%` }}
                  />
                  <span
                    className="bar bar-secondary"
                    style={{ height: `${point.coverage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Cost Optimization Engine"
          subtitle="Differentiator-focused opportunities stored in Supabase"
        >
          <div className="stack-list compact">
            {costLevers.map((lever) => (
              <article className="list-card" key={lever.title}>
                <div>
                  <h3>{lever.title}</h3>
                  <p>{lever.description}</p>
                </div>
                <span className="pill pill-strong">{lever.value}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <Panel
        title="Go-to-Market Notes"
        subtitle="Commercial guidance captured from the PDF"
      >
        <div className="bullet-cloud">
          {goToMarketNotes.map((note) => (
            <span className="chip" key={note}>
              {note}
            </span>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
