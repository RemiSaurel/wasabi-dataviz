<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const formattedValue = computed(() => {
  if (!props.value) return;
  return props.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
});
</script>

<template>
  <div class="flex flex-col gap-2 border-neutral-500 border-2 p-4 rounded-lg">
    <div class="font-semibold text-2xl">{{ title }}</div>
    <div class="text-xl">{{ formattedValue }}</div>
  </div>
</template>

<style scoped></style>
