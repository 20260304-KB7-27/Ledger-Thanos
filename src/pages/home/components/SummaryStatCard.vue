<template>
  <Box
      width="custom"
      custom-width="100%"
      margin-y="0"
      :border="`2px solid ${color}`"
      bg-color="#f3f3f3"
      :shadow="false"
  >
    <section class="card">
      <p class="title">{{ title }}</p>

      <strong
          class="amount"
          :style="{ color: color }"
      >
        {{ props.sign }}{{ amount }}
      </strong>
    </section>
  </Box>
</template>

<script setup>
import Box from "@/components/Box.vue";

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  amount: {
    type: String,
    default: '0원',
  },
  sign: {
    type: String,
    default: '+',
  },

  /* 색상 (부모에서 전달) */
  color: {
    type: String,
    default: "#222",
  },

});
</script>

<style scoped>
.card {
  padding: 24px 16px;
  min-height: 140px;
}

.title {
  margin: 0 0 28px;
  font-size: 20px;
  font-weight: 800;
  color: #111;
}

.amount {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}
</style>
