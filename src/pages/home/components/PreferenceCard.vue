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
      <h3>나의 칭호</h3>

      <div v-if="titles.length > 0">
        <div
          v-for="title in titles"
          :key="title"
          class="title-item"
        >
          <img
            v-if="getDisplayImage('title', title)"
            :src="getDisplayImage('title', title)"
            alt="획득한 칭호 이미지"
            class="title-image"
          />
          <p v-else class="title-text">{{ title }}</p>
        </div>
      </div>

      <div v-else class="empty-wrap">
        <p class="empty-text">{{ emptyText }}</p>
      </div>
    </section>
  </Box>
</template>

<script setup>
import Box from "@/components/Box.vue";
import { getDisplayImage } from '@/pages/home/home.js';

defineProps({
  titles: {
    type: Array,
    default: () => [],
  },
  emptyText: {
    type: String,
    default: '아직 칭호가 없어요.',
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

.title-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 18px;
  border: 1px solid #d8d8d8;
  background: #fff;
}

.title-text,
.empty-text {
  font-size: 18px;
  line-height: 1.6;
}

.title-text {
  padding: 8px 12px;
  border-radius: 999px;
  background: #fff6cf;
}

.empty-wrap {
  min-height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.4;
  color: #8c8c8c;
  text-align: center;
}
</style>
