<template><span class="themeWatcher"></span></template>

<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();

onBeforeMount(() => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', themeChangeWatcher);

  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    setDarkMode();
  } else {
    setLightMode();
  }
});

onBeforeUnmount(() => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .removeEventListener('change', themeChangeWatcher);
});

function themeChangeWatcher(event: MediaQueryListEvent) {
  if (event.matches) {
    setDarkMode();
  } else {
    setLightMode();
  }
}

function setDarkMode() {
  theme.global.name.value = 'dark';
}
function setLightMode() {
  theme.global.name.value = 'light';
}
</script>

<style lang="css" scoped>
.themeWatcher {
  display: none;
}
</style>
