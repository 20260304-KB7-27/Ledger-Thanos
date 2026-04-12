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
  const filtered = [...props.items]
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    labels: filtered.map((item) => item.category),
    datasets: [
      {
        data: filtered.map((item) => item.amount),
        backgroundColor: ['#FF9898', '#FFAAAA', '#f8bcbc', '#f9caca', '#fad7d7'].slice(
          0,
          filtered.length
        ),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };
};

const createChart = () => {
  if (!canvasRef.value) return;

  chartInstance = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: makeData(),
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '55%',
      animation: {
        duration: 900,
        easing: 'easeOutQuart',
      },
      layout: {
        padding: 8,
      },
      font: {
        family: CHART_FONT_FAMILY,
      },
      plugins: {
        legend: {
          display: false,
          labels: {
            font: {
              family: CHART_FONT_FAMILY,
            },
          },
        },
        tooltip: {
          enabled: false,
          titleFont: {
            family: CHART_FONT_FAMILY,
          },
          bodyFont: {
            family: CHART_FONT_FAMILY,
          },
        },
      },
    },
    plugins: [
      {
        id: 'outerRingPlugin',
        afterDraw(chart) {
          const meta = chart.getDatasetMeta(0);
          const arc = meta?.data?.[0];
          if (!arc) return;

          const { ctx } = chart;
          const x = arc.x;
          const y = arc.y;
          const outerRadius = arc.outerRadius;

          ctx.save();
          ctx.beginPath();
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = '#ffd1bd';
          ctx.arc(x, y, outerRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        },
      },
      {
        id: 'insideLabelPlugin',
        afterDatasetsDraw(chart) {
          const { ctx } = chart;
          const meta = chart.getDatasetMeta(0);
          const labels = chart.data.labels;
          const values = chart.data.datasets[0].data;

          ctx.save();
          ctx.fillStyle = '#6a3d3d';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          meta.data.forEach((arc, index) => {
            const angle = (arc.startAngle + arc.endAngle) / 2;
            const radius = (arc.innerRadius + arc.outerRadius) / 2;
            const x = arc.x + Math.cos(angle) * radius;
            const y = arc.y + Math.sin(angle) * radius;

            ctx.font = `700 11px ${CHART_FONT_FAMILY}`;
            ctx.fillText(String(labels[index]), x, y - 8);

            ctx.font = `800 11px ${CHART_FONT_FAMILY}`;
            ctx.fillText(formatAmount(values[index]), x, y + 8);
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
  height: 280px;
  padding: 0 8px 8px;
  box-sizing: border-box;
}

canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>