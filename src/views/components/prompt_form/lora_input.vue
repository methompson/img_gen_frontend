<template>
  <div class="d-flex align-center border-2 pl-2">
    <v-btn icon="mdi-minus" @click="removeLora" />

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
        type="number"
        placeholder="Strength Model"
      />

      <span class="loraStrengthClipTitle"> Strength Clip </span>
      <input
        v-model="strengthClip"
        @change="updateLora"
        :class="inputClasses + ' loraStrengthClipInput'"
        type="number"
        placeholder="Strength Clip"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, toRefs } from 'vue';

import type { PromptLoraInput } from './types';

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
