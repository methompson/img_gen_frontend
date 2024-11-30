import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';

import type { PromptAndImageData } from '@/models/history_data';

import * as historyApi from '@/api/history';

export const useImgGalleryStore = defineStore('imageGallery', () => {
  const promptDataState: Ref<PromptAndImageData[]> = ref([]);

  const promptData = computed(() => [...promptDataState.value]);

  async function fetchHistory() {
    const history = await historyApi.fetchHistory();
    promptDataState.value = history;
  }

  return {
    promptData,
    fetchHistory,
  };
});
