<script setup lang="ts"></script>

<template>
  <div class="topBarContainer pa-2">
    <RouterLink to="/" class="text-slate mr-2">Home Gallery</RouterLink>
    <RouterLink to="/slideshow" class="text-slate mr-2">Slide Show</RouterLink>
    <RouterLink to="/prompt" class="text-slate mr-2">Prompt Form</RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.topBarContainer {
  display: flex;
  justify-content: flex-start;
  position: sticky;
  top: 0;
  background-color: rgb(var(--v-theme-surface));
  z-index: 10;
}
</style>
