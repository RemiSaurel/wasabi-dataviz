<script setup lang="ts">
import { useAlbum } from "../queries/search.queries";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import LoadingSpinner from "../components/LoadingSpinner.vue";

const route = useRoute();
const artistId = ref(route.params.artist);
const albumId = ref(route.params.album);
const { data, isLoading, error } = useAlbum(artistId, albumId);

const nbSongs = computed(() => {
  if (data.value) {
    return data.value["albums"]["songs"].length;
  }
});

const artistName = computed(() => {
  if (data.value) {
    return data.value["albums"]["name"];
  }
});

const duration = computed(() => {
  if (data.value) {
    if (!data.value["albums"]["length"]) {
      return "";
    }
    const duration = data.value["albums"]["length"];
    const minutes = duration.split(":")[0];
    const seconds = duration.split(":")[1];
    return `| ${minutes} min ${seconds} s`;
  }
});
</script>

<template>
  <LoadingSpinner v-if="isLoading" :isLoading="isLoading" />

  <div class="flex flex-col gap-2" v-else-if="data">
    <div class="flex gap-4">
      <img
        class="h-44 w-44"
        v-if="data['albums']['cover']"
        :src="data['albums']['cover']['big']"
      />
      <div class="flex flex-col justify-between">
        <!-- ALBUM NAME -->
        <span class="text-5xl font-bold w-96">{{
          data["albums"]["title"]
        }}</span>

        <!-- BOTTOM CONTAINER -->
        <div>
          <div class="flex items-end hover:cursor-pointer">
            <a
              v-if="data['albums']['urlSpotify']"
              :href="data['albums']['urlSpotify']"
              target="_blank"
            >
              <img class="h-10 w-10" src="/spotify.svg" alt=""
            /></a>
            <a
              v-if="data['albums']['urlDeezer']"
              :href="data['albums']['urlDeezer']"
              target="_blank"
            >
              <img class="h-10 w-10 mr-2" src="/deezer.png" alt=""
            /></a>
            <a
              v-if="data['albums']['urlYoutube']"
              :href="data['albums']['urlYoutube']"
              target="_blank"
            >
              <img class="h-8 w-8" src="/youtube.svg" alt=""
            /></a>
          </div>
          <div class="text-md text-gray-900">
            <router-link
              class="font-bold hover:underline"
              :to="{ name: 'Artist', params: { artist: artistName } }"
            >
              {{ artistName }}
            </router-link>
            |
            {{ data["albums"]["publicationDate"] }} | {{ nbSongs }} titres
            <span class="text-gray-500">{{ duration }}</span>
          </div>
        </div>
      </div>
    </div>

    <table class="w-full text-sm text-left text-gray-700 mt-4">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">Titre</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="bg-white border-b"
          v-for="(row, rowIndex) in data['albums']['songs']"
          :key="rowIndex"
        >
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {{ row["title"] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else-if="error">Error: {{ error }}</div>
</template>

<style scoped></style>
