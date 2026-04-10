<template>
  <Box width="custom" customWidth="100%" marginY="12px" :shadow="false">
    <h3 class="panel-title">
      상세 내역
      <span v-if="selectedGu" class="gu-tag">{{ selectedGu }}</span>
    </h3>
    <p v-if="!selectedGu" class="hint-msg">지역을 선택하세요</p>
    <ul v-else-if="transactions.length > 0" class="tx-list">
      <li v-for="tx in transactions" :key="tx.id" class="tx-item">
        <span class="tx-icon">
          <component :is="getCategoryMeta(tx.category).icon" :size="18" />
        </span>
        <div class="tx-info">
          <span class="tx-memo">{{ tx.memo }}</span>
          <div class="tx-meta">
            <span class="tx-location">{{ tx.location }}</span>
            <span v-if="tx.date" class="tx-date">{{ formatDateTime(tx.date) }}</span>
          </div>
        </div>
        <span class="tx-amount" :class="tx.type">
          {{ tx.type === 'expense' ? '-' : '+'
          }}{{ tx.amount.toLocaleString() }}원
        </span>
      </li>
    </ul>
    <p v-else class="empty-msg">해당 지역 거래 내역이 없습니다.</p>
  </Box>
</template>

<script setup>
import Box from '@/components/Box.vue';
import { getCategoryMeta } from '@/pages/home/home.js';

defineProps({
  transactions: { type: Array, default: () => [] },
  selectedGu: { type: String, default: null },
});

const formatDateTime = (value) => {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};
</script>

<style scoped>
.panel-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.gu-tag {
  font-size: 11px;
  background: var(--accent-primary);
  color: var(--button-primary-text);
  padding: 2px 8px;
  border-radius: var(--radius-chip);
  font-weight: 600;
}

.tx-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 165px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-strong) transparent;
}

.tx-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-bottom: var(--border-width) solid var(--border-soft);
}

.tx-item:last-child {
  border-bottom: none;
}

.tx-icon {
  width: 36px;
  height: 36px;
  min-width: 36px;
  min-height: 36px;
  max-width: 36px;
  max-height: 36px;
  flex: 0 0 36px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tx-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tx-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tx-memo {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 500;
}

.tx-location {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.tx-date {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}

.tx-amount {
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.tx-amount.expense {
  color: var(--amount-minus);
}

.tx-amount.income {
  color: var(--amount-plus);
}

.hint-msg,
.empty-msg {
  font-size: 14px;
  color: var(--text-muted);
  text-align: center;
  padding: 12px 0;
}
</style>
