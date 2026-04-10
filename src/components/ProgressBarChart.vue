<template>
  <div
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
        background: props.backgroundColor,
        borderRadius: `${props.backgroundRadius}px`,
        borderColor: props.borderColor,
        borderWidth: `${props.borderWidth}px`,
      }"
    ></div>
    <canvas ref="progressBar"></canvas>
  </div>
</template>

<script setup>
import { Chart, registerables } from 'chart.js';
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

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

const progressBar = ref(null);
let chartInstance = null;

onMounted(async () => {
  await nextTick();

  if (!progressBar.value) return;

  chartInstance = new Chart(progressBar.value, {
    type: 'bar',
    data: {
      labels: ['progress'],
      datasets: [
        {
          label: '만족 지수',
          data: [0], // 처음엔 0
          backgroundColor: props.barColor,
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

  requestAnimationFrame(() => {
    if (!chartInstance) return;
    chartInstance.data.datasets[0].data = [props.value];
    chartInstance.update();
  });
});

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
