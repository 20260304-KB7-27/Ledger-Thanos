<template>
  <Box
      class="card-box"
      width="custom"
      custom-width="100%"
      margin-y="0"
      :border="resolvedBorder"
      bg-color="var(--card-bg)"
      :shadow="false"
  >
    <section class="card">
      <h3>{{ title }}</h3>

      <strong
          class="amount"
          :style="{ color: props.amountColor || 'var(--text-primary)' }"
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
  borderColor: {
    type: String,
    default: '',
  },
  amountColor: {
    type: String,
    default: '',
  },
});

const resolvedBorder = props.borderColor
  ? `var(--border-width) solid ${props.borderColor}`
  : 'var(--border-width) solid var(--card-border)';
</script>

<style scoped>
.card {
  padding: 24px 16px;
  min-height: 220px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  text-align: center;
}

h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.25;
  word-break: keep-all;
}

.amount {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}

@media (min-width: 769px) and (max-width: 1200px) {
  .card {
    min-height: 148px;
    padding: 20px 14px;
    gap: 12px;
  }

  h3 {
    font-size: 16px;
    line-height: 1.25;
    word-break: keep-all;
  }

  .amount {
    font-size: 14px;
    line-height: 1.3;
    word-break: keep-all;
  }
}
@media (min-width: 1500px) {
  .card {
    height: 100%;
  }
}

</style>
