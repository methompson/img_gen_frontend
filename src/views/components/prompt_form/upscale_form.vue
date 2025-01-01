<template>
  <VExpansionPanels>
    <VExpansionPanel :class="expansionClasses">
      <VExpansionPanelTitle> Upscale </VExpansionPanelTitle>

      <VExpansionPanelText>
        <span>
          <div class="upscaleInputContainer">
            <span class="upscaleMultiplierLabel">Multiplier</span>
            <span class="upscaleMultiplier">
              <VSelect
                v-model="upscaleMultiplierStr"
                :items="multiplierOptions"
                @update:model-value="updateUpscaleInput"
                density="compact"
                variant="solo"
              />
            </span>

            <span class="upscaleWidthLabel">Width</span>
            <IntInput
              v-model="upscaleWidth"
              @update:model-value="updateUpscaleInput"
              class="upscaleWidthInput"
              :step="1"
              :min="1"
              placeholder="Upscale Width"
            />

            <span class="upscaleHeightLabel">Height</span>
            <IntInput
              v-model="upscaleHeight"
              @input="updateUpscaleInput"
              class="upscaleHeightInput"
              :step="1"
              :min="1"
              placeholder="Upscale Height"
            />
          </div>

          <SamplerInput
            :inputClasses="inputClasses"
            :samplerInput="samplerData"
            @updateSampler="updateImageSampler"
          />
        </span>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRefs, watch, type Ref } from 'vue';

import { isNullOrUndefined, isUndefined } from '@img_gen/utils/type_guards';
import { getDefaultUpscaleSamplerData, type InputDimensions } from './types';
import type { SamplerData } from '@img_gen/models/inputs/sampler';
import type { UpscalePrompt } from '@img_gen/models/inputs/upscale';

import SamplerInput from '@/views/components/prompt_form/sampler_form.vue';
import IntInput from '@/views/components/int_input.vue';

const multiplierOptions = [
  { value: '1.25', title: '1.25x' },
  { value: '1.5', title: '1.5x' },
  { value: '2', title: '2x' },
  { value: '2.5', title: '2.5x' },
  { value: '3', title: '3x' },
  { value: '3.5', title: '3.5x' },
  { value: '4', title: '4x' },
];

const defaultSamplerData = getDefaultUpscaleSamplerData();

const emit = defineEmits<{
  (e: 'updateUpscaleInput', payload: UpscalePrompt | undefined): void;
}>();

const props = withDefaults(
  defineProps<{
    inputClasses?: string;
    upscaleInput?: UpscalePrompt;
    inputDimensions?: InputDimensions;
  }>(),
  {
    inputClasses: '',
  },
);

const { upscaleInput, inputDimensions } = toRefs(props);

watch(upscaleInput, (newVal) => {
  if (isUndefined(newVal)) {
    return;
  }

  if (
    JSON.stringify(newVal.samplerInput) !== JSON.stringify(samplerData.value)
  ) {
    samplerData.value = newVal.samplerInput;
  }

  if (upscaleWidth.value !== newVal.upscaleWidth) {
    upscaleWidth.value = newVal.upscaleWidth;
  }

  if (upscaleHeight.value !== newVal.upscaleHeight) {
    upscaleHeight.value = newVal.upscaleHeight;
  }
});

watch(inputDimensions, () => {
  setDimensionsFromMultiplier();
});

const upscaleWidth = ref(1024);
const upscaleHeight = ref(1024);
const upscaleMultiplierStr = ref('2');

const samplerData: Ref<SamplerData | undefined> = ref(defaultSamplerData);

watch(upscaleWidth, (newVal) => {
  updateMultiplierFromDimensions();
});
watch(upscaleHeight, (newVal) => {});

const optionFromRes = computed(() => {
  const inputWidth = inputDimensions.value?.width;
  const inputHeight = inputDimensions.value?.height;
  const upscaleWidthVal = upscaleWidth.value;
  const upscaleHeightVal = upscaleHeight.value;

  if (isNullOrUndefined(inputWidth) || isNullOrUndefined(inputHeight)) {
    return '';
  }

  const widthMult = upscaleWidthVal / inputWidth;
  const heightMult = upscaleHeightVal / inputHeight;

  if (widthMult !== heightMult) {
    return '';
  }

  switch (widthMult) {
    case 1.25:
      return '1.25';
    case 1.5:
      return '1.5';
    case 2:
      return '2';
    case 2.5:
      return '2.5';
    case 3:
      return '3';
    case 3.5:
      return '3.5';
    case 4:
      return '4';
    default:
      return '';
  }
});

const upscaleMultiplier = computed(() => {
  const parsedRaw = Number.parseFloat(upscaleMultiplierStr.value);

  if (Number.isNaN(parsedRaw)) {
    return 0;
  }

  return parsedRaw;
});
watch(upscaleMultiplier, () => {
  setDimensionsFromMultiplier();
});

const expansionClasses = computed(() => {
  const classes = [];
  if (!upscaleInput.value) {
    classes.push('errorCard');
  }

  return classes.join(' ');
});

onBeforeMount(() => {
  beforeMountHandler();
});

function beforeMountHandler() {
  samplerData.value = defaultSamplerData;

  if (inputDimensions.value && upscaleMultiplier.value) {
    upscaleWidth.value = inputDimensions.value.width * upscaleMultiplier.value;
    upscaleHeight.value =
      inputDimensions.value.height * upscaleMultiplier.value;
  }

  updateUpscaleInput();
}

function updateMultiplierFromDimensions() {
  upscaleMultiplierStr.value = optionFromRes.value;
}

function updateImageSampler(sampler: SamplerData) {
  samplerData.value = sampler;
  updateUpscaleInput();
}

function updateUpscaleInput() {
  if (isUndefined(samplerData.value)) {
    emit('updateUpscaleInput', undefined);
    return;
  }

  emit('updateUpscaleInput', {
    upscaleWidth: upscaleWidth.value,
    upscaleHeight: upscaleHeight.value,
    samplerInput: samplerData.value,
    upscaleModelName: '4xNMKDSuperscale_4xNMKDSuperscale.pt',
  });
}

function setDimensionsFromMultiplier() {
  if (
    isNullOrUndefined(inputDimensions.value) ||
    upscaleMultiplier.value === 0
  ) {
    return;
  }

  upscaleWidth.value = inputDimensions.value.width * upscaleMultiplier.value;
  upscaleHeight.value = inputDimensions.value.height * upscaleMultiplier.value;

  updateUpscaleInput();
}
</script>

<style lang="scss" scoped>
.upscaleInputContainer {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'multiplierLabel multiplier'
    'widthLabel widthInput'
    'heightLabel heightInput';

  margin-bottom: 1em;
}

.upscaleWidthLabel {
  grid-area: widthLabel;
}
.upscaleWidthInput {
  grid-area: widthInput;
}

.upscaleHeightLabel {
  grid-area: heightLabel;
}
.upscaleHeightInput {
  grid-area: heightInput;
}

.upscaleMultiplierLabel {
  grid-area: multiplierLabel;
}
.upscaleMultiplier {
  grid-area: multiplier;
}

.upscaleWidthLabel,
.upscaleHeightLabel,
.upscaleMultiplierLabel {
  margin-right: 1em;
  display: flex;
  align-items: center;
}

.upscaleWidthInput,
.upscaleHeightInput {
  width: 17em;
  margin-bottom: 0.5em;
}
</style>
