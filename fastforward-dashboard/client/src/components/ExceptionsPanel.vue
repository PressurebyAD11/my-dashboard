<template>
  <v-card rounded="lg" elevation="1">
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

    <v-data-table
      v-else
      :headers="headers"
      :items="filteredRows"
      item-value="id"
      density="comfortable"
      hover
      class="exceptions-table"
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

    <v-navigation-drawer
      v-model="drawerOpen"
      location="right"
      temporary
      width="420"
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
  selectedException.value = payload.item;
  drawerOpen.value = true;
}
</script>
