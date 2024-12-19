<template>
  <div class="flex items-center border-2 pl-2">
    <BasicButton @click="removeLora()">
      <MinusIcon class="h-4 w-4" />
    </BasicButton>

    <div class="loraContainer">
      <select
        v-model="modelName"
        :class="inputClasses + ' loraModelSelect'"
        @change="updateLora"
      >
        <option v-for="loraName in loraNames" :key="`${lora.id}_${loraName}`">
          {{ loraName }}
        </option>
      </select>

      <span class="loraStrengthModelTitle"> Strength Model </span>
      <input
        v-model="strengthModel"
        @change="updateLora"
        :class="inputClasses + ' loraStrengthModelInput'"
        size="2"
        type="text"
        placeholder="Strength Model"
      />

      <span class="loraStrengthClipTitle"> Strength Clip </span>
      <input
        v-model="strengthClip"
        @change="updateLora"
        :class="inputClasses + ' loraStrengthClipInput'"
        type="text"
        placeholder="Strength Clip"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, toRefs } from 'vue';
import { MinusIcon } from '@heroicons/vue/24/solid';

import type { PromptLoraInput } from './types';

import BasicButton from '@/views/components/basic_button.vue';

const props = defineProps<{
  lora: PromptLoraInput;
  loraNames: string[];
  inputClasses: string;
}>();

const { lora, loraNames, inputClasses } = toRefs(props);

const emit = defineEmits<{
  (e: 'removeLora', id: string): void;
  (e: 'updateLora', lora: PromptLoraInput): void;
}>();

const modelName = ref('');
const strengthModel = ref('');
const strengthClip = ref('');

onBeforeMount(() => {
  modelName.value = lora.value.name
    ? lora.value.name
    : (loraNames.value[0] ?? '');

  strengthModel.value = `${lora.value.strengthModel}`;
  strengthClip.value = `${lora.value.strengthClip}`;
});

function removeLora() {
  emit('removeLora', lora.value.id);
}

function updateLora() {
  const sm = Number.parseInt(strengthModel.value, 10);
  const sc = Number.parseInt(strengthClip.value, 10);

  emit('updateLora', {
    id: lora.value.id,
    name: modelName.value,
    strengthModel: sm,
    strengthClip: sc,
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
  grid-template-areas: 'model model' 'modelName modelInput' 'clipName clipInput';
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
}

.loraStrengthModelInput,
.loraStrengthClipInput {
  width: 3em;
  text-align: center;
}
</style>
