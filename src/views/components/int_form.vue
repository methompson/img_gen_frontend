<template>
  <VTextField
    class="int-form"
    v-model="rawValue"
    density="compact"
    variant="outlined"
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

    min: Number.MIN_SAFE_INTEGER,
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

// const rawValue = ref('0');

const numValue = ref(0);
const rawValue = ref('0');
const prevRawValue = ref('0');

watch(numValue, (newVal) => {
  emit('update:modelValue', newVal);
});

onBeforeMount(() => {
  numValue.value = props.modelValue;
  rawValue.value = props.modelValue.toString();
  prevRawValue.value = props.modelValue.toString();
});

function increment() {
  const value = numValue.value + step.value;
  numValue.value = value <= props.max ? value : props.max;
  rawValue.value = `${numValue.value}`;
}

function decrement() {
  const value = numValue.value - step.value;
  numValue.value = value >= props.min ? value : props.min;
  rawValue.value = `${numValue.value}`;
}

function updateValue(ev: string) {
  nextTick(() => {
    // Don't feel like figuring out how to coerce this to a number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (isNaN(rawValue.value as any)) {
      rawValue.value = prevRawValue.value;
      return;
    }

    const value = parseInt(rawValue.value, 10);

    if (value < props.min) {
      numValue.value = props.min;
      rawValue.value = `${props.min}`;
      return;
    }

    if (value > props.max) {
      numValue.value = props.max;
      rawValue.value = `${props.max}`;
      return;
    }

    numValue.value = value;
    prevRawValue.value = rawValue.value;
  });
}
</script>

<style lang="scss" scoped>
.int-form :deep(.v-field__input) {
  text-align: center;
  padding: 0;
}
</style>
