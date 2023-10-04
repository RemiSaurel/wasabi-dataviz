<script setup lang="ts">
defineProps({
  genre: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="bg-neutral-800 text-white rounded-full px-2 py-1 select-none">
    {{ genre }}
  </div>
</template>

<style scoped></style>
