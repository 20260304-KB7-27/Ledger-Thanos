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
    <section class="card">
      <h3>최근 거래</h3>

      <div v-if="list.length > 0" class="list">
        <Box
            class="deal-box"
            v-for="item in list"
            :key="item.id"
            width="custom"
            custom-width="100%"
            margin-y="0"
            border="1px solid #d9d9d9"
            bg-color="#ffffff"
            :shadow="false"
        >
          <div class="item">
            <div class="left">
              <span class="circle">
                <template v-if="item.type === 'income'">
                  <div class="category-icon income-icon">수입</div>
                </template>
                <template v-else>
                  <component :is="getCategoryMeta(item.category).icon" :size="20" class="category-icon"/>
                </template>
              </span>

              <div class="info">
                <strong class="name">{{ item.memo || '기록 없음' }}</strong>

                <div class="meta-row">
                  <div class="location" v-if="item.type === 'expense' && item.location">
                    <img :src="locationIcon" alt="위치 아이콘" class="location-icon"/>
                    <span>{{ item.location }}</span>
                  </div>
                  <div v-else class="location income-meta">
                    <span>수입</span>
                  </div>

                  <div class="date">
                    <span>{{ formatTransactionDate(item.date) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <strong class="price">
              {{ item.type === 'expense' ? '-' : '+' }}{{ item.amount.toLocaleString() }}원
            </strong>
          </div>
        </Box>
      </div>

      <p v-else class="empty-text">최근 거래가 없어요.</p>
    </section>
  </Box>
</template>

<script setup>
import Box from "@/components/Box.vue";
import locationIcon from '@/assets/icon/ico_location_black.svg';
import {getCategoryMeta} from '@/pages/home/home.js';

const formatTransactionDate = (dateString) => {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${day} ${hours}:${minutes}`;
};

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.card {
  padding: 40px 32px;
  min-height: 220px;
  box-sizing: border-box;
}

h3 {
  margin: 0 0 36px;
  font-size: 22px;
  font-weight: 600;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.empty-text {
  font-size: 20px;
  font-weight: 500;
  color: #555;
}

.item {
  width: 100%;
  min-height: 78px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  box-sizing: border-box;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.circle {
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

.category-icon {
  pointer-events: none;
}

.income-icon {
  font-size: 11px;
  font-weight: 800;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.name {
  font-size: 20px;
  font-weight: 700;
  color: #222;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #444;
}

.income-meta {
  color: #666;
}

.location-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.date {
  font-size: 13px;
  font-weight: 500;
  color: #777;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #222;
  white-space: nowrap;
}
</style>
