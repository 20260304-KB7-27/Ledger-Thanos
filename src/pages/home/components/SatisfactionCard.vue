<template>
  <section class="card">
    <p class="label">이번달 만족 지수</p>

    <div class="score-wrap">
      <strong class="score">{{ score }}</strong>
      <span class="percent">%</span>
    </div>

    <div class="progress-bar">
      <ProgressBarChart
        :key="score"
        :value="score"
        bar-color="#FFD400"
      />
    </div>
  </section>
</template>

<script setup>
import ProgressBarChart from "@/pages/home/components/ProgressBarChart.vue";

defineProps({
  score: {
    type: Number,
    default: 75,
  },
});
</script>

<style scoped>
.card {
  background: #f3f3f3;
  border: 1px solid #d8d8d8;
  border-radius: 36px;
  padding: 36px 48px;
}

.label {
  font-size: 20px;
  margin-bottom: 24px;
}

.score-wrap {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 24px;
}

.score {
  font-size: 64px;
  font-weight: 800;
}

.percent {
  font-size: 28px;
}

.progress-bar {
  height: 28px;
}
</style>
