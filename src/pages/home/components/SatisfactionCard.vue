<template>
  <Box
    width="custom"
    custom-width="100%"
    margin-y="0"
    border="1px solid #d8d8d8"
    bg-color="#f3f3f3"
    :shadow="false"
  >
    <section class="card">
      <h3 class="label">이번달 만족 지수</h3>

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
  </Box>
</template>

<script setup>
import Box from "@/components/Box.vue";
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
  padding: 36px 32px;
}

.label {
  margin: 0 0 24px;
  font-size: 26px;
  font-weight: 800;
  color: #111;
}

.score-wrap {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 24px;
}

.score {
  font-size: 56px;
  font-weight: 800;
  line-height: 1;
  color: #111;
}

.percent {
  font-size: 28px;
  font-weight: 800;
  color: #111;
}

.progress-bar {
  height: 28px;
}
</style>
