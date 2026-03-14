create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  full_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  segment text not null,
  employees_count integer not null default 0,
  carriers_count integer not null default 0,
  status text not null,
  status_tone text not null default 'pill-soft',
  success_rate numeric(5,2) not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, user_id)
);

create table if not exists public.insurance_carriers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  segment text not null,
  status text not null,
  tone text not null default 'pill-soft',
  description text not null,
  plans text not null,
  method text not null,
  coverage text not null,
  sla_minutes integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workflow_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null,
  sort_order integer not null default 0
);

create table if not exists public.workflow_steps (
  id uuid primary key default gen_random_uuid(),
  workflow_id uuid not null references public.workflow_templates (id) on delete cascade,
  title text not null,
  detail text not null,
  tone text not null default 'timeline-blue',
  sort_order integer not null default 0
);

create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  full_name text not null,
  work_email text unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  employee_id uuid not null references public.employees (id) on delete cascade,
  carrier_id uuid not null references public.insurance_carriers (id) on delete cascade,
  workflow_type text not null,
  plan_name text not null,
  status text not null,
  tone text not null default 'pill-soft',
  due_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.validation_rules (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  impact text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0
);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  topic text not null,
  destination text not null,
  status text not null,
  tone text not null default 'pill-soft',
  occurred_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.data_mapping_backlog (
  id uuid primary key default gen_random_uuid(),
  field_name text not null,
  description text not null,
  state text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0
);

create table if not exists public.carrier_rate_limits (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid not null references public.insurance_carriers (id) on delete cascade,
  rule_text text not null,
  window_text text not null,
  sort_order integer not null default 0
);

create table if not exists public.platform_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_group text not null check (metric_group in ('overview', 'analytics')),
  label text not null,
  value_text text not null,
  delta_text text not null,
  detail text not null,
  tone text not null default 'metric-card-blue',
  sort_order integer not null default 0
);

create table if not exists public.performance_series (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  success_value integer not null,
  coverage_value integer not null,
  sort_order integer not null default 0
);

create table if not exists public.cost_optimization_levers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  value_text text not null,
  sort_order integer not null default 0
);

create table if not exists public.go_to_market_notes (
  id uuid primary key default gen_random_uuid(),
  note text not null,
  sort_order integer not null default 0
);

create table if not exists public.api_endpoint_groups (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  sort_order integer not null default 0
);

create table if not exists public.entity_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = coalesce(excluded.full_name, public.profiles.full_name),
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_organizations_updated_at on public.organizations;
create trigger set_organizations_updated_at
  before update on public.organizations
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_insurance_carriers_updated_at on public.insurance_carriers;
create trigger set_insurance_carriers_updated_at
  before update on public.insurance_carriers
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.insurance_carriers enable row level security;
alter table public.workflow_templates enable row level security;
alter table public.workflow_steps enable row level security;
alter table public.employees enable row level security;
alter table public.enrollments enable row level security;
alter table public.validation_rules enable row level security;
alter table public.webhook_events enable row level security;
alter table public.data_mapping_backlog enable row level security;
alter table public.carrier_rate_limits enable row level security;
alter table public.platform_metrics enable row level security;
alter table public.performance_series enable row level security;
alter table public.cost_optimization_levers enable row level security;
alter table public.go_to_market_notes enable row level security;
alter table public.api_endpoint_groups enable row level security;
alter table public.entity_catalog enable row level security;

drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
on public.profiles for update
using (auth.uid() = id);

drop policy if exists "members_select_self" on public.organization_members;
create policy "members_select_self"
on public.organization_members for select
using (auth.uid() = user_id);

drop policy if exists "organizations_select_member" on public.organizations;
create policy "organizations_select_member"
on public.organizations for select
using (
  exists (
    select 1
    from public.organization_members members
    where members.organization_id = organizations.id
      and members.user_id = auth.uid()
  )
);

drop policy if exists "employees_select_member" on public.employees;
create policy "employees_select_member"
on public.employees for select
using (
  exists (
    select 1
    from public.organization_members members
    where members.organization_id = employees.organization_id
      and members.user_id = auth.uid()
  )
);

drop policy if exists "enrollments_select_member" on public.enrollments;
create policy "enrollments_select_member"
on public.enrollments for select
using (
  exists (
    select 1
    from public.organization_members members
    where members.organization_id = enrollments.organization_id
      and members.user_id = auth.uid()
  )
);

drop policy if exists "webhooks_select_member" on public.webhook_events;
create policy "webhooks_select_member"
on public.webhook_events for select
using (
  organization_id is null
  or exists (
    select 1
    from public.organization_members members
    where members.organization_id = webhook_events.organization_id
      and members.user_id = auth.uid()
  )
);

drop policy if exists "authenticated_read_carriers" on public.insurance_carriers;
create policy "authenticated_read_carriers"
on public.insurance_carriers for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_workflow_templates" on public.workflow_templates;
create policy "authenticated_read_workflow_templates"
on public.workflow_templates for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_workflow_steps" on public.workflow_steps;
create policy "authenticated_read_workflow_steps"
on public.workflow_steps for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_validation_rules" on public.validation_rules;
create policy "authenticated_read_validation_rules"
on public.validation_rules for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_data_mapping_backlog" on public.data_mapping_backlog;
create policy "authenticated_read_data_mapping_backlog"
on public.data_mapping_backlog for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_carrier_rate_limits" on public.carrier_rate_limits;
create policy "authenticated_read_carrier_rate_limits"
on public.carrier_rate_limits for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_platform_metrics" on public.platform_metrics;
create policy "authenticated_read_platform_metrics"
on public.platform_metrics for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_performance_series" on public.performance_series;
create policy "authenticated_read_performance_series"
on public.performance_series for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_cost_levers" on public.cost_optimization_levers;
create policy "authenticated_read_cost_levers"
on public.cost_optimization_levers for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_go_to_market_notes" on public.go_to_market_notes;
create policy "authenticated_read_go_to_market_notes"
on public.go_to_market_notes for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_endpoint_groups" on public.api_endpoint_groups;
create policy "authenticated_read_endpoint_groups"
on public.api_endpoint_groups for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_entity_catalog" on public.entity_catalog;
create policy "authenticated_read_entity_catalog"
on public.entity_catalog for select
using (auth.role() = 'authenticated');

alter table public.employees
  add column if not exists employment_class text not null default 'Full-time',
  add column if not exists status text not null default 'Synced',
  add column if not exists tone text not null default 'pill-soft',
  add column if not exists coverage text not null default 'Employee only',
  add column if not exists sync_state text not null default 'Pending';

create table if not exists public.organization_setup_tracks (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  owner_name text not null,
  status text not null,
  tone text not null default 'pill-soft',
  milestone text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  rule_name text not null,
  applies_to text not null,
  logic_summary text not null,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.dependents (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  full_name text not null,
  relationship text not null,
  status text not null,
  tone text not null default 'pill-soft',
  coverage text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.decision_support_recommendations (
  id uuid primary key default gen_random_uuid(),
  employee_name text not null,
  recommendation text not null,
  savings_text text not null,
  confidence_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.api_connections (
  id uuid primary key default gen_random_uuid(),
  carrier_name text not null,
  environment text not null,
  auth_mode text not null,
  sync_status text not null,
  tone text not null default 'pill-soft',
  file_support text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.file_integrations (
  id uuid primary key default gen_random_uuid(),
  partner_name text not null,
  file_format text not null,
  status text not null,
  tone text not null default 'pill-soft',
  note text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.benefit_plans (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  carrier_name text not null,
  plan_name text not null,
  category text not null,
  coverage_level text not null,
  premium_text text not null,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.plan_configurations (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  configuration_name text not null,
  funding_strategy text not null,
  plan_year text not null,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.life_events (
  id uuid primary key default gen_random_uuid(),
  employee_name text not null,
  organization_name text not null,
  event_type text not null,
  verification_status text not null,
  cobra_status text not null,
  status text not null,
  tone text not null default 'pill-soft',
  effective_on text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.benefits_communications (
  id uuid primary key default gen_random_uuid(),
  template_name text not null,
  channel text not null,
  audience text not null,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workflow_name text not null,
  current_step text not null,
  owner_name text not null,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reconciliation_records (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  carrier_name text not null,
  discrepancy_count integer not null default 0,
  status text not null,
  tone text not null default 'pill-soft',
  last_run_text text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_name text not null,
  action text not null,
  entity_name text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.error_logs (
  id uuid primary key default gen_random_uuid(),
  severity text not null,
  source text not null,
  message text not null,
  resolution_status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.compliance_reports (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  report_name text not null,
  due_date_text text not null,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.data_export_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  export_format text not null,
  destination text not null,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.billing_records (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  billing_period text not null,
  pricing_model text not null,
  amount_cents bigint not null default 0,
  amount_text text,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.webhook_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  endpoint text not null,
  event_types text not null,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.marketplace_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  provider text not null,
  category text not null,
  status text not null,
  tone text not null default 'pill-soft',
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.localization_settings (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  locale text not null,
  currency text not null,
  mobile_sync_enabled boolean not null default false,
  offline_mode_enabled boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.organization_setup_tracks enable row level security;
alter table public.eligibility_rules enable row level security;
alter table public.dependents enable row level security;
alter table public.decision_support_recommendations enable row level security;
alter table public.api_connections enable row level security;
alter table public.file_integrations enable row level security;
alter table public.benefit_plans enable row level security;
alter table public.plan_configurations enable row level security;
alter table public.life_events enable row level security;
alter table public.benefits_communications enable row level security;
alter table public.workflow_runs enable row level security;
alter table public.reconciliation_records enable row level security;
alter table public.audit_logs enable row level security;
alter table public.error_logs enable row level security;
alter table public.compliance_reports enable row level security;
alter table public.data_export_jobs enable row level security;
alter table public.billing_records enable row level security;
alter table public.webhook_subscriptions enable row level security;
alter table public.marketplace_integrations enable row level security;
alter table public.localization_settings enable row level security;

drop policy if exists "authenticated_read_organization_setup_tracks" on public.organization_setup_tracks;
create policy "authenticated_read_organization_setup_tracks"
on public.organization_setup_tracks for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_eligibility_rules" on public.eligibility_rules;
create policy "authenticated_read_eligibility_rules"
on public.eligibility_rules for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_dependents" on public.dependents;
create policy "authenticated_read_dependents"
on public.dependents for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_decision_support_recommendations" on public.decision_support_recommendations;
create policy "authenticated_read_decision_support_recommendations"
on public.decision_support_recommendations for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_api_connections" on public.api_connections;
create policy "authenticated_read_api_connections"
on public.api_connections for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_file_integrations" on public.file_integrations;
create policy "authenticated_read_file_integrations"
on public.file_integrations for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_benefit_plans" on public.benefit_plans;
create policy "authenticated_read_benefit_plans"
on public.benefit_plans for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_plan_configurations" on public.plan_configurations;
create policy "authenticated_read_plan_configurations"
on public.plan_configurations for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_life_events" on public.life_events;
create policy "authenticated_read_life_events"
on public.life_events for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_benefits_communications" on public.benefits_communications;
create policy "authenticated_read_benefits_communications"
on public.benefits_communications for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_workflow_runs" on public.workflow_runs;
create policy "authenticated_read_workflow_runs"
on public.workflow_runs for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_reconciliation_records" on public.reconciliation_records;
create policy "authenticated_read_reconciliation_records"
on public.reconciliation_records for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_audit_logs" on public.audit_logs;
create policy "authenticated_read_audit_logs"
on public.audit_logs for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_error_logs" on public.error_logs;
create policy "authenticated_read_error_logs"
on public.error_logs for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_compliance_reports" on public.compliance_reports;
create policy "authenticated_read_compliance_reports"
on public.compliance_reports for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_data_export_jobs" on public.data_export_jobs;
create policy "authenticated_read_data_export_jobs"
on public.data_export_jobs for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_billing_records" on public.billing_records;
create policy "authenticated_read_billing_records"
on public.billing_records for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_webhook_subscriptions" on public.webhook_subscriptions;
create policy "authenticated_read_webhook_subscriptions"
on public.webhook_subscriptions for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_marketplace_integrations" on public.marketplace_integrations;
create policy "authenticated_read_marketplace_integrations"
on public.marketplace_integrations for select
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_read_localization_settings" on public.localization_settings;
create policy "authenticated_read_localization_settings"
on public.localization_settings for select
using (auth.role() = 'authenticated');
