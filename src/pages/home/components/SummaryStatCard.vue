<template>
  <section
      class="card"
      :style="{ borderColor: color }"
  >
    <p class="title">{{ title }}</p>

    <strong
        class="amount"
        :style="{ color: color }"
    >
      {{ props.sign }}{{ amount }}
    </strong>
  </section>
</template>

<script setup>
const props = defineProps({
  title: String,
  amount: String,
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
  background: #f3f3f3;
  border: 2px solid;
  border-radius: 32px;
  padding: 24px;
  min-height: 140px;
}

.title {
  font-size: 18px;
  margin-bottom: 32px;
}

.amount {
  font-size: 22px;
  font-weight: 600;
}
</style>
