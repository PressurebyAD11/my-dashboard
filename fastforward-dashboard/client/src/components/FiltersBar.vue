<template>
  <v-card rounded="lg" elevation="1" class="mb-4">
    <v-card-text class="pa-4">
      <v-row class="align-center" dense>
        <v-col cols="12" md="5">
          <div class="text-caption text-medium-emphasis mb-2">Date Range</div>
          <v-chip-group v-model="dateRange" mandatory selected-class="text-primary">
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

        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="region"
            :items="regionOptions"
            item-title="label"
            item-value="value"
            label="Region"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select
            v-model="exceptionStatus"
            :items="exceptionStatusOptions"
            item-title="label"
            item-value="value"
            label="Exception Status"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="1" class="d-flex justify-md-end">
          <v-btn
            variant="text"
            color="secondary"
            prepend-icon="mdi-refresh"
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
</script>
