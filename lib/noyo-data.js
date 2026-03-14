export const keyMetrics = [
  {
    label: "PEPM Revenue",
    value: "$12.40",
    delta: "+8.2%",
    detail: "Monthly recurring revenue per employee across active tenants.",
    tone: "metric-card-gold",
  },
  {
    label: "Enrollment Success",
    value: "99.3%",
    delta: "+1.1 pts",
    detail: "Validated enrollments reaching carrier confirmation on first pass.",
    tone: "metric-card-blue",
  },
  {
    label: "Carrier Coverage",
    value: "38",
    delta: "5 live in MVP",
    detail: "Connected medical and dental carrier endpoints and file pipelines.",
    tone: "metric-card-green",
  },
  {
    label: "Time To Value",
    value: "18 days",
    delta: "-6 days",
    detail: "Target implementation window for a new mid-market tenant.",
    tone: "metric-card-coral",
  },
];

export const analyticsMetrics = [
  {
    label: "API Uptime",
    value: "99.96%",
    delta: "Last 30 days",
    detail: "Availability across enrollment, webhook, and carrier sync services.",
    tone: "metric-card-blue",
  },
  {
    label: "Error Reduction",
    value: "42%",
    delta: "Quarter over quarter",
    detail: "Exception volume avoided by real-time field validation.",
    tone: "metric-card-green",
  },
  {
    label: "Carrier SLA",
    value: "11m",
    delta: "Median confirmation",
    detail: "Average time from submission to carrier acknowledgement.",
    tone: "metric-card-gold",
  },
  {
    label: "Developer Adoption",
    value: "74%",
    delta: "+12 pts",
    detail: "Tenants actively using API docs, webhooks, or sandbox endpoints.",
    tone: "metric-card-coral",
  },
];

export const platformHighlights = [
  {
    title: "Unified Carrier Gateway",
    description:
      "Single normalized interface across APIs, EDI feeds, CSV drops, and plan variations.",
    badge: "Must-have",
    priorityTone: "pill-strong",
  },
  {
    title: "Real-time Enrollment Engine",
    description:
      "Operational rails for new hire, termination, and life-event processing with instant status updates.",
    badge: "Core MVP",
    priorityTone: "pill-info",
  },
  {
    title: "Multi-tenant Controls",
    description:
      "Tenant-level data isolation, scoped permissions, and org-specific carrier configuration.",
    badge: "Architecture",
    priorityTone: "pill-soft",
  },
  {
    title: "Webhook Automation",
    description:
      "Event delivery for downstream HRIS, payroll, and broker systems.",
    badge: "Platform",
    priorityTone: "pill-gold",
  },
];

export const mvpDeliverables = [
  {
    title: "Carrier connectivity for 3-5 majors",
    description:
      "Start with medical and dental carriers and expose normalized operational state.",
    focus: "Connectivity",
  },
  {
    title: "Basic enrollment workflows",
    description:
      "New hire, termination, and qualifying life event flows form the operational spine.",
    focus: "Workflow",
  },
  {
    title: "Real-time status tracking",
    description:
      "Visibility into validation, submission, carrier acknowledgement, and remediation.",
    focus: "Visibility",
  },
  {
    title: "Developer portal",
    description:
      "Working mock endpoints, key entity definitions, and webhook contracts for integrators.",
    focus: "DX",
  },
];

export const tenants = [
  {
    name: "Northstar Benefits",
    employees: "12,480",
    carriers: 5,
    segment: "Benefits administration",
    status: "Healthy",
    statusTone: "pill-strong",
    successRate: "99.5%",
  },
  {
    name: "Harbor HR Cloud",
    employees: "8,920",
    carriers: 4,
    segment: "HR platform",
    status: "Watchlist",
    statusTone: "pill-gold",
    successRate: "97.8%",
  },
  {
    name: "Anchor Employer Group",
    employees: "4,360",
    carriers: 3,
    segment: "Enterprise employer",
    status: "Scaling",
    statusTone: "pill-info",
    successRate: "98.9%",
  },
];

export const coreFeatures = [
  {
    id: "01",
    title: "Unified Carrier API Gateway",
    description:
      "Single API interface that normalizes data formats and communication protocols across carriers.",
    priority: "Must-have",
    priorityTone: "pill-strong",
    complexity: "High",
  },
  {
    id: "02",
    title: "Real-time Member Enrollment Engine",
    description:
      "Process new hires, terminations, and life events with instant carrier confirmation.",
    priority: "Must-have",
    priorityTone: "pill-strong",
    complexity: "High",
  },
  {
    id: "03",
    title: "Group Setup and Configuration",
    description:
      "Automated onboarding with plan mapping, carrier connectivity, and eligibility rule configuration.",
    priority: "Must-have",
    priorityTone: "pill-strong",
    complexity: "Medium",
  },
  {
    id: "04",
    title: "Employee Demographics Management",
    description:
      "Centralized employee data management with field mapping and validation across carriers.",
    priority: "Must-have",
    priorityTone: "pill-strong",
    complexity: "Medium",
  },
  {
    id: "05",
    title: "Plan and Coverage Administration",
    description:
      "Manage benefit plans, coverage tiers, and enrollment options across carrier relationships.",
    priority: "Must-have",
    priorityTone: "pill-strong",
    complexity: "Medium",
  },
  {
    id: "06",
    title: "Qualifying Life Events",
    description:
      "Handle marriage, birth, adoption, divorce, and other event-triggered changes.",
    priority: "Must-have",
    priorityTone: "pill-strong",
    complexity: "Medium",
  },
  {
    id: "07",
    title: "Data Validation and Error Handling",
    description:
      "Real-time validation with detailed error reporting and resolution workflows.",
    priority: "Must-have",
    priorityTone: "pill-strong",
    complexity: "Medium",
  },
  {
    id: "08",
    title: "Carrier Network Management",
    description:
      "Onboard, configure, and maintain connections to insurance carrier systems and APIs.",
    priority: "Must-have",
    priorityTone: "pill-strong",
    complexity: "High",
  },
];

export const advancedFeatures = [
  {
    title: "AI-powered Enrollment Intelligence",
    description:
      "Predict enrollment issues, optimize plan recommendations, and automate remediation steps.",
    priority: "Innovative",
    priorityTone: "pill-info",
  },
  {
    title: "Predictive Analytics Dashboard",
    description:
      "Model enrollment trends, cost projections, utilization patterns, and carrier quality.",
    priority: "Important",
    priorityTone: "pill-gold",
  },
  {
    title: "Benefits Decision Support",
    description:
      "Use employee profile data to recommend plan combinations and coverage tradeoffs.",
    priority: "Innovative",
    priorityTone: "pill-info",
  },
  {
    title: "Cost Optimization Engine",
    description:
      "Surface savings opportunities across contribution structures and carrier mixes.",
    priority: "Important",
    priorityTone: "pill-gold",
  },
];

export const workflowTracks = [
  {
    name: "New Hire",
    summary: "Fast-path provisioning for first-time enrollment",
    steps: [
      {
        title: "Eligibility sync",
        detail:
          "Pull employee demographics from HRIS and map required carrier fields.",
        tone: "timeline-blue",
      },
      {
        title: "Plan selection",
        detail:
          "Apply plan configuration rules for medical, dental, and dependent coverage.",
        tone: "timeline-green",
      },
      {
        title: "Carrier submission",
        detail:
          "Submit normalized payloads and monitor acknowledgement windows.",
        tone: "timeline-gold",
      },
    ],
  },
  {
    name: "Qualifying Life Event",
    summary: "Rule-driven updates for changes outside open enrollment",
    steps: [
      {
        title: "Document intake",
        detail:
          "Capture event reason, supporting files, and effective-date logic.",
        tone: "timeline-blue",
      },
      {
        title: "Dependent validation",
        detail:
          "Verify eligible dependents and resolve carrier-specific formatting issues.",
        tone: "timeline-coral",
      },
      {
        title: "Coverage refresh",
        detail:
          "Update plan enrollment and trigger webhook notifications to downstream systems.",
        tone: "timeline-green",
      },
    ],
  },
  {
    name: "Termination",
    summary: "Coverage end-state with compliance and audit visibility",
    steps: [
      {
        title: "Event ingest",
        detail:
          "Receive termination signal, effective date, and employer group context.",
        tone: "timeline-blue",
      },
      {
        title: "COBRA check",
        detail:
          "Flag continuation workflows and required notifications where applicable.",
        tone: "timeline-gold",
      },
      {
        title: "Carrier confirmation",
        detail:
          "Confirm termination completion and write to audit log for reconciliation.",
        tone: "timeline-green",
      },
    ],
  },
];

export const enrollmentCases = [
  {
    employee: "Maya Patel",
    organization: "Northstar Benefits",
    workflow: "New hire",
    carrier: "Aetna",
    plan: "PPO Silver",
    status: "Confirmed",
    tone: "pill-strong",
    due: "Today, 14:30",
  },
  {
    employee: "Jordan Lee",
    organization: "Harbor HR Cloud",
    workflow: "QLE",
    carrier: "Guardian",
    plan: "Dental Plus",
    status: "Needs docs",
    tone: "pill-gold",
    due: "Today, 16:00",
  },
  {
    employee: "Ava Johnson",
    organization: "Anchor Employer Group",
    workflow: "Termination",
    carrier: "UnitedHealthcare",
    plan: "Core Medical",
    status: "Queued",
    tone: "pill-info",
    due: "Tomorrow, 10:00",
  },
  {
    employee: "Noah Kim",
    organization: "Northstar Benefits",
    workflow: "New hire",
    carrier: "Delta Dental",
    plan: "Dental Select",
    status: "Validation error",
    tone: "pill-coral",
    due: "Tomorrow, 12:15",
  },
];

export const validationRules = [
  {
    title: "Dependent relationship check",
    description:
      "Rejects unsupported relationship codes before carrier submission.",
    impact: "Prevents rejection",
    tone: "pill-strong",
  },
  {
    title: "Effective date window",
    description:
      "Ensures enrollment dates land inside plan-specific rule boundaries.",
    impact: "Compliance",
    tone: "pill-info",
  },
  {
    title: "Carrier field completeness",
    description:
      "Checks mandatory member identifiers and plan selection payload fields.",
    impact: "Data quality",
    tone: "pill-gold",
  },
  {
    title: "Rate limit safety",
    description:
      "Queues retries when carrier endpoints approach their throughput cap.",
    impact: "Stability",
    tone: "pill-soft",
  },
];

export const webhookEvents = [
  {
    id: "evt_1001",
    topic: "enrollment.updated",
    destination: "Harbor HR Cloud / webhook",
    timestamp: "10:04 AM",
    status: "Delivered",
    tone: "pill-strong",
  },
  {
    id: "evt_1002",
    topic: "carrier.acknowledged",
    destination: "Northstar Benefits / events",
    timestamp: "09:52 AM",
    status: "Retrying",
    tone: "pill-gold",
  },
  {
    id: "evt_1003",
    topic: "validation.failed",
    destination: "Anchor Employer Group / ingest",
    timestamp: "09:18 AM",
    status: "Delivered",
    tone: "pill-info",
  },
];

export const carrierConnections = [
  {
    name: "Aetna",
    segment: "Medical",
    status: "Live",
    tone: "pill-strong",
    description:
      "Primary API-based enrollment connection with confirmation callbacks enabled.",
    plans: "Medical, vision",
    method: "REST + webhook",
    coverage: "Employee + dependent",
    sla: "8 minutes",
  },
  {
    name: "UnitedHealthcare",
    segment: "Medical",
    status: "Pilot",
    tone: "pill-gold",
    description:
      "Hybrid API and nightly reconciliation feed for groups in staged onboarding.",
    plans: "Medical",
    method: "REST + CSV failover",
    coverage: "Employee only",
    sla: "22 minutes",
  },
  {
    name: "Guardian",
    segment: "Dental",
    status: "Live",
    tone: "pill-info",
    description:
      "Dental enrollment path with plan configuration templates and QLE support.",
    plans: "Dental, life",
    method: "REST",
    coverage: "Employee + spouse",
    sla: "12 minutes",
  },
  {
    name: "Delta Dental",
    segment: "Dental",
    status: "Mapping",
    tone: "pill-coral",
    description:
      "Field mapping and plan code normalization still underway for dependent coverage.",
    plans: "Dental",
    method: "EDI 834 + API bridge",
    coverage: "Employee + family",
    sla: "45 minutes",
  },
];

export const mappingBacklog = [
  {
    field: "Subscriber relationship code",
    description:
      "Normalize spouse and domestic partner variants across medical and dental carriers.",
    state: "In progress",
    tone: "pill-gold",
  },
  {
    field: "Benefit effective date",
    description:
      "Support employer-specific waiting period logic before payload generation.",
    state: "Rule update",
    tone: "pill-info",
  },
  {
    field: "Group class mapping",
    description: "Expand plan-class translation for multi-state employer groups.",
    state: "Pending",
    tone: "pill-soft",
  },
];

export const rateLimitPolicies = [
  {
    carrier: "Aetna",
    rule: "Burst submit allowed for 60 requests before queue fallback.",
    window: "1 min window",
  },
  {
    carrier: "Guardian",
    rule: "Retry with jitter and cap at three attempts for event callbacks.",
    window: "5 min window",
  },
  {
    carrier: "UnitedHealthcare",
    rule: "Throttle concurrent member lookups during reconciliation runs.",
    window: "15 min window",
  },
];

export const performanceSeries = [
  { label: "Jan", success: 72, coverage: 40 },
  { label: "Feb", success: 78, coverage: 48 },
  { label: "Mar", success: 80, coverage: 54 },
  { label: "Apr", success: 84, coverage: 61 },
  { label: "May", success: 89, coverage: 68 },
  { label: "Jun", success: 93, coverage: 72 },
];

export const costLevers = [
  {
    title: "Plan utilization shaping",
    description:
      "Recommend cheaper high-fit plan mixes using enrollment history and claims proxies.",
    value: "6.8% savings",
  },
  {
    title: "Carrier mix rebalancing",
    description:
      "Shift employers away from low-performing carriers with slower acknowledgement times.",
    value: "11 day faster setup",
  },
  {
    title: "Automated exception routing",
    description:
      "Reduce manual operations load by routing issues to the correct owner on first touch.",
    value: "31% less triage",
  },
];

export const goToMarketNotes = [
  "Target mid-market benefits administration platforms first",
  "Use developer experience as the wedge for viral adoption",
  "Build carrier pilot programs early",
  "Partner with brokers and benefits consultants for distribution",
  "Emphasize faster decision cycles than enterprise incumbents",
];

export const apiEndpointGroups = [
  "/auth",
  "/organizations",
  "/employees",
  "/enrollments",
  "/carriers",
  "/plans",
  "/life-events",
  "/reconciliation",
  "/webhooks",
  "/reports",
  "/audit",
  "/config",
  "/workflows",
  "/analytics",
  "/billing",
];

export const keyEntities = [
  "Organizations",
  "Employees",
  "Dependents",
  "Insurance_Carriers",
  "Benefit_Plans",
  "Enrollments",
  "Life_Events",
  "API_Connections",
  "Data_Mappings",
  "Audit_Logs",
  "Reconciliation_Records",
  "Webhooks",
  "User_Accounts",
  "Permissions",
  "Billing_Records",
  "Compliance_Reports",
  "Error_Logs",
  "Plan_Configurations",
  "Eligibility_Rules",
  "Workflow_Templates",
];

export const monetization = [
  "PEPM subscription pricing",
  "Transaction fees for enrollment changes",
  "Tiered pricing by carrier count",
  "Enterprise licensing",
  "Revenue sharing with carriers",
  "Premium analytics packages",
  "Professional services",
  "Marketplace fees for partner integrations",
  "White-label licensing",
  "Usage-based API pricing",
];

export const apiSample = `{
  "queue": [
    {
      "employee": "Maya Patel",
      "organization": "Northstar Benefits",
      "workflow": "New hire",
      "carrier": "Aetna",
      "plan": "PPO Silver",
      "status": "Confirmed",
      "due": "Today, 14:30"
    }
  ],
  "workflows": [
    {
      "name": "New Hire",
      "steps": ["Eligibility sync", "Plan selection", "Carrier submission"]
    }
  ]
}`;

export const webhookSample = `{
  "id": "evt_1002",
  "topic": "carrier.acknowledged",
  "tenant": "northstar_benefits",
  "status": "retrying",
  "attempt": 2,
  "payload": {
    "employee_id": "emp_2491",
    "carrier": "Aetna",
    "coverage_effective_on": "2026-03-14"
  }
}`;
