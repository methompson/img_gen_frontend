<template>
  <VTextField
    class="float_form"
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
import Decimal from 'decimal.js';
import { computed, nextTick, ref, toRefs, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    step?: number;
    min?: number;
    max?: number;
  }>(),
  {
    modelValue: 0,
    step: 0.01,
    min: -1 * Number.MAX_VALUE,
    max: Number.MAX_VALUE,
  },
);

const { modelValue, step } = toRefs(props);
watch(modelValue, (newVal) => {
  let updatedValue = newVal <= props.max ? newVal : props.max;
  updatedValue = updatedValue >= props.min ? updatedValue : props.min;

  setNewNumber(updatedValue);
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

const decimalStep = computed(() => {
  return new Decimal(step.value);
});

function increment() {
  const parsedValue = new Decimal(numValue.value)
    .add(decimalStep.value)
    .toNumber();
  const newValue = parsedValue <= props.max ? parsedValue : props.max;
  setNewNumber(newValue);
}

function decrement() {
  const parsedValue = new Decimal(numValue.value)
    .sub(decimalStep.value)
    .toNumber();
  const newValue = parsedValue >= props.min ? parsedValue : props.min;
  setNewNumber(newValue);
}

function setNewNumber(num: number, str: string = `${num}`) {
  numValue.value = num;
  rawValue.value = str;
  prevRawValue.value = str;
}

function updateValue() {
  nextTick(() => {
    if (rawValue.value === '') {
      prevRawValue.value = '';
      return;
    }

    const value = Number.parseFloat(rawValue.value);

    // Don't feel like figuring out how to coerce this to a number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (isNaN(rawValue.value as any)) {
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
.float_form :deep(.v-field__input) {
  text-align: center;
  padding: 0;
}

.float_form :deep(.v-field--appended.v-field--prepended) {
  padding-inline-start: 0;
  padding-inline-end: 0;
}
</style>
