<template>
  <button class="card" @click="$emit('click')">
    새로운 거래 추가
  </button>
</template>

<script setup>
defineEmits(["click"]);
</script>

<style scoped>
.card {
  width: 100%;
  min-height: 140px;
  border-radius: 36px;
  border: none;
  background: #ffd800;
  font-size: 22px;
  font-weight: 800;
  cursor: pointer;
}
</style>