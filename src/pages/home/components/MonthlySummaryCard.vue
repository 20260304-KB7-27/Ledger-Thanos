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
      <h3>이번달 요약</h3>

      <div class="summary-list">
        <div class="summary-row">
          <span class="label">총 거래</span>
          <span class="value">{{ totalCount }}건</span>
        </div>

        <div class="summary-row">
          <span class="label">만족한 소비</span>
          <span class="value">{{ satisfiedCount }}건</span>
        </div>

        <div class="summary-row">
          <span class="label">최다 카테고리</span>
          <span class="value">{{ getCategoryMeta(topCategory).label }} {{ topCategoryCount }}건</span>
        </div>
      </div>
    </section>
  </Box>
</template>

<script setup>
import Box from "@/components/Box.vue";
import {getCategoryMeta} from "@/pages/home/home.js";

defineProps({
  totalCount: {
    type: Number,
    default: 0,
  },
  satisfiedCount: {
    type: Number,
    default: 0,
  },
  topCategory: {
    type: String,
    default: '',
  },
  topCategoryCount: {
    type: Number,
    default: 0,
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

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.label {
  font-size: 20px;
}

.value {
  font-size: 20px;
  text-align: right;
}

@media (min-width: 769px) and (max-width: 1400px) {
  .card {
    padding: 32px 24px;
  }

  .label,
  .value {
    font-size: 14px;
    line-height: 1.3;
  }

  .summary-row:last-child {
    align-items: flex-start;
  }

  .summary-row:last-child .value {
    max-width: 92px;
    text-align: right;
    word-break: keep-all;
  }
}

</style>
