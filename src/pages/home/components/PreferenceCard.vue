<template>
  <section class="card">
    <h3>나의 칭호</h3>
    <p>{{ text }}</p>
  </section>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: "카페인 중독, 플렉스, 집순이..",
  },
});
</script>

<style scoped>
.card {
  background: #f3f3f3;
  border: 1px solid #d8d8d8;
  border-radius: 36px;
  padding: 32px;
  min-height: 220px;
}

h3 {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 24px;
}

p {
  font-size: 18px;
  line-height: 1.6;
}
</style>