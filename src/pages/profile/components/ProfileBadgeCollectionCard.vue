<template>
  <Box
    class="card-box collection-card-box"
    width="custom"
    custom-width="100%"
    margin-y="0"
    border="1.5px solid #d9d9d9"
    bg-color="#ffffff"
    :shadow="true"
  >
    <article class="collection-card">
      <div class="collection-header">
        <h2 class="section-title">모든 뱃지</h2>
        <span class="collection-count">{{ earnedBadgeCount }} / {{ badgeCatalog.length }}</span>
      </div>

      <div class="badge-grid">
        <div
          v-for="badge in badgeCatalog"
          :key="badge.key"
          class="badge-item"
          :class="{ locked: !badge.earned }"
        >
          <img :src="badge.image" :alt="badge.name" class="badge-image" />
          <span class="badge-rule">{{ badge.rule }}</span>
        </div>
      </div>
    </article>
  </Box>
</template>

<script setup>
import Box from '@/components/Box.vue';

defineProps({
  badgeCatalog: {
    type: Array,
    required: true,
  },
  earnedBadgeCount: {
    type: Number,
    required: true,
  },
});
</script>

<style scoped>
.collection-card {
  min-height: 100%;
  padding: 24px 30px 28px;
}

.collection-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 28px;
}

.section-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: #111111;
}

.collection-count {
  font-size: 24px;
  font-weight: 800;
  color: #111111;
}

.badge-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(122px, 1fr));
  gap: 34px 18px;
}

.badge-item {
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

.locked .badge-image,
.locked .badge-rule {
  opacity: 0.22;
}
</style>
