<template>
  <div class="paneContainer flex flex-row">
    <div class="leftPane">
      <select v-model="workflowType" class="ml-2 mb-2">
        <option :value="WorkflowType.basicImageGen">Basic Image</option>
        <option :value="WorkflowType.upscaleImageGen">
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
      <span class="historyButtonsContainer">
        <div>
          Prompt History
          <BasicButton @click="refreshHistory">
            <ArrowPathIcon class="h-6 w-6" />
          </BasicButton>
        </div>

        <template v-for="prompt in sortedPromptHistory" :key="prompt.promptId">
          <div class="flex justify-between mb-2">
            {{ prompt.promptNumber }}
            <BasicButton @click="loadPrompt(prompt)">Load</BasicButton>
            <BasicButton @click="deletePrompt(prompt)">Delete</BasicButton>
          </div>
        </template>
      </span>
    </div>
  </div>

  <div class="queueButton bottom-0 sticky py-4">
    <BasicButton @click="queuePrompt" :disabled="!canQueue"
      >Queue Prompt</BasicButton
    >
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { ArrowPathIcon } from '@heroicons/vue/24/solid';

import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { useAppStore } from '@/stores/app_store';
import type { PromptAndImageData } from '@/models/history';

import BasicButton from '@/views/components/basic_button.vue';
import PromptInputs from '@/views/components/prompt_inputs.vue';
import {
  isBasicImageGenWorkflow,
  type BasicImageGenWorkflow,
} from '@img_gen/models/workflows/basic_image_gen_workflow';
import {
  isUpscaleImageGenWorkflow,
  type UpscaleImageGenWorkflow,
} from '@img_gen/models/workflows/upscale_workflow';
import { isNullOrUndefined, isUndefined } from '@img_gen/utils/type_guards';
import { isPromptModels } from '@img_gen/models/inputs/prompt_models';
import { isLatentImagePrompt } from '@img_gen/models/inputs/latent_image_input';
import { isPromptSampler } from '@img_gen/models/inputs/prompt_sampler';
import {
  getWorkflowFromName,
  WorkflowType,
} from '@img_gen/models/workflows/workflows';

const appStore = useAppStore();
const imgGalleryStore = useImgGalleryStore();
const { promptData, models } = storeToRefs(imgGalleryStore);

const workflow: Ref<
  BasicImageGenWorkflow | UpscaleImageGenWorkflow | undefined
> = ref(undefined);

const workflowType = ref(WorkflowType.upscaleImageGen);

const canQueue = computed(() => {
  return !isUndefined(workflow.value);
});

const sortedPromptHistory = computed(() => {
  return [...promptData.value].sort((a, b) => {
    return a.promptNumber - b.promptNumber;
  });
});

onBeforeMount(() => {
  beforeMountHandler();
});

async function beforeMountHandler() {
  const rawData = localStorage.getItem('currentWorkflow');
  await fetchNeededData();

  try {
    if (!isNullOrUndefined(rawData)) {
      const savedData = JSON.parse(rawData);
      if (
        (isBasicImageGenWorkflow(savedData.workflow) ||
          isUpscaleImageGenWorkflow(savedData.workflow)) &&
        savedData.workflowType
      ) {
        workflow.value = savedData.workflow;
        workflowType.value = savedData.workflowType;
      }
    }
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({ message: 'Error loading saved workflow' });
  }
}

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

  const type = getWorkflowFromName(prompt.workflowType);
  switch (type) {
    case WorkflowType.basicImageGen:
      if (isBasicImageGenWorkflow(prompt.workflow)) {
        workflowType.value = WorkflowType.basicImageGen;
        updateWorkflow(prompt.workflow);
      }
    case WorkflowType.upscaleImageGen:
      if (isUpscaleImageGenWorkflow(prompt.workflow)) {
        workflowType.value = WorkflowType.upscaleImageGen;
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
  workflow.value = input;

  if (!isUndefined(input)) {
    localStorage.setItem(
      'currentWorkflow',
      JSON.stringify({
        workflow: input,
        workflowType: workflowType.value,
      }),
    );
  } else {
    // localStorage.removeItem('currentWorkflow');
  }
}

async function queuePrompt() {
  if (isUndefined(workflow.value)) {
    return;
  }

  try {
    await imgGalleryStore.queuePrompt(workflowType.value, workflow.value);
    appStore.setSuccessMessage({ message: 'Prompt queued' });
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({ message: 'Error queuing prompt' });
  }
}

async function refreshHistory() {
  try {
    await imgGalleryStore.fetchHistory();
    appStore.setSuccessMessage({ message: 'History refreshed' });
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({ message: 'Error refreshing history' });
  }
}

async function deletePrompt(prompt: PromptAndImageData) {}
</script>

<style scoped>
.queueButton {
  background-color: inherit;
  width: 100%;
  border: 1px solid black;
}

.leftPane {
  font-size: 0.75rem;
  max-width: 75%;
  min-width: 75%;
}

.historyButtonsContainer {
  position: sticky;
  top: 0;
}
</style>

<style>
.errorCard {
  border: 1px solid #dc2626 !important;
}
</style>
