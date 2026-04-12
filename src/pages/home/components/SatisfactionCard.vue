<template>
  <Box
    class="card-box"
    width="custom"
    custom-width="100%"
    margin-y="0"
    border="var(--border-width) solid var(--card-border)"
    bg-color="var(--card-bg)"
    :shadow="false"
  >
    <section class="card">
      <h3>이번달 만족 지수</h3>

      <div class="score-wrap">
        <strong class="score">{{ score }}</strong>
        <span class="percent">%</span>
      </div>

      <div class="progress-bar">
        <ProgressBarChart
          :key="score"
          :value="score"
          bar-color="var(--accent-strong)"
        />
      </div>
    </section>
  </Box>
</template>

<script setup>
import Box from "@/components/Box.vue";
import ProgressBarChart from "@/components/ProgressBarChart.vue";
defineProps({
  score: {
    type: Number,
    default: 75,
  },
});
</script>

<style scoped>
.card {
  padding: 40px 32px;
  min-height: 220px;
  height: 100%;
  box-sizing: border-box;
}

h3 {
  margin: 0 0 36px;
  font-size: 22px;
  font-weight: 600;
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
  color: var(--text-primary);
}

.percent {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
}

.progress-bar {
  height: 28px;
}
</style>
