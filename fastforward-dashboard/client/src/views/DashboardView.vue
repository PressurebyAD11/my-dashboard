<template>
  <DashboardLayout>
    <section
      class="d-flex flex-column ga-4 dashboard-content"
      :class="{ 'is-filter-transitioning': isFilterTransitioning }"
    >
      <section class="overview-panel">
        <div class="overview-copy">
          <p class="overview-kicker mb-2">{{ overviewStatusLabel }}</p>
          <h1 class="overview-title mb-2">{{ overviewHeadline }}</h1>
          <p class="overview-summary mb-0">{{ overviewSummary }}</p>

          <div class="overview-metrics mt-5">
            <div
              v-for="item in overviewMetrics"
              :key="item.label"
              class="overview-metric"
            >
              <span class="overview-metric-label">{{ item.label }}</span>
              <strong class="overview-metric-value">{{ item.value }}</strong>
            </div>
          </div>
        </div>

        <div class="overview-chips">
          <v-chip
            :color="exceptionChipColor"
            variant="tonal"
            prepend-icon="mdi-alert-circle-outline"
          >
            {{ exceptionChipLabel }}
          </v-chip>
        </div>
      </section>

      <FiltersBar
        :initial-filters="uiFilters"
        @filters-change="onFiltersChange"
        @reset-filters="onFiltersReset"
      />

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="comfortable"
        aria-live="assertive"
      >
        <div class="d-flex align-center justify-space-between flex-wrap ga-3">
          <span>{{ error }}</span>
          <v-btn
            v-if="!sessionExpired"
            size="small"
            color="error"
            variant="outlined"
            prepend-icon="mdi-refresh"
            @click="fetchAll"
          >
            Retry
          </v-btn>
        </div>
      </v-alert>

      <v-snackbar
        v-model="showSessionExpiredSnackbar"
        color="warning"
        timeout="1200"
        location="top"
      >
        Session expired. Redirecting to login...
      </v-snackbar>

      <v-skeleton-loader
        v-if="loading"
        type="card, card, card"
        class="mb-1 dashboard-skeleton"
      />
      <KpiCards
        v-else
        :metrics="kpiMetrics"
        :trends="kpiTrends"
        @card-click="onKpiCardClick"
      />

      <EmptyState
        v-if="hasNoData"
        icon="mdi-database-off-outline"
        title="No Data For Selected Filters"
        message="No shipments or exceptions were found for the selected filters and date range."
        action-label="Reset Filters"
        @action-click="resetFiltersToDefault"
      />

      <v-row v-else dense class="mt-1">
        <v-col cols="12" md="6" lg="6">
          <section id="shipment-volume-section" class="dashboard-section-anchor">
          <v-skeleton-loader
            v-if="loading"
            type="heading, text, image"
            class="dashboard-skeleton chart-skeleton"
          />
          <ShipmentVolumeChart
            v-else
            :labels="chartLabels"
            :values="shipmentVolumeData"
          />
          </section>
        </v-col>

        <v-col cols="12" md="6" lg="6">
          <section id="on-time-delivery-section" class="dashboard-section-anchor">
          <v-skeleton-loader
            v-if="loading"
            type="heading, text, image"
            class="dashboard-skeleton chart-skeleton"
          />
          <OnTimeDeliveryChart
            v-else
            :labels="chartLabels"
            :values="onTimeRateData"
          />
          </section>
        </v-col>
      </v-row>

      <v-row v-if="!hasNoData" dense>
        <v-col cols="12" xl="7">
          <section id="regional-performance-section" class="dashboard-section-anchor">
          <v-skeleton-loader
            v-if="loading"
            type="heading, table"
            class="dashboard-skeleton"
          />
          <RegionalPerformanceTable
            v-else
            :items="regions"
            :selected-region="filters.region"
            @region-click="onRegionRowClick"
          />
          </section>
        </v-col>

        <v-col cols="12" xl="5" class="mt-4 mt-xl-0">
          <section id="exceptions-panel-section" class="dashboard-section-anchor">
          <v-skeleton-loader
            v-if="loading"
            type="heading, table"
            class="dashboard-skeleton"
          />
          <ExceptionsPanel
            v-else
            :exceptions="exceptions"
            :filters="uiFilters"
            @reset-request="resetFiltersToDefault"
          />
          </section>
        </v-col>
      </v-row>
    </section>
  </DashboardLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import FiltersBar from '../components/FiltersBar.vue';
import KpiCards from '../components/KpiCards.vue';
import ShipmentVolumeChart from '../components/ShipmentVolumeChart.vue';
import OnTimeDeliveryChart from '../components/OnTimeDeliveryChart.vue';
import RegionalPerformanceTable from '../components/RegionalPerformanceTable.vue';
import ExceptionsPanel from '../components/ExceptionsPanel.vue';
import EmptyState from '../components/EmptyState.vue';
import { useShipmentData } from '../composables/useShipmentData';

const router = useRouter();

const {
  loading,
  error,
  sessionExpired,
  filters,
  kpis,
  shipments,
  regions,
  exceptions,
  fetchAll,
} = useShipmentData();

const uiFilters = computed(() => ({
  dateRange: Number(filters.days || 30),
  region: filters.region || 'all',
  exceptionStatus: filters.exceptionStatus || 'all',
}));

const isFilterTransitioning = ref(false);
const prefersReducedMotion = ref(false);
const showSessionExpiredSnackbar = ref(false);
let transitionTimer = null;
let sessionRedirectTimer = null;
let mediaQueryList = null;

function handleMotionPreferenceChange(event) {
  prefersReducedMotion.value = event.matches;
}

onMounted(() => {
  mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = mediaQueryList.matches;

  if (mediaQueryList.addEventListener) {
    mediaQueryList.addEventListener('change', handleMotionPreferenceChange);
    return;
  }

  mediaQueryList.addListener(handleMotionPreferenceChange);
});

watch(uiFilters, () => {
  if (prefersReducedMotion.value) {
    isFilterTransitioning.value = false;
    return;
  }

  if (transitionTimer) {
    clearTimeout(transitionTimer);
  }

  isFilterTransitioning.value = true;
  transitionTimer = setTimeout(() => {
    isFilterTransitioning.value = false;
    transitionTimer = null;
  }, 220);
}, { deep: true });

onBeforeUnmount(() => {
  if (transitionTimer) {
    clearTimeout(transitionTimer);
  }

  if (sessionRedirectTimer) {
    clearTimeout(sessionRedirectTimer);
  }

  if (!mediaQueryList) return;

  if (mediaQueryList.removeEventListener) {
    mediaQueryList.removeEventListener('change', handleMotionPreferenceChange);
    return;
  }

  mediaQueryList.removeListener(handleMotionPreferenceChange);
});

function onFiltersChange(nextFilters) {
  if (Number(nextFilters.dateRange) !== Number(uiFilters.value.dateRange)) {
    filters.days = Number(nextFilters.dateRange);
  }
  if (nextFilters.region !== uiFilters.value.region) {
    filters.region = nextFilters.region;
  }
  if (nextFilters.exceptionStatus !== uiFilters.value.exceptionStatus) {
    filters.exceptionStatus = nextFilters.exceptionStatus;
  }
}

function onFiltersReset(filters) {
  onFiltersChange(filters);
}

function resetFiltersToDefault() {
  filters.days = 30;
  filters.region = 'all';
  filters.exceptionStatus = 'all';
}

function onRegionRowClick(region) {
  const nextRegion = filters.region === region.id ? 'all' : region.id;
  filters.region = nextRegion;
}

function onKpiCardClick(payload) {
  const sectionByCard = {
    totalShipments: 'shipment-volume-section',
    onTimeRate: 'on-time-delivery-section',
    avgTransitTime: 'regional-performance-section',
    openExceptions: 'exceptions-panel-section',
  };

  const targetId = sectionByCard[payload?.key];
  if (!targetId) return;

  const section = document.getElementById(targetId);
  if (!section) return;

  section.scrollIntoView({
    behavior: prefersReducedMotion.value ? 'auto' : 'smooth',
    block: 'start',
  });
}

const chartLabels = computed(() => {
  const days = Number(filters.days || 30);
  const now = new Date();

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (days - 1 - index));
    return day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
});

const shipmentVolumeData = computed(() => {
  const days = Number(filters.days || 30);
  const now = new Date();

  const buckets = Array.from({ length: days }, (_, index) => {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(now.getDate() - (days - 1 - index));
    return day.toISOString().slice(0, 10);
  });

  const counts = Object.fromEntries(buckets.map((key) => [key, 0]));

  shipments.value.forEach((shipment) => {
    const key = new Date(shipment.createdAt).toISOString().slice(0, 10);
    if (counts[key] !== undefined) counts[key] += 1;
  });

  return buckets.map((key) => counts[key]);
});

const onTimeRateData = computed(() => {
  const days = Number(filters.days || 30);
  const now = new Date();

  const buckets = Array.from({ length: days }, (_, index) => {
    const day = new Date(now);
    day.setHours(0, 0, 0, 0);
    day.setDate(now.getDate() - (days - 1 - index));
    return day.toISOString().slice(0, 10);
  });

  const deliveredTotals = Object.fromEntries(buckets.map((key) => [key, 0]));
  const onTimeTotals = Object.fromEntries(buckets.map((key) => [key, 0]));

  shipments.value.forEach((shipment) => {
    if (shipment.status !== 'delivered') return;

    const key = new Date(shipment.createdAt).toISOString().slice(0, 10);
    if (deliveredTotals[key] === undefined) return;

    deliveredTotals[key] += 1;
    if (new Date(shipment.actualDelivery) <= new Date(shipment.scheduledDelivery)) {
      onTimeTotals[key] += 1;
    }
  });

  return buckets.map((key) => {
    const deliveredCount = deliveredTotals[key];
    if (!deliveredCount) return 0;
    return Number(((onTimeTotals[key] / deliveredCount) * 100).toFixed(1));
  });
});

const kpiMetrics = computed(() => ({
  totalShipments: Number(kpis.value?.totalShipments || 0),
  onTimeRate: Number(kpis.value?.onTimeRate || 0),
  avgTransitTime: Number(kpis.value?.avgTransitDays ?? 0),
  openExceptions: Number(kpis.value?.openExceptions || 0),
}));

const activeRegionCount = computed(() => {
  const populated = regions.value.filter((item) => Number(item.totalShipments || 0) > 0 || Number(item.openExceptions || 0) > 0);
  return populated.length || regions.value.length;
});

const selectedRegion = computed(() => regions.value.find((item) => item.id === filters.region) || null);

const selectedRegionLabel = computed(() => selectedRegion.value?.name || 'All regions');

const activeWindowLabel = computed(() => `${uiFilters.value.dateRange}-day window`);

const exceptionChipColor = computed(() => {
  const count = kpiMetrics.value.openExceptions;
  if (count >= 8) return 'error';
  if (count >= 3) return 'warning';
  return 'success';
});

const exceptionChipLabel = computed(() => {
  const count = kpiMetrics.value.openExceptions;
  if (count === 0) return 'No open exceptions';
  if (count === 1) return '1 open exception';
  return `${count} open exceptions`;
});

const overviewStatusLabel = computed(() => {
  if (loading.value) return 'Refreshing Snapshot';
  if (error.value) return 'Data Needs Attention';
  if (kpiMetrics.value.onTimeRate < 90) return 'Below Target';
  if (kpiMetrics.value.openExceptions > 0) return 'Exceptions Active';
  return 'On Track';
});

const overviewHeadline = computed(() => {
  if (loading.value) return 'Refreshing operations snapshot';
  if (error.value) return 'Dashboard data is temporarily unavailable';
  if (kpiMetrics.value.onTimeRate < 90) return 'On-time performance needs attention';
  if (kpiMetrics.value.openExceptions > 0) return 'Exceptions remain active across the network';
  return 'Operations are on target';
});

const overviewSummary = computed(() => {
  if (loading.value) {
    return 'Refreshing shipment health, regional performance, and exception load for the current operating window.';
  }

  if (error.value) {
    return 'Restore the dashboard feed to resume the current leadership readout.';
  }

  const rate = kpiMetrics.value.onTimeRate;
  const shipmentCount = kpiMetrics.value.totalShipments.toLocaleString();
  const exceptionCount = kpiMetrics.value.openExceptions;
  const regionCopy = filters.region === 'all'
    ? `${activeRegionCount.value} regions in scope`
    : `${selectedRegionLabel.value} in focus`;

  return `${shipmentCount} shipments are in scope for the ${activeWindowLabel.value.toLowerCase()}. ${rate.toFixed(1)}% are on time, and ${exceptionCount} open exceptions remain active across ${regionCopy.toLowerCase()}.`;
});

const overviewMetrics = computed(() => [
  {
    label: 'Window',
    value: activeWindowLabel.value,
  },
  {
    label: 'Scope',
    value: filters.region === 'all' ? `${activeRegionCount.value} regions` : selectedRegionLabel.value,
  },
  {
    label: 'Performance Gap',
    value: `${Math.abs(kpiMetrics.value.onTimeRate - 90).toFixed(1)} pts ${kpiMetrics.value.onTimeRate >= 90 ? 'above' : 'below'}`,
  },
]);

const kpiTrends = computed(() => ({
  totalShipments: {
    direction: 'flat',
    text: `${activeWindowLabel.value} in scope`,
  },
  onTimeRate: {
    direction: kpiMetrics.value.onTimeRate >= 90 ? 'up' : 'down',
    text: kpiMetrics.value.onTimeRate >= 90
      ? `${(kpiMetrics.value.onTimeRate - 90).toFixed(1)} pts above target`
      : `${(90 - kpiMetrics.value.onTimeRate).toFixed(1)} pts below target`,
  },
  avgTransitTime: {
    direction: kpiMetrics.value.avgTransitTime <= 2.5 ? 'down' : 'up',
    text: filters.region === 'all'
      ? 'Average across active regions'
      : `Average in ${selectedRegionLabel.value}`,
  },
  openExceptions: {
    direction: kpiMetrics.value.openExceptions === 0
      ? 'down'
      : kpiMetrics.value.openExceptions >= 8 ? 'up' : 'flat',
    text: kpiMetrics.value.openExceptions === 0
      ? 'No issues in queue'
      : kpiMetrics.value.openExceptions >= 8 ? 'Needs immediate follow-up' : 'Contained but active',
  },
}));

const hasNoData = computed(() => {
  if (loading.value || error.value || sessionExpired.value) return false;

  const shipmentCount = Number(shipments.value?.length || 0);
  const exceptionCount = Number(exceptions.value?.length || 0);
  const volumeTotal = shipmentVolumeData.value.reduce((total, value) => total + value, 0);

  return shipmentCount === 0 && exceptionCount === 0 && volumeTotal === 0;
});

watch(sessionExpired, (isExpired) => {
  if (!isExpired) return;

  showSessionExpiredSnackbar.value = true;

  if (sessionRedirectTimer) {
    clearTimeout(sessionRedirectTimer);
  }

  sessionRedirectTimer = setTimeout(() => {
    localStorage.removeItem('ff-token');
    localStorage.removeItem('ff-user');
    router.replace('/login');
    sessionRedirectTimer = null;
  }, 1200);
});
</script>

<style scoped>
.dashboard-content {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.overview-panel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.4rem 1.5rem;
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, rgba(242, 101, 34, 0.18), transparent 32%),
    linear-gradient(135deg, rgba(18, 34, 63, 0.98) 0%, rgba(27, 42, 74, 0.94) 55%, rgba(35, 55, 96, 0.92) 100%);
  box-shadow: 0 22px 44px rgba(17, 31, 58, 0.18);
  color: #f5f8ff;
}

.overview-copy {
  max-width: 760px;
}

.overview-kicker {
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(226, 235, 252, 0.7);
}

.overview-title {
  font-size: clamp(1.55rem, 2vw, 2.15rem);
  line-height: 1.1;
  font-weight: 750;
}

.overview-summary {
  max-width: 62ch;
  color: rgba(236, 242, 255, 0.86);
  font-size: 1rem;
  line-height: 1.6;
}

.overview-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.overview-metric {
  min-width: 130px;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.overview-metric-label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(226, 235, 252, 0.66);
}

.overview-metric-value {
  display: block;
  font-size: 1rem;
  line-height: 1.2;
  color: #ffffff;
}

.overview-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.65rem;
}

.overview-chips :deep(.v-chip) {
  font-weight: 600;
}

.is-filter-transitioning {
  opacity: 0.985;
  transform: translateY(1px);
}

.dashboard-skeleton {
  border-radius: 14px;
}

.dashboard-section-anchor {
  scroll-margin-top: 112px;
}

.chart-skeleton {
  min-height: 320px;
}

@media (max-width: 959px) {
  .overview-panel {
    flex-direction: column;
    padding: 1.25rem;
  }

  .overview-chips {
    justify-content: flex-start;
  }

  .overview-metric {
    min-width: calc(50% - 0.5rem);
  }

  .chart-skeleton {
    min-height: 260px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dashboard-content {
    transition: none;
  }
}
</style>
