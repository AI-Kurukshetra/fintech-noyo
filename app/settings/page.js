import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getSettingsData } from "../../lib/supabase/queries";

export default async function SettingsPage() {
  const { accessRoles, localization, marketplaces, webhookSubscriptions } =
    await getSettingsData();

  const activeMarkets = marketplaces.filter((item) =>
    /connected|pilot|active/i.test(item.status),
  ).length;

  const metrics = [
    {
      label: "Webhook Endpoints",
      value: String(webhookSubscriptions.length),
      delta: "Outbound integrations",
      detail: "Configured webhook destinations used for downstream benefits events.",
      tone: "metric-card-blue",
    },
    {
      label: "Marketplace Links",
      value: String(marketplaces.length),
      delta: "Partner ecosystem",
      detail: "Marketplace and partner connections represented in the integration layer.",
      tone: "metric-card-green",
    },
    {
      label: "Localization Profiles",
      value: String(localization.length),
      delta: "Client settings",
      detail: "Locale, currency, mobile sync, and offline mode configurations.",
      tone: "metric-card-gold",
    },
    {
      label: "Access Roles",
      value: String(accessRoles.length),
      delta: `${activeMarkets} live links`,
      detail: "Role patterns that control settings, exports, billing, and operational access.",
      tone: "metric-card-coral",
    },
  ];

  return (
    <AppShell
      title="Settings & Integrations"
      eyebrow="Configuration"
      description="Webhook subscriptions, partner integrations, localization preferences, and access controls."
    >
      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="two-column">
        <Panel
          title="Webhook Subscriptions"
          subtitle="Event destinations and delivery posture by organization"
        >
          <div className="stack-list compact">
            {webhookSubscriptions.map((subscription) => (
              <article
                className="list-card"
                key={`${subscription.organization}-${subscription.endpoint}`}
              >
                <div>
                  <h3>{subscription.organization}</h3>
                  <p>{subscription.endpoint} - {subscription.events}</p>
                </div>
                <span className={`pill ${subscription.tone}`}>
                  {subscription.status}
                </span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel
          title="Marketplace Integrations"
          subtitle="Partner ecosystem connectivity across marketplace and broker channels"
        >
          <div className="stack-list compact">
            {marketplaces.map((integration) => (
              <article
                className="list-card"
                key={`${integration.organization}-${integration.provider}`}
              >
                <div>
                  <h3>{integration.provider}</h3>
                  <p>{integration.organization} - {integration.category}</p>
                </div>
                <span className={`pill ${integration.tone}`}>
                  {integration.status}
                </span>
              </article>
            ))}
          </div>
        </Panel>
      </section>

      <section className="two-column">
        <Panel
          title="Localization"
          subtitle="Locale, currency, mobile sync, and offline readiness by tenant"
        >
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Locale</th>
                  <th>Currency</th>
                  <th>Mobile Sync</th>
                  <th>Offline Mode</th>
                </tr>
              </thead>
              <tbody>
                {localization.map((entry) => (
                  <tr key={`${entry.organization}-${entry.locale}`}>
                    <td>{entry.organization}</td>
                    <td>{entry.locale}</td>
                    <td>{entry.currency}</td>
                    <td>{entry.mobileSync}</td>
                    <td>{entry.offlineMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="Access Roles"
          subtitle="Role-based permissions across configuration, billing, and operations"
        >
          <div className="stack-list compact">
            {accessRoles.map((role) => (
              <article className="list-card" key={role.role}>
                <div>
                  <h3>{role.role}</h3>
                  <p>{role.access}</p>
                </div>
                <span className="pill pill-soft">{role.scope}</span>
              </article>
            ))}
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
