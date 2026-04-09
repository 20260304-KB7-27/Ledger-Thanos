<template>
  <div class="deal-item">
    <div class="left">
      <div class="icon" :style="{ backgroundColor: iconColor }"></div>

      <div class="text-group">
        <div class="title">{{ title }}</div>
        <div class="location"><img :src="icoLocation" width="15px" height="15px" alt="아이콘 오류"> {{ location }}</div>
      </div>
    </div>

    <div class="amount">{{ formatCurrency(amount) }}</div>
  </div>
</template>

<script setup>
import icoLocation from '@/assets/icon/ico_location_black.svg';
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  location: {
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
.deal-item {
  width: 100%;
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border: 1px solid #d9d9d9;
  border-radius: 24px;
  background: #f8f8f8;
  box-sizing: border-box;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
}

.text-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
}

.location {
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

.amount {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  white-space: nowrap;
}
</style>