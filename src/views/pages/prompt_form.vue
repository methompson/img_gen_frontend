<template>
  <div class="paneContainer flex flex-row">
    <div>
      <select v-model="workflowType" class="ml-2 mb-2">
        <option :value="Workflow.basicImageGen">Basic Image</option>
        <option :value="Workflow.upscaleImageGen">
          Basic Image with Upscale
        </option>
      </select>

      <PromptInputs
        :models="models"
        :workflow="workflow"
        :workflowType="workflowType"
        @updateWorkflow="updateWorkflow"
      />
    </div>

    <div class="rightPane mx-2">
      <div>Prompt History</div>

      <template v-for="prompt in promptData" :key="prompt.promptId">
        <div class="flex justify-between mb-2">
          {{ prompt.promptNumber }}
          <BasicButton @click="loadPrompt(prompt)">Load</BasicButton>
        </div>
      </template>
    </div>
  </div>

  <div class="queueButton bottom-0 sticky py-4">
    <BasicButton :disabled="!canQueue">Queue Prompt</BasicButton>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useImgGalleryStore } from '@/stores/img_gallery_store';
import type { PromptAndImageData } from '@/models/history';

import BasicButton from '@/views/components/basic_button.vue';
import PromptInputs from '@/views/components/prompt_form/prompt_inputs.vue';
import {
  isBasicImageGenWorkflow,
  type BasicImageGenWorkflow,
} from '@img_gen/models/workflows/basic_image_gen_workflow';
import {
  isUpscaleImageGenWorkflow,
  type UpscaleImageGenWorkflow,
} from '@img_gen/models/workflows/upscale_workflow';
import { isUndefined } from '@img_gen/utils/type_guards';
import { isPromptModels } from '@img_gen/models/inputs/prompt_models';
import { isLatentImagePrompt } from '@img_gen/models/inputs/latent_image_input';
import { isPromptSampler } from '@img_gen/models/inputs/prompt_sampler';
import {
  getWorkflowFromName,
  Workflow,
} from '@img_gen/models/workflows/workflows';

const imgGalleryStore = useImgGalleryStore();

const { promptData, models } = storeToRefs(imgGalleryStore);

const workflow: Ref<
  BasicImageGenWorkflow | UpscaleImageGenWorkflow | undefined
> = ref(undefined);

const workflowType = ref(Workflow.upscaleImageGen);

const canQueue = computed(() => {
  return !isUndefined(workflow.value);
});

onBeforeMount(() => {
  fetchNeededData();
});

function loadPrompt(prompt: PromptAndImageData) {
  console.log({
    prompt: prompt,
    imageInput: prompt.workflow.imageInput,
    isBasicImageGenWorkflow: isBasicImageGenWorkflow(prompt.workflow),
    isUpscaleImageGenWorkflow: isUpscaleImageGenWorkflow(prompt.workflow),
    isPromptModels: isPromptModels(prompt.workflow.modelInput),
    islatentImage: isLatentImagePrompt(prompt.workflow.imageInput),
    isPromptSampler: isPromptSampler(prompt.workflow.promptInput),
  });

  const workflowType = getWorkflowFromName(prompt.workflowType);
  switch (workflowType) {
    case Workflow.basicImageGen:
      if (isBasicImageGenWorkflow(prompt.workflow)) {
        updateWorkflow(prompt.workflow);
      }
    case Workflow.upscaleImageGen:
      if (isUpscaleImageGenWorkflow(prompt.workflow)) {
        updateWorkflow(prompt.workflow);
      }
    default:
    // do nothing
  }
}

async function fetchNeededData() {
  try {
    await Promise.all([
      imgGalleryStore.fetchHistory(),
      imgGalleryStore.fetchModels(),
    ]);
  } catch (e) {}
}

function updateWorkflow(
  input: BasicImageGenWorkflow | UpscaleImageGenWorkflow | undefined,
) {
  console.log('updating workflow');
  workflow.value = input;
}
</script>

<style scoped>
.queueButton {
  background-color: inherit;
  width: 100%;
  border: 1px solid black;
}

.leftPane {
  font-size: 0.75rem;
}
</style>
