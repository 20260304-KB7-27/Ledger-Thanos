<template>
  <div class="progress-chart-wrap">
    <div class="progress-bg"></div>
    <canvas ref="progressBar"></canvas>
  </div>
</template>

<!-- 바 크기 조절 시 데이터 바와 배경바 함께 조절 필요! -->
<script setup>
import { Chart, registerables } from 'chart.js';
import { ref, onMounted, onBeforeUnmount } from 'vue';

Chart.register(...registerables); // chart.js 요소 등록
const props = defineProps({
  value: {
    type: Number,
    required: true,
  },
});

const progressBar = ref(null); // canvas fef와 연결

let chartInstance = null; // 차트 인스턴스 초기화
const maxValue = 100;

const chartData = {
  labels: ['progress'],
  datasets: [
    {
      label: '만족 지수',
      data: [props.value],
      backgroundColor: '#FFE99A',
      borderRadius: 20,
      borderSkipped: false,
      barThickness: 40,
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
      max: maxValue,
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
  width: 100%;
  height: 40px;
}

.progress-bg {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 39px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 20px;
  transform: translateY(-50%);
  z-index: 0;
}

canvas {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 40px;
}
</style>
