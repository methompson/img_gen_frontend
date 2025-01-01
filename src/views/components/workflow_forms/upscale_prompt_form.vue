<template>
  <div class="mx-2">
    <!-- Checkpoint & Lora Form -->
    <div class="formCard">
      <CheckpointLoraForm
        :models="models"
        :modelInput="modelInput"
        @updateModelInput="updateModelInput"
      />
    </div>

    <!-- Latent Image Form -->
    <div class="formCard">
      <LatentImageForm
        :latentInput="latentInput"
        @updateImageInput="updateImageInput"
      />
    </div>

    <!-- Clip & Sampler Form -->
    <div class="formCard">
      <ClipSamplerForm
        :promptSamplerInput="promptSamplerInput"
        @updateClipSampler="updateClipSampler"
      />
    </div>

    <div class="formCard">
      <UpscaleForm
        @updateUpscaleInput="updateUpscaleInput"
        :inputDimensions="latentImageDimensions"
        :upscaleInput="upscaleInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRefs, watch, type Ref } from 'vue';

import type { GetModelsOutput } from '@/api/models';

import LatentImageForm from '@/views/components/prompt_form/latent_image_form.vue';
import CheckpointLoraForm from '@/views/components/prompt_form/checkpoint_lora_form.vue';
import ClipSamplerForm from '@/views/components/prompt_form/clip_sampler_form.vue';
import UpscaleForm from '@/views/components/prompt_form/upscale_form.vue';

import type { InputDimensions } from '@/views/components/prompt_form/types';

import type { LatentImagePrompt } from '@img_gen/models/inputs/latent_image_input';
import type { PromptModels } from '@img_gen/models/inputs/prompt_models';
import type { PromptSampler } from '@img_gen/models/inputs/prompt_sampler';
import { isUndefined } from '@img_gen/utils/type_guards';
import type { UpscaleImageGenWorkflow } from '@img_gen/models/workflows/upscale_workflow';
import type { UpscalePrompt } from '@img_gen/models/inputs/upscale';

const props = defineProps<{
  models: GetModelsOutput;
  workflow?: UpscaleImageGenWorkflow;
}>();

const { workflow } = toRefs(props);
watch(workflow, (newValue) => {
  if (isUndefined(newValue)) {
    return;
  }

  if (
    newValue.modelInput &&
    JSON.stringify(newValue.modelInput) !== JSON.stringify(modelInput.value)
  ) {
    modelInput.value = newValue.modelInput;
  }

  if (
    newValue.imageInput &&
    JSON.stringify(newValue.imageInput) !== JSON.stringify(latentInput.value)
  ) {
    latentInput.value = newValue.imageInput;
  }

  if (
    newValue.promptInput &&
    JSON.stringify(newValue.promptInput) !==
      JSON.stringify(promptSamplerInput.value)
  ) {
    promptSamplerInput.value = newValue.promptInput;
  }

  if (
    newValue.upscaleInput &&
    JSON.stringify(newValue.upscaleInput) !== JSON.stringify(upscaleInput.value)
  ) {
    upscaleInput.value = newValue.upscaleInput;
  }
});

const emit = defineEmits<{
  (e: 'updateWorkflow', payload: UpscaleImageGenWorkflow | undefined): void;
}>();

const modelInput: Ref<PromptModels | undefined> = ref(undefined);
const latentInput: Ref<LatentImagePrompt | undefined> = ref(undefined);
const promptSamplerInput: Ref<PromptSampler | undefined> = ref(undefined);
const upscaleInput: Ref<UpscalePrompt | undefined> = ref(undefined);

onBeforeMount(() => {
  beforeMountHandler();
});

const latentImageDimensions: Ref<InputDimensions | undefined> = computed(() => {
  const width = latentInput.value?.latentWidth;
  const height = latentInput.value?.latentHeight;

  if (!width || !height) {
    return undefined;
  }

  return {
    width,
    height,
  };
});

function beforeMountHandler() {
  updateWorkflow();
}

function updateImageInput(input: LatentImagePrompt | undefined) {
  latentInput.value = input;

  updateWorkflow();
}

function updateModelInput(input: PromptModels | undefined) {
  modelInput.value = input;

  updateWorkflow();
}

function updateClipSampler(input: PromptSampler | undefined) {
  promptSamplerInput.value = input;

  updateWorkflow();
}

function updateUpscaleInput(input: UpscalePrompt | undefined) {
  upscaleInput.value = input;

  updateWorkflow();
}

function updateWorkflow() {
  if (
    isUndefined(modelInput.value) ||
    isUndefined(latentInput.value) ||
    isUndefined(promptSamplerInput.value) ||
    isUndefined(upscaleInput.value)
  ) {
    emit('updateWorkflow', undefined);
    return;
  }

  emit('updateWorkflow', {
    modelInput: modelInput.value,
    imageInput: latentInput.value,
    promptInput: promptSamplerInput.value,
    upscaleInput: upscaleInput.value,
  });
}
</script>
