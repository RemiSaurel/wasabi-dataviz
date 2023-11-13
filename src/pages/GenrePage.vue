<script setup lang="ts">
import { useGenre } from "../queries/search.queries";
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const genreName = ref(route.params.genre);
const { data, isLoading } = useGenre(genreName);
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
  <div class="flex flex-col gap-2" v-else-if="data">
    <div class="text-3xl font-bold">{{ genreName }}</div>

    <div v-if="data.length === 0">Aucune donnée pour ce genre 😔</div>

    <div v-else>
      <table class="w-full text-sm text-left text-gray-700 mt-4">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3">Titre</th>
            <th scope="col" class="px-6 py-3">Album</th>
            <th scope="col" class="px-6 py-3">Artiste</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="bg-white border-b"
            v-for="(song, rowIndex) in data"
            :key="rowIndex"
          >
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {{ song["title"] }}
            </td>
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {{ song["albumTitle"] }}
            </td>
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {{ song["name"] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
