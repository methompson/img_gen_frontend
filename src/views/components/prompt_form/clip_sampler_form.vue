<template>
  <VExpansionPanels v-model="expansionPanelOpen">
    <VExpansionPanel :class="expansionClasses">
      <VExpansionPanelTitle class="formExpansionTitle">
        Clip & Sampler {{ additionalInfo }}</VExpansionPanelTitle
      >

      <VExpansionPanelText>
        <VCard>
          <VCardText>
            <div class="clipContainer">
              <VTextarea
                v-model="positivePrompt"
                variant="solo-filled"
                density="comfortable"
                label="Positive Clip"
                @update:modelValue="updateClipSampler"
                hide-details
                class="pb-2"
              />

              <VTextarea
                v-model="negativePrompt"
                variant="solo-filled"
                density="comfortable"
                label="Negative Clip"
                @update:modelValue="updateClipSampler"
                hide-details
                class="pb-2"
              />
            </div>

            <SamplerForm
              :samplerInput="samplerData"
              @updateSampler="updateImageSampler"
            />
          </VCardText>
        </VCard>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, type Ref, ref, toRefs, watch } from 'vue';

import type { SamplerData } from '@img_gen/models/inputs/sampler';
import type { PromptSampler } from '@img_gen/models/inputs/prompt_sampler';
import { isUndefined } from '@img_gen/utils/type_guards';
import { getDefaultImageSamplerData } from './types';

import SamplerForm from '@/views/components/prompt_form/sampler_form.vue';

const defaultSamplerData = getDefaultImageSamplerData();

const props = defineProps<{
  promptSamplerInput?: PromptSampler;
}>();

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

const expansionPanelOpen = ref(0);

const positivePrompt = ref('');
const negativePrompt = ref('');
const samplerData: Ref<SamplerData | undefined> = ref(undefined);

const additionalInfo = computed(() => {
  if (!samplerData.value) {
    return '';
  }

  return ` - ${samplerData.value.steps} steps, ${samplerData.value.cfg} cfg, ${samplerData.value.samplerName} / ${samplerData.value.scheduler}`;
});

const expansionClasses = computed(() => {
  const classes = ['expansionClassTitle'];
  if (!promptSamplerInput.value) {
    classes.push('errorCard');
  }

  return classes.join(' ');
});

onBeforeMount(() => {
  beforeMountHandler();
});

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
