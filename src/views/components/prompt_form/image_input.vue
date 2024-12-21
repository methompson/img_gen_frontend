<template>
  <div class="latentImageInputContainer">
    <span class="latentWidthLabel">Width</span>
    <input
      v-model="latentWidth"
      @input="updateImageInput"
      type="number"
      :class="inputClasses + ' latentWidthInput'"
      placeholder="Latent Width"
    />
    <span class="latentHeightLabel">Height</span>
    <input
      v-model="latentHeight"
      @input="updateImageInput"
      type="number"
      :class="inputClasses + ' latentHeightInput'"
      placeholder="Latent Height"
    />
    <span class="batchSizeLabel">Batch Size</span>
    <input
      v-model="batchSize"
      @input="updateImageInput"
      type="number"
      :class="inputClasses + ' batchSizeInput'"
      placeholder="Batch Size"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, toRefs, watch } from 'vue';

import {
  isLatentImagePrompt,
  type LatentImagePrompt,
} from '@img_gen/models/inputs/latent_image_input';
import { isUndefined } from '@img_gen/utils/type_guards';

const props = withDefaults(
  defineProps<{
    inputClasses?: string;
    latentInput?: LatentImagePrompt;
  }>(),
  {
    inputClasses: '',
  },
);

const { latentInput } = toRefs(props);

watch(latentInput, (newVal) => {
  if (isUndefined(newVal)) {
    return;
  }

  if (latentWidth.value !== newVal.latentWidth) {
    latentWidth.value = newVal.latentWidth;
  }
  if (latentHeight.value !== newVal.latentHeight) {
    latentHeight.value = newVal.latentHeight;
  }
  if (batchSize.value !== newVal.batchSize) {
    batchSize.value = newVal.batchSize;
  }
});

const emit = defineEmits<{
  (e: 'updateImageInput', input: LatentImagePrompt | undefined): void;
}>();

const latentWidth = ref(512);
const latentHeight = ref(512);
const batchSize = ref(1);

onBeforeMount(() => {
  beforeMountHandler();
});

function beforeMountHandler() {
  updateImageInput();
}

function updateImageInput() {
  const input = {
    latentWidth: latentWidth.value,
    latentHeight: latentHeight.value,
    batchSize: batchSize.value,
  };

  if (!isLatentImagePrompt(input)) {
    emit('updateImageInput', undefined);
    return;
  }

  emit('updateImageInput', input);
}
</script>

<style lang="scss" scoped>
.latentImageInputContainer {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'latentWidthLabel latentWidthInput'
    'latentHeightLabel latentHeightInput'
    'batchSizeLabel batchSizeInput';
}

.latentWidthLabel {
  grid-area: latentWidthLabel;
}
.latentWidthInput {
  grid-area: latentWidthInput;
}
.latentHeightLabel {
  grid-area: latentHeightLabel;
}
.latentHeightInput {
  grid-area: latentHeightInput;
}
.batchSizeLabel {
  grid-area: batchSizeLabel;
}
.batchSizeInput {
  grid-area: batchSizeInput;
}

.latentWidthLabel,
.latentHeightLabel,
.batchSizeLabel {
  margin-right: 1em;
}

.latentWidthInput,
.latentHeightInput,
.batchSizeInput {
  width: 10em;
}
</style>
