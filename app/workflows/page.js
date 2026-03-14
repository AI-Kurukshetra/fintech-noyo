import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getWorkflowsData } from "../../lib/supabase/queries";

export default async function WorkflowsPage() {
  const { fileIntegrations, workflowTracks, workflows } = await getWorkflowsData();

  const monitoredRuns = workflows.filter((workflow) =>
    /active|live|monitor/i.test(workflow.status),
  ).length;

  const metrics = [
    {
      label: "Workflow Templates",
      value: String(workflowTracks.length),
      delta: "Blueprint flows",
      detail: "Canonical tracks for new hire, QLE, and termination operations.",
      tone: "metric-card-blue",
    },
    {
      label: "Automation Runs",
      value: String(workflows.length),
      delta: "Current execution",
      detail: "Operational workflow instances being actively monitored in the app.",
      tone: "metric-card-green",
    },
    {
      label: "Monitored Runs",
      value: String(monitoredRuns),
      delta: "Healthy or active",
      detail: "Runs currently live, active, or under operational supervision.",
      tone: "metric-card-gold",
    },
    {
      label: "File Integrations",
      value: String(fileIntegrations.length),
      delta: "Fallback rails",
      detail: "File-based carrier exchanges supporting the workflow automation layer.",
      tone: "metric-card-coral",
    },
  ];

  return (
    <AppShell
      title="Workflow Automation"
      eyebrow="Orchestration"
      description="Workflow templates, active automation runs, and file-based integration support for enrollment and change processing."
    >
      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="workflow-grid">
        {workflowTracks.map((workflow) => (
          <Panel key={workflow.name} title={workflow.name} subtitle={workflow.summary}>
            <div className="timeline">
              {workflow.steps.map((step) => (
                <div className="timeline-item" key={`${workflow.name}-${step.title}`}>
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

      <section className="two-column">
        <Panel
          title="Active Automation Runs"
          subtitle="Workflow state, current step, and owner across live operational automations"
        >
          <div className="stack-list compact">
            {workflows.map((workflow) => (
              <article className="list-card" key={`${workflow.name}-${workflow.owner}`}>
                <div>
                  <h3>{workflow.name}</h3>
                  <p>{workflow.currentStep} - Owner {workflow.owner}</p>
                </div>
                <span className={`pill ${workflow.tone}`}>{workflow.status}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="File-Based Execution"
          subtitle="Translation, failover, and nightly handoff queues used where direct APIs are incomplete"
        >
          <div className="stack-list compact">
            {fileIntegrations.map((integration) => (
              <article
                className="list-card"
                key={`${integration.partner}-${integration.format}`}
              >
                <div>
                  <h3>{integration.partner} - {integration.format}</h3>
                  <p>{integration.note}</p>
                </div>
                <span className={`pill ${integration.tone}`}>
                  {integration.status}
                </span>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
