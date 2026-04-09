<template>
  <Box
    class="card-box summary-card-box"
    width="custom"
    custom-width="100%"
    margin-y="0"
    border="1.5px solid #d9d9d9"
    bg-color="#ffffff"
    :shadow="true"
  >
    <article class="summary-card">
      <h2 class="section-title">활동 요약</h2>

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
.card-box :deep(.common-box) {
  border-radius: 24px;
  box-shadow: 0 5px 8px rgba(120, 105, 76, 0.22);
}

.card-box :deep(.box-content) {
  padding: 0;
}

.summary-card {
  min-height: 340px;
  padding: 28px 22px 20px;
}

.section-title {
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 800;
  color: #111111;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.summary-item {
  background: #ffa0a3;
  border-radius: 18px;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #111111;
}

.summary-label {
  font-size: 20px;
  font-weight: 700;
}

.summary-value {
  font-size: 26px;
  font-weight: 800;
  color: #7e6337;
}
</style>
