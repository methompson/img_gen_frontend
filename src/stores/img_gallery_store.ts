import { defineStore } from 'pinia';
import { computed, ref, type Ref } from 'vue';

import type { ImageSet, PromptAndImageDataStruct } from '@/models/history_data';

import * as historyApi from '@/api/history';
import * as modelsApi from '@/api/models';
import { arrayToMap } from '@/utils/array_to_obj';

export const useImgGalleryStore = defineStore('imageGallery', () => {
  const promptDataState: Ref<PromptAndImageDataStruct[]> = ref([]);
  const selectedImageState: Ref<ImageSet[]> = ref([]);
  const modelsState: Ref<modelsApi.GetModelsOutput> = ref({
    models: [],
    loras: [],
    upscaleModels: [],
  });

  const promptData = computed(() => [...promptDataState.value]);
  const selectedImages = computed(() => [...selectedImageState.value]);
  const selectedImagesMap = computed(() => arrayToMap(selectedImages.value, (i) => i.image));
  const models = computed(() => JSON.parse(JSON.stringify(modelsState.value)));

  async function fetchHistory() {
    const history = await historyApi.fetchImages();
    promptDataState.value = history;
  }

  async function fetchModels() {
    const modelData = await modelsApi.fetchModels();
    modelsState.value = modelData;
  }

  async function addSelectedImage(imageSet: ImageSet) {
    selectedImageState.value.push(imageSet);
  }

  async function clearSelectedImages() {
    selectedImageState.value = [];
  }

  async function removeSelectedImage(imageSet: ImageSet) {
    selectedImageState.value = selectedImageState.value.filter((i) => i.image !== imageSet.image);
  }

  return {
    promptData,
    selectedImages,
    selectedImagesMap,
    models,
    fetchHistory,
    fetchModels,
    addSelectedImage,
    clearSelectedImages,
    removeSelectedImage,
  };
});
