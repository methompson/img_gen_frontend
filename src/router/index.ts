import { createRouter, createWebHistory } from 'vue-router';
import PromptHistoryViewer from '@/views/pages/prompt_history_viewer.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PromptHistoryViewer,
    },
  ],
});

export default router;
