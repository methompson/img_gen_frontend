<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onUnmounted,
  ref,
  toRefs,
  type Ref,
} from 'vue';
import { PlayIcon, StopIcon, XMarkIcon } from '@heroicons/vue/24/solid';

import { isNullOrUndefined, isUndefined } from '@img_gen/utils/type_guards';

const props = defineProps<{
  images: string[];
}>();

const { images } = toRefs(props);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const currentImageIndex = ref(0);
const timeoutRef: Ref<number | undefined> = ref(undefined);

const currentImage = computed(() => images.value[currentImageIndex.value]);
const slideshowOn = computed(() => !isNullOrUndefined(timeoutRef.value));

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.value.length;

  if (!isUndefined(timeoutRef.value)) {
    startSlideshow();
  }
}

function prevImage() {
  currentImageIndex.value =
    (currentImageIndex.value - 1 + images.value.length) % images.value.length;

  if (!isUndefined(timeoutRef.value)) {
    startSlideshow();
  }
}

function keyboardHandler(ev: KeyboardEvent) {
  switch (ev.key) {
    case 'ArrowRight':
      nextImage();
      break;
    case 'ArrowLeft':
      prevImage();
      break;
    case 'k':
      toggleSlideshow();
      break;
    case 'Escape':
      emit('close');
      break;
    default:
      break;
  }
}

function startSlideshow() {
  stopSlideshow();
  timeoutRef.value = setTimeout(() => {
    nextImage();
  }, 4000);
}

function stopSlideshow() {
  clearTimeout(timeoutRef.value);
  timeoutRef.value = undefined;
}

function toggleSlideshow() {
  if (slideshowOn.value) {
    stopSlideshow();
  } else {
    startSlideshow();
  }
}

onBeforeMount(() => {
  window.addEventListener('keyup', keyboardHandler);
});

onUnmounted(() => {
  window.removeEventListener('keyup', keyboardHandler);
});
</script>

<template>
  <div class="slideshowContainer bg-slate-800">
    <div class="slideshowHeader bg-slate-900 text-slate-400 p-4">
      Slide Show
      <span>
        <button v-if="isNullOrUndefined(timeoutRef)" @click="startSlideshow">
          <PlayIcon class="h-6 w-6" />
        </button>
        <button v-else @click="stopSlideshow">
          <StopIcon class="h-6 w-6" />
        </button>
        <button @click="emit('close')">
          <XMarkIcon class="h-6 w-6" />
        </button>
      </span>
    </div>

    <div class="imageContainer">
      <img class="img" :src="currentImage" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slideshowHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.slideshowContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
}

.imageContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;

  height: 100%;
}

.img {
  max-height: 100%;
}
</style>
