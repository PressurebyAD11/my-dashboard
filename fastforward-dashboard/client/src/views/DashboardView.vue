<template>
  <DashboardLayout>
    <section>
      <FiltersBar @filters-change="onFiltersChange" @reset-filters="onFiltersReset" />

      <KpiCards :metrics="kpiMetrics" :trends="kpiTrends" @card-click="onKpiCardClick" />

      <div class="mt-6 d-flex flex-column ga-4">
        <section id="totalShipments-section" class="drilldown-anchor">
          <h2 class="text-h6">Shipment Volume Trend</h2>
        </section>
        <section id="onTimeRate-section" class="drilldown-anchor">
          <h2 class="text-h6">On-Time Delivery Rate</h2>
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
import { nextTick, ref } from 'vue';
import DashboardLayout from '../layouts/DashboardLayout.vue';
import FiltersBar from '../components/FiltersBar.vue';
import KpiCards from '../components/KpiCards.vue';

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
</script>

<style scoped>
.drilldown-anchor {
  scroll-margin-top: 88px;
}
</style>
