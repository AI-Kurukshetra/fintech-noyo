import AppShell from "../../components/app-shell";
import Panel from "../../components/panel";
import { getEnrollmentData } from "../../lib/supabase/queries";

export default async function EnrollmentsPage() {
  const { enrollmentCases, validationRules, webhookEvents, workflowTracks } =
    await getEnrollmentData();

  return (
    <AppShell
      title="Enrollment Workflows"
      eyebrow="Operations"
      description="Processing rails for new hires, terminations, and qualifying life events, backed by Supabase seed data, validation rules, and webhook notifications."
    >
      <section className="workflow-grid">
        {workflowTracks.map((workflow) => (
          <Panel
            key={workflow.name}
            title={workflow.name}
            subtitle={workflow.summary}
          >
            <div className="timeline">
              {workflow.steps.map((step) => (
                <div className="timeline-item" key={step.title}>
                  <span className={`timeline-dot ${step.tone}`} />
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </section>

      <Panel
        title="Active Enrollment Queue"
        subtitle="Live queue sourced from the seeded enrollments table"
      >
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Workflow</th>
                <th>Carrier</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {enrollmentCases.map((item) => (
                <tr key={`${item.employee}-${item.plan}`}>
                  <td>
                    <strong>{item.employee}</strong>
                    <span>{item.organization}</span>
                  </td>
                  <td>{item.workflow}</td>
                  <td>{item.carrier}</td>
                  <td>{item.plan}</td>
                  <td>
                    <span className={`pill ${item.tone}`}>{item.status}</span>
                  </td>
                  <td>{item.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="two-column">
        <Panel
          title="Validation Engine"
          subtitle="Rules mirrored from the blueprint and stored in Supabase"
        >
          <div className="stack-list compact">
            {validationRules.map((rule) => (
              <article className="list-card" key={rule.title}>
                <div>
                  <h3>{rule.title}</h3>
                  <p>{rule.description}</p>
                </div>
                <span className={`pill ${rule.tone}`}>{rule.impact}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Webhook Event Feed"
          subtitle="Latest outbound notifications from the seeded event stream"
        >
          <div className="event-feed">
            {webhookEvents.map((event) => (
              <article className="event-item" key={event.id}>
                <div>
                  <h3>{event.topic}</h3>
                  <p>
                    {event.destination} - {event.timestamp}
                  </p>
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
