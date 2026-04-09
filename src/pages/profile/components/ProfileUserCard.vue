<template>
  <Box
    class="card-box profile-card-box"
    width="custom"
    custom-width="100%"
    margin-y="0"
    border="1.5px solid #d9d9d9"
    bg-color="#ffffff"
    :shadow="true"
  >
    <button type="button" class="profile-card-button" @click="$emit('open-edit')">
      <article class="profile-card">
        <div class="">
          <img
            v-if="selectedBadge"
            :src="selectedBadge.image"
            :alt="selectedBadge.name"
            class="profile-avatar-image"
          />
        </div>
        <div v-if="selectedBadge" class="selected-badge-chip">
          <span>{{ selectedBadge.name }}</span>
        </div>
        <div v-else class="selected-badge-empty">선택한 칭호가 없어요</div>

        <strong class="profile-nickname">{{ profile.nickname }}</strong>
        <p class="profile-meta">{{ profile.location }}</p>
        <p class="profile-meta">{{ memberSinceText }}</p>
      </article>

      <span class="edit-hint">클릭해서 프로필 수정</span>
    </button>
  </Box>
</template>

<script setup>
import Box from '@/components/Box.vue';

defineEmits(['open-edit']);

defineProps({
  profile: {
    type: Object,
    required: true,
  },
  selectedBadge: {
    type: Object,
    default: null,
  },
  memberSinceText: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.card-box :deep(.common-box) {
  border-radius: 24px;
  box-shadow: 0 5px 8px rgba(120, 105, 76, 0.22);
  overflow: hidden;
}

.card-box :deep(.box-content) {
  padding: 0;
}

.profile-card-button {
  width: 100%;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  position: relative;
  text-align: inherit;
  font-family: inherit;
}

.profile-card {
  min-height: 320px;
  padding: 28px 24px 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at top, rgba(255, 199, 173, 0.16), transparent 40%),
    linear-gradient(180deg, #ffffff 0%, #fffdf8 100%);
}

.profile-avatar {
  width: 124px;
  height: 124px;
  border-radius: 50%;
  background: linear-gradient(180deg, #dfdfdf 0%, #cfcfcf 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 8px 14px rgba(255, 255, 255, 0.32);
}

.profile-avatar-image {
  width: 96px;
  height: 96px;
  object-fit: contain;
  filter: drop-shadow(0 6px 8px rgba(92, 61, 25, 0.22));
}

.selected-badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px 4px 6px;
  border-radius: 999px;
  background: rgba(255, 245, 246, 0.92);
  color: #ff9ca0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1;
}

.selected-badge-empty {
  margin: 14px 0 0;
  font-size: 15px;
  color: #8c8c8c;
  text-align: center;
}

.profile-nickname {
  margin-top: 8px;
  font-size: 31px;
  font-weight: 800;
  color: #111111;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.profile-meta {
  margin: 8px 0 0;
  font-size: 17px;
  color: #2d2d2d;
  line-height: 1.2;
}

.edit-hint {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(17, 17, 17, 0.82);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  pointer-events: none;
}

.profile-card-button:hover .edit-hint,
.profile-card-button:focus-visible .edit-hint {
  opacity: 1;
  transform: translateY(0);
}

.profile-card-button:focus-visible {
  outline: 3px solid rgba(255, 133, 120, 0.4);
  outline-offset: 4px;
  border-radius: 24px;
}

.profile-card-button:hover .profile-card {
  background:
    radial-gradient(circle at top, rgba(255, 199, 173, 0.22), transparent 44%),
    linear-gradient(180deg, #ffffff 0%, #fffaf1 100%);
}
</style>
