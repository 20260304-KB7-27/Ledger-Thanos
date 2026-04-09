<template>
  <div
    v-if="isOpen"
    class="profile-edit-overlay"
    @click.self="$emit('close')"
  >
    <section
      class="profile-edit-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-edit-title"
    >
      <header class="profile-edit-header">
        <h2 id="profile-edit-title" class="profile-edit-title">프로필 수정</h2>
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
});
</script>

<style scoped>
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
  border-radius: 28px;
  background: #ffffff;
  box-shadow: 0 18px 36px rgba(73, 58, 34, 0.18);
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
  color: #111111;
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
  color: #222222;
}

.profile-edit-field input,
.profile-edit-field select {
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid #e1d8c7;
  border-radius: 16px;
  background: #fffdf8;
  padding: 15px 16px;
  font-size: 16px;
  font-family: inherit;
  color: #111111;
}

.profile-edit-field input:focus,
.profile-edit-field select:focus {
  outline: 2px solid rgba(255, 133, 120, 0.28);
  border-color: #ff8578;
}

.profile-edit-error {
  margin: 0 0 18px;
  color: #d14e4e;
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
  border-radius: 999px;
  padding: 12px 18px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.profile-edit-secondary {
  background: #f1eee7;
  color: #63584a;
}

.profile-edit-primary {
  background: #ff8578;
  color: #ffffff;
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
