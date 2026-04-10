<template>
  <Box
      width="custom"
      custom-width="100%"
      margin-y="0"
      border="1px solid #d8d8d8"
      bg-color="#f3f3f3"
      :shadow="false"
  >
    <section class="card">
      <h3>최근 거래</h3>

      <div v-if="list.length > 0" class="list">
        <Box
            v-for="item in list"
            :key="item.id"
            width="custom"
            custom-width="100%"
            margin-y="0"
            border="1px solid #d8d8d8"
            bg-color="#f8f8f8"
            :shadow="false"
        >
          <div class="item">
            <!-- 왼쪽 -->
            <div class="left">
              <div>
                <span class="circle">
                  <template v-if="item.type === 'income'">
                    <div class="category-icon">수입</div>
                  </template>
                  <template v-else>
                    <component :is="getCategoryMeta(item.category).icon" :size="20" class="category-icon"/>
                  </template>
                </span>
              </div>

              <div class="info">
                <div class="date">
                  <span>{{ formatTransactionDate(item.date) }}</span>
                </div>

                <strong class="name">{{ item.memo }}</strong>

                <div class="location" v-if="item.type === 'expense'">
                  <img :src="locationIcon" alt="위치 아이콘" class="location-icon"/>
                  <span>{{ item.location }} </span>
                </div>
              </div>
            </div>

            <!-- 오른쪽 금액 -->
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

  return `${year}-${month}-${day} ${hours}:${minutes}`;
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
  padding: 48px 40px;
}

/* 제목 */
h3 {
  margin: 0 0 36px;
  font-size: 36px;
  font-weight: 900;
}

/* 리스트 */
.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list :deep(.common-box) {
  border-radius: 999px;
}

.empty-text {
  font-size: 20px;
  font-weight: 500;
  color: #555;
}

/* 한 줄 */
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 36px;
}

/* 왼쪽 */
.left {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* 썸네일 */
.thumb {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumb-icon {
  font-size: 30px;
  line-height: 1;
}

/* 텍스트 영역 */
.info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.name {
  font-size: 28px;
  font-weight: 700;
}

.location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 20px;
  color: #333;
}

.location-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.date {
  font-size: 20px;
  color: #333;
}

/* 금액 */
.price {
  font-size: 30px;
  font-weight: 900;
}

.circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7edd0;
  border: 1px solid #d8c9a0;
  color: #805B2E;
  cursor: pointer;
  transition: all 0.2s;
}
</style>
