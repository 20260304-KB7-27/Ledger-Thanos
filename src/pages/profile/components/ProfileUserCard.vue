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
    <button
      type="button"
      class="profile-card-button"
      @click="$emit('open-edit')"
    >
      <article class="profile-card">
        <div class="profile-avatar">
          <img
            v-if="selectedBadge"
            :src="selectedBadge.image"
            :alt="selectedBadge.name"
            class="profile-avatar-image"
          />
          <svg
            v-else
            class="profile-avatar-default"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="32" r="18" fill="#b0b0b0" />
            <ellipse cx="40" cy="72" rx="28" ry="18" fill="#b0b0b0" />
          </svg>
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
    linear-gradient(180deg, var(--surface-primary) 0%, var(--surface-secondary) 100%);
  transition: var(--card-transition);
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

.profile-avatar-default {
  width: 96px;
  height: 96px;
  opacity: 0.7;
}

.selected-badge-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px 4px 6px;
  border-radius: var(--radius-chip);
  background: var(--surface-secondary);
  color: var(--accent-strong);
  font-size: 17px;
  font-weight: 700;
  line-height: 1;
}

.selected-badge-empty {
  margin: 14px 0 0;
  font-size: 15px;
  color: var(--text-muted);
  text-align: center;
}

.profile-nickname {
  margin-top: 8px;
  font-size: 31px;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.profile-meta {
  margin: 8px 0 0;
  font-size: 17px;
  color: var(--text-secondary);
  line-height: 1.2;
}

.edit-hint {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px 12px;
  border-radius: var(--radius-chip);
  background: rgba(17, 17, 17, 0.82);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  opacity: 0;
  transform: translateY(-4px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  pointer-events: none;
}

.profile-card-button:hover .edit-hint,
.profile-card-button:focus-visible .edit-hint {
  opacity: 1;
  transform: translateY(0);
}

.profile-card-button:focus-visible {
  outline: 3px solid var(--accent-primary);
  outline-offset: 4px;
  border-radius: var(--radius-card);
}

.profile-card-button:hover .profile-card {
  transform: var(--card-hover-lift);
  box-shadow: var(--card-hover-shadow);
  background:
    radial-gradient(circle at top, rgba(255, 199, 173, 0.22), transparent 44%),
    linear-gradient(180deg, var(--surface-primary) 0%, var(--surface-emphasis) 100%);
}
</style>
