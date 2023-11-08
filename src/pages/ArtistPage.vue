<script setup lang="ts">
import { ref } from "vue";
import { useArtist } from "../queries/artist.queries";
import { useRoute } from "vue-router";
import AlbumCard from "../components/album/AlbumCard.vue";
import GenreTag from "../components/artist/GenreTag.vue";

const route = useRoute();
const artistName = ref(encodeURIComponent(route.params.artist as string));

const { data: artistInfo, isLoading, error } = useArtist(artistName);
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

  <div class="flex flex-col gap-2" v-else-if="artistInfo">
    <div class="text-3xl font-bold">{{ artistInfo.name }}</div>
    <div class="flex gap-8">
      <img class="h-60 w-60 rounded-xl" :src="artistInfo.picture.big" />
      <div class="flex-col gap-2">
        <div class="h-60 overflow-auto">
          {{ artistInfo.abstract }}
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <div class="text-xl font-bold">{{ artistInfo.deezerFans }} fans</div>
    </div>
    <div class="flex items-center gap-2">
      <a :href="artistInfo.urlSpotify" target="_blank">
        <img class="h-10 w-10" src="/spotify.svg" alt=""
      /></a>
      <a :href="artistInfo.urlDeezer" target="_blank">
        <img class="h-10 w-10 mr-2" src="/deezer.png" alt=""
      /></a>
      <a :href="artistInfo.urlYouTube" target="_blank">
        <img class="h-8 w-8" src="/youtube.svg" alt=""
      /></a>
    </div>

    <div class="flex gap-2 flex-wrap mt-2">
      <GenreTag v-for="genre in artistInfo.genres" :genre="genre" />
    </div>

    <div class="text-xl font-semibold mt-4">Albums</div>
    <div class="flex gap-x-4 gap-y-4 flex-wrap">
      <router-link
        :to="{
          name: 'Album',
          params: { album: album._id, artist: artistInfo._id },
        }"
        class="flex flex-col"
        v-for="album in artistInfo['albums']"
      >
        <AlbumCard :album="album" />
      </router-link>
    </div>
  </div>
  <div v-else-if="error">Error: {{ error }}</div>
</template>

<style scoped></style>
