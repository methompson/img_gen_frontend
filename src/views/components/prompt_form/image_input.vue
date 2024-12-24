<template>
  <span class="flex flex-row justify-between w-100">
    <h1 class="text-lg font-bold">Image & Batch Size</h1>

    <BasicButton @click="toggleShowCheckpointCard">
      <template v-if="showImageInputCard">
        <XMarkIcon class="h-4 w-4" />
      </template>
      <template v-else>
        <PlusIcon class="h-4 w-4" />
      </template>
    </BasicButton>
  </span>

  <div v-if="showImageInputCard" class="latentImageInputContainer">
    <span class="resSelectLabel">Presets</span>
    <span class="resSelect">
      <select
        class="rounded-md p-2 my-2"
        v-model="currentResSelect"
        @click="resSelectClickHandler"
        @input="resSelectInputHandler"
      >
        <option value=""></option>
        <option value="512x512">512x512</option>
        <option value="768x512">768x512</option>
        <option value="512x768">512x768</option>
        <option value="1024x1024">1024x1024</option>
        <option value="1536x1024">1536x1024</option>
        <option value="1024x1536">1024x1536</option>
      </select>
    </span>

    <span class="latentWidthLabel">Width</span>
    <IntForm
      v-model="latentWidth"
      @input="updateImageInput"
      :class="inputClasses + ' latentWidthInput'"
      :min="1"
      :step="1"
      placeholder="Latent Width"
    />

    <span class="latentHeightLabel">Height</span>
    <IntForm
      v-model="latentHeight"
      @input="updateImageInput"
      :class="inputClasses + ' latentHeightInput'"
      :min="1"
      :step="1"
      placeholder="Latent Height"
    />

    <span class="batchSizeLabel">Batch Size</span>
    <IntForm
      v-model="batchSize"
      @input="updateImageInput"
      :inputClasses="inputClasses + ' batchSizeInput'"
      :step="1"
      :min="1"
      placeholder="Batch Size"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRefs, watch } from 'vue';
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid';

import {
  isLatentImagePrompt,
  type LatentImagePrompt,
} from '@img_gen/models/inputs/latent_image_input';
import { isUndefined } from '@img_gen/utils/type_guards';

import BasicButton from '@/views/components/basic_button.vue';
import IntForm from '@/views/components/int_form.vue';

const props = withDefaults(
  defineProps<{
    inputClasses?: string;
    latentInput?: LatentImagePrompt;
    missingInput?: boolean;
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

const showImageInputCard = ref(true);

const latentWidth = ref(512);
const latentHeight = ref(512);
const batchSize = ref(1);

const currentResSelect = ref('');

onBeforeMount(() => {
  beforeMountHandler();
});

watch(latentWidth, () => {
  currentResSelect.value = optionFromRes.value;
});
watch(latentHeight, () => {
  currentResSelect.value = optionFromRes.value;
});

const optionFromRes = computed(() => {
  return `${latentWidth.value}x${latentHeight.value}`;
});

function toggleShowCheckpointCard() {
  showImageInputCard.value = !showImageInputCard.value;
}

function beforeMountHandler() {
  updateImageInput();
  currentResSelect.value = optionFromRes.value;
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

function resSelectInputHandler(input: Event) {
  setResFromEv(input.target);
}

function resSelectClickHandler(input: MouseEvent) {
  setResFromEv(input.target);
}

function setResFromEv(target: EventTarget | null) {
  if (
    !(target instanceof HTMLSelectElement) &&
    !(target instanceof HTMLOptionElement)
  ) {
    return;
  }

  const value = target.value;

  const [width, height] = value.split('x').map((x) => parseInt(x, 10));
  if (width && height) {
    latentWidth.value = width;
    latentHeight.value = height;

    updateImageInput();
  }
}
</script>

<style lang="scss" scoped>
.latentImageInputContainer {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'resSelectLabel resSelect'
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
.resSelectLabel {
  grid-area: resSelectLabel;
}
.resSelect {
  grid-area: resSelect;
}

.latentWidthLabel,
.latentHeightLabel,
.batchSizeLabel,
.resSelectLabel {
  margin-right: 1em;
  display: flex;
  align-items: center;
}

.latentWidthInput,
.latentHeightInput,
.batchSizeInput {
  width: 10em;
}
</style>
