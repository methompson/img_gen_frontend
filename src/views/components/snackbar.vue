<template>
  <v-snackbar
    :timeout="2000"
    :color="snackbarColor"
    elevation="24"
    v-model="showSnackbar"
  >
    {{ message }}

    <template v-slot:actions>
      <v-btn icon="mdi-close" @click="clearMessage" />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';

import { useAppStore } from '@/stores/app_store';
import { isUndefined } from '@img_gen/utils/type_guards';

const appStore = useAppStore();

const { message, messageType, clearMessage } = toRefs(appStore);

const showSnackbar = computed({
  get: () => !isUndefined(messageType) && message.value !== '',
  set(_) {
    appStore.clearMessage();
  },
});

const snackbarColor = computed(() => {
  switch (messageType.value) {
    case 'error':
      return 'red';
    case 'success':
      return 'green';
    default:
      return 'primary';
  }
});
</script>
