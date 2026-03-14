import AppShell from "../../components/app-shell";
import Panel from "../../components/panel";
import { getCarrierData } from "../../lib/supabase/queries";

export default async function CarriersPage() {
  const {
    apiConnections,
    carrierConnections,
    fileIntegrations,
    mappingBacklog,
    rateLimitPolicies,
  } = await getCarrierData();

  return (
    <AppShell
      title="Carrier Network"
      eyebrow="Connectivity"
      description="A normalized control plane for carrier APIs, file-based integrations, data mapping, and throttling rules."
    >
      <section className="feature-grid">
        {carrierConnections.map((carrier) => (
          <article className="carrier-card" key={carrier.name}>
            <header>
              <div>
                <span className="eyebrow">{carrier.segment}</span>
                <h2>{carrier.name}</h2>
              </div>
              <span className={`pill ${carrier.tone}`}>{carrier.status}</span>
            </header>
            <p>{carrier.description}</p>
            <dl className="detail-grid">
              <div>
                <dt>Plans</dt>
                <dd>{carrier.plans}</dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>{carrier.method}</dd>
              </div>
              <div>
                <dt>Coverage</dt>
                <dd>{carrier.coverage}</dd>
              </div>
              <div>
                <dt>SLA</dt>
                <dd>{carrier.sla}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <section className="two-column">
        <Panel
          title="Mapping Backlog"
          subtitle="Carrier data normalization work from the seeded backlog table"
        >
          <div className="stack-list compact">
            {mappingBacklog.map((item) => (
              <article className="list-card" key={item.field}>
                <div>
                  <h3>{item.field}</h3>
                  <p>{item.description}</p>
                </div>
                <span className={`pill ${item.tone}`}>{item.state}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Rate Limit Strategy"
          subtitle="Carrier-specific throttling and retry rules"
        >
          <div className="stack-list compact">
            {rateLimitPolicies.map((policy) => (
              <article className="list-card" key={policy.carrier}>
                <div>
                  <h3>{policy.carrier}</h3>
                  <p>{policy.rule}</p>
                </div>
                <span className="pill pill-soft">{policy.window}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="two-column">
        <Panel
          title="API Connectivity"
          subtitle="Environment state, auth mode, and sync health by carrier"
        >
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Carrier</th>
                  <th>Environment</th>
                  <th>Auth</th>
                  <th>File Support</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {apiConnections.map((connection) => (
                  <tr key={`${connection.carrier}-${connection.environment}`}>
                    <td>{connection.carrier}</td>
                    <td>{connection.environment}</td>
                    <td>{connection.authMode}</td>
                    <td>{connection.fileSupport}</td>
                    <td>
                      <span className={`pill ${connection.tone}`}>
                        {connection.syncStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="File Integrations"
          subtitle="Failover and translation queues for non-API carrier workflows"
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
