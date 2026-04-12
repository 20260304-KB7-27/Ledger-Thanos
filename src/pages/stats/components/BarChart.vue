<template>
  <div class="chart-wrap">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js';
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

Chart.register(...registerables);

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const canvasRef = ref(null);
let chartInstance = null;

const formatAmount = (value) => `${Number(value || 0).toLocaleString()}원`;

const getCssVar = (name, fallback = '') => {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
};

const makeData = () => {
  const sorted = [...props.items].sort((a, b) => b.amount - a.amount).slice(0, 5);

  return {
    labels: sorted.map((item) => item.region),
    datasets: [
      {
        data: sorted.map((item) => item.amount),
        backgroundColor: getCssVar('--accent-strong', '#f4a3a3'),
        borderSkipped: false,
        borderRadius: 0,
        barThickness: 34,
      },
    ],
  };
};

const createChart = () => {
  if (!canvasRef.value) return;

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: makeData(),
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 900,
        easing: 'easeOutQuart',
      },
      layout: {
        padding: {
          top: 8,
          right: 20,
          bottom: 8,
          left: 8,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false,
            drawBorder: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          grid: {
            display: false,
            drawBorder: false,
          },
          border: {
            display: true,
            color: '#777',
            width: 2,
          },
          ticks: {
            color: '#444',
            font: {
              size: 14,
              weight: 500,
            },
            padding: 10,
          },
        },
      },
    },
    plugins: [
      {
        id: 'valueLabelPlugin',
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          const meta = chart.getDatasetMeta(0);
          const dataset = chart.data.datasets[0];

          ctx.save();
          ctx.fillStyle = '#4a2f2f';
          ctx.font = '500 14px sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';

          meta.data.forEach((bar, index) => {
            const value = dataset.data[index];
            ctx.fillText(formatAmount(value), bar.x - 10, bar.y);
          });

          ctx.restore();
        },
      },
    ],
  });
};

const updateChart = () => {
  if (!chartInstance) return;
  const nextData = makeData();
  chartInstance.data.labels = nextData.labels;
  chartInstance.data.datasets[0].data = nextData.datasets[0].data;
  chartInstance.data.datasets[0].backgroundColor =
    nextData.datasets[0].backgroundColor;
  chartInstance.update();
};

onMounted(async () => {
  await nextTick();
  createChart();
});

watch(
  () => props.items,
  () => {
    updateChart();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

<style scoped>
.chart-wrap {
  position: relative;
  width: 100%;
  height: 300px;
  padding: 4px 8px 8px;
  box-sizing: border-box;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>