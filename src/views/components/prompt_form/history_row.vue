<template>
  <VCol class="py-0">
    <v-tooltip>
      <template v-slot:activator="{ props }">
        <span class="promptNumber" v-bind="props">
          {{ prompt.promptNumber }}
        </span>
      </template>

      <img
        v-for="thumb in allThumbs"
        :key="thumb"
        :src="`http://localhost:3000/image/${thumb}`"
      />
    </v-tooltip>
  </VCol>

  <VCol class="py-0">
    <v-btn @click="loadPrompt(prompt)" color="primary"> Load </v-btn>
  </VCol>

  <VCol class="py-0">
    <v-btn
      @click="deletePrompt(prompt)"
      icon="mdi-trash-can-outline"
      color="error"
    />
  </VCol>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import { storeToRefs } from 'pinia';

import type { PromptAndImageData } from '@/models/history';
import { getImagesByNode } from './utils';
import { useImgGalleryStore } from '@/stores/img_gallery_store';

const props = defineProps<{
  prompt: PromptAndImageData;
}>();

const emit = defineEmits<{
  (e: 'loadPrompt', prompt: PromptAndImageData): void;
  (e: 'deletePrompt', prompt: PromptAndImageData): void;
}>();

const { prompt } = toRefs(props);

const imgGalleryStore = useImgGalleryStore();
const { filteredNodes } = storeToRefs(imgGalleryStore);

const images = computed(() => {
  return getImagesByNode(prompt.value.images);
});

const allThumbs = computed(() => {
  const thumbs = Object.entries(images.value)
    .map(([key, imageSets]) => {
      // Filtering out nodes that are not selected.
      if (
        filteredNodes.value.length > 0 &&
        !filteredNodes.value.includes(key)
      ) {
        return [];
      }

      // Mapping the thumbs to an array for this component.
      return imageSets.map((imageSet) => {
        return imageSet.thumb;
      });
    })
    .flat();

  return thumbs;
});

function loadPrompt(loadedPrompt: PromptAndImageData) {
  emit('loadPrompt', loadedPrompt);
}

function deletePrompt(promptToDelete: PromptAndImageData) {
  emit('deletePrompt', promptToDelete);
}
</script>

<style lang="scss" scoped>
.promptNumber {
  font-size: 1.5rem;
}
</style>
