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
    <div class="bg-neutral-800 text-white rounded-full px-4 py-2 select-none">
      {{ genre }}
    </div>
  </router-link>
</template>

<style scoped></style>
