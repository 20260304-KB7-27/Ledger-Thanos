<template>
  <Box
    class="card-box"
    width="custom"
    custom-width="100%"
    margin-y="0"
    border="var(--border-width) solid var(--card-border)"
    bg-color="var(--card-bg)"
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
  height: 100%;
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
  border-radius: var(--radius-card);
  border: var(--border-width) solid var(--border-soft);
  background: var(--card-bg);
  opacity: var(--illustration-opacity);
}

.title-text,
.empty-text {
  font-size: 18px;
  line-height: 1.6;
}

.title-text {
  padding: 8px 12px;
  border-radius: var(--radius-chip);
  background: var(--surface-emphasis);
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
  color: var(--text-muted);
  text-align: center;
}
</style>
