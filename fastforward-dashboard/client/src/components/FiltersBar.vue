<template>
  <v-card rounded="xl" elevation="0" class="mb-4 filter-card">
    <v-card-text class="px-5 py-4">
      <v-row class="align-center" dense>
        <v-col cols="12" lg="5">
          <div class="text-caption text-medium-emphasis mb-2">Date Range</div>
          <v-chip-group
            v-model="dateRange"
            mandatory
            selected-class="text-primary"
            aria-label="Date range filter"
          >
            <v-chip
              v-for="option in dateRangeOptions"
              :key="option.value"
              :value="option.value"
              filter
              variant="outlined"
              color="primary"
            >
              {{ option.label }}
            </v-chip>
          </v-chip-group>
        </v-col>

        <v-col cols="12" lg="7" class="d-flex align-center">
          <v-select
            v-model="region"
            :items="regionOptions"
            item-title="label"
            item-value="value"
            label="Region"
            aria-label="Region filter"
            variant="outlined"
            density="comfortable"
            hide-details
            class="filter-dropdown"
          />
          <v-select
            v-model="exceptionStatus"
            :items="exceptionStatusOptions"
            item-title="label"
            item-value="value"
            label="Exception Status"
            aria-label="Exception status filter"
            variant="outlined"
            density="comfortable"
            hide-details
            class="filter-dropdown ml-2"
          />
          <v-btn
            variant="text"
            color="secondary"
            prepend-icon="mdi-refresh"
            class="reset-btn ml-8 flex-shrink-0"
            aria-label="Reset all dashboard filters"
            @click="resetFilters"
          >
            Reset Filters
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue';

const emit = defineEmits(['filters-change', 'reset-filters']);

const props = defineProps({
  initialFilters: {
    type: Object,
    default: () => ({
      dateRange: 30,
      region: 'all',
      exceptionStatus: 'all',
    }),
  },
});

const dateRangeOptions = [
  { label: '7 days', value: 7 },
  { label: '14 days', value: 14 },
  { label: '30 days', value: 30 },
];

const regionOptions = [
  { label: 'All', value: 'all' },
  { label: 'Northeast', value: 'northeast' },
  { label: 'Southeast', value: 'southeast' },
  { label: 'Midwest', value: 'midwest' },
  { label: 'West', value: 'west' },
  { label: 'Southwest', value: 'southwest' },
];

const exceptionStatusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'In-Progress', value: 'in-progress' },
  { label: 'Resolved', value: 'resolved' },
];

const dateRange = ref(props.initialFilters.dateRange ?? 30);
const region = ref(props.initialFilters.region ?? 'all');
const exceptionStatus = ref(props.initialFilters.exceptionStatus ?? 'all');

function currentFilters() {
  return {
    dateRange: dateRange.value,
    region: region.value,
    exceptionStatus: exceptionStatus.value,
  };
}

function resetFilters() {
  dateRange.value = 30;
  region.value = 'all';
  exceptionStatus.value = 'all';
  emit('reset-filters', currentFilters());
}

watch([dateRange, region, exceptionStatus], () => {
  emit('filters-change', currentFilters());
}, { immediate: true });

watch(
  () => props.initialFilters,
  (incoming) => {
    if (!incoming) return;
    if (incoming.dateRange !== undefined && incoming.dateRange !== dateRange.value) {
      dateRange.value = incoming.dateRange;
    }
    if (incoming.region && incoming.region !== region.value) {
      region.value = incoming.region;
    }
    if (incoming.exceptionStatus && incoming.exceptionStatus !== exceptionStatus.value) {
      exceptionStatus.value = incoming.exceptionStatus;
    }
  },
  { deep: true }
);
</script>

<style scoped>
.filter-card {
  border: 1px solid rgba(27, 42, 74, 0.08);
  background:
    radial-gradient(circle at top right, rgba(242, 101, 34, 0.08), transparent 24%),
    linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 16px 36px rgba(17, 31, 58, 0.08);
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.filter-card:focus-within {
  border-color: rgba(27, 42, 74, 0.18);
  box-shadow: 0 0 0 2px rgba(27, 42, 74, 0.12), 0 16px 36px rgba(17, 31, 58, 0.08);
}

.filter-dropdown {
  flex: 1 1 0;
  min-width: 0;
}

.reset-btn {
  font-weight: 700;
  text-transform: uppercase;
}

.filter-card :deep(.v-chip-group) {
  gap: 0.45rem;
}

.filter-card :deep(.v-chip) {
  border-radius: 999px;
  font-weight: 600;
}

.filter-card :deep(.v-chip.v-chip--selected) {
  background: #1b2a4a;
  color: #ffffff;
  border-color: #1b2a4a;
  box-shadow: 0 10px 18px rgba(27, 42, 74, 0.16);
}

.filter-card :deep(.v-field) {
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.86);
}


</style>
