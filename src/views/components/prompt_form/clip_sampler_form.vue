<template>
  <div class="clipContainer">
    <div>Positive Clip</div>
    <textarea
      v-model="positivePrompt"
      @input="updateClipSampler"
      :rows="textAreaSize.rows"
      :cols="textAreaSize.cols"
      :class="inputClasses"
    />

    <div>Negative Clip</div>
    <textarea
      v-model="negativePrompt"
      @input="updateClipSampler"
      :rows="textAreaSize.rows"
      :cols="textAreaSize.cols"
      :class="inputClasses"
    />
  </div>

  <SamplerInput
    :inputClasses="inputClasses"
    :samplerInput="samplerData"
    @updateSampler="updateImageSampler"
  />
</template>

<script setup lang="ts">
import { onBeforeMount, type Ref, ref, toRefs, watch } from 'vue';

import type { SamplerData } from '@img_gen/models/inputs/sampler';
import type { PromptSampler } from '@img_gen/models/inputs/prompt_sampler';
import { isUndefined } from '@img_gen/utils/type_guards';
import { getDefaultImageSamplerData } from './types';

import SamplerInput from '@/views/components/prompt_form/sampler_input.vue';

const defaultSamplerData = getDefaultImageSamplerData();

const props = withDefaults(
  defineProps<{
    promptSamplerInput?: PromptSampler;
    inputClasses?: string;
  }>(),
  {
    inputClasses: '',
  },
);

const { promptSamplerInput } = toRefs(props);

watch(promptSamplerInput, (newVal) => {
  if (isUndefined(newVal)) {
    return;
  }

  console.log('promptSamplerInput changed', {
    newVal,
    samplerComparison:
      JSON.stringify(newVal.samplerInput) !== JSON.stringify(samplerData.value),
  });

  if (
    JSON.stringify(newVal.samplerInput) !== JSON.stringify(samplerData.value)
  ) {
    samplerData.value = newVal.samplerInput;
  }

  if (positivePrompt.value !== newVal.positivePrompt) {
    positivePrompt.value = newVal.positivePrompt;
  }

  if (negativePrompt.value !== newVal.negativePrompt) {
    negativePrompt.value = newVal.negativePrompt;
  }
});

const emit = defineEmits<{
  (e: 'updateClipSampler', payload: PromptSampler | undefined): void;
}>();

const textAreaSize = {
  cols: 40,
  rows: 6,
};

const positivePrompt = ref('');
const negativePrompt = ref('');
const samplerData: Ref<SamplerData | undefined> = ref(undefined);

onBeforeMount(() => {
  beforeMountHandler();
});

function beforeMountHandler() {
  samplerData.value = defaultSamplerData;
  console.log('samplerData', samplerData.value);
  updateClipSampler();
}

function updateImageSampler(sampler: SamplerData) {
  samplerData.value = sampler;
  updateClipSampler();
}

function updateClipSampler() {
  if (isUndefined(samplerData.value)) {
    emit('updateClipSampler', undefined);
    return;
  }

  emit('updateClipSampler', {
    samplerInput: samplerData.value,
    positivePrompt: positivePrompt.value,
    negativePrompt: negativePrompt.value,
  });
}
</script>

<style lang="scss" scoped>
.clipContainer {
  margin-bottom: 1em;
}
</style>
