<script setup lang="ts">
import {Ref, ref} from "vue";
import {useSongList} from "./queries/song.queries.ts";

const start: Ref<number> = ref(0);
const {data, error, isLoading} = useSongList(start);
const updateStart = (newStart: number) => {
  if (newStart < 0) {
    start.value = 0;
  } else {
    start.value = newStart;
  }
}
</script>

<template>
  <div>
    <button @click="updateStart(start - 200)">Previous</button>
    start = {{ start }}
    <button @click="updateStart(start + 200)">Next</button>
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">Error: {{ error }}</div>
    <div v-if="data">
      <table class="w-full text-sm text-left text-gray-700 mt-4">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">Id</th>
          <th scope="col" class="px-6 py-3">Title</th>
          <th scope="col" class="px-6 py-3">Album</th>
          <th scope="col" class="px-6 py-3">Album ID</th>
        </tr>
        </thead>
        <tbody>
        <tr class="bg-white border-b" v-for="song in data" :key="song.id">
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ song._id }}</td>
          <td class="px-6 py-4">{{ song.title }}</td>
          <td class="px-6 py-4">{{ song.albumTitle }}</td>
          <td class="px-6 py-4">{{ song.id_album }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
</style>
