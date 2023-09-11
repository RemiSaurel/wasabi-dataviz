<script setup lang="ts">
import { useGenre } from "../queries/search.queries";
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const genreName = ref(route.params.genre);
const { data, isLoading, error } = useGenre(genreName);
</script>

<template>
  <div v-if="isLoading">Loading...</div>

  <div class="flex flex-col gap-2" v-else-if="data">
    <div class="text-3xl font-bold">{{ genreName }}</div>
    <div class="flex flex-col gap-3">
      <div class="flex gap-2 flex-col" v-for="song in data">
        <div>Titre : {{ song.title }}</div>
        <div>Album : {{ song.albumTitle }}</div>
        <div>Artiste : {{ song.name }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
