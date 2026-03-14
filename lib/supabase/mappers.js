function unwrap(value) {
  return Array.isArray(value) ? value[0] : value;
}

export function formatPercent(value) {
  return `${Number(value).toFixed(1)}%`;
}

export function formatInteger(value) {
  return new Intl.NumberFormat("en-US").format(Number(value));
}

export function formatDateLabel(value) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function mapMetric(row) {
  return {
    label: row.label,
    value: row.value_text,
    delta: row.delta_text,
    detail: row.detail,
    tone: row.tone,
  };
}

export function mapTenant(row) {
  return {
    name: row.name,
    employees: formatInteger(row.employees_count),
    carriers: row.carriers_count,
    segment: row.segment,
    status: row.status,
    statusTone: row.status_tone,
    successRate: formatPercent(row.success_rate),
  };
}

export function mapCarrier(row) {
  return {
    name: row.name,
    segment: row.segment,
    status: row.status,
    tone: row.tone,
    description: row.description,
    plans: row.plans,
    method: row.method,
    coverage: row.coverage,
    sla: `${row.sla_minutes} minutes`,
  };
}

export function mapWorkflow(template, steps) {
  return {
    name: template.name,
    summary: template.summary,
    steps: steps
      .filter((step) => step.workflow_id === template.id)
      .map((step) => ({
        title: step.title,
        detail: step.detail,
        tone: step.tone,
      })),
  };
}

export function mapEnrollment(row) {
  const organization = unwrap(row.organizations);
  const employee = unwrap(row.employees);
  const carrier = unwrap(row.insurance_carriers);

  return {
    employee: employee?.full_name ?? "Unknown",
    organization: organization?.name ?? "Unknown org",
    workflow: row.workflow_type,
    carrier: carrier?.name ?? "Unknown carrier",
    plan: row.plan_name,
    status: row.status,
    tone: row.tone,
    due: formatDateLabel(row.due_at),
  };
}

export function mapValidationRule(row) {
  return {
    title: row.title,
    description: row.description,
    impact: row.impact,
    tone: row.tone,
  };
}

export function mapWebhookEvent(row) {
  return {
    id: row.id,
    topic: row.topic,
    destination: row.destination,
    timestamp: formatDateLabel(row.occurred_at),
    status: row.status,
    tone: row.tone,
  };
}

export function mapMappingBacklog(row) {
  return {
    field: row.field_name,
    description: row.description,
    state: row.state,
    tone: row.tone,
  };
}

export function mapRateLimitPolicy(row) {
  const carrier = unwrap(row.insurance_carriers);

  return {
    carrier: carrier?.name ?? "Unknown carrier",
    rule: row.rule_text,
    window: row.window_text,
  };
}

export function mapPerformanceSeries(row) {
  return {
    label: row.label,
    success: row.success_value,
    coverage: row.coverage_value,
  };
}

export function mapCostLever(row) {
  return {
    title: row.title,
    description: row.description,
    value: row.value_text,
  };
}
