<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Nav from '@/components/Nav.vue';

const route = useRoute();

// login, signup 페이지에서는 Nav 숨기기
const hideNav = computed(() => {
  const path = route.path;
  return path === '/login' || path === '/signup';
});

const logoSrc = '/src/assets/icon/logo.svg';
const textColor = 'linear-gradient(180deg, #F6E3A1 0%, #EFAF9E 100%)';
const backGroundColor = '#FF8C00';
const navBgColor = '#ffffff';
const navBgColor1 = '#FFAAAA';
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
      :active-text-color="navBgColor"
      :active-bg="backGroundColor"
      :mobileMenuBg="navBgColor1"
      :nav-bg="textColor"
    />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 글로벌 리셋 — 브라우저 기본 margin/padding 제거 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* ─── 데스크탑 (1025px+): 사이드바 25% → 콘텐츠 나머지 75% ─── */
@media (min-width: 1025px) {
  .content {
    margin-left: 25%;
    width: 75%;
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
