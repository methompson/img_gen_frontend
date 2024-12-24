<template>
  <span class="flex flex-row justify-between w-100">
    <h1 class="text-lg font-bold">Clip and Sampler</h1>

    <BasicButton @click="toggleShowClipSamplerCard">
      <template v-if="showClipSamplerCard">
        <XMarkIcon class="h-4 w-4" />
      </template>

      <template v-else>
        <PlusIcon class="h-4 w-4" />
      </template>
    </BasicButton>
  </span>

  <span v-if="showClipSamplerCard">
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
  </span>
</template>

<script setup lang="ts">
import { onBeforeMount, type Ref, ref, toRefs, watch } from 'vue';
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid';

import type { SamplerData } from '@img_gen/models/inputs/sampler';
import type { PromptSampler } from '@img_gen/models/inputs/prompt_sampler';
import { isUndefined } from '@img_gen/utils/type_guards';
import { getDefaultImageSamplerData } from './types';

import SamplerInput from '@/views/components/prompt_form/sampler_input.vue';
import BasicButton from '@/views/components/basic_button.vue';

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

const showClipSamplerCard = ref(true);

const positivePrompt = ref('');
const negativePrompt = ref('');
const samplerData: Ref<SamplerData | undefined> = ref(undefined);

onBeforeMount(() => {
  beforeMountHandler();
});

function toggleShowClipSamplerCard() {
  showClipSamplerCard.value = !showClipSamplerCard.value;
}

function beforeMountHandler() {
  samplerData.value = defaultSamplerData;
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
