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
      <h3>나의 칭호</h3>

      <div v-if="titles.length > 0" class="title-list">
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

      <p v-else class="empty-text">{{ emptyText }}</p>
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
  padding: 32px 16px;
  min-height: 220px;
}

h3 {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 24px;
}

.title-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.title-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.title-image {
  width: 72px;
  height: 72px;
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
</style>
