<script setup lang="ts">
import { useRouter } from "vue-router";

defineProps({
  genre: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <router-link :to="{ name: 'Genre', params: { genre: genre } }">
    <div
      class="bg-neutral-700 text-white text-sm rounded-full px-4 py-2 select-none transition-all hover:bg-neutral-900"
    >
      {{ genre }}
    </div>
  </router-link>
</template>

<style scoped></style>
