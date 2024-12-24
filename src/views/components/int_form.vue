<template>
  <input
    v-model="value"
    @input="updateValue"
    :class="inputClasses"
    type="number"
    :step="step"
    :min="min"
    :max="max"
  />
</template>

<script setup lang="ts">
import { onBeforeMount, ref, toRefs, watch } from 'vue';

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    inputClasses?: string;
    step?: number;
    min?: number;
    max?: number;
    placeholder?: string;
  }>(),
  {
    step: 1,
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    modelValue: 0,
    inputClasses: '',
    placeholder: '',
  },
);

const { modelValue } = toRefs(props);

watch(modelValue, (newVal) => {
  value.value = newVal;
  updateValue();
});

const value = ref(0);
const prevValue = ref(0);

onBeforeMount(() => {
  value.value = props.modelValue;
  prevValue.value = props.modelValue;
});

function updateValue() {
  if (Number.isInteger(value.value)) {
    prevValue.value = value.value;
    emit('update:modelValue', value.value);
  } else {
    value.value = prevValue.value;
  }
}
</script>
