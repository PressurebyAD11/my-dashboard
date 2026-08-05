<template>
  <v-card class="analytics-card" rounded="xl" elevation="0">
    <v-card-title class="text-subtitle-1 font-weight-bold pb-1">On-Time Delivery</v-card-title>
    <v-card-subtitle class="pb-3">Daily on-time percentage vs 90% target</v-card-subtitle>
    <v-card-text class="chart-wrap">
      <div
        v-if="!hasData"
        class="chart-empty-state text-body-2 text-medium-emphasis"
        role="status"
        aria-live="polite"
      >
        No data for this period
      </div>
      <Line v-else :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { Line } from 'vue-chartjs';
import { useDisplay } from 'vuetify';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler);

const props = defineProps({
  labels: {
    type: Array,
    default: () => ['Jul 1', 'Jul 2', 'Jul 3', 'Jul 4', 'Jul 5', 'Jul 6', 'Jul 7'],
  },
  values: {
    type: Array,
    default: () => [92.1, 89.4, 93.2, 87.7, 91.4, 90.8, 88.9],
  },
  target: {
    type: Number,
    default: 90,
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

function valueColor(value) {
  if (value >= props.target) return '#4CAF50';
  if (value >= props.target - 5) return '#FF9800';
  return '#F44336';
}

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: 'On-time %',
      data: props.values,
      tension: 0.35,
      borderWidth: 3,
      segment: {
        borderColor: (ctx) => valueColor(ctx.p1.parsed.y),
      },
      pointBackgroundColor: props.values.map((value) => valueColor(value)),
      pointBorderColor: '#FFFFFF',
      pointBorderWidth: 2,
      pointRadius: smAndDown.value ? 2.5 : 4,
      pointHoverRadius: smAndDown.value ? 4 : 6,
      fill: true,
      backgroundColor: 'rgba(76, 175, 80, 0.08)',
    },
    {
      label: `${props.target}% target`,
      data: props.labels.map(() => props.target),
      borderColor: '#F44336',
      borderDash: [7, 6],
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  resizeDelay: 120,
  animation: {
    duration: prefersReducedMotion.value ? 0 : 300,
    easing: 'easeOutQuad',
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
      position: smAndDown.value ? 'bottom' : 'top',
      labels: {
        usePointStyle: true,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          if (context.datasetIndex !== 0) return `${props.target.toFixed(0)}% target`;
          return `${context.dataset.label}: ${Number(context.parsed.y).toFixed(1)}%`;
        },
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
      suggestedMin: 80,
      suggestedMax: 100,
      ticks: {
        callback: (value) => `${value}%`,
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
.analytics-card {
  border: 1px solid rgba(27, 42, 74, 0.08);
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 18px 40px rgba(17, 31, 58, 0.08);
}

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
