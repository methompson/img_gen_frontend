import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/pages/prompt_history_viewer.vue'),
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: () => import('@/views/pages/image_gallery.vue'),
    },
    {
      path: '/prompt',
      name: 'prompt',
      component: () => import('@/views/pages/prompt_form.vue'),
    },
  ],
});

export default router;
