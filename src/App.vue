<script setup lang="ts">
import { Ref, ref } from "vue";
import { ALL_SONG_STEP, useSongList } from "./queries/song.queries.ts";

const start: Ref<number> = ref(0);
const id: Ref<string> = ref("");

const { data: songList, isLoading: listLoading } = useSongList(start);

const seeSongDetails = (id_song: string) => {
  id.value = id_song;
  console.log(id.value);
};

const updateStart = (newStart: number) => {
  if (newStart < 0) {
    start.value = 0;
  } else {
    start.value = newStart;
  }
};
</script>

<template>
  <div>
    <button @click="updateStart(start - ALL_SONG_STEP)">Previous</button>
    start = {{ start }}
    <button @click="updateStart(start + ALL_SONG_STEP)">Next</button>
    <div v-if="listLoading">Loading...</div>
    <div v-else-if="songList">
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
          <tr class="bg-white border-b" v-for="song in songList" :key="song.id">
            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
              {{ song._id }}
            </td>
            <td class="px-6 py-4">{{ song.title }}</td>
            <td class="px-6 py-4">{{ song.albumTitle }}</td>
            <td class="px-6 py-4">{{ song.id_album }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
