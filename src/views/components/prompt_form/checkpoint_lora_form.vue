<template>
  <VExpansionPanels>
    <VExpansionPanel :class="expansionClasses">
      <VExpansionPanelTitle> Checkpoint & Loras </VExpansionPanelTitle>

      <VExpansionPanelText>
        <div>Checkpoint</div>

        <VSelect
          v-model="checkpoint"
          @update:modelValue="updateModelInput"
          :items="checkpointModels"
          variant="solo"
          class="mx-2"
        />

        <div>LORAs</div>

        <v-btn @click="addLora" icon="mdi-plus" />

        <template v-for="lora in loras" :key="lora.id">
          <LoraInput
            :loraNames="loraNames"
            :lora="lora"
            :inputClasses="inputClasses"
            @removeLora="removeLora"
            @updateLora="updateLora"
          />
        </template>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch, type ComputedRef, type Ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import LoraInput from '@/views/components/prompt_form/lora_form.vue';

import type { GetModelsOutput } from '@/api/models';
import type {
  LoraModel,
  PromptModels,
} from '@img_gen/models/inputs/prompt_models';
import type { PromptLoraInput } from './types';
import { isUndefined } from '@img_gen/utils/type_guards';
import { arrayToObject } from '@img_gen/utils/array_to_obj';

const props = withDefaults(
  defineProps<{
    models: GetModelsOutput;
    inputClasses?: string;
    modelInput?: PromptModels;
  }>(),
  {
    inputClasses: '',
  },
);

const { modelInput, models } = toRefs(props);
watch(modelInput, (newVal) => {
  if (isUndefined(newVal)) {
    prevModelInput.value = undefined;
    return;
  }

  if (checkpoint.value !== newVal.checkpointName) {
    checkpoint.value = newVal.checkpointName;
  }

  if (
    JSON.stringify(prevModelInput.value?.loras) !== JSON.stringify(newVal.loras)
  ) {
    let i = 1;
    addedLoras.value = arrayToObject(
      newVal.loras.map((lora) => ({
        id: uuidv4(),
        name: lora.name,
        strengthModel: lora.strengthModel,
        strengthClip: lora.strengthClip,
        position: i++,
      })),
      (l) => l.id,
    );
  }

  prevModelInput.value = newVal;
});

const emit = defineEmits<{
  (e: 'updateModelInput', input: PromptModels | undefined): void;
}>();

const checkpointModels = computed(() => {
  return [...models.value.models];
});

const addedLoras: Ref<Record<string, PromptLoraInput>> = ref({});
const checkpoint = ref('');
const prevModelInput = ref<PromptModels | undefined>(undefined);

const computedModelInput: ComputedRef<PromptModels | undefined> = computed(
  () => {
    if (checkpoint.value.length === 0) {
      return undefined;
    }

    const loras: LoraModel[] = Object.values(addedLoras.value).map((lora) => ({
      name: lora.name,
      strengthModel: lora.strengthModel,
      strengthClip: lora.strengthClip,
    }));

    return {
      checkpointName: checkpoint.value,
      loras,
    };
  },
);

const loraNames = computed(() => {
  const loras = [...models.value.loras];
  loras.sort((a, b) => a.localeCompare(b));
  return loras;
});

const loras = computed(() => {
  const loraVals = Object.values(addedLoras.value);
  loraVals.sort((a, b) => a.position - b.position);
  return loraVals;
});

const nextLoraPosition = computed(() => {
  const positions = loras.value.map((lora) => lora.position);
  return Math.max(...positions, 0) + 1;
});

const expansionClasses = computed(() => {
  const classes = [];
  if (!modelInput.value) {
    classes.push('errorCard');
  }

  return classes.join(' ');
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

  updateModelInput();
}

function removeLora(id: string, update: boolean = true) {
  delete addedLoras.value[id];
  updateModelInput();
}

function updateLora(lora: PromptLoraInput, update: boolean = true) {
  addedLoras.value[lora.id] = lora;
  updateModelInput();
}

function updateModelInput() {
  prevModelInput.value = computedModelInput.value;
  emit('updateModelInput', computedModelInput.value);
}
</script>
