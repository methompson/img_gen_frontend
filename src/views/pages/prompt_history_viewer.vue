<template>
  <NodeFilterSelect />

  <VRow>
    <template v-for="prompt in sortedPrompts" :key="`card_${prompt.promptId}`">
      <VCol :cols="12" :sm="6" :lg="4" class="mb-4">
        <PromptCard :prompt="prompt" />
      </VCol>
    </template>
  </VRow>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { storeToRefs } from 'pinia';

import NodeFilterSelect from '@/views/components/node_filter_select.vue';
import PromptCard from '@/views/components/prompt_card.vue';

import { useImgGalleryStore } from '@/stores/img_gallery_store';

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
