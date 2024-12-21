<template>
  <div class="upscaleInputContainer">
    <span class="upscaleWidthLabel">Width</span>
    <input
      v-model="upscaleWidth"
      @change="updateUpscaleInput"
      type="number"
      :class="inputClasses + ' upscaleWidthInput'"
      placeholder="Upscale Width"
    />
    <span class="upscaleHeightLabel">Height</span>
    <input
      v-model="upscaleHeight"
      @change="updateUpscaleInput"
      type="number"
      :class="inputClasses + ' upscaleHeightInput'"
      placeholder="Upscale Height"
    />
  </div>

  <SamplerInput
    :inputClasses="inputClasses"
    :samplerInput="defaultSamplerData"
    @updateSampler="updateImageSampler"
  />
</template>

<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue';

import type { UpscaleImageGenWorkflow } from '@img_gen/models/workflows/upscale_workflow';

import SamplerInput from '@/views/components/prompt_form/sampler_input.vue';
import type { SamplerData } from '@img_gen/models/inputs/sampler';
import { getDefaultUpscaleSamplerData } from './types';

const defaultSamplerData = getDefaultUpscaleSamplerData();

withDefaults(
  defineProps<{
    inputClasses?: string;
  }>(),
  {
    inputClasses: '',
  },
);

const emit = defineEmits<{
  (e: 'updateUpscaleInput', payload: UpscaleImageGenWorkflow | undefined): void;
}>();

const upscaleWidth = ref(1024);
const upscaleHeight = ref(1024);

const samplerData: Ref<SamplerData | undefined> = ref(undefined);

onBeforeMount(() => {
  beforeMountHandler();
});

function beforeMountHandler() {
  samplerData.value = defaultSamplerData;
}

function updateImageSampler(sampler: SamplerData) {
  samplerData.value = sampler;
}

function updateUpscaleInput() {}
</script>

<style lang="scss" scoped>
.upscaleInputContainer {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-template-areas:
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

.upscaleWidthLabel,
.upscaleHeightLabel {
  margin-right: 1em;
}

.upscaleWidthInput,
.upscaleHeightInput {
  width: 17em;
}
</style>
