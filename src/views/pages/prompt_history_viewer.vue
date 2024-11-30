<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { PromptCard } from '../components/prompt_card';

import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { onBeforeMount } from 'vue';

const imgGalleryStore = useImgGalleryStore();
const { promptData } = storeToRefs(imgGalleryStore);

async function fetchHistory() {
  await imgGalleryStore.fetchHistory();
}

onBeforeMount(() => {
  try {
    fetchHistory();
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <template v-for="prompt in promptData" :key="`card_${prompt.promptId}`">
    <PromptCard :prompt="prompt" />
  </template>
</template>
