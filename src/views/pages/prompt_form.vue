<script setup lang="ts">
import { computed, onBeforeMount, ref, watch, type Ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { randomSeed } from '@/utils/max_seed';
import type { PromptAndImageData } from '@/models/history';

import BasicButton from '@/views/components/basic_button.vue';
import LeftPane from '@/views/components/prompt_form/left_pane.vue';

const imgGalleryStore = useImgGalleryStore();

const { promptData, models } = storeToRefs(imgGalleryStore);

const checkpoint = ref('');

const positivePrompt = ref('');
const negativePrompt = ref('');

const samplerSeed = ref('');
const samplerSteps = ref('25');
const samplerCfg = ref('5');
const samplerName = ref('euler');
const samplerScheduler = ref('normal');
const samplerDenoise = ref('1');

watch(samplerName, (newVal) => {
  console.log('newVal', newVal);
});

const samplerSeedNum = computed(() => Number.parseInt(samplerSeed.value, 10));
const samplerStepsNum = computed(() => Number.parseInt(samplerSteps.value, 10));
const samplerCfgNum = computed(() => Number.parseFloat(samplerCfg.value));
const samplerDenoiseNum = computed(() =>
  Number.parseFloat(samplerDenoise.value),
);

const canQueue = computed(() => {
  return (
    checkpoint.value.length > 0 &&
    !Number.isNaN(samplerSeedNum.value) &&
    !Number.isNaN(samplerStepsNum.value) &&
    !Number.isNaN(samplerCfgNum.value) &&
    !Number.isNaN(samplerDenoiseNum.value)
  );
});

onBeforeMount(() => {
  samplerSeed.value = `${randomSeed()}`;
  fetchNeededData();
});

function loadPrompt(prompt: PromptAndImageData) {
  positivePrompt.value = prompt.positivePrompt;
  negativePrompt.value = prompt.negativePrompt;

  const samplerData = prompt.workflow.promptInput.samplerInput;
  samplerSeed.value = `${samplerData.seed}`;
  samplerSteps.value = `${samplerData.steps}`;
  samplerCfg.value = `${samplerData.cfg}`;
  samplerName.value = samplerData.samplerName;
  samplerScheduler.value = samplerData.scheduler;
  samplerDenoise.value = `${samplerData.denoise}`;
}

async function fetchNeededData() {
  try {
    await Promise.all([
      imgGalleryStore.fetchHistory(),
      imgGalleryStore.fetchModels(),
    ]);
  } catch (e) {}
}
</script>

<template>
  <div class="paneContainer flex flex-row">
    <LeftPane :models="models" />

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
