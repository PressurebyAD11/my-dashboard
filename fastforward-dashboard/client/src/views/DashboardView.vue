<template>
  <DashboardLayout>
    <section>
      <FiltersBar @filters-change="onFiltersChange" @reset-filters="onFiltersReset" />

      <KpiCards :metrics="kpiMetrics" :trends="kpiTrends" @card-click="onKpiCardClick" />

      <div class="mt-6 d-flex flex-column ga-4">
        <section id="totalShipments-section" class="drilldown-anchor">
          <ShipmentVolumeChart :labels="chartLabels" :values="shipmentVolumeData" />
        </section>
        <section id="onTimeRate-section" class="drilldown-anchor">
          <OnTimeDeliveryChart :labels="chartLabels" :values="onTimeRateData" />
        </section>
        <section id="avgTransitTime-section" class="drilldown-anchor">
          <h2 class="text-h6">Transit Time Analysis</h2>
        </section>
        <section id="openExceptions-section" class="drilldown-anchor">
          <h2 class="text-h6">Open Exceptions</h2>
        </section>
      </div>
    </section>
  </DashboardLayout>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import FiltersBar from '../components/FiltersBar.vue';
import KpiCards from '../components/KpiCards.vue';
import ShipmentVolumeChart from '../components/ShipmentVolumeChart.vue';
import OnTimeDeliveryChart from '../components/OnTimeDeliveryChart.vue';

const activeFilters = ref({
  dateRange: 30,
  region: 'all',
  exceptionStatus: 'all',
});

const kpiMetrics = {
  totalShipments: 1284,
  onTimeRate: 93.7,
  avgTransitTime: 3.6,
  openExceptions: 8,
};

const kpiTrends = {
  totalShipments: { direction: 'up', text: '+6.4% vs last 30d' },
  onTimeRate: { direction: 'down', text: '-0.8 pts vs last 30d' },
  avgTransitTime: { direction: 'up', text: '+0.3d vs last 30d' },
  openExceptions: { direction: 'up', text: '+2 vs last 30d' },
};

async function onKpiCardClick(payload) {
  await nextTick();
  const target = document.getElementById(payload.section);
  if (!target) return;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onFiltersChange(filters) {
  activeFilters.value = filters;
}

function onFiltersReset(filters) {
  activeFilters.value = filters;
}

const chartLabels = computed(() => {
  const days = activeFilters.value.dateRange;
  const now = new Date();

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(now);
    day.setDate(now.getDate() - (days - 1 - index));
    return day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
});

const shipmentVolumeData = computed(() => {
  const days = activeFilters.value.dateRange;
  const regionBoostMap = {
    all: 0,
    northeast: 4,
    southeast: 2,
    midwest: 3,
    west: 5,
    southwest: 1,
  };

  const regionBoost = regionBoostMap[activeFilters.value.region] ?? 0;

  return Array.from({ length: days }, (_, index) => {
    const seasonality = Math.sin((index / Math.max(days - 1, 1)) * Math.PI * 2) * 8;
    const trend = (index / Math.max(days - 1, 1)) * 4;
    return Math.max(12, Math.round(38 + seasonality + trend + regionBoost));
  });
});

const onTimeRateData = computed(() => {
  const days = activeFilters.value.dateRange;
  const statusPenaltyMap = {
    all: 0,
    open: -2.4,
    'in-progress': -1.2,
    resolved: 0.8,
  };

  const statusPenalty = statusPenaltyMap[activeFilters.value.exceptionStatus] ?? 0;

  return Array.from({ length: days }, (_, index) => {
    const wave = Math.sin((index / Math.max(days - 1, 1)) * Math.PI * 3) * 2.6;
    const drift = (index / Math.max(days - 1, 1)) * 1.1;
    const value = 91.2 + wave + drift + statusPenalty;
    return Math.min(98.5, Math.max(82.5, Number(value.toFixed(1))));
  });
});
</script>

<style scoped>
.drilldown-anchor {
  scroll-margin-top: 88px;
}
</style>
