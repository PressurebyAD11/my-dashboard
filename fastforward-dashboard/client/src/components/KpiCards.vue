<template>
  <v-row dense>
    <v-col
      v-for="card in cards"
      :key="card.key"
      cols="12"
      sm="6"
      lg="3"
    >
      <v-card
        class="kpi-card"
        rounded="xl"
        elevation="0"
        role="button"
        tabindex="0"
        @click="handleCardClick(card.key)"
        @keydown.enter="handleCardClick(card.key)"
        @keydown.space.prevent="handleCardClick(card.key)"
      >
        <v-card-text class="pa-4 pa-md-5">
          <div class="d-flex align-start justify-space-between mb-3">
            <div class="text-body-2 text-medium-emphasis">{{ card.label }}</div>

            <v-avatar :color="`${card.accent}15`" size="34">
              <v-icon :icon="card.icon" :color="card.accent" size="20" />
            </v-avatar>
          </div>

          <div class="text-h4 font-weight-bold text-primary mb-0">{{ card.displayValue }}</div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';

const emit = defineEmits(['card-click']);

const props = defineProps({
  metrics: {
    type: Object,
    default: () => ({
      totalShipments: 0,
      onTimeRate: 0,
      avgTransitTime: 0,
      openExceptions: 0,
    }),
  },
  trends: {
    type: Object,
    default: () => ({
      totalShipments: { direction: 'up', text: '+0.0% vs last period' },
      onTimeRate: { direction: 'flat', text: 'No change vs last period' },
      avgTransitTime: { direction: 'down', text: '-0.0d vs last period' },
      openExceptions: { direction: 'up', text: '+0 vs last period' },
    }),
  },
});

const onTimeColor = computed(() => {
  const rate = Number(props.metrics.onTimeRate || 0);
  if (rate >= 95) return 'success';
  if (rate >= 90) return 'warning';
  return 'error';
});

function handleCardClick(key) {
  emit('card-click', {
    key,
    section: `${key}-section`,
  });
}

const cards = computed(() => {
  return [
    {
      key: 'totalShipments',
      label: 'Total Shipments',
      displayValue: Number(props.metrics.totalShipments || 0).toLocaleString(),
      icon: 'mdi-truck',
      accent: 'primary',
    },
    {
      key: 'onTimeRate',
      label: 'On-Time Rate',
      displayValue: `${Number(props.metrics.onTimeRate || 0).toFixed(1)}%`,
      icon: 'mdi-clock-check',
      accent: onTimeColor.value,
    },
    {
      key: 'avgTransitTime',
      label: 'Avg Transit Time',
      displayValue: `${Number(props.metrics.avgTransitTime || 0).toFixed(1)} d`,
      icon: 'mdi-timer-sand',
      accent: 'secondary',
    },
    {
      key: 'openExceptions',
      label: 'Open Exceptions',
      displayValue: Number(props.metrics.openExceptions || 0).toLocaleString(),
      icon: 'mdi-alert-circle',
      accent: 'error',
    },
  ];
});
</script>

<style scoped>
.kpi-card {
  position: relative;
  overflow: hidden;
  min-height: 142px;
  cursor: pointer;
  border: 1px solid rgba(27, 42, 74, 0.08);
  background:
    radial-gradient(circle at top right, rgba(242, 101, 34, 0.06), transparent 22%),
    linear-gradient(180deg, #ffffff 0%, #f9fbff 100%);
  box-shadow: 0 18px 40px rgba(17, 31, 58, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
}

.kpi-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: linear-gradient(90deg, #1b2a4a 0%, #f26522 100%);
}

.kpi-card:hover,
.kpi-card:focus-visible {
  transform: translateY(-3px);
  border-color: rgba(27, 42, 74, 0.14);
  box-shadow: 0 24px 42px rgba(17, 31, 58, 0.12);
}
</style>
