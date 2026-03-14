export const organizationSetupTracks = [
  {
    organization: "Northstar Benefits",
    owner: "Implementation lead",
    status: "Configured",
    tone: "pill-strong",
    milestone: "3 carrier APIs, eligibility rules, webhook destinations",
  },
  {
    organization: "Harbor HR Cloud",
    owner: "Solutions architect",
    status: "In review",
    tone: "pill-gold",
    milestone: "Delta Dental mapping, payroll sync, SSO handoff",
  },
  {
    organization: "Anchor Employer Group",
    owner: "Customer success",
    status: "Live pilot",
    tone: "pill-info",
    milestone: "Medical + dental launch, open enrollment cutover",
  },
];

export const eligibilityRulesCatalog = [
  {
    organization: "Northstar Benefits",
    name: "Waiting period eligibility",
    appliesTo: "Medical",
    logic: "First of month after 30 days",
    status: "Active",
    tone: "pill-strong",
  },
  {
    organization: "Harbor HR Cloud",
    name: "Dependent age-out",
    appliesTo: "Dental",
    logic: "Coverage until age 26",
    status: "Active",
    tone: "pill-info",
  },
  {
    organization: "Anchor Employer Group",
    name: "Class-based coverage",
    appliesTo: "Executive tier",
    logic: "Platinum PPO only",
    status: "Needs review",
    tone: "pill-gold",
  },
];

export const accessRoles = [
  {
    role: "Owner",
    access: "Tenant config, billing, carrier credentials, exports, auth controls",
    scope: "Global",
  },
  {
    role: "Operations admin",
    access: "Enrollments, life events, reconciliation, reports, webhooks",
    scope: "Org",
  },
  {
    role: "Support analyst",
    access: "Read-only audit, errors, status tracking, workflow execution",
    scope: "Org",
  },
];

export const employeeRoster = [
  {
    name: "Maya Patel",
    organization: "Northstar Benefits",
    className: "Full-time",
    status: "Synced",
    tone: "pill-strong",
    coverage: "Employee + spouse",
    syncState: "Carrier + HRIS aligned",
  },
  {
    name: "Jordan Lee",
    organization: "Harbor HR Cloud",
    className: "Full-time",
    status: "Pending docs",
    tone: "pill-gold",
    coverage: "Employee only",
    syncState: "QLE intake open",
  },
  {
    name: "Ava Johnson",
    organization: "Anchor Employer Group",
    className: "Executive",
    status: "Terminating",
    tone: "pill-info",
    coverage: "Employee + family",
    syncState: "COBRA check in progress",
  },
  {
    name: "Noah Kim",
    organization: "Northstar Benefits",
    className: "Full-time",
    status: "Validation error",
    tone: "pill-coral",
    coverage: "Employee + child",
    syncState: "Dependent verification needed",
  },
];

export const dependentRoster = [
  {
    employee: "Maya Patel",
    dependent: "Riya Patel",
    relationship: "Spouse",
    status: "Verified",
    tone: "pill-strong",
    coverage: "Medical + dental",
  },
  {
    employee: "Noah Kim",
    dependent: "Ethan Kim",
    relationship: "Child",
    status: "Needs records",
    tone: "pill-gold",
    coverage: "Dental",
  },
  {
    employee: "Ava Johnson",
    dependent: "Sasha Johnson",
    relationship: "Child",
    status: "Pending COBRA",
    tone: "pill-info",
    coverage: "Medical",
  },
];

export const demographicCoverage = [
  {
    title: "Carrier field completeness",
    description:
      "92% of mapped employee demographic fields are normalized across all live carriers.",
    value: "92%",
  },
  {
    title: "HRIS sync freshness",
    description: "Employee records are refreshed every 12 minutes through event-driven sync.",
    value: "12 min",
  },
  {
    title: "Dependent verification backlog",
    description: "Three dependent records need documents before carrier acceptance.",
    value: "3 cases",
  },
];

export const benefitPlans = [
  {
    organization: "Northstar Benefits",
    carrier: "Aetna",
    name: "PPO Silver",
    category: "Medical",
    coverageLevel: "Employee + spouse",
    premium: "$642/mo",
    status: "Open",
    tone: "pill-strong",
  },
  {
    organization: "Northstar Benefits",
    carrier: "Delta Dental",
    name: "Dental Select",
    category: "Dental",
    coverageLevel: "Employee + child",
    premium: "$78/mo",
    status: "Mapped",
    tone: "pill-info",
  },
  {
    organization: "Anchor Employer Group",
    carrier: "UnitedHealthcare",
    name: "Executive Platinum",
    category: "Medical",
    coverageLevel: "Employee + family",
    premium: "$1,280/mo",
    status: "Pilot",
    tone: "pill-gold",
  },
];

export const planConfigurationsCatalog = [
  {
    organization: "Northstar Benefits",
    configuration: "2026 medical lineup",
    funding: "Fully insured",
    planYear: "2026",
    status: "Published",
    tone: "pill-strong",
  },
  {
    organization: "Harbor HR Cloud",
    configuration: "Dental migration",
    funding: "Voluntary",
    planYear: "2026",
    status: "Review",
    tone: "pill-gold",
  },
  {
    organization: "Anchor Employer Group",
    configuration: "Executive carve-out",
    funding: "Level funded",
    planYear: "2026",
    status: "Draft",
    tone: "pill-soft",
  },
];

export const decisionSupportCards = [
  {
    employee: "Maya Patel",
    recommendation: "Keep PPO Silver, shift dental to Select",
    savings: "$38/mo",
    confidence: "94%",
  },
  {
    employee: "Jordan Lee",
    recommendation: "Delay dependent add until verification completes",
    savings: "$0",
    confidence: "89%",
  },
  {
    employee: "Ava Johnson",
    recommendation: "Trigger COBRA communication and stop payroll deduction",
    savings: "$1,280/mo",
    confidence: "97%",
  },
];

export const lifeEventCases = [
  {
    employee: "Jordan Lee",
    organization: "Harbor HR Cloud",
    eventType: "Marriage",
    verification: "Needs certificate",
    cobra: "Not applicable",
    status: "Pending documents",
    tone: "pill-gold",
    effectiveOn: "Mar 22",
  },
  {
    employee: "Ava Johnson",
    organization: "Anchor Employer Group",
    eventType: "Termination",
    verification: "Verified",
    cobra: "Notice queued",
    status: "Processing",
    tone: "pill-info",
    effectiveOn: "Mar 31",
  },
  {
    employee: "Noah Kim",
    organization: "Northstar Benefits",
    eventType: "Birth",
    verification: "Pending dependent docs",
    cobra: "Not applicable",
    status: "Open",
    tone: "pill-coral",
    effectiveOn: "Apr 1",
  },
];

export const communicationQueue = [
  {
    template: "Enrollment confirmation",
    channel: "Email",
    audience: "Confirmed new hires",
    status: "Sending",
    tone: "pill-info",
  },
  {
    template: "COBRA notice",
    channel: "Postal + email",
    audience: "Terminated employees",
    status: "Queued",
    tone: "pill-gold",
  },
  {
    template: "Dependent verification",
    channel: "Email",
    audience: "Open QLEs",
    status: "Live",
    tone: "pill-strong",
  },
];

export const workflowAutomationTemplates = [
  {
    name: "New hire medical + dental",
    currentStep: "Carrier submission",
    owner: "Ops automation",
    status: "Live",
    tone: "pill-strong",
  },
  {
    name: "Marriage QLE review chain",
    currentStep: "Document verification",
    owner: "Benefits support",
    status: "Active",
    tone: "pill-info",
  },
  {
    name: "Termination and COBRA handoff",
    currentStep: "Compliance delivery",
    owner: "CS operations",
    status: "Monitored",
    tone: "pill-gold",
  },
];

export const apiConnections = [
  {
    carrier: "Aetna",
    environment: "Production",
    authMode: "OAuth2 client credentials",
    syncStatus: "Healthy",
    tone: "pill-strong",
    fileSupport: "API + webhook",
  },
  {
    carrier: "UnitedHealthcare",
    environment: "Pilot",
    authMode: "Bearer token",
    syncStatus: "Rate limited",
    tone: "pill-gold",
    fileSupport: "API + CSV failover",
  },
  {
    carrier: "Delta Dental",
    environment: "Mapping",
    authMode: "EDI bridge",
    syncStatus: "Configuring",
    tone: "pill-info",
    fileSupport: "EDI 834 + API bridge",
  },
];

export const fileIntegrationQueue = [
  {
    partner: "Delta Dental",
    format: "EDI 834",
    status: "Translating",
    tone: "pill-info",
    note: "Normalization layer converts family tier codes before submit.",
  },
  {
    partner: "UnitedHealthcare",
    format: "CSV backup feed",
    status: "Ready",
    tone: "pill-strong",
    note: "Fallback feed scheduled nightly at 01:30 UTC.",
  },
];

export const reconciliationRecords = [
  {
    organization: "Northstar Benefits",
    carrier: "Aetna",
    discrepancies: 1,
    status: "Review",
    tone: "pill-gold",
    lastRun: "Mar 14, 09:42",
  },
  {
    organization: "Harbor HR Cloud",
    carrier: "Guardian",
    discrepancies: 0,
    status: "Clean",
    tone: "pill-strong",
    lastRun: "Mar 14, 09:10",
  },
  {
    organization: "Anchor Employer Group",
    carrier: "UnitedHealthcare",
    discrepancies: 3,
    status: "Escalated",
    tone: "pill-coral",
    lastRun: "Mar 14, 08:55",
  },
];

export const auditTrailEntries = [
  {
    actor: "Noyo Admin",
    action: "Updated webhook subscription",
    entity: "Northstar Benefits",
    timestamp: "Mar 14, 10:12",
  },
  {
    actor: "Benefits support",
    action: "Approved marriage QLE",
    entity: "Jordan Lee",
    timestamp: "Mar 14, 09:47",
  },
  {
    actor: "Automation worker",
    action: "Submitted enrollment payload",
    entity: "Maya Patel",
    timestamp: "Mar 14, 09:31",
  },
];

export const errorLogEntries = [
  {
    severity: "High",
    source: "Delta Dental mapping",
    message: "Dependent relationship code mismatch on child enrollment.",
    resolution: "Waiting on mapping update",
    tone: "pill-coral",
  },
  {
    severity: "Medium",
    source: "UnitedHealthcare API",
    message: "Carrier acknowledgement exceeded threshold by 11 minutes.",
    resolution: "Retry policy active",
    tone: "pill-gold",
  },
  {
    severity: "Low",
    source: "Webhook delivery",
    message: "One retry required for enrollment.updated event.",
    resolution: "Resolved",
    tone: "pill-info",
  },
];

export const complianceReports = [
  {
    organization: "Anchor Employer Group",
    report: "COBRA notice register",
    dueDate: "Mar 18",
    status: "Due soon",
    tone: "pill-gold",
  },
  {
    organization: "Northstar Benefits",
    report: "ACA monthly snapshot",
    dueDate: "Mar 25",
    status: "In progress",
    tone: "pill-info",
  },
  {
    organization: "Harbor HR Cloud",
    report: "ERISA distribution log",
    dueDate: "Apr 1",
    status: "Ready",
    tone: "pill-strong",
  },
];

export const dataExportJobs = [
  {
    organization: "Northstar Benefits",
    format: "CSV",
    destination: "S3 archive",
    status: "Completed",
    tone: "pill-strong",
  },
  {
    organization: "Harbor HR Cloud",
    format: "JSON",
    destination: "Partner API",
    status: "Queued",
    tone: "pill-gold",
  },
  {
    organization: "Anchor Employer Group",
    format: "XLSX",
    destination: "Finance mailbox",
    status: "Running",
    tone: "pill-info",
  },
];

export const billingRecords = [
  {
    organization: "Northstar Benefits",
    period: "Mar 2026",
    model: "PEPM + API usage",
    amount: "$18,420",
    status: "Paid",
    tone: "pill-strong",
  },
  {
    organization: "Harbor HR Cloud",
    period: "Mar 2026",
    model: "Enterprise pilot",
    amount: "$12,800",
    status: "Pending",
    tone: "pill-gold",
  },
  {
    organization: "Anchor Employer Group",
    period: "Mar 2026",
    model: "PEPM",
    amount: "$6,240",
    status: "Draft",
    tone: "pill-info",
  },
];

export const webhookSubscriptions = [
  {
    organization: "Northstar Benefits",
    endpoint: "https://northstar.example/events",
    events: "enrollment.updated, carrier.acknowledged",
    status: "Active",
    tone: "pill-strong",
  },
  {
    organization: "Harbor HR Cloud",
    endpoint: "https://harbor.example/benefits-webhook",
    events: "validation.failed, enrollment.updated",
    status: "Retry policy",
    tone: "pill-gold",
  },
];

export const marketplaceIntegrations = [
  {
    organization: "Northstar Benefits",
    provider: "Voluntary Marketplace X",
    category: "Voluntary benefits",
    status: "Connected",
    tone: "pill-strong",
  },
  {
    organization: "Harbor HR Cloud",
    provider: "Broker Sync Hub",
    category: "Broker distribution",
    status: "Pilot",
    tone: "pill-info",
  },
];

export const localizationSettings = [
  {
    organization: "Northstar Benefits",
    locale: "en-US",
    currency: "USD",
    mobileSync: "Enabled",
    offlineMode: "Disabled",
  },
  {
    organization: "Anchor Employer Group",
    locale: "en-US",
    currency: "USD",
    mobileSync: "Enabled",
    offlineMode: "Enabled",
  },
];

export const implementationModules = [
  {
    module: "Organizations and tenant setup",
    route: "/organizations",
    coverage: "Group setup, eligibility rules, access model, onboarding progress",
  },
  {
    module: "Employees and dependents",
    route: "/employees",
    coverage: "Demographics, dependents, sync quality, decision support",
  },
  {
    module: "Plans and coverage",
    route: "/plans",
    coverage: "Benefit plans, plan config, coverage design, open enrollment support",
  },
  {
    module: "Life events",
    route: "/life-events",
    coverage: "QLE processing, COBRA, comms queue, verification tracking",
  },
  {
    module: "Workflow automation",
    route: "/workflows",
    coverage: "Templates, step tracking, file-based integration support",
  },
  {
    module: "Reconciliation and audit",
    route: "/reconciliation",
    coverage: "Discrepancies, audit logs, error handling, resolution state",
  },
  {
    module: "Reports and compliance",
    route: "/reports",
    coverage: "Exports, compliance deadlines, reporting jobs",
  },
  {
    module: "Billing and monetization",
    route: "/billing",
    coverage: "PEPM billing, enterprise pricing, invoice states",
  },
  {
    module: "Settings and integrations",
    route: "/settings",
    coverage: "Webhooks, marketplace connections, localization, mobile settings",
  },
];
