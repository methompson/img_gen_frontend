<template>
  <div class="slideshowContainer">
    <div class="slideshowHeader pa-4">
      {{ slideShowTitle }}
      <span>
        <span v-if="showControls">
          <v-btn
            icon="mdi-play"
            v-if="isNullOrUndefined(timeoutRef)"
            @click="startSlideshow"
          />
          <v-btn icon="mdi-stop" v-else @click="stopSlideshow" />
        </span>

        <v-btn class="ml-2" icon="mdi-close" @click="emit('close')" />
      </span>
    </div>

    <div class="imageContainer">
      <img class="img" :src="currentImage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onUnmounted,
  ref,
  toRefs,
  type Ref,
} from 'vue';

import { isNullOrUndefined, isUndefined } from '@img_gen/utils/type_guards';

const props = withDefaults(
  defineProps<{
    images: string[];
    showControls?: boolean;
    title?: string;
  }>(),
  {
    showControls: true,
  },
);

const { images, title } = toRefs(props);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const currentImageIndex = ref(0);
const timeoutRef: Ref<number | undefined> = ref(undefined);

const currentImage = computed(() => images.value[currentImageIndex.value]);
const slideshowOn = computed(() => !isNullOrUndefined(timeoutRef.value));

const slideShowTitle = computed(() => {
  if (title.value) {
    return title.value;
  }

  return 'Slide Show';
});

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
  timeoutRef.value = window.setTimeout(() => {
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

<style lang="scss" scoped>
.slideshowHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: rgb(var(--v-theme-background));
}

.slideshowContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  z-index: 10;
  background-color: rgb(var(--v-theme-surface));
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
