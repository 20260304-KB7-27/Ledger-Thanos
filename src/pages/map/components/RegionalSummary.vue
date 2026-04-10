<template>
  <Box width="custom" customWidth="100%" marginY="12px" :shadow="false">
    <h3 class="panel-title">지역별 요약</h3>
    <ul v-if="summary.length > 0" class="gu-list">
      <li
        v-for="(item, i) in summary"
        :key="item.gu"
        class="gu-item"
        :class="{ active: item.gu === selectedGu }"
        @click="emit('select-gu', item.gu)"
      >
        <span class="rank-badge">{{ i + 1 }}</span>
        <span class="gu-name">{{ item.gu }}</span>
        <span class="gu-total">{{ item.total.toLocaleString() }}원</span>
      </li>
    </ul>
    <p v-else class="empty-msg">거래 내역이 없습니다.</p>
  </Box>
</template>

<script setup>
import Box from '@/components/Box.vue';

defineProps({
  summary: { type: Array, default: () => [] },
  selectedGu: { type: String, default: null },
});

const emit = defineEmits(['select-gu']);
</script>

<style scoped>
.panel-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 10px 0;
}

.gu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--radius-chip);
  cursor: pointer;
  transition: var(--btn-transition);
}

.gu-item:hover {
  background: var(--surface-secondary);
  transform: var(--btn-hover-lift);
}

.gu-item.active {
  background: var(--surface-emphasis);
}

.rank-badge {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  background: var(--accent-primary);
  color: var(--button-primary-text);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
}

.gu-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.gu-total {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-secondary);
}

.empty-msg {
  font-size: 13px;
  color: var(--text-muted);
  text-align: center;
  padding: 16px 0;
}
</style>
