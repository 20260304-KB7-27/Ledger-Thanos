<template>
  <Box width="custom" customWidth="100%" bgColor="#FFFDF7" marginY="12px">
    <h3 class="panel-title">
      상세 내역
      <span v-if="selectedGu" class="gu-tag">{{ selectedGu }}</span>
    </h3>
    <p v-if="!selectedGu" class="hint-msg">지역을 선택하세요</p>
    <ul v-else-if="transactions.length > 0" class="tx-list">
      <li v-for="tx in transactions" :key="tx.id" class="tx-item">
        <span class="tx-icon">{{ CATEGORY_ICON[tx.category] ?? '💳' }}</span>
        <div class="tx-info">
          <span class="tx-memo">{{ tx.memo }}</span>
          <span class="tx-location">{{ tx.location }}</span>
        </div>
        <span class="tx-amount" :class="tx.type">
          {{ tx.type === 'expense' ? '-' : '+' }}{{ tx.amount.toLocaleString() }}원
        </span>
      </li>
    </ul>
    <p v-else class="empty-msg">해당 지역 거래 내역이 없습니다.</p>
  </Box>
</template>

<script setup>
import Box from '@/components/Box.vue';

defineProps({
  transactions: { type: Array, default: () => [] },
  selectedGu: { type: String, default: null },
});

const CATEGORY_ICON = {
  restaurant: '🍽️',
  cafe: '☕',
  transport: '🚌',
  shopping: '🛍️',
  grocery: '🛒',
  health: '💊',
  entertainment: '🎬',
  education: '📚',
  utility: '🏠',
  salary: '💰',
  other: '📝',
};
</script>

<style scoped>
.panel-title {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.gu-tag {
  font-size: 11px;
  background: #ff8c00;
  color: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.tx-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 180px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tx-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: 1px solid #f0e8c8;
}

.tx-item:last-child {
  border-bottom: none;
}

.tx-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.tx-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tx-memo {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

.tx-location {
  font-size: 11px;
  color: #999;
}

.tx-amount {
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.tx-amount.expense {
  color: #e53935;
}

.tx-amount.income {
  color: #43a047;
}

.hint-msg,
.empty-msg {
  font-size: 13px;
  color: #999;
  text-align: center;
  padding: 12px 0;
}
</style>
