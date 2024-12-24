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
import { isNumber } from '@img_gen/utils/type_guards';
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
    step: 0.01,
    min: Number.MIN_VALUE,
    max: Number.MAX_VALUE,
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
  if (isNumber(value.value)) {
    prevValue.value = value.value;
    emit('update:modelValue', value.value);
  } else {
    value.value = prevValue.value;
  }
}
</script>
