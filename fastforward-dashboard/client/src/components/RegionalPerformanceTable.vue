<template>
  <v-card rounded="lg" elevation="1">
    <v-card-title class="text-subtitle-1 font-weight-bold pb-1">Regional Performance</v-card-title>
    <v-card-subtitle class="pb-3">Compare shipment health across regions</v-card-subtitle>

    <v-data-table
      :headers="headers"
      :items="items"
      item-value="id"
      density="comfortable"
      hover
      class="regional-table"
      :row-props="rowProps"
      @click:row="onRowClick"
    >
      <template #item.name="{ item }">
        <div class="d-flex align-center ga-2">
          <span class="font-weight-medium">{{ item.name }}</span>
          <v-icon
            v-if="selectedRegion === item.id"
            icon="mdi-map-marker"
            color="secondary"
            size="16"
          />
        </div>
      </template>

      <template #item.totalShipments="{ item }">
        <span class="font-weight-medium">{{ Number(item.totalShipments).toLocaleString() }}</span>
      </template>

      <template #item.onTimeRate="{ item }">
        <v-chip :color="onTimeColor(item.onTimeRate)" size="small" variant="tonal">
          {{ Number(item.onTimeRate).toFixed(1) }}%
        </v-chip>
      </template>

      <template #item.avgTransitDays="{ item }">
        {{ Number(item.avgTransitDays).toFixed(1) }} d
      </template>

      <template #item.openExceptions="{ item }">
        <div class="d-flex align-center ga-2">
          <v-chip :color="exceptionSeverity(item.openExceptions).color" size="small" variant="tonal">
            {{ item.openExceptions }}
          </v-chip>
          <span class="text-caption text-medium-emphasis">
            {{ exceptionSeverity(item.openExceptions).label }}
          </span>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
const emit = defineEmits(['region-click']);

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
  selectedRegion: {
    type: String,
    default: 'all',
  },
});

const headers = [
  { title: 'Region Name', key: 'name', sortable: true },
  { title: 'Total Shipments', key: 'totalShipments', sortable: true, align: 'end' },
  { title: 'On-Time Rate', key: 'onTimeRate', sortable: true, align: 'end' },
  { title: 'Avg Transit Days', key: 'avgTransitDays', sortable: true, align: 'end' },
  { title: 'Open Exceptions', key: 'openExceptions', sortable: true, align: 'start' },
];

function onTimeColor(rate) {
  if (rate >= 95) return 'success';
  if (rate >= 90) return 'warning';
  return 'error';
}

function exceptionSeverity(openCount) {
  if (openCount > 5) return { label: 'critical', color: 'error' };
  if (openCount > 3) return { label: 'high', color: 'deep-orange' };
  if (openCount > 1) return { label: 'medium', color: 'warning' };
  return { label: 'low', color: 'success' };
}

function onRowClick(_, payload) {
  emit('region-click', {
    id: payload.item.id,
    name: payload.item.name,
  });
}

function rowProps(payload) {
  return {
    class: payload.item.id === selectedRegion ? 'selected-row' : '',
  };
}
</script>

<style scoped>
.regional-table :deep(tbody tr) {
  cursor: pointer;
}

.regional-table :deep(tbody tr.selected-row td) {
  background-color: rgba(242, 101, 34, 0.08);
}
</style>
