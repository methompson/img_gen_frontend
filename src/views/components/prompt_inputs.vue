<template>
  <div class="mx-2">
    <BasicImageGenForm
      v-if="isBasicImageGenWorkflowForm"
      :workflow="basicImageGenWorkflow"
      :models="models"
      @updateWorkflow="updateWorkflow"
    />
    <UpscalePromptForm
      v-else-if="isUpscaleImageGenWorkflowForm"
      :workflow="upscaleImageGenWorkflow"
      :models="models"
      @updateWorkflow="updateWorkflow"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, toRefs } from 'vue';

import type { GetModelsOutput } from '@/api/models';

import {
  isBasicImageGenWorkflow,
  type BasicImageGenWorkflow,
} from '@img_gen/models/workflows/basic_image_gen_workflow';
import {
  isUpscaleImageGenWorkflow,
  type UpscaleImageGenWorkflow,
} from '@img_gen/models/workflows/upscale_workflow';
import {
  WorkflowType,
  type Workflow,
} from '@img_gen/models/workflows/workflows';

import BasicImageGenForm from '@/views/components/workflow_forms/basic_image_gen_form.vue';
import UpscalePromptForm from '@/views/components/workflow_forms/upscale_prompt_form.vue';

const emit = defineEmits<{
  (
    e: 'updateWorkflow',
    payload: UpscaleImageGenWorkflow | BasicImageGenWorkflow | undefined,
  ): void;
}>();

const props = defineProps<{
  models: GetModelsOutput;
  workflowType: WorkflowType;
  workflow?: BasicImageGenWorkflow | UpscaleImageGenWorkflow;
}>();

const { workflow, workflowType } = toRefs(props);

const isBasicImageGenWorkflowForm = computed(() => {
  return workflowType.value === WorkflowType.basicImageGen;
});

const isUpscaleImageGenWorkflowForm = computed(() => {
  return workflowType.value === WorkflowType.upscaleImageGen;
});

const basicImageGenWorkflow = computed(() => {
  return workflowType.value === WorkflowType.basicImageGen &&
    isBasicImageGenWorkflow(workflow.value)
    ? workflow.value
    : undefined;
});

const upscaleImageGenWorkflow = computed(() => {
  return workflowType.value === WorkflowType.upscaleImageGen &&
    isUpscaleImageGenWorkflow(workflow.value)
    ? workflow.value
    : undefined;
});

onBeforeMount(() => {
  beforeMountHandler();
});

function beforeMountHandler() {
  // updateWorkflow();
}

function updateWorkflow(updatedWorkflow: Workflow | undefined) {
  emit('updateWorkflow', updatedWorkflow);
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
