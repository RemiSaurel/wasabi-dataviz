<script setup lang="ts">
import { useAlbum } from "../queries/search.queries";
import { computed, ref, watch, onMounted, Ref } from "vue";
import { useRoute } from "vue-router";
import { songs } from "../queries/song.queries";

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
  <div v-if="isLoading">Loading...</div>
  <div class="flex flex-col gap-2" v-else-if="data">
    <div class="flex gap-4">
      <img
        class="h-36 w-36"
        v-if="data['albums']['cover']"
        :src="data['albums']['cover']['big']"
      />
      <div class="flex flex-col justify-between">
        <span class="text-5xl font-bold w-80">{{
          data["albums"]["title"]
        }}</span>
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
