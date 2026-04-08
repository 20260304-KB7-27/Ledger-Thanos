<template>
  <!-- PC -->
  <aside class="sidebar desktop-only">
    <div v-if="logoSrc" class="logo-box">
      <img :src="logoSrc" class="logo" alt="logo" />
    </div>

    <nav class="menu vertical">
      <router-link
        v-for="item in menus"
        :key="item.key"
        :to="item.path"
        class="menu-item"
        :class="{ active: isActive(item.path) }"
      >
        <img
          v-if="getMenuIcon(item)"
          :src="getMenuIcon(item)"
          :alt="item.label"
          class="menu-icon"
        />
        <span class="menu-label">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>

  <!-- 태블릿 -->
  <header class="topbar tablet-only">
    <img v-if="logoSrc" :src="logoSrc" class="topbar-logo" alt="logo" />

    <nav class="menu horizontal">
      <router-link
        v-for="item in menus"
        :key="item.key"
        :to="item.path"
        class="menu-item horizontal"
        :class="{ active: isActive(item.path) }"
      >
        <img
          v-if="getMenuIcon(item)"
          :src="getMenuIcon(item)"
          :alt="item.label"
          class="menu-icon"
        />
        <span class="menu-label">{{ item.label }}</span>
      </router-link>
    </nav>
  </header>

  <!-- 모바일 -->
  <header class="mobile-header mobile-only">
    <div class="mobile-header-inner">
      <img
        v-if="logoSrc"
        :src="logoSrc"
        class="topbar-logo mobile-logo"
        alt="logo"
      />
      <button class="hamburger" type="button" @click="toggleMenu">☰</button>
    </div>

    <transition name="dropdown">
      <nav v-if="isMenuOpen" class="mobile-dropdown-menu">
        <router-link
          v-for="item in menus"
          :key="item.key"
          :to="item.path"
          class="menu-item"
          :class="{ active: isActive(item.path) }"
          @click="closeMenu"
        >
          <img
            v-if="getMenuIcon(item)"
            :src="getMenuIcon(item)"
            :alt="item.label"
            class="menu-icon"
          />
          <span class="menu-label">{{ item.label }}</span>
        </router-link>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  logoSrc: {
    type: String,
    default: '',
  },
  menus: {
    type: Array,
    required: true,
    default: () => [],
  },
  defaultTitle: {
    type: String,
    default: '홈',
  },

  // 텍스트 / 활성 메뉴 색상
  textColor: {
    type: String,
    default: '#805B2E',
  },
  activeBg: {
    type: String,
    default: '#805B2E',
  },
  activeTextColor: {
    type: String,
    default: '#ffffff',
  },

  // 배경 커스터마이징
  navBg: {
    type: String,
    default: '#ffcf00',
  },
  mobileMenuBg: {
    type: String,
    default: '#fff7cc',
  },
});

const route = useRoute();
const isMenuOpen = ref(false);

// 현재 라우트 기준 페이지 제목
const currentTitle = computed(() => {
  return (
    props.menus.find((menu) => menu.path === route.path)?.label ||
    props.defaultTitle
  );
});

// 현재 메뉴 active 여부
const isActive = (path) => route.path === path;

// active 상태면 activeIcon 우선, 없으면 기본 icon
const getMenuIcon = (item) => {
  if (isActive(item.path) && item.activeIcon) return item.activeIcon;
  return item.icon || '';
};

// 모바일 메뉴 열기/닫기
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

// 라우트 바뀌면 모바일 메뉴 닫기
watch(
  () => route.path,
  () => {
    closeMenu();
  }
);
</script>

<style scoped>
@font-face {
  font-family: 'NPS';
  src: url('@/assets/fonts/NPSfont_regular.ttf') format('truetype');
  font-weight: 400;
}

@font-face {
  font-family: 'NPS';
  src: url('@/assets/fonts/NPSfont_bold.ttf') format('truetype');
  font-weight: 700;
}

@font-face {
  font-family: 'NPS';
  src: url('@/assets/fonts/NPSfont_extrabold.ttf') format('truetype');
  font-weight: 800;
}

* {
  box-sizing: border-box;
  font-family: 'NPS', sans-serif;
}

.logo-box {
  display: flex;
  justify-content: center;
  margin-bottom: 5%;
}

.logo {
  width: 75%;
  display: block;
}

.menu {
  flex: 1;
  display: flex;
  gap: 20px;
}

.menu.vertical {
  flex-direction: column;
  justify-content: center;
}

.menu.horizontal {
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 5px 12px;
  text-decoration: none;
  color: v-bind(textColor);
  border-radius: 50px;
}

.menu-item:visited,
.menu-item:hover {
  color: inherit;
  text-decoration: none;
}

.menu-item.active {
  background: v-bind(activeBg);
  color: v-bind(activeTextColor);
  font-weight: 700;
}

.menu-item.horizontal {
  gap: 10px;
}

.menu-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}

.menu-label {
  white-space: nowrap;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 25%;
  height: 100vh;
  background: v-bind(navBg);
  padding: 15px 20px;
}

@media (min-width: 1025px) {
  .desktop-only {
    display: block;
  }

  .tablet-only,
  .mobile-only {
    display: none !important;
  }

  .content {
    margin-left: 25%;
  }
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: v-bind(navBg);
  padding: 3% 24px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 20;
}

.topbar-logo {
  width: 15%;
  display: block;
}

@media (min-width: 769px) and (max-width: 1024px) {
  .tablet-only {
    display: flex;
  }

  .desktop-only,
  .mobile-only {
    display: none !important;
  }

  .content {
    margin-left: 0;
    padding-top: 12%;
  }
}

.mobile-header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: v-bind(navBg);
}

.mobile-header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
}

.mobile-logo {
  width: 40%;
}

.hamburger {
  border: none;
  background: transparent;
  font-size: 24px;
  color: v-bind(textColor);
  cursor: pointer;
}

.mobile-dropdown-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px 16px;
  background: v-bind(mobileMenuBg);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 768px) {
  .mobile-only {
    display: block;
  }

  .desktop-only,
  .tablet-only {
    display: none !important;
  }

  .content {
    margin-left: 0;
    padding: 20px;
  }

  .mobile-dropdown-menu .menu-item {
    width: 100%;
    text-align: left;
  }
}
</style>
