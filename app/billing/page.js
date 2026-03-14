import AppShell from "../../components/app-shell";
import MetricCard from "../../components/metric-card";
import Panel from "../../components/panel";
import { getBillingData } from "../../lib/supabase/queries";

function parseCurrency(value) {
  return Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function BillingPage() {
  const { billingRecords, monetization } = await getBillingData();

  const billedTotal = billingRecords.reduce(
    (total, record) => total + parseCurrency(record.amount),
    0,
  );
  const outstandingCount = billingRecords.filter((record) =>
    /pending|draft/i.test(record.status),
  ).length;

  const metrics = [
    {
      label: "Billing Records",
      value: String(billingRecords.length),
      delta: "Active accounts",
      detail: "Tenant-level billing records surfaced through the billing module.",
      tone: "metric-card-blue",
    },
    {
      label: "Current Period",
      value: formatCurrency(billedTotal),
      delta: "Visible revenue",
      detail: "Summed value of the billing records currently visible in the app.",
      tone: "metric-card-green",
    },
    {
      label: "Outstanding",
      value: String(outstandingCount),
      delta: "Pending or draft",
      detail: "Billing items that still require payment, approval, or finalization.",
      tone: "metric-card-gold",
    },
    {
      label: "Monetization Levers",
      value: String(monetization.length),
      delta: "Pricing model",
      detail: "Commercial levers and packaging options represented in the product strategy.",
      tone: "metric-card-coral",
    },
  ];

  return (
    <AppShell
      title="Billing & Monetization"
      eyebrow="Revenue"
      description="Customer billing visibility, pricing-model support, and monetization levers aligned to the blueprint."
    >
      <section className="metric-grid">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <Panel
        title="Billing Ledger"
        subtitle="Current billing period, pricing model, invoice amount, and status by organization"
      >
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Period</th>
                <th>Model</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {billingRecords.map((record) => (
                <tr key={`${record.organization}-${record.period}`}>
                  <td>{record.organization}</td>
                  <td>{record.period}</td>
                  <td>{record.model}</td>
                  <td>{record.amount}</td>
                  <td>
                    <span className={`pill ${record.tone}`}>{record.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title="Monetization Model"
        subtitle="Commercial options represented in the product strategy and billing design"
      >
        <div className="bullet-cloud">
          {monetization.map((item) => (
            <span className="chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
