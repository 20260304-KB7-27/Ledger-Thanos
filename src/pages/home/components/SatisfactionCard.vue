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
        <img v-if="isHappy" :src="IcoHappyYellow" alt="happy icon" class="happy-icon" />
        <h3>이번달 만족 지수</h3>
      </div>

      <div class="score-wrap">
        <strong class="score">{{ score }}</strong>
        <span class="percent">%</span>
        <p v-if="isHappy" class="happy-message">만족한 소비가 더 많아요!</p>
      </div>

      <div class="progress-bar">
        <ProgressBarChart
          :key="score"
          :value="score"
          :bar-color="isHappy ? 'var(--button-primary-bg)' : 'var(--accent-strong)'"
        />
      </div>
    </section>
  </Box>
</template>

<script setup>
import Box from "@/components/Box.vue";
import ProgressBarChart from "@/components/ProgressBarChart.vue";
import IcoHappyYellow from "@/assets/icon/ico_happy_yellow.svg"

import {computed} from "vue";
import {useUserStore} from "@/stores/user.js";
defineProps({
  score: {
    type: Number,
    default: 75,
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

@media (min-width: 1500px) {
  .card {
    height: 100%;
  }
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

.score-wrap {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 24px;
}

.happy-message {
  margin: 0 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--neutral-nav-text);
  line-height: 1.2;
}

.score {
  font-size: 56px;
  font-weight: 800;
  line-height: 1;
  color: var(--text-primary);
}

.percent {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
}

.progress-bar {
  height: 28px;
}
</style>
