<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="visible" class="easter-overlay">
        <div class="overlay-text">
          <p class="overlay-title">✨ 후회 없는 소비를 꿈꾸며...</p>
          <p class="overlay-sub">모든 후회가 사라졌습니다</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.easter-overlay {
  position: fixed;
  inset: 0;
  z-index: 7999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.overlay-text {
  text-align: center;
  z-index: 8100;
  padding: 32px 48px;
  border-radius: 24px;
  background: rgba(10, 0, 26, 0.55);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  animation: text-float 3s ease-in-out infinite;
}

.overlay-title {
  margin: 0 0 10px;
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.04em;
  text-shadow: 0 0 20px rgba(200, 140, 255, 0.9);
}

.overlay-sub {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.06em;
}

/* 진입/퇴장 트랜지션 */
.overlay-enter-active {
  transition: opacity 0.8s ease;
}
.overlay-leave-active {
  transition: opacity 1.2s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* 텍스트 부유 효과 */
@keyframes text-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
