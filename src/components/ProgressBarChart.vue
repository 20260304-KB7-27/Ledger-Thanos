<template>
  <div
    ref="chartWrap"
    class="progress-chart-wrap"
    :style="{
      width: props.width,
      height: `${props.height}px`,
    }"
  >
    <div
      class="progress-bg"
      :style="{
        height: `${props.height}px`,
        background: resolveCssVarColor(props.backgroundColor),
        borderRadius: resolvedRadius,
        borderColor: resolveCssVarColor(props.borderColor),
        borderWidth: `${props.borderWidth}px`,
      }"
    ></div>
    <canvas ref="progressBar"></canvas>
  </div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js';
import { ref, onMounted, onBeforeUnmount, nextTick, watch, computed } from 'vue';

Chart.register(...registerables);

const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
  maxValue: {
    type: Number,
    default: 100,
  },
  themeKey: {
    type: String,
    default: '',
  },
  barColor: {
    type: String,
    default: 'white',
  },
  backgroundColor: {
    type: String,
    default: 'white',
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: Number,
    default: 40,
  },
  borderColor: {
    type: String,
    default: '#D9D9D9',
  },
  borderWidth: {
    type: Number,
    default: 1,
  },
});

const chartWrap = ref(null);
const progressBar = ref(null);
let chartInstance = null;

const resolveCssVarColor = (color) => {
  if (!color) return color;

  const trimmed = String(color).trim();

  if (trimmed.startsWith('var(') && trimmed.endsWith(')')) {
    const varName = trimmed.slice(4, -1).trim();
    const baseEl = chartWrap.value || document.documentElement;
    const resolved = getComputedStyle(baseEl).getPropertyValue(varName).trim();
    return resolved || trimmed;
  }

  return trimmed;
};

const getCssVar = (name, fallback = '') => {
  const baseEl = chartWrap.value || document.documentElement;
  const value = getComputedStyle(baseEl).getPropertyValue(name).trim();
  return value || fallback;
};

const getRadiusValue = () => {
  return getCssVar('--radius-card', '20px');
};

const getRadiusNumber = () => {
  const radius = getRadiusValue();
  const parsed = parseFloat(radius);
  return Number.isNaN(parsed) ? 20 : parsed;
};

const resolvedRadius = computed(() => getRadiusValue());

const createChart = () => {
  if (!progressBar.value) return;

  chartInstance = new Chart(progressBar.value, {
    type: 'bar',
    data: {
      labels: ['progress'],
      datasets: [
        {
          label: '만족 지수',
          data: [0],
          backgroundColor: resolveCssVarColor(props.barColor),
          borderRadius: getRadiusNumber(),
          borderSkipped: false,
          barThickness: props.height,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
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
          min: 0,
          max: props.maxValue,
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          display: false,
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
    },
  });
};

const updateChartValue = () => {
  if (!chartInstance) return;

  chartInstance.data.datasets[0].data = [props.value];
  chartInstance.update();
};

const updateChartStyle = () => {
  if (!chartInstance) return;

  chartInstance.data.datasets[0].backgroundColor = resolveCssVarColor(
    props.barColor
  );
  chartInstance.data.datasets[0].borderRadius = getRadiusNumber();
  chartInstance.data.datasets[0].barThickness = props.height;
  chartInstance.options.scales.x.max = props.maxValue;

  chartInstance.update('none');
};

onMounted(async () => {
  await nextTick();

  if (!progressBar.value) return;

  createChart();

  requestAnimationFrame(() => {
    updateChartValue();
  });
});

watch(
  () => props.value,
  () => {
    updateChartValue();
  }
);

watch(
  () => props.themeKey,
  () => {
    updateChartStyle();
  }
);

watch(
  () => props.barColor,
  () => {
    updateChartStyle();
  }
);

watch(
  () => props.maxValue,
  () => {
    updateChartStyle();
  }
);

watch(
  () => props.height,
  () => {
    updateChartStyle();
  }
);

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

<style scoped>
.progress-chart-wrap {
  position: relative;
}

.progress-bg {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  border-style: solid;
  transform: translateY(-50%);
  z-index: 0;
  box-sizing: border-box;
}

canvas {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
}
</style>