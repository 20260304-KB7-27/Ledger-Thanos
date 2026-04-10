<template>
  <div class="local-item">
    <div class="rank">{{ rank }}</div>

    <div class="info">
      <div class="region">{{ region }}</div>
      <div class="period">{{ period }}</div>
    </div>

    <div class="amount">{{ formatCurrency(amount) }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  rank: {
    type: Number,
    default: 1,
  },
  region: {
    type: String,
    default: '',
  },
  period: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    default: 0,
  },
});

const formatCurrency = (value) => {
  return `${value.toLocaleString()}원`;
};
</script>

<style scoped>
.local-item {
  width: 100%;
  min-height: 68px;
  display: grid;
  grid-template-columns: 36px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-card);
  background: var(--surface-secondary);
  box-sizing: border-box;
  transition: var(--card-transition);
}

.local-item:hover {
  transform: var(--card-hover-lift);
  box-shadow: var(--card-hover-shadow);
}

.rank {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  color: var(--button-primary-text);
  background: var(--accent-primary);
}

.info {
  min-width: 0;
}

.region {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.period {
  margin-top: 2px;
  font-size: 12px;
  color: var(--text-muted);
}

.amount {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}
</style>