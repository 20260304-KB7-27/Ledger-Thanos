<template>
  <Box
    class="card-box title-card-box"
    width="custom"
    custom-width="100%"
    margin-y="0"
    border="1.5px solid #d9d9d9"
    bg-color="#ffffff"
    :shadow="true"
  >
    <article class="title-card">
      <h2 class="section-title">칭호 선택</h2>
      <div v-if="earnedBadges.length > 0" class="badge-grid compact">
        <button
          v-for="badge in earnedBadges"
          :key="badge.key"
          type="button"
          class="badge-button"
          :class="{ selected: selectedTitleKeys.includes(badge.key) }"
          @click="$emit('toggle-title', badge.key)"
        >
          <img :src="badge.image" :alt="badge.name" class="badge-image" />
          <span class="badge-name">{{ badge.name }}</span>
          <span class="badge-rule">{{ badge.rule }}</span>
        </button>
      </div>
      <p v-else class="empty-message">획득한 칭호가 없습니다.</p>
    </article>
  </Box>
</template>

<script setup>
import Box from '@/components/Box.vue';

defineProps({
  earnedBadges: {
    type: Array,
    required: true,
  },
  selectedTitleKeys: {
    type: Array,
    required: true,
  },
});

defineEmits(['toggle-title']);
</script>

<style scoped>
.card-box :deep(.common-box) {
  border-radius: 24px;
  box-shadow: 0 5px 8px rgba(120, 105, 76, 0.22);
}

.card-box :deep(.box-content) {
  padding: 0;
}

.title-card {
  min-height: 320px;
  padding: 24px 30px 24px;
}

.section-title {
  margin: 0 0 24px;
  font-size: 22px;
  font-weight: 800;
  color: #111111;
}

.badge-grid.compact {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px 14px;
  align-items: start;
}

.badge-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  text-align: center;
  background: transparent;
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 10px 6px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.badge-button:hover {
  background: #f5f5f5;
}

.badge-button.selected {
  border-color: #f59e0b;
  background: #fffbeb;
}

.badge-image {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.badge-name {
  font-size: 13px;
  font-weight: 700;
  color: #111111;
}

.badge-rule {
  font-size: 11px;
  line-height: 1.3;
  color: #6b7280;
  word-break: keep-all;
}

.empty-message {
  margin: 12px 0 0;
  font-size: 16px;
  color: #8c8c8c;
  text-align: center;
}
</style>
