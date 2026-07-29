<template>
  <v-card rounded="lg" elevation="1">
    <v-card-title class="text-subtitle-1 font-weight-bold pb-1">On-Time Delivery</v-card-title>
    <v-card-subtitle class="pb-3">Daily on-time percentage vs 90% target</v-card-subtitle>
    <v-card-text class="chart-wrap">
      <Line :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
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
      pointRadius: 4,
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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: true,
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
        color: '#64748B',
      },
    },
    y: {
      suggestedMin: 80,
      suggestedMax: 100,
      ticks: {
        callback: (value) => `${value}%`,
        color: '#64748B',
      },
      grid: {
        color: 'rgba(27, 42, 74, 0.08)',
      },
    },
  },
};
</script>

<style scoped>
.chart-wrap {
  height: 290px;
}
</style>
