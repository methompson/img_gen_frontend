<template>
  <div :class="snackbarScreenClasses">
    <div v-if="showSnackbar" :class="snackbarClasses">
      <span>{{ message }}</span>
      <v-btn icon="mdi-close" @click="clearMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import { useAppStore } from '@/stores/app_store';
import { isUndefined } from '@img_gen/utils/type_guards';

const appStore = useAppStore();

const { message, messageType, clearMessage } = toRefs(appStore);

const showSnackbar = computed(
  () => !isUndefined(messageType) && message.value !== '',
);

const snackbarClasses = computed(() => {
  let snackbarBG = 'bg-indigo-500';
  let snackbarText = 'text-indigo-50';

  if (messageType.value === 'error') {
    snackbarBG = 'bg-orange-500';
    snackbarText = 'text-red-50';
  } else if (messageType.value === 'success') {
    snackbarBG = 'bg-green-500';
    snackbarText = 'text-green-50';
  }

  const classes = [
    'snackbar',
    'rounded-md',
    'mb-4',
    'pa-4',
    'mt-3',
    'd-flex',
    'flex-row',
    'justify-space-between',
    'align-center',
    'pointer-events-auto',
  ];

  classes.push(snackbarBG, snackbarText);

  return classes.join(' ');
});

const snackbarScreenClasses = computed(() => {
  const classes = [
    'snackbarScreen',
    'top-0',
    'right-0',
    'pa-4',
    'd-flex',
    'flex-column',
    'justify-end',
    'align-center',
  ];

  return classes.join(' ');
});
</script>

<style lang="scss" scoped>
.snackbar {
  pointer-events: auto;
  width: 75vw;
}
.snackbarScreen {
  z-index: 1000;
  pointer-events: none;
  position: fixed;
  width: 100vw;
  height: 100vh;
}
</style>
