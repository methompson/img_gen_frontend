<template>
  <VExpansionPanels>
    <VExpansionPanel>
      <VExpansionPanelTitle> Sampler </VExpansionPanelTitle>

      <VExpansionPanelText>
        <div class="samplerContainer">
          <div class="seedLabel">Seed</div>
          <IntForm
            v-model="samplerSeed"
            @change="updateSampler"
            :inputClasses="inputClasses + ' seedInput'"
            :step="1"
            placeholder="seed"
          />

          <div class="stepsLabel">Steps</div>
          <IntForm
            v-model="samplerSteps"
            @change="updateSampler"
            :inputClasses="inputClasses + ' stepsInput'"
            :min="1"
            :step="1"
            placeholder="steps"
          />

          <div class="cfgLabel">CFG</div>
          <FloatForm
            v-model="samplerCfg"
            @change="updateSampler"
            :inputClasses="inputClasses + ' cfgInput'"
            :step="0.5"
            :min="0"
            placeholder="cfg"
          />

          <div class="samplerLabel">Sampler</div>
          <select
            v-model="samplerName"
            @change="updateSampler"
            :class="inputClasses + ' samplerInput'"
          >
            <option value="euler">euler</option>
            <option value="euler_cfg_pp">euler_cfg_pp</option>
            <option value="euler_ancestral">euler_ancestral</option>
            <option value="euler_ancestral_cfg_pp">
              euler_ancestral_cfg_pp
            </option>
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

          <div class="schedulerLabel">Scheduler</div>
          <select
            v-model="samplerScheduler"
            @change="updateSampler"
            :class="inputClasses + ' schedulerInput'"
          >
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

          <div class="denoiseLabel">Denoise</div>
          <FloatForm
            v-model="samplerDenoise"
            @change="updateSampler"
            :inputClasses="inputClasses + ' denoiseInput'"
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

import type { SamplerData } from '@img_gen/models/inputs/sampler';
import { getSeed } from '@img_gen/utils/get_seed';
import { isUndefined } from '@img_gen/utils/type_guards';

import IntForm from '@/views/components/int_form.vue';
import FloatForm from '@/views/components/float_form.vue';
import { useImgGalleryStore } from '@/stores/img_gallery_store';
import { storeToRefs } from 'pinia';

const imgGalleryStore = useImgGalleryStore();
const { promptId } = storeToRefs(imgGalleryStore);

watch(promptId, () => {
  samplerSeed.value = getSeed();
});

const props = withDefaults(
  defineProps<{
    testing?: boolean;
    samplerInput?: SamplerData;
    inputClasses: string;
  }>(),
  {
    testing: false,
  },
);

const { inputClasses, samplerInput } = toRefs(props);

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
}

.seedInput,
.stepsInput,
.cfgInput,
.samplerInput,
.schedulerInput,
.denoiseInput {
  width: 17em;
}
</style>
