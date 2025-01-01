<template>
  <VExpansionPanels>
    <VExpansionPanel :class="expansionClasses">
      <VExpansionPanelTitle>
        Image & Batch Size {{ additionalInfo }}</VExpansionPanelTitle
      >

      <VExpansionPanelText>
        <div class="latentImageInputContainer">
          <span class="resSelectLabel">Presets</span>
          <span class="resSelect">
            <VSelect
              :items="presetResolutions"
              variant="solo"
              density="compact"
              v-model="currentResSelect"
              @update:modelValue="updateResolutionFromSelect"
              :hideDetails="true"
            />
          </span>

          <span class="latentWidthLabel">Width</span>
          <IntForm
            v-model="latentWidth"
            @update:modelValue="updateImageInput"
            class="latentWidthInput"
            :min="1"
            :step="1"
            placeholder="Latent Width"
          />

          <span class="latentHeightLabel">Height</span>
          <IntForm
            v-model="latentHeight"
            @update:modelValue="updateImageInput"
            class="latentHeightInput"
            :min="1"
            :step="1"
            placeholder="Latent Height"
          />

          <span class="batchSizeLabel">Batch Size</span>
          <IntForm
            v-model="batchSize"
            @update:modelValue="updateImageInput"
            class="batchSizeInput"
            :min="1"
            :step="1"
            placeholder="Batch Size"
          />
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRefs, watch } from 'vue';

import {
  isLatentImagePrompt,
  type LatentImagePrompt,
} from '@img_gen/models/inputs/latent_image_input';
import { isUndefined } from '@img_gen/utils/type_guards';

import IntForm from '@/views/components/int_input.vue';
import { arrayToObject } from '@img_gen/utils/array_to_obj';

const props = defineProps<{
  latentInput?: LatentImagePrompt;
  missingInput?: boolean;
}>();

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

const currentResSelect = ref('');

const presetResolutions = [
  '',
  '512x512',
  '768x512',
  '512x768',
  '1024x1024',
  '1536x1024',
  '1024x1536',
];

const presetResolutionObj = arrayToObject(
  presetResolutions.filter((x) => x !== ''),
  (x) => x,
);

watch(latentWidth, updateSelectFromResolution);
watch(latentHeight, updateSelectFromResolution);

const additionalInfo = computed(() => {
  return ` - ${latentWidth.value}x${latentHeight.value}`;
});

const currentResolutionString = computed(() => {
  return `${latentWidth.value}x${latentHeight.value}`;
});

const expansionClasses = computed(() => {
  const classes = [];
  if (!latentInput.value) {
    classes.push('errorCard');
  }

  return classes.join(' ');
});

onBeforeMount(() => {
  beforeMountHandler();
});

function beforeMountHandler() {
  updateImageInput();
  currentResSelect.value = currentResolutionString.value;
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

function updateSelectFromResolution() {
  if (presetResolutionObj[currentResolutionString.value]) {
    currentResSelect.value = currentResolutionString.value;
  } else {
    currentResSelect.value = '';
  }
}

function updateResolutionFromSelect(value: string) {
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

.latentWidthInput,
.latentHeightInput,
.batchSizeInput,
.resSelect {
  margin-bottom: 0.5em;
}
</style>
