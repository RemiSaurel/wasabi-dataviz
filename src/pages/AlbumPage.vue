<script setup lang="ts">
import { useAlbum } from "../queries/search.queries";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const artistId = ref(route.params.artist);
const albumId = ref(route.params.album);
const { data, isLoading, error } = useAlbum(artistId, albumId);
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div class="flex flex-col gap-2 items-center" v-else-if="data">
    <img
      v-if="data['albums']['cover']"
      :src="data['albums']['cover']['medium']"
    />
    <ol class="list-decimal">
      <li v-for="track in data['albums']['songs']">
        {{ track.title }}
      </li>
    </ol>
  </div>
  <div v-else-if="error">Error: {{ error }}</div>
</template>

<style scoped></style>
