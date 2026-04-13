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
      <div class="title-row">
        <img v-if="isHappy" :src="IcoLabel" alt="happy icon" class="happy-icon" />
        <h3>나의 칭호</h3>
      </div>

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
import IcoLabel from "@/assets/icon/ico_label.svg";
import {useUserStore} from "@/stores/user.js";
import {computed} from "vue";
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

const userStore = useUserStore();
// 테마 '만족' 상태인지 확인
const isHappy = computed(() => userStore.dominantEmotion === 'happy');
</script>

<style scoped>
.card {
  padding: 40px 32px;
  min-height: 220px;
  box-sizing: border-box;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
}

h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

.happy-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
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

@media (min-width: 1500px) {
  .card {
    height: 100%;
  }
}
</style>
