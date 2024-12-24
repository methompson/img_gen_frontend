<template>
  <div :class="snackbarScreenClasses">
    <div v-if="showSnackbar" :class="snackbarClasses">
      <span>{{ message }}</span>
      <button @click="clearMessage">
        <XMarkIcon class="h-6 w-6 text-white" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';

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
    'p-4',
    'mt-3',
    'flex',
    'flex-row',
    'justify-between',
    'items-center',
    'pointer-events-auto',
  ];

  classes.push(snackbarBG, snackbarText);

  return classes.join(' ');
});

const snackbarScreenClasses = computed(() => {
  const classes = [
    'snackbarScreen',
    'pointer-events-none',
    'fixed',
    'top-0',
    'right-0',
    'w-screen',
    'h-screen',
    'p-4',
    'flex',
    'flex-col',
    'justify-end',
    'items-center',
  ];

  return classes.join(' ');
});
</script>

<style lang="scss" scoped>
.snackbar {
  // background-color: green;
}

.snackbarScreen {
  z-index: 1000;
  // background-color: red;
}
</style>
