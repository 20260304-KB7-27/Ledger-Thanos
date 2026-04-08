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
import { ref, onMounted, onBeforeUnmount } from 'vue';

Chart.register(...registerables); // chart.js 요소 등록
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

const progressBar = ref(null); // canvas fef와 연결
let chartInstance = null; // 차트 인스턴스 초기화

const chartData = {
  labels: ['progress'],
  datasets: [
    {
      label: '만족 지수',
      data: [props.value],
      backgroundColor: props.barColor,
      borderRadius: props.barRadius,
      borderSkipped: false,
      barThickness: props.height,
    },
  ],
};

const chartOptions = {
  indexAxis: 'y',
  responsive: true, // 반응형 설정
  maintainAspectRatio: false, //.progress-chart-wrap의 height 적용
  plugins: {
    legend: {
      display: false, // 라벨 숨김
    },
    tooltip: {
      enabled: false, //튤팁 숨김
    },
  },

  scales: {
    x: {
      display: false, // x축 숨김
      min: 0,
      max: props.maxValue,
      grid: {
        display: false, // 격자 숨김
        drawBorder: false, // 축 테두리선 숨김
      },
    },
    y: {
      display: false, // y축 숨김
      grid: {
        display: false, // 격자 숨김
        drawBorder: false, // 축 테두리선 숨김
      },
    },
  },
};

onMounted(() => {
  if (!progressBar.value) return;

  chartInstance = new Chart(progressBar.value, {
    type: 'bar',
    data: chartData,
    options: chartOptions,
  });
});

onBeforeUnmount(() => {
  // 메모리 정리
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
}
</style>
