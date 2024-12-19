<template>
  <div class="leftPane mx-2">
    <div>Checkpoint</div>
    <select v-model="checkpoint" :class="inputClasses">
      <option v-for="model in models.models" :key="model">{{ model }}</option>
    </select>

    <div>LORAs</div>

    <BasicButton @click="addLora">
      <PlusIcon class="h-6 w-6" />
    </BasicButton>

    <template v-for="lora in loras" :key="lora.id">
      <LoraInput
        :loraNames="loraNames"
        :lora="lora"
        :inputClasses="inputClasses"
        @removeLora="removeLora"
        @updateLora="updateLora"
      />
    </template>

    <div>Positive Clip</div>
    <textarea
      v-model="positivePrompt"
      :rows="textAreaSize.rows"
      :cols="textAreaSize.cols"
      :class="inputClasses"
    />

    <div>Negative Clip</div>
    <textarea
      v-model="negativePrompt"
      :rows="textAreaSize.rows"
      :cols="textAreaSize.cols"
      :class="inputClasses"
    />

    <div>Sampler Info</div>
    <div>Seed</div>
    <input
      v-model="samplerSeed"
      type="text"
      placeholder="seed"
      :class="inputClasses"
    />

    <div>Steps</div>
    <input
      v-model="samplerSteps"
      type="text"
      placeholder="steps"
      :class="inputClasses"
    />

    <div>CFG</div>
    <input
      v-model="samplerCfg"
      type="text"
      placeholder="cfg"
      :class="inputClasses"
    />

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
      <option value="dpmpp_2s_ancestral_cfg_pp">
        dpmpp_2s_ancestral_cfg_pp
      </option>
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
    <input
      v-model="samplerDenoise"
      type="text"
      placeholder="denoise"
      :class="inputClasses"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, type Ref } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { v4 as uuidv4 } from 'uuid';

import type { GetModelsOutput } from '@/api/models';

import BasicButton from '@/views/components/basic_button.vue';
import LoraInput from '@/views/components/prompt_form/lora_input.vue';
import type { PromptLoraInput } from './types';

const props = defineProps<{
  models: GetModelsOutput;
}>();

const { models } = toRefs(props);

const checkpoint = ref('');

const addedLoras: Ref<Record<string, PromptLoraInput>> = ref({});

const positivePrompt = ref('');
const negativePrompt = ref('');

const samplerSeed = ref('');
const samplerSteps = ref('25');
const samplerCfg = ref('5');
const samplerName = ref('euler');
const samplerScheduler = ref('normal');
const samplerDenoise = ref('1');

const textAreaSize = {
  cols: 40,
  rows: 6,
};

const loras = computed(() => {
  const loras = Object.values(addedLoras.value);
  loras.sort((a, b) => a.position - b.position);
  return loras;
});

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

const loraNames = computed(() => {
  const loras = [...models.value.loras];
  loras.sort((a, b) => a.localeCompare(b));
  return loras;
});

const nextLoraPosition = computed(() => {
  const positions = loras.value.map((lora) => lora.position);
  return Math.max(...positions, 0) + 1;
});

function addLora() {
  const id = uuidv4();
  addedLoras.value[id] = {
    id,
    name: '',
    strengthModel: 1,
    strengthClip: 1,
    position: nextLoraPosition.value,
  };

  console.log(addedLoras.value);
}

function removeLora(id: string) {
  delete addedLoras.value[id];
}

function updateLora(lora: PromptLoraInput) {
  addedLoras.value[lora.id] = lora;
}
</script>

<style lang="scss" scoped>
.leftPane {
  width: 50%;
}
</style>
