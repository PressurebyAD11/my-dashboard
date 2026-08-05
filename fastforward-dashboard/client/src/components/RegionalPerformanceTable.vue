<template>
  <v-card class="analytics-card" rounded="xl" elevation="0">
    <v-card-title class="text-subtitle-1 font-weight-bold pb-1">Regional Performance</v-card-title>
    <v-card-subtitle class="pb-3">Compare shipment health across regions</v-card-subtitle>

    <div v-if="smAndDown" class="mobile-region-list px-3 pb-3">
      <v-card
        v-for="item in items"
        :key="item.id"
        variant="outlined"
        rounded="lg"
        class="mb-3 mobile-row-card"
        :class="{ 'selected-mobile-card': selectedRegion === item.id }"
        role="button"
        tabindex="0"
        @click="emitRegion(item)"
        @keydown.enter="emitRegion(item)"
        @keydown.space.prevent="emitRegion(item)"
      >
        <v-card-text class="py-3 px-4">
          <div class="d-flex align-center justify-space-between mb-2">
            <div class="font-weight-medium">{{ item.name }}</div>
            <v-icon
              v-if="selectedRegion === item.id"
              icon="mdi-map-marker"
              color="secondary"
              size="16"
            />
          </div>

          <div class="d-flex flex-column ga-1 text-body-2">
            <div class="d-flex justify-space-between ga-4">
              <span class="text-medium-emphasis">Total Shipments</span>
              <span class="font-weight-medium">{{ Number(item.totalShipments).toLocaleString() }}</span>
            </div>
            <div class="d-flex justify-space-between ga-4">
              <span class="text-medium-emphasis">On-Time Rate</span>
              <v-chip :color="onTimeColor(item.onTimeRate)" size="small" variant="tonal">
                {{ Number(item.onTimeRate).toFixed(1) }}%
              </v-chip>
            </div>
            <div class="d-flex justify-space-between ga-4">
              <span class="text-medium-emphasis">Avg Transit</span>
              <span>{{ Number(item.avgTransitDays).toFixed(1) }} d</span>
            </div>
            <div class="d-flex justify-space-between align-center ga-4">
              <span class="text-medium-emphasis">Open Exceptions</span>
              <div class="d-flex align-center ga-2">
                <v-chip :color="exceptionSeverity(item.openExceptions).color" size="small" variant="tonal">
                  {{ item.openExceptions }}
                </v-chip>
                <span class="text-caption text-medium-emphasis">
                  {{ exceptionSeverity(item.openExceptions).label }}
                </span>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <v-data-table
      v-else
      :headers="headers"
      :items="items"
      item-value="id"
      density="comfortable"
      hover
      class="regional-table"
      :hide-default-footer="items.length <= 10"
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
import { useDisplay } from 'vuetify';

const emit = defineEmits(['region-click']);

const props = defineProps({
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

const { smAndDown } = useDisplay();

function onTimeColor(rate) {
  if (rate >= 95) return 'success';
  if (rate >= 90) return 'warning';
  return 'error';
}

function exceptionSeverity(openCount) {
  if (openCount > 5) return { label: 'Critical', color: 'error' };
  if (openCount > 3) return { label: 'High', color: 'deep-orange' };
  if (openCount > 1) return { label: 'Medium', color: 'warning' };
  return { label: 'Low', color: 'success' };
}

function onRowClick(_, payload) {
  emitRegion(payload.item);
}

function emitRegion(item) {
  emit('region-click', {
    id: item.id,
    name: item.name,
  });
}

function rowProps(payload) {
  return {
    class: payload.item.id === props.selectedRegion ? 'selected-row' : '',
  };
}
</script>

<style scoped>
.analytics-card {
  border: 1px solid rgba(27, 42, 74, 0.08);
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 18px 40px rgba(17, 31, 58, 0.08);
}

.regional-table :deep(tbody tr) {
  cursor: pointer;
  transition: background-color 0.18s ease;
}

.mobile-row-card {
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.mobile-row-card:focus-visible {
  outline: 2px solid rgba(27, 42, 74, 0.35);
  outline-offset: 1px;
}

.selected-mobile-card {
  border-color: rgba(242, 101, 34, 0.6);
  box-shadow: 0 0 0 1px rgba(242, 101, 34, 0.2);
}

.regional-table :deep(.v-table__wrapper) {
  overflow-x: auto;
}

.regional-table :deep(table) {
  min-width: 700px;
}

.regional-table :deep(tbody tr.selected-row td) {
  background-color: rgba(242, 101, 34, 0.08);
}

.regional-table :deep(tbody tr:focus-within td) {
  outline: 2px solid rgba(27, 42, 74, 0.35);
  outline-offset: -2px;
}
</style>
