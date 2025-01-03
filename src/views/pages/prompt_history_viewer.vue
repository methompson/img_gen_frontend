<template>
  <NodeFilterSelect />

  <VContainer>
    <VRow class="">
      <template
        v-for="prompt in sortedPrompts"
        :key="`card_${prompt.promptId}`"
      >
        <VCol :cols="12" :sm="6" :lg="4">
          <PromptCard @deletePrompt="deletePrompt" :prompt="prompt" />
        </VCol>
      </template>
    </VRow>
  </VContainer>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { storeToRefs } from 'pinia';

import NodeFilterSelect from '@/views/components/node_filter_select.vue';
import PromptCard from '@/views/components/prompt_card.vue';

import { useImgGalleryStore } from '@/stores/img_gallery_store';
import type { PromptAndImageData } from '@/models/history';
import { useAppStore } from '@/stores/app_store';

const appStore = useAppStore();

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

async function deletePrompt(prompt: PromptAndImageData) {
  try {
    await imgGalleryStore.deleteHistoryItems([prompt.promptId]);
    appStore.setSuccessMessage({ message: 'Prompt deleted' });
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({ message: 'Error deleting prompt' });
  }
}

onBeforeMount(() => {
  onBeforeMountHandler();
});
</script>
