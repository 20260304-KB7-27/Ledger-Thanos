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
        borderRadius: `${props.backgroundRadius}px`,
        borderColor: resolveCssVarColor(props.borderColor),
        borderWidth: `${props.borderWidth}px`,
      }"
    ></div>
    <canvas ref="progressBar"></canvas>
  </div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js';
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';

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
  barColor: {
    type: String,
    default: 'white',
  },
  barRadius: {
    type: Number,
    default: 20,
  },
  backgroundColor: {
    type: String,
    default: 'white',
  },
  backgroundRadius: {
    type: Number,
    default: 20,
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
          borderRadius: props.barRadius,
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
  chartInstance.update(); // 애니메이션 유지
};

const updateChartStyle = () => {
  if (!chartInstance) return;

  chartInstance.data.datasets[0].backgroundColor = resolveCssVarColor(
    props.barColor
  );
  chartInstance.data.datasets[0].borderRadius = props.barRadius;
  chartInstance.data.datasets[0].barThickness = props.height;
  chartInstance.options.scales.x.max = props.maxValue;

  chartInstance.update('none'); // 스타일만 즉시 반영
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
  () => props.barRadius,
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
