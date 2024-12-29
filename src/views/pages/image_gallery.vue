<template>
  <SlideShow
    v-if="showSlideshow"
    @close="endSlideShow"
    :images="imagesToDisplay"
  />

  <v-btn
    :disabled="selectedImages.length === 0"
    variant="elevated"
    color="blue-darken-3"
    class="text-white pa-2 rounded-md disabled:text-gray-400 disabled:bg-gray-200"
    @click="startSlideshow"
  >
    Start Slideshow
  </v-btn>

  <div>
    <div
      class="d-flex px-4 py-2 align-center"
      v-for="img in Object.values(selectedImages)"
      :key="img.image"
    >
      <v-btn
        icon="mdi-close"
        variant="text"
        color="red-darken-3"
        @click="removeImage(img)"
      />
      <img :src="getImageUrl(img.thumb)" />
      {{ img.image }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import SlideShow from '@/views/components/slide_show.vue';
import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { getImageUrl } from '@/utils/make_image_url';
import type { ImageSet } from '@/models/history';

const imgGalleryStore = useImgGalleryStore();
const { selectedImages, selectedImagesMap } = storeToRefs(imgGalleryStore);

const showSlideshow = ref(false);

const imagesToDisplay = computed(() =>
  selectedImages.value.map((img) => getImageUrl(img.image)),
);

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
