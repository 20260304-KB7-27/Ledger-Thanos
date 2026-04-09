<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import logoSrc from '@/assets/icon/logo.svg';

const router = useRouter();
const userStore = useUserStore();

const userId = ref('');
const userPassword = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  error.value = '';
  loading.value = true;
  try {
    await userStore.login(userId.value, userPassword.value);
    router.push('/');
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-page">
    <header class="header">
      <img :src="logoSrc" alt="Ledger 로고" class="logo-icon" />
    </header>

    <main class="main">
      <div class="card">
        <h1 class="title">로그인</h1>

        <form @submit.prevent="handleLogin">
          <input
            v-model="userId"
            class="input"
            type="text"
            placeholder="아이디"
            autocomplete="username"
          />
          <input
            v-model="userPassword"
            class="input"
            type="password"
            placeholder="비밀번호"
            autocomplete="current-password"
          />

          <p v-if="error" class="error-msg">{{ error }}</p>

          <button class="btn-login" type="submit" :disabled="loading">
            {{ loading ? '로그인 중...' : '로그인하기' }}
          </button>
        </form>

        <p class="signup-link">
          회원이 아니신가요?
          <router-link to="/signup">가입하기</router-link>
        </p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.login-page {
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

.error-msg {
  color: #e53935;
  font-size: 0.85rem;
  text-align: center;
  margin-bottom: 0.75rem;
}

.btn-login {
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

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.signup-link {
  text-align: center;
  margin-top: 1.25rem;
  font-size: 0.9rem;
  color: #555;
}

.signup-link a {
  color: #ff8c00;
  font-weight: 600;
  text-decoration: none;
}
</style>
