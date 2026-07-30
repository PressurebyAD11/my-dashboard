<template>
  <v-card rounded="lg" elevation="1">
    <v-card-title class="text-subtitle-1 font-weight-bold pb-1">Shipment Volume</v-card-title>
    <v-card-subtitle class="pb-3">Daily shipment count over selected period</v-card-subtitle>
    <v-card-text class="chart-wrap">
      <div
        v-if="!hasData"
        class="chart-empty-state text-body-2 text-medium-emphasis"
        role="status"
        aria-live="polite"
      >
        No data for this period
      </div>
      <Bar v-else :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs';
import { useDisplay } from 'vuetify';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const props = defineProps({
  labels: {
    type: Array,
    default: () => ['Jul 1', 'Jul 2', 'Jul 3', 'Jul 4', 'Jul 5', 'Jul 6', 'Jul 7'],
  },
  values: {
    type: Array,
    default: () => [38, 45, 42, 54, 49, 60, 57],
  },
});

const { smAndDown } = useDisplay();
const prefersReducedMotion = ref(false);
let mediaQueryList = null;

function handleMotionPreferenceChange(event) {
  prefersReducedMotion.value = event.matches;
}

onMounted(() => {
  mediaQueryList = window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = mediaQueryList.matches;

  if (mediaQueryList.addEventListener) {
    mediaQueryList.addEventListener('change', handleMotionPreferenceChange);
    return;
  }

  mediaQueryList.addListener(handleMotionPreferenceChange);
});

onBeforeUnmount(() => {
  if (!mediaQueryList) return;

  if (mediaQueryList.removeEventListener) {
    mediaQueryList.removeEventListener('change', handleMotionPreferenceChange);
    return;
  }

  mediaQueryList.removeListener(handleMotionPreferenceChange);
});

const hasData = computed(() => props.values.some((value) => Number(value) > 0));

const chartData = computed(() => {
  const maxValue = Math.max(...props.values, 0);
  const lastIndex = props.values.length - 1;
  const backgroundColor = props.values.map((value, index) => {
    if (index === lastIndex || value === maxValue) return '#F26522';
    return '#1B2A4A';
  });

  return {
    labels: props.labels,
    datasets: [
      {
        label: 'Shipments',
        data: props.values,
        backgroundColor,
        borderRadius: 6,
        maxBarThickness: smAndDown.value ? 18 : 26,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 120,
  animation: {
    duration: prefersReducedMotion.value ? 0 : 280,
    easing: 'easeOutQuad',
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y} shipments`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: {
        color: '#475569',
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: smAndDown.value ? 6 : 10,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        color: '#475569',
      },
      grid: {
        color: 'rgba(27, 42, 74, 0.08)',
      },
    },
  },
}));
</script>

<style scoped>
.chart-wrap {
  height: clamp(240px, 32vw, 320px);
}

@media (max-width: 959px) {
  .chart-wrap {
    height: 260px;
  }
}

.chart-empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
