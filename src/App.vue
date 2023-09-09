<script setup lang="ts">
import {ref} from "vue";
import {useSongList} from "./queries/song.queries.ts";

const start = ref(0);

const {data, error, isLoading} = useSongList(start);

const loadMore = () => {
  start.value += 200;
};

</script>

<template>
  <div>
    <button @click="loadMore">Load more</button>
    <br>
    start = {{ start }}
    <div v-if="isLoading">Loading...</div>
    <div v-if="error">Error: {{ error }}</div>
    <div v-if="data">
      <table class="w-full text-sm text-left text-gray-700">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3">Id</th>
          <th scope="col" class="px-6 py-3">Title</th>
          <th scope="col" class="px-6 py-3">Album</th>
        </tr>
        </thead>
        <tbody>
        <tr class="bg-white border-b" v-for="song in data" :key="song.id">
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ song._id }}</td>
          <td class="px-6 py-4">{{ song.title }}</td>
          <td class="px-6 py-4">{{ song.albumTitle }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
</style>
