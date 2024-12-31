<template>
  <div class="d-flex align-center border-2 pl-2">
    <v-btn icon="mdi-minus" @click="removeLora" />

    <div class="loraContainer">
      <VSelect
        :items="loraNames"
        v-model="modelName"
        @update:modelValue="updateLora"
        density="compact"
        variant="solo"
        class="loraModelSelect mx-2"
      />

      <span class="loraStrengthModelTitle"> Strength Model </span>
      <FloatInput
        v-model="strengthModel"
        @update:modelValue="updateLora"
        class="loraStrengthModelInput"
        :min="0"
        :step="0.1"
        placeholder="Strength Model"
      />

      <span class="loraStrengthClipTitle"> Strength Clip </span>
      <FloatInput
        v-model="strengthClip"
        @update:modelValue="updateLora"
        class="loraStrengthClipInput"
        :min="0"
        :step="0.1"
        placeholder="Strength Clip"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, toRefs } from 'vue';

import type { PromptLoraInput } from './types';

import FloatInput from '@/views/components/float_input.vue';

const props = withDefaults(
  defineProps<{
    testing?: boolean;
    inputClasses?: string;
    lora: PromptLoraInput;
    loraNames: string[];
  }>(),
  {
    inputClasses: '',
    testing: false,
  },
);

const { lora, loraNames, inputClasses } = toRefs(props);

const emit = defineEmits<{
  (e: 'removeLora', id: string): void;
  (e: 'updateLora', lora: PromptLoraInput): void;
}>();

const modelName = ref('');
const strengthModel = ref(1);
const strengthClip = ref(1);

onBeforeMount(() => {
  console.log('lora rendered', lora.value.id);
  if (!props.testing) {
    beforeMountHandler();
  }
});

function beforeMountHandler() {
  modelName.value = lora.value.name
    ? lora.value.name
    : (loraNames.value[0] ?? '');

  strengthModel.value = lora.value.strengthModel;
  strengthClip.value = lora.value.strengthClip;
}

function removeLora() {
  emit('removeLora', lora.value.id);
}

function updateLora() {
  emit('updateLora', {
    id: lora.value.id,
    name: modelName.value,
    strengthModel: strengthModel.value,
    strengthClip: strengthClip.value,
    position: lora.value.position,
  });
}
</script>

<style lang="scss" scoped>
.loraContainer {
  margin: 0.25em 1em;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto;
  grid-template-areas:
    'model model'
    'modelName modelInput'
    'clipName clipInput';
}

.loraModelSelect {
  grid-area: model;
}

.loraStrengthModelTitle {
  grid-area: modelName;
}

.loraStrengthModelInput {
  grid-area: modelInput;
}

.loraStrengthClipTitle {
  grid-area: clipName;
}

.loraStrengthClipInput {
  grid-area: clipInput;
}

.loraStrengthModelTitle,
.loraStrengthClipTitle {
  margin-right: 1em;
  display: flex;
  align-items: center;
}

.loraStrengthModelInput,
.loraStrengthClipInput {
  width: 10em;
  text-align: center;
  margin-bottom: 0.5em;
}
</style>
