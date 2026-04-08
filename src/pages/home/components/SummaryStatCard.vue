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
      {{ sign }}{{ amount }}
    </strong>
  </section>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  amount: String,

  /* 색상 (부모에서 전달) */
  color: {
    type: String,
    default: "#222",
  },

  /* 타입: income | expense */
  type: {
    type: String,
    default: "income",
  },
});

/* + / - 자동 처리 */
const sign = computed(() => {
  return props.type === "expense" ? "-" : "+";
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