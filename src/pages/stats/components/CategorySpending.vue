<template>
  <div class="category-item">
    <div class="left">
      <div class="icon" :style="{ backgroundColor: iconColor }"></div>
      <div class="category">{{ category }}</div>
    </div>

    <div class="amount">{{ formatCurrency(amount) }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  category: {
    type: String,
    default: '',
  },
  amount: {
    type: Number,
    default: 0,
  },
  iconColor: {
    type: String,
    default: '#d9d9d9',
  },
});

const formatCurrency = (value) => {
  return `${value.toLocaleString()}원`;
};
</script>

<style scoped>
.category-item {
  width: 100%;
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 18px;
  background: #FFF8DD;
  box-sizing: border-box;
}

.left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.icon {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category {
  font-size: 14px;
  font-weight: 700;
  color: #444;
}

.amount {
  font-size: 14px;
  font-weight: 700;
  color: #444;
  white-space: nowrap;
}
</style>