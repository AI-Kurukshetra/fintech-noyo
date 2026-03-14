import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getLifeEventsData } from "../../lib/supabase/queries";

export default async function LifeEventsPage() {
  const { communications, lifeEvents } = await getLifeEventsData();

  const pendingDocuments = lifeEvents.filter((event) =>
    /need|pending/i.test(event.verification),
  ).length;
  const cobraCases = lifeEvents.filter(
    (event) => !/not applicable/i.test(event.cobra),
  ).length;

  const metrics = [
    {
      label: "Life Events",
      value: String(lifeEvents.length),
      delta: "Active queue",
      detail: "Marriage, birth, termination, and other event-driven changes in flight.",
      tone: "metric-card-blue",
    },
    {
      label: "Pending Documents",
      value: String(pendingDocuments),
      delta: "Verification",
      detail: "Cases blocked on certificates, dependent proof, or supporting documentation.",
      tone: "metric-card-gold",
    },
    {
      label: "COBRA Actions",
      value: String(cobraCases),
      delta: "Compliance",
      detail: "Events that trigger continuation coverage review or notice delivery.",
      tone: "metric-card-coral",
    },
    {
      label: "Comms Templates",
      value: String(communications.length),
      delta: "Outbound queue",
      detail: "Template-driven communications associated with event processing.",
      tone: "metric-card-green",
    },
  ];

  return (
    <AppShell
      title="Life Events"
      eyebrow="QLE"
      description="Qualifying life-event operations, verification status, COBRA workflows, and outbound benefits communications."
    >
      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <Panel
        title="Life Event Queue"
        subtitle="Operational queue for event type, verification status, effective date, and COBRA handling"
      >
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Organization</th>
                <th>Event</th>
                <th>Verification</th>
                <th>COBRA</th>
                <th>Effective</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lifeEvents.map((event) => (
                <tr key={`${event.employee}-${event.eventType}`}>
                  <td>{event.employee}</td>
                  <td>{event.organization}</td>
                  <td>{event.eventType}</td>
                  <td>{event.verification}</td>
                  <td>{event.cobra}</td>
                  <td>{event.effectiveOn}</td>
                  <td>
                    <span className={`pill ${event.tone}`}>{event.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="two-column">
        <Panel
          title="Communication Queue"
          subtitle="Triggered emails, postal notices, and verification prompts"
        >
          <div className="stack-list compact">
            {communications.map((item) => (
              <article className="list-card" key={`${item.template}-${item.channel}`}>
                <div>
                  <h3>{item.template}</h3>
                  <p>{item.channel} - {item.audience}</p>
                </div>
                <span className={`pill ${item.tone}`}>{item.status}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Action Watchlist"
          subtitle="Cases currently requiring manual review or compliance follow-through"
        >
          <div className="stack-list compact">
            {lifeEvents.map((event) => (
              <article className="list-card" key={`${event.employee}-${event.status}`}>
                <div>
                  <h3>{event.employee} - {event.eventType}</h3>
                  <p>{event.verification} - {event.cobra}</p>
                </div>
                <span className={`pill ${event.tone}`}>{event.status}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
