<template>
  <VTextField
    class="int_form"
    v-model="rawValue"
    density="compact"
    variant="solo-filled"
    prepend-inner-icon="mdi-chevron-down"
    append-inner-icon="mdi-chevron-up"
    :hide-details="true"
    @click:append-inner="increment"
    @click:prepend-inner="decrement"
    @update:modelValue="updateValue"
  />
</template>

<script setup lang="ts">
import { nextTick, onBeforeMount, ref, toRefs, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    step?: number;
    min?: number;
    max?: number;
  }>(),
  {
    modelValue: 0,
    step: 1,

    min: -1 * Number.MAX_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
  },
);

const { modelValue, step } = toRefs(props);
watch(modelValue, (newVal) => {
  rawValue.value = `${newVal}`;
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const numValue = ref(props.modelValue);
const rawValue = ref(`${props.modelValue}`);
const prevRawValue = ref(`${props.modelValue}`);

watch(numValue, (newVal) => {
  emit('update:modelValue', newVal);
});

function increment() {
  const parsedValue = numValue.value + step.value;
  const newValue = parsedValue <= props.max ? parsedValue : props.max;
  setNewNumber(newValue);
}

function decrement() {
  const parsedValue = numValue.value - step.value;
  const newValue = parsedValue >= props.min ? parsedValue : props.min;
  setNewNumber(newValue);
}

function setNewNumber(num: number, str: string = `${num}`) {
  numValue.value = num;
  rawValue.value = `${num}`;
  prevRawValue.value = rawValue.value;
}

function updateValue(ev: string) {
  nextTick(() => {
    if (rawValue.value === '') {
      prevRawValue.value = '';
      return;
    }

    const value = Number.parseInt(rawValue.value, 10);

    // Don't feel like figuring out how to coerce this to a number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (isNaN(rawValue.value as any) || Number.isNaN(value)) {
      rawValue.value = prevRawValue.value;
      return;
    }

    if (value < props.min) {
      setNewNumber(props.min);
      return;
    }

    if (value > props.max) {
      setNewNumber(props.max);
      return;
    }

    setNewNumber(value, rawValue.value);
  });
}
</script>

<style lang="scss" scoped>
.int_form :deep(.v-field__input) {
  text-align: center;
  padding: 0;
}

.int_form :deep(.v-field--appended.v-field--prepended) {
  padding-inline-start: 0;
  padding-inline-end: 0;
}
</style>
