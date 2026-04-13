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
    <article class="summary-card">
      <h3>활동 요약</h3>

      <div class="summary-list">
        <div class="summary-item">
          <span class="summary-label">총 기록</span>
          <strong class="summary-value">{{ summary.totalCount }}</strong>
        </div>
        <div class="summary-item">
          <span class="summary-label">기록 일수</span>
          <strong class="summary-value">{{ summary.activeDays }}</strong>
        </div>
        <div class="summary-item">
          <span class="summary-label">만족 비율</span>
          <strong class="summary-value">{{ summary.satisfactionRate }}</strong>
        </div>
      </div>
    </article>
  </Box>
</template>

<script setup>
import Box from '@/components/Box.vue';

defineProps({
  summary: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.summary-card {
  min-height: 340px;
  padding: 28px 22px 20px;
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 36px;
  font-size: 22px;
  font-weight: 600;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.summary-item {
  background: var(--surface-emphasis);
  border-radius: var(--radius-card);
  padding: 20px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-primary);
  transition: var(--card-transition);
}

.summary-item:hover {
  transform: var(--card-hover-lift);
  box-shadow: var(--card-hover-shadow);
}

.summary-label {
  font-size: 18px;
  font-weight: 600;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

@media (min-width: 1500px) {
  .summary-card {
    height: 100%;
  }

  .summary-list {
    flex: 1 1 auto;
    justify-content: center;
  }
}
</style>
