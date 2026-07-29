<template>
  <v-card rounded="lg" elevation="1">
    <v-card-title class="text-subtitle-1 font-weight-bold pb-1">Shipment Volume</v-card-title>
    <v-card-subtitle class="pb-3">Daily shipment count over selected period</v-card-subtitle>
    <v-card-text class="chart-wrap">
      <Bar :data="chartData" :options="chartOptions" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
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
        maxBarThickness: 26,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
        color: '#64748B',
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
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
