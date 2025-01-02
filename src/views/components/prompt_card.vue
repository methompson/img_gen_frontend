<template>
  <div class="outline mx-4 pa-2">
    <h2>{{ prompt.promptNumber }}</h2>
    <template
      v-for="[imgKey, imgValue] in Object.entries(images)"
      :key="`${prompt.promptId}_${imgKey}`"
    >
      <span v-if="isImageNodeAllowed(imgKey)">
        {{ imgKey }}
        <div class="flex flex-row">
          <template
            v-for="img in imgValue"
            :key="`${prompt.promptId}_${img.image}`"
          >
            <span>
              <img
                @click="() => imageClick(img)"
                :src="`http://localhost:3000/image/${img.thumb}`"
                :class="getImageClasses(img)"
              />
            </span>
          </template>
        </div>
      </span>
    </template>

    <VExpansionPanels>
      <VExpansionPanel>
        <VExpansionPanelTitle>Prompt Info</VExpansionPanelTitle>

        <VExpansionPanelText>
          <p class="pb-2">Positive: {{ prompt.positivePrompt }}</p>
          <VDivider :thickness="4" color="primary" class="pb-2" />
          <p>Negative: {{ prompt.negativePrompt }}</p>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </div>
</template>

<script setup lang="ts">
import type { ImageSet, PromptAndImageData } from '@/models/history';
import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { isNullOrUndefined } from '@img_gen/utils/type_guards';
import { storeToRefs } from 'pinia';
import { computed, toRefs } from 'vue';

const imgGalleryStore = useImgGalleryStore();

const props = defineProps<{
  prompt: PromptAndImageData;
}>();

const { prompt } = toRefs(props);
const { selectedImagesMap, filteredNodes } = storeToRefs(imgGalleryStore);

const images = computed(() => {
  const imagesByNode: Record<string, ImageSet[]> = {};

  Object.entries(prompt.value.images).forEach(([key, value]) => {
    const imageLinks = Object.values(value).map((v) => {
      return v;
    });

    imagesByNode[key] = imageLinks;
  });

  return imagesByNode;
});

function isImageNodeAllowed(imageSetKey: string) {
  if (filteredNodes.value.length === 0) {
    return true;
  }

  return filteredNodes.value.includes(imageSetKey);
}

function imageClick(imageSet: ImageSet) {
  if (isSelectedImage(imageSet)) {
    imgGalleryStore.removeSelectedImage(imageSet);
  } else {
    imgGalleryStore.addSelectedImage(imageSet);
  }
}

function isSelectedImage(imageSet: ImageSet) {
  return !isNullOrUndefined(selectedImagesMap.value[imageSet.image]);
}

function getImageClasses(imageSet: ImageSet) {
  const classes: string[] = ['border-md'];

  if (isSelectedImage(imageSet)) {
    classes.push('redBorder');
  } else {
    classes.push('outline');
  }

  return classes.join(' ');
}
</script>

<style lang="scss" scoped>
.redBorder {
  border-color: red !important;
}

.outline {
  border-color: transparent;
}
</style>
