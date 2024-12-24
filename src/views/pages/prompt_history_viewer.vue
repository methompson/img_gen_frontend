<script setup lang="ts">
import { storeToRefs } from 'pinia';
import PromptCard from '@/views/components/prompt_card.vue';

import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { computed, onBeforeMount } from 'vue';

const imgGalleryStore = useImgGalleryStore();
const { promptData } = storeToRefs(imgGalleryStore);

const sortedPrompts = computed(() => {
  return [...promptData.value].sort((a, b) => {
    return a.promptNumber - b.promptNumber;
  });
});

async function fetchHistory() {
  await imgGalleryStore.fetchHistory();
}

async function onBeforeMountHandler() {
  try {
    await fetchHistory();
  } catch (error) {
    console.error(error);
  }
}

onBeforeMount(() => {
  onBeforeMountHandler();
});
</script>

<template>
  <template v-for="prompt in sortedPrompts" :key="`card_${prompt.promptId}`">
    <PromptCard :prompt="prompt" />
  </template>
</template>
