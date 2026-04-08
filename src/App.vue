<script setup>
import { ref } from 'vue';
import api from '@/service/api';
import Nav from '@/components/Nav.vue';

const result = ref(null);
const error = ref(null);
const loading = ref(false);

// 새 location 데이터 (POST 테스트용)
const newLocation = ref({
  name: '테스트 장소',
  lat: 37.5665,
  lng: 126.978,
  category: '카페',
  visitedAt: '2024-04-08',
});

async function testGet() {
  error.value = null;
  loading.value = true;
  try {
    result.value = await api.get('/locations');
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function testPost() {
  error.value = null;
  loading.value = true;
  try {
    result.value = await api.post('/locations', newLocation.value);
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function testPatch() {
  error.value = null;
  loading.value = true;
  try {
    result.value = await api.patch('/locations/1', {
      name: '수정된 강남역 맛집',
    });
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function testDelete() {
  error.value = null;
  loading.value = true;
  try {
    result.value = await api.delete('/locations/1');
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

const logoSrc = ref('/src/assets/icon/logo.svg');
const textColor = ref('linear-gradient(180deg, #F6E3A1 0%, #EFAF9E 100%)');
const backGroundColor = ref('#FF8C00');
const navBgColor = ref('#ffffff');
const navBgColor1 = ref('#FFAAAA');
const menus = [
  {
    key: 'home',
    label: '홈',
    path: '/',
    icon: '/src/assets/icon/ico_home_unselected.svg',
    activeIcon: '/src/assets/icon/ico_home_selected.svg',
  },
  {
    key: 'register',
    label: '등록',
    path: '/register',
    icon: '/src/assets/icon/ico_register_unselected.svg',
    activeIcon: '/src/assets/icon/ico_register_selected.svg',
  },
  {
    key: 'stats',
    label: '통계',
    path: '/stats',
    icon: '/src/assets/icon/ico_statics_unselected.svg',
    activeIcon: '/src/assets/icon/ico_statics_selected.svg',
  },
  {
    key: 'map',
    label: '지도',
    path: '/map',
    icon: '/src/assets/icon/ico_map_unselected.svg',
    activeIcon: '/src/assets/icon/ico_map_selected.svg',
  },
  {
    key: 'profile',
    label: '프로필',
    path: '/profile',
    icon: '/src/assets/icon/ico_profile_unselected.svg',
    activeIcon: '/src/assets/icon/ico_profile_selected.svg',
  },
];
</script>

<template>
  <div class="layout">
    <Nav
      :menus="menus"
      :logo-src="logoSrc"
      :active-text-color="navBgColor"
      :active-bg="backGroundColor"
      :mobileMenuBg="navBgColor1"
      :nav-bg="textColor"
    />
    <main class="content">
      <section>
        <!-- <div style="padding: 2rem; font-family: monospace">
          <h1>API 테스트</h1>

          <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem">
            <button @click="testGet">GET /locations</button>
            <button @click="testPost">POST /locations</button>
            <button @click="testPatch">PATCH /locations/1</button>
            <button @click="testDelete">DELETE /locations/1</button>
          </div>

          <p v-if="loading">로딩 중...</p>
          <p v-if="error" style="color: red">에러: {{ error }}</p>
          <pre
            v-if="result && !loading"
            style="background: #f4f4f4; padding: 1rem; border-radius: 6px"
            >{{ JSON.stringify(result, null, 2) }}</pre
          >
        </div> -->
        <RouterView></RouterView>
      </section>
    </main>
  </div>
</template>

<style scoped>
button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.layout {
  min-height: 100vh;
}

.content {
  padding-left: 25%;
}

.page-card {
  min-height: 300px;
  background: #fffdf7;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}
</style>
