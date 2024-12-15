<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { XMarkIcon } from '@heroicons/vue/24/solid';

import SlideShow from '@/views/components/slide_show.vue';
import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { getImageUrl } from '@/utils/make_image_url';
import type { ImageSet } from '@/models/history';

const imgGalleryStore = useImgGalleryStore();
const { selectedImages, selectedImagesMap } = storeToRefs(imgGalleryStore);

const showSlideshow = ref(false);

const imagesToDisplay = computed(() => selectedImages.value.map((img) => getImageUrl(img.image)));

function startSlideshow() {
  showSlideshow.value = true;
}

function endSlideShow() {
  showSlideshow.value = false;
}

function removeImage(img: ImageSet) {
  imgGalleryStore.removeSelectedImage(img);
}
</script>

<template>
  <SlideShow v-if="showSlideshow" @close="endSlideShow" :images="imagesToDisplay" />

  <button
    :disabled="selectedImages.length === 0"
    class="bg-cyan-500 text-white p-2 rounded-md disabled:text-gray-400 disabled:bg-gray-200"
    @click="startSlideshow"
  >
    Start Slideshow
  </button>

  <div>
    <div
      class="flex px-4 py-2 items-center"
      v-for="img in Object.values(selectedImages)"
      :key="img.image"
    >
      <button @click="removeImage(img)">
        <XMarkIcon class="h-8 w-8 text-red-500" />
      </button>
      <img :src="getImageUrl(img.thumb)" />
      {{ img.image }}
    </div>
  </div>
</template>
