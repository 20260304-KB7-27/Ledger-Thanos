<template>
  <section class="card">
    <h3>이번달 요약</h3>

    <div class="summary-list">
      <div class="summary-row">
        <span class="label">총 거래</span>
        <span class="value">{{ totalCount }}건</span>
      </div>

      <div class="summary-row">
        <span class="label">만족한 소비</span>
        <span class="value highlight">{{ satisfiedCount }}건</span>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  totalCount: {
    type: Number,
    default: 12,
  },
  satisfiedCount: {
    type: Number,
    default: 8,
  },
});
</script>

<style scoped>
.card {
  background: #f3f3f3;
  border: 1px solid #d8d8d8;
  border-radius: 36px;
  padding: 40px 48px;
  min-height: 220px;
  box-sizing: border-box;
}

h3 {
  margin: 0 0 36px;
  font-size: 26px;
  font-weight: 800;
  color: #111;
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
}

.label {
  font-size: 22px;
  font-weight: 500;
  color: #111;
}

.value {
  font-size: 22px;
  font-weight: 800;
  color: #111;
}

.highlight {
  color: #f2c300;
}
</style>