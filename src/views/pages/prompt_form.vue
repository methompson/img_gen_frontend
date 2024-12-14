<script setup lang="ts">
import { computed, onBeforeMount, ref, watch, type Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { v4 as uuidv4 } from 'uuid';

import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { randomSeed } from '@/utils/max_seed';
import type { PromptAndImageDataStruct } from '@/models/history_data';

import BasicButton from '@/views/components/basic_button.vue';

interface PromptLoraInput {
  id: string;
  name: string;
  weight: number;
}

const imgGalleryStore = useImgGalleryStore();

const { promptData, models } = storeToRefs(imgGalleryStore);

const checkpoint = ref('');
const loras: Ref<PromptLoraInput[]> = ref([]);

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
const samplerDenoiseNum = computed(() => Number.parseFloat(samplerDenoise.value));

const canQueue = computed(() => {
  return (
    checkpoint.value.length > 0 &&
    !Number.isNaN(samplerSeedNum.value) &&
    !Number.isNaN(samplerStepsNum.value) &&
    !Number.isNaN(samplerCfgNum.value) &&
    !Number.isNaN(samplerDenoiseNum.value)
  );
});

const inputClasses = computed(() => {
  const classes = [
    'border-solid',
    'border-2',
    'border-indigo-600',
    'block',
    'mb-4',
    'text-slate-700',
  ];

  return classes.join(' ');
});

const loraNames = computed(() => {
  const loras = [...models.value.loras];
  loras.sort((a, b) => a.localeCompare(b));
  return loras;
});

onBeforeMount(() => {
  samplerSeed.value = `${randomSeed()}`;
  fetchNeededData();
});

function addLora() {
  loras.value.push({ id: uuidv4(), name: '', weight: 1 });
}

function loadPrompt(prompt: PromptAndImageDataStruct) {
  positivePrompt.value = prompt.positiveClip;
  negativePrompt.value = prompt.negativeClip;
  samplerSeed.value = `${prompt.samplerData.seed}`;
  samplerSteps.value = `${prompt.samplerData.steps}`;
  samplerCfg.value = `${prompt.samplerData.cfg}`;
  samplerName.value = prompt.samplerData.samplerName;
  samplerScheduler.value = prompt.samplerData.scheduler;
  samplerDenoise.value = `${prompt.samplerData.denoise}`;
}

async function fetchNeededData() {
  try {
    await Promise.all([imgGalleryStore.fetchHistory(), imgGalleryStore.fetchModels()]);
  } catch (e) {}
}
</script>

<template>
  <div class="paneContainer flex flex-row">
    <div class="leftPane mx-2">
      <div>Checkpoint</div>
      <select v-model="checkpoint" :class="inputClasses">
        <option v-for="model in models.models" :key="model">{{ model }}</option>
      </select>

      <div>LORAs</div>
      <template v-for="lora in loras" :key="lora.id">
        <div class="flex flex-col border-2 p-2">
          <select :class="inputClasses">
            <option v-for="loraName in loraNames" :key="`${lora.id}_${loraName}`">
              {{ loraName }}
            </option>
          </select>

          <input type="text" placeholder="weight" :class="inputClasses" />
        </div>
      </template>
      <BasicButton @click="addLora">
        <PlusIcon class="h-6 w-6" />
      </BasicButton>

      <div>Positive Clip</div>
      <textarea v-model="positivePrompt" rows="8" cols="40" :class="inputClasses" />

      <div>Negative Clip</div>
      <textarea v-model="negativePrompt" rows="8" cols="40" :class="inputClasses" />

      <div>Sampler Info</div>
      <div>Seed</div>
      <input v-model="samplerSeed" type="text" placeholder="seed" :class="inputClasses" />

      <div>Steps</div>
      <input v-model="samplerSteps" type="text" placeholder="steps" :class="inputClasses" />

      <div>CFG</div>
      <input v-model="samplerCfg" type="text" placeholder="cfg" :class="inputClasses" />

      <div>Sampler</div>
      <select v-model="samplerName" :class="inputClasses">
        <option value="euler">euler</option>
        <option value="euler_cfg_pp">euler_cfg_pp</option>
        <option value="euler_ancestral">euler_ancestral</option>
        <option value="euler_ancestral_cfg_pp">euler_ancestral_cfg_pp</option>
        <option value="heun">heun</option>
        <option value="heunpp2">heunpp2</option>
        <option value="dpm_2">dpm_2</option>
        <option value="dpm_2_ancestral">dpm_2_ancestral</option>
        <option value="dpm_fast">dpm_fast</option>
        <option value="dpm_adaptive">dpm_adaptive</option>
        <option value="dpmpp_2s_ancestral">dpmpp_2s_ancestral</option>
        <option value="dpmpp_2s_ancestral_cfg_pp">dpmpp_2s_ancestral_cfg_pp</option>
        <option value="dpmpp_sde">dpmpp_sde</option>
        <option value="dpmpp_sde_gpu">dpmpp_sde_gpu</option>
        <option value="dpmpp_2m">dpmpp_2m</option>
        <option value="dpmpp_2m_cfg_pp">dpmpp_2m_cfg_pp</option>
        <option value="dpmpp_2m_sde">dpmpp_2m_sde</option>
        <option value="dpmpp_2m_sde_gpu">dpmpp_2m_sde_gpu</option>
        <option value="dpmpp_3m_sde">dpmpp_3m_sde</option>
        <option value="dpmpp_3m_sde_gpu">dpmpp_3m_sde_gpu</option>
        <option value="ddpm">ddpm</option>
        <option value="lcm">lcm</option>
        <option value="ipndm">ipndm</option>
        <option value="ipndm_v">ipndm_v</option>
        <option value="deis">deis</option>
        <option value="ddim">ddim</option>
        <option value="uni_pc">uni_pc</option>
        <option value="uni_pc_bh2">uni_pc_bh2</option>
      </select>

      <div>Scheduler</div>
      <select v-model="samplerScheduler" :class="inputClasses">
        <option value="normal">normal</option>
        <option value="karras">karras</option>
        <option value="exponential">exponential</option>
        <option value="sgm_uniform">sgm_uniform</option>
        <option value="simple">simple</option>
        <option value="ddim_uniform">ddim_uniform</option>
        <option value="beta">beta</option>
        <option value="linear_quadratic">linear_quadratic</option>
        <option value="AYS SDXL">AYS SDXL</option>
        <option value="AYS SD1">AYS SD1</option>
        <option value="AYS SVD">AYS SVD</option>
        <option value="GITS[coeff=1.2]">GITS[coeff=1.2]</option>
      </select>

      <div>Denoise</div>
      <input v-model="samplerDenoise" type="text" placeholder="denoise" :class="inputClasses" />
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

<style scoped>
.queueButton {
  background-color: inherit;
  width: 100%;
  border: 1px solid black;
}
</style>
