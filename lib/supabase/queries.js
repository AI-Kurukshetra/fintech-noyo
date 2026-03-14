import {
  analyticsMetrics as analyticsMetricsFallback,
  apiEndpointGroups as apiEndpointGroupsFallback,
  carrierConnections as carrierConnectionsFallback,
  costLevers as costLeversFallback,
  enrollmentCases as enrollmentCasesFallback,
  goToMarketNotes as goToMarketNotesFallback,
  keyEntities as keyEntitiesFallback,
  keyMetrics as keyMetricsFallback,
  mappingBacklog as mappingBacklogFallback,
  monetization as monetizationFallback,
  performanceSeries as performanceSeriesFallback,
  rateLimitPolicies as rateLimitPoliciesFallback,
  tenants as tenantsFallback,
  validationRules as validationRulesFallback,
  webhookEvents as webhookEventsFallback,
  workflowTracks as workflowTracksFallback,
} from "../noyo-data";
import {
  accessRoles,
  apiConnections as apiConnectionsFallback,
  auditTrailEntries as auditTrailEntriesFallback,
  benefitPlans as benefitPlansFallback,
  billingRecords as billingRecordsFallback,
  communicationQueue as communicationQueueFallback,
  complianceReports as complianceReportsFallback,
  dataExportJobs as dataExportJobsFallback,
  decisionSupportCards as decisionSupportCardsFallback,
  demographicCoverage as demographicCoverageFallback,
  dependentRoster as dependentRosterFallback,
  employeeRoster as employeeRosterFallback,
  errorLogEntries as errorLogEntriesFallback,
  fileIntegrationQueue as fileIntegrationQueueFallback,
  implementationModules,
  lifeEventCases as lifeEventCasesFallback,
  localizationSettings as localizationSettingsFallback,
  marketplaceIntegrations as marketplaceIntegrationsFallback,
  organizationSetupTracks as organizationSetupTracksFallback,
  eligibilityRulesCatalog as eligibilityRulesCatalogFallback,
  planConfigurationsCatalog as planConfigurationsCatalogFallback,
  reconciliationRecords as reconciliationRecordsFallback,
  webhookSubscriptions as webhookSubscriptionsFallback,
  workflowAutomationTemplates as workflowAutomationTemplatesFallback,
} from "../noyo-modules-data";
import { createAdminClient, isSupabaseConfigured } from "./admin";
import {
  mapCarrier,
  mapCostLever,
  mapEnrollment,
  mapMappingBacklog,
  mapMetric,
  mapPerformanceSeries,
  mapRateLimitPolicy,
  mapTenant,
  mapValidationRule,
  mapWebhookEvent,
  mapWorkflow,
} from "./mappers";

function unwrap(value) {
  return Array.isArray(value) ? value[0] : value;
}

async function runWithFallback(task, fallback) {
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = createAdminClient();
    return await task(supabase);
  } catch (error) {
    console.error("Supabase fallback:", error.message);
    return fallback;
  }
}

function formatTime(value) {
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

function formatCurrencyFromCents(value) {
  const amount = Number(value || 0) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function getOverviewData() {
  return runWithFallback(
    async (supabase) => {
      const [metricsResult, organizationsResult] = await Promise.all([
        supabase
          .from("platform_metrics")
          .select("*")
          .eq("metric_group", "overview")
          .order("sort_order"),
        supabase.from("organizations").select("*").order("name"),
      ]);

      if (metricsResult.error) throw metricsResult.error;
      if (organizationsResult.error) throw organizationsResult.error;

      return {
        keyMetrics:
          metricsResult.data.length > 0
            ? metricsResult.data.map(mapMetric)
            : keyMetricsFallback,
        tenants:
          organizationsResult.data.length > 0
            ? organizationsResult.data.map(mapTenant)
            : tenantsFallback,
      };
    },
    {
      keyMetrics: keyMetricsFallback,
      tenants: tenantsFallback,
    },
  );
}

export async function getEnrollmentData() {
  return runWithFallback(
    async (supabase) => {
      const [
        workflowsResult,
        stepsResult,
        queueResult,
        rulesResult,
        webhooksResult,
      ] = await Promise.all([
        supabase
          .from("workflow_templates")
          .select("id, name, summary, sort_order")
          .order("sort_order"),
        supabase
          .from("workflow_steps")
          .select("workflow_id, title, detail, tone, sort_order")
          .order("sort_order"),
        supabase
          .from("enrollments")
          .select(
            "id, workflow_type, plan_name, status, tone, due_at, employees(full_name), organizations(name), insurance_carriers(name)",
          )
          .order("due_at"),
        supabase.from("validation_rules").select("*").order("sort_order"),
        supabase
          .from("webhook_events")
          .select("*")
          .order("occurred_at", { ascending: false }),
      ]);

      if (workflowsResult.error) throw workflowsResult.error;
      if (stepsResult.error) throw stepsResult.error;
      if (queueResult.error) throw queueResult.error;
      if (rulesResult.error) throw rulesResult.error;
      if (webhooksResult.error) throw webhooksResult.error;

      return {
        workflowTracks:
          workflowsResult.data.length > 0
            ? workflowsResult.data.map((workflow) =>
                mapWorkflow(workflow, stepsResult.data),
              )
            : workflowTracksFallback,
        enrollmentCases:
          queueResult.data.length > 0
            ? queueResult.data.map(mapEnrollment)
            : enrollmentCasesFallback,
        validationRules:
          rulesResult.data.length > 0
            ? rulesResult.data.map(mapValidationRule)
            : validationRulesFallback,
        webhookEvents:
          webhooksResult.data.length > 0
            ? webhooksResult.data.map(mapWebhookEvent)
            : webhookEventsFallback,
      };
    },
    {
      workflowTracks: workflowTracksFallback,
      enrollmentCases: enrollmentCasesFallback,
      validationRules: validationRulesFallback,
      webhookEvents: webhookEventsFallback,
    },
  );
}

export async function getCarrierData() {
  return runWithFallback(
    async (supabase) => {
      const [
        carriersResult,
        mappingResult,
        rateLimitsResult,
        apiConnectionsResult,
        fileIntegrationsResult,
      ] = await Promise.all([
        supabase.from("insurance_carriers").select("*").order("name"),
        supabase.from("data_mapping_backlog").select("*").order("sort_order"),
        supabase
          .from("carrier_rate_limits")
          .select("rule_text, window_text, insurance_carriers(name)")
          .order("sort_order"),
        supabase.from("api_connections").select("*").order("sort_order"),
        supabase.from("file_integrations").select("*").order("sort_order"),
      ]);

      if (carriersResult.error) throw carriersResult.error;
      if (mappingResult.error) throw mappingResult.error;
      if (rateLimitsResult.error) throw rateLimitsResult.error;
      if (apiConnectionsResult.error) throw apiConnectionsResult.error;
      if (fileIntegrationsResult.error) throw fileIntegrationsResult.error;

      return {
        carrierConnections:
          carriersResult.data.length > 0
            ? carriersResult.data.map(mapCarrier)
            : carrierConnectionsFallback,
        mappingBacklog:
          mappingResult.data.length > 0
            ? mappingResult.data.map(mapMappingBacklog)
            : mappingBacklogFallback,
        rateLimitPolicies:
          rateLimitsResult.data.length > 0
            ? rateLimitsResult.data.map(mapRateLimitPolicy)
            : rateLimitPoliciesFallback,
        apiConnections:
          apiConnectionsResult.data.length > 0
            ? apiConnectionsResult.data.map((entry) => ({
                carrier: entry.carrier_name,
                environment: entry.environment,
                authMode: entry.auth_mode,
                syncStatus: entry.sync_status,
                tone: entry.tone,
                fileSupport: entry.file_support,
              }))
            : apiConnectionsFallback,
        fileIntegrations:
          fileIntegrationsResult.data.length > 0
            ? fileIntegrationsResult.data.map((entry) => ({
                partner: entry.partner_name,
                format: entry.file_format,
                status: entry.status,
                tone: entry.tone,
                note: entry.note,
              }))
            : fileIntegrationQueueFallback,
      };
    },
    {
      carrierConnections: carrierConnectionsFallback,
      mappingBacklog: mappingBacklogFallback,
      rateLimitPolicies: rateLimitPoliciesFallback,
      apiConnections: apiConnectionsFallback,
      fileIntegrations: fileIntegrationQueueFallback,
    },
  );
}

export async function getAnalyticsData() {
  return runWithFallback(
    async (supabase) => {
      const [metricsResult, seriesResult, leversResult, notesResult] =
        await Promise.all([
          supabase
            .from("platform_metrics")
            .select("*")
            .eq("metric_group", "analytics")
            .order("sort_order"),
          supabase.from("performance_series").select("*").order("sort_order"),
          supabase
            .from("cost_optimization_levers")
            .select("*")
            .order("sort_order"),
          supabase.from("go_to_market_notes").select("*").order("sort_order"),
        ]);

      if (metricsResult.error) throw metricsResult.error;
      if (seriesResult.error) throw seriesResult.error;
      if (leversResult.error) throw leversResult.error;
      if (notesResult.error) throw notesResult.error;

      return {
        analyticsMetrics:
          metricsResult.data.length > 0
            ? metricsResult.data.map(mapMetric)
            : analyticsMetricsFallback,
        performanceSeries:
          seriesResult.data.length > 0
            ? seriesResult.data.map(mapPerformanceSeries)
            : performanceSeriesFallback,
        costLevers:
          leversResult.data.length > 0
            ? leversResult.data.map(mapCostLever)
            : costLeversFallback,
        goToMarketNotes:
          notesResult.data.length > 0
            ? notesResult.data.map((note) => note.note)
            : goToMarketNotesFallback,
      };
    },
    {
      analyticsMetrics: analyticsMetricsFallback,
      performanceSeries: performanceSeriesFallback,
      costLevers: costLeversFallback,
      goToMarketNotes: goToMarketNotesFallback,
    },
  );
}

export async function getDeveloperPortalData() {
  return runWithFallback(
    async (supabase) => {
      const [endpointsResult, entitiesResult] = await Promise.all([
        supabase.from("api_endpoint_groups").select("*").order("sort_order"),
        supabase.from("entity_catalog").select("*").order("sort_order"),
      ]);

      if (endpointsResult.error) throw endpointsResult.error;
      if (entitiesResult.error) throw entitiesResult.error;

      return {
        apiEndpointGroups:
          endpointsResult.data.length > 0
            ? endpointsResult.data.map((entry) => entry.path)
            : apiEndpointGroupsFallback,
        keyEntities:
          entitiesResult.data.length > 0
            ? entitiesResult.data.map((entry) => entry.name)
            : keyEntitiesFallback,
        implementationModules,
      };
    },
    {
      apiEndpointGroups: apiEndpointGroupsFallback,
      keyEntities: keyEntitiesFallback,
      implementationModules,
    },
  );
}

export async function getOrganizationsData() {
  return runWithFallback(
    async (supabase) => {
      const [organizationsResult, setupResult, rulesResult] = await Promise.all([
        supabase.from("organizations").select("*").order("name"),
        supabase.from("organization_setup_tracks").select("*").order("sort_order"),
        supabase.from("eligibility_rules").select("*").order("sort_order"),
      ]);

      if (organizationsResult.error) throw organizationsResult.error;
      if (setupResult.error) throw setupResult.error;
      if (rulesResult.error) throw rulesResult.error;

      return {
        organizations:
          organizationsResult.data.length > 0
            ? organizationsResult.data.map(mapTenant)
            : tenantsFallback,
        setupTracks:
          setupResult.data.length > 0
            ? setupResult.data.map((entry) => ({
                organization: entry.organization_name,
                owner: entry.owner_name,
                status: entry.status,
                tone: entry.tone,
                milestone: entry.milestone,
              }))
            : organizationSetupTracksFallback,
        eligibilityRules:
          rulesResult.data.length > 0
            ? rulesResult.data.map((entry) => ({
                organization: entry.organization_name,
                name: entry.rule_name,
                appliesTo: entry.applies_to,
                logic: entry.logic_summary,
                status: entry.status,
                tone: entry.tone,
              }))
            : eligibilityRulesCatalogFallback,
        accessRoles,
      };
    },
    {
      organizations: tenantsFallback,
      setupTracks: organizationSetupTracksFallback,
      eligibilityRules: eligibilityRulesCatalogFallback,
      accessRoles,
    },
  );
}

export async function getEmployeesData() {
  return runWithFallback(
    async (supabase) => {
      const [employeesResult, dependentsResult, recommendationsResult] =
        await Promise.all([
          supabase
            .from("employees")
            .select(
              "full_name, employment_class, status, tone, coverage, sync_state, organizations(name)",
            )
            .order("full_name"),
          supabase
            .from("dependents")
            .select("full_name, relationship, status, tone, coverage, employees(full_name)")
            .order("full_name"),
          supabase
            .from("decision_support_recommendations")
            .select("*")
            .order("sort_order"),
        ]);

      if (employeesResult.error) throw employeesResult.error;
      if (dependentsResult.error) throw dependentsResult.error;
      if (recommendationsResult.error) throw recommendationsResult.error;

      return {
        employees:
          employeesResult.data.length > 0
            ? employeesResult.data.map((entry) => ({
                name: entry.full_name,
                organization: unwrap(entry.organizations)?.name ?? "Unknown org",
                className: entry.employment_class,
                status: entry.status,
                tone: entry.tone,
                coverage: entry.coverage,
                syncState: entry.sync_state,
              }))
            : employeeRosterFallback,
        dependents:
          dependentsResult.data.length > 0
            ? dependentsResult.data.map((entry) => ({
                employee: unwrap(entry.employees)?.full_name ?? "Unknown employee",
                dependent: entry.full_name,
                relationship: entry.relationship,
                status: entry.status,
                tone: entry.tone,
                coverage: entry.coverage,
              }))
            : dependentRosterFallback,
        recommendations:
          recommendationsResult.data.length > 0
            ? recommendationsResult.data.map((entry) => ({
                employee: entry.employee_name,
                recommendation: entry.recommendation,
                savings: entry.savings_text,
                confidence: entry.confidence_text,
              }))
            : decisionSupportCardsFallback,
        demographicCoverage: demographicCoverageFallback,
      };
    },
    {
      employees: employeeRosterFallback,
      dependents: dependentRosterFallback,
      recommendations: decisionSupportCardsFallback,
      demographicCoverage: demographicCoverageFallback,
    },
  );
}

export async function getPlansData() {
  return runWithFallback(
    async (supabase) => {
      const [plansResult, configurationsResult, recommendationsResult] =
        await Promise.all([
          supabase.from("benefit_plans").select("*").order("sort_order"),
          supabase.from("plan_configurations").select("*").order("sort_order"),
          supabase
            .from("decision_support_recommendations")
            .select("*")
            .order("sort_order"),
        ]);

      if (plansResult.error) throw plansResult.error;
      if (configurationsResult.error) throw configurationsResult.error;
      if (recommendationsResult.error) throw recommendationsResult.error;

      return {
        plans:
          plansResult.data.length > 0
            ? plansResult.data.map((entry) => ({
                organization: entry.organization_name,
                carrier: entry.carrier_name,
                name: entry.plan_name,
                category: entry.category,
                coverageLevel: entry.coverage_level,
                premium: entry.premium_text,
                status: entry.status,
                tone: entry.tone,
              }))
            : benefitPlansFallback,
        configurations:
          configurationsResult.data.length > 0
            ? configurationsResult.data.map((entry) => ({
                organization: entry.organization_name,
                configuration: entry.configuration_name,
                funding: entry.funding_strategy,
                planYear: entry.plan_year,
                status: entry.status,
                tone: entry.tone,
              }))
            : planConfigurationsCatalogFallback,
        recommendations:
          recommendationsResult.data.length > 0
            ? recommendationsResult.data.map((entry) => ({
                employee: entry.employee_name,
                recommendation: entry.recommendation,
                savings: entry.savings_text,
                confidence: entry.confidence_text,
              }))
            : decisionSupportCardsFallback,
      };
    },
    {
      plans: benefitPlansFallback,
      configurations: planConfigurationsCatalogFallback,
      recommendations: decisionSupportCardsFallback,
    },
  );
}

export async function getLifeEventsData() {
  return runWithFallback(
    async (supabase) => {
      const [lifeEventsResult, communicationsResult] = await Promise.all([
        supabase.from("life_events").select("*").order("sort_order"),
        supabase.from("benefits_communications").select("*").order("sort_order"),
      ]);

      if (lifeEventsResult.error) throw lifeEventsResult.error;
      if (communicationsResult.error) throw communicationsResult.error;

      return {
        lifeEvents:
          lifeEventsResult.data.length > 0
            ? lifeEventsResult.data.map((entry) => ({
                employee: entry.employee_name,
                organization: entry.organization_name,
                eventType: entry.event_type,
                verification: entry.verification_status,
                cobra: entry.cobra_status,
                status: entry.status,
                tone: entry.tone,
                effectiveOn: entry.effective_on,
              }))
            : lifeEventCasesFallback,
        communications:
          communicationsResult.data.length > 0
            ? communicationsResult.data.map((entry) => ({
                template: entry.template_name,
                channel: entry.channel,
                audience: entry.audience,
                status: entry.status,
                tone: entry.tone,
              }))
            : communicationQueueFallback,
      };
    },
    {
      lifeEvents: lifeEventCasesFallback,
      communications: communicationQueueFallback,
    },
  );
}

export async function getWorkflowsData() {
  return runWithFallback(
    async (supabase) => {
      const [templatesResult, stepsResult, workflowsResult, fileIntegrationsResult] =
        await Promise.all([
          supabase
            .from("workflow_templates")
            .select("id, name, summary, sort_order")
            .order("sort_order"),
          supabase
            .from("workflow_steps")
            .select("workflow_id, title, detail, tone, sort_order")
            .order("sort_order"),
          supabase.from("workflow_runs").select("*").order("sort_order"),
          supabase.from("file_integrations").select("*").order("sort_order"),
        ]);

      if (templatesResult.error) throw templatesResult.error;
      if (stepsResult.error) throw stepsResult.error;
      if (workflowsResult.error) throw workflowsResult.error;
      if (fileIntegrationsResult.error) throw fileIntegrationsResult.error;

      return {
        workflowTracks:
          templatesResult.data.length > 0
            ? templatesResult.data.map((workflow) =>
                mapWorkflow(workflow, stepsResult.data),
              )
            : workflowTracksFallback,
        workflows:
          workflowsResult.data.length > 0
            ? workflowsResult.data.map((entry) => ({
                name: entry.workflow_name,
                currentStep: entry.current_step,
                owner: entry.owner_name,
                status: entry.status,
                tone: entry.tone,
              }))
            : workflowAutomationTemplatesFallback,
        fileIntegrations:
          fileIntegrationsResult.data.length > 0
            ? fileIntegrationsResult.data.map((entry) => ({
                partner: entry.partner_name,
                format: entry.file_format,
                status: entry.status,
                tone: entry.tone,
                note: entry.note,
              }))
            : fileIntegrationQueueFallback,
      };
    },
    {
      workflowTracks: workflowTracksFallback,
      workflows: workflowAutomationTemplatesFallback,
      fileIntegrations: fileIntegrationQueueFallback,
    },
  );
}

export async function getReconciliationData() {
  return runWithFallback(
    async (supabase) => {
      const [reconciliationResult, auditResult, errorResult] = await Promise.all([
        supabase.from("reconciliation_records").select("*").order("sort_order"),
        supabase.from("audit_logs").select("*").order("created_at", {
          ascending: false,
        }),
        supabase.from("error_logs").select("*").order("sort_order"),
      ]);

      if (reconciliationResult.error) throw reconciliationResult.error;
      if (auditResult.error) throw auditResult.error;
      if (errorResult.error) throw errorResult.error;

      return {
        reconciliation:
          reconciliationResult.data.length > 0
            ? reconciliationResult.data.map((entry) => ({
                organization: entry.organization_name,
                carrier: entry.carrier_name,
                discrepancies: entry.discrepancy_count,
                status: entry.status,
                tone: entry.tone,
                lastRun: entry.last_run_text,
              }))
            : reconciliationRecordsFallback,
        auditTrail:
          auditResult.data.length > 0
            ? auditResult.data.map((entry) => ({
                actor: entry.actor_name,
                action: entry.action,
                entity: entry.entity_name,
                timestamp: formatTime(entry.created_at),
              }))
            : auditTrailEntriesFallback,
        errors:
          errorResult.data.length > 0
            ? errorResult.data.map((entry) => ({
                severity: entry.severity,
                source: entry.source,
                message: entry.message,
                resolution: entry.resolution_status,
                tone: entry.tone,
              }))
            : errorLogEntriesFallback,
      };
    },
    {
      reconciliation: reconciliationRecordsFallback,
      auditTrail: auditTrailEntriesFallback,
      errors: errorLogEntriesFallback,
    },
  );
}

export async function getReportsData() {
  return runWithFallback(
    async (supabase) => {
      const [reportsResult, exportsResult] = await Promise.all([
        supabase.from("compliance_reports").select("*").order("sort_order"),
        supabase.from("data_export_jobs").select("*").order("sort_order"),
      ]);

      if (reportsResult.error) throw reportsResult.error;
      if (exportsResult.error) throw exportsResult.error;

      return {
        complianceReports:
          reportsResult.data.length > 0
            ? reportsResult.data.map((entry) => ({
                organization: entry.organization_name,
                report: entry.report_name,
                dueDate: entry.due_date_text,
                status: entry.status,
                tone: entry.tone,
              }))
            : complianceReportsFallback,
        exportJobs:
          exportsResult.data.length > 0
            ? exportsResult.data.map((entry) => ({
                organization: entry.organization_name,
                format: entry.export_format,
                destination: entry.destination,
                status: entry.status,
                tone: entry.tone,
              }))
            : dataExportJobsFallback,
      };
    },
    {
      complianceReports: complianceReportsFallback,
      exportJobs: dataExportJobsFallback,
    },
  );
}

export async function getBillingData() {
  return runWithFallback(
    async (supabase) => {
      const recordsResult = await supabase
        .from("billing_records")
        .select("*")
        .order("sort_order");

      if (recordsResult.error) throw recordsResult.error;

      return {
        billingRecords:
          recordsResult.data.length > 0
            ? recordsResult.data.map((entry) => ({
                organization: entry.organization_name,
                period: entry.billing_period,
                model: entry.pricing_model,
                amount: entry.amount_text ?? formatCurrencyFromCents(entry.amount_cents),
                status: entry.status,
                tone: entry.tone,
              }))
            : billingRecordsFallback,
        monetization: monetizationFallback,
      };
    },
    {
      billingRecords: billingRecordsFallback,
      monetization: monetizationFallback,
    },
  );
}

export async function getSettingsData() {
  return runWithFallback(
    async (supabase) => {
      const [webhooksResult, marketplacesResult, localizationResult] =
        await Promise.all([
          supabase.from("webhook_subscriptions").select("*").order("sort_order"),
          supabase
            .from("marketplace_integrations")
            .select("*")
            .order("sort_order"),
          supabase.from("localization_settings").select("*").order("sort_order"),
        ]);

      if (webhooksResult.error) throw webhooksResult.error;
      if (marketplacesResult.error) throw marketplacesResult.error;
      if (localizationResult.error) throw localizationResult.error;

      return {
        webhookSubscriptions:
          webhooksResult.data.length > 0
            ? webhooksResult.data.map((entry) => ({
                organization: entry.organization_name,
                endpoint: entry.endpoint,
                events: entry.event_types,
                status: entry.status,
                tone: entry.tone,
              }))
            : webhookSubscriptionsFallback,
        marketplaces:
          marketplacesResult.data.length > 0
            ? marketplacesResult.data.map((entry) => ({
                organization: entry.organization_name,
                provider: entry.provider,
                category: entry.category,
                status: entry.status,
                tone: entry.tone,
              }))
            : marketplaceIntegrationsFallback,
        localization:
          localizationResult.data.length > 0
            ? localizationResult.data.map((entry) => ({
                organization: entry.organization_name,
                locale: entry.locale,
                currency: entry.currency,
                mobileSync: entry.mobile_sync_enabled ? "Enabled" : "Disabled",
                offlineMode: entry.offline_mode_enabled ? "Enabled" : "Disabled",
              }))
            : localizationSettingsFallback,
        accessRoles,
      };
    },
    {
      webhookSubscriptions: webhookSubscriptionsFallback,
      marketplaces: marketplaceIntegrationsFallback,
      localization: localizationSettingsFallback,
      accessRoles,
    },
  );
}

export async function getDashboardData() {
  const [
    overview,
    enrollments,
    carriers,
    lifeEvents,
    reconciliation,
    reports,
    billing,
  ] = await Promise.all([
    getOverviewData(),
    getEnrollmentData(),
    getCarrierData(),
    getLifeEventsData(),
    getReconciliationData(),
    getReportsData(),
    getBillingData(),
  ]);

  const queueCards = [
    {
      label: "Open enrollments",
      value: String(enrollments.enrollmentCases.length),
      delta: "Live queue",
      detail: "New hires, QLEs, and terminations currently in operational flow.",
      tone: "metric-card-blue",
    },
    {
      label: "Active life events",
      value: String(lifeEvents.lifeEvents.length),
      delta: "Verification queue",
      detail: "Events requiring documentation, dependent checks, or COBRA action.",
      tone: "metric-card-gold",
    },
    {
      label: "Reconciliation issues",
      value: String(
        reconciliation.reconciliation.reduce(
          (total, item) => total + Number(item.discrepancies || 0),
          0,
        ),
      ),
      delta: "Across carriers",
      detail: "Discrepancies requiring audit or sync resolution.",
      tone: "metric-card-coral",
    },
    {
      label: "Reports due",
      value: String(reports.complianceReports.length),
      delta: "Compliance",
      detail: "Scheduled reporting, audit, and notice obligations coming due.",
      tone: "metric-card-green",
    },
  ];

  return {
    ...overview,
    queueCards,
    enrollmentCases: enrollments.enrollmentCases,
    lifeEvents: lifeEvents.lifeEvents,
    reconciliation: reconciliation.reconciliation,
    apiConnections: carriers.apiConnections,
    complianceReports: reports.complianceReports,
    billingRecords: billing.billingRecords,
    implementationModules,
  };
}

