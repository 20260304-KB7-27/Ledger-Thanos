<template>
  <Box width="custom" customWidth="100%" marginY="12px" :shadow="false">
    <h3 class="panel-title">전체 지역 통계</h3>
    <div class="stats-list">
      <div class="stat-item">
        <span class="stat-label">거래 지역 수</span>
        <span class="stat-value">{{ regionCount }}개</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">거래 건 수</span>
        <span class="stat-value">{{ txCount }}건</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">총 가격</span>
        <span class="stat-value">{{ totalAmount.toLocaleString() }}원</span>
      </div>
    </div>
  </Box>
</template>

<script setup>
import { computed } from 'vue';
import Box from '@/components/Box.vue';

const props = defineProps({
  summary: { type: Array, default: () => [] },
  transactions: { type: Array, default: () => [] },
});

const regionCount = computed(() => props.summary.length);
const txCount = computed(() => props.transactions.length);
const totalAmount = computed(() => props.transactions.reduce((s, t) => s + t.amount, 0));
</script>

<style scoped>
.panel-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0e8c8;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
</style>
