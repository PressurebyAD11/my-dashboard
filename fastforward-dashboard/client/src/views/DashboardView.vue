<template>
  <DashboardLayout>
    <section
      class="d-flex flex-column ga-4 dashboard-content"
      :class="{ 'is-filter-transitioning': isFilterTransitioning }"
    >
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
        </v-col>

        <v-col cols="12" md="6" lg="6">
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
        </v-col>
      </v-row>

      <v-row v-if="!hasNoData" dense>
        <v-col cols="12" xl="7">
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
        </v-col>

        <v-col cols="12" xl="5">
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

const kpiTrends = {
  totalShipments: { direction: 'flat', text: 'Updated from live data' },
  onTimeRate: { direction: 'flat', text: 'Updated from live data' },
  avgTransitTime: { direction: 'flat', text: 'Updated from live data' },
  openExceptions: { direction: 'flat', text: 'Updated from live data' },
};

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

.is-filter-transitioning {
  opacity: 0.985;
  transform: translateY(1px);
}

.dashboard-skeleton {
  border-radius: 14px;
}

.chart-skeleton {
  min-height: 320px;
}

@media (max-width: 959px) {
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
