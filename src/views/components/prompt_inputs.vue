<template>
  <div class="leftPane mx-2">
    <!-- PromptModels Input -->
    <div class="promptModelsInput">
      <CheckpointLora
        :models="models"
        :inputClasses="inputClasses"
        :modelInput="modelInput"
        @updateModelInput="updateModelInput"
      />
    </div>

    <!-- Image Input -->
    <div class="latentImageInput">
      <h1 class="text-lg font-bold">Image & Batch Size</h1>

      <ImageInput
        :inputClasses="inputClasses"
        :latentInput="latentInput"
        @updateImageInput="updateImageInput"
      />
    </div>

    <!-- PromptSamplerInput -->

    <div class="clipSamplerInput">
      <h1 class="text-lg font-bold">Clip and Sampler</h1>

      <ClipSamplerForm
        :inputClasses="inputClasses"
        :promptSamplerInput="promptSamplerInput"
        @updateClipSampler="updateClipSampler"
      />
    </div>

    <div class="upscaleInput">
      <h1 class="text-lg font-bold">Upscale</h1>

      <UpscaleInput :inputClasses="inputClasses" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, toRefs, watch, type Ref } from 'vue';

import type { GetModelsOutput } from '@/api/models';

import ImageInput from '@/views/components/prompt_form/image_input.vue';
import CheckpointLora from '@/views/components/prompt_form/checkpoint_lora.vue';
import ClipSamplerForm from '@/views/components/prompt_form/clip_sampler_form.vue';
import UpscaleInput from '@/views/components/prompt_form/upscale_input.vue';

import type { LatentImagePrompt } from '@img_gen/models/inputs/latent_image_input';
import type { PromptModels } from '@img_gen/models/inputs/prompt_models';
import type { PromptSampler } from '@img_gen/models/inputs/prompt_sampler';
import type { BasicImageGenWorkflow } from '@img_gen/models/workflows/basic_image_gen_workflow';
import { isUndefined } from '@img_gen/utils/type_guards';
import type { UpscaleImageGenWorkflow } from '@img_gen/models/workflows/upscale_workflow';
import type { Workflow } from '@img_gen/models/workflows/workflows';

const props = defineProps<{
  models: GetModelsOutput;
  workflowType: Workflow;
  workflow?: BasicImageGenWorkflow | UpscaleImageGenWorkflow;
}>();

const { workflow } = toRefs(props);
watch(workflow, (newValue) => {
  console.log('workflow changed');

  if (isUndefined(newValue)) {
    console.log('workflow is undefined');
    modelInput.value = undefined;
    latentInput.value = undefined;
    promptSamplerInput.value = undefined;
    return;
  }

  if (
    newValue.modelInput &&
    JSON.stringify(newValue.modelInput) !== JSON.stringify(modelInput.value)
  ) {
    console.log('modelInput changed');
    modelInput.value = newValue.modelInput;
  }

  if (
    newValue.imageInput &&
    JSON.stringify(newValue.imageInput) !== JSON.stringify(latentInput.value)
  ) {
    console.log('imageInput changed');
    latentInput.value = newValue.imageInput;
  }

  if (
    newValue.promptInput &&
    JSON.stringify(newValue.promptInput) !==
      JSON.stringify(promptSamplerInput.value)
  ) {
    console.log('promptInput changed');
    promptSamplerInput.value = newValue.promptInput;
  }
});

const emit = defineEmits<{
  (e: 'updateWorkflow', payload: BasicImageGenWorkflow | undefined): void;
}>();

const modelInput: Ref<PromptModels | undefined> = ref(undefined);
const latentInput: Ref<LatentImagePrompt | undefined> = ref(undefined);
const promptSamplerInput: Ref<PromptSampler | undefined> = ref(undefined);

const inputClasses = computed(() => {
  const classes = [
    'border-solid',
    'border-2',
    'border-indigo-600',
    'block',
    'mb-1',
    'text-slate-700',
  ];

  return classes.join(' ');
});

onBeforeMount(() => {
  beforeMountHandler();
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

function updateWorkflow() {
  if (
    isUndefined(modelInput.value) ||
    isUndefined(latentInput.value) ||
    isUndefined(promptSamplerInput.value)
  ) {
    emit('updateWorkflow', undefined);
    return;
  }

  emit('updateWorkflow', {
    modelInput: modelInput.value,
    imageInput: latentInput.value,
    promptInput: promptSamplerInput.value,
  });
}
</script>

<style lang="scss" scoped>
.promptModelsInput,
.latentImageInput,
.clipSamplerInput,
.upscaleInput {
  border: 1px solid #d1d5db;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
