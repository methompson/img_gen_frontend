<template>
  <span class="flex flex-row justify-between w-100">
    <h1 class="text-lg font-bold">Upscale</h1>

    <BasicButton @click="toggleUpscaleCard">
      <template v-if="showUpscaleCard">
        <XMarkIcon class="h-4 w-4" />
      </template>

      <template v-else>
        <PlusIcon class="h-4 w-4" />
      </template>
    </BasicButton>
  </span>

  <span v-if="showUpscaleCard">
    <div class="upscaleInputContainer">
      <span class="upscaleMultiplierLabel">Multiplier</span>
      <span class="upscaleMultiplier">
        <select
          class="rounded-md p-2 my-2"
          v-model="upscaleMultiplierStr"
          @input="updateUpscaleInput"
        >
          <option value=""></option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
          <option value="2.5">2.5x</option>
          <option value="3">3x</option>
          <option value="3.5">3.5x</option>
          <option value="4">4x</option>
        </select>
      </span>

      <span class="upscaleWidthLabel">Width</span>
      <IntForm
        v-model="upscaleWidth"
        @input="updateUpscaleInput"
        :inputClasses="inputClasses + ' upscaleWidthInput'"
        :step="1"
        :min="1"
        placeholder="Upscale Width"
      />

      <span class="upscaleHeightLabel">Height</span>
      <IntForm
        v-model="upscaleHeight"
        @input="updateUpscaleInput"
        :inputClasses="inputClasses + ' upscaleHeightInput'"
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
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRefs, watch, type Ref } from 'vue';
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid';

import { isNullOrUndefined, isUndefined } from '@img_gen/utils/type_guards';
import { getDefaultUpscaleSamplerData, type InputDimensions } from './types';
import type { SamplerData } from '@img_gen/models/inputs/sampler';
import type { UpscalePrompt } from '@img_gen/models/inputs/upscale';

import SamplerInput from '@/views/components/prompt_form/sampler_input.vue';
import IntForm from '@/views/components/int_form.vue';
import BasicButton from '@/views/components/basic_button.vue';

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

const showUpscaleCard = ref(true);

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

function toggleUpscaleCard() {
  showUpscaleCard.value = !showUpscaleCard.value;
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
.upscaleHeightInput,
.upscaleHeightInput {
  width: 17em;
}
</style>
