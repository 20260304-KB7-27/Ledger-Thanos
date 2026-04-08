<template>
  <section class="card">
    <h3>최근 거래</h3>

    <div class="list">
      <div
          v-for="item in list"
          :key="item.id"
          class="item"
      >
        <!-- 왼쪽 -->
        <div class="left">
          <div
              class="thumb"
              :style="{
              backgroundColor: getCategoryMeta(item.category).backgroundColor,
              color: getCategoryMeta(item.category).textColor,
            }"
          >
            <span class="thumb-icon">{{ getCategoryMeta(item.category).icon }}</span>
          </div>

          <div class="info">
            <div class="date">
              <span>{{ item.date }}</span>
            </div>

            <strong class="name">{{ item.memo }}</strong>

            <div class="location">
              <img :src="locationIcon" alt="위치 아이콘" class="location-icon" />
              <span>{{ item.location }} </span>
            </div>
          </div>
        </div>

        <!-- 오른쪽 금액 -->
        <strong class="price">
          {{ item.type === 'expense' ? '-' : '+' }}{{ item.amount.toLocaleString() }}원
        </strong>
      </div>
    </div>
  </section>
</template>

<script setup>
import locationIcon from '@/assets/icon/ico_location_black.svg';
import { getCategoryMeta } from '@/pages/home/home.js';

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});
</script>

<style scoped>
.card {
  background: #f3f3f3;
  border: 1px solid #d8d8d8;
  border-radius: 48px;
  padding: 48px 56px;
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

/* 한 줄 */
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 28px 36px;
  border-radius: 999px;
  background: #f8f8f8;
  border: 1px solid #d8d8d8;
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
  font-size: 36px;
  font-weight: 900;
}
</style>
