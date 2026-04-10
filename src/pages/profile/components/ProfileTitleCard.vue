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
    <article class="title-card">
      <h3>칭호 선택</h3>
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
  box-shadow: var(--shadow-card);
}

.card-box :deep(.box-content) {
  padding: 0;
}

.title-card {
  min-height: 320px;
  padding: 24px 30px 24px;
}

h3 {
  margin: 0 0 36px;
  font-size: 22px;
  font-weight: 600;
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
  border: var(--border-width) solid transparent;
  border-radius: var(--radius-card);
  padding: 10px 6px;
  font-family: inherit;
  cursor: pointer;
  transition: var(--btn-transition);
}

.badge-button:hover {
  background: var(--surface-secondary);
  transform: var(--btn-hover-lift);
}

.badge-button.selected {
  border-color: var(--accent-primary);
  background: var(--surface-emphasis);
}

.badge-image {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.badge-name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.badge-rule {
  font-size: 11px;
  line-height: 1.3;
  color: var(--text-muted);
  word-break: keep-all;
}

.empty-message {
  margin: 12px 0 0;
  font-size: 16px;
  color: var(--text-muted);
  text-align: center;
}
</style>
