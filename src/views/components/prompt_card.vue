<template>
  <SlideShow
    v-if="showSlideShow"
    @close="showSlideShow = false"
    :images="imagesToShow"
    :showControls="false"
    :title="slideshowTitle"
  />

  <div class="outline mx-4 pa-2">
    <span class="d-flex justify-space-between">
      <h2>{{ prompt.promptNumber }}</h2>
      <v-btn @click="deletePrompt" icon="mdi-trash-can-outline" color="error" />
    </span>
    <template
      v-for="[imgKey, imgValue] in Object.entries(images)"
      :key="`${prompt.promptId}_${imgKey}`"
    >
      <span v-if="isImageNodeAllowed(imgKey)">
        {{ imgKey }}
        <div class="d-flex flex-row overflow-auto">
          <template
            v-for="img in imgValue"
            :key="`${prompt.promptId}_${img.image}`"
          >
            <div class="imageContainer">
              <img
                @click="() => imageClick(img)"
                :src="`http://localhost:3000/image/${img.thumb}`"
                :class="getImageClasses(img)"
              />

              <span class="magGlass">
                <v-icon @click="showImage(img)" color="white"
                  >mdi-magnify</v-icon
                >
              </span>
            </div>
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
import { storeToRefs } from 'pinia';
import { computed, ref, toRefs, type Ref } from 'vue';

import type { ImageSet, PromptAndImageData } from '@/models/history';
import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { isNullOrUndefined } from '@img_gen/utils/type_guards';
import SlideShow from '@/views/components/slide_show.vue';
import { getImageUrl } from '@/utils/make_image_url';

const imgGalleryStore = useImgGalleryStore();

const props = defineProps<{
  prompt: PromptAndImageData;
}>();

const emit = defineEmits<{
  (e: 'deletePrompt', prompt: PromptAndImageData): void;
}>();

const { prompt } = toRefs(props);
const { selectedImagesMap, filteredNodes } = storeToRefs(imgGalleryStore);

const imageToShow: Ref<ImageSet | undefined> = ref(undefined);

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

const showSlideShow = computed({
  get: () => !!imageToShow.value,
  set() {
    imageToShow.value = undefined;
  },
});

const imagesToShow = computed(() => {
  if (!imageToShow.value) {
    return [];
  }

  return [getImageUrl(imageToShow.value.image)];
});

const slideshowTitle = computed(() => {
  return `Prompt ${prompt.value.promptNumber}`;
});

function deletePrompt() {
  emit('deletePrompt', prompt.value);
}

function showImage(img: ImageSet) {
  imageToShow.value = img;
}

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

.imageContainer {
  position: relative;

  img {
    display: block;
  }

  .magGlass {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
