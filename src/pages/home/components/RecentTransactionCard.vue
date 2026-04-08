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
          <div class="thumb"></div>

          <div class="info">
            <div class="date">
              <span>{{ item.date }}</span>
            </div>

            <strong class="name">{{ item.memo }}</strong>

            <div class="location">
              📍 <span>{{ item.location }} </span>
            </div>
          </div>
        </div>

        <!-- 오른쪽 금액 -->
        <strong class="price">
          {{ item.amount.toLocaleString() }}원
        </strong>
      </div>
    </div>
  </section>
</template>

<script setup>
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
  background: #cfcfcf;
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
  font-size: 20px;
  color: #333;
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
