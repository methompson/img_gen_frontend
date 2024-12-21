<template>
  <h1 class="text-lg font-bold">Checkpoint & Loras</h1>

  <div>Checkpoint</div>

  <select
    v-model="checkpoint"
    @change="updateModelInput"
    :class="inputClasses + ' w-full'"
  >
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
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch, type ComputedRef, type Ref } from 'vue';
import { PlusIcon } from '@heroicons/vue/24/solid';
import { v4 as uuidv4 } from 'uuid';

import BasicButton from '@/views/components/basic_button.vue';
import LoraInput from '@/views/components/prompt_form/lora_input.vue';

import type { GetModelsOutput } from '@/api/models';
import type {
  LoraModel,
  PromptModels,
} from '@img_gen/models/inputs/prompt_models';
import type { PromptLoraInput } from './types';
import { isUndefined } from '@img_gen/utils/type_guards';
import { arrayToObject } from '@img_gen/utils/array_to_obj';

const props = defineProps<{
  models: GetModelsOutput;
  inputClasses: string;
  modelInput?: PromptModels;
}>();

const { modelInput, models } = toRefs(props);
watch(modelInput, (newVal) => {
  if (isUndefined(newVal)) {
    return;
  }

  if (checkpoint.value !== newVal.checkpointName) {
    checkpoint.value = newVal.checkpointName;
  }

  if (JSON.stringify(addedLoras.value) === JSON.stringify(newVal.loras)) {
    return;
  }

  // TODO - Check what or if things changed?
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
});

const emit = defineEmits<{
  (e: 'updateModelInput', input: PromptModels | undefined): void;
}>();

const addedLoras: Ref<Record<string, PromptLoraInput>> = ref({});
const checkpoint = ref('');

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
  const loras = Object.values(addedLoras.value);
  loras.sort((a, b) => a.position - b.position);
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
  emit('updateModelInput', computedModelInput.value);
}
</script>
