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
      <div v-if="selectedTitleBadges.length > 0" class="badge-grid compact">
        <button
          v-for="badge in selectedTitleBadges"
          :key="badge.key"
          type="button"
          class="badge-button"
        >
          <img :src="badge.image" :alt="badge.name" class="badge-image" />
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
  selectedTitleBadges: {
    type: Array,
    required: true,
  },
});
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

.badge-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(122px, 1fr));
  gap: 34px 18px;
}

.badge-grid.compact {
  gap: 8px 14px;
  align-items: start;
}

.badge-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  text-align: center;
  background: transparent;
  border: none;
  padding: 0;
  font-family: inherit;
  cursor: pointer;
}

.badge-image {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.badge-rule {
  font-size: 12px;
  line-height: 1.3;
  color: #222222;
  word-break: keep-all;
}

.empty-message {
  margin: 12px 0 0;
  font-size: 16px;
  color: #8c8c8c;
  text-align: center;
}
</style>
