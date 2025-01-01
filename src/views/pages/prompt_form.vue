<template>
  <div class="paneContainer d-flex flex-row flex-grow-1">
    <v-container class="ma-0 pa-0">
      <VRow>
        <VCol>
          <VSelect
            v-model="workflowType"
            :items="workflowTypes"
            density="compact"
            variant="solo"
            class="ma-2"
            hide-details
          />
        </VCol>

        <VCol>
          <v-menu
            v-model="historyMenuOpen"
            :close-on-content-click="false"
            location="top"
          >
            <template v-slot:activator="{ props }">
              <v-btn color="primary" icon="mdi-history" v-bind="props" />
            </template>

            <v-card>
              <v-card-text>
                <VRow class="pb-1 d-flex justify-space-between align-center">
                  <VCol> Prompt History </VCol>
                  <VCol>
                    <v-btn
                      color="primary"
                      icon="mdi-refresh"
                      @click="refreshHistory"
                    />
                  </VCol>
                </VRow>

                <VRow
                  v-for="prompt in sortedPromptHistory"
                  :key="prompt.promptId"
                  class="pb-1 d-flex align-center"
                >
                  <VCol>
                    {{ prompt.promptNumber }}
                  </VCol>
                  <VCol>
                    <v-btn @click="loadPrompt(prompt)"> Load </v-btn>
                  </VCol>
                  <VCol>
                    <v-btn
                      @click="deletePrompt(prompt)"
                      icon="mdi-trash-can-outline"
                      color="error"
                    />
                  </VCol>
                </VRow>
              </v-card-text>
            </v-card>
          </v-menu>
        </VCol>
      </VRow>

      <VRow>
        <VCol>
          <PromptInputs
            :models="models"
            :workflow="workflow"
            :workflowType="workflowType"
            @updateWorkflow="updateWorkflow"
          />
        </VCol>
      </VRow>
    </v-container>
  </div>

  <div class="queueButton bottom-0 position-sticky text-center py-4">
    <v-btn color="primary" @click="queuePrompt" :disabled="!canQueue">
      Queue Prompt
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, type Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { useAppStore } from '@/stores/app_store';
import type { PromptAndImageData } from '@/models/history';

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
const workflowTypes = [
  { title: 'Basic Image', value: WorkflowType.basicImageGen },
  { title: 'Basic Image with Upscale', value: WorkflowType.upscaleImageGen },
];

const historyMenuOpen = ref(false);

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
    const queueResponse = await imgGalleryStore.queuePrompt(
      workflowType.value,
      workflow.value,
    );
    imgGalleryStore.updatePromptId(queueResponse.prompt_id);
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

async function deletePrompt(prompt: PromptAndImageData) {
  try {
    await imgGalleryStore.deleteHistoryItems([prompt.promptId]);
    appStore.setSuccessMessage({ message: 'Prompt deleted' });
  } catch (e) {
    console.error(e);
    appStore.setErrorMessage({ message: 'Error deleting prompt' });
  }
}
</script>

<style scoped>
.queueButton {
  background-color: rgb(var(--v-theme-background));
  width: 100%;
  border: 1px solid black;
  z-index: 10;
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

.formCard {
  margin-bottom: 1rem;
}

.formExpansionTitle {
  background-color: #eee;
}
</style>
