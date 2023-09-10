<script setup lang="ts">
import { Ref, ref } from "vue";
import { ALL_SONG_STEP, useSongList } from "../queries/song.queries";
import Datatable from "../components/Datatable.vue";

const start: Ref<number> = ref(0);

const { data: songList, isLoading: listLoading } = useSongList(start);

const updateStart = (newStart: number) => {
  if (newStart < 0) {
    start.value = 0;
  } else {
    start.value = newStart;
  }
};

const columns = ref({
  _id: "ID",
  title: "Title",
  name: "Artist",
  albumTitle: "Album",
  id_album: "Album ID",
});
</script>

<template>
  <button @click="updateStart(start - ALL_SONG_STEP)">Previous</button>
  start = {{ start }}
  <button @click="updateStart(start + ALL_SONG_STEP)">Next</button>
  <div v-if="listLoading">Loading...</div>
  <div v-else-if="songList">
    <Datatable :columns="columns" :data="songList" />
  </div>
</template>

<style scoped></style>
