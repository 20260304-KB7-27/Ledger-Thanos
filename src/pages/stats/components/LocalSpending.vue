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
  border-radius: 18px;
  background: #f3e8bf;
  box-sizing: border-box;
}

.rank {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
  color: #222;
  background: #ff9f0a;
}

.info {
  min-width: 0;
}

.region {
  font-size: 14px;
  font-weight: 700;
  color: #333;
}

.period {
  margin-top: 2px;
  font-size: 12px;
  color: #666;
}

.amount {
  font-size: 14px;
  font-weight: 700;
  color: #333;
  white-space: nowrap;
}
</style>