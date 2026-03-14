begin;
delete from public.localization_settings;
delete from public.marketplace_integrations;
delete from public.webhook_subscriptions;
delete from public.billing_records;
delete from public.data_export_jobs;
delete from public.compliance_reports;
delete from public.error_logs;
delete from public.audit_logs;
delete from public.reconciliation_records;
delete from public.workflow_runs;
delete from public.benefits_communications;
delete from public.life_events;
delete from public.plan_configurations;
delete from public.benefit_plans;
delete from public.file_integrations;
delete from public.api_connections;
delete from public.decision_support_recommendations;
delete from public.dependents;
delete from public.eligibility_rules;
delete from public.organization_setup_tracks;

delete from public.webhook_events;
delete from public.enrollments;
delete from public.employees;
delete from public.workflow_steps;
delete from public.workflow_templates;
delete from public.validation_rules;
delete from public.data_mapping_backlog;
delete from public.carrier_rate_limits;
delete from public.insurance_carriers;
delete from public.platform_metrics;
delete from public.performance_series;
delete from public.cost_optimization_levers;
delete from public.go_to_market_notes;
delete from public.api_endpoint_groups;
delete from public.entity_catalog;
delete from public.organization_members;
delete from public.organizations;

insert into public.organizations (
  name,
  slug,
  segment,
  employees_count,
  carriers_count,
  status,
  status_tone,
  success_rate
) values
  ('Northstar Benefits', 'northstar-benefits', 'Benefits administration', 12480, 5, 'Healthy', 'pill-strong', 99.5),
  ('Harbor HR Cloud', 'harbor-hr-cloud', 'HR platform', 8920, 4, 'Watchlist', 'pill-gold', 97.8),
  ('Anchor Employer Group', 'anchor-employer-group', 'Enterprise employer', 4360, 3, 'Scaling', 'pill-info', 98.9)
on conflict (slug) do update
set
  name = excluded.name,
  segment = excluded.segment,
  employees_count = excluded.employees_count,
  carriers_count = excluded.carriers_count,
  status = excluded.status,
  status_tone = excluded.status_tone,
  success_rate = excluded.success_rate;

insert into public.insurance_carriers (
  name,
  slug,
  segment,
  status,
  tone,
  description,
  plans,
  method,
  coverage,
  sla_minutes
) values
  ('Aetna', 'aetna', 'Medical', 'Live', 'pill-strong', 'Primary API-based enrollment connection with confirmation callbacks enabled.', 'Medical, vision', 'REST + webhook', 'Employee + dependent', 8),
  ('UnitedHealthcare', 'unitedhealthcare', 'Medical', 'Pilot', 'pill-gold', 'Hybrid API and nightly reconciliation feed for groups in staged onboarding.', 'Medical', 'REST + CSV failover', 'Employee only', 22),
  ('Guardian', 'guardian', 'Dental', 'Live', 'pill-info', 'Dental enrollment path with plan configuration templates and QLE support.', 'Dental, life', 'REST', 'Employee + spouse', 12),
  ('Delta Dental', 'delta-dental', 'Dental', 'Mapping', 'pill-coral', 'Field mapping and plan code normalization still underway for dependent coverage.', 'Dental', 'EDI 834 + API bridge', 'Employee + family', 45)
on conflict (slug) do update
set
  name = excluded.name,
  segment = excluded.segment,
  status = excluded.status,
  tone = excluded.tone,
  description = excluded.description,
  plans = excluded.plans,
  method = excluded.method,
  coverage = excluded.coverage,
  sla_minutes = excluded.sla_minutes;

insert into public.workflow_templates (slug, name, summary, sort_order) values
  ('new-hire', 'New Hire', 'Fast-path provisioning for first-time enrollment', 1),
  ('qualifying-life-event', 'Qualifying Life Event', 'Rule-driven updates for changes outside open enrollment', 2),
  ('termination', 'Termination', 'Coverage end-state with compliance and audit visibility', 3)
on conflict (slug) do update
set
  name = excluded.name,
  summary = excluded.summary,
  sort_order = excluded.sort_order;

insert into public.workflow_steps (workflow_id, title, detail, tone, sort_order)
select id, 'Eligibility sync', 'Pull employee demographics from HRIS and map required carrier fields.', 'timeline-blue', 1
from public.workflow_templates where slug = 'new-hire'
union all
select id, 'Plan selection', 'Apply plan configuration rules for medical, dental, and dependent coverage.', 'timeline-green', 2
from public.workflow_templates where slug = 'new-hire'
union all
select id, 'Carrier submission', 'Submit normalized payloads and monitor acknowledgement windows.', 'timeline-gold', 3
from public.workflow_templates where slug = 'new-hire'
union all
select id, 'Document intake', 'Capture event reason, supporting files, and effective-date logic.', 'timeline-blue', 1
from public.workflow_templates where slug = 'qualifying-life-event'
union all
select id, 'Dependent validation', 'Verify eligible dependents and resolve carrier-specific formatting issues.', 'timeline-coral', 2
from public.workflow_templates where slug = 'qualifying-life-event'
union all
select id, 'Coverage refresh', 'Update plan enrollment and trigger webhook notifications to downstream systems.', 'timeline-green', 3
from public.workflow_templates where slug = 'qualifying-life-event'
union all
select id, 'Event ingest', 'Receive termination signal, effective date, and employer group context.', 'timeline-blue', 1
from public.workflow_templates where slug = 'termination'
union all
select id, 'COBRA check', 'Flag continuation workflows and required notifications where applicable.', 'timeline-gold', 2
from public.workflow_templates where slug = 'termination'
union all
select id, 'Carrier confirmation', 'Confirm termination completion and write to audit log for reconciliation.', 'timeline-green', 3
from public.workflow_templates where slug = 'termination';

insert into public.employees (organization_id, full_name, work_email)
select id, 'Maya Patel', 'maya.patel@northstar.example'
from public.organizations where slug = 'northstar-benefits'
union all
select id, 'Jordan Lee', 'jordan.lee@harbor.example'
from public.organizations where slug = 'harbor-hr-cloud'
union all
select id, 'Ava Johnson', 'ava.johnson@anchor.example'
from public.organizations where slug = 'anchor-employer-group'
union all
select id, 'Noah Kim', 'noah.kim@northstar.example'
from public.organizations where slug = 'northstar-benefits';

insert into public.enrollments (
  organization_id,
  employee_id,
  carrier_id,
  workflow_type,
  plan_name,
  status,
  tone,
  due_at
)
select
  org.id,
  emp.id,
  car.id,
  'New hire',
  'PPO Silver',
  'Confirmed',
  'pill-strong',
  '2026-03-14T14:30:00+05:30'::timestamptz
from public.organizations org
join public.employees emp on emp.organization_id = org.id and emp.work_email = 'maya.patel@northstar.example'
join public.insurance_carriers car on car.slug = 'aetna'
where org.slug = 'northstar-benefits'
union all
select
  org.id,
  emp.id,
  car.id,
  'QLE',
  'Dental Plus',
  'Needs docs',
  'pill-gold',
  '2026-03-14T16:00:00+05:30'::timestamptz
from public.organizations org
join public.employees emp on emp.organization_id = org.id and emp.work_email = 'jordan.lee@harbor.example'
join public.insurance_carriers car on car.slug = 'guardian'
where org.slug = 'harbor-hr-cloud'
union all
select
  org.id,
  emp.id,
  car.id,
  'Termination',
  'Core Medical',
  'Queued',
  'pill-info',
  '2026-03-15T10:00:00+05:30'::timestamptz
from public.organizations org
join public.employees emp on emp.organization_id = org.id and emp.work_email = 'ava.johnson@anchor.example'
join public.insurance_carriers car on car.slug = 'unitedhealthcare'
where org.slug = 'anchor-employer-group'
union all
select
  org.id,
  emp.id,
  car.id,
  'New hire',
  'Dental Select',
  'Validation error',
  'pill-coral',
  '2026-03-15T12:15:00+05:30'::timestamptz
from public.organizations org
join public.employees emp on emp.organization_id = org.id and emp.work_email = 'noah.kim@northstar.example'
join public.insurance_carriers car on car.slug = 'delta-dental'
where org.slug = 'northstar-benefits';

insert into public.validation_rules (title, description, impact, tone, sort_order) values
  ('Dependent relationship check', 'Rejects unsupported relationship codes before carrier submission.', 'Prevents rejection', 'pill-strong', 1),
  ('Effective date window', 'Ensures enrollment dates land inside plan-specific rule boundaries.', 'Compliance', 'pill-info', 2),
  ('Carrier field completeness', 'Checks mandatory member identifiers and plan selection payload fields.', 'Data quality', 'pill-gold', 3),
  ('Rate limit safety', 'Queues retries when carrier endpoints approach their throughput cap.', 'Stability', 'pill-soft', 4);

insert into public.webhook_events (organization_id, topic, destination, status, tone, occurred_at)
select id, 'enrollment.updated', 'Harbor HR Cloud / webhook', 'Delivered', 'pill-strong', '2026-03-14T10:04:00+05:30'::timestamptz
from public.organizations where slug = 'harbor-hr-cloud'
union all
select id, 'carrier.acknowledged', 'Northstar Benefits / events', 'Retrying', 'pill-gold', '2026-03-14T09:52:00+05:30'::timestamptz
from public.organizations where slug = 'northstar-benefits'
union all
select id, 'validation.failed', 'Anchor Employer Group / ingest', 'Delivered', 'pill-info', '2026-03-14T09:18:00+05:30'::timestamptz
from public.organizations where slug = 'anchor-employer-group';

insert into public.data_mapping_backlog (field_name, description, state, tone, sort_order) values
  ('Subscriber relationship code', 'Normalize spouse and domestic partner variants across medical and dental carriers.', 'In progress', 'pill-gold', 1),
  ('Benefit effective date', 'Support employer-specific waiting period logic before payload generation.', 'Rule update', 'pill-info', 2),
  ('Group class mapping', 'Expand plan-class translation for multi-state employer groups.', 'Pending', 'pill-soft', 3);

insert into public.carrier_rate_limits (carrier_id, rule_text, window_text, sort_order)
select id, 'Burst submit allowed for 60 requests before queue fallback.', '1 min window', 1
from public.insurance_carriers where slug = 'aetna'
union all
select id, 'Retry with jitter and cap at three attempts for event callbacks.', '5 min window', 2
from public.insurance_carriers where slug = 'guardian'
union all
select id, 'Throttle concurrent member lookups during reconciliation runs.', '15 min window', 3
from public.insurance_carriers where slug = 'unitedhealthcare';

insert into public.platform_metrics (metric_group, label, value_text, delta_text, detail, tone, sort_order) values
  ('overview', 'PEPM Revenue', '$12.40', '+8.2%', 'Monthly recurring revenue per employee across active tenants.', 'metric-card-gold', 1),
  ('overview', 'Enrollment Success', '99.3%', '+1.1 pts', 'Validated enrollments reaching carrier confirmation on first pass.', 'metric-card-blue', 2),
  ('overview', 'Carrier Coverage', '38', '5 live in MVP', 'Connected medical and dental carrier endpoints and file pipelines.', 'metric-card-green', 3),
  ('overview', 'Time To Value', '18 days', '-6 days', 'Target implementation window for a new mid-market tenant.', 'metric-card-coral', 4),
  ('analytics', 'API Uptime', '99.96%', 'Last 30 days', 'Availability across enrollment, webhook, and carrier sync services.', 'metric-card-blue', 1),
  ('analytics', 'Error Reduction', '42%', 'Quarter over quarter', 'Exception volume avoided by real-time field validation.', 'metric-card-green', 2),
  ('analytics', 'Carrier SLA', '11m', 'Median confirmation', 'Average time from submission to carrier acknowledgement.', 'metric-card-gold', 3),
  ('analytics', 'Developer Adoption', '74%', '+12 pts', 'Tenants actively using API docs, webhooks, or sandbox endpoints.', 'metric-card-coral', 4);

insert into public.performance_series (label, success_value, coverage_value, sort_order) values
  ('Jan', 72, 40, 1),
  ('Feb', 78, 48, 2),
  ('Mar', 80, 54, 3),
  ('Apr', 84, 61, 4),
  ('May', 89, 68, 5),
  ('Jun', 93, 72, 6);

insert into public.cost_optimization_levers (title, description, value_text, sort_order) values
  ('Plan utilization shaping', 'Recommend cheaper high-fit plan mixes using enrollment history and claims proxies.', '6.8% savings', 1),
  ('Carrier mix rebalancing', 'Shift employers away from low-performing carriers with slower acknowledgement times.', '11 day faster setup', 2),
  ('Automated exception routing', 'Reduce manual operations load by routing issues to the correct owner on first touch.', '31% less triage', 3);

insert into public.go_to_market_notes (note, sort_order) values
  ('Target mid-market benefits administration platforms first', 1),
  ('Use developer experience as the wedge for viral adoption', 2),
  ('Build carrier pilot programs early', 3),
  ('Partner with brokers and benefits consultants for distribution', 4),
  ('Emphasize faster decision cycles than enterprise incumbents', 5);

insert into public.api_endpoint_groups (path, sort_order) values
  ('/auth', 1),
  ('/organizations', 2),
  ('/employees', 3),
  ('/enrollments', 4),
  ('/carriers', 5),
  ('/plans', 6),
  ('/life-events', 7),
  ('/reconciliation', 8),
  ('/webhooks', 9),
  ('/reports', 10),
  ('/audit', 11),
  ('/config', 12),
  ('/workflows', 13),
  ('/analytics', 14),
  ('/billing', 15);

insert into public.entity_catalog (name, sort_order) values
  ('Organizations', 1),
  ('Employees', 2),
  ('Dependents', 3),
  ('Insurance_Carriers', 4),
  ('Benefit_Plans', 5),
  ('Enrollments', 6),
  ('Life_Events', 7),
  ('API_Connections', 8),
  ('Data_Mappings', 9),
  ('Audit_Logs', 10),
  ('Reconciliation_Records', 11),
  ('Webhooks', 12),
  ('User_Accounts', 13),
  ('Permissions', 14),
  ('Billing_Records', 15),
  ('Compliance_Reports', 16),
  ('Error_Logs', 17),
  ('Plan_Configurations', 18),
  ('Eligibility_Rules', 19),
  ('Workflow_Templates', 20);

update public.employees
set employment_class = 'Full-time',
    status = 'Synced',
    tone = 'pill-strong',
    coverage = 'Employee + spouse',
    sync_state = 'Carrier + HRIS aligned'
where work_email = 'maya.patel@northstar.example';

update public.employees
set employment_class = 'Full-time',
    status = 'Pending docs',
    tone = 'pill-gold',
    coverage = 'Employee only',
    sync_state = 'QLE intake open'
where work_email = 'jordan.lee@harbor.example';

update public.employees
set employment_class = 'Executive',
    status = 'Terminating',
    tone = 'pill-info',
    coverage = 'Employee + family',
    sync_state = 'COBRA check in progress'
where work_email = 'ava.johnson@anchor.example';

update public.employees
set employment_class = 'Full-time',
    status = 'Validation error',
    tone = 'pill-coral',
    coverage = 'Employee + child',
    sync_state = 'Dependent verification needed'
where work_email = 'noah.kim@northstar.example';

insert into public.organization_setup_tracks (organization_name, owner_name, status, tone, milestone, sort_order) values
  ('Northstar Benefits', 'Implementation lead', 'Configured', 'pill-strong', '3 carrier APIs, eligibility rules, webhook destinations', 1),
  ('Harbor HR Cloud', 'Solutions architect', 'In review', 'pill-gold', 'Delta Dental mapping, payroll sync, SSO handoff', 2),
  ('Anchor Employer Group', 'Customer success', 'Live pilot', 'pill-info', 'Medical + dental launch, open enrollment cutover', 3);

insert into public.eligibility_rules (organization_name, rule_name, applies_to, logic_summary, status, tone, sort_order) values
  ('Northstar Benefits', 'Waiting period eligibility', 'Medical', 'First of month after 30 days', 'Active', 'pill-strong', 1),
  ('Harbor HR Cloud', 'Dependent age-out', 'Dental', 'Coverage until age 26', 'Active', 'pill-info', 2),
  ('Anchor Employer Group', 'Class-based coverage', 'Executive tier', 'Platinum PPO only', 'Needs review', 'pill-gold', 3);

insert into public.dependents (employee_id, full_name, relationship, status, tone, coverage)
select id, 'Riya Patel', 'Spouse', 'Verified', 'pill-strong', 'Medical + dental'
from public.employees where work_email = 'maya.patel@northstar.example'
union all
select id, 'Ethan Kim', 'Child', 'Needs records', 'pill-gold', 'Dental'
from public.employees where work_email = 'noah.kim@northstar.example'
union all
select id, 'Sasha Johnson', 'Child', 'Pending COBRA', 'pill-info', 'Medical'
from public.employees where work_email = 'ava.johnson@anchor.example';

insert into public.decision_support_recommendations (employee_name, recommendation, savings_text, confidence_text, sort_order) values
  ('Maya Patel', 'Keep PPO Silver, shift dental to Select', '$38/mo', '94%', 1),
  ('Jordan Lee', 'Delay dependent add until verification completes', '$0', '89%', 2),
  ('Ava Johnson', 'Trigger COBRA communication and stop payroll deduction', '$1,280/mo', '97%', 3);

insert into public.api_connections (carrier_name, environment, auth_mode, sync_status, tone, file_support, sort_order) values
  ('Aetna', 'Production', 'OAuth2 client credentials', 'Healthy', 'pill-strong', 'API + webhook', 1),
  ('UnitedHealthcare', 'Pilot', 'Bearer token', 'Rate limited', 'pill-gold', 'API + CSV failover', 2),
  ('Delta Dental', 'Mapping', 'EDI bridge', 'Configuring', 'pill-info', 'EDI 834 + API bridge', 3);

insert into public.file_integrations (partner_name, file_format, status, tone, note, sort_order) values
  ('Delta Dental', 'EDI 834', 'Translating', 'pill-info', 'Normalization layer converts family tier codes before submit.', 1),
  ('UnitedHealthcare', 'CSV backup feed', 'Ready', 'pill-strong', 'Fallback feed scheduled nightly at 01:30 UTC.', 2);

insert into public.benefit_plans (organization_name, carrier_name, plan_name, category, coverage_level, premium_text, status, tone, sort_order) values
  ('Northstar Benefits', 'Aetna', 'PPO Silver', 'Medical', 'Employee + spouse', '$642/mo', 'Open', 'pill-strong', 1),
  ('Northstar Benefits', 'Delta Dental', 'Dental Select', 'Dental', 'Employee + child', '$78/mo', 'Mapped', 'pill-info', 2),
  ('Anchor Employer Group', 'UnitedHealthcare', 'Executive Platinum', 'Medical', 'Employee + family', '$1,280/mo', 'Pilot', 'pill-gold', 3);

insert into public.plan_configurations (organization_name, configuration_name, funding_strategy, plan_year, status, tone, sort_order) values
  ('Northstar Benefits', '2026 medical lineup', 'Fully insured', '2026', 'Published', 'pill-strong', 1),
  ('Harbor HR Cloud', 'Dental migration', 'Voluntary', '2026', 'Review', 'pill-gold', 2),
  ('Anchor Employer Group', 'Executive carve-out', 'Level funded', '2026', 'Draft', 'pill-soft', 3);

insert into public.life_events (employee_name, organization_name, event_type, verification_status, cobra_status, status, tone, effective_on, sort_order) values
  ('Jordan Lee', 'Harbor HR Cloud', 'Marriage', 'Needs certificate', 'Not applicable', 'Pending documents', 'pill-gold', 'Mar 22', 1),
  ('Ava Johnson', 'Anchor Employer Group', 'Termination', 'Verified', 'Notice queued', 'Processing', 'pill-info', 'Mar 31', 2),
  ('Noah Kim', 'Northstar Benefits', 'Birth', 'Pending dependent docs', 'Not applicable', 'Open', 'pill-coral', 'Apr 1', 3);

insert into public.benefits_communications (template_name, channel, audience, status, tone, sort_order) values
  ('Enrollment confirmation', 'Email', 'Confirmed new hires', 'Sending', 'pill-info', 1),
  ('COBRA notice', 'Postal + email', 'Terminated employees', 'Queued', 'pill-gold', 2),
  ('Dependent verification', 'Email', 'Open QLEs', 'Live', 'pill-strong', 3);

insert into public.workflow_runs (workflow_name, current_step, owner_name, status, tone, sort_order) values
  ('New hire medical + dental', 'Carrier submission', 'Ops automation', 'Live', 'pill-strong', 1),
  ('Marriage QLE review chain', 'Document verification', 'Benefits support', 'Active', 'pill-info', 2),
  ('Termination and COBRA handoff', 'Compliance delivery', 'CS operations', 'Monitored', 'pill-gold', 3);

insert into public.reconciliation_records (organization_name, carrier_name, discrepancy_count, status, tone, last_run_text, sort_order) values
  ('Northstar Benefits', 'Aetna', 1, 'Review', 'pill-gold', 'Mar 14, 09:42', 1),
  ('Harbor HR Cloud', 'Guardian', 0, 'Clean', 'pill-strong', 'Mar 14, 09:10', 2),
  ('Anchor Employer Group', 'UnitedHealthcare', 3, 'Escalated', 'pill-coral', 'Mar 14, 08:55', 3);

insert into public.audit_logs (actor_name, action, entity_name, created_at) values
  ('Noyo Admin', 'Updated webhook subscription', 'Northstar Benefits', '2026-03-14T10:12:00+05:30'::timestamptz),
  ('Benefits support', 'Approved marriage QLE', 'Jordan Lee', '2026-03-14T09:47:00+05:30'::timestamptz),
  ('Automation worker', 'Submitted enrollment payload', 'Maya Patel', '2026-03-14T09:31:00+05:30'::timestamptz);

insert into public.error_logs (severity, source, message, resolution_status, tone, sort_order) values
  ('High', 'Delta Dental mapping', 'Dependent relationship code mismatch on child enrollment.', 'Waiting on mapping update', 'pill-coral', 1),
  ('Medium', 'UnitedHealthcare API', 'Carrier acknowledgement exceeded threshold by 11 minutes.', 'Retry policy active', 'pill-gold', 2),
  ('Low', 'Webhook delivery', 'One retry required for enrollment.updated event.', 'Resolved', 'pill-info', 3);

insert into public.compliance_reports (organization_name, report_name, due_date_text, status, tone, sort_order) values
  ('Anchor Employer Group', 'COBRA notice register', 'Mar 18', 'Due soon', 'pill-gold', 1),
  ('Northstar Benefits', 'ACA monthly snapshot', 'Mar 25', 'In progress', 'pill-info', 2),
  ('Harbor HR Cloud', 'ERISA distribution log', 'Apr 1', 'Ready', 'pill-strong', 3);

insert into public.data_export_jobs (organization_name, export_format, destination, status, tone, sort_order) values
  ('Northstar Benefits', 'CSV', 'S3 archive', 'Completed', 'pill-strong', 1),
  ('Harbor HR Cloud', 'JSON', 'Partner API', 'Queued', 'pill-gold', 2),
  ('Anchor Employer Group', 'XLSX', 'Finance mailbox', 'Running', 'pill-info', 3);

insert into public.billing_records (organization_name, billing_period, pricing_model, amount_cents, amount_text, status, tone, sort_order) values
  ('Northstar Benefits', 'Mar 2026', 'PEPM + API usage', 1842000, '$18,420', 'Paid', 'pill-strong', 1),
  ('Harbor HR Cloud', 'Mar 2026', 'Enterprise pilot', 1280000, '$12,800', 'Pending', 'pill-gold', 2),
  ('Anchor Employer Group', 'Mar 2026', 'PEPM', 624000, '$6,240', 'Draft', 'pill-info', 3);

insert into public.webhook_subscriptions (organization_name, endpoint, event_types, status, tone, sort_order) values
  ('Northstar Benefits', 'https://northstar.example/events', 'enrollment.updated, carrier.acknowledged', 'Active', 'pill-strong', 1),
  ('Harbor HR Cloud', 'https://harbor.example/benefits-webhook', 'validation.failed, enrollment.updated', 'Retry policy', 'pill-gold', 2);

insert into public.marketplace_integrations (organization_name, provider, category, status, tone, sort_order) values
  ('Northstar Benefits', 'Voluntary Marketplace X', 'Voluntary benefits', 'Connected', 'pill-strong', 1),
  ('Harbor HR Cloud', 'Broker Sync Hub', 'Broker distribution', 'Pilot', 'pill-info', 2);

insert into public.localization_settings (organization_name, locale, currency, mobile_sync_enabled, offline_mode_enabled, sort_order) values
  ('Northstar Benefits', 'en-US', 'USD', true, false, 1),
  ('Anchor Employer Group', 'en-US', 'USD', true, true, 2);
commit;





