import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => {},
    },
    {
      path: '/register',
      name: 'register',
      component: () => {},
    },
    {
      path: '/stats',
      name: 'stats',
      component: () => import('@/pages/stats/Stats.vue'),
    },
    {
      path: '/map',
      name: 'map',
      component: () => {},
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => {},
    },
  ],
});

export default router;
