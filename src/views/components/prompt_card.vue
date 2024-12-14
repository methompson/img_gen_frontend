<script setup lang="ts">
import type { ImageSet, PromptAndImageDataStruct } from '@/models/history_data';
import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { isNullOrUndefined } from '@/utils/type_guards';
import { storeToRefs } from 'pinia';
import { computed, toRefs } from 'vue';

const imgGalleryStore = useImgGalleryStore();

const props = defineProps<{
  prompt: PromptAndImageDataStruct;
}>();

const { prompt } = toRefs(props);
const { selectedImagesMap } = storeToRefs(imgGalleryStore);

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
  const classes: string[] = ['border-2'];

  if (isSelectedImage(imageSet)) {
    classes.push('border-red-500');
  } else {
    classes.push('border-transparent');
  }

  return classes.join(' ');
}
</script>

<template>
  <div class="outline m-4 p-2">
    <h2>{{ prompt.promptNumber }}</h2>
    <p>Positive: {{ prompt.positiveClip }}</p>
    <p>Negative: {{ prompt.negativeClip }}</p>

    <template
      v-for="[imgKey, imgValue] in Object.entries(images)"
      :key="`${prompt.promptId}_${imgKey}`"
    >
      {{ imgKey }}
      <div class="flex flex-row">
        <template v-for="img in imgValue" :key="`${prompt.promptId}_${img.image}`">
          <span :class="getImageClasses(img)">
            <img @click="() => imageClick(img)" :src="`http://localhost:3000/image/${img.thumb}`" />
          </span>
        </template>
      </div>
    </template>
  </div>
</template>
