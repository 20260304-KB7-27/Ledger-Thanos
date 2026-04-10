<script setup>
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import Nav from '@/components/Nav.vue';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const userStore = useUserStore();
const { appThemeClass } = storeToRefs(userStore);
const themeClassNames = ['theme-happy', 'theme-neutral', 'theme-regret'];

// theme.css가 #app.theme-* 셀렉터를 기준으로 토큰을 바꾸므로 mount root에 클래스를 동기화
const syncAppThemeClass = (nextThemeClass) => {
  if (typeof document === 'undefined') {
    return;
  }

  const appRoot = document.getElementById('app');

  if (!appRoot) {
    return;
  }

  appRoot.classList.remove(...themeClassNames);
  appRoot.classList.add(nextThemeClass);
};

// login, signup 페이지에서는 Nav 숨기기
const hideNav = computed(() => {
  const path = route.path;
  return path === '/login' || path === '/signup';
});

watch(
  appThemeClass,
  (nextThemeClass) => {
    // 감정 비율이 바뀌면 App 루트 토큰도 바로 갱신
    syncAppThemeClass(nextThemeClass);
  },
  { immediate: true }
);

const logoSrc = '/src/assets/icon/logo.svg';
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
  <div class="app-layout" :class="{ 'no-nav': hideNav }">
    <Nav
      v-if="!hideNav"
      :menus="menus"
      :logo-src="logoSrc"
      text-color="var(--nav-text)"
      active-text-color="var(--nav-active-text)"
      active-bg="var(--nav-active-bg)"
      mobile-menu-bg="var(--nav-mobile-menu-bg)"
      nav-bg="var(--nav-bg)"
    />
    <!-- Nav 색상도 theme.css의 semantic token을 그대로 사용 -->
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* ─── 데스크탑 (1025px+): 사이드바 25% → 콘텐츠 나머지 75% ─── */
@media (min-width: 1025px) {
  .content {
    /* 실제 배경색은 base.css / theme.css 토큰에서 가져오고 여기서는 레이아웃만 설정 */
    margin-left: 20%;
    width: 80%;
    min-height: 100vh;
  }

  /* Nav 없을 때 전체 폭 사용 */
  .no-nav .content {
    margin-left: 0;
    width: 100%;
  }
}

/* ─── 태블릿 (769px ~ 1024px): 상단 바 → 콘텐츠 아래 전체 ─── */
@media (min-width: 769px) and (max-width: 1024px) {
  .app-layout {
    flex-direction: column;
  }

  .content {
    margin-left: 0;
    width: 100%;
    /* topbar 높이만큼 여백 확보 (Nav.vue의 topbar가 fixed) */
    padding-top: 80px;
    min-height: 100vh;
  }

  .no-nav .content {
    padding-top: 0;
  }
}

/* ─── 모바일 (768px 이하): 상단 바 → 콘텐츠 아래 전체 ─── */
@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }

  .content {
    margin-left: 0;
    width: 100%;
    min-height: 100vh;
  }

  .no-nav .content {
    padding: 0;
  }
}
</style>
