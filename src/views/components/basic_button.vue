<script setup lang="ts">
import { computed, toRefs } from 'vue';

const props = defineProps<{
  class?: string;
  disabled?: boolean;
  onClick?: (ev: MouseEvent) => void;
}>();

const propClasses = toRefs(props).class;

const buttonClasses = computed(() => {
  const pc = propClasses.value ? propClasses.value.split(' ') : [];
  const classes = [
    'basicButton',
    'bg-cyan-500',
    'hover:bg-cyan-600',
    'active:bg-cyan-700',
    'text-white',
    'p-2',
    'rounded-md',
    'disabled:text-gray-400',
    'disabled:bg-gray-200',
    ...pc,
  ];
  return classes.join(' ');
});
</script>

<template>
  <button :class="buttonClasses" :disabled="props.disabled" @click="props.onClick">
    <slot />
  </button>
</template>
