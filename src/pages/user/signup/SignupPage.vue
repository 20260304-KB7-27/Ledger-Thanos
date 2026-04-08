<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signupUser } from '@/service/user/userApi';
import logoSrc from '@/assets/icon/logo.svg';

const router = useRouter();

const userId = ref('');
const userPassword = ref('');
const passwordConfirm = ref('');
const nickname = ref('');
const userLocation = ref('');
const error = ref('');
const loading = ref(false);

const handleSignup = async () => {
  error.value = '';

  if (userPassword.value !== passwordConfirm.value) {
    error.value = '비밀번호가 일치하지 않습니다.';
    return;
  }

  loading.value = true;
  try {
    await signupUser({
      userId: userId.value,
      userPassword: userPassword.value,
      nickname: nickname.value,
      userLocation: userLocation.value,
    });
    router.push('/login');
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="signup-page">
    <header class="header">
      <img :src="logoSrc" alt="Ledger 로고" class="logo-icon" />
    </header>

    <main class="main">
      <div class="card">
        <h1 class="title">회원가입</h1>

        <form @submit.prevent="handleSignup">
          <input
            v-model="userId"
            class="input"
            type="text"
            placeholder="아이디"
            autocomplete="username"
            required
          />
          <input
            v-model="userPassword"
            class="input"
            type="password"
            placeholder="비밀번호"
            autocomplete="new-password"
            required
          />
          <input
            v-model="passwordConfirm"
            class="input"
            type="password"
            placeholder="비밀번호 확인"
            autocomplete="new-password"
            required
          />

          <div class="row">
            <input
              v-model="nickname"
              class="input input-half"
              type="text"
              placeholder="닉네임"
              required
            />
            <input
              v-model="userLocation"
              class="input input-half"
              type="text"
              placeholder="거주 지역"
              required
            />
          </div>

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button class="btn-signup" type="submit" :disabled="loading">
            {{ loading ? '가입 중...' : '가입하기' }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
.signup-page {
  min-height: 100vh;
  background: #ffd400;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 1.25rem 1.75rem;
}

.logo-icon {
  width: 36px;
  height: 36px;
}

.main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card {
  background: #fff;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 1.4rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.75rem;
  color: #1a1a1a;
}

.input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 1.5px solid #ebebeb;
  border-radius: 50px;
  padding: 0.85rem 1.4rem;
  font-size: 1rem;
  color: #1a1a1a;
  outline: none;
  margin-bottom: 1rem;
  background: #fff;
}

.input:focus {
  border-color: #ffd400;
}

.input::placeholder {
  color: #bbb;
}

.row {
  display: flex;
  gap: 0.75rem;
}

.input-half {
  flex: 1;
}

.error-msg {
  color: #e53935;
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 0.75rem;
}

.btn-signup {
  display: block;
  width: 100%;
  padding: 1rem;
  background: #ff8c00;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-signup:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
