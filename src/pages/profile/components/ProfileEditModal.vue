<template>
  <div
    v-if="isOpen"
    class="profile-edit-overlay"
    @click.self="$emit('close')"
  >
    <section
      class="profile-edit-modal"
      :class="{ happy: isHappy }"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-title"
    >
      <header class="profile-edit-header">
        <h3 id="profile-edit-title" class="profile-edit-title">프로필 수정</h3>
      </header>

      <label class="profile-edit-field">
        <span>닉네임</span>
        <input
          :value="nickname"
          type="text"
          maxlength="12"
          placeholder="닉네임을 입력해주세요"
          @input="$emit('update:nickname', $event.target.value)"
        />
      </label>

      <label class="profile-edit-field">
        <span>지역</span>
        <select
          :value="userLocation"
          @change="$emit('update:userLocation', $event.target.value)"
        >
          <option value="">지역을 선택해주세요</option>
          <option
            v-for="district in districts"
            :key="district"
            :value="district"
          >
            {{ district }}
          </option>
        </select>
      </label>

      <p v-if="errorMessage" class="profile-edit-error">
        {{ errorMessage }}
      </p>

      <div class="profile-edit-actions">
        <button
          type="button"
          class="profile-edit-secondary"
          @click="$emit('close')"
        >
          취소
        </button>
        <button
          type="button"
          class="profile-edit-primary"
          :class="{ happy: isHappy }"
          :disabled="isSaving"
          @click="$emit('save')"
        >
          {{ isSaving ? '저장 중...' : '저장' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
defineEmits([
  'close',
  'save',
  'update:nickname',
  'update:userLocation',
]);

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  userLocation: {
    type: String,
    required: true,
  },
  districts: {
    type: Array,
    required: true,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  isSaving: {
    type: Boolean,
    required: true,
  },
  isHappy: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
h3 {
  margin: 0 0 36px;
  font-size: 22px;
  font-weight: 600;
}
.profile-edit-overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(17, 17, 17, 0.36);
}

.profile-edit-modal {
  width: min(100%, 460px);
  padding: 28px;
  border-radius: var(--radius-card);
  background: var(--surface-primary);
  box-shadow: var(--shadow-emphasis);
  transition: var(--card-transition);
}

.profile-edit-modal.happy {
  background: linear-gradient(
    180deg,
    var(--surface-primary) 0%,
    var(--surface-secondary) 100%
  );
}

.profile-edit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.profile-edit-title {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
}

.profile-edit-field {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
}

.profile-edit-field span {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}

.profile-edit-field input,
.profile-edit-field select {
  width: 100%;
  box-sizing: border-box;
  border: var(--border-width) solid var(--border-soft);
  border-radius: var(--radius-input);
  background: var(--input-bg);
  padding: 15px 16px;
  font-size: 16px;
  font-family: inherit;
  color: var(--input-text);
  transition: var(--btn-transition);
}

.profile-edit-field input:focus,
.profile-edit-field select:focus {
  outline: none;
  border-color: var(--accent-strong);
  box-shadow: var(--input-focus-shadow);
}

.profile-edit-error {
  margin: 0 0 18px;
  color: var(--danger);
  font-size: 14px;
  font-weight: 700;
}

.profile-edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.profile-edit-secondary,
.profile-edit-primary {
  min-width: 96px;
  border: none;
  border-radius: var(--radius-button);
  padding: 12px 18px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: var(--btn-transition);
}

.profile-edit-secondary {
  background: var(--surface-secondary);
  color: var(--text-muted);
}

.profile-edit-secondary:hover {
  transform: var(--btn-hover-lift);
}

.profile-edit-primary {
  background: var(--button-secondary-bg);
  color: var(--button-secondary-text);
}

.profile-edit-primary.happy {
  background: var(--happy-main-pink);
  color: #ffffff;
}

.profile-edit-primary:hover:not(:disabled) {
  transform: var(--btn-hover-lift);
  box-shadow: var(--shadow-button);
}

.profile-edit-primary:disabled {
  opacity: 0.72;
  cursor: wait;
}

@media (max-width: 640px) {
  .profile-edit-overlay {
    padding: 16px;
  }

  .profile-edit-modal {
    padding: 24px 18px;
  }

  .profile-edit-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .profile-edit-actions {
    flex-direction: column;
  }

  .profile-edit-secondary,
  .profile-edit-primary {
    width: 100%;
  }
}
</style>
