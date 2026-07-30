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
          <RegionalPerformanceTable
            :items="regionalRows"
            :selected-region="activeFilters.region"
            @region-click="onRegionRowClick"
          />
        </section>
        <section id="openExceptions-section" class="drilldown-anchor">
          <ExceptionsPanel
            :exceptions="exceptionRows"
            :filters="activeFilters"
            @reset-request="resetFiltersToDefault"
          />
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
import RegionalPerformanceTable from '../components/RegionalPerformanceTable.vue';
import ExceptionsPanel from '../components/ExceptionsPanel.vue';

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

function resetFiltersToDefault() {
  activeFilters.value = {
    dateRange: 30,
    region: 'all',
    exceptionStatus: 'all',
  };
}

function onRegionRowClick(region) {
  const nextRegion = activeFilters.value.region === region.id ? 'all' : region.id;
  activeFilters.value = {
    ...activeFilters.value,
    region: nextRegion,
  };
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

const regionalRows = computed(() => {
  return [
    { id: 'northeast', name: 'Northeast', totalShipments: 246, onTimeRate: 95.3, avgTransitDays: 2.2, openExceptions: 1 },
    { id: 'southeast', name: 'Southeast', totalShipments: 261, onTimeRate: 92.4, avgTransitDays: 2.4, openExceptions: 2 },
    { id: 'midwest', name: 'Midwest', totalShipments: 234, onTimeRate: 89.8, avgTransitDays: 2.0, openExceptions: 4 },
    { id: 'west', name: 'West', totalShipments: 298, onTimeRate: 90.6, avgTransitDays: 3.1, openExceptions: 6 },
    { id: 'southwest', name: 'Southwest', totalShipments: 245, onTimeRate: 88.1, avgTransitDays: 2.9, openExceptions: 5 },
  ];
});

const exceptionRows = computed(() => {
  return [
    {
      id: 'EXC-0042',
      shipmentId: 'FF-2026-04356',
      type: 'weather-delay',
      severity: 'high',
      status: 'in-progress',
      region: 'West',
      assignedTo: 'Trevor Blake',
      createdAt: '2026-07-17T18:10:05.742Z',
    },
    {
      id: 'EXC-0043',
      shipmentId: 'FF-2026-04400',
      type: 'carrier-issue',
      severity: 'critical',
      status: 'open',
      region: 'Southwest',
      assignedTo: 'Samir Das',
      createdAt: '2026-07-17T00:14:03.397Z',
    },
    {
      id: 'EXC-0044',
      shipmentId: 'FF-2026-04310',
      type: 'damaged',
      severity: 'critical',
      status: 'open',
      region: 'Southeast',
      assignedTo: 'Priya Nair',
      createdAt: '2026-07-21T17:12:49.927Z',
    },
    {
      id: 'EXC-0045',
      shipmentId: 'FF-2026-04351',
      type: 'customs-hold',
      severity: 'high',
      status: 'in-progress',
      region: 'Midwest',
      assignedTo: 'Hannah Kim',
      createdAt: '2026-07-20T19:49:20.492Z',
    },
    {
      id: 'EXC-0046',
      shipmentId: 'FF-2026-04262',
      type: 'carrier-issue',
      severity: 'low',
      status: 'resolved',
      region: 'Northeast',
      assignedTo: 'Samir Das',
      createdAt: '2026-07-28T07:05:00.095Z',
    },
    {
      id: 'EXC-0050',
      shipmentId: 'FF-2026-04360',
      type: 'weather-delay',
      severity: 'high',
      status: 'open',
      region: 'West',
      assignedTo: 'Darius Cole',
      createdAt: '2026-07-27T09:43:00.870Z',
    },
    {
      id: 'EXC-0052',
      shipmentId: 'FF-2026-04238',
      type: 'weather-delay',
      severity: 'medium',
      status: 'open',
      region: 'Northeast',
      assignedTo: 'Marcus Johnson',
      createdAt: '2026-07-17T18:23:44.178Z',
    },
    {
      id: 'EXC-0055',
      shipmentId: 'FF-2026-04348',
      type: 'carrier-issue',
      severity: 'critical',
      status: 'open',
      region: 'Midwest',
      assignedTo: 'Priya Nair',
      createdAt: '2026-07-29T05:36:40.793Z',
    },
    {
      id: 'EXC-0056',
      shipmentId: 'FF-2026-04392',
      type: 'address-error',
      severity: 'high',
      status: 'open',
      region: 'Southwest',
      assignedTo: 'Darius Cole',
      createdAt: '2026-07-29T10:04:11.094Z',
    },
    {
      id: 'EXC-0062',
      shipmentId: 'FF-2026-04301',
      type: 'customs-hold',
      severity: 'low',
      status: 'in-progress',
      region: 'Southeast',
      assignedTo: 'Marcus Johnson',
      createdAt: '2026-07-12T06:28:07.734Z',
    },
  ];
});
</script>

<style scoped>
.drilldown-anchor {
  scroll-margin-top: 88px;
}
</style>
