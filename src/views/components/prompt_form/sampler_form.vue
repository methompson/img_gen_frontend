<template>
  <VExpansionPanels>
    <VExpansionPanel>
      <VExpansionPanelTitle class="formExpansionTitle">
        Sampler
      </VExpansionPanelTitle>

      <VExpansionPanelText>
        <div class="samplerContainer">
          <div class="seedLabel">Seed</div>
          <IntInput
            v-model="samplerSeed"
            @update:model-value="updateSampler"
            class="seedInput"
            :step="1"
            placeholder="seed"
          />

          <div class="stepsLabel">Steps</div>
          <IntInput
            v-model="samplerSteps"
            @change="updateSampler"
            class="stepsInput"
            :min="1"
            :step="1"
            placeholder="steps"
          />

          <div class="cfgLabel">CFG</div>
          <FloatInput
            v-model="samplerCfg"
            @change="updateSampler"
            class="cfgInput"
            :step="0.5"
            :min="0"
            placeholder="cfg"
          />

          <div class="samplerLabel">Sampler</div>
          <VSelect
            :items="samplerOptions"
            v-model="samplerName"
            @update:model-value="updateSampler"
            variant="solo-filled"
            density="compact"
            class="samplerInput"
            :hide-details="true"
          />

          <div class="schedulerLabel">Scheduler</div>
          <VSelect
            :items="samplerSchedulerOptions"
            v-model="samplerScheduler"
            @update:model-value="updateSampler"
            variant="solo-filled"
            density="compact"
            class="schedulerInput"
            :hide-details="true"
          />

          <div class="denoiseLabel">Denoise</div>
          <FloatInput
            v-model="samplerDenoise"
            @change="updateSampler"
            class="denoiseInput"
            :step="0.01"
            :min="0"
            placeholder="denoise"
          />
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, toRefs, watch } from 'vue';
import { storeToRefs } from 'pinia';

import type { SamplerData } from '@img_gen/models/inputs/sampler';
import { getSeed } from '@img_gen/utils/get_seed';
import { isUndefined } from '@img_gen/utils/type_guards';

import IntInput from '@/views/components/int_input.vue';
import FloatInput from '@/views/components/float_input.vue';

import { useImgGalleryStore } from '@/stores/img_gallery_store';

const samplerOptions = [
  'euler',
  'euler_cfg_pp',
  'euler_ancestral',
  'euler_ancestral_cfg_pp',
  'heun',
  'heunpp2',
  'dpm_2',
  'dpm_2_ancestral',
  'dpm_fast',
  'dpm_adaptive',
  'dpmpp_2s_ancestral',
  'dpmpp_2s_ancestral_cfg_pp',
  'dpmpp_sde',
  'dpmpp_sde_gpu',
  'dpmpp_2m',
  'dpmpp_2m_cfg_pp',
  'dpmpp_2m_sde',
  'dpmpp_2m_sde_gpu',
  'dpmpp_3m_sde',
  'dpmpp_3m_sde_gpu',
  'ddpm',
  'lcm',
  'ipndm',
  'ipndm_v',
  'deis',
  'ddim',
  'uni_pc',
  'uni_pc_bh2',
];

const samplerSchedulerOptions = [
  'normal',
  'karras',
  'exponential',
  'sgm_uniform',
  'simple',
  'ddim_uniform',
  'beta',
  'linear_quadratic',
  'AYS SDXL',
  'AYS SD1',
  'AYS SVD',
  'GITS[coeff=1.2]',
];

const imgGalleryStore = useImgGalleryStore();
const { promptId } = storeToRefs(imgGalleryStore);

watch(promptId, () => {
  samplerSeed.value = getSeed();
  updateSampler();
});

const props = withDefaults(
  defineProps<{
    testing?: boolean;
    samplerInput?: SamplerData;
  }>(),
  {
    testing: false,
  },
);

const { samplerInput } = toRefs(props);

watch(samplerInput, (newVal) => {
  if (isUndefined(newVal)) {
    return;
  }

  samplerSeed.value = newVal.seed;
  samplerSteps.value = newVal.steps;
  samplerCfg.value = newVal.cfg;
  samplerName.value = newVal.samplerName;
  samplerScheduler.value = newVal.scheduler;
  samplerDenoise.value = newVal.denoise;
});

const emit = defineEmits<{
  (e: 'updateSampler', value: SamplerData): void;
}>();

const samplerSeed = ref(1);
const samplerSteps = ref(25);
const samplerCfg = ref(5);
const samplerName = ref('euler');
const samplerScheduler = ref('normal');
const samplerDenoise = ref(1);

watch(samplerSeed, () => {
  console.log('samplerSeed', samplerSeed.value);
});

onBeforeMount(() => {
  if (!props.testing) {
    beforeMountHandler();
  }
});

function beforeMountHandler() {
  const si = props.samplerInput;
  if (si) {
    samplerSeed.value = si.seed;
    samplerSteps.value = si.steps;
    samplerCfg.value = si.cfg;
    samplerName.value = si.samplerName;
    samplerScheduler.value = si.scheduler;
    samplerDenoise.value = si.denoise;
  } else {
    samplerSeed.value = getSeed();
  }
}

function updateSampler() {
  emit('updateSampler', {
    seed: samplerSeed.value,
    steps: samplerSteps.value,
    cfg: samplerCfg.value,
    samplerName: samplerName.value,
    scheduler: samplerScheduler.value,
    denoise: samplerDenoise.value,
  });
}
</script>

<style lang="scss" scoped>
.samplerContainer {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'seedLabel seedInput'
    'stepsLabel stepsInput'
    'cfgLabel cfgInput'
    'samplerLabel samplerInput'
    'schedulerLabel schedulerInput'
    'denoiseLabel denoiseInput';
}

.seedLabel {
  grid-area: seedLabel;
}
.seedInput {
  grid-area: seedInput;
}
.stepsLabel {
  grid-area: stepsLabel;
}
.stepsInput {
  grid-area: stepsInput;
}
.cfgLabel {
  grid-area: cfgLabel;
}
.cfgInput {
  grid-area: cfgInput;
}
.samplerLabel {
  grid-area: samplerLabel;
}
.samplerInput {
  grid-area: samplerInput;
}
.schedulerLabel {
  grid-area: schedulerLabel;
}
.schedulerInput {
  grid-area: schedulerInput;
}
.denoiseLabel {
  grid-area: denoiseLabel;
}
.denoiseInput {
  grid-area: denoiseInput;
}

.seedLabel,
.stepsLabel,
.cfgLabel,
.samplerLabel,
.schedulerLabel,
.denoiseLabel {
  margin-right: 1em;
  display: flex;
  align-items: center;
}

.seedInput,
.stepsInput,
.cfgInput,
.samplerInput,
.schedulerInput,
.denoiseInput {
  width: 17em;
  margin-bottom: 0.5em;
}
</style>
