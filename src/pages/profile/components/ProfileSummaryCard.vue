<template>
  <Box
    class="card-box"
    width="custom"
    custom-width="100%"
    margin-y="0"
    border="1.5px solid #d9d9d9"
    bg-color="#ffffff"
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
  background: #ffe99a;
  border-radius: 18px;
  padding: 20px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #111111;
}

.summary-label {
  font-size: 18px;
  font-weight: 600;
}

.summary-value {
  font-size: 18px;
  font-weight: 600;
  color: #111111;
}
</style>
