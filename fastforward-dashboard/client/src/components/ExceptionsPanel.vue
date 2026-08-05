<template>
  <v-card class="analytics-card" rounded="xl" elevation="0">
    <v-card-title class="text-subtitle-1 font-weight-bold pb-1">Exceptions Panel</v-card-title>
    <v-card-subtitle class="pb-3">Operational exceptions matching current filters</v-card-subtitle>

    <div v-if="filteredRows.length === 0">
      <EmptyState
        icon="mdi-alert-circle-outline"
        title="No Exceptions Match These Filters"
        message="No exception records were found for the current status, region, and date filters."
        action-label="Reset Filters"
        @action-click="emit('reset-request')"
      />
    </div>

    <div v-else>
      <div v-if="smAndDown" class="mobile-exception-list px-3 pb-3">
        <v-card
          v-for="item in filteredRows"
          :key="item.id"
          variant="outlined"
          rounded="lg"
          class="mb-3 mobile-exception-card"
          role="button"
          tabindex="0"
          @click="openDetailsFromItem(item)"
          @keydown.enter="openDetailsFromItem(item)"
          @keydown.space.prevent="openDetailsFromItem(item)"
        >
          <v-card-text class="py-3 px-4">
            <div class="d-flex align-center justify-space-between mb-2 ga-3">
              <span class="font-weight-medium">{{ item.shipmentId }}</span>
              <v-chip :color="severityStyle(item.severity).color" size="small" variant="tonal">
                {{ severityStyle(item.severity).label }}
              </v-chip>
            </div>

            <div class="d-flex align-center ga-2 mb-2">
              <v-chip color="primary" size="x-small" variant="outlined">
                {{ formatLabel(item.status) }}
              </v-chip>
              <span class="text-caption text-medium-emphasis">{{ item.id }}</span>
            </div>

            <div class="d-flex flex-column ga-1 text-body-2">
              <div class="d-flex justify-space-between ga-4">
                <span class="text-medium-emphasis">Type</span>
                <span>{{ formatLabel(item.type) }}</span>
              </div>
              <div class="d-flex justify-space-between ga-4">
                <span class="text-medium-emphasis">Region</span>
                <span>{{ item.region }}</span>
              </div>
              <div class="d-flex justify-space-between ga-4">
                <span class="text-medium-emphasis">Assigned</span>
                <span>{{ item.assignedTo }}</span>
              </div>
              <div class="d-flex justify-space-between ga-4">
                <span class="text-medium-emphasis">Age</span>
                <span>{{ item.age }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <v-data-table
        v-else
        :headers="headers"
        :items="filteredRows"
        item-value="id"
        density="comfortable"
        hover
        class="exceptions-table"
        :hide-default-footer="filteredRows.length <= 10"
        @click:row="openDetails"
      >
        <template #item.severity="{ item }">
          <v-chip :color="severityStyle(item.severity).color" size="small" variant="tonal">
            {{ severityStyle(item.severity).label }}
          </v-chip>
        </template>

        <template #item.shipmentId="{ item }">
          <span class="font-weight-medium">{{ item.shipmentId }}</span>
        </template>

        <template #item.type="{ item }">
          {{ formatLabel(item.type) }}
        </template>

        <template #item.region="{ item }">
          {{ item.region }}
        </template>

        <template #item.assignedTo="{ item }">
          {{ item.assignedTo }}
        </template>

        <template #item.age="{ item }">
          <span class="text-medium-emphasis">{{ item.age }}</span>
        </template>
      </v-data-table>
    </div>

    <v-navigation-drawer
      v-model="drawerOpen"
      location="right"
      temporary
      width="420"
      class="exception-drawer"
    >
      <div v-if="selectedException" class="pa-5 d-flex flex-column ga-4">
        <div class="d-flex align-start justify-space-between ga-3">
          <div>
            <div class="text-overline text-medium-emphasis">Exception Details</div>
            <h3 class="text-h6 font-weight-bold">{{ selectedException.id }}</h3>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="drawerOpen = false" />
        </div>

        <v-divider />

        <div class="d-flex align-center ga-2">
          <v-chip :color="severityStyle(selectedException.severity).color" size="small" variant="tonal">
            {{ severityStyle(selectedException.severity).label }}
          </v-chip>
          <v-chip color="primary" size="small" variant="outlined">
            {{ formatLabel(selectedException.status) }}
          </v-chip>
        </div>

        <div class="d-flex flex-column ga-2 text-body-2">
          <div><span class="font-weight-medium">Shipment:</span> {{ selectedException.shipmentId }}</div>
          <div><span class="font-weight-medium">Type:</span> {{ formatLabel(selectedException.type) }}</div>
          <div><span class="font-weight-medium">Region:</span> {{ selectedException.region }}</div>
          <div><span class="font-weight-medium">Assigned To:</span> {{ selectedException.assignedTo }}</div>
          <div><span class="font-weight-medium">Age:</span> {{ selectedException.age }}</div>
        </div>

        <v-divider />

        <div>
          <div class="text-caption text-medium-emphasis mb-2">Description</div>
          <p class="text-body-2">{{ selectedException.description || 'No additional description provided.' }}</p>
        </div>
      </div>
    </v-navigation-drawer>
  </v-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import EmptyState from './EmptyState.vue';

const emit = defineEmits(['reset-request']);

const props = defineProps({
  exceptions: {
    type: Array,
    default: () => [],
  },
  filters: {
    type: Object,
    default: () => ({
      dateRange: 30,
      region: 'all',
      exceptionStatus: 'all',
    }),
  },
});

const headers = [
  { title: 'Severity', key: 'severity', sortable: true },
  { title: 'Shipment ID', key: 'shipmentId', sortable: true },
  { title: 'Type', key: 'type', sortable: true },
  { title: 'Region', key: 'region', sortable: true },
  { title: 'Assigned To', key: 'assignedTo', sortable: true },
  { title: 'Age', key: 'ageHours', sortable: true },
];

const drawerOpen = ref(false);
const selectedException = ref(null);
const { smAndDown } = useDisplay();

function severityStyle(severity) {
  const mapping = {
    critical: { label: 'Critical', color: 'error' },
    high: { label: 'High', color: 'deep-orange' },
    medium: { label: 'Medium', color: 'warning' },
    low: { label: 'Low', color: 'success' },
  };

  return mapping[severity] || { label: 'Unknown', color: 'grey' };
}

function formatLabel(value) {
  return String(value)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatAge(hours) {
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
}

const normalizedRows = computed(() => {
  const now = Date.now();

  return props.exceptions.map((item) => {
    const ageHours = Math.max(0, Math.floor((now - new Date(item.createdAt).getTime()) / 3600000));
    return {
      ...item,
      regionId: String(item.region || '').toLowerCase(),
      ageHours,
      age: formatAge(ageHours),
    };
  });
});

const filteredRows = computed(() => {
  const statusFilter = props.filters.exceptionStatus || 'all';
  const regionFilter = props.filters.region || 'all';
  const dateRange = Number(props.filters.dateRange || 30);
  const minCreatedAt = Date.now() - (dateRange * 24 * 60 * 60 * 1000);

  return normalizedRows.value.filter((item) => {
    const statusMatch = statusFilter === 'all' || item.status === statusFilter;
    const regionMatch = regionFilter === 'all' || item.regionId === regionFilter;
    const dateMatch = new Date(item.createdAt).getTime() >= minCreatedAt;
    return statusMatch && regionMatch && dateMatch;
  });
});

function openDetails(_, payload) {
  openDetailsFromItem(payload.item);
}

function openDetailsFromItem(item) {
  selectedException.value = item;
  drawerOpen.value = true;
}
</script>

<style scoped>
.analytics-card {
  border: 1px solid rgba(27, 42, 74, 0.08);
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 18px 40px rgba(17, 31, 58, 0.08);
}

.exceptions-table :deep(.v-table__wrapper) {
  overflow-x: auto;
}

.exceptions-table :deep(table) {
  min-width: 760px;
}

.exceptions-table :deep(tbody tr td) {
  transition: background-color 0.18s ease;
}

.mobile-exception-card {
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.mobile-exception-card:focus-visible {
  outline: 2px solid rgba(27, 42, 74, 0.35);
  outline-offset: 1px;
}

.exceptions-table :deep(tbody tr:focus-within td) {
  outline: 2px solid rgba(27, 42, 74, 0.35);
  outline-offset: -2px;
}

@media (max-width: 959px) {
  .exception-drawer {
    width: min(100vw, 380px) !important;
  }
}
</style>
