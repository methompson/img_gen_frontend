<script setup lang="ts">
import { RouterView } from 'vue-router';
import { computed } from 'vue';

import TopBar from '@/views/components/top_bar.vue';
import SnackBar from '@/views/components/snackbar.vue';

const appClasses = computed(() => {
  const classes = [
    'bg-white',
    'dark:bg-slate-800',
    'overflow-hidden',
    'text-slate-500',
    'dark:text-slate-400',
    'h-screen',
    'overflow-scroll',
    'pointer-events-auto',
  ];

  return classes.join(' ');
});
</script>

<template>
  <div :class="appClasses">
    <TopBar />
    <RouterView />
    <SnackBar />
  </div>
</template>
