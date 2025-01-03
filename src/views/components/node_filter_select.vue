<template>
  <VSelect
    label="Filter Image Nodes (Select To Show)"
    :items="allImageNodes"
    v-model="filteredNodes"
    multiple
    hide-details
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { getImagesByNode } from '@/views/components/prompt_form/utils';
import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { storeToRefs } from 'pinia';

const imgGalleryStore = useImgGalleryStore();

const { promptData, filteredNodes } = storeToRefs(imgGalleryStore);

const allImageNodes = computed(() => {
  const allImageNodesDat = promptData.value
    .map((prompt) => {
      const images = getImagesByNode(prompt.images);

      return Object.keys(images);
    })
    .flat();

  const keys: Record<string, string> = {};
  allImageNodesDat.forEach((node) => {
    keys[node] = node;
  });

  return Object.keys(keys);
});
</script>
