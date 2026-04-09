import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/Home.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/pages/register/RegisterPage.vue'),
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/pages/stats/Stats.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/pages/map/MapPage.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => {},
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/user/login/LoginPage.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/pages/user/signup/SignupPage.vue'),
    },
  ],
});

const publicRoutes = ['login', 'signup'];

router.beforeEach((to) => {
  const userId = localStorage.getItem('userId');
  if (!userId && !publicRoutes.includes(to.name)) {
    return { name: 'login' };
  }
});

export default router;
