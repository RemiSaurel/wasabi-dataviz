<script setup lang="ts">
defineProps({
  isLoading: Boolean,
});
</script>

<template>
  <div
    v-if="isLoading"
    class="flex flex-col h-full m-auto justify-center items-center gap-8"
  >
    <div
      class="animate-spin rounded-full h-16 w-16 border-b-2 border-neutral-900"
    ></div>
    <span class="text-2xl font-bold">Chargement...</span>
  </div>
</template>

<style scoped></style>
