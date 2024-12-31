<template>
  <div class="mx-2">
    <!-- Checkpoint & Lora Form -->
    <div class="formCard">
      <CheckpointLoraForm
        :models="models"
        :inputClasses="inputClasses"
        :modelInput="modelInput"
        @updateModelInput="updateModelInput"
      />
    </div>

    <!-- Latent Image Form -->
    <div class="formCard">
      <LatentImageForm
        :inputClasses="inputClasses"
        :latentInput="latentInput"
        @updateImageInput="updateImageInput"
      />
    </div>

    <!-- Clip & Sampler Form -->
    <div class="formCard">
      <ClipSamplerForm
        :inputClasses="inputClasses"
        :promptSamplerInput="promptSamplerInput"
        @updateClipSampler="updateClipSampler"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, toRefs, watch, type Ref } from 'vue';

import type { GetModelsOutput } from '@/api/models';

import LatentImageForm from '@/views/components/prompt_form/latent_image_form.vue';
import CheckpointLoraForm from '@/views/components/prompt_form/checkpoint_lora_form.vue';
import ClipSamplerForm from '@/views/components/prompt_form/clip_sampler_form.vue';

import type { LatentImagePrompt } from '@img_gen/models/inputs/latent_image_input';
import type { PromptModels } from '@img_gen/models/inputs/prompt_models';
import type { PromptSampler } from '@img_gen/models/inputs/prompt_sampler';
import type { BasicImageGenWorkflow } from '@img_gen/models/workflows/basic_image_gen_workflow';
import { isUndefined } from '@img_gen/utils/type_guards';

const props = defineProps<{
  models: GetModelsOutput;
  inputClasses: string;
  workflow?: BasicImageGenWorkflow;
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
});

const emit = defineEmits<{
  (e: 'updateWorkflow', payload: BasicImageGenWorkflow | undefined): void;
}>();

const modelInput: Ref<PromptModels | undefined> = ref(undefined);
const latentInput: Ref<LatentImagePrompt | undefined> = ref(undefined);
const promptSamplerInput: Ref<PromptSampler | undefined> = ref(undefined);

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
