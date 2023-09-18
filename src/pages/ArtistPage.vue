<script setup lang="ts">
import { computed, ref } from "vue";
import { useArtist } from "../queries/artist.queries";
import { useRoute } from "vue-router";
import AlbumCard from "../components/album/AlbumCard.vue";
import GenreTag from "../components/artist/GenreTag.vue";

const route = useRoute();
const artistName = ref(route.params.artist);

const { data, isLoading, error } = useArtist(artistName);
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div class="flex flex-col gap-2" v-else-if="data">
    <div class="text-3xl font-bold">{{ data.name }}</div>
    <div class="flex gap-8">
      <img class="h-60 w-60" :src="data.picture.big" />
      <div class="h-60 overflow-auto">{{ data.abstract }}</div>
    </div>
    <div class="flex items-center">
      <div class="text-xl font-bold">{{ data.deezerFans }} fans</div>
    </div>
    <div class="flex items-center gap-2">
      <a :href="data.urlSpotify" target="_blank">
        <img class="h-10 w-10" src="../../public/spotify.svg" alt=""
      /></a>
      <a :href="data.urlDeezer" target="_blank">
        <img class="h-10 w-10 mr-2" src="../../public/deezer.png" alt=""
      /></a>
      <a :href="data.urlYouTube" target="_blank">
        <img class="h-8 w-8" src="../../public/youtube.svg" alt=""
      /></a>
    </div>

    <div class="flex gap-2 flex-wrap mt-2">
      <GenreTag v-for="genre in data.genres" :genre="genre" />
    </div>

    <div class="text-xl mt-4">Albums</div>
    <div class="flex gap-x-4 gap-y-4 flex-wrap">
      <router-link
        :to="{
          name: 'Album',
          params: { album: album._id, artist: data._id },
        }"
        class="flex flex-col"
        v-for="album in data['albums']"
      >
        <AlbumCard :album="album" />
      </router-link>
    </div>
  </div>
  <div v-else-if="error">Error: {{ error }}</div>
</template>

<style scoped></style>
