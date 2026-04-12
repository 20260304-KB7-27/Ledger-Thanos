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

const CHART_FONT_FAMILY = 'NPS, sans-serif';

const formatAmount = (value) => `${Number(value || 0).toLocaleString()}원`;

const makeData = () => {
  const sorted = [...props.items]
    .filter((item) => Number(item.amount) > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    labels: sorted.map((item) => item.region),
    datasets: [
      {
        data: sorted.map((item) => item.amount),
        backgroundColor: '#FFAAAA',
        borderSkipped: false,
        borderRadius: 0,
        barThickness: 44,
      },
    ],
  };
};

const valueLabelPlugin = {
  id: 'valueLabelPlugin',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea } = chart;
    const meta = chart.getDatasetMeta(0);
    const dataset = chart.data.datasets[0];

    ctx.save();
    ctx.fillStyle = '#4a2f2f';
    ctx.font = `700 14px ${CHART_FONT_FAMILY}`;
    ctx.textBaseline = 'middle';

    meta.data.forEach((bar, index) => {
      const value = dataset.data[index];
      const text = formatAmount(value);
      const textWidth = ctx.measureText(text).width;

      const insideX = bar.x - 12;
      const outsideX = Math.min(bar.x + 10, chartArea.right - 4);

      const hasEnoughRoomInside = bar.width > textWidth + 24;

      if (hasEnoughRoomInside) {
        ctx.textAlign = 'right';
        ctx.fillText(text, insideX, bar.y);
      } else {
        ctx.textAlign = 'left';
        ctx.fillText(text, outsideX, bar.y);
      }
    });

    ctx.restore();
  },
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
          left: 0,
          right: 0,
        },
      },
      font: {
        family: CHART_FONT_FAMILY,
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
            display: false,
          },
          ticks: {
            color: '#444',
            font: {
              family: CHART_FONT_FAMILY,
              size: 14,
              weight: 700,
            },
            padding: 12,
          },
        },
      },
    },
    plugins: [valueLabelPlugin],
  });
};

const updateChart = () => {
  if (!chartInstance) return;

  const nextData = makeData();
  chartInstance.data.labels = nextData.labels;
  chartInstance.data.datasets[0].data = nextData.datasets[0].data;
  chartInstance.data.datasets[0].backgroundColor =
    nextData.datasets[0].backgroundColor;
  chartInstance.data.datasets[0].barThickness =
    nextData.datasets[0].barThickness;

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
  height: 100%;
  min-height: 0;
  padding: 8px 12px 12px;
  box-sizing: border-box;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
